import * as admin from "firebase-admin";
// var serviceAccount = require("@/serviceAccountKey.json");
const { privateKey } = JSON.parse(process.env.DB_PRIVATE_KEY!);

let app = admin.initializeApp(
  {
    credential: admin.credential.cert({
      clientEmail: process.env.DB_CLIENT_EMAIL,
      privateKey: privateKey,
      projectId: process.env.DB_PROJECT_ID,
    }),
  },
  Date.now().toString()
);

let db = admin.firestore(app);

export default db;
