import React, { useState } from "react";
import slugify from "slugify";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  IconButton,
  Typography,
  CardMedia,
  Card,
  CardHeader,
  CardContent,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Spinner from "../../components/Spinners/Spinner";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState("");
  const [searchedBlogs, setSearchedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/blog/get`
      );
    } catch (error) {
      console.log(error);
    }
  };

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
