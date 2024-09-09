import { Suspense, lazy, useState, useEffect } from "react";
import { Button } from "./ui/button";
import Loader from "./Loader";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "../hooks/use-toast";
import { FileWarning, Pencil, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import NoData from "./NoData";
import { useSpaceStore } from "../store/store";

const Space = lazy(() => import("./Space"));

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const setSpaceInStore = useSpaceStore((state) => state.setSpace);

  const closeDialog = () => setOpen(false);
  const closeEditDialog = () => setEditOpen(false);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/spaces/users`, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSpaces(data.items);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching spaces.",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSpaceHandler = async (e, spaceId) => {
    e.preventDefault();
    setSpaces((prev) => prev.filter((i) => i.id !== spaceId));
    toast({
      description: "Space deleted successfully.",
      duration: 2000,
    });

    try {
      await axios.delete(`${API_BASE_URL}/spaces/${spaceId}`, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting spaces.",
        duration: 2000,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 ">
      <div className="flex justify-between items-center mb-6 ">
        <div className="text-4xl font-bold">Spaces</div>
        <Button
          className="bg-main hover:bg-[#85BDD1] text-white"
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          Create New Space
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : spaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space) => (
            <Link
              to={`/spaces/${space.id}`}
              key={space.id}
              className="border mt-4 rounded-lg shadow flex border-gray-700 "
              onClick={() => setSpaceInStore(space)}
            >
              <img
                src={space.logo.url}
                alt="space logo"
                height={100}
                width={100}
                className="bg-white rounded-l-lg border-r"
              />
              <div className="font-semibold border w-full p-4 bg-slate-900 rounded-r border-gray-700 flex  justify-between items-center">
                {space.name.length > 20
                  ? space.name.slice(0, 20) + "..."
                  : space.name}
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:text-gray-400">
                    <Settings size={15} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 text-white">
                    <DropdownMenuItem
                      className="flex gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setSpaceInStore(space);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil size={15} />
                      Edit the space
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex gap-2"
                      onClick={(e) => {
                        e.preventDefault(), deleteSpaceHandler(e, space.id);
                      }}
                    >
                      <FileWarning size={15} /> Delete the space
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <NoData description={" No space yet, add a new one?"} />
      )}

      <Suspense
        fallback={
          <div className="">
            <Loader />
          </div>
        }
      >
        {(open || editOpen) && (
          <Space
            onClose={closeDialog}
            setSpaces={setSpaces}
            onEditClose={closeEditDialog}
            editOpen={editOpen}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Dashboard;
