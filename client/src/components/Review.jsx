import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Suspense, lazy, useEffect, useState } from "react";
import Loader from "./Loader";
const ReviewForm = lazy(() => import("./ReviewForm"));

const Review = () => {
  const { name } = useParams();
  const [spaceData, setSpaceData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const closeDialog = () => setIsOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  const activeTabHandler = () => {
    setActiveTab("thankYou");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/spaces/reviews/${name}`,
        {
          withCredentials: true,
        }
      );
      setSpaceData(response.data);
    } catch (error) {
      if (
        error.status === 400 &&
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error === "Space not found"
      ) {
        navigate("/error/not-found");
      }
      console.error("Error fetching ");
    } finally {
      setIsLoading(false);
    }
  };

  const textColor = spaceData?.theme === "dark" ? "text-white" : "text-black";

  return isLoading ? (
    <Loader />
  ) : (
    spaceData && (
      <div
        className={`py-10 relative rounded-lg border flex flex-col gap-10 text-center w-full ${
          spaceData.theme === "dark" ? "bg-black" : "bg-white"
        } ${textColor}`}
      >
        {activeTab === "basic" ? (
          <>
            <div className="flex items-center justify-center ">
              <img
                src={spaceData.logo.url}
                className="object-contain"
                alt="logo"
                style={{ maxHeight: "180px", maxWidth: "100%" }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-extrabold text-4xl md:text-6xl max-w-full break-words">
                {spaceData.headerTitle}
              </div>
              <div
                className={`max-w-full break-words ${
                  spaceData.theme === "dark"
                    ? "text-slate-300"
                    : "text-slate-600"
                } text-lg md:text-xl px-1`}
              >
                {spaceData.customMessage}
              </div>
            </div>
            <div className="flex flex-col px-5 md:px-10 gap-2 w-full">
              <div className="text-xl md:text-2xl text-left my-3 px-5 font-bold">
                QUESTIONS
              </div>
              {spaceData.questions.map((question, index) => (
                <div
                  key={index}
                  className="flex text-lg md:text-xl items-start px-5 gap-2 text-left w-full"
                >
                  <div
                    className={`rounded-full w-1 h-1 ${
                      spaceData.theme === "dark" ? "bg-white" : "bg-black"
                    } mt-2 flex-shrink-0`}
                  />
                  <div className="break-words max-w-full">{question}</div>
                </div>
              ))}
            </div>
            <Button
              className="border mx-auto flex items-center gap-3 justify-center p-2 text-white w-[90%]"
              style={{ backgroundColor: spaceData.customButtonColor }}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <Pencil size={20} />
              <div>Send in text</div>
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center ">
                <img
                  src={spaceData.thankYouPage.logo.url}
                  className="object-contain"
                  alt="logo"
                  style={{ maxHeight: "180px", maxWidth: "100%" }}
                />
              </div>
              <div className="flex flex-col gap-5 mt-5">
                <div className="font-extrabold text-4xl md:text-6xl max-w-full break-words">
                  {spaceData.thankYouPage.title}
                </div>
                <div
                  className={`max-w-full break-words ${
                    spaceData.theme === "dark"
                      ? "text-slate-300"
                      : "text-slate-600"
                  } text-lg md:text-xl px-1`}
                >
                  {spaceData.thankYouPage.content}
                </div>
              </div>
            </div>
          </>
        )}

        <Suspense
          fallback={
            <div className="">
              <Loader />
            </div>
          }
        >
          {isOpen && (
            <ReviewForm
              closeDialog={closeDialog}
              spaceData={spaceData}
              activeTabHandler={activeTabHandler}
            />
          )}
        </Suspense>
      </div>
    )
  );
};

export default Review;
