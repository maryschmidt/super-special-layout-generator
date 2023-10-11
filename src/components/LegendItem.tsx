import Typography from "@mui/material/Typography";
import styles from "./LegendItem.module.css";

interface LegendItemProps {
  backgroundColor: string;
  name: string;
  count: number;
}

const LegendItem = ({ backgroundColor, name, count }: LegendItemProps) => {
  return (
    <div className={styles.item}>
      <div className={styles.chip} style={{ backgroundColor }} />
      <Typography
        className={styles.text}
        variant="caption"
      >{`${name}: ${count}`}</Typography>
    </div>
  );
};

export default LegendItem;
