'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';


const signInForm = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        username : "",
        password : ""
    });

    const [notification, setNotification] = useState(null);
    const clearNotification = () => {
        setNotification(null);
    };

    useEffect(() => {
        if (notification) {
          const timer = setTimeout(() => {
              clearNotification();
          }, 5000);
          return () => clearTimeout(timer);
      }
  }, [notification]);


    const handleChange = (e) => {
        const value = e.target.value;
        const name  = e.target.name;

        setUser((prevState) => ({
            ...prevState,
            [name] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch('/api/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
          });
      
          if (!res.ok) {
            const errorData = await res.json();
           setNotification({ type: "error", message: errorData.error || 'Login failed' });
            return;
          }
      
          router.push('/dashboard');
        } catch (error) {
          console.error('Signup error:', error.message);     
        }
      };

    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-gray-400">
          <form className="flex flex-col bg-white shadow-md rounded-lg max-w-md w-[90%] p-6"
            onSubmit={handleSubmit}>
            <h3 className="text-3xl text-center font-bold mb-6 text-blue-600">Sign In</h3>
            <label htmlFor="name" className="text-lg font-semibold mb-2">
              Username
            </label>
            <input
              id="name"
              name="username"
              type="text"
              value={user.username}
              onChange={handleChange}
              className="bg-gray-100 rounded-full px-4 py-2 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
            />
            <label htmlFor="password" className="text-lg font-semibold mb-2">
              Password 
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="bg-gray-100 rounded-full px-4 py-2 mb-6 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
              minLength={8}
              value={user.password}
              onChange={handleChange}
              pattern="^[a-zA-Z0-9]{8,}$"
            />
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-800 text-sm text-center mb-4 transition"
            >
              Don't have an account?
            </Link>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-full px-6 py-2 font-bold hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
          {notification && (
            <div
                className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg max-w-sm z-50 ${notification.type === "success"
                    ? "bg-green-100 border border-green-400 text-green-800"
                    : "bg-red-100 border border-red-400 text-red-800"
                    }`}
                role={notification.type === "error" ? "alert" : "status"}
            >
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <button
                        onClick={clearNotification}
                        className={`ml-4 text-xl font-semibold leading-none ${notification.type === "success"
                            ? "text-green-800 hover:text-green-900"
                            : "text-red-800 hover:text-red-900"
                            } focus:outline-none`}
                        aria-label="Close notification"
                    >
                        &times;
                    </button>
                </div>
            </div>
            )}
        </div>
      );
}

export default signInForm