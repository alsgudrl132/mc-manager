"use client";

import { useState } from "react";
import { AxiosError, submitRegister } from "../store/store";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "admin",
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

  const submitHandler = async () => {
    // 간단한 유효성 검사
    if (!user.username || !user.email || !user.password) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const result = await submitRegister(user);
      if (result.success) {
        alert("회원가입에 성공하였습니다.");
        router.push("/login");
      } else {
        alert(result.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response?.data?.message || "서버 오류가 발생했습니다.";
      alert(errorMessage);
      console.error("회원가입 오류:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 w-full max-w-md border border-gray-300 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

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
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="yourname@example.com"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => userHandler(e, "email")}
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            onClick={submitHandler}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
