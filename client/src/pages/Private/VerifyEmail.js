import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import {
  Stack,
  Typography,
  TextField,
  InputLabel,
  Button,
  Grid,
} from "@mui/material";
import Unauthorized from "../../components/Spinners/Unauthorized";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinners/Spinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [sent, setSent] = useState();
  const [loading, setLoading] = useState();
  const [otp, setOtp] = useState();
  const email = auth?.user?.email;

  // sending otp to email
  const sendOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/user/generate-otp`,
        {
          email,
        }
      );
      if (data?.success) {
        setLoading(false);
        setSent(true);
        toast.success(data?.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error! Try again Later");
    }
  };

  // use effect for scrolling to the top of the site
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // verifying the otp
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/user/verify-otp`,
        {
          otp,
        }
      );
      if (data?.success) {
        setLoading(false);
        navigate("/");
        toast.success(data?.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error! Try again later");
      console.log(error);
    }
  };
  return (
    <LayoutWrapper title="Verify Email">
      <Grid container justifyContent="center" alignItems="center" p="2rem">
        {auth?.accessToken ? (
          auth?.user?.verified ? (
            <>
              <Stack spacing={3} width="50vw">
                <TextField value={email} disabled fullWidth />
                <Typography alignSelf="center">
                  Already verified email <Link to="/">back to home</Link>
                </Typography>
              </Stack>
            </>
          ) : loading ? (
            <Spinner />
          ) : (
            <Stack spacing={3} width="50vw">
              <Typography
                color="primary.main"
                variant="h4"
                fontWeight="bold"
                alignSelf="center"
              >
                {" "}
                VERIFY EMAIL
              </Typography>
              <TextField value={email} label="Email" disabled fullWidth />
              <TextField
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                label="OTP"
                disabled={sent ? false : true}
              />
              <InputLabel>The OTP expires in 5 minutes</InputLabel>
              <Button variant="outlined" onClick={sendOtp}>
                {sent ? "Resend OTP" : "Send OTP"}
              </Button>
              <Button variant="outlined" onClick={verifyOtp}>
                Verify OTP
              </Button>

              <Link to="/" sx={{ alignSelf: "right" }}>
                Skip for Now
              </Link>
            </Stack>
          )
        ) : (
          <Unauthorized />
        )}
      </Grid>
    </LayoutWrapper>
  );
};

export default VerifyEmail;
