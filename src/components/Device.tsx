import { Grid } from "../../devices";
import { styled } from "@mui/system";
import { v4 as uuidv4 } from "uuid";

interface DeviceProps {
  /**
   * Number of instances of this device to render
   */
  count: number;
  /**
   * Grid props defining the device's UI behavior
   */
  grid: Grid;
}

const StyledDevice = styled("div")((props: Pick<DeviceProps, "grid">) => ({
  height: "100px",
  //   border: "1px solid #fff",
  backgroundColor: props.grid.color,
  gridColumn: `auto / span ${props.grid.column.end}`,
}));

/**
 * Renders a number of devices with specified grid params
 */
const Device = (props: DeviceProps) =>
  [...Array(props.count)].map(() => (
    <StyledDevice key={uuidv4()} grid={props.grid} />
  ));

export default Device;
