"use client";

import { useState } from "react";
import { AxiosError, useAuthStore } from "../store/store";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // 객체에 각각 맞는 값 바인딩
  const userHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    option: string
  ) => {
    setUser((prevState) => {
      return { ...prevState, [option]: event.target.value };
    });
  };

  const loginHandler = async () => {
    setLoading(true);
    try {
      const result = await login(user);
      if (result.success) {
        router.push("/");
      } else {
        alert(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.response?.data?.message || "서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 w-full max-w-md border border-gray-300 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="username" className="font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your username"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => userHandler(e, "username")}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => userHandler(e, "password")}
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => loginHandler()}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <div className="mt-4 flex gap-2 justify-center">
          Don't have an account?
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
