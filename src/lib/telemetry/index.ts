/**
 * Request ID / Trace ID helpers.
 *
 * Every engine request should carry a unique request_id for tracing.
 * TODO (PR-A): Integrate with API routes
 */

export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${random}`;
}

export function generateTraceId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `trace_${timestamp}_${random}`;
}
