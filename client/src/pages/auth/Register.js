import { Box, TextField, Grid, Button, Typography, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const signUp = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      userData.append("firstName", firstName);
      userData.append("secondName", secondName);
      userData.append("email", email);
      userData.append("phone", phone);
      userData.append("address", address);
      userData.append("password", password);
      userData.append("profilePhoto", profilePhoto);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/user/sign-up`,
        userData,
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success("User created");
        navigate("/login");
        setAddress("");
        setProfilePhoto("");
        setEmail("");
        setFirstName("");
        setSecondName("");
        setPassword("");
        setPhone("");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error, "Error in sign up api call");
    }
  };

  // use effect for scrolling to the top of the site
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LayoutWrapper title="Register Now">
      <Grid
        container
        xs={12}
        p="2rem"
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {" "}
        <Typography
          color="primary.main"
          variant="h4"
          fontWeight="bold"
          alignSelf="center"
        >
          {" "}
          REGISTER
        </Typography>
        <form>
          <Stack
            spacing={3}
            direction="column"
            sx={{ width: { xs: "80vw", sm: "80vw", md: "50vw" } }}
          >
            <TextField
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              label="email"
            />
            <TextField
              variant="outlined"
              label="first name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              label="second name"
              value={secondName}
              onChange={(e) => {
                setSecondName(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              label="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              label="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              label="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              id="upload-profilePhoto"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
            />
            <Button
              variant="outlined"
              onClick={() =>
                document.querySelector("#upload-profilePhoto").click()
              }
            >
              {profilePhoto ? `${profilePhoto?.name}` : "Upload Photo"}
            </Button>
            {profilePhoto ? (
              <Grid alignSelf="center" justifyContent="center" mt="2rem">
                <img
                  width="400px"
                  height="250px"
                  src={URL.createObjectURL(profilePhoto)}
                  alt="Error Loading image"
                />
              </Grid>
            ) : (
              ""
            )}
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => signUp(e)}
            >
              sign up
            </Button>
            <Grid container xs>
              <Typography
                variant="h6"
                mx="auto"
                my="2rem"
                fontWeight="light"
                alignSelf="center"
              >
                Already Have Account? <Link to="/login">Login</Link>
              </Typography>
            </Grid>
          </Stack>
        </form>
      </Grid>
    </LayoutWrapper>
  );
};

export default Register;
