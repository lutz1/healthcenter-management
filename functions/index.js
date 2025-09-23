// tagum-heatmap/functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Create user callable function
exports.createUser = functions.https.onCall(async (data, context) => {
  // ✅ Check if the request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to create a user."
    );
  }

  // ✅ Fetch the role of the logged-in user
  const userDoc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();
  const currentUserRole = userDoc.exists ? userDoc.data().role : null;

  if (currentUserRole !== "superadmin" && currentUserRole !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins or superadmins can create users."
    );
  }

  try {
    // ✅ Create the user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: `${data.firstName} ${data.lastName}`,
    });

    console.log("Created user UID:", userRecord.uid);

    // ✅ Save user info in Firestore
    await admin
      .firestore()
      .collection("users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        birthdate: data.birthdate,
        address: data.address,
        role: data.role || "staff", // default role
      });

    return { uid: userRecord.uid, email: data.email, role: data.role };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});