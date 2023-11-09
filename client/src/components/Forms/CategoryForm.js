import { Box, Grid, Card, TextField, Button } from "@mui/material";
import React from "react";

const CategoryForm = ({ value, setValue, label, btnName, submitHandler }) => {
  return (
    <Box>
      <Grid xs={12}>
        <Card>
          <TextField
            fullWidth
            label={label}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <Button onClick={submitHandler}>{btnName}</Button>
        </Card>
      </Grid>
    </Box>
  );
};

export default CategoryForm;
