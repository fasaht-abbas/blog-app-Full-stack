import React, { useState, useEffect } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Grid,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import parse from "html-react-parser";
import Spinner from "../../components/Spinners/Spinner";
import toast from "react-hot-toast";

const CategoryFilteredBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const getblogs = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/blog/category-filter/${params.id}`,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setLoading(false);
        setBlogs(data?.blogs);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // getting the category

  const getCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/cat/get-one/${params.id}`
      );
      if (data.success) {
        setCategory(data?.category);
      } else {
        toast.error("Error in getting category");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getblogs();
    getCategory();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <LayoutWrapper title={category ? ` ${category?.name}` : "Category filter"}>
      <Box>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h4" fontWeight="light" m="2rem">
            Results for {category?.name} ({blogs?.length})
          </Typography>

          <Grid container direction="column" alignItems="center">
            {blogs?.map((blog) => (
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
                    <Grid container>
                      <IconButton
                        id={`read-more${blog._id}`}
                        onClick={(e) => navigate(`/read-blog/${blog._id}`)}
                      >
                        Read more
                      </IconButton>
                    </Grid>
                  }
                />
                <CardMedia
                  cursor="pointer"
                  onClick={() =>
                    document.querySelector(`#read-more${blog._id}`).click()
                  }
                  component="img"
                  src={`${process.env.REACT_APP_API}/api/v1/blog/get-photo/${blog?._id}`}
                  alt="Blog-photo"
                />
                <CardContent>
                  <Typography>{parse(blog?.content)}</Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Box>
    </LayoutWrapper>
  );
};

export default CategoryFilteredBlogs;
