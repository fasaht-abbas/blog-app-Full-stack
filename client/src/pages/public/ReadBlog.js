import React, { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import axios from "axios";
import {
  Typography,
  Box,
  Grid,
  CardHeader,
  CardContent,
  CardMedia,
  Card,
  TextField,
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
  InputAdornment,
  CardActions,
  Avatar,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Spinner from "../../components/Spinners/Spinner";
import CreatePrivateInstance from "../../components/AxiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const ReadBlog = () => {
  const [auth] = useAuth();
  const axiosPrivate = CreatePrivateInstance();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [editCommentOpen, setEditCommentOpen] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [allLikes, setAllLikes] = useState([]);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [liked, setLiked] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  //getting the blog
  const getBlog = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/blog/get-blog/${id}`
      );
      if (data?.success) {
        setLoading(false);
        setBlog(data?.blog);
        setAllComments(data?.blog?.comments);
        setAllLikes(data?.blog?.likes);
        getAllComments();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getBlog();
  }, [auth?.accessToken && auth?.accessToken !== undefined]);

  // getting all the comments
  const getAllComments = async () => {
    try {
      setCommentLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/comment/get-comments/${id}`
      );
      if (data.success) {
        setCommentLoading(false);
        setAllComments(data?.allComments);
      }
    } catch (error) {
      setCommentLoading(false);
      console.log(error);
    }
  };

  //posting the comment
  const postComment = async () => {
    try {
      if (auth?.accessToken) {
        const { data } = await axiosPrivate.post(
          `${process.env.REACT_APP_API}/api/v1/comment/create-comment`,
          {
            commenter: auth?.user._id,
            comment: comment,
            blog: blog._id,
          },
          {
            withCredentials: true,
          }
        );
        if (data?.success) {
          setComment("");
          getAllComments();
          toast.success("comment Posted successfully");
        }
      } else {
        setLoginOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // deleting the comment
  const deleteComment = async (id) => {
    try {
      const { data } = await axiosPrivate.delete(
        `${process.env.REACT_APP_API}/api/v1/comment/delete-comment/${id}`,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        setSelected("");
        getAllComments();
        toast.success("comment deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // editing the comment
  const editComment = async (id) => {
    try {
      const { data } = await axiosPrivate.put(
        `${process.env.REACT_APP_API}/api/v1/comment/edit-comment/${id}`,
        {
          editedComment: comment,
        }
      );
      if (data?.success) {
        setSelected("");
        getAllComments();
        toast.success("edited successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLikes = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/blog/all-likes/${id}`
      );
      if (data.success) {
        setAllLikes(data?.allLikes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handling the click on the like button
  const onLikeClick = async () => {
    try {
      setLiked((prevValue) => !prevValue);
      const { data } = await axiosPrivate.put(
        `${process.env.REACT_APP_API}/api/v1/blog/like-post/${id}`,
        {
          user: auth?.user._id,
        },
        { withCredentials: true }
      );
      if (data?.success) {
        setLiked(data?.nowLiked);
        getAllLikes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // checking weather the user has liked the blog or not
  const checkLikedUser = async () => {
    try {
      const { data } = await axiosPrivate.get(
        `${process.env.REACT_APP_API}/api/v1/blog/check-liked/${id}/${auth?.user?._id}`,
        { withCredentials: true }
      );
      if (data?.success) {
        setLiked(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.accessToken) {
      checkLikedUser();
    }
  }, [blog]);

  const countView = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/blog/view-counter`,
        {
          blogId: id,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      countView();
    }, 20000);
  }, [setBlog]);

  return loading ? (
    <Spinner />
  ) : (
    <LayoutWrapper title={blog ? `${blog?.title}` : "Read Blog"}>
      <Box>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          padding="2rem"
        >
          {/* dialog for the login popup */}
          <Dialog
            open={loginOpen}
            onClose={() => setLoginOpen(false)}
            fullWidth
          >
            <DialogTitle>{"Login First ?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>Your Need to login first .</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setLoginOpen(false)}>cancel</Button>
              <Button
                onClick={() => {
                  setLoginOpen(false);
                  navigate("/login");
                }}
                autoFocus
              >
                Login
              </Button>
            </DialogActions>
          </Dialog>
          {/* dialog for showiung all the likes */}
          <Dialog
            open={showLikes}
            onClose={() => setShowLikes(false)}
            fullWidth
            minHeight="40vh"
          >
            <DialogTitle>Likes</DialogTitle>
            <DialogContent>
              {allLikes.length < 1
                ? "No likes yet"
                : allLikes.map((like) => (
                    <Stack spacing={3} key={like._id}>
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Avatar
                          alt={like.firstName}
                          src={`${process.env.REACT_APP_API}/api/v1/user/get-photo/${like._id}`}
                        />
                        <Typography variant="h6">{like?.firstName}</Typography>
                      </Stack>
                    </Stack>
                  ))}
            </DialogContent>
          </Dialog>
          {/* dialog for wiewing all the comments */}
          <Dialog
            fullWidth
            open={commentOpen}
            onClose={() => setCommentOpen(false)}
          >
            {commentLoading ? (
              <Spinner />
            ) : (
              <>
                <DialogTitle>Comments</DialogTitle>
                {allComments?.length < 1 ? (
                  <Typography ml="1.5rem" mb="1rem">
                    No comments
                  </Typography>
                ) : (
                  allComments?.map((comm) => (
                    <Stack direction="row" spacing={2} key={comm?._id} m="1rem">
                      {/* dialog for the deleting  comment */}
                      <Dialog
                        open={deleteMenuOpen}
                        onClose={() => setDeleteMenuOpen(false)}
                        fullWidth
                      >
                        <DialogTitle>Delete Comment?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            <Typography>
                              Are you sure you want to delete the comment
                            </Typography>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setDeleteMenuOpen(false)}>
                            cancel
                          </Button>
                          <Button
                            onClick={() => {
                              setDeleteMenuOpen(false);
                              deleteComment(selected._id);
                            }}
                          >
                            delete
                          </Button>
                        </DialogActions>
                      </Dialog>

                      {/* dialog for the edit comment */}
                      <Dialog
                        open={editCommentOpen}
                        onClose={() => setEditCommentOpen(false)}
                        fullWidth
                      >
                        <DialogTitle>edit Comment</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            <TextField
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              fullWidth
                            />
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setEditCommentOpen(false)}>
                            cancel
                          </Button>
                          <Button
                            onClick={() => {
                              setEditCommentOpen(false);
                              editComment(selected._id);
                            }}
                          >
                            save Changes
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <Avatar
                        alt={comm?.commenter?.firstName}
                        src={`${process.env.REACT_APP_API}/api/v1/user/get-photo/${comm?.commenter?._id}`}
                      />
                      <Typography variant="h6">
                        {comm?.commenter?.firstName}
                      </Typography>
                      <Typography variant="body2" flexGrow="3" mt="1rem">
                        {comm?.comment}
                      </Typography>
                      {(auth?.accessToken &&
                        auth?.user._id === comm?.commenter?._id) ||
                      auth?.user?._id === blog?.author._id ? (
                        <Stack spacing={1} direction="row">
                          <IconButton
                            onClick={() => {
                              setEditCommentOpen(true);
                              setComment(comm.comment);
                              setSelected(comm);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setDeleteMenuOpen(comm._id);
                              setSelected(comm);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      ) : (
                        ""
                      )}
                    </Stack>
                  ))
                )}
              </>
            )}
          </Dialog>

          {/* card for viewing the blog */}
          <Card sx={{ width: "70vw" }}>
            <CardHeader
              title={`Title : ${blog?.title}`}
              subheader={`Author : ${blog?.author?.firstName}`}
            />

            {blog?._id ? (
              <CardMedia
                component="img"
                src={`${process.env.REACT_APP_API}/api/v1/blog/get-photo/${blog?._id}`}
              />
            ) : (
              ""
            )}
            <CardContent>
              <Stack spacing={2}>
                <Typography>Description : {`${blog?.description}`}</Typography>
                <Typography variant="body2">
                  Content : {parse(`${blog?.content}`)}
                </Typography>
                <TextField
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                  placeholder="Post a Comment"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={postComment}>Post</Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setCommentOpen(true);
                }}
              >{`${allComments?.length} comments`}</Button>

              <Button
                size="small"
                onClick={() =>
                  auth?.accessToken
                    ? onLikeClick(blog?._id)
                    : setLoginOpen(true)
                }
              >
                {allLikes?.length}{" "}
                {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </Button>
              <Button size="small" onClick={() => setShowLikes(true)}>
                see likes
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Box>
    </LayoutWrapper>
  );
};

export default ReadBlog;
