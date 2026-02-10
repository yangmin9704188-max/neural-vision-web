#!/usr/bin/env node

/**
 * validate_contracts.mjs
 *
 * CI script that:
 * 1. Validates contracts.lock.json structure (Ajv)
 * 2. Checks that required SSoT documents exist at contracted paths
 * 3. (Future) Compiles JSON schemas from contracts repo
 * 4. (Future) Validates example payloads against schemas
 *
 * Exit codes:
 *   0 = all checks pass
 *   1 = validation failure
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Ajv from "ajv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

// ── 1. Validate contracts.lock.json ──────────────────────────

const lockSchema = {
  type: "object",
  properties: {
    repo: { type: "string", minLength: 1 },
    tag: { type: "string", minLength: 1 },
    commit: { type: "string", minLength: 1 },
    pinned_at: { type: "string", minLength: 1 },
  },
  required: ["repo", "tag", "commit", "pinned_at"],
  additionalProperties: true,
};

const ajv = new Ajv({ allErrors: true });
const validateLock = ajv.compile(lockSchema);

let exitCode = 0;

function check(label, ok, detail = "") {
  const icon = ok ? "PASS" : "FAIL";
  console.log(`  [${icon}] ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) exitCode = 1;
}

console.log("\n=== Neural Vision Contracts Validation ===\n");

// Lock file
console.log("1. contracts.lock.json");
const lockPath = resolve(ROOT, "contracts.lock.json");
const lockExists = existsSync(lockPath);
check("File exists", lockExists);

if (lockExists) {
  try {
    const lockData = JSON.parse(readFileSync(lockPath, "utf-8"));
    const valid = validateLock(lockData);
    check("Schema valid", valid, valid ? "" : JSON.stringify(validateLock.errors));
    check("Repo field", lockData.repo === "neural-vision-contracts",
      `got "${lockData.repo}"`);
  } catch (e) {
    check("JSON parse", false, e.message);
  }
}

// ── 2. Required SSoT documents ───────────────────────────────

console.log("\n2. SSoT Documents");
const requiredDocs = [
  "docs/ssot/WEB_SSoT_v0.md",
  "contracts/web_repo_layout_contract_v0.md",
  "docs/PIPELINE_MAP_MASTER_v1.md",
];

for (const doc of requiredDocs) {
  const docPath = resolve(ROOT, doc);
  check(doc, existsSync(docPath));
}

// ── 3. Required directory structure ──────────────────────────

console.log("\n3. Directory Structure (per layout contract)");
const requiredDirs = [
  "src/app",
  "src/lib/engine",
  "src/components",
  "contracts",
  "docs/ssot",
  "scripts",
  "public",
];

for (const dir of requiredDirs) {
  const dirPath = resolve(ROOT, dir);
  check(dir, existsSync(dirPath));
}

// ── 4. Placeholder: Schema compilation + example validation ──

console.log("\n4. Schema Compilation (placeholder)");
console.log("  [SKIP] No schemas in contracts repo yet — will be implemented in PR-A");

console.log("\n5. OpenAPI Bundle (placeholder)");
console.log("  [SKIP] No OpenAPI spec yet — will be implemented when available");

// ── Result ───────────────────────────────────────────────────

console.log(`\n=== Result: ${exitCode === 0 ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"} ===\n`);
process.exit(exitCode);
