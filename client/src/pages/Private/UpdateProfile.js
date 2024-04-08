import React, { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import Spinner from "../../components/Spinners/Spinner";

import {
  Grid,
  Typography,
  TextField,
  Link,
  Button,
  Stack,
} from "@mui/material";
import CreatePrivateInstance from "../../components/AxiosInstance";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosPrivate = CreatePrivateInstance();

  const getUser = async () => {
    setFirstName(auth?.user?.firstName);
    setSecondName(auth?.user?.secondName);
    setEmail(auth?.user?.email);
    setPhone(auth?.user?.phone);
    setPassword(auth?.user?.password);
    setAddress(auth?.user?.address);
  };

  useEffect(() => {
    getUser();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = new FormData();
      updateData.append("firstName", firstName);
      updateData.append("secondName", secondName);
      updateData.append("email", email);
      updateData.append("phone", phone);
      updateData.append("password", password);
      updateData.append("address", address);
      updateData.append("profilePhoto", profilePhoto);

      const { data } = await axiosPrivate.put(
        `${process.env.REACT_APP_API}/api/v1/user/update-user/${auth?.user?._id}`,
        updateData,
        {
          withCredentials: true,
        }
      );
      if (data?.success === true) {
        toast.success(data?.message, {
          duration: 3000,
        });
        setAuth({
          ...auth,
          user: data?.updated,
        });
        setAddress("");
        setPhone("");
        setFirstName("");
        setSecondName("");
        setPassword("");
        setEmail("");
        navigate("/private/user-profile");
      } else if (data.success === false) {
        console.log(data?.message);
        setLoading(false);
        toast.error(data?.message);
        console.log(data?.message);
      } else {
        setLoading(false);
        toast.error("something went wrong");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return loading ? (
    <Grid height="100vh" alignItems="center">
      <Spinner />
    </Grid>
  ) : (
    <LayoutWrapper title="Update Profile">
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
          Update Profile
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
              id="update-profilePhoto"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
            />
            {profilePhoto ? (
              <img
                width="400px"
                height="250px"
                src={URL.createObjectURL(profilePhoto)}
                alt="Error Loading image"
              />
            ) : (
              <Grid alignSelf="center" justifyContent="center" mt="2rem">
                <img
                  width="400px"
                  height="250px"
                  alt="no photo"
                  src={`${process.env.REACT_APP_API}/api/v1/user/get-photo/${auth?.user?._id}`}
                />
              </Grid>
            )}

            <Button
              variant="outlined"
              onClick={() =>
                document.querySelector("#update-profilePhoto").click()
              }
            >
              change Photo
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => updateUser(e)}
            >
              Update User
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

export default UpdateProfile;
