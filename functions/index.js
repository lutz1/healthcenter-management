// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// ✅ Create User Function (HTTP Request)
exports.createUser = functions.https.onRequest(async (req, res) => {
  try {
    // ✅ Get token from Authorization header
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // ✅ Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const currentUserUid = decodedToken.uid;

    // ✅ Get role of the caller
    const userDoc = await admin.firestore().collection("users").doc(currentUserUid).get();
    const currentUserRole = userDoc.exists ? userDoc.data().role : null;

    if (currentUserRole !== "superadmin" && currentUserRole !== "admin") {
      return res.status(403).json({ error: "Permission denied" });
    }

    // ✅ Extract data from request body
    const { email, password, firstName, lastName, phone, birthdate, address, role } = req.body;

    // ✅ Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // ✅ Save user to Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      phone,
      birthdate,
      address,
      role: role || "staff", // default staff
    });

    return res.status(200).json({ uid: userRecord.uid, email, role: role || "staff" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: error.message });
  }
});