import { Box, Typography, Grid, TextField, Button } from "@mui/material";

import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { headingTypo } from "../../components/StyledComponents";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      if (!name || !email || !subject || !message) {
        toast.error("Every Field is required");
      } else {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/user/send-message`,
          {
            email,
            name,
            subject,
            message,
          }
        );
        if (data?.success) {
          toast.success(data?.message);
          setName("");
          setEmail("");
          setSubject("");
          setMessage("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box minHeight="70vh" sx={{ backgroundColor: "accent.main", py: "1.5rem" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={10}
        >
          <Grid item xs mb="2rem">
            <Typography
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  md: "1.5rem",
                  lg: "2rem",
                },
              }}
              style={headingTypo}
              fontWeight="bold"
              mb="1rem"
              color="secondary.main"
            >
              Contact Us
            </Typography>
          </Grid>
          <Grid container xs={12} direction="column">
            <Grid
              container
              xs
              mb="1rem"
              justifyContent="space-between"
              sx={{ flexDirection: { xs: "column", sm: "row" } }}
            >
              <TextField
                color="secondary"
                sx={{
                  width: { xs: "100%", sm: "46%" },
                  mb: { xs: "1rem", sm: "0" },
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Name"
              />
              <TextField
                color="secondary"
                sx={{ width: { xs: "100%", sm: "46%" } }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
              />
            </Grid>
            <TextField
              color="secondary"
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: "1rem" }}
            />
            <TextField
              color="secondary"
              multiline
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label="Message"
              sx={{ mb: "1rem" }}
            />
          </Grid>
          <Grid item xs container justifyContent="center">
            <Button
              variant="contained"
              sx={{ fontWeight: "bold" }}
              color="primary"
              onClick={sendMessage}
            >
              Send Message
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact;
