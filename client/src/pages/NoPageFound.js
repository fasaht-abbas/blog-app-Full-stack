import React from "react";
import { Grid, Typography } from "@mui/material";

const NoPageFound = () => {
  return (
    <>
      <Grid
        xs={12}
        container
        minHeight="80vh"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h2" fontWeight="bold">
              404
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h2">page not found</Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default NoPageFound;
