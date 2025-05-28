import axios from "axios";

// Create an axios instance for API requests
const api = axios.create({
    baseURL: "http://localhost:8000/api", // Correct base URL
    withCredentials: true, // Ensures cookies are sent for authentication
});

// Function to get the CSRF token
const getCSRFToken = async () => {
    try {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
            withCredentials: true,
        });
    } catch (error) {
        console.error("Error getting CSRF token:", error);
        throw error;
    }
};

// Function to handle user login
export const loginUser = async (formData) => {
    try {
        await getCSRFToken(); // Ensure CSRF token is fetched before login

        const response = await api.post(
            "/login", // Correct relative path
            {
                email: formData.email,
                password: formData.password,
            },
            {
                headers: {
                    accept: "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error.response?.data || "Login Failed");
        throw error;
    }
};

// Function to handle user register
export const registerUser = async (formData) => {
    try {
        await getCSRFToken();

        const response = await api.post("/register", formData, {
            headers: {
                accept: "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error(error.response?.data || "Register Failed");
        throw error;
    }
};

// Function to fetch authenticated user
export const fetchUser = async () => {
    try {
        const response = await api.get("/user");
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export default api;
