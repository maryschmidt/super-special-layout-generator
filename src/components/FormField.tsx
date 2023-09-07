import { ChangeEvent } from "react";
import TextField from "@mui/material/TextField";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: number;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({
  id,
  name,
  label,
  value,
  disabled,
  onChange,
}: FormFieldProps) => {
  return (
    <TextField
      disabled={disabled}
      type="number"
      margin="dense"
      fullWidth
      id={id}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      InputProps={{
        inputProps: {
          max: 100,
          min: 0,
        },
      }}
    />
  );
};

export default FormField;
