// setSuperadmin.js
const admin = require("firebase-admin");

// ✅ Path to your service account JSON key (downloaded from Firebase console)
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setSuperAdmin() {
  const uid = "LbklG7VzSBU3wF7mSHEGGnp7Gqn2"; // 👈 your superadmin UID
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "superadmin" });
    console.log("✅ Superadmin claim set successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error setting claim:", err);
    process.exit(1);
  }
}

setSuperAdmin();