import {
  Button,
  Card,
  Typography,
  styled,
  Modal,
  IconButton,
} from "@mui/material";
import theme from "./Theme";
import { Link } from "react-router-dom";
import { pink } from "@mui/material/colors";

// styled links for the navigtion bar
export const StyledNavLink = styled(Link)(({ theme }) => ({
  "&:active": {},
  color: theme.palette.secondary.main,
  fontWeight: "bold",
  fontFamily: "Open sans, sans-serif",
  fontSize: "1.5rem",
  textDecoration: "none",
  fontWeight: "500",
  "&:hover": {
    color: theme.palette.secondary.light,
  },
}));
// styled links for the navigtion bar
export const StyledFooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.accent.main,
  fontWeight: "bold",
  fontFamily: "Open sans, sans-serif",
  fontSize: "1.5rem",
  textDecoration: "none",
  fontWeight: "500",
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

export const headingTypo = {
  fontFamily: "Roboto Slab, sans-serif",
  fontWeight: "500",
};
export const subHeadingTypo = {
  fontFamily: "Open sans, sans-serif",
  fontWeight: "500",
};
export const normalTypo = {
  fontFamily: "Roboto, sans-serif",
  fontWeight: "300",
  fontSize: "1rem",
};
