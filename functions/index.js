const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function: createUser
 * Superadmin → can create admin & staff
 * Admin → can create staff
 * Staff → cannot create
 */
exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to create a user."
    );
  }

  // Get caller's Firestore role
  const callerDoc = await db.collection("users").doc(context.auth.uid).get();
  const callerRole = callerDoc.data()?.role;

  if (!callerRole) {
    throw new functions.https.HttpsError("permission-denied", "Role not found.");
  }

  // ✅ Role checks
  if (callerRole === "superadmin") {
    if (!["admin", "staff"].includes(data.role)) {
      throw new functions.https.HttpsError("permission-denied", "Superadmin can only create admin or staff.");
    }
  } else if (callerRole === "admin") {
    if (data.role !== "staff") {
      throw new functions.https.HttpsError("permission-denied", "Admin can only create staff.");
    }
  } else {
    throw new functions.https.HttpsError("permission-denied", "You are not allowed to create users.");
  }

  const { firstName, lastName, email, phone, birthdate, address, password, role } = data;

  if (!email || !password || !role) {
    throw new functions.https.HttpsError("invalid-argument", "Email, password, and role are required.");
  }

  try {
    // 🔹 Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // 🔹 Save in Firestore
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