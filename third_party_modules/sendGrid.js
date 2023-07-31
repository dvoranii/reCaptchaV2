const dotenv = require("dotenv");
dotenv.config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_API_KEY);

async function addSGContact(reqName, reqEmail) {
  const msgToOwner = {
    to: "ildidvorani@gmail.com",
    from: "ildidvorani@gmail.com",
    subject: "New Form Submission",
    text: `A new form has been submitted by ${reqName} (${reqEmail}).`,
    html: `<p>A new form has been submitted by ${reqName} (${reqEmail}).</p>`,
  };

  const msgToUser = {
    to: reqEmail,
    from: "ildidvorani@gmail.com",
    subject: "Welcome to our Logistics Company!",
    text: `Dear ${reqName}, \n\n Thank you for contacting us. We will get back to you shortly. \n\n Best, \n Your Logistics Company`,
    html: `<p>Dear ${reqName},</p> <p>Thank you for contacting us. We will get back to you shortly.</p> <p>Best,</p> <p>Your Logistics Company</p>`,
  };

  try {
    await sgMail.send(msgToOwner);
    console.log("Email sent to owner!");

    setTimeout(async () => {
      await sgMail.send(msgToUser);
      console.log("Welcome email sent to user!");
    }, 5 * 60 * 1000);

    return { success: true, message: "Emails scheduled successfully" };
  } catch (error) {
    throw new Error(`Failed to send email: ${error.toString()}`);
  }
}

module.exports = { addSGContact };
