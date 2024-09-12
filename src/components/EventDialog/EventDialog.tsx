import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onClose,
  message,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Thông báo
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          textAlign: "center",
          padding: "20px !important",
          "&.MuiDialog-paper": { margin: "0px", padding: "24px" },
        }}
      >
        {message}
      </DialogContent>
      <Divider />
      <Box sx={{ textAlign: "center", padding: "16px" }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            backgroundColor: "#5a1ad0",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#5a1ad0",
            },
          }}
        >
          Đóng
        </Button>
      </Box>
    </Dialog>
  );
};

export default EventDialog;
