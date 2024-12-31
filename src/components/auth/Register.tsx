import React, { useState, FormEvent } from "react";
const HutechLogo = "/assets/images/logo/logo.png";
const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add registration logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[400px] p-8 bg-white rounded-3xl shadow">
        <div className="flex items-center justify-center mb-4">
          <img
            src={HutechLogo}
            alt="Hutech Logo"
            className="h-14 w-auto object-contain"
          />
          <span className="text-2xl font-semibold ml-2">Register</span>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-200 text-black rounded-lg hover:bg-blue-300"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
