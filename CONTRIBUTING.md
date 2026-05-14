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
- [ ] No duplicate questionIds: `node -e "…"` (see tasks/todo.md)
- [ ] Verified in browser for UI changes

🤖 Generated with Claude Code
EOF
)"
```

> The checklist items are **merge gates** — a PR should not be merged until all boxes are ticked.

### Step 4 – Auto-review (mandatory, automatic)

The instant a PR is opened, spawn a `code-reviewer` subagent with the PR number — **without waiting to be asked**. Reviews are not on-demand; they are part of the PR-open action itself.

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
- For each comment: either fix it, or reply explaining the dismissal with concrete justification

### Step 6 – Re-spawn the reviewer

After pushing fixes, re-spawn a fresh `code-reviewer` subagent with the same PR number. Do **not** assume previous review state — give it the current diff cold so it catches regressions introduced by the fixes.

### Step 7 – Loop until clean

Repeat steps 5–6 until the reviewer returns **zero remaining comments**. There is no manual exit condition — the reviewer's verdict is the gate.

### Step 8 – Chat approval (the human gate)

Once the reviewer is satisfied, post a concise summary in chat and **explicitly ask the maintainer to approve the merge**. Wait for an explicit "yes / approved / merge it" in chat. Do not infer approval from silence or from earlier instructions.

### Step 9 – Merge rules

- ✅ Reviewer subagent returned zero comments on the most recent run
- ✅ Maintainer has approved the merge in chat (this PR, this commit)
- ✅ `npx tsc --noEmit` passes with zero errors
- ✅ No duplicate questionIds
- ✅ UI changes verified in browser
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
