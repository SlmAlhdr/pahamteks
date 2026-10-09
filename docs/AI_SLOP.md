# Code quality and AI slop checks

PahamTeks uses `aislop` as a deterministic code quality scanner. It reports patterns such as swallowed exceptions, undeclared imports, hidden fallbacks, repetitive code, dead code, and comments that merely narrate the implementation. Its score is a heuristic signal, not proof that code is correct, secure, or human-written. Review each finding in context.

## Project policy

The tracked configuration is [`.aislop/config.yml`](../.aislop/config.yml). It excludes dependency folders, generated builds, local database data, and backups. Telemetry is disabled. The CI score threshold is 80; severity `error` rules also fail the gate.

The GitHub Actions workflow is [`.github/workflows/aislop.yml`](../.github/workflows/aislop.yml). It runs for pushes and pull requests targeting `main` and uses the maintained [`scanaislop/aislop` GitHub Action](https://github.com/scanaislop/aislop/blob/main/action.yml). The action runs `aislop ci`, which reads `.aislop/config.yml`; do not pass the obsolete `fail-below` action input.

## Run locally

```bash
# Full project scan
npx --yes aislop@latest scan .

# CI-equivalent quality gate
npx --yes aislop@latest ci .

# Scan changed files against main (origin/main must exist locally)
npx --yes aislop@latest ci . --changes --base origin/main
```

Review automated fixes manually before applying them. Do not run a bulk fix command over the repository without inspecting its proposed changes.

## Respond to findings

- For swallowed exceptions, decide whether to report the error to the caller, show a user-facing error state, retry safely, or log useful context and take an explicit recovery path.
- Reuse shared helpers where doing so reduces real duplication; do not create abstractions solely to improve a scanner score.
- Remove genuinely unused files and imports only after confirming references and product intent.
- Keep comments focused on non-obvious decisions, constraints, and security behavior.
- If suppressing a valid finding, use the scanner's documented inline suppression with a short reason and keep the scope narrow.

## GitHub Actions behavior

The workflow checks the repository state on `main` pushes and pull requests. A failure means the configured score threshold was missed or an error-severity finding was reported. Inspect the workflow log, reproduce locally with `aislop ci`, fix the underlying issue, then commit and push the reviewed change.
