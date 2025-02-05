// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리
    console.error("API 에러:", error);
    return Promise.reject(error);
  }
);

export default api;
