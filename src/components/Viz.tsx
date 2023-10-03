import { useCallback, useEffect, useRef } from "react";
import {
  HierarchyRectangularNode,
  hierarchy,
  treemap,
  treemapSliceDice,
} from "d3-hierarchy";
import { select } from "d3-selection";
import { scaleOrdinal } from "d3-scale";
import { HierarchicalData } from "../models/Viz";
import { schemePaired } from "d3-scale-chromatic";
import { MAX_WIDTH_FT } from "../utils/getFtToPxConversionFactor";

interface VizProps {
  data: HierarchicalData;
  width: number;
  height: number;
}

const Viz = ({ data, width, height }: VizProps) => {
  const svgRef = useRef(null);
  const color = scaleOrdinal(
    data.children.map((d) => d.name),
    schemePaired
  );

  const renderTreemap = useCallback(() => {
    const svg = select(svgRef.current);
    svg.attr("width", width).attr("height", height);

    const root = treemap<HierarchicalData>()
      .tile(
        ((tile) => (node, x0, y0, x1, y1) => {
          const ratio = 10 / (node.value ?? 1); // TODO MAKE 10 A CONSTANT
          const heightStatic = (10 * MAX_WIDTH_FT) / width;
          console.log({ heightStatic });

          tile(node, x0 * ratio, y0, x1 * ratio, y1);
          for (const child of node.children ?? [])
            (child.x0 /= ratio), (child.x1 /= ratio);
        })(treemapSliceDice)
      )
      .size([width, height])
      .padding(1)
      .round(false)(
      hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    );

    // Add a cell for each leaf of the hierarchy.
    const leaf = svg
      .selectAll("g")
      .data<HierarchyRectangularNode<HierarchicalData>>(
        root.leaves(),
        (d) => (d as HierarchyRectangularNode<HierarchicalData>).data.id
      )
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    // Append a color rectangle.
    leaf
      .append("rect")
      .attr("id", (d) => d.data.id)
      .attr("fill", (d) => {
        return color(d.data.name);
      })
      .attr("fill-opacity", 0.6)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);
  }, [color, data, height, width]);

  // Update loop
  useEffect(() => {
    renderTreemap();
  }, [renderTreemap]);

  return <svg ref={svgRef} />;
};

export default Viz;
