import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./Specs.module.css";

interface SpecsProps {
  widthFt: number;
  heightFt: number;
  totalCost: number;
  totalUsage: number;
}

export const Specs = ({
  widthFt,
  heightFt,
  totalCost,
  totalUsage,
}: SpecsProps) => (
  <div className={styles.specs}>
    <div className={styles.flex}>
      <Typography variant="caption">Width</Typography>
      <Typography variant="body1">{`${widthFt} ft`}</Typography>
    </div>
    <div className={styles.flex}>
      <Typography variant="caption">Height</Typography>
      <Typography variant="body1">{`${heightFt} ft`}</Typography>
    </div>
    <div className={styles.flex}>
      <Typography variant="caption">Cost</Typography>
      <Typography variant="body1">{`$${totalCost / 1000}k`}</Typography>
    </div>
    <div className={styles.flex}>
      <Typography variant="caption">Energy</Typography>
      <Typography variant="body1">{`${totalUsage} MWh`}</Typography>
    </div>
  </div>
);
