import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid2,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddBikeEstimation from "./AddBikeEstimation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import Header from "../Components/Header";
import createPdfAndBlobData from "../assets/CreatePdfFile";
import { API_URL } from "../Constant";

function createData(_id, name, calories, fat, carbs, protein, pdfUrl, history) {
  return {
    _id,
    name,
    calories,
    fat,
    carbs,
    protein,
    pdfUrl,
    history,
  };
}

function Row(props) {
  const {
    row,
    setEditInfo,
    setValue,
    setIsEdit,
    setShowDailog,
    getEstimationTableDataList,
    showLoading,
    setSnackbarStatus,
    setMessages,
  } = props;
  const [open, setOpen] = useState(false);
  const [pdfRowData, setPdfRowData] = useState({});

  const deleteEstimation = () => {
    const { _id } = row;
    showLoading(true);
    fetch(`${API_URL}/api/bikesEstimation/deleteEstimationDetatils`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: _id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        showLoading(false);
        if (data) {
          getEstimationTableDataList();
        }
      })
      .catch((error) => {
        showLoading(false);
        console.error(error);
      });
  };

  const generatePDF = (url) => {
    if (url) {
      fetch("https://bikeestimation-2.onrender.com/public/MH13ED4011.pdf").then(
        function (t) {
          // debugger
          return t.blob().then((b) => {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", row?.name || "Vehical pdf");
            a.click();
          });
        }
      );
    } else {
      setTimeout(() => {
        setSnackbarStatus(false);
      }, 3000);
      setSnackbarStatus(true);
      setMessages("Pdf url not found...");
    }
  };

  function base64ToBlob(base64Data, contentType = "application/pdf") {
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setEditInfo(row);
              setIsEdit(true);
              setShowDailog(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              deleteEstimation();
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              generatePDF(row?.pdfUrl);
            }}
          >
            <PictureAsPdfIcon />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={async () => {
              // if (navigator.share && row?.pdfUrl) {
              //   try {
              //     fetch(row?.pdfUrl)
              //       .then((response) => response.blob()) // Fetch the PDF as a Blob
              //       .then(async (blob) => {
              //         // Convert Blob to Base64 using FileReader
              //         const reader = new FileReader();
              //         reader.onloadend = async function () {
              //           // The result is the base64 string
              //           const base64Data = reader.result;

              //           // Log base64 string to console (you can use it elsewhere)
              //           console.log(base64Data);

              //           const pdfBlob = base64ToBlob(base64Data);

              //           // Create a File object from the Blob (File is needed for navigator.share)
              //           const file = new File([pdfBlob], "document.pdf", {
              //             type: "application/pdf",
              //           });

              //           // await navigator.share({
              //           //   files: [file],
              //           //   title: "Share PDF",
              //           //   text: "Check out this PDF document",
              //           // });

              //           if (navigator.canShare({ file })) {
              //             await navigator.share({ file });
              //           }
              //           console.log("Shared successfully");
              //         };

              //         reader.readAsDataURL(blob);
              //       })
              //       .catch((err) =>
              //         console.error("Error fetching the PDF:", err)
              //       );
              //   } catch (error) {
              //     console.error("Error sharing the file:", error);
              //   }
              // } else {
              //   alert("Web Share API is not supported in your browser.");
              // }
              const response = await fetch(row?.pdfUrl);
              const buffer = await response.arrayBuffer();

              const pdf = new File([buffer], "hello.pdf", {
                type: "application/pdf",
              });
              const files = [pdf];
              if (navigator.canShare({ files })) {
                await navigator.share({ files });
              }
            }}
          >
            <WhatsAppIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.title}>
                      <TableCell component="th" scope="row">
                        {historyRow.title}
                      </TableCell>
                      <TableCell>{historyRow.price}</TableCell>
                      <TableCell align="right">{historyRow.quantity}</TableCell>
                      <TableCell align="right">{historyRow.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        quantity: PropTypes.number.isRequired,
        price: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        total: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const AlertDialog = (props) => {
  const handleClose = () => {
    props?.setShowDailog(false);
  };

  return (
    <>
      <Dialog
        open={props?.showDailog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit servicing informations"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddBikeEstimation
              editInfo={props?.editInfo}
              edit={true}
              setShowDailog={props?.setShowDailog}
              getEstimationTableDataList={props?.getEstimationTableDataList}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancle</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function Dashboard(props) {
  const [estimationTableList, setEstimationTableList] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackckbarStatus, setSnackbarStatus] = useState(false);
  const [showDailog, setShowDailog] = useState(false);
  const [pdfImage, setPdfImage] = useState("");
  const [message, setMessages] = useState("Something wents wroung");

  const getEstimationTableDataList = () => {
    setOpen(true);
    const payload = {
      page: 1,
      limit: 10,
    };
    fetch(`${API_URL}/api/bikesEstimation/getList`, {
      //   mode: "no-cors",
      method: "POST", // You can change this to POST, DELETE, etc.
      headers: {
        "Content-Type": "application/json", // Send the request as JSON
      },
      body: JSON.stringify({
        ...payload,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpen(false);
        if (data) {
          setEstimationTableList(data?.estimations);
          const createRows = data?.estimations.map((item) => {
            const servicingHistory = item?.servicingList.map((list) => {
              return {
                title: `${list?.serviceType} - ${list?.serviceOption}`,
                price: `${list?.price}`,
                quantity: `${list?.quantity}`,
                total: `${list?.total}`,
              };
            });
            const partsHistory = item?.partsList.map((list) => {
              return {
                title: `${list?.type} - ${list?.product}`,
                price: `${list?.price}`,
                quantity: `${list?.quantity}`,
                total: `${list?.total}`,
              };
            });

            const history = [...servicingHistory, ...partsHistory];

            return createData(
              item?._id,
              item?.ownerName,
              item?.mobileNumber,
              item?.vehicalNumber,
              item?.billSubtotal,
              item?.payableAmount,
              item?.pdfUrl || null,
              history
            );
          });

          setRows(createRows);
        }
      })
      .catch((error) => {
        setOpen(false);
        setSnackbarStatus(true);
        console.error(error.message);
      });
  };

  const getPdfImage = () => {
    fetch(`${API_URL}/api/bikesEstimation/images`, {
      method: "POST", // You can change this to POST, DELETE, etc.
      headers: {
        "Content-Type": "application/json", // Send the request as JSON
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // debugger
        if (data) {
          localStorage.setItem("globalImage", JSON.stringify(data));
        }
      })
      .catch((error) => {
        setOpen(false);
        setSnackbarStatus(true);
        console.error(error.message);
      });
  };
  useEffect(() => {
    getEstimationTableDataList();
    if (localStorage.getItem("globalImage") === null) {
      getPdfImage();
    }
  }, []);

  const handleCloseSnackBar = () => {
    setSnackbarStatus(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Owner Name</TableCell>
              <TableCell align="right">Mobile Number</TableCell>
              <TableCell align="right">Bike Number</TableCell>
              <TableCell align="right">Billing Sub Total</TableCell>
              <TableCell align="right">Payable Amount</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.name}
                row={row}
                setEditInfo={props?.setEditInfo}
                setValue={props?.setValue}
                setIsEdit={props?.setIsEdit}
                setShowDailog={setShowDailog}
                getEstimationTableDataList={getEstimationTableDataList}
                showLoading={setOpen}
                pdfImage={pdfImage}
                setSnackbarStatus={setSnackbarStatus}
                setMessages={setMessages}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid2>
        <Snackbar
          open={snackckbarStatus}
          autoHideDuration={5000}
          onClose={handleCloseSnackBar}
          message={message}
        />
      </Grid2>
      <Grid2></Grid2>
      <Grid2>
        <AlertDialog
          showDailog={showDailog}
          setShowDailog={setShowDailog}
          editInfo={props?.editInfo}
          getEstimationTableDataList={getEstimationTableDataList}
        />
      </Grid2>
    </>
  );
}
