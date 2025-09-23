const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to create a user."
    );
  }

  const callerDoc = await db.collection("users").doc(context.auth.uid).get();
  const callerRole = callerDoc.data()?.role;

  if (callerRole !== "superadmin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only Superadmins can create users."
    );
  }

  const { firstName, lastName, email, phone, birthdate, address, password, role } = data;

  if (!email || !password || !role) {
    throw new functions.https.HttpsError("invalid-argument", "Email, password, and role are required.");
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    const userData = {
      firstName,
      lastName,
      email,
      phone: phone || "",
      birthdate: birthdate || "",
      address: address || "",
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    return { uid: userRecord.uid, ...userData };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});