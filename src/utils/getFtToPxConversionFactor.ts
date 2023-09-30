export const MAX_WIDTH_FT = 1000; // Specific to this project's reqs, could be made into a variable

/**
 * Generates a multiplier to go from ft to px
 * @param widthInPx Can potentially be 0 or undefined
 */
export const getFtToPxConversionFactor = (
  widthInPx: number | undefined
): number => {
  if (widthInPx) {
    return MAX_WIDTH_FT / widthInPx;
  }
  return 0;
};
