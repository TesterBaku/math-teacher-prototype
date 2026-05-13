# Contributing & Git Workflow

## Branch Naming

Every change starts on a branch. Never commit directly to `master`.

```
<type>/<number>-<short-description>
```

| Type | When to use |
|------|-------------|
| `feature/` | New functionality |
| `fix/` | Bug fix |
| `chore/` | Deps, config, tooling, cleanup |
| `refactor/` | Code restructuring without behaviour change |
| `content/` | Question or lesson content changes |

**Examples:**
```
feature/12-lesson-progress-tracking
fix/7-quiz-hard-questions-repeating
chore/3-pin-dependency-versions
content/15-add-ch5-questions
```

---

## Workflow

```
1. Cut branch      →  git checkout -b feature/42-my-feature
2. Make changes    →  commit with clear messages
3. Push & open PR  →  gh pr create ...
4. Code review     →  independent reviewer via /ultrareview or code-reviewer agent
5. Address notes   →  push fixes to the same branch
6. Re-review       →  reviewer confirms fixes
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
- [ ] TypeScript compiles without errors
- [ ] No duplicate questionIds
- [ ] Verified in browser

🤖 Generated with Claude Code
EOF
)"
```

### Step 4 – Review

Run `/ultrareview` in Claude Code (needs no GitHub remote for local branches) **or** spawn a `code-reviewer` agent with the PR number:

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
- Re-request review

### Step 7 – Merge rules

- ✅ All reviewer comments resolved
- ✅ `npx tsc --noEmit` passes
- ✅ No duplicate questionIds (run `node tasks/check-dupes.js` if it exists)
- 🚫 Force-push to `master` is forbidden
- 🚫 Direct push to `master` is forbidden

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
