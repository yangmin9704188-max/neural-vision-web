/**
 * Artifact naming/path helpers.
 *
 * Maps pipeline output references to display-friendly paths.
 * Based on docs/PIPELINE_MAP_MASTER_v1.md artifact specifications.
 *
 * TODO (PR-C): Implement artifact download/render helpers
 */

export interface ArtifactRef {
  type:
    | "depth_png"
    | "normal_png"
    | "fit_signal"
    | "final_image"
    | "provenance";
  path: string;
  label: string;
}

/**
 * Build a list of artifact references from a fitting result.
 */
export function buildArtifactRefs(
  artifacts: Record<string, string | undefined> | undefined
): ArtifactRef[] {
  if (!artifacts) return [];

  const mapping: Array<{
    key: string;
    type: ArtifactRef["type"];
    label: string;
  }> = [
    { key: "depth_png", type: "depth_png", label: "Depth Map" },
    { key: "normal_png", type: "normal_png", label: "Normal Map" },
    { key: "final_image", type: "final_image", label: "Final Result" },
  ];

  return mapping
    .filter((m) => artifacts[m.key])
    .map((m) => ({
      type: m.type,
      path: artifacts[m.key]!,
      label: m.label,
    }));
}
