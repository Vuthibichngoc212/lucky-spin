/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
  customStyle?: Record<any, any>;
  variant?:
    | "heading1"
    | "heading2"
    | "heading3"
    | "title1"
    | "title2"
    | "title3"
    | "title4"
    | "body1"
    | "body2"
    | "body3"
    | "body4"
    | "body5"
    | "subbody1"
    | "subbody2";
}

const variantMapping: Record<string, any> = {
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  title1: "h4",
  title2: "h5",
  title3: "h6",
  body1: "body1",
  body2: "body2",
  body3: "body2",
  subbody1: "subtitle1",
  subbody2: "subtitle2",
};

const HeaderTitle = ({ title, customStyle, variant = "heading3" }: Props) => {
  return (
    <Box
      sx={{
        marginBottom: "2.4rem",
        "& .MuiTypography-root": {
          color: "black",
        },
        ...customStyle,
      }}
    >
      <Typography variant={variantMapping[variant]} sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
    </Box>
  );
};

export default HeaderTitle;
