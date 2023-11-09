import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinners/Spinner";
import { Link } from "react-router-dom";
const Login = () => {
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // use effect for scrolling to the top of the site
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loginHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (data?.success) {
        setLoading(false);
        setAuth({
          ...auth,
          user: data.user,
          accessToken: data.accessToken,
        });
        navigate("/");
        toast.success("logged in successfuly");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("error in login");
      console.log(error);
    }
  };
  const logoutHandler = async (e) => {
    e.preventDefault();
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
        toast.success("logged out succesfully");
      } else {
        toast.error("error in loging out");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <LayoutWrapper title="Login Now">
      <form>
        <Grid
          container
          xs={12}
          p="2rem"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            spacing={3}
            direction="column"
            sx={{ width: { xs: "80vw", sm: "80vw", md: "50vw" } }}
          >
            <Typography
              color="primary.main"
              variant="h4"
              fontWeight="bold"
              alignSelf="center"
            >
              {" "}
              LOGIN
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              label="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Typography alignSelf="center">
              Forgot Password ? <Link to="/reset-password">Reset Now</Link>
            </Typography>

            <Button
              type="submit"
              variant="contained"
              onClick={(e) => loginHandler(e)}
            >
              Login
            </Button>
          </Stack>
        </Grid>
      </form>
    </LayoutWrapper>
  );
};

export default Login;
