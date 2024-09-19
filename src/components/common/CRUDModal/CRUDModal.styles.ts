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
  "@global": {
    "@keyframes pulseShadow": {
      "0%": {
        boxShadow: "0 0 0 0 rgba(87, 165, 248, 0.7)",
      },
      "70%": {
        boxShadow: "0 0 10px 10px rgba(87, 165, 248, 0)",
      },
      "100%": {
        boxShadow: "0 0 0 0 rgba(87, 165, 248, 0)",
      },
    },
  },
  submitButton: {
    backgroundColor: "#57a5f8",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    maxWidth: "200px",
    animation: "pulseShadow 1.8s infinite",
  },
}));
