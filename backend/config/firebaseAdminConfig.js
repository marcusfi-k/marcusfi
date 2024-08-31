const admin = require('firebase-admin');
const serviceAccount = require('./marcusfi-firebase-adminsdk-525fg-32701b932a.json'); // Đường dẫn tới tệp JSON của bạn

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://marcusfi.firebaseio.com',
  storageBucket: 'marcusfi.appspot.com' // Thêm dòng này để chỉ định tên bucket của bạn
});

module.exports = admin;
