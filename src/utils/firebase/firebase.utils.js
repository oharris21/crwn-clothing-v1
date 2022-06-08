import { initializeApp } from 'firebase/app'; 
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; 
import { getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs } from 'firebase/firestore'; 

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

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionReference = collection(db, collectionKey); 
    const batch = writeBatch(db); 

    objectsToAdd.forEach((object) => {
        const docRef = doc(collectionReference, object.title.toLowerCase()); 
        batch.set(docRef, object);
    });

    await batch.commit(); 
    console.log('done'); 
  }

  export const getCategoriesAndDocuments = async () => {
      const collectionReference = collection(db, 'categories'); 
      const q = query(collectionReference); 

      const querySnapshot = await getDocs(q); 
      const categoryMap = querySnapshot.docs.reduce((accumulator, docSnapshot) => {
        const { title, items } = docSnapshot.data();
        accumulator[title.toLowerCase()] = items; 
        return accumulator;
      }, {}); 

      return categoryMap; 
  }

  export const createUserDocumentFromAuth = async (userAuth, additionalInfo = {}) => {
    if (!userAuth) return; 

    const userDocRef = doc(db, 'users', userAuth.uid); 

    // console.log(userDocRef); 

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

  export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback); 