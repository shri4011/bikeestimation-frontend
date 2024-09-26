import { Button, Grid2, TextField } from "@mui/material";
import React from "react";

const DummyTest = () => {
  const [file, setFile] = React.useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Append the file to the form data

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Upload result:', result);
      alert(result.message); // Show success message
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

  return (
    <>
      <Grid2 mt={3}>
        <div>
          <TextField
            type="file"
            inputProps={{
              accept: ".jpg,.jpeg,.png,.pdf", // Specify accepted file types
            }}
            onChange={handleFileChange}
            sx={{ mb: 2 }} // MUI styling
          />
          <Button variant="contained" onClick={handleUpload} disabled={!file}>
            Upload File
          </Button>
          {file && <p>Selected file: {file.name}</p>}
        </div>
      </Grid2>
    </>
  );
};

export default DummyTest;
