import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Toaster } from "../src/components/ui/toaster";
import Loader from "./components/Loader";

const LandingPage = lazy(() => import("./components/LandingPage"));
const PrivateRoute = lazy(() => import("./components/PrivateRoute"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const IndividualSpace = lazy(() => import("./components/IndividualSpace"));
const InfoPage = lazy(() => import("./components/InfoPage"));
const Error = lazy(() => import("./components/Error"));
const Review = lazy(() => import("./components/Review"));

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen h-full w-screen text-white px-14">
        <Header />
        <div className="px-28">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route exact path="/" element={<LandingPage />} />
              <Route exact path="/:name" element={<Review />} />
              <Route
                exact
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path="/spaces/:id"
                element={
                  <PrivateRoute>
                    <IndividualSpace />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path="/users/details"
                element={
                  <PrivateRoute>
                    <InfoPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Error />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
