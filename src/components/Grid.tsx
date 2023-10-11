import { PropsWithChildren, forwardRef } from "react";
import styles from "./Grid.module.css";

const Grid = forwardRef<HTMLDivElement, PropsWithChildren>((props, ref) => (
  <div ref={ref} className={styles.grid}>
    {props.children}
  </div>
));

export default Grid;
