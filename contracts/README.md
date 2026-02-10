# Contracts

This directory holds the **Neural Vision Contracts** — the pinned schemas,
OpenAPI specs, and example payloads that the web repo depends on.

## Pinning Procedure

The web repo pins a specific tag/commit of `neural-vision-contracts`:

1. Update `contracts.lock.json` at the repo root with the new tag & commit SHA.
2. If using git submodule: `git submodule update --init --recursive`
3. Run `npm run validate:schemas` to verify compatibility.
4. Commit both the lock file change and submodule update together.

## Current Pin

See `../contracts.lock.json` for the currently pinned version.

## Layout Contract

See `web_repo_layout_contract_v0.md` in this directory for the full
folder structure specification.
