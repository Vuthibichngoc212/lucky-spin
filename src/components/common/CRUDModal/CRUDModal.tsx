/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useStyles } from "./CRUDModal.styles";
import HeaderTitle from "../HeaderTitle/HeaderTitle";

interface ModalProps {
  isOpenModal: boolean;
  setIsOpenModal: any;
  headerTitle: string;
  cancelButtonLabel?: string;
  submitButtonLabel?: string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
}
const CRUDModal = ({
  isOpenModal,
  setIsOpenModal,
  headerTitle,
  cancelButtonLabel,
  submitButtonLabel,
  onSubmit,
  children,
  ...props
}: ModalProps) => {
  const handleClose = () => setIsOpenModal(false);
  const classes = useStyles();

  return (
    <Modal
      open={isOpenModal}
      onClose={handleClose}
      {...props}
      className={classes.root}
    >
      <Box
        className={classes.boxWrapper}
        sx={{ minWidth: "250px", maxWidth: "500px" }}
      >
        <Box sx={{ display: "grid" }}>
          <HeaderTitle
            title={headerTitle}
            customStyle={{
              "& .MuiTypography-root": { color: "#000" },
              textAlign: "center",
              marginBottom: "1.6rem",
              gridColumn: "2/3",
            }}
            variant="title3"
          />
          <Box sx={{ gridColumn: "3", textAlign: "end" }}>
            <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
          </Box>
        </Box>
        {/* <Divider sx={{ mb: "1.6rem" }} /> */}

        <Box>
          <Box>{children}</Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              mt: "24px",
              gap: "1.6rem",
            }}
          >
            <Button
              variant="outlined"
              size="medium"
              onClick={handleClose}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                borderColor: "#57a5f8",
                color: "#57a5f8",
                "&:hover": {
                  borderColor: "#57a5f8",
                  color: "#57a5f8",
                },
              }}
            >
              {cancelButtonLabel}
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={onSubmit}
              className={classes.submitButton}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                backgroundColor: "#489bf3",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#3278b3",
                },
              }}
            >
              {submitButtonLabel}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CRUDModal;
