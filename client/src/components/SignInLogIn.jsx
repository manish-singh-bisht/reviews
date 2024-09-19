/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { API_BASE_URL } from "../config";
import { useToast } from "../hooks/use-toast";
import { setTokenInLocalStorage } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

const SignInLogIn = ({
  isSignIn,
  onClose,
  initialEmail = "",
  initialPassword = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const { toast } = useToast();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error && validateEmail(e.target.value)) {
      setError(null);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error && e.target.value.length >= 8) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (isSignIn) {
        const { data } = await axios.post(
          `${API_BASE_URL}/users/register`,
          { email, password },
          {
            withCredentials: true,
          }
        );
        setToken(data.user.access_token);
        setTokenInLocalStorage(data.user.access_token);
        navigate("/dashboard");
        toast({
          description: "Signed in successfully.",
          duration: 2000,
        });
      } else {
        const { data } = await axios.post(
          `${API_BASE_URL}/users/login`,
          { email, password },
          {
            withCredentials: true,
          }
        );
        setToken(data.access_token);
        setTokenInLocalStorage(data.access_token);
        navigate("/dashboard");
      }
      onClose();
    } catch (error) {
      if (isSignIn) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.error
            ? error.response.data.error
            : "Failed to sign in",
          duration: 2000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.error
            ? error.response.data.error
            : "Failed to log in",
          duration: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isSignIn ? "Sign in" : "Log in"}</DialogTitle>
            <DialogDescription>
              Please enter your email and password to
              {isSignIn ? " Sign in" : " Log in"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-center">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-center">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="********"
                className="col-span-3"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <DialogFooter>
            <Button
              type="submit"
              variant={isSignIn ? "default" : "secondary"}
              disabled={loading}
            >
              {loading
                ? isSignIn
                  ? "Signing in..."
                  : "Logging in..."
                : isSignIn
                ? "Sign in"
                : "Log in"}
            </Button>
          </DialogFooter>  <div className="text-red-500 font-bold underline">
            It may take approximately 60 seconds to run the first time due to
            being hosted on a free tier. Thank you for your patience!
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInLogIn;
