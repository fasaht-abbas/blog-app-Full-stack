import {
  Box,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Button,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import axios from "axios";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import CreatePrivateInstance from "../../components/AxiosInstance";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinners/Spinner";
const UpdateBlog = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const editor = useRef(null);
  const [auth] = useAuth();
  const [title, setTitle] = useState("");
  const [blogPhoto, setBlogPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = CreatePrivateInstance();

  // get all the categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/cat/get-cats`
      );
      if (data?.success) {
        setOriginalCategories(data?.allCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  // adding the keyWord
  const AddKeyword = () => {
    keywords.push(newKeyword);
    setNewKeyword("");
  };

  // selection change
  // the sam code lies in the create blog sect5ion agar samjh na ai to refrence le lena
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategories(typeof value === "string" ? value.split(",") : value);
  };
  // deleting the keyword
  const deleteKeyword = (k) => {
    const filtered = keywords.filter((element) => element !== k);
    setKeywords(filtered);
  };

  // config for the editor
  const config = {
    readonly: false,
    toolbar: true,
    height: "500px",
  };

  // use effect for scrolling to the top of the site
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // handle disable
  const handleDisable = () => {
    if (keywords.length < 5) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };
  useEffect(() => {
    handleDisable();
  }, [keywords.length]);

  //getting the actual blog
  const gettingBlog = async () => {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(
        `${process.env.REACT_APP_API}/api/v1/blog/get-blog/${id}`,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        setLoading(false);
        setTitle(data?.blog?.title);
        setDescription(data?.blog?.description);
        setContent(data?.blog?.content);
        setCategories(data?.blog?.categories);
        setKeywords(data?.blog.keywords);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    gettingBlog();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const blogData = new FormData();
      blogData.append("title", title);
      blogData.append("description", description);
      blogData.append("categories", categories);
      blogData.append("keywords", keywords);
      blogData.append("content", content);
      blogData.append("blogPhoto", blogPhoto);
      blogData.append("userId", auth?.user?._id);

      const { data } = await axiosPrivate.put(
        `${process.env.REACT_APP_API}/api/v1/blog/update-blog/${id}`,
        blogData,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        setLoading(false);
        navigate("/private/all-blogs");
        toast.success("Blog updated successfully");
        setBlogPhoto("");
        setTitle("");
        setDescription("");
        setContent("");
        setCategories([]);
        setKeywords([]);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return loading ? (
    <Spinner />
  ) : (
    <LayoutWrapper title={title ? `Update ${title}` : "Update Blog"}>
      <Box>
        <Grid
          container
          xs={12}
          direction="column"
          alignItems="center"
          padding="2rem"
        >
          <Grid item justifyContent="center">
            <Typography variant="h4" mb="1rem">
              Update {title ? `${title.substring(0, 15)}...` : "Blog"}
            </Typography>
          </Grid>

          <Grid container direction="column" xs={10}>
            <TextField
              sx={{ mb: "1rem" }}
              fullWidth
              label="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              sx={{ mb: "1rem" }}
              label="description"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <JoditEditor
              ref={editor}
              config={config}
              value={content}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
            />
            <input
              sx={{ my: "1rem" }}
              id="upload-photo"
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => setBlogPhoto(e.target.files[0])}
            />

            {blogPhoto ? (
              <Grid container justifyContent="center" mt="2rem">
                <img
                  width="400px"
                  height="250px"
                  src={URL.createObjectURL(blogPhoto)}
                  alt="Error Loading image"
                />
              </Grid>
            ) : (
              <Grid container justifyContent="center" mt="2rem">
                <img
                  width="400px"
                  height="250px"
                  src={`${process.env.REACT_APP_API}/api/v1/blog/get-photo/${id}`}
                  alt="no-photo"
                />
              </Grid>
            )}
            <Button
              sx={{ my: "2rem" }}
              variant="outlined"
              onClick={() => document.querySelector("#upload-photo").click()}
            >
              {blogPhoto ? blogPhoto.name : "update photo"}
            </Button>

            <Typography variant="h5" my="1rem">
              Select Categories
            </Typography>
            <Select multiple value={categories} onChange={handleChange}>
              {originalCategories.map((c) => (
                <MenuItem key={c?._id} value={c?._id}>
                  {c?.name}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="h5" my="1rem">
              Write some keywords (max 5)
            </Typography>
            <TextField
              label="Add Keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      disabled={disabled}
                      edge="end"
                      color="primary"
                      onClick={AddKeyword}
                    >
                      <AddIcon />
                      add
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Grid container mb="2rem">
              {keywords.map((key) => (
                <>
                  <Typography key={key}>
                    {key}{" "}
                    <Button size="small" onClick={(e) => deleteKeyword(key)}>
                      x
                    </Button>
                  </Typography>
                </>
              ))}
            </Grid>

            <Button
              variant="contained"
              onClick={() => {
                handleSubmit();
                navigate("/private/all-blogs");
              }}
            >
              Update Blog
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LayoutWrapper>
  );
};

export default UpdateBlog;
