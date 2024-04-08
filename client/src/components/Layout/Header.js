import axios from "axios";
import toast from "react-hot-toast";
import {
  AppBar,
  Box,
  Toolbar,
  Stack,
  Avatar,
  Modal,
  Grow,
  Grid,
  Menu,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../Context/AuthContext";
import { StyledNavLink, subHeadingTypo } from "../StyledComponents";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleModalToggle = () => {
    setModalOpen((prevState) => !prevState);
  };

  const menuAnchor = document.getElementById("user-menu");

  const handleMenuOpen = () => {
    setMenuOpen((prevState) => !prevState);
  };
  const logoutHandler = async () => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/user/logout`,
        { withCredentials: true }
      );
      if (data?.success) {
        setAuth({
          ...auth,
          user: null,
          accessToken: "",
        });
        navigate("/login");
        toast.success("logged out succesfully");
      } else {
        toast.error("error in loging out");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid minHeight="8vh">
      <AppBar
        sx={{
          backgroundColor: "primary.main",
          borderBottom: "1px solid",
          borderColor: "primary.main",
        }}
      >
        <Toolbar justifyContent="space-between">
          <StyledNavLink to="/">
            <Typography fontWeight="bold" color="secondary.main">
              BH BLOGS
            </Typography>
          </StyledNavLink>
          {/* desktop Navbar */}
          <Stack
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
            flexGrow={1}
            justifyContent="flex-end"
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <StyledNavLink to="/search-blogs">
              <Typography style={subHeadingTypo}>Search Blogs</Typography>
            </StyledNavLink>
            <StyledNavLink to="/private/create-blog">
              <Typography style={subHeadingTypo}>Write new</Typography>
            </StyledNavLink>

            {auth?.accessToken ? (
              <>
                <StyledNavLink onClick={handleMenuOpen}>
                  <Menu
                    open={menuOpen}
                    anchorEl={menuAnchor}
                    onClose={() => handleMenuOpen}
                  >
                    <MenuItem onClick={() => handleMenuOpen}>
                      {" "}
                      <StyledNavLink onClick={logoutHandler}>
                        <Typography style={subHeadingTypo}>Logout</Typography>
                      </StyledNavLink>
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuOpen}>
                      <StyledNavLink to="/private/all-blogs">
                        <Typography style={subHeadingTypo}>
                          All Writings
                        </Typography>
                      </StyledNavLink>
                    </MenuItem>
                    <MenuItem>
                      <StyledNavLink to="/private/user-profile">
                        <Typography style={subHeadingTypo}>Profile</Typography>
                      </StyledNavLink>
                    </MenuItem>
                  </Menu>
                  <Stack
                    id="user-menu"
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Avatar
                      alt="No Photo"
                      src={`${process.env.REACT_APP_API}/api/v1/user/get-photo/${auth?.user?._id}`}
                    />
                  </Stack>
                </StyledNavLink>
              </>
            ) : (
              <>
                <StyledNavLink to="/register" sx={{ color: "accent.main" }}>
                  <Typography style={subHeadingTypo}>Sign Up</Typography>
                </StyledNavLink>
                <StyledNavLink to="/login" sx={{ color: "accent.main" }}>
                  <Typography style={subHeadingTypo}>login</Typography>
                </StyledNavLink>
              </>
            )}
          </Stack>

          {/* Mobile and Tab Navbar */}
          <Stack
            sx={{ display: { sm: "flex", md: "none" } }}
            flexGrow={1}
            justifyContent="flex-end"
            alignItems="center"
            direction="row"
            spacing={1}
          >
            {auth?.accessToken ? (
              <>
                <Avatar
                  sx={{ width: 35, height: 35 }}
                  src={`${process.env.REACT_APP_API}/api/v1/user/get-photo/${auth?.user?._id}`}
                  alt={`${auth?.user?.firstName}`}
                />
              </>
            ) : (
              ""
            )}
            <IconButton color="secondary.main" onClick={handleModalToggle}>
              <MenuIcon />
            </IconButton>

            <Modal
              slotProps={{
                backdrop: {
                  sx: {
                    backgroundColor: "accent.main",
                  },
                },
              }}
              open={modalOpen}
              onClose={() => handleModalToggle}
            >
              <Grow in={modalOpen}>
                <Box justifyContent="center" alignItems="center">
                  <Stack
                    spacing={3}
                    container
                    direction="column"
                    alignItems="center"
                  >
                    <IconButton
                      onClick={() => setModalOpen(false)}
                      sx={{ alignSelf: "end", mr: "1rem" }}
                    >
                      x
                    </IconButton>

                    <Typography
                      style={subHeadingTypo}
                      variant="h5"
                      fontWeight="bold"
                    >
                      BH Blogs
                    </Typography>

                    <StyledNavLink to="/">
                      <Typography style={subHeadingTypo}>Home</Typography>
                    </StyledNavLink>

                    <StyledNavLink to="/search-blogs">
                      <Typography style={subHeadingTypo}>Search</Typography>
                    </StyledNavLink>
                    <StyledNavLink to="/private/all-blogs">
                      <Typography style={subHeadingTypo}>
                        All Writings
                      </Typography>
                    </StyledNavLink>
                    <StyledNavLink to="/private/create-blog">
                      <Typography style={subHeadingTypo}>Write blog</Typography>
                    </StyledNavLink>

                    {auth?.accessToken ? (
                      <>
                        <StyledNavLink onClick={logoutHandler}>
                          <Typography style={subHeadingTypo}>Logout</Typography>
                        </StyledNavLink>

                        <StyledNavLink to="/private/user-profile">
                          <Typography style={subHeadingTypo}>
                            See Profile
                          </Typography>
                        </StyledNavLink>
                      </>
                    ) : (
                      <>
                        <StyledNavLink to="/register">
                          <Typography style={subHeadingTypo}>
                            Sign Up
                          </Typography>
                        </StyledNavLink>
                        <StyledNavLink to="/login">
                          <Typography style={subHeadingTypo}>Log in</Typography>
                        </StyledNavLink>
                      </>
                    )}
                  </Stack>
                </Box>
              </Grow>
            </Modal>
          </Stack>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Header;
