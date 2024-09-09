/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Heart,
  Moon,
  Pencil,
  Plus,
  RefreshCw,
  Settings,
  Sun,
  Trash,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import reviews from "../../public/reviews.png";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { convertWithHypens } from "../lib/utils";
import { useSpaceStore } from "../store/store";

const MAX_QUESTIONS = 5;
const MIN_QUESTIONS = 2;

const Space = ({
  onClose,
  setSpaces,
  onEditClose,
  editOpen,
  fromIndividualSpace,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const spaceInStore = useSpaceStore((state) => state.space);
  const setSpaceInStore = useSpaceStore((state) => state.setSpace);

  const [spaceData, setSpaceData] = useState({
    name: "",
    headerTitle: "",
    customMessage: "",
    theme: "light",
    customButtonColor: "#000000",
    logo: "",
    questions: [
      "How has [our product / service] helped you?",
      "What is the best thing about [our product / service]",
    ],
  });
  const [thankYouData, setThankYouData] = useState({
    logo: "",
    title: "Thank you!",
    content: "Thank you so much for your shoutout! It means a ton for us! 🙏",
    theme: "light",
  });

  useEffect(() => {
    editOpen && getSpace();
  }, []);

  const getSpace = async () => {
    if (spaceInStore) {
      setSpaceData({ ...spaceInStore, logo: spaceInStore.logo.url });
      setThankYouData({
        ...spaceInStore.thankYouPage,
        logo: spaceInStore.thankYouPage.logo.url,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching spaces.",
        duration: 2000,
      });
    }
  };

  const fileInputRef = useRef(null);
  const thankYouFileInputRef = useRef(null);

  const handleActiveTab = (e, value) => {
    e.preventDefault();
    setActiveTab(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSpaceData((prev) => ({ ...prev, [name]: value }));
  };
  const handleThankYouInputChange = (e) => {
    const { name, value } = e.target;
    setThankYouData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, value) => {
    setSpaceData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const addQuestion = (e) => {
    e.preventDefault();
    setSpaceData((prev) => ({
      ...prev,
      questions: [...prev.questions, ""],
    }));
  };

  const removeQuestion = (e, index) => {
    e.preventDefault();
    setSpaceData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleLogoUpload = (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    if (file && file.size > 1 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size exceeds 1 MB.",
        duration: 2000,
      });
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSpaceData((prev) => ({ ...prev, logo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleThankYouLogoUpload = (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    if (file && file.size > 1 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size exceeds 1 MB.",
        duration: 2000,
      });
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThankYouData((prev) => ({ ...prev, logo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const triggerThankYouFileInput = (e) => {
    e.preventDefault();
    thankYouFileInputRef.current.click();
  };

  const handleThemeToggle = (e) => {
    e.preventDefault();
    setSpaceData((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
    setThankYouData((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const handleColorChange = (e, color) => {
    e.preventDefault();

    setSpaceData((prev) => ({ ...prev, customButtonColor: color }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      !spaceData.name ||
      !spaceData.headerTitle ||
      !spaceData.customMessage ||
      !spaceData.customButtonColor ||
      spaceData.questions.length === 0
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all required Space fields.",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    if (!spaceData.logo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Space logo is missing. Please upload a logo.",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    const hasEmptyQuestion = spaceData.questions.some((ques) => {
      if (ques.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Empty question found!",
          duration: 2000,
        });
        return true;
      }
      return false;
    });

    if (hasEmptyQuestion) {
      setIsLoading(false);
      return;
    }

    if (!thankYouData.title || !thankYouData.content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all required Thank You page fields.",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    if (!thankYouData.logo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Thank You logo is missing. Please upload a logo.",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    const isValidHex = /^#[0-9A-F]{6}$/i.test(spaceData.customButtonColor);

    if (!isValidHex) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid color code. Please enter a valid hex code.",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (editOpen) {
        response = await axios.put(
          `${API_BASE_URL}/spaces/${spaceInStore.id}`,
          { ...spaceData, thankYouPage: { ...thankYouData } },
          {
            withCredentials: true,
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fromIndividualSpace && setSpaceInStore(response.data.updatedSpace);
        fromIndividualSpace
          ? setSpaces(response.data.updatedSpace)
          : setSpaces((prev) =>
              prev.map((item) => {
                if (item.id === spaceInStore.id) {
                  let updatedItem = response.data.updatedSpace;
                  return updatedItem;
                } else {
                  return item;
                }
              })
            );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/spaces`,
          { ...spaceData, thankYouPage: { ...thankYouData } },
          {
            withCredentials: true,
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSpaces((prev) => [response.data.space, ...prev]);
      }

      if (response.status === 201 || response.status === 200) {
        toast({
          description: editOpen
            ? "Space updated successfully."
            : "Space created successfully.",
          duration: 2000,
        });
      }

      editOpen ? onEditClose() : onClose();
    } catch (error) {
      let err = editOpen
        ? "Failed to update space. Please try again."
        : "Failed to create space. Please try again.";
      if (error.response && error.response.data && error.response.data.error) {
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
    <Dialog open onOpenChange={editOpen ? onEditClose : onClose}>
      <DialogContent className="h-screen max-w-screen bg-black border-none text-white overflow-auto">
        <div className="mx-20 border bg-white rounded-lg px-4 py-2 flex flex-col gap-2">
          <DialogClose asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                editOpen ? onEditClose() : onClose();
              }}
              variant="secondary"
              className="self-end rounded-full border mt-4"
            >
              X
            </Button>
          </DialogClose>

          <div className="grid grid-cols-[33%_65%] gap-5 text-slate-500">
            <SpacePreview
              spaceData={spaceData}
              thankYouData={thankYouData}
              activeTab={activeTab}
            />
            <SpaceForm
              spaceData={spaceData}
              isLoading={isLoading}
              thankYouData={thankYouData}
              handleInputChange={handleInputChange}
              handleThankYouInputChange={handleThankYouInputChange}
              handleQuestionChange={handleQuestionChange}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
              handleSubmit={handleSubmit}
              handleLogoUpload={handleLogoUpload}
              handleThankYouLogoUpload={handleThankYouLogoUpload}
              triggerFileInput={triggerFileInput}
              triggerThankYouFileInput={triggerThankYouFileInput}
              fileInputRef={fileInputRef}
              thankYouFileInputRef={thankYouFileInputRef}
              handleThemeToggle={handleThemeToggle}
              handleColorChange={handleColorChange}
              handleActiveTab={handleActiveTab}
              editOpen={editOpen}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SpacePreview = ({ spaceData, activeTab, thankYouData }) => {
  return (
    <div
      className={`py-10 relative rounded-lg border flex flex-col gap-10 text-center ${
        spaceData.theme === "dark"
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >
      <Badge className="absolute p-2 text-green-600 bg-green-200 -top-4 left-8">
        Live preview - {activeTab === "basic" ? "reviews" : "thank you"} page
      </Badge>
      {activeTab === "basic" ? (
        <>
          <div className="flex items-center justify-center h-24">
            <img
              src={!spaceData.logo.length ? reviews : spaceData.logo}
              className="rounded-full border border-gray-300 h-24 w-24 object-cover"
              alt="logo"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl max-w-full break-words">
              {spaceData.headerTitle || "Header goes here..."}
            </div>
            <div
              className={`max-w-full break-words px-1 ${
                spaceData.theme === "dark" ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {spaceData.customMessage || "Your custom message goes here..."}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="text-xl font-bold">QUESTIONS</div>
            {spaceData.questions.map((question, index) => (
              <div
                key={index}
                className="flex items-start px-5 gap-2 text-left w-full"
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
          >
            <Pencil size={20} />
            <div>Send in text</div>
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center h-28">
              <img
                src={!thankYouData.logo ? reviews : thankYouData.logo}
                className="rounded-full border border-gray-300 h-24 w-24 object-cover"
                alt="logo"
              />
            </div>
            <div className="font-extrabold text-3xl max-w-full break-words">
              {thankYouData.title || "Thank you title goes here..."}
            </div>
            <div className="max-w-full break-words px-1">
              {thankYouData.content || "Thank you message goes here..."}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
const SpaceForm = ({
  spaceData,
  thankYouData,
  handleInputChange,
  handleThankYouInputChange,
  handleQuestionChange,
  addQuestion,
  removeQuestion,
  handleSubmit,
  isLoading,
  handleLogoUpload,
  handleThankYouLogoUpload,
  triggerFileInput,
  triggerThankYouFileInput,
  fileInputRef,
  thankYouFileInputRef,
  handleThemeToggle,
  handleColorChange,
  handleActiveTab,
  editOpen,
}) => {
  const colorOptions = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];
  const formattedUrl = convertWithHypens(spaceData.name);
  return (
    <div className="w-full">
      <Tabs defaultValue="basic" className="w-full h-full">
        <TabsList className="w-full">
          <TabsTrigger
            onClick={(e) => {
              handleActiveTab(e, "basic");
            }}
            className="w-1/2 flex items-center gap-1"
            value="basic"
          >
            <Settings size={16} /> Basic
          </TabsTrigger>
          <TabsTrigger
            className="w-1/2 flex gap-1 items-center"
            value="thank-you-page"
            onClick={(e) => {
              handleActiveTab(e, "thank-you-page");
            }}
          >
            <Heart size={15} /> Thank you page
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader className="flex flex-col gap-2">
              <DialogTitle
                className={`text-black font-extrabold text-4xl w-full text-center ${
                  editOpen && "mt-2"
                }`}
              >
                {editOpen ? "Edit Space" : " Create a new Space"}
              </DialogTitle>
              <DialogDescription className="text-center w-full font-bold text-gray-600 text-xl">
                {!editOpen &&
                  "After the Space is created, it will generate a dedicated page for collecting reviews."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <FormField
                  label="Space Name"
                  name="name"
                  value={convertWithHypens(spaceData.name)}
                  onChange={handleInputChange}
                  placeholder="Enter space name"
                  required
                  maxLength={30}
                  isLoading={isLoading}
                />
                <span className="text-sm text-gray-500 p-1">
                  Public URL is: https://reviews-five-sigma.vercel.app/
                  {spaceData.name ? formattedUrl : "your-space"}
                </span>
              </div>
            </div>

            <FormField
              label="Header Title"
              name="headerTitle"
              value={spaceData.headerTitle}
              onChange={handleInputChange}
              placeholder="Would you like to give a shoutout for xyz?"
              required
              maxLength={50}
              isLoading={isLoading}
            />

            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Space logo <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 mt-2">
                {spaceData.logo ? (
                  <img
                    src={spaceData.logo}
                    alt="Space logo"
                    className="w-12 h-12 rounded-full object-cover border-gray-300 border"
                  />
                ) : (
                  <div className="rounded-full border border-gray-300 bg-white w-12 h-12"></div>
                )}
                <Button
                  variant="secondary"
                  onClick={triggerFileInput}
                  className="text-black  bg-white border border-gray-300 rounded-full"
                  disabled={isLoading}
                >
                  Change
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <FormField
              label="Your Custom Message"
              name="customMessage"
              value={spaceData.customMessage}
              onChange={handleInputChange}
              maxLength={400}
              placeholder="Write a warm message to your customers, and give them simple directions on how to write the best review."
              required
              textarea
              isLoading={isLoading}
            />

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="questions"
                className="block text-sm font-medium text-gray-700"
              >
                Questions <span className="text-red-500">*</span>
              </Label>
              {spaceData.questions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-center min-h-12 h-fit gap-2"
                >
                  <div className="flex-grow border rounded-md flex items-center bg-white focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2">
                    <Input
                      value={question}
                      onChange={(e) =>
                        handleQuestionChange(index, e.target.value)
                      }
                      maxLength={100}
                      placeholder="Enter your question"
                      className="border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 w-[92%] outline-none shadow-none"
                    />
                    <div>{question.length}/100</div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={(e) => removeQuestion(e, index)}
                    className="p-2"
                    disabled={
                      spaceData.questions.length <= MIN_QUESTIONS || isLoading
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={addQuestion}
                variant="secondary"
                className="p-2 w-fit flex gap-2"
                disabled={
                  spaceData.questions.length >= MAX_QUESTIONS || isLoading
                }
              >
                <Plus className="h-4 w-4 border border-black rounded-full" />
                Add one (up to {MAX_QUESTIONS})
              </Button>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Custom color button
              </Label>
              <div className="flex gap-2 mt-2">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    onClick={(e) => !isLoading && handleColorChange(e, color)}
                    className={`w-8 h-8 rounded-full cursor-pointer ${
                      spaceData.customButtonColor === color
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Input
                type="text"
                value={spaceData.customButtonColor}
                onChange={(e) =>
                  !isLoading && handleColorChange(e, e.target.value)
                }
                placeholder="Enter custom color (e.g., #FF5733)"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Choose a theme
              </Label>

              <Button
                onClick={handleThemeToggle}
                disabled={isLoading}
                variant="default"
                className="p-2"
              >
                {spaceData.theme === "light" ? (
                  <Moon size={20} />
                ) : (
                  <Sun size={20} />
                )}
              </Button>
            </div>

            <Button
              type="submit"
              className="mt-4 bg-blue-500 text-white w-full"
              disabled={isLoading}
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : "hidden"}
              />
              {editOpen ? "Update Space" : "Create new space"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="thank-you-page">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader className="flex flex-col gap-2">
              <DialogTitle className="text-black font-extrabold text-4xl w-full text-center">
                Thank You Page
              </DialogTitle>
              <DialogDescription className="text-center w-full font-bold text-gray-600 text-xl">
                Customize the thank you page that appears after a review is
                submitted.
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Thank You Page Logo <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 mt-2">
                {thankYouData.logo ? (
                  <img
                    src={thankYouData.logo}
                    alt=" logo"
                    className="w-12 h-12 rounded-full  object-cover border-gray-300 border"
                  />
                ) : (
                  <div className="rounded-full bg-white w-12 h-12 border-gray-300 border"></div>
                )}
                <Button
                  variant="secondary"
                  onClick={triggerThankYouFileInput}
                  className="text-black bg-white border border-gray-300 rounded-full"
                  disabled={isLoading}
                >
                  Change
                </Button>
                <input
                  type="file"
                  ref={thankYouFileInputRef}
                  onChange={handleThankYouLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <FormField
              label="Thank You Title"
              name="title"
              value={thankYouData.title}
              onChange={handleThankYouInputChange}
              placeholder="Enter thank you title"
              required
              maxLength={100}
              isLoading={isLoading}
            />
            <FormField
              label="Thank You Content"
              name="content"
              value={thankYouData.content}
              onChange={handleThankYouInputChange}
              placeholder="Enter thank you message"
              required
              maxLength={250}
              textarea
              isLoading={isLoading}
            />
            <Button
              type="submit"
              className={`mt-4 bg-blue-500 text-white w-full `}
              disabled={isLoading}
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : "hidden"}
              />
              {editOpen ? "Update Space" : "Create new space"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  textarea = false,
  maxLength,
  isLoading,
  minLength = 0,
}) => (
  <div>
    <Label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {textarea ? (
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={!isLoading ? onChange : undefined}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        rows={4}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
      />
    ) : (
      <Input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={!isLoading ? onChange : undefined}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
      />
    )}
  </div>
);

export default Space;
