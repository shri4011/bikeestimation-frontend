import { Backdrop } from "@mui/material";
import React from "react";
import Loader from "./Loader";

const BackdropLoader = ({ open }) => {
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <Loader />
      </Backdrop>
    </>
  );
};

export default BackdropLoader;
