#!/usr/bin/env python3
"""
Threatpedia — Gemini Code Assist Review Handler
================================================

Shared utility for all Threatpedia bot tasks to check, fix, and reply to
Gemini Code Assist review comments on GitHub PRs.

Usage from any task:
    from gemini_review import GeminiReviewHandler

    handler = GeminiReviewHandler(token_path="~/Documents/Coding/Threatpedia/.envbot")

    # Pre-check: scan all open PRs for unresolved Gemini comments
    issues = handler.precheck_all_open_prs()

    # Post-check: monitor a specific PR after creation
    issues = handler.postcheck_pr(pr_number=26, wait_minutes=10)

    # Reply to a comment after fixing it
    handler.reply_to_comment(pr_number=26, comment_id=12345,
                             fix_description="Fixed currency parsing",
                             commit_hash="abc1234")

SECURITY: Token is always read from file, never inlined in commands or logs.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional

logger = logging.getLogger("threatpedia.gemini_review")

try:
    from github import Auth, Github
    from github.PullRequest import PullRequest
    from github.PullRequestComment import PullRequestComment
    from github.IssueComment import IssueComment
except ImportError:
    logger.warning("PyGithub not installed — Gemini review handling disabled")
    Auth = None  # type: ignore
    Github = None  # type: ignore


REPO_FULL_NAME = "MahdiHedhli/threatpedia"

# Severity keywords in Gemini comment body
SEVERITY_MARKERS = {
    "critical": "critical",
    "high-priority": "high",
    "medium-priority": "medium",
    "low-priority": "low",
}


@dataclass
class GeminiComment:
    """Represents a single Gemini Code Assist review comment."""
    pr_number: int
    pr_title: str
    comment_id: int
    comment_type: str  # "review" or "issue"
    body: str
    severity: str  # "critical", "high", "medium", "low", "unknown"
    file_path: Optional[str] = None
    line: Optional[int] = None
    suggestion: Optional[str] = None
    replied: bool = False


@dataclass
class GeminiCheckResult:
    """Results from a Gemini review check."""
    total_comments: int = 0
    critical: list[GeminiComment] = field(default_factory=list)
    high: list[GeminiComment] = field(default_factory=list)
    medium: list[GeminiComment] = field(default_factory=list)
    low: list[GeminiComment] = field(default_factory=list)
    unknown: list[GeminiComment] = field(default_factory=list)

    @property
    def actionable(self) -> list[GeminiComment]:
        """Comments that should be fixed (critical + high)."""
        return self.critical + self.high

    @property
    def all_comments(self) -> list[GeminiComment]:
        """All comments across all severities."""
        return self.critical + self.high + self.medium + self.low + self.unknown

    def summary(self) -> str:
        parts = []
        if self.critical:
            parts.append(f"{len(self.critical)} critical")
        if self.high:
            parts.append(f"{len(self.high)} high")
        if self.medium:
            parts.append(f"{len(self.medium)} medium")
        if self.low:
            parts.append(f"{len(self.low)} low")
        if self.unknown:
            parts.append(f"{len(self.unknown)} unknown")
        return f"{self.total_comments} Gemini comments: " + ", ".join(parts) if parts else "No Gemini comments found"


def _detect_severity(body: str) -> str:
    """Detect severity from Gemini's comment body (uses badge image URLs)."""
    body_lower = body.lower()
    for marker, severity in SEVERITY_MARKERS.items():
        if marker in body_lower:
            return severity
    return "unknown"


def _extract_suggestion(body: str) -> Optional[str]:
    """Extract code suggestion block from Gemini comment if present."""
    if "```suggestion" in body:
        start = body.index("```suggestion")
        # Find closing ```
        rest = body[start + len("```suggestion"):]
        end = rest.find("```")
        if end != -1:
            return rest[:end].strip()
    return None


