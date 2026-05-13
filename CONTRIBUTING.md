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
1. Cut branch      →  git checkout -b feature/42-my-feature
2. Make changes    →  commit with clear messages
3. Push & open PR  →  gh pr create ...
4. Code review     →  independent reviewer via /ultrareview or code-reviewer agent
5. Address notes   →  push fixes to the same branch
6. Re-review       →  reviewer confirms fixes are addressed
7. Merge           →  squash-merge into master
8. Delete branch   →  git branch -d feature/42-my-feature
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

### Step 4 – Review

Run `/ultrareview` in Claude Code **or** spawn a `code-reviewer` subagent with the PR number:

```
/ultrareview <PR#>
```

The reviewer checks:
- Correctness of logic and math content
- TypeScript types
- No regressions in existing behaviour
- Code style consistency

### Step 5 – Addressing review comments

- Push new commits to the **same branch** (do not open a new PR)
- Reply to each comment explaining what was changed or why it was rejected
- Re-request review via the GitHub UI

### Step 6 – Re-review

The original reviewer re-runs `/ultrareview <PR#>` (or reviews the diff) and confirms:
- Each comment is resolved or explicitly dismissed with justification
- No new issues introduced by the fix commits

Only after this step can the PR be merged.

### Step 7 – Merge rules

- ✅ All reviewer comments resolved and confirmed
- ✅ `npx tsc --noEmit` passes with zero errors
- ✅ No duplicate questionIds
- ✅ UI changes verified in browser
- 🚫 Force-push to `master` is forbidden
- 🚫 Direct push to `master` is forbidden

### Step 8 – Clean up

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
- Require at least 1 approving review
- Dismiss stale reviews when new commits are pushed
- Block direct pushes
- Block force-pushes
