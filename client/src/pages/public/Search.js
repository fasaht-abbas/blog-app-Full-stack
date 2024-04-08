import React, { useState } from "react";
import slugify from "slugify";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import {
  Grid,
  InputAdornment,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState("");

  return (
    <LayoutWrapper title="Search Blogs">
      <Grid container xs={12} direction="column" alignItems="center" my="2rem">
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          textTransform="uppercase"
        >
          Search for Blogs
        </Typography>
        {/* Search bar  */}
        <Grid container xs={12} justifyContent="center">
          <form>
            <TextField
              sx={{ m: "2rem", width: "90vw" }}
              variant="outlined"
              fontWeight="bold"
              placeholder="Search Blogs"
              onChange={(e) => setKey(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      size="small"
                      edge="end"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/search-results/${slugify(key)}`);
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Grid>
        {/* Mapped trending blogs go here */}
      </Grid>
    </LayoutWrapper>
  );
};

export default Search;
