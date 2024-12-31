import React, { useState, useEffect, FormEvent } from "react";
import { loginApi } from "api/authApi";
import Cookies from "js-cookie";
const HutechLogo = "/assets/images/logo/logo.png";
const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await loginApi(username, password);
      if (rememberMe) {
        Cookies.set("rememberedUsername", username, { expires: 30 });
      } else {
        Cookies.remove("rememberedUsername");
      }
      const redirectUrl = data.data.user_info.is_admin ? "/admin" : "/";
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    const rememberedUsername = Cookies.get("rememberedUsername");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[400px] p-8 bg-white rounded-3xl shadow">
        <div className="flex items-center justify-center mb-4">
          <img src={HutechLogo} alt="Hutech Logo" className="w-12 h-12" />
          <span className="text-2xl font-semibold ml-2">Login</span>
        </div>

        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your username & password to login
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>
            <a href="/forgot-password" className="text-sm text-blue-600">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-200 text-black rounded-lg hover:bg-blue-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Don't have account?{" "}
          <a href="/register" className="text-blue-600">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
