const { initializeApp } = require("firebase/app");
const { getAuth, GoogleAuthProvider, FacebookAuthProvider } = require("firebase/auth");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

let getAnalytics;
if (typeof window !== 'undefined') {
  // Firebase Analytics chỉ hỗ trợ môi trường trình duyệt
  getAnalytics = require("firebase/analytics").getAnalytics;
}

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyA1vV9EvzEgsPXVN2h9Zhezv_nVsNiFblA",
  authDomain: "marcusfi.firebaseapp.com",
  projectId: "marcusfi",
  storageBucket: "marcusfi.appspot.com",
  messagingSenderId: "187141944455",
  appId: "1:187141944455:web:d575358119ef2d55f4b422",
  measurementId: "G-8ZP0GCNY17"
  
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Hàm upload tệp lên Firebase Storage
const uploadFile = async (file, path) => {
  const storageRef = ref(storage, `${path}/${file.name}`);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    console.log('File available at', url);
    return url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

module.exports = { auth, googleProvider, facebookProvider, storage, analytics, uploadFile };
