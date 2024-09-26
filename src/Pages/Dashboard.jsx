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

function createData(_id, name, calories, fat, carbs, protein, history) {
  return {
    _id,
    name,
    calories,
    fat,
    carbs,
    protein,
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
    setPdfRow,
    pdfImage,
  } = props;
  const [open, setOpen] = useState(false);
  const [pdfRowData, setPdfRowData] = useState({});

  const deleteEstimation = () => {
    const { _id } = row;
    showLoading(true);
    fetch(
      "https://bikeestimation-2.onrender.com/api/bikesEstimation/deleteEstimationDetatils",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: _id,
        }),
      }
    )
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

  let vehicleDetails = {
    vehicalNumber: "",
    ownerName: "",
    mobileNumber: "",
    vehicalType: "",
    vehicalComapny: "",
    vehicalModel: "",
  };

  let partsList = [];

  let servicingList = [];

  const generatePDF = () => {
    fetch(
      `https://bikeestimation-2.onrender.com/api/bikesEstimation/${row?._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          vehicleDetails = {
            vehicalNumber: data?.vehicalNumber,
            ownerName: data?.ownerName,
            mobileNumber: data?.mobileNumber,
            vehicalType: data?.vehicalType,
            vehicalComapny: data?.vehicalComapny,
            vehicalModel: data?.vehicalModel,
          };
          partsList = data?.partsList;
          servicingList = data?.servicingList;
        }

        let billSubtotal = data?.billSubtotal;
        let payableAmount = data?.payableAmount;
        const doc = new jsPDF();
        let image = "";
        let title = "";
        if (localStorage.getItem("globalImage") !== null) {
          image = JSON.parse(localStorage.getItem("globalImage"))?.image;
          title = JSON.parse(localStorage.getItem("globalImage"))?.title;
        }

        doc.addImage(image, "PNG", 171, 10, 25, 24);

        // Add a title
        doc.setFontSize(18);
        doc.text(title, 14, 22);

        // Add Vehicle Details
        doc.setFontSize(14);
        doc.text("Vehicle Details", 14, 30);
        doc.autoTable({
          startY: 35,
          head: [
            [
              "Vehicle Number",
              "Owner Name",
              "Mobile Number",
              "Vehicle Type",
              "Vehicle Company",
              "Vehicle Model",
            ],
          ],
          body: [
            [
              vehicleDetails.vehicalNumber,
              vehicleDetails.ownerName,
              vehicleDetails.mobileNumber,
              vehicleDetails.vehicalType,
              vehicleDetails.vehicalComapny,
              vehicleDetails.vehicalModel,
            ],
          ],
        });

        // Add a Parts List Table
        doc.text("Parts List", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 15,
          head: [["Type", "Company", "Product", "Price", "Quantity", "Total"]],
          body: partsList.map((part) => [
            part.type,
            part.company,
            part.product,
            part.price,
            part.quantity,
            part.total,
          ]),
        });

        // Add a Servicing List Table
        doc.text("Servicing List", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 15,
          head: [
            ["Service Type", "Service Option", "Price", "Quantity", "Total"],
          ],
          body: servicingList.map((service) => [
            service.serviceType,
            service.serviceOption,
            service.price,
            service.quantity,
            service.total,
          ]),
        });

        doc.text("Amount Details", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 15,
          head: [["Bill sub total", "Payable amount"]],
          body: [[billSubtotal, payableAmount]],
        });

        // Save the PDF
        doc.save("bike-estimation.pdf");
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
              // setPdfRow(row?._id);

              // setTimeout(() => {
              //   debugger
              //   const getTable = document.getElementById("pdf-content");
              //   const childElement = getTable.querySelector(".child-class");
              //   if (childElement) {
              //     childElement.click();
              //   }
              // }, 1500);
              generatePDF();

              // createPdf(row);
            }}
          >
            <PictureAsPdfIcon />
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
          {/* <Button onClick={handleClose} autoFocus>
            Edit
          </Button> */}
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
  const [pdfRow, setPdfRow] = useState(null);
  const [pdfData, setPdfData] = useState({});
  const [pdfImage, setPdfImage] = useState("");

  const getEstimationTableDataList = () => {
    setOpen(true);
    const payload = {
      page: 1,
      limit: 10,
    };
    fetch("https://bikeestimation-2.onrender.com/api/bikesEstimation/getList", {
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
    fetch("https://bikeestimation-2.onrender.com/api/bikesEstimation/images", {
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

  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
        {console.log("editRow_____", pdfRow)}
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
                setPdfRow={setPdfRow}
                pdfImage={pdfImage}
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
          // onClose={handleClose}
          message="Something wents wroung"
        />
      </Grid2>
      <Grid2>

      </Grid2>
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
