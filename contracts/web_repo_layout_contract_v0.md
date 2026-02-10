# Web Repo Layout Contract v0
Status: DRAFT → (merge 후) FROZEN
This document defines the required folder structure for Neural Vision Web.
Any structural deviation must be done via PR updating this contract first.

---

## 1) Required Top-level Layout
.
├─ app/                         # Next.js App Router routes
│  ├─ page.tsx                  # /
│  ├─ demo/                     # /demo
│  ├─ showcase/                 # /showcase
│  └─ seller/                   # /seller/**
│
├─ src/
│  ├─ components/               # shared UI components
│  ├─ lib/
│  │  ├─ engine/                # EngineClient + adapters (mock/real)
│  │  ├─ contracts/             # generated types, schema loaders, helpers
│  │  ├─ validation/            # Ajv schema compile/validate wrappers
│  │  ├─ storage/               # persistence abstraction (dev: fs/json)
│  │  ├─ artifacts/             # artifact naming/path helpers
│  │  └─ telemetry/             # request_id/trace_id helpers
│  └─ styles/                   # optional
│
├─ public/
│  └─ demo_artifacts/           # sample images/json used by demo/mock
│
├─ docs/
│  └─ ssot/
│     └─ WEB_SSoT_v0.md         # single source of truth (web behavior)
│
├─ contracts/                   # (Option A) vendor/submodule checkout lives here
│  └─ README.md                 # explains pinned tag/commit & update procedure
│
├─ scripts/
│  ├─ sync_contracts.sh|ps1     # update pinned contracts tag/commit (optional)
│  └─ validate_contracts.sh|ps1 # runs schema/openapi/examples validation
│
├─ storage/                     # dev-only storage (MUST be gitignored)
│  ├─ sellers/
│  └─ jobs/
│
├─ .github/workflows/
│  └─ web-ci.yml                # lint/typecheck + schema/openapi/examples validate
│
└─ contracts.lock.json          # pinned contracts tag+commit (see below)

---

## 2) contracts.lock.json (Required)
The web repo MUST keep a lock file with the pinned contracts version.

Example:
{
  "repo": "neural-vision-contracts",
  "tag": "neural-vision-contracts-v0.1.0",
  "commit": "<git sha>",
  "pinned_at": "YYYY-MM-DDTHH:mm:ssZ"
}

This file is used for:
- UI display (manifest.contracts_tag)
- CI drift checks
- reproducibility

---

## 3) Gitignore Rules (Required)
The following must be gitignored:
- storage/**
- public/demo_artifacts/generated/**
- any downloaded artifacts or run outputs
Only hand-curated demo artifacts may be committed.
