// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBcW2xy-4IX2lCofvE6uHrhGURGzkMeASQ',
  authDomain: 'trabajando-en-la-nube-197d7.firebaseapp.com',
  projectId: 'trabajando-en-la-nube-197d7',
  storageBucket: 'trabajando-en-la-nube-197d7.appspot.com',
  messagingSenderId: '705544921539',
  appId: '1:705544921539:web:92f1e7932d2c9b0d9c1d76'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
