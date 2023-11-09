import React, { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import slugify from "slugify";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Spinner from "../../components/Spinners/Spinner";
import parse from "html-react-parser";
import { useNavigate, useParams } from "react-router-dom";

const SearchResults = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [key, setKey] = useState("");
  const [searchedBlogs, setSearchedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/blog/search-for/${params.key}`
      );
      if (data?.success) {
        setLoading(false);
        setSearchedBlogs(data?.results);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [params.key]);

  return (
    <LayoutWrapper>
      <Box>
        <Grid container direction="column" alignItems="center" my="2vh">
          <Typography
            variant="h4"
            color="primary.main"
            fontWeight="bold"
            textTransform="uppercase"
          >
            Search results
          </Typography>
          {/* Search bar  */}
          <Grid container xs={10} justifyContent="center">
            <form>
              <TextField
                sx={{ m: "2rem", width: "90vw" }}
                variant="outlined"
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
          {/* Mapped results */}
          {loading ? (
            <Spinner />
          ) : (
            <Grid container direction="column" alignItems="center">
              <Typography variant="h5" m="2rem" mt="0">
                Search Results ({searchedBlogs?.length})
              </Typography>
              {searchedBlogs?.map((blog) => (
                <Card
                  key={blog?._id}
                  sx={{
                    width: "60vW",
                    mb: "2rem",
                  }}
                >
                  <CardHeader
                    cursor="pointer"
                    onClick={() =>
                      document.querySelector(`#read-more${blog._id}`).click()
                    }
                    title={blog?.title}
                    subheader={blog?.author?.firstName}
                    action={
                      <IconButton
                        onClick={(e) => {
                          navigate(`/read-blog/${blog?._id}`);
                        }}
                        id={`read-more${blog._id}`}
                      >
                        Read more
                      </IconButton>
                    }
                  />
                  {blog?._id ? (
                    <CardMedia
                      cursor="pointer"
                      onClick={() =>
                        document.querySelector(`#read-more${blog._id}`).click()
                      }
                      component="img"
                      src={`${process.env.REACT_APP_API}/api/v1/blog/get-photo/${blog?._id}`}
                      alt="Blog-photo"
                    />
                  ) : (
                    ""
                  )}
                  <CardContent>
                    <Typography>{parse(blog?.content)}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )}
        </Grid>
      </Box>
    </LayoutWrapper>
  );
};

export default SearchResults;
