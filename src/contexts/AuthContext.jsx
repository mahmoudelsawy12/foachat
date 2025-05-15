import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questionsAsked, setQuestionsAsked] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedQuestionsAsked = localStorage.getItem("questionsAsked");

    if (savedQuestionsAsked) {
      setQuestionsAsked(parseInt(savedQuestionsAsked, 10));
    }

    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const incrementQuestionsAsked = () => {
    const newCount = questionsAsked + 1;
    setQuestionsAsked(newCount);
    localStorage.setItem("questionsAsked", newCount.toString());
  };

  const resetQuestionsAsked = () => {
    setQuestionsAsked(0);
    localStorage.removeItem("questionsAsked");
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await api.getUserProfile();
      setUser(userData);
      resetQuestionsAsked(); // Reset question count when user profile is fetched
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await api.login({ email, password });
    setUser(result.user);
    localStorage.setItem("token", result.token);
    resetQuestionsAsked(); // Reset question count on login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    resetQuestionsAsked(); // Reset question count on logout
  };

  const canAskQuestion = () => {
    return isAuthenticated || questionsAsked < 3;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        questionsAsked,
        incrementQuestionsAsked,
        resetQuestionsAsked,
        canAskQuestion,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
