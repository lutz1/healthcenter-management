// index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Create User
 * Only admin role or special email can create
 */
exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  // ✅ FIXED: use context.auth.uid and context.auth.token.email
  const uid = context.auth.uid;
  const email = context.auth.token.email;

  const isSpecialAdmin = email === "robert.llemit@gmail.com";

  // Fetch role from Firestore
  const requesterDoc = await db.collection("users").doc(uid).get();
  const requesterRole = requesterDoc.exists ? requesterDoc.data().role : null;

  if (!isSpecialAdmin && requesterRole !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can create users.");
  }

  try {
    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: `${data.firstName || ""} ${data.lastName || ""}`,
    });

    // Save in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email,
      phone: data.phone || "",
      birthdate: data.birthdate || "",
      address: data.address || "",
      role: data.role || "staff",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { uid: userRecord.uid, ...data };
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError("unknown", err.message);
  }
});

/**
 * Delete User
 * Only admin role or special email can delete
 */
exports.deleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  // ✅ FIXED: same change here
  const uid = context.auth.uid;
  const email = context.auth.token.email;

  const isSpecialAdmin = email === "robert.llemit@gmail.com";

  const requesterDoc = await db.collection("users").doc(uid).get();
  const requesterRole = requesterDoc.exists ? requesterDoc.data().role : null;

  if (!isSpecialAdmin && requesterRole !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can delete users.");
  }

  try {
    await admin.auth().deleteUser(data.uid);
    await db.collection("users").doc(data.uid).delete();
    return { success: true, uid: data.uid };
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError("unknown", err.message);
  }
});