import React from "react";
import { Typography, Grid } from "@mui/material";
import LayoutWrapper from "../../components/Layout/LayoutWrapper.js";
import TrendingBlogs from "./TrendingBlogs.js";
import Categories from "./Categories.js";
import Contact from "./Contact.js";
import {
  headingTypo,
  subHeadingTypo,
} from "../../components/StyledComponents.js";
const Homepage = () => {
  return (
    <>
      <LayoutWrapper title="Homepage">
        <Grid
          container
          xs
          alignItems="center"
          direction="column"
          textAlign="center"
          p="2rem"
          sx={{ backgroundColor: "primary.main", minHeight: "20vh" }}
        >
          <Grid item container xs justifyContent="center" alignItems="center">
            <Typography
              style={headingTypo}
              color="secondary.main"
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "3rem",
                },
              }}
            >
              WELCOME TO
            </Typography>
            <Typography
              style={headingTypo}
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "3rem",
                },
              }}
              ml="1rem"
              color="accent.main"
            >
              BH BLOGS
            </Typography>
          </Grid>
          <Grid item alignItems="center">
            <Typography
              style={subHeadingTypo}
              color="secondary.main"
              variant="h5"
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.5rem",
                  md: "1.7rem",
                  lg: "2rem",
                },
              }}
            >
              Where you listen and tell...
            </Typography>
          </Grid>
        </Grid>
        <TrendingBlogs />
        <Categories />
        <Contact />
      </LayoutWrapper>
    </>
  );
};

export default Homepage;
