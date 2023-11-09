import React, { useState, useEffect } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import {
  Grid,
  Card,
  Button,
  CardMedia,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Modal,
  Box,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CreatePrivateInstance from "../../components/AxiosInstance";
import { useAuth } from "../../Context/AuthContext";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinners/Spinner";

const AllBlogs = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [allBlogs, setAllBlogs] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const handleClose = () => {
    setOpenDelete(false);
  };
  const axiosPrivate = CreatePrivateInstance();

  const AllUserBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(
        `${process.env.REACT_APP_API}/api/v1/blog/get-user-blogs/${auth?.user?._id}`
      );
      if (data?.success) {
        setLoading(false);
        setAllBlogs(data?.allBlogs);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    AllUserBlogs();
  }, []);

  // use effect for scrolling to the top of the site

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.delete(
        `${process.env.REACT_APP_API}/api/v1/blog/delete-blog/${id}`,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        setSelected("");
        setLoading(false);
        toast.success("Blog Deleted Permanently");
        AllUserBlogs();
      }
    } catch (error) {
      setLoading(false);
      toast.error("something went wrong please wait and try later");
      console.log(error);
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <LayoutWrapper title="All Writings">
      <Box>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" my="2rem">
            All Your Writings ({allBlogs?.length})
          </Typography>
          {allBlogs?.map((blog) => (
            <Card
              key={blog?._id}
              sx={{
                width: "60vW",
                mb: "2rem",
              }}
            >
              <CardHeader
                title={blog?.title}
                subheader={blog?.author?.firstName}
                action={
                  <Grid container>
                    <IconButton
                      onClick={(e) =>
                        navigate(`/private/update-blog/${blog?._id}`)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setOpenDelete(true);
                        setSelected(blog?._id);
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Grid>
                }
              />
              <CardMedia
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
        {/* dialoge for confirming the blog deletion */}
        <Dialog
          open={openDelete}
          onClose={handleClose}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DialogContent>
            <DialogContentText>
              Are you sure? will be permanantly deleted
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>cancel</Button>
            <Button
              onClick={() => {
                handleDelete(selected);
                setOpenDelete(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LayoutWrapper>
  );
};

export default AllBlogs;
