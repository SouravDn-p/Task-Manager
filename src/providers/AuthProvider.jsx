import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.init";

export const AuthContexts = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [couponData, setCouponData] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loader, setLoader] = useState(true); 

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const createUser = async (email, password) => {
    setLoader(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } finally {
      setLoader(false);
    }
  };

  const signInUser = async (email, password) => {
    setLoader(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } finally {
      setLoader(false);
    }
  };

  const signOutUser = async () => {
    setLoader(true);
    try {
      await signOut(auth);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoader(false);
    });

    fetch("coupon.json")
      .then((res) => res.json())
      .then((coupon) => setCouponData(coupon))
      .finally(() => setLoader(false));

    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    createUser,
    signInUser,
    signOutUser,
    user,
    setUser,
    theme,
    toggleTheme,
    loader, 
    setLoader,
  };

  return (
    <AuthContexts.Provider value={authInfo}>{children}</AuthContexts.Provider>
  );
};

export default AuthProvider;
