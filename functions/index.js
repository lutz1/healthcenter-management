// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Create User Cloud Function
 * Only "admin" role OR special email can create
 */
exports.createUser = functions.https.onCall(async (data, context) => {
  // ✅ Must be logged in
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to create a user."
    );
  }

  const requesterEmail = context.auth.token.email;
  const requesterUid = context.auth.uid;

  // ✅ Special email check
  const isSpecialAdmin = requesterEmail === "robert.llemit@gmail.com";

  // ✅ Get requester's role from Firestore
  const requesterDoc = await db.collection("users").doc(requesterUid).get();
  const requesterRole = requesterDoc.exists ? requesterDoc.data().role : null;

  if (!isSpecialAdmin && requesterRole !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can create users."
    );
  }

  try {
    // ✅ Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: `${data.firstName || ""} ${data.lastName || ""}`,
    });

    // ✅ Save user in Firestore
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

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      birthdate: data.birthdate,
      address: data.address,
      role: data.role,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new functions.https.HttpsError("unknown", error.message);
  }
});

/**
 * Delete User Cloud Function
 * Only "admin" role OR special email can delete
 */
exports.deleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to delete a user."
    );
  }

  const requesterUid = context.auth.uid;
  const requesterEmail = context.auth.token.email;
  const isSpecialAdmin = requesterEmail === "robert.llemit@gmail.com";

  const requesterDoc = await db.collection("users").doc(requesterUid).get();
  const requesterRole = requesterDoc.exists ? requesterDoc.data().role : null;

  if (!isSpecialAdmin && requesterRole !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can delete users."
    );
  }

  try {
    // Delete user from Firebase Auth
    await admin.auth().deleteUser(data.uid);

    // Delete user from Firestore
    await db.collection("users").doc(data.uid).delete();

    return { success: true, uid: data.uid };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new functions.https.HttpsError("unknown", error.message);
  }
});