import { Suspense, lazy, useEffect, useState } from "react";
import { Heart, Pencil, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Loader from "./Loader";
import { toast } from "../hooks/use-toast";
import NoData from "./NoData";
import { convertWithHypens } from "../lib/utils";
import { useSpaceStore } from "../store/store";
import { useParams } from "react-router-dom";
const Space = lazy(() => import("./Space"));

const IndividualSpace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState([]);
  const [spaceData, setSpaceData] = useState([]);
  const spaceInStore = useSpaceStore((state) => state.space);
  const setSpaceInStore = useSpaceStore((state) => state.setSpace);
  const [editOpen, setEditOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();

  const closeEditDialog = () => setEditOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (spaceInStore) {
        const reviewsResponse = await axios.get(
          `${API_BASE_URL}/${spaceInStore.id}/reviews`,
          {
            withCredentials: true,
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSpaceData(spaceInStore);
        setReviewsData(reviewsResponse.data.items);
      } else {
        const [spaceResponse, reviewsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/spaces/${id}`, {
            withCredentials: true,
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${API_BASE_URL}/${id}/reviews`, {
            withCredentials: true,
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        setSpaceInStore(spaceResponse.data);
        setSpaceData(spaceResponse.data);
        setReviewsData(reviewsResponse.data.items);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching reviews.",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editHeartHandler = async (e, reviewId) => {
    e.preventDefault();
    if (isEditing) return;

    setIsEditing(true);
    try {
      const updated = await axios.put(
        `${API_BASE_URL}/reviews/${reviewId}`,
        {},
        {
          withCredentials: true,
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviewsData((prev) => {
        return prev.map((item) => {
          if (item.id === updated.data.id) {
            return updated.data;
          } else {
            return item;
          }
        });
      });
      toast({
        description: updated.data.isAmongTop
          ? "Successfully liked the review."
          : "Successfully unliked the review.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating review.",
        duration: 2000,
      });
    } finally {
      setIsEditing(false);
    }
  };
  const refreshReviews = async () => {
    setIsRefreshing(true);
    try {
      const reviewsResponse = await axios.get(
        `${API_BASE_URL}/${spaceData.id}/reviews`,
        {
          withCredentials: true,
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviewsData(reviewsResponse.data.items);
    } catch (error) {
      console.error("Error refreshing reviews:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error refreshing reviews.",
        duration: 2000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {spaceData && (
        <div className="border-t border-gray-300 border-b mt-5 flex py-6 justify-between">
          <div className="flex gap-5 items-center">
            <img
              src={spaceData.logo.url}
              alt=""
              height={100}
              width={100}
              className="border rounded-lg border-gray-700"
            />
            <div className="flex flex-col gap-2">
              <div className="font-bold text-4xl">{spaceData.name}</div>
              <div className="text-slate-400">
                Space public url:
                <a
                  href={`https://reviews-742v.onrender.com/${spaceData.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main underline"
                >
                  {`https://reviews-742v.onrender.com/${spaceData.name}`}
                </a>
              </div>
            </div>
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
            variant="secondary"
            className="flex gap-2 items-center justify-center"
          >
            <Pencil size={16} />
            Edit Space
          </Button>
        </div>
      )}

      <div className="my-5">
        <div className="text-center text-6xl underline">Reviews</div>
        {reviewsData.length > 0 && (
          <div className="gap-2 w-full flex justify-end items-center ">
            <div
              onClick={refreshReviews}
              disabled={isRefreshing}
              className=" hover:cursor-pointer"
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </div>
          </div>
        )}
      </div>

      {reviewsData.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-4 ">
          {reviewsData.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 border-gray-500 hover:border-slate-300 "
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2 w-[95%] justify-center ">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="w-full break-words">{review.reviewMsg}</div>
                </div>
                <div>
                  <Heart
                    onClick={(e) => editHeartHandler(e, review.id)}
                    className={`  ${
                      review.isAmongTop
                        ? "fill-red-500 text-red-500"
                        : "text-blue-500 hover:text-red-500"
                    } hover:text-red-300 hover:cursor-pointer`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <span className="font-bold">Name:</span> {review.name}
                </div>
                <div>
                  <span className="font-bold">Email:</span> {review.email}
                </div>
                <div>
                  <span className="font-bold">Submitted at: </span>
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoData description={"No reviews yet."} />
      )}

      <Suspense
        fallback={
          <div className="">
            <Loader />
          </div>
        }
      >
        {editOpen && (
          <Space
            setSpaces={setSpaceData}
            onEditClose={closeEditDialog}
            editOpen={editOpen}
            fromIndividualSpace={true}
          />
        )}
      </Suspense>
    </>
  );
};

export default IndividualSpace;
