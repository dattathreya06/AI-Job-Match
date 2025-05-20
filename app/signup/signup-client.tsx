"use client";

import { useState, useEffect } from "react";

export default function SignupClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);

    // Check if user is already authenticated
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      window.location.href = "/profile";
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Name validation
    if (!name) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
        }
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1000);
      } else {
        setError("No authentication token received");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // If not client-side yet, show nothing to prevent hydration errors
  if (!isClient) {
    return null;
  }

  // If already authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Already logged in. Redirecting to profile...</p>
      </div>
    );
  }

  // Show success message
  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-4">
          Account Created Successfully!
        </h1>
        <p className="mb-6">Redirecting you to your profile...</p>
        <div className="animate-pulse">
          <div className="h-2 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`shadow appearance-none border ${
              validationErrors.name ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            required
          />
          {validationErrors.name && (
            <p className="text-red-500 text-xs italic mt-1">
              {validationErrors.name}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`shadow appearance-none border ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            required
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs italic mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`shadow appearance-none border ${
              validationErrors.password ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            required
            minLength={6}
          />
          {validationErrors.password && (
            <p className="text-red-500 text-xs italic mt-1">
              {validationErrors.password}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Password must be at least 6 characters
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
