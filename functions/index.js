const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createUser = functions.https.onCall(async (data, context) => {
  // Only allow superadmin to create users
  const callerUid = context.auth?.uid;
  if (!callerUid) {
    throw new functions.https.HttpsError("unauthenticated", "Not logged in");
  }

  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  if (!callerDoc.exists || callerDoc.data().role !== "superadmin") {
    throw new functions.https.HttpsError("permission-denied", "Not superadmin");
  }

  const { email, password, role, firstName, lastName, phone, birthdate, address } = data;

  if (!email || !password || !role) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
  }

  // Create Firebase Auth user
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: `${firstName} ${lastName}`,
  });

  // Store additional info in Firestore
  await admin.firestore().collection("users").doc(userRecord.uid).set({
    email,
    role,
    firstName,
    lastName,
    phone: phone || "",
    birthdate: birthdate || "",
    address: address || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { uid: userRecord.uid };
});