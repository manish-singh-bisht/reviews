import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Copy, Send } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { API_BASE_URL } from "../config";

const InfoPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");
  const [spaceName, setSpaceName] = useState("");
  const [userApiKey, setUserApiKey] = useState("");
  const [output, setOutput] = useState("");
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const baseEndpoint = "/spaces/:space-name/reviews";

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/details`, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setApiKey(response.data.apiKey);
      setEmail(response.data.email);
    } catch (error) {
      console.error("Error fetching user details");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error fetching user details. Please try again later.",
        duration: 2000,
      });
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard.",
      duration: 2000,
    });
  };

  const getEndpoint = () => {
    return spaceName
      ? baseEndpoint.replace(":space-name", spaceName)
      : baseEndpoint;
  };

  const handleSendRequest = async () => {
    try {
      setOutput("Loading...");

      const url = new URL(`${API_BASE_URL}/spaces/${spaceName}/reviews`);
      if (query) {
        const params = new URLSearchParams(query);
        url.search = params.toString();
      }

      const response = await axios.get(url.toString(), {
        withCredentials: true,
        headers: {
          "x-api-key": userApiKey,
          email: email,
        },
      });

      setOutput(JSON.stringify(response.data, null, 2));
      toast({
        title: "Request Successful",
        description: "The API request was sent successfully.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error sending request:", error);
      toast({
        variant: "destructive",
        title: "Request Failed",
        description:
          "Failed to send request. Please check your inputs and try again.",
        duration: 2000,
      });
      setOutput("");
    }
  };

  const handleCopyIframeCode = () => {
    navigator.clipboard.writeText(iframeCode);
    toast({
      title: "Widget Code Copied",
      description: "The iframe code has been copied to your clipboard.",
      duration: 2000,
    });
  };
  const iframeCode = `<iframe src="https://review-widget-mauve.vercel.app/space-name" width="100%" height="100%" frameborder="0"></iframe>`;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Your API Key</h2>
        </CardHeader>
        <CardContent>
          {apiKey ? (
            <div className="flex items-center space-x-4">
              <code className="bg-gray-100 p-2 rounded break-words max-w-full w-[90%]">
                {apiKey}
              </code>
              <Button onClick={handleCopyApiKey} variant="outline">
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
            </div>
          ) : (
            <p>API key...</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Add Review Widget</h2>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Use this iframe code to embed the review widget on your
            website.Replace space-name with your space name.
          </p>
          <div className="flex items-center space-x-4 mb-4">
            <code className="bg-gray-100 p-2 rounded break-words max-w-full w-[90%]">
              {iframeCode}
            </code>
            <Button onClick={handleCopyIframeCode} variant="outline">
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
          </div>
          <p className="text-sm text-gray-600"></p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Using the API</h2>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Endpoint:</p>
          <code className="block bg-gray-100 p-2 rounded mb-4">
            {getEndpoint()}
          </code>
          <p className="mb-4">
            To fetch reviews, use the following curl command:
          </p>
          <code className="block bg-gray-200 p-4 rounded mb-4 whitespace-pre-wrap text-sm">
            {`curl -X GET "https://reviews-backend-vercel.vercel.app/api/v1/p${baseEndpoint}" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "email: YOUR_EMAIL"`}
          </code>
          <p className="mb-2">Query parameters:</p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li>
              <strong>page</strong> (optional): The page number for pagination.
              <span className="underline">Default:1</span> (e.g., `page=1`).
            </li>
            <li>
              <strong>limit</strong> (optional): Number of reviews per page.
              <span className="underline">Default:50</span> (e.g., `limit=20`).
            </li>
            <li>
              <strong>liked</strong> (optional): Filter by top reviews.
              <span className="underline">Default:false</span> (e.g.,
              `liked=true`).
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Try it out</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="endpoint" className="block mb-2">
                Endpoint:
              </label>
              <code className="block bg-gray-100 p-2 rounded">
                {getEndpoint()}
              </code>
            </div>
            <div>
              <label htmlFor="space-name" className="block mb-2">
                Space name:
              </label>
              <Input
                id="space-name"
                type="text"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                placeholder="Enter your space name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">
                Email:
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="userApiKey" className="block mb-2">
                API Key:
              </label>
              <Input
                id="userApiKey"
                type="password"
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
            <div>
              <label htmlFor="query" className="block mb-2">
                Query Parameters:
              </label>
              <Input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., page=1&limit=20&liked=true"
              />
            </div>
            <Button
              onClick={handleSendRequest}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" /> Send Request
            </Button>
            {output && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Output:</h3>
                <pre className="bg-white p-4 rounded overflow-x-auto border">
                  {output}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoPage;
