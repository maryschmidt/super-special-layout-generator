export const getTransformerCount = (batteryCount: number = 0): number =>
  Math.ceil(batteryCount / 2);
