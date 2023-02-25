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
const quoteRef = collection(db, "quotes");

async function addFirebaseContact(email, fullName) {
  const docRef = await addDoc(contactRef, {
    email: email,
    fullName: fullName,
  });
  return docRef.id;
}

module.exports = {
  addFirebaseContact,
};
