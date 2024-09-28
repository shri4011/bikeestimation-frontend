import {
  Backdrop,
  Button,
  CircularProgress,
  Grid2,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { API_URL } from "../Constant";
import BackdropLoader from "../Components/BackdropLoader";

const AppCustomization = () => {
  const [file, setFile] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [open, setOpen] = useState(false);

  // AppCustomization
  //AppCustomization
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleUpload = async () => {
    
    localStorage.removeItem("globalImage");
    if (!file) {
      alert("Please select a file.");
      return;
    }

    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    setOpen(true);
    try {
      const response = await fetch(
        `${API_URL}/api/bikesEstimation/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result) {
        setOpen(false);
      }
      console.log("Upload result:", result);
      alert(result.message); // Show success message
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <Grid2 mt={3}>
        <div>
          <Grid2>
            <TextField
              type="file"
              inputProps={{
                accept: ".jpg,.jpeg,.png,.pdf", // Specify accepted file types
              }}
              onChange={handleFileChange}
              sx={{ mb: 2, width: "100%" }} // MUI styling
            />
          </Grid2>

          <Grid2>
            <TextField
              type="text"
              placeholder="Title"
              value={title}
              inputProps={{
                accept: ".jpg,.jpeg,.png,.pdf", // Specify accepted file types
              }}
              onChange={handleTitle}
              sx={{ mb: 2, width: "100%" }} // MUI styling
            />
          </Grid2>
          <Button variant="contained" onClick={handleUpload} disabled={!file}>
            Save
          </Button>
          {file && <p>Selected file: {file.name}</p>}
        </div>
        <BackdropLoader open={open}/>
      </Grid2>
    </>
  );
};

export default AppCustomization;
