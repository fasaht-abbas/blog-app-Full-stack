import React, { useState, useEffect } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import {
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  InputLabel,
} from "@mui/material";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinners/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ResetPass = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // use effect for scrolling to the top of the site
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        setVerified(true);
        setLoading(false);
        toast.success(data?.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error! Try again later");
      console.log(error);
    }
  };
  // changing pass after the OTP verification
  const changePass = async () => {
    try {
      if (password === verifyPassword && verified) {
        setLoading(true);
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/user/reset-password`,
          {
            password,
            email,
          }
        );
        if (data?.success) {
          setVerified(false);
          setEmail("");
          setPassword("");
          setVerifyPassword("");
          setOtp("");
          setSent(false);
          setLoading(false);
          toast.success(data?.message);
          navigate("/login");
        }
      } else {
        toast.error("Pasword don't match");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("failed! Try again later");
    }
  };
  return (
    <LayoutWrapper title="reset-password">
      {auth.accessToken ? (
        navigate("/")
      ) : (
        <Grid container justifyContent="center" alignItems="center" p="2rem">
          {loading ? (
            <Spinner />
          ) : verified ? (
            <Stack Stack spacing={3} width="50vw">
              <Typography
                color="primary.main"
                variant="h4"
                fontWeight="bold"
                alignSelf="center"
              >
                {" "}
                RESET PASSWORD
              </Typography>
              <InputLabel>reset password for {email}</InputLabel>
              <TextField
                type="password"
                value={password}
                label="new password"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <TextField
                value={verifyPassword}
                type="password"
                onChange={(e) => setVerifyPassword(e.target.value)}
                maxLength={6}
                label="verify new password"
                fullWidth
              />
              <Button variant="outlined" onClick={changePass}>
                Reset Pass
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3} width="50vw">
              <Typography
                color="primary.main"
                variant="h4"
                fontWeight="bold"
                alignSelf="center"
              >
                {" "}
                RESET PASSWORD
              </Typography>
              <TextField
                value={email}
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
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
            </Stack>
          )}
        </Grid>
      )}
    </LayoutWrapper>
  );
};

export default ResetPass;
