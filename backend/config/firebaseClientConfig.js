const firebase = require('firebase/app');
require('firebase/auth');

const firebaseConfig = {
apiKey: "AIzaSyA1vV9EvzEgsPXVN2h9Zhezv_nVsNiFblA",
authDomain: "marcusfi.firebaseapp.com",
projectId: "marcusfi",
storageBucket: "marcusfi.appspot.com",
messagingSenderId: "187141944455",
appId: "1:187141944455:web:d575358119ef2d55f4b422",
measurementId: "G-8ZP0GCNY17"

};

firebase.initializeApp(firebaseConfig);

module.exports = firebase;
