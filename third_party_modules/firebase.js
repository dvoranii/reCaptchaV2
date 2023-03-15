const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const dotenv = require("dotenv");
dotenv.config();

const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_KEY}`,
  authDomain: "cgl-forms.firebaseapp.com",
  databaseURL: "https://cgl-forms-default-rtdb.firebaseio.com",
  projectId: "cgl-forms",
  storageBucket: "cgl-forms.appspot.com",
  messagingSenderId: "1008506608692",
  appId: "1:1008506608692:web:47818afefcc2935608be61",
};

const fb = initializeApp(firebaseConfig);
const db = getFirestore(fb);
const contactRef = collection(db, "contact");
const quoteRef = collection(db, "quotes2");

async function addQuoteRequestFormData(
  fullName,
  email,
  companyName,
  phone,
  pickupInfo,
  shippingInfo,
  numSkids,
  skidDetails,
  serviceType,
  numPieces,
  weight,
  weightUnits,
  hazardous,
  hsCodes,
  additionalInfo
) {
  const docRef = await addDoc(quoteRef, {
    fullName: fullName,
    email: email,
    companyName: companyName,
    phone: phone,
    pickupInfo: pickupInfo,
    shippingInfo: shippingInfo,
    additionalInfo: additionalInfo,
    shippingDetails: {
      numSkids: numSkids,
      numPieces: numPieces,
      weight: weight,
      weightUnits: weightUnits,
      hazardous: hazardous,
      hsCodes: hsCodes,
      serviceType: serviceType,
      skidDetails: skidDetails,
    },
  });
  return docRef.id;
}

async function addFirebaseContact(email, fullName) {
  const docRef = await addDoc(contactRef, {
    email: email,
    fullName: fullName,
  });
  return docRef.id;
}

module.exports = {
  addFirebaseContact,
  addQuoteRequestFormData,
};
