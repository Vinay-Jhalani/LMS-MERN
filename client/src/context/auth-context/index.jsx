/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginServices, registerServices } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticated: false,
    user: null,
  });

  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerServices(signUpFormData);
    console.log(data);
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginServices(signInFormData);
    console.log(data);

    if (data.success) {
      console.log(data.data);
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      setAuth({
        authenticated: true,
        user: data.data.user,
      });
    }
  }

  // check auth user

  async function checkAuthUser() {
    const data = await checkAuthService();
    if (data.success) {
      console.log(data.data);
      setAuth({
        authenticated: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticated: false,
        user: "null",
      });
    }
  }

  function resetCredentials() {
    setAuth({
      authenticated: false,
      user: "null",
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
