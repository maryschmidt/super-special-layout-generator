import { TEN } from "../utils/getFtToPxConversionFactor";
import styles from "./Device.module.css";

interface DeviceProps {
  /**
   * Width value from the data
   */
  widthFt: number;
  /**
   * Background color of the div to render
   */
  backgroundColor: string;
}

/**
 * Renders a number of devices with specified grid params
 */
const Device = ({ backgroundColor, widthFt }: DeviceProps) => (
  <div
    className={styles.device}
    style={{
      backgroundColor,
      width: widthFt * TEN,
      gridColumnEnd: `span ${widthFt / TEN}`,
    }}
    data-cy="device"
  />
);

export default Device;
