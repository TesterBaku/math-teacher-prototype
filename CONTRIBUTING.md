# Contributing & Git Workflow

## Branch Naming

Every change starts on a branch. Never commit directly to `master`.

```
<type>/<number>-<short-description>
```

| Branch type | Commit type | When to use |
|-------------|-------------|-------------|
| `feature/`  | `feat:`     | New functionality |
| `fix/`      | `fix:`      | Bug fix |
| `chore/`    | `chore:`    | Deps, config, tooling, cleanup |
| `refactor/` | `refactor:` | Code restructuring without behaviour change |
| `content/`  | `content:`  | Question or lesson content changes |

> Branch prefix and commit type must match — e.g. a `fix/` branch uses `fix:` commits.

**Examples:**
```
feature/12-lesson-progress-tracking   →  feat: add lesson progress tracking
fix/7-quiz-hard-questions-repeating   →  fix: stop hard questions repeating in quiz
chore/3-pin-dependency-versions       →  chore: pin all deps to exact versions
content/15-add-ch5-questions          →  content: add 10 questions per tier for ch5
```

---

## Workflow

```
1. Cut branch         →  git checkout -b feature/42-my-feature
2. Make changes       →  commit with clear messages
3. Push & open PR     →  gh pr create ...
4. Auto-review        →  immediately spawn code-reviewer subagent (mandatory)
5. Address notes      →  push fixes to the same branch
6. Re-spawn reviewer  →  spawn code-reviewer subagent again
7. Loop               →  repeat (5)+(6) until reviewer returns zero comments
8. Chat approval      →  ask the maintainer to approve in chat
9. Merge              →  squash-merge into master (only after chat approval)
10. Delete branch     →  git branch -d feature/42-my-feature
```

### Step 3 – PR format

```
gh pr create --title "<type>: short description" --body "$(cat <<'EOF'
## What
One paragraph: what changed and why.

## How to test
- Step 1
- Step 2

## Checklist
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] No duplicate questionIds (question changes only — N/A otherwise)
- [ ] Verified in browser (UI changes only — N/A otherwise)
- [ ] code-reviewer subagent run on the latest commit, zero remaining comments
- [ ] Maintainer has approved the merge in chat

🤖 Generated with Claude Code
EOF
)"
```

> The checklist items are **merge gates** — a PR should not be merged until all boxes are ticked.

### Step 4 – Auto-review (mandatory, automatic)

The instant a PR is opened, spawn a `code-reviewer` subagent with the PR number — **without waiting to be asked**. Reviews are not on-demand; they are part of the PR-open action itself.

**In-flight PRs opened under the prior workflow** don't need a retroactive Step 4 auto-spawn. Instead, treat the next push to such a PR as a Step 5 fix-push and run Step 6 (re-spawn the reviewer) on it. From that point forward they follow the loop in Steps 5–7.

Invoke it from chat (or programmatically — the form below is illustrative):

```
Agent({ subagent_type: "code-reviewer", prompt: "Review PR #<N> ..." })
```

The reviewer checks:
- Correctness of logic and math content
- TypeScript types
- No regressions in existing behaviour
- Code style consistency
- Security and supply-chain concerns where relevant

### Step 5 – Addressing review comments

- Push new commits to the **same branch** (do not open a new PR)
- For each comment: either fix it, or post a reply **in the PR thread** (not in chat, not in the commit message) explaining the dismissal with concrete justification. The PR-thread location matters for the §Step 7 override path.
- Subagent reviewers return findings to chat, not as GitHub review comments. If you intend to dismiss such a finding, first quote/paraphrase it as a top-level PR comment (`gh pr comment <N> -b "…"`), then post the dismissal reply under it. The §Step 7 override requires the dismissal be discoverable in the PR thread on a future cold review.

### Step 6 – Re-spawn the reviewer

After pushing fixes, re-spawn a fresh `code-reviewer` subagent with the same PR number. Do **not** assume previous review state — give it the current diff cold so it catches regressions introduced by the fixes.

### Step 7 – Loop until clean

Repeat steps 5–6 until the reviewer returns **zero remaining comments**. The reviewer's verdict is the gate, with one narrow override:

- The earlier dismissal was posted in the PR thread per §Step 5 (not in chat, not in a commit message), AND
- A re-spawned reviewer raises a comment that is *semantically* the same concern as the dismissed one (same underlying claim, even if reworded — not a new wrinkle on the same code), AND
- The maintainer explicitly waives that specific recurring comment in their §Step 8 chat approval (e.g. "merge it, waiving the X comment").

All three conditions must hold. The waiver applies only to that specific recurring comment, not as a blanket dismissal of future reviewer findings.

### Step 8 – Chat approval (the human gate)

Once the reviewer is satisfied (or only carries waived recurring comments per §Step 7), post a concise summary in chat and **explicitly ask the maintainer to approve the merge**. Wait for an unambiguous affirmative referencing this PR or commit — e.g. `"approve PR #N"`, `"merge it"`, `"lgtm"`, `"ship it"`, `"go ahead"` (non-exhaustive; the message must clearly bind to this PR and clearly mean go-ahead). Do not infer approval from silence, hedged language ("looks ok-ish", "maybe"), or from earlier instructions in the session.

### Step 9 – Merge rules

- ✅ Reviewer subagent returned zero comments (or only waived recurring comments) on the most recent run
- ✅ Maintainer has approved the merge in chat (this PR, this commit)
- ✅ `npx tsc --noEmit` passes with zero errors
- ✅ No duplicate questionIds (question changes only — N/A otherwise)
- ✅ UI changes verified in browser (UI changes only — N/A otherwise)
- 🚫 Force-push to `master` is forbidden
- 🚫 Direct push to `master` is forbidden
- 🚫 GitHub approving review is **not** used as a gate — the maintainer reviews on `master` and would have to self-approve, which GitHub blocks. Chat approval replaces it.

### Step 10 – Clean up

```bash
git checkout master
git pull origin master
git branch -d feature/42-my-feature
```

If `master` diverged while your branch was open, rebase before merging:
```bash
git fetch origin
git rebase origin/master
```

---

## Commit Messages

```
<type>: short imperative summary (≤72 chars)

Optional body — why, not what.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

**Types:** `feat`, `fix`, `chore`, `refactor`, `content`, `docs`

---

## Branch Protection (GitHub)

`master` is protected:
- Require pull request before merging
- **No GitHub approving review is required** (the maintainer is the sole reviewer on `master` and GitHub blocks self-approval — chat approval per §8 replaces it)
- Block direct pushes
- Block force-pushes
- Block branch deletion
