import { PropsWithChildren, forwardRef, useMemo } from "react";
import { hierarchy } from "d3-hierarchy";
import { HierarchicalData } from "../models/Viz";
import Grid from "./Grid";
import Device from "./Device";
import { ScaleOrdinal } from "d3-scale";

interface VizProps {
  data: HierarchicalData;
  colorScale: ScaleOrdinal<string, string>;
}

const Viz = forwardRef<HTMLDivElement, PropsWithChildren<VizProps>>(
  ({ colorScale, data }, ref) => {
    const leaves = useMemo(
      () =>
        hierarchy(data)
          .leaves()
          .filter((d) => !!d.data.value),
      [data]
    );

    return (
      <Grid ref={ref}>
        {leaves.map((leaf) => {
          return (
            <Device
              key={leaf.data.id}
              backgroundColor={colorScale(leaf.data.name)}
              widthFt={leaf.data.value}
            />
          );
        })}
      </Grid>
    );
  }
);

export default Viz;
