import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
const Unauthorized = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [count, setCount] = useState(3);
  const location = useLocation;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    if (count === 0) {
      auth?.accessToken
        ? navigate("/") && toast.error("access not allowed")
        : navigate("/login", {
            state: location.pathname,
          });
    }
    return () => clearInterval(interval);
  }, [count, navigate]);

  return (
    <Box>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Grid container direction="column" xs={12} alignItems="center">
          <Typography>You need to login first</Typography>
          <Typography>Redirecting to login page in {count} seconds</Typography>
          <CircularProgress color="primary" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Unauthorized;
