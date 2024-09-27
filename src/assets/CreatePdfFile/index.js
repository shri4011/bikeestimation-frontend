import jsPDF from "jspdf";

export default function createPdfAndBlobData(data) {
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
      head: [["Service Type", "Service Option", "Price", "Quantity", "Total"]],
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
  }
}
