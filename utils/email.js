const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail App Password (not regular password)
    }
});

// Function to send email to owner
const sendOwnerEmail = async (ownerEmail, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ownerEmail,
        subject: `New Booking Inquiry for ${bookingDetails.listingTitle}`,
        html: `
            <h2>New Booking Request</h2>
            <p>You have received a new booking inquiry for your property:</p>
            <hr>
            <h3>Property Details:</h3>
            <p><strong>Title:</strong> ${bookingDetails.listingTitle}</p>
            <p><strong>Location:</strong> ${bookingDetails.listingLocation}</p>
            <p><strong>Price:</strong> ₹${bookingDetails.listingPrice} per night</p>
            <hr>
            <h3>Guest Details:</h3>
            <p><strong>Name:</strong> ${bookingDetails.guestName}</p>
            <p><strong>Email:</strong> ${bookingDetails.guestEmail}</p>
            <p><strong>Phone:</strong> ${bookingDetails.guestPhone}</p>
            <p><strong>Number of Guests:</strong> ${bookingDetails.numberOfGuests}</p>
            <hr>
            <p>Please contact the guest directly to confirm availability and finalize booking details.</p>
        `
    };
    
    return await transporter.sendMail(mailOptions);
};

// Function to send confirmation email to guest
const sendGuestConfirmation = async (guestEmail, bookingDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: guestEmail,
        subject: `Booking Inquiry Confirmation - ${bookingDetails.listingTitle}`,
        html: `
            <h2>Booking Inquiry Received</h2>
            <p>Dear ${bookingDetails.guestName},</p>
            <p>Thank you for your interest! Your booking inquiry has been sent to the property owner.</p>
            <hr>
            <h3>Your Booking Details:</h3>
            <p><strong>Property:</strong> ${bookingDetails.listingTitle}</p>
            <p><strong>Location:</strong> ${bookingDetails.listingLocation}</p>
            <p><strong>Price:</strong> ₹${bookingDetails.listingPrice} per night</p>
            <p><strong>Number of Guests:</strong> ${bookingDetails.numberOfGuests}</p>
            <hr>
            <p>The property owner will contact you shortly at:</p>
            <p><strong>Email:</strong> ${bookingDetails.guestEmail}</p>
            <p><strong>Phone:</strong> ${bookingDetails.guestPhone}</p>
            <hr>
            <p>Best regards,<br>Your Airbnb Clone Team</p>
        `
    };
    
    return await transporter.sendMail(mailOptions);
};

module.exports = { sendOwnerEmail, sendGuestConfirmation };
