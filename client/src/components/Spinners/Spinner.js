import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { normalTypo } from "../StyledComponents";

const Spinner = () => {
  return (
    <Box>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        minHeight="100%"
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          xs={12}
        >
          <Typography style={normalTypo} m="1rem">
            loading please wait...
          </Typography>
          <CircularProgress color="primary" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Spinner;
