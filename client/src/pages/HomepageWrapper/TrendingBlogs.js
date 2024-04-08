import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import Spinner from "../../components/Spinners/Spinner";
import {
  headingTypo,
  normalTypo,
  subHeadingTypo,
} from "../../components/StyledComponents";

const TrendingBlogs = () => {
  const navigate = useNavigate();
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTrendingBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/blog/trending-blogs`
      );
      if (data?.success) {
        setTrendingBlogs(data?.trendingBlogs);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTrendingBlogs();
  }, []);

  // for responsive carousel
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 700 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "50vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "accent.main",
      }}
    >
      <Grid container sx={12} justifyContent="center" p="1rem">
        <Typography
          style={headingTypo}
          sx={{
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" },
          }}
          color="secondary.main"
        >
          Trending Blogs
        </Typography>
      </Grid>
      {/* Mapping the Trending Blogs in the carousel as separate Cards */}

      {loading ? (
        <Spinner />
      ) : (
        <Carousel
          responsive={responsive}
          autoPlay={true}
          autoPlaySpeed={2000}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          arrows={true}
          swipeable={true}
          infinite={true}
          centerMode={{ xs: false, sm: true, md: true }}
        >
          {trendingBlogs?.map((blog) => (
            <Card
              sx={{
                maxWidth: "400px",
                border: "2px solid",
                borderColor: "primary.main",
                m: "2vw",
                p: "0.5rem",
                pt: "2vh",
                cursor: "pointer",
                boxShadow: [
                  {
                    shadowColor: "rgba(50, 50, 93, 0.25)",
                    shadowOffset: {
                      width: 0,
                      height: 50,
                    },
                    blurRadius: 100,
                    spread: -20,
                  },
                  {
                    shadowColor: "rgba(0, 0, 0, 0.3)",
                    shadowOffset: {
                      width: 0,
                      height: 30,
                    },
                    blurRadius: 60,
                    spread: -30,
                  },
                ],
              }}
              key={blog?._id}
              onClick={() =>
                document.querySelector(`#read-more${blog?._id}`).click()
              }
            >
              <CardHeader
                sx={{ maxHeight: "20vh" }}
                title={
                  <>
                    <Typography
                      sx={{
                        height: "5vh",
                        mb: "0.5vh",
                        fontSize: {
                          xs: "0.8rem",
                          sm: "1rem",
                          md: "1.2rem",
                          lg: "1.5rem",
                        },
                        textTransform: "capitalize",
                      }}
                      style={subHeadingTypo}
                      variant="body2"
                      fontWeight="light"
                    >
                      {blog?.title.substring(0, 22)}...
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      maxHeight="10vh"
                      alignItems="center"
                    >
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        src={`${process.env.REACT_APP_API}/api/v1/user/get-photo/${blog?.author?._id}`}
                        alt={`${blog?.author?._id}`}
                      />
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.8rem",
                            sm: "1rem",
                            md: "1.2rem",
                            lg: "1.5rem",
                          },
                          textTransform: "capitalize",
                        }}
                      >
                        {" "}
                        {blog?.author?.firstName +
                          " " +
                          blog?.author?.secondName}{" "}
                      </Typography>
                    </Stack>
                  </>
                }
              />
              <CardContent>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.8rem",
                      sm: "1rem",
                      md: "1.2rem",
                      lg: "1.5rem",
                    },
                  }}
                  style={normalTypo}
                  height="50px"
                  overflow="hidden"
                  variant="body2"
                >
                  {parse(blog?.content)}
                </Typography>
                <Typography>...</Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontWeight: "bold" }}
                fullWidth
                id={`read-more${blog?._id}`}
                onClick={() => navigate(`/read-blog/${blog?._id}`)}
              >
                Read Blog
              </Button>
            </Card>
          ))}
        </Carousel>
      )}
    </Box>
  );
};

export default TrendingBlogs;
