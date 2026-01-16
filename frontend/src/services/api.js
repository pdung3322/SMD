import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000";

/**
 * Axios instance được cấu hình sẵn baseURL
 * Dùng cho tất cả API calls
 */
const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 * Interceptor: Thêm token vào mọi request
 * (Optional - bạn sẽ implement authentication sau)
 */
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

/**
 * Interceptor: Xử lý lỗi response
 * (Optional - bạn sẽ implement error handling sau)
 */
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token hết hạn, redirect login
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;