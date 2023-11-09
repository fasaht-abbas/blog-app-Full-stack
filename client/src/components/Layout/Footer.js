import { Box, Typography, Grid } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { StyledFooterLink } from "../StyledComponents";

const Footer = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/cat/get-cats`
      );
      if (data?.success) {
        setCategories(data?.allCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <Box minHeight="10vh" my="1rem" sx={{ backgroundColor: "primary.main" }}>
      <Grid
        container
        minHeight="10vh"
        xs
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          container
          xs={10}
          sx={{ flexDirection: { xs: "column", sm: "row" } }}
          justifyContent="space-between"
          rowSpacing={2}
          m="1rem"
          p="2rem"
        >
          <Grid item direction="column">
            <Typography color="secondary.main" variant="h6" fontWeight="bold">
              Pages
            </Typography>
            <StyledFooterLink to="/">
              <Typography variant="h6" fontWeight="light">
                Homepage
              </Typography>
            </StyledFooterLink>
            <StyledFooterLink to="/search-blogs">
              <Typography variant="h6" fontWeight="light">
                Search
              </Typography>
            </StyledFooterLink>

            {auth?.accessToken ? (
              <>
                <StyledFooterLink to="/user-profile">
                  <Typography variant="h6" fontWeight="light">
                    Profile
                  </Typography>
                </StyledFooterLink>

                <StyledFooterLink to="/all-writings">
                  <Typography variant="h6" fontWeight="light">
                    All My Blogs
                  </Typography>
                </StyledFooterLink>
              </>
            ) : (
              <>
                <StyledFooterLink to="/login">
                  <Typography variant="h6" fontWeight="light">
                    Login
                  </Typography>
                </StyledFooterLink>

                <StyledFooterLink to="/register">
                  <Typography variant="h6" fontWeight="light">
                    SignUp
                  </Typography>
                </StyledFooterLink>
              </>
            )}
            <StyledFooterLink to="/private/create-blog">
              <Typography variant="h6" fontWeight="light">
                Write Blog
              </Typography>
            </StyledFooterLink>
          </Grid>
          <Grid item direction="column">
            <Typography color="secondary.main" variant="h6" fontWeight="bold">
              Categories
            </Typography>
            {categories.map((c) => (
              <StyledFooterLink to={`/category-filter/${c?._id}`}>
                <Typography key={c._id} variant="h6" fontWeight="light">
                  {c.name}
                </Typography>
              </StyledFooterLink>
            ))}
          </Grid>
          <Grid item direction="column">
            <Typography color="secondary.main" variant="h6" fontWeight="bold">
              Products
            </Typography>
            <StyledFooterLink to="https://buyershub.cyclic.app">
              <Typography variant="h6" fontWeight="light">
                BuyersHub
              </Typography>
            </StyledFooterLink>
          </Grid>
          <Grid item direction="column">
            <Typography color="secondary.main" variant="h6" fontWeight="bold">
              Technology
            </Typography>
            <StyledFooterLink>
              <Typography variant="h6" fontWeight="light">
                Stack info
              </Typography>
            </StyledFooterLink>

            <StyledFooterLink>
              <Typography variant="h6" fontWeight="light">
                Team Members
              </Typography>
            </StyledFooterLink>
            <StyledFooterLink>
              <Typography variant="h6" fontWeight="light">
                Version
              </Typography>
            </StyledFooterLink>
          </Grid>
          <Grid item direction="column">
            <Typography color="secondary.main" variant="h6" fontWeight="bold">
              Social Media
            </Typography>
            <StyledFooterLink to="https://www.facebook.com">
              <Typography variant="h6" fontWeight="light">
                Facebook
              </Typography>
            </StyledFooterLink>
            <StyledFooterLink to="https://www.twitter.com">
              <Typography variant="h6" fontWeight="light">
                Twitter
              </Typography>
            </StyledFooterLink>
            <StyledFooterLink to="https://www.linkedin.com">
              <Typography variant="h6" fontWeight="light">
                LinkedIn
              </Typography>
            </StyledFooterLink>

            <StyledFooterLink to="https://www.instagram.com">
              <Typography variant="h6" fontWeight="light">
                Instagram
              </Typography>
            </StyledFooterLink>

            <StyledFooterLink to="https://web.whatsapp.com">
              <Typography variant="h6" fontWeight="light">
                Whatsapp
              </Typography>
            </StyledFooterLink>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        marginBottom="2rem"
      >
        <Typography color="secondary.main" variant="h6" fontWeight="light">
          copyright &copy; All rights reserved @BHblogs.com
        </Typography>
      </Grid>
      <hr />
    </Box>
  );
};

export default Footer;
