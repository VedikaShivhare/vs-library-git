const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

/**
 * HTTP function that counts the documents in the books collection
 * and returns the total as JSON.
 */
exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection("books");
      const snapshot = await booksCollection.get();
      const count = snapshot.size;
      res.status(200).json({count});
    } catch (error) {
      console.error("Error counting books:", error.message);
      res.status(500).send("Error counting books");
    }
  });
});

const {onDocumentCreated} = require("firebase-functions/v2/firestore");

/**
 * Firestore trigger that runs when a new document is created in the
 * books collection. It changes every text field of the new book to
 * uppercase and saves it back to the same document.
 */
exports.capitaliseBookOnCreate = onDocumentCreated(
    {document: "books/{bookId}", region: "australia-southeast2"},
    async (event) => {
      const dataSnapshot = event.data;
      if (!dataSnapshot) return;

      const data = dataSnapshot.data();
      const updates = {};

      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "string") {
          updates[key] = data[key].toUpperCase();
        }
      });

      if (Object.keys(updates).length === 0) return;

      console.log("Capitalising book:", event.params.bookId, updates);
      await dataSnapshot.ref.update(updates);
    },
);
