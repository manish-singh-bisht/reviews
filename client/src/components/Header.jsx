import { lazy, Suspense, useState } from "react";
import reviews from "../../public/reviews.png";
import { useAuthStore } from "../store/store";
import { Button } from "./ui/button";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "../lib/utils";

const SignInLogIn = lazy(() => import("./SignInLogIn"));
const Logout = lazy(() => import("./Logout"));

const Header = () => {
  const token =
    useAuthStore((state) => state.token) || getTokenFromLocalStorage();
  const setToken = useAuthStore((state) => state.setToken);
  const [dialogType, setDialogType] = useState(null);
  const navigate = useNavigate();
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const openDialog = (type) => setDialogType(type);
  const closeDialog = () => setDialogType(null);

  const loginHandler = () => {
    if (getTokenFromLocalStorage()) {
      setToken(getTokenFromLocalStorage());
      navigate("/dashboard");
      return;
    }
    openDialog("logIn");
  };
  const signupHandler = () => {
    if (getTokenFromLocalStorage()) {
      setToken(getTokenFromLocalStorage());
      navigate("/dashboard");
      return;
    }
    openDialog("signIn");
  };

  const generateRandomEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${randomString}@example.com`;
  };

  const generateRandomPassword = () => {
    const randomString = Math.random().toString(36).substring(2, 12);
    return randomString + Math.random().toString(36).substring(2, 4);
  };

  const handleGenerateCredentials = () => {
    if (getTokenFromLocalStorage()) {
      setToken(getTokenFromLocalStorage());
      navigate("/dashboard");
      return;
    }

    const email = generateRandomEmail();
    const password = generateRandomPassword();
    setGeneratedEmail(email);
    setGeneratedPassword(password);

    openDialog("signIn");
  };
  return (
    <div className="w-full h-20 flex items-center  justify-between">
      <img src={reviews} alt="logo" height={100} width={100} />
      {!token ||
      window.location.href === "https://reviews-five-sigma.vercel.app/" ? (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleGenerateCredentials}
            className="bg-main hover:bg-main/40 text-white p-2 rounded"
          >
            Generate Random Email & Password
          </Button>
          <Button onClick={signupHandler}>Sign In</Button>
          <Button variant="secondary" onClick={loginHandler}>
            Log In
          </Button>
          <div>
            <Suspense
              fallback={
                <div className=" ">
                  <Loader />
                </div>
              }
            >
              {dialogType && (
                <SignInLogIn
                  isSignIn={dialogType === "signIn"}
                  onClose={closeDialog}
                  initialEmail={generatedEmail}
                  initialPassword={generatedPassword}
                />
              )}
            </Suspense>
          </div>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className=" ">
              <Loader />
            </div>
          }
        >
          <Logout />
        </Suspense>
      )}
    </div>
  );
};

export default Header;
