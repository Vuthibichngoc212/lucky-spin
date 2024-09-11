import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  root: {
    padding: "3.2rem",
  },
  boxWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#FFFFFF",
    boxShadow: "24px",
  },
}));
