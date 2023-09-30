import { styled } from "@mui/system";

interface StyledGridProps {
  /**
   * This is the global minimum of the width specs, in feet
   */
  baseWidthFt: number;
  /**
   * Means: "1 ft = How many px?"
   */
  ftToPxConversionFactor: number;
  /**
   * Width of the container element, from a ref
   */
  containerWidth: number;
}

const StyledGrid = styled("div")((props: StyledGridProps) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${Math.round(
    props.containerWidth / (props.ftToPxConversionFactor * props.baseWidthFt)
  )}, ${props.ftToPxConversionFactor * props.baseWidthFt}px)`,
  gridAutoRows: `100px`,
  gridAutoFlow: "row dense",
  minWidth: 0,
  maxWidth: props.containerWidth,
  margin: `0 auto`,
  overflowX: "hidden",
  overflowY: "auto",
}));

export default StyledGrid;
