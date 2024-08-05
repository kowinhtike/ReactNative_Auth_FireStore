import { StyleSheet, Text, Button, View } from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {auth} from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  getAuth,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

const index = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;
      sendEmailVerification(user);
      // Handle successful registration
      alert(uid);
    } catch (error) {
      // Handle error
      alert(error.message);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;
      // Handle successful registration
      alert(uid);
    } catch (error) {
      // Handle error
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Handle successful logout
      alert("User logged out successfully");
    } catch (error) {
      // Handle error
      alert(error.message);
    }
  };

  const checkEmail = () => {
    const user = getAuth().currentUser;
    //alert(user.uid)
    alert(user.emailVerified);
  };

  const forgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, "iamwinhtike@gmail.com");
      // Handle successful logout
      alert("Successfull");
    } catch (error) {
      // Handle error
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
      {user ? (
        <>
          <Button
            title="Check Email Verification"
            onPress={() => {
              checkEmail();
            }}
          />

          <Button
            title="Go Home"
            onPress={() => {
              router.push("/projects")
            }}
          />

          <Button
            title="Logout"
            onPress={() => {
              handleLogout();
            }}
          />
        </>
      ) : (
        <>
          <Button
            title="Create User"
            onPress={() => {
              handleRegister("iamwinhtike@gmail.com", "winner98");
            }}
          />
          <Button
            title="Login User"
            onPress={() => {
              handleLogin("iamwinhtike@gmail.com", "winner98");
            }}
          />
          <Button
            title="send password reset email"
            onPress={() => {
              forgotPassword();
            }}
          />
        </>
      )}
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  },
  inputContainer:{
    padding:8,
    height:200,
    justifyContent:"space-around"
  }
});
