export const MAX_WIDTH_FT = 100; // Specific to this project's reqs, could be made into a variable
export const TEN = 10;

/**
 * Generates a multiplier to go from ft to px
 * @param widthInPx Can potentially be 0 or undefined
 */
export const getPxToFtConversionFactor = (
  widthInPx: number | undefined
): number => {
  if (widthInPx) {
    return widthInPx / TEN;
  }
  return 0;
};
