import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { headingTypo } from "../../components/StyledComponents";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  //getting all the categories
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
    <Box
      gutterBottom
      sx={{
        backgroundColor: "accent.main",
        minHeight: "80vh",
      }}
    >
      <Grid
        container
        direction="column"
        xs={12}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs m="1rem">
          <Typography
            style={headingTypo}
            sx={{
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" },
            }}
            fontWeight="bold"
          >
            Categories
          </Typography>
        </Grid>
        <Grid item xs>
          <Grid container justifyContent="center" alignItems="center">
            {categories.map((c) => (
              <Button
                color="secondary"
                onClick={() => navigate(`/category-filter/${c?._id}`)}
                key={c._id}
              >
                <Grid
                  container
                  variant="outlined"
                  style={{
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    height: "100px",
                    width: "200px",
                    justifyContent: "center",
                    padding: "1rem",
                    alignItems: "center",
                    margin: "2rem",
                  }}
                >
                  <Typography
                    fontSize="20px"
                    fontWeight="bold"
                    variant="body2"
                    align="center"
                  >
                    {c.name}
                  </Typography>
                </Grid>
              </Button>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Categories;
