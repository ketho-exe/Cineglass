export function getSafeProgress(progressPercent?: number) {
  const hasProgress = typeof progressPercent === "number";
  return {
    hasProgress,
    safeProgress: hasProgress ? Math.max(0, Math.min(100, progressPercent)) : undefined,
  };
}
