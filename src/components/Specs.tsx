import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
  <Box display="flex" flexWrap="wrap">
    <Box flex="1">
      <Typography variant="caption">Width</Typography>
      <Typography variant="body1">{`${widthFt} ft`}</Typography>
    </Box>
    <Box flex="1">
      <Typography variant="caption">Height</Typography>
      <Typography variant="body1">{`${heightFt} ft`}</Typography>
    </Box>
    <Box flex="1">
      <Typography variant="caption">Cost</Typography>
      <Typography variant="body1">{`$${totalCost / 1000}k`}</Typography>
    </Box>
    <Box flex="1">
      <Typography variant="caption">Energy</Typography>
      <Typography variant="body1">{`${totalUsage} MWh`}</Typography>
    </Box>
  </Box>
);
