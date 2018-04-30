const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

module.exports = {
  set: (collection, doc, object) => {
    return new Promise((resolve, reject) => {
      db.collection(collection).doc(doc).set(object)
      .then(() => resolve())
      .catch(err => reject(err));
    });
  },
  get: (collection, doc) => {
    return new Promise((resolve, reject) => {
      db.collection(collection).doc(doc).get()
        .then(doc => {
          if (!doc.exists) {
            reject(new Error('O documento não existe'))
          } else {
            resolve(doc);
          }
        })
        .catch(err => reject(err));
    });
  }
}
