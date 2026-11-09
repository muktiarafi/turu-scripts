# Contributing scripts

Thanks for helping. Read the [README](README.md) first, in particular
[Writing a script](README.md#writing-a-script) and the section for the area you're porting.
Changes to the engine or the script API (`bot/js/turu.ts`) go to
[Turu](https://github.com/muktiarafi/turu/blob/main/CONTRIBUTING.md) instead.

## Setup

Needs Node 22. Work inside a Turu checkout (`git clone --recursive
https://github.com/muktiarafi/turu.git`, then `scripts/`) to type-check against the engine's
current API and run your script in Turu, or clone this repository alone: it then type-checks
against `types/turu.ts`.

## Pull requests

1. Branch from an up-to-date `main`. Fork if you can't push here.
2. One script, or one group of related scripts, per pull request. Port from the C# file it
   names, keeping its names (in camelCase), order and behaviour; say in the pull request what
   you left out or changed, and why.
3. Run the checks below, push, open the pull request against `main`.
4. **Keep it rebased.** A pull request must sit on top of the current `main` with no merge
   commits. When `main` moves:

   ```bash
   git fetch origin
   git rebase origin/main
   git push --force-with-lease
   ```

   Don't use GitHub's "Update branch" merge button or `git merge main`; CI fails a branch with
   merge commits. Pull requests are merged with **Rebase and merge** only, so `main` stays
   linear. Squash fixups (`git rebase -i`) before asking for review.

Every commit on `main` is published to Search Scripts right away, so a merged script must
type-check and should have been run in game; say in the pull request if it hasn't.

### What CI checks

Every pull request runs [.github/workflows/index.yml](.github/workflows/index.yml), and it must
pass before merging:

| Job | What |
|---|---|
| Rebased on main | the branch contains `main`, no merge commits |
| Type-check | `tsc --noEmit` with `tsconfig.json` |
| Format | Prettier 3.6.2 (`.prettierrc.json`: 4 spaces, 120 columns) |
| Library options | `tools/check-library-options.mjs`: code a script imports reads only options that script declares |
| Index | `tools/build-index.mjs` builds (header blocks, relative imports) |

```bash
npx -y -p typescript@5.9.3 tsc --noEmit -p .
npx -y prettier@3.6.2 --write "**/*.{ts,mjs}"
node tools/check-library-options.mjs   # needs typescript: npm install --no-save typescript@5.9.3
node tools/build-index.mjs > /dev/null
```

## Commits

- Messages follow `type: Summary` with a capitalised summary in the imperative, as in the
  history: `feat:` (a new or newly ported script), `fix:`, `style:`, `build:`, `docs:`, `ci:`.
- Each commit should type-check on its own.
- Don't edit `types/turu.ts` by hand: it's a copy of Turu's `bot/js/turu.ts`, updated together
  with it.

## License

Ported scripts come from VibeSkua's `Scripts` repository, which publishes no license; their
authors keep their rights (see Turu's README). This repository has no license file of its own
yet; by contributing you agree your changes can be distributed here and with Turu.
