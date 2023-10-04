import { PropsWithChildren, forwardRef } from "react";
import "./Grid.css";

const Grid = forwardRef<HTMLDivElement, PropsWithChildren>((props, ref) => (
  <div ref={ref} className="Grid">
    {props.children}
  </div>
));

export default Grid;
