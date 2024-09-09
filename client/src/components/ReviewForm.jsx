/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { FormField } from "./Space";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "../hooks/use-toast";
import { Dialog, DialogContent } from "./ui/dialog";

const ReviewForm = ({ closeDialog, spaceData, activeTabHandler }) => {
  const [reviewData, setReviewData] = useState({
    reviewMsg: "",
    name: "",
    email: "",
    rating: 5,
    spaceName: spaceData.name,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setReviewData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleRatingClick = (index) => {
    setReviewData((prev) => ({ ...prev, rating: index + 1 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || reviewData.rating === 0) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData, {
        withCredentials: true,
      });
      if (response.status === 201) {
        closeDialog();
        activeTabHandler();
      }
    } catch (error) {
      console.error("Error submitting review");
      let err = "Error submitting review";
      if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error === "You already sent the review. Thank you!!"
      ) {
        err = error.response.data.error;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: err,
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={closeDialog}>
      <DialogContent className="h-[90%] overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className=" bg-white text-left  w-full max-w-lg  rounded-lg text-black"
        >
          <h2 className="text-2xl font-semibold mb-4">Write text review</h2>
          <div className="flex w-fit items-center border border-black justify-start mb-4">
            <img
              height={100}
              width={100}
              src={spaceData.logo.url}
              alt="Logo"
              className="border border-black object-contain "
            />
          </div>
          <div className="text-lg font-bold mb-2">Questions</div>
          <ul className="list-disc list-inside text-left mb-5 text-slate-600 ">
            {spaceData.questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-start ">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={24}
                  onClick={() => handleRatingClick(index)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    index < reviewData.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <FormField
              label="Review"
              name="reviewMsg"
              value={reviewData.reviewMsg}
              onChange={handleInputChange}
              maxLength={400}
              minLength={30}
              placeholder="Write your review here..."
              required
              textarea
              isLoading={isLoading}
            />
          </div>
          <div className="mt-5 space-y-5">
            <FormField
              label="Your Name"
              name="name"
              value={reviewData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
              isLoading={isLoading}
            />
            <FormField
              label="Your Email"
              name="email"
              value={reviewData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              isLoading={isLoading}
            />
          </div>
          {emailError && (
            <p className="text-red-500 mt-1 text-sm ">{emailError}</p>
          )}
          <div className="flex justify-between mt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-main hover:bg-main/60 text-white"
              disabled={isLoading || emailError || reviewData.rating === 0}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
