import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCzb1QhrYuJwmuI7jxkbWq6d4oy_Sls0PE',
  authDomain: 'fit5032-6e8e6.firebaseapp.com',
  projectId: 'fit5032-6e8e6',
  storageBucket: 'fit5032-6e8e6.firebasestorage.app',
  messagingSenderId: '144821261707',
  appId: '1:144821261707:web:95afebf40808280d2e4b8e'
}

// Initialise Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db
