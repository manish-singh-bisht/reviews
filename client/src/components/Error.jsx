import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className=" flex flex-col items-center justify-center  text-white p-5">
      <div className="text-center">
        <p className="text-xl mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="bg-main text-white px-4 py-2 rounded-lg hover:bg-main/60 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
