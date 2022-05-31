import { initializeApp } from 'firebase/app'; 
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut } from 'firebase/auth'; 
import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore'; 

const firebaseConfig = {
    apiKey: "AIzaSyCULBnrLpDIZpeyyBHEJG4bzTIR1WL-tW8",
    authDomain: "crwn-clothing-db-6405f.firebaseapp.com",
    projectId: "crwn-clothing-db-6405f",
    storageBucket: "crwn-clothing-db-6405f.appspot.com",
    messagingSenderId: "613749717804",
    appId: "1:613749717804:web:c73fc7f888407f5cd10a89"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig); 

  const googleProvider = new GoogleAuthProvider(); 
  googleProvider.setCustomParameters({
      prompt: "select_account"
  }); 

  export const auth = getAuth(); 
  export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider); 
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider); 
  export const db = getFirestore(); 

  export const createUserDocumentFromAuth = async (userAuth, additionalInfo = {}) => {
    if (!userAuth) return; 

    const userDocRef = doc(db, 'users', userAuth.uid); 

    console.log(userDocRef); 

    const userSnapshot = await getDoc(userDocRef); 

    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth; 
        const createdAt = new Date(); 

        try {
            await setDoc(userDocRef, {displayName, email, createdAt, ...additionalInfo}); 
        } catch (error) {
            console.log("error creating user", error.message); 
        }
    }

    return userDocRef; 
  }

  export const createAuthUserWithEmailAndPassword = async (auth, email, password) => {
      if (!email || !password) return; 
      return await createUserWithEmailAndPassword(auth, email, password); 
  }

  export const signInAuthUserWithEmailAndPassword = async (auth, email, password) => {
      if (!email || !password) return; 
      return await signInWithEmailAndPassword(auth, email, password); 
  }

  export const signOutUser = async () => await signOut(auth);