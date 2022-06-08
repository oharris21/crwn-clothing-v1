import { createContext, useState, useEffect } from "react";

import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utils"

// the value you want to access
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

// the provider you want to access
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); 
    const value = {currentUser, setCurrentUser}; 

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            if (user) {
                createUserDocumentFromAuth(user); 
            }
            setCurrentUser(user); 
        });

        return unsubscribe; 
    }, []); 

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}