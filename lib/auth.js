import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ToastAndroid } from "react-native";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const server = process.env.EXPO_PUBLIC_SERVER_LINK;

  // console.log(server);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await fetch(`${server}/auth/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Auth check failed, response status:", response.status);
        }
      } else {
        router.push("/sign-in");
        ToastAndroid.show("User is not logged in!", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Token not found");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${server}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("token", data.token);
        await checkAuth();
        ToastAndroid.show("Login successful", ToastAndroid.LONG);
        router.replace("/");
      } else {
        console.error("Invalid email or password");
        ToastAndroid.show("Invalid email or password", ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Login error:", error);
      ToastAndroid.show(
        "An error occurred while logging in",
        ToastAndroid.SHORT
      );
    }
  };

  const logout = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${server}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setUser(null);
      await AsyncStorage.removeItem("token");
      ToastAndroid.show("Logout successful", ToastAndroid.LONG);
      router.replace("/sign-in");
    } else {
      ToastAndroid.show("Logout failed", ToastAndroid.LONG);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${server}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        ToastAndroid.show("Signup successful", ToastAndroid.LONG);
        router.replace("/sign-in");
      } else {
        console.error("Signup failed");
        ToastAndroid.show("Signup failed", ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Signup error:", error);
      ToastAndroid.show(
        "An error occurred while signing up",
        ToastAndroid.LONG
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
