import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        password_confirmation: "" 
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (form.password !== form.password_confirmation) {
            setErrorMessage("Passwords do not match");
            return;
        }
    
        try {
            // Retrieve CSRF token first
            await api.get("http://localhost:8000/sanctum/csrf-cookie", {
                withCredentials: true,
                withXSRFToken: true,
            });
    
            // Make the registration request with credentials
            await api.post("/register", form, {
                withCredentials: true,
                withXSRFToken: true,
            });
    
            navigate("/login");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
            console.error(error.response?.data);
        }
    };
    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 p-6">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Create an Account
                </h1>

                {/* Error Message */}
                {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}

                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Your Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Your Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
                            placeholder="name@gmail.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Register Button */}
                    <div className="py-2.5">
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Register
                        </button>
                    </div>

                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white flex items-center justify-center">--- or ---</span>

                    {/* Already have an account? Login button */}
                    <div className="py-2.5">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full text-blue-600 border border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
