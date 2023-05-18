const dotenv = require("dotenv");
dotenv.config();

const SibApiV3Sdk = require("sib-api-v3-sdk");
const sibAPIKey = process.env.SIB_API_KEY;
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = sibAPIKey;

let contactInstance = new SibApiV3Sdk.ContactsApi();
let createContact = new SibApiV3Sdk.CreateContact();

async function addSIBContact(reqName, reqEmail) {
  createContact.email = reqEmail;
  createContact.listIds = [2];
  createContact.attributes = {
    FIRSTNAME: reqName,
  };

  try {
    const sibResponse = await contactInstance.createContact(createContact);
    console.log("Contact added to Sendinblue:", sibResponse);

    const sender = { email: "ildidvorani@gmail.com", name: "Ildi Dvorani" };
    const to = [{ email: "ildidvorani@gmail.com", name: "Myself" }];
    const subject = "New Form Submission";
    const htmlContent = ` 
    <p>A new form has been submitted by ${reqName} (${reqEmail}).</p>`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = to;
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    const sendSmtpInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await sendSmtpInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent to owner!");

    return sibResponse;
  } catch (error) {
    let errorMessage;
    if (error.response && error.response.text) {
      const errorResponse = JSON.parse(error.response.text);
      errorMessage = errorResponse.message;
    }
    throw new Error(`Failed to add contact to Sendinblue: ${errorMessage}`);
  }
}

module.exports = { addSIBContact };

// Need to also send the user who submitted the form an email
