import { DeviceNames, batteries } from "../../devices";
import { EleCounts } from "../models/Layout";
import { DatumWithChildren, HierarchicalData } from "../models/Viz";
import { v4 as uuidv4 } from "uuid";

export const genNodesForViz = (
  data: EleCounts<DeviceNames>
): HierarchicalData => {
  return (Object.keys(data) as Array<DeviceNames>).reduce(
    (acc: HierarchicalData, cur) => {
      const d = data[cur];
      const child: DatumWithChildren = {
        name: cur,
        value: 0,
        id: uuidv4(),
        children: [],
      };
      [...Array(d)].map(() => {
        const value = batteries[cur].specs.width;
        child.children.push({
          name: cur,
          value,
          id: uuidv4(),
        });
        // child.value += value;
      });
      acc.children.push(child);
      //   acc.value += child.value;
      return acc;
    },
    { name: "batteries", value: 0, id: uuidv4(), children: [] }
  );
};