class GeminiReviewHandler:
    """Handler for Gemini Code Assist review comments on GitHub PRs.

    Args:
        token_path: Path to file containing the GitHub bot token.
                    Token is read into memory, never exposed in logs or commands.
        repo_name: Full repository name (owner/repo).
    """

    def __init__(
        self,
        token_path: str = "~/Documents/Coding/Threatpedia/.envbot",
        repo_name: str = REPO_FULL_NAME,
    ) -> None:
        if Github is None:
            raise RuntimeError("PyGithub is required: pip install PyGithub")

        # Read token securely from file
        resolved_path = Path(token_path).expanduser()
        if not resolved_path.exists():
            # Try alternative paths
            alt_paths = [
                Path("/sessions/youthful-busy-thompson/mnt/Threatpedia/.envbot"),
            ]
            for alt in alt_paths:
                if alt.exists():
                    resolved_path = alt
                    break
            else:
                raise FileNotFoundError(
                    f"Bot token file not found at {token_path} or alternative paths"
                )

        token = resolved_path.read_text().strip()
        self._github = Github(auth=Auth.Token(token))
        self._repo = self._github.get_repo(repo_name)
        logger.info("GeminiReviewHandler initialized for %s", repo_name)

    def close(self) -> None:
        """Close the GitHub connection."""
        self._github.close()

    def __enter__(self) -> "GeminiReviewHandler":
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()

    # ----------------------------------------------------------------
    # Scanning
    # ----------------------------------------------------------------

    def scan_pr(self, pr_number: int) -> GeminiCheckResult:
        """Scan a specific PR for Gemini Code Assist comments.

        Args:
            pr_number: The PR number to scan.

        Returns:
            GeminiCheckResult with categorized comments.
        """
        pr = self._repo.get_pull(pr_number)
        result = GeminiCheckResult()

        # Check review comments (inline code comments)
        for comment in pr.get_review_comments():
            if not comment.user or "gemini" not in comment.user.login.lower():
                continue
            gc = GeminiComment(
                pr_number=pr_number,
                pr_title=pr.title,
                comment_id=comment.id,
                comment_type="review",
                body=comment.body,
                severity=_detect_severity(comment.body),
                file_path=getattr(comment, "path", None),
                line=getattr(comment, "line", None),
                suggestion=_extract_suggestion(comment.body),
            )
            result.total_comments += 1
            getattr(result, gc.severity, result.unknown).append(gc)

        # Check issue comments (PR-level comments)
        for comment in pr.get_issue_comments():
            if not comment.user or "gemini" not in comment.user.login.lower():
                continue
            gc = GeminiComment(
                pr_number=pr_number,
                pr_title=pr.title,
                comment_id=comment.id,
                comment_type="issue",
                body=comment.body,
                severity=_detect_severity(comment.body),
                suggestion=_extract_suggestion(comment.body),
            )
            result.total_comments += 1
            getattr(result, gc.severity, result.unknown).append(gc)

        return result

    def precheck_all_open_prs(self) -> dict[int, GeminiCheckResult]:
        """Scan all open PRs for Gemini comments.

        Returns:
            Dict mapping PR number → GeminiCheckResult.
        """
        results: dict[int, GeminiCheckResult] = {}
        open_prs = list(self._repo.get_pulls(state="open"))
        logger.info("Scanning %d open PRs for Gemini comments...", len(open_prs))

        for pr in open_prs:
            result = self.scan_pr(pr.number)
            if result.total_comments > 0:
                results[pr.number] = result
                logger.info(
                    "  PR #%d (%s): %s",
                    pr.number,
                    pr.title,
                    result.summary(),
                )

        total = sum(r.total_comments for r in results.values())
        logger.info("Pre-check complete: %d Gemini comments across %d PRs", total, len(results))
        return results

    # ----------------------------------------------------------------
    # Replying / Resolving
    # ----------------------------------------------------------------

    def reply_to_comment(
        self,
        pr_number: int,
        comment_id: int,
        fix_description: str,
        commit_hash: str,
        comment_type: str = "review",
    ) -> None:
        """Reply to a Gemini comment with fix details and acknowledge it.

        Args:
            pr_number: PR number containing the comment.
            comment_id: The comment ID to reply to.
            fix_description: Brief description of the fix applied.
            commit_hash: Short commit hash of the fix.
            comment_type: "review" for inline code comments, "issue" for PR-level.
        """
        reply_text = f"Fixed in {commit_hash} — {fix_description}"

        pr = self._repo.get_pull(pr_number)

        if comment_type == "review":
            # Reply to inline review comment
            try:
                pr.create_review_comment_reply(comment_id, reply_text)
                logger.info("Replied to review comment #%d on PR #%d", comment_id, pr_number)
            except Exception as exc:
                logger.warning("Failed to reply to review comment #%d: %s", comment_id, exc)

            # Add acknowledgment reaction
            try:
                for comment in pr.get_review_comments():
                    if comment.id == comment_id:
                        comment.create_reaction("eyes")
                        break
            except Exception as exc:
                logger.debug("Could not add reaction to comment #%d: %s", comment_id, exc)

        elif comment_type == "issue":
            # Reply to PR-level comment
            try:
                pr.as_issue().create_comment(
                    f"Re: Gemini comment #{comment_id} — {reply_text}"
                )
                logger.info("Replied to issue comment #%d on PR #%d", comment_id, pr_number)
            except Exception as exc:
                logger.warning("Failed to reply to issue comment #%d: %s", comment_id, exc)

    def reply_to_all(
        self,
        comments: list[GeminiComment],
        fix_description: str,
        commit_hash: str,
    ) -> int:
        """Reply to multiple Gemini comments with the same fix description.

        Args:
            comments: List of GeminiComment objects to reply to.
            fix_description: Brief description of the fix applied.
            commit_hash: Short commit hash of the fix.

        Returns:
            Number of successfully replied comments.
        """
        replied = 0
        for gc in comments:
            try:
                self.reply_to_comment(
                    pr_number=gc.pr_number,
                    comment_id=gc.comment_id,
                    fix_description=fix_description,
                    commit_hash=commit_hash,
                    comment_type=gc.comment_type,
                )
                gc.replied = True
                replied += 1
            except Exception as exc:
                logger.warning(
                    "Failed to reply to comment #%d on PR #%d: %s",
                    gc.comment_id,
                    gc.pr_number,
                    exc,
                )
        return replied

    # ----------------------------------------------------------------
    # Post-Check Workflow
    # ----------------------------------------------------------------

    def postcheck_pr(
        self,
        pr_number: int,
        wait_minutes: int = 10,
        check_intervals: tuple[int, ...] = (2, 5, 10),
    ) -> GeminiCheckResult:
        """Monitor a PR for Gemini comments with timed checks.

        Waits at specified intervals and checks for new comments.
        Returns the final cumulative result.

        Args:
            pr_number: PR to monitor.
            wait_minutes: Maximum total wait time in minutes.
            check_intervals: Minutes at which to check (cumulative from PR creation).

        Returns:
            GeminiCheckResult with all comments found across all checks.
        """
        all_seen_ids: set[int] = set()
        cumulative = GeminiCheckResult()
        start = time.time()

        for target_min in check_intervals:
            if target_min > wait_minutes:
                break

            # Wait until the target time
            elapsed_min = (time.time() - start) / 60
            if elapsed_min < target_min:
                wait_sec = (target_min - elapsed_min) * 60
                logger.info(
                    "Post-check: waiting %.0f seconds (target: %d min mark)...",
                    wait_sec,
                    target_min,
                )
                time.sleep(wait_sec)

            # Check for new comments
            result = self.scan_pr(pr_number)
            new_comments = [
                c for c in result.all_comments if c.comment_id not in all_seen_ids
            ]

            if new_comments:
                logger.info(
                    "Post-check at %d min: found %d new Gemini comments",
                    target_min,
                    len(new_comments),
                )
                for c in new_comments:
                    all_seen_ids.add(c.comment_id)
                    # Add to cumulative result
                    cumulative.total_comments += 1
                    getattr(cumulative, c.severity, cumulative.unknown).append(c)
            else:
                logger.info("Post-check at %d min: no new Gemini comments", target_min)

        logger.info("Post-check complete: %s", cumulative.summary())
        return cumulative


