import { DeviceNames } from "../../devices";
import { EleCounts } from "../models/Layout";

export const getBatteryCount = (eles: EleCounts<DeviceNames>): number =>
  (Object.keys(eles) as Array<DeviceNames>)
    .filter((k) => k !== "transformer") // We only want the batteries
    .reduce((acc, cur) => acc + eles[cur], 0);
