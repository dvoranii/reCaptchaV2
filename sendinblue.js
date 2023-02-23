const dotenv = require("dotenv");
dotenv.config();

const SibApiV3Sdk = require("sib-api-v3-sdk");
const sibAPIKey = process.env.SIB_API_KEY;
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = sibAPIKey;
let apiInstance = new SibApiV3Sdk.ContactsApi();
let createContact = new SibApiV3Sdk.CreateContact();

async function addSIBContact(reqName, reqEmail) {
  createContact.email = reqEmail;
  createContact.listIds = [2];
  createContact.attributes = {
    FIRSTNAME: reqName,
  };

  try {
    const sibResponse = await apiInstance.createContact(createContact);
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
