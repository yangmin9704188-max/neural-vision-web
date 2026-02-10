/**
 * Ajv schema compile/validate wrappers.
 *
 * TODO (PR-A): Add schema compilation from contracts repo
 * TODO (PR-B): Add garment intake validation
 */

import Ajv, { type ValidateFunction, type ErrorObject } from "ajv";

const ajv = new Ajv({ allErrors: true, verbose: true });

export interface ValidationResult {
  valid: boolean;
  errors: ErrorObject[] | null;
}

/**
 * Compile a JSON Schema and return a reusable validate function.
 */
export function compileSchema(schema: object): ValidateFunction {
  return ajv.compile(schema);
}

/**
 * Validate data against a pre-compiled schema.
 */
export function validate(
  validateFn: ValidateFunction,
  data: unknown
): ValidationResult {
  const valid = validateFn(data) as boolean;
  return {
    valid,
    errors: valid ? null : (validateFn.errors ?? null),
  };
}
