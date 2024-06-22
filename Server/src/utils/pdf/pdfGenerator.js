const PDFDocument = require("pdfkit");

// Function to generate PDF
const generatePDF = async (bookingDetails) => {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));

  // Set font sizes and weights
  const titleFontSize = 12;
  const titleFontWeight = "bold";
  const contentFontSize = 8;

  // Set font and font size for title
  doc.font("Helvetica-Bold");
  doc.fontSize(18);

  // Add title
  doc.text("Booking Details", { align: "center" });
  doc.moveDown();

  const imagePath = "src/assets/Nobu.png";
  const imageOptions = {
    width: 50, // Set the width of the image
    height: 50, // Set the height of the image
  };
  doc.image(imagePath, imageOptions);
  doc.fontSize(9);
  doc.text("This is your recipt", { align: "left" });

  // doc.text('Booking Number', { align: 'right' });
  // doc.text('12134', { align: 'right' });

  doc.moveDown();

  // User's information

  // Title "Guest Information"
  doc.fillColor("black").fontSize(titleFontSize).text("Guest Information:", {
    font: titleFontWeight,
  });

  // Guest information details
  doc.fontSize(contentFontSize).text(`Name: ${bookingDetails.customer_name}`);
  doc.fontSize(contentFontSize).text(`Email: ${bookingDetails.customer_email}`);
  doc.fontSize(contentFontSize).text(`Phone: ${bookingDetails.customer_phone}`);

  doc.moveDown();

  // Booking details
  doc
    .fillColor("black")
    .fontSize(titleFontSize)
    .text("Booking Details:", { font: "Helvetica-Bold" });
  doc
    .fontSize(contentFontSize)
    .text(`Booking ID: ${bookingDetails.booking_id}`);
  doc.text(`Room ID: ${bookingDetails.room_id}`);
  doc
    .fontSize(contentFontSize)
    .text(`Hotel name: ${bookingDetails.hotel_name}`);
  doc.fontSize(contentFontSize).text(`Location: ${bookingDetails.location}`);
  doc.fontSize(contentFontSize).text(`Check-in: ${bookingDetails.check_in}`);
  doc.fontSize(contentFontSize).text(`Check-out: ${bookingDetails.check_out}`);
  doc
    .fontSize(contentFontSize)
    .text(`Period of Stay: ${bookingDetails.nights_days}`);
  doc
    .fontSize(contentFontSize)
    .text(`Number of Guests: ${bookingDetails.num_people}`);
  doc.fontSize(contentFontSize).text(`Price: ${bookingDetails.roomPrice}`);
  doc.moveDown();

  // Additional services
  doc
    .fillColor("black")
    .fontSize(titleFontSize)
    .text("Additional Services:", { font: "Helvetica-Bold" });
  bookingDetails.additional_services.map((service) =>
    doc
      .fontSize(contentFontSize)
      .text(`${service.service_name}: ${service.price}`)
  );
  doc.moveDown();

  // Payment details
  doc
    .fillColor("black")
    .fontSize(titleFontSize)
    .text("Payment Details:", { font: "Helvetica-Bold" });
  doc
    .fontSize(contentFontSize)
    .text(`Payment Method: ${bookingDetails.payment_method}`);
  doc
    .fontSize(contentFontSize)
    .text(`Total Price: NPR${bookingDetails.total_price}`);

  doc.moveDown();

  // Note for refund
  doc
    .fillColor("red")
    .text(
      `Note: You may be eligible for a partial refund if cancelled before the required date ${bookingDetails.refundDeadline}.`
    );
  doc.moveDown();

  // End the document
  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = generatePDF;
