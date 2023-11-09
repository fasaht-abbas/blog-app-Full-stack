import React, { useEffect } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { headingTypo } from "../../components/StyledComponents";
import { useAuth } from "../../Context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { refreshing } from "../../components/Utlis";

const UserProfile = () => {
  const [auth] = useAuth();

  // use effect for scrolling to the top of the site
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LayoutWrapper>
      <Grid container xs={12} my="4vh">
        <Grid container xs="12" justifyContent="center">
          <Typography
            color="primary.main"
            variant="h4"
            fontWeight="bold"
            alignSelf="center"
          >
            {" "}
            User Profile
          </Typography>
        </Grid>
        <Grid container xs={12} p="1.5rem" justifyContent="center">
          <Grid container xs={12} justifyContent="right">
            {/* from here navigate to another page with the id of the user and allow the editting process if the authentication is proved */}
            <Link to="/private/update-profile">
              <Typography color="primary.main">
                <EditIcon />
              </Typography>
            </Link>
          </Grid>
          <Grid container xs={2} justifyContent="left" mr="1rem">
            <Stack spacing={2}>
              <Typography fontWeight="bold">Name</Typography>
              <Typography fontWeight="bold">Email</Typography>
              <Typography fontWeight="bold">Phone</Typography>
              <Typography fontWeight="bold">address</Typography>
            </Stack>
          </Grid>
          <Grid container xs={9} justifyContent="left">
            <Stack spacing={2}>
              <Typography>
                {auth?.user?.firstName + " " + auth?.user?.secondName}
              </Typography>

              <Typography>{auth?.user?.email}</Typography>

              <Typography>{auth?.user?.phone}</Typography>

              <Typography>{auth?.user?.address}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </LayoutWrapper>
  );
};

export default UserProfile;
