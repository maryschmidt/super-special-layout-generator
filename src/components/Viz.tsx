import { useMemo, useRef } from "react";
import { hierarchy } from "d3-hierarchy";
import { scaleOrdinal } from "d3-scale";
import { HierarchicalData } from "../models/Viz";
import { schemePaired } from "d3-scale-chromatic";
import Grid from "./Grid";
import Device from "./Device";

interface VizProps {
  data: HierarchicalData;
}

const Viz = ({ data }: VizProps) => {
  const vizRef = useRef<HTMLDivElement>(null);
  const color = scaleOrdinal(
    data.children.map((d) => d.name),
    schemePaired
  );

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
        console.log("AAA", leaf.data.value);
        return (
          <Device
            key={leaf.data.id}
            backgroundColor={color(leaf.data.name)}
            widthFt={leaf.data.value}
          />
        );
      })}
    </Grid>
  );
};

export default Viz;
