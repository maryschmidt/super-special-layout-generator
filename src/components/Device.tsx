import { styled } from "@mui/system";
import { TEN } from "../utils/getFtToPxConversionFactor";

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

const StyledDevice = styled("div")(
  ({ widthFt, backgroundColor }: DeviceProps) => ({
    height: "100px",
    width: `${widthFt * TEN}px`,
    backgroundColor: backgroundColor,
    gridColumnEnd: `span ${widthFt / TEN}`,
  })
);

/**
 * Renders a number of devices with specified grid params
 */
const Device = ({ backgroundColor, widthFt }: DeviceProps) => (
  <StyledDevice backgroundColor={backgroundColor} widthFt={widthFt} />
);

export default Device;
