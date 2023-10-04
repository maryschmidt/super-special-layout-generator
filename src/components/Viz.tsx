import { useCallback, useEffect, useRef } from "react";
import { hierarchy } from "d3-hierarchy";
import { select } from "d3-selection";
import { scaleOrdinal } from "d3-scale";
import { HierarchicalData } from "../models/Viz";
import { schemePaired } from "d3-scale-chromatic";
import { TEN } from "../utils/getFtToPxConversionFactor";

interface VizProps {
  data: HierarchicalData;
}

const Viz = ({ data }: VizProps) => {
  const vizRef = useRef<HTMLDivElement | null>(null);
  const color = scaleOrdinal(
    data.children.map((d) => d.name),
    schemePaired
  );

  const renderGrid = useCallback(() => {
    const grid = select(vizRef?.current);

    if (grid) {
      const dataHierachy = hierarchy(data);
      grid
        .attr("id", "grid")
        .style("display", "grid")
        .style("grid-gap", "0px")
        .style("grid-template-columns", `repeat(10, fit-content(10%))`)
        .style("grid-auto-rows", `${TEN * TEN}px`)
        .style("grid-auto-flow", "dense");

      grid
        .selectAll("div")
        .data(dataHierachy.leaves().filter((d) => !!d.data.value))
        .join("div")
        .style("background-color", (d) => color(d.data.name))
        .style("height", `${TEN * TEN}px`)
        .style("width", (d) => `${d.data.value * TEN}px`)
        .style("grid-column-end", (d) => `span ${d.data.value / TEN}`);
    }
  }, [data, color]);

  // Update loop
  useEffect(() => {
    renderGrid();
  }, [renderGrid]);

  return <div ref={vizRef} />;
};

export default Viz;
