import {
  Backdrop,
  Button,
  CircularProgress,
  Grid2,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import { API_URL } from "../Constant";
import BackdropLoader from "../Components/BackdropLoader";

const lables = {
  serviceType: "Service Type",
  serviceOption: "Service Option",
  price: "Price",
  quantity: "Quantity",
  total: "Total",
  type: "Type",
  company: "Company",
  product: "Product",
};

const AddBikeEstimation = (props) => {
  const { setValue } = props;
  const [estimationUserBasicDetails, seteEstimationUserBasicDetails] = useState(
    [
      {
        label: "Vehicle Number",
        name: "vehicalNumber",
        value: "",
        type: "text",
      },
      {
        label: "Owner Name",
        name: "ownerName",
        value: "",
        type: "text",
      },
      {
        label: "Mobile Number",
        name: "mobileNumber",
        value: null,
        type: "number",
      },
      {
        label: "Vehical Type",
        name: "vehicalType",
        value: "",
        type: "text",
      },
      {
        label: "Vehical Comapany",
        name: "vehicalComapny",
        value: "",
        type: "text",
      },
      {
        label: "Vehical Model",
        name: "vehicalModel",
        value: "",
        type: "text",
      },
    ]
  );
  const [servicingInfo, setServicingInfo] = useState([]);
  const [partsInfo, setPartsInfo] = useState([]);
  const [billSubTotal, setBillSubTotal] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackckbarStatus, setSnackbarStatus] = useState(false);
  const [snackMessgae, setSnackMessage] = useState("Something went wrong");

  useEffect(() => {
    if (props?.edit && props?.editInfo) {
      setOpen(true);
      fetch(`${API_URL}/api/bikesEstimation/${props?.editInfo?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setOpen(false);
            setServicingInfo(data?.servicingList);
            setPartsInfo(data?.partsList);
            setBillSubTotal(data?.billSubtotal);
            setPayableAmount(data?.payableAmount);
            const addEtimatinValue = estimationUserBasicDetails?.map((item) => {
              if (data[item?.name]) {
                item["value"] = data[item?.name];
              }
              return item;
            });
            seteEstimationUserBasicDetails(addEtimatinValue);
          }
        })
        .catch((error) => {
          setOpen(false);
          setSnackbarStatus(true);
          console.error(error);
        });
    }
  }, [props]);

  const handleOnchange = (text, index) => {
    const createShadowCopy = [...estimationUserBasicDetails];
    const getObjByIndex = createShadowCopy[index];
    if (getObjByIndex) {
      getObjByIndex["value"] = text.target.value;
      createShadowCopy[index] = getObjByIndex;
      seteEstimationUserBasicDetails([...createShadowCopy]);
    }
  };

  const addServicingObj = () => {
    const setServicingObj = {
      serviceType: "",
      serviceOption: "",
      price: 0,
      quantity: 0,
      total: 0,
    };

    setServicingInfo([...servicingInfo, setServicingObj]);
  };

  const handleServiceOnchange = (text, index, key) => {
    const createShadowCopy = [...servicingInfo];
    const getObjByIndex = createShadowCopy[index];
    if (getObjByIndex) {
      getObjByIndex[key] = text.target.value;
      createShadowCopy[index] = getObjByIndex;
      setServicingInfo([...createShadowCopy]);
    }
  };

  const handlePartsOnchange = (text, index, key) => {
    const createShadowCopy = [...partsInfo];
    const getObjByIndex = createShadowCopy[index];
    if (getObjByIndex) {
      getObjByIndex[key] = text.target.value;
      createShadowCopy[index] = getObjByIndex;
      setPartsInfo([...createShadowCopy]);
    }
  };

  const addPartsObj = () => {
    const setPartsObj = {
      type: "",
      company: "",
      product: "",
      price: "",
      quantity: "",
      total: "",
    };

    setPartsInfo([...partsInfo, setPartsObj]);
  };

  const removePartsObj = (index) => {
    if (index > -1) {
      const getShadowCopy = [...partsInfo];
      getShadowCopy.splice(index, 1);
      setPartsInfo([...getShadowCopy]);
    }
  };

  const removeServicesObj = (index) => {
    if (index > -1) {
      const getShadowCopy = [...servicingInfo];
      getShadowCopy.splice(index, 1);
      setServicingInfo([...getShadowCopy]);
    }
  };

  const submitDetails = () => {
    const estimationUserBasicDetailsObj = estimationUserBasicDetails.reduce(
      (accumulator, product) => {
        accumulator[product.name] = product.value;
        return accumulator;
      },
      {}
    );

    const payload = {
      ...estimationUserBasicDetailsObj,
      servicingList: servicingInfo,
      partsList: partsInfo,
      billSubtotal: billSubTotal,
      payableAmount: payableAmount,
    };

    if (props?.edit && props?.editInfo) {
      fetch(`${API_URL}/api/bikesEstimation/getEstimationDetatils`, {
        method: "POST", // You can change this to POST, DELETE, etc.
        headers: {
          "Content-Type": "application/json", // Send the request as JSON
        },
        body: JSON.stringify({
          _id: props?.editInfo?._id,
          data: payload,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            props?.getEstimationTableDataList();
            props?.setShowDailog(false);
          }
        })
        .catch((error) => {
          setSnackbarStatus(true);
          console.error(error);
        });
    } else {
      setOpen(true);
      fetch(`${API_URL}/api/bikesEstimation`, {
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
          if (data) {
            setOpen(false);
            setSnackbarStatus(true);
            setSnackMessage("Servicing Information Added");
            setValue(0);
          }
        })
        .catch((error) => {
          setOpen(false);
          setSnackbarStatus(true);
          console.error(error);
        });
    }
  };

  const handleClick = () => {
    setSnackbarStatus(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarStatus(false);
  };

  return (
    <>
      <Grid2>
        <Grid2
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            margin: "20px 20px 0px 0px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {!props?.edit && "New Estimation"}
          </Typography>
        </Grid2>
        <Grid2
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {estimationUserBasicDetails.map((item, index) => (
            <TextField
              id="outlined-basic"
              label={item?.label}
              variant="outlined"
              type={item?.type}
              name={item?.name}
              value={item?.value}
              sx={{ width: "100%", marginTop: !index ? "10px" : "20px" }}
              onChange={(text) => handleOnchange(text, index)}
            />
          ))}
        </Grid2>
        <Grid2 sx={{ width: "100%", marginTop: "20px" }}>
          <Divider sx={{ background: "#1976d2" }} />
        </Grid2>
        <Grid2
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "20px 0px",
          }}
        >
          <Grid2>
            <Typography variant="p" gutterBottom>
              Add Servicing
            </Typography>
          </Grid2>
          <Grid2>
            <Button
              variant="contained"
              color="success"
              sx={{ borderRadius: "30px" }}
              onClick={addServicingObj}
            >
              <AddIcon />
            </Button>
          </Grid2>
        </Grid2>
        <Grid2>
          {servicingInfo.map((item, index) => (
            <Grid2
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Grid2
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  margin: "20px 0px",
                }}
              >
                <Grid2>
                  <Typography variant="p" gutterBottom>
                    {`Servicing Information ${index + 1}`}
                  </Typography>
                </Grid2>
                <Grid2>
                  <Button onClick={() => removeServicesObj(index)}>
                    <CloseIcon />
                  </Button>
                </Grid2>
              </Grid2>
              <TextField
                id="outlined-basic"
                label={lables["serviceType"]}
                variant="outlined"
                type="text"
                name={item?.serviceType}
                value={item?.serviceType}
                sx={{ width: "100%", marginTop: index > 0 ? "20px" : "" }}
                onChange={(text) =>
                  handleServiceOnchange(text, index, "serviceType")
                }
              />

              <TextField
                id="outlined-basic"
                label={lables["serviceOption"]}
                variant="outlined"
                type="text"
                name={item?.serviceOption}
                value={item?.serviceOption}
                sx={{ width: "100%", marginTop: "20px" }}
                onChange={(text) =>
                  handleServiceOnchange(text, index, "serviceOption")
                }
              />
              <Grid2
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  id="outlined-basic"
                  label={lables["price"]}
                  variant="outlined"
                  name={item?.price}
                  type="number"
                  value={item?.price}
                  sx={{ width: "100%", margin: "2px" }}
                  onChange={(text) =>
                    handleServiceOnchange(text, index, "price")
                  }
                />
                <TextField
                  id="outlined-basic"
                  label={lables["quantity"]}
                  variant="outlined"
                  type="number"
                  name={item?.quantity}
                  value={item?.quantity}
                  sx={{ width: "100%", margin: "2px" }}
                  onChange={(text) =>
                    handleServiceOnchange(text, index, "quantity")
                  }
                />
                <TextField
                  id="outlined-basic"
                  label={lables["total"]}
                  variant="outlined"
                  type="number"
                  name={item?.total}
                  value={item?.total}
                  sx={{ width: "100%", margin: "2px" }}
                  onChange={(text) =>
                    handleServiceOnchange(text, index, "total")
                  }
                />
              </Grid2>
            </Grid2>
          ))}
        </Grid2>
        <Grid2 sx={{ width: "100%", marginTop: "20px" }}>
          <Divider sx={{ background: "#1976d2" }} />
        </Grid2>
        <Grid2
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "20px 0px",
          }}
        >
          <Grid2>
            <Typography variant="p" gutterBottom>
              Add Parts
            </Typography>
          </Grid2>
          <Grid2>
            <Button
              variant="contained"
              color="success"
              sx={{ borderRadius: "30px" }}
              onClick={addPartsObj}
            >
              <AddIcon />
            </Button>
          </Grid2>
        </Grid2>
        <Grid2>
          {partsInfo.map((item, index) => (
            <Grid2
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Grid2
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  margin: "20px",
                }}
              >
                <Grid2>
                  <Typography variant="p" gutterBottom>
                    {`Parts Information ${index + 1}`}
                  </Typography>
                </Grid2>
                <Grid2>
                  <Button onClick={() => removePartsObj(index)}>
                    <CloseIcon />
                  </Button>
                </Grid2>
              </Grid2>
              <TextField
                id="outlined-basic"
                label={lables["type"]}
                variant="outlined"
                value={item?.type}
                sx={{ width: "100%", marginTop: index > 0 ? "20px" : "" }}
                onChange={(text) => handlePartsOnchange(text, index, "type")}
              />

              <TextField
                id="outlined-basic"
                label={lables["company"]}
                variant="outlined"
                value={item?.company}
                sx={{ width: "100%", marginTop: "20px" }}
                onChange={(text) => handlePartsOnchange(text, index, "company")}
              />
              <TextField
                id="outlined-basic"
                label={lables["product"]}
                variant="outlined"
                value={item?.product}
                sx={{ width: "100%", marginTop: "20px" }}
                onChange={(text) => handlePartsOnchange(text, index, "product")}
              />
              <Grid2
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  id="outlined-basic"
                  label={lables["price"]}
                  variant="outlined"
                  value={item?.price}
                  sx={{ width: "100%", margin: "2px" }}
                  onChange={(text) => handlePartsOnchange(text, index, "price")}
                />
                <TextField
                  id="outlined-basic"
                  label={lables["quantity"]}
                  variant="outlined"
                  value={item?.quantity}
                  sx={{ width: "100%", margin: "2px" }}
                  onChange={(text) =>
                    handlePartsOnchange(text, index, "quantity")
                  }
                />
                <TextField
                  id="outlined-basic"
                  label={lables["total"]}
                  variant="outlined"
                  value={item?.total}
                  sx={{ width: "100%", margin: "2px" }}
                  onChange={(text) => handlePartsOnchange(text, index, "total")}
                />
              </Grid2>
            </Grid2>
          ))}
        </Grid2>
        <Grid2 sx={{ width: "100%", marginTop: "20px" }}>
          <Divider sx={{ background: "#1976d2" }} />
        </Grid2>
        <Grid2>
          <TextField
            id="outlined-basic"
            label={"Bill Sub Total"}
            variant="outlined"
            name={"billSubTotal"}
            value={billSubTotal}
            sx={{ width: "100%", marginTop: "20px" }}
            onChange={(e) => setBillSubTotal(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label={"Payable Amount"}
            variant="outlined"
            name={"payableAmount"}
            value={payableAmount}
            sx={{ width: "100%", marginTop: "20px" }}
            onChange={(e) => setPayableAmount(e.target.value)}
          />
        </Grid2>
      </Grid2>
      <Grid2
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px 20px 0px",
        }}
      >
        <Button
          variant="contained"
          sx={{ width: "100%" }}
          onClick={submitDetails}
        >
          Submit
        </Button>
        <BackdropLoader open={open} />
        <Grid2>
          <Snackbar
            open={snackckbarStatus}
            autoHideDuration={5000}
            onClose={handleClose}
            message={snackMessgae}
          />
        </Grid2>
      </Grid2>
    </>
  );
};

export default AddBikeEstimation;
