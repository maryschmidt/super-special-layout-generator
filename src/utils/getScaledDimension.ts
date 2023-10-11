import { TEN } from "./getFtToPxConversionFactor";

export const getScaledDimension = (dimension: number = 0): number =>
  Math.round(dimension / TEN);
