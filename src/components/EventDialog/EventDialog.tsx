import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Divider,
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Thông báo
      </DialogTitle>
      <Box sx={{ gridColumn: "3", textAlign: "end" }}>
        <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} />
      </Box>
      <Divider sx={{ mb: "1.6rem" }} />
      <DialogContent>{message}</DialogContent>
      <Button onClick={onClose}>OK</Button>
    </Dialog>
  );
};

export default EventDialog;
