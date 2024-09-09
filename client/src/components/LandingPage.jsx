import { useNavigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "../lib/utils";
import { useAuthStore } from "../store/store";
import { Button } from "./ui/button";
import { Suspense, lazy, useState } from "react";
import Loader from "./Loader";
const SignInLogIn = lazy(() => import("./SignInLogIn"));

const LandingPage = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const [dialogType, setDialogType] = useState(null);

  const openDialog = (type) => setDialogType(type);
  const closeDialog = () => setDialogType(null);

  const signupHandler = () => {
    if (getTokenFromLocalStorage()) {
      setToken(getTokenFromLocalStorage());
      navigate("/dashboard");
      return;
    }
    openDialog("signIn");
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <section className=" text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl  text-center font-bold mb-6">
            Collect reviews from your customers with ease
          </h1>

          <p className="text-xl text-slate-400 mb-8">
            Collecting reviews is hard, we get it! So we built Reviews. In
            minutes, you can collect text reviews from your customers with no
            need for a developer or website hosting.
          </p>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={signupHandler}
              size={"lg"}
              className="bg-main font-bold text-lg hover:bg-main/60"
            >
              Try FREE now
            </Button>
          </div>
        </div>
      </section>
      <div className=" bg-white rounded-lg px-6 py-4  max-w-4xl ">
        <div className=" flex items-center ">
          <span className="text-blue-500 text-xl">★★★★★</span>
        </div>

        <p className="text-xl  w-full  font-semibold text-gray-800 mb-4">
          We embedded Reviews on the last page of our candidates skills
          assessment form and candidates reviews started coming in
          automatically! reviews collection is now automated and we don't need
          to ask customers or candidates to drop us reviews anymore!
        </p>

        <div className="flex items-center space-x-4 mt-4">
          <img
            className="w-12 h-12 rounded-full"
            src="https://via.placeholder.com/150"
            alt="User"
          />

          <div>
            <p className="font-semibold text-gray-900">John Cena</p>
            <p className="text-sm text-gray-600">
              Co-Founder at youcantseeme.com
            </p>
          </div>
        </div>
      </div>
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
          />
        )}
      </Suspense>
    </div>
  );
};

export default LandingPage;
