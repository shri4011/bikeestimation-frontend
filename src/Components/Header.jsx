import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Avatar, Stack } from "@mui/material";
import headerLogo from "../assets/images/logo.jpg";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <SettingsSuggestIcon /> */}
            <Stack direction="row" spacing={2}>
              <Avatar alt="Remy Sharp" src={headerLogo} />
            </Stack>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Test Automobiles
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
