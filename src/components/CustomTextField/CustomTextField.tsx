/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import { useStyles } from "./CustomTextField.styles";
interface TextFieldViewProps {
  control: Control<any>;
  name: string;
  label?: string;
  variant?: "standard" | "outlined" | "filled" | undefined;
  type?: React.InputHTMLAttributes<unknown>["type"];
  size?: "small" | "medium" | undefined;
  required?: boolean;
  customStyles?: any;
  [x: string]: any;
}
const CustomTextField = ({
  control,
  name,
  label,
  variant,
  type = "text",
  size = "small",
  required,
  customStyles,
  ...props
}: TextFieldViewProps) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box sx={{ mb: "10px", ...customStyles }}>
          {label && (
            <InputLabel
              sx={{
                mb: "0.4rem",
                fontSize: "14px",
                fontFamily: "Inter",
                color: "#19191A",
                ...(error && { color: "red" }),
              }}
            >
              {label}{" "}
              {required && (
                <Typography component="span" color="red">
                  *
                </Typography>
              )}
            </InputLabel>
          )}

          <TextField
            className={classes.textFieldRoot}
            InputLabelProps={{
              shrink: true,
            }}
            variant={variant || "outlined"}
            type={type}
            size={size}
            fullWidth
            value={value}
            multiline
            maxRows={4}
            error={!!error?.message}
            helperText={error?.message ?? ""}
            onChange={onChange}
            {...props}
          />
        </Box>
      )}
    />
  );
};

export default CustomTextField;
