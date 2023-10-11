import { useMemo, useRef } from "react";
import { hierarchy } from "d3-hierarchy";
import { HierarchicalData } from "../models/Viz";
import Grid from "./Grid";
import Device from "./Device";
import { ScaleOrdinal } from "d3-scale";

interface VizProps {
  data: HierarchicalData;
  colorScale: ScaleOrdinal<string, string>;
}

const Viz = ({ data, colorScale }: VizProps) => {
  const vizRef = useRef<HTMLDivElement>(null);

  const leaves = useMemo(
    () =>
      hierarchy(data)
        .leaves()
        .filter((d) => !!d.data.value),
    [data]
  );

  return (
    <Grid ref={vizRef}>
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
};

export default Viz;
