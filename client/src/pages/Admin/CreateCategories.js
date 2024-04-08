import React, { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import {
  TextField,
  Button,
  Grid,
  ListItem,
  ListItemText,
  List,
  Modal,
} from "@mui/material";
import toast from "react-hot-toast";
import CreatePrivateInstance from "../../components/AxiosInstance";
import axios from "axios";

const CreateCategories = () => {
  const axiosPrivate = CreatePrivateInstance();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  //getting all the categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/cat/get-cats`
      );
      if (data?.success) {
        setCategories(data?.allCategories);
        toast.success("all categories");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  // use effect for scrolling to the top of the site
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // creating the category
  const createCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosPrivate.post(
        `${process.env.REACT_APP_API}/api/v1/cat/create-cat`,
        {
          name,
        },
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        setName("");
        getAllCategories();
        toast.success("category created");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error could not create a category");
    }
  };

  //Updating the category  **********Abhi payload dena ha
  const updateCategory = async (c) => {
    try {
      const { data } = await axiosPrivate.put(
        `${process.env.REACT_APP_API}/api/v1/update-cat/${c._id}`,
        { withCredentials: true }
      );
      if (data?.success) {
        getAllCategories();
        toast.success("updated category");
      }
    } catch (error) {
      toast.error("updating failed");
      console.log(error);
    }
  };

  //deleting the categories
  const dltCategory = async (c) => {
    try {
      const { data } = await axiosPrivate.delete(
        `${process.env.REACT_APP_API}/api/v1/cat/delete-category/${c._id}`,
        {
          name,
        },
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        toast.success("delete successfully");
        getAllCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <LayoutWrapper title="Admin-Create category">
      <Grid p="2rem" container xs={12}>
        <Grid container justifyContent="center" alignItems="center" xs={8}>
          <List>
            {categories.map((category) => (
              <ListItem key={category._id}>
                <ListItemText primary={category.name} />
                {/* here is the modal for updating the category */}

                <Modal
                  open={open}
                  onClose={setOpen(false)}
                  aria-labelledby="modal-title"
                  aria-describedby="modal-description"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "500px" }}>
                    <h2 id="modal-title">Update Category</h2>

                    <TextField
                      id="outlined-basic"
                      label="Textfield"
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div style={{ display: "flex", justifyContent: "end" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => updateCategory(selected)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setOpen(false);
                          setSelected(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Modal>

                <Button
                  onClick={() => {
                    setOpen(true);
                    setSelected(category);
                    setName(selected?.name);
                  }}
                >
                  Edit
                </Button>

                <Button onClick={() => dltCategory(category)}>Delete</Button>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid container direction="column" alignItems="center" xs={4}>
          <form>
            <TextField
              fullWidth
              label="add category"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Button type="submit" onClick={(e) => createCategory(e)}>
              Add Category
            </Button>
          </form>
        </Grid>
      </Grid>
    </LayoutWrapper>
  );
};
export default CreateCategories;
