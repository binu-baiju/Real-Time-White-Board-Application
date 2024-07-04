// components/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/login">Go to Login Page</Link>
    </div>
  );
};

export default NotFound;