# ---------------------------------------------------------------------------
# Convenience Functions (for use in task prompts without class instantiation)
# ---------------------------------------------------------------------------

def quick_precheck(token_path: str = "~/Documents/Coding/Threatpedia/.envbot") -> dict[int, GeminiCheckResult]:
    """Run a quick pre-check on all open PRs. Returns dict of PR# → results."""
    with GeminiReviewHandler(token_path=token_path) as handler:
        return handler.precheck_all_open_prs()


def quick_postcheck(
    pr_number: int,
    token_path: str = "~/Documents/Coding/Threatpedia/.envbot",
    wait_minutes: int = 10,
) -> GeminiCheckResult:
    """Run a post-check on a specific PR. Returns results."""
    with GeminiReviewHandler(token_path=token_path) as handler:
        return handler.postcheck_pr(pr_number, wait_minutes=wait_minutes)


# ---------------------------------------------------------------------------
# CLI (for testing)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Gemini Code Assist Review Handler")
    parser.add_argument("--precheck", action="store_true", help="Scan all open PRs")
    parser.add_argument("--postcheck", type=int, help="Monitor a specific PR number")
    parser.add_argument("--token", default="~/Documents/Coding/Threatpedia/.envbot")
    parser.add_argument("--wait", type=int, default=10, help="Max wait minutes for postcheck")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    if args.precheck:
        results = quick_precheck(token_path=args.token)
        for pr_num, result in results.items():
            print(f"\nPR #{pr_num}: {result.summary()}")
            for c in result.actionable:
                print(f"  [{c.severity.upper()}] {c.body[:120]}...")
    elif args.postcheck:
        result = quick_postcheck(args.postcheck, token_path=args.token, wait_minutes=args.wait)
        print(result.summary())
    else:
        parser.print_help()
