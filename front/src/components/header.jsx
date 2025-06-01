"use client";
import { useState, useEffect } from "react"; // Import useEffect
import Link from 'next/link'; // Import Link for navigation
import { useRouter } from "next/navigation";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
  const router = useRouter();
  // Use useEffect to check for token in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // Optional: Add an event listener for storage changes if you expect the token
    // to change in other tabs/windows without a page reload (e.g., logout from another tab).
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLoggedIn(!!updatedToken); // Convert token (or null) to boolean
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setIsLoggedIn(false); // Update login status
    setIsOpen(false); // Close the dropdown
    // Optionally, redirect to login page after logout
    // import { useRouter } from 'next/navigation';
    // const router = useRouter();
    router.push('/login');
  };

  return (
    <div
      className="px-6 py-4 flex justify-end items-center relative border-b border-gray-800"
      style={{ backgroundColor: "#0c151d" }}
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 border border-white rounded-full flex items-center justify-center"
        >
          {/* SVG Icon - Person in circle */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 20.25a8.25 8.25 0 0115 0"
            />
          </svg>
        </button>
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 border border-gray-700 rounded shadow-lg z-10"
            style={{ backgroundColor: "#0c151d" }}
          >
            <ul className="text-white">
              {isLoggedIn ? (
                // --- If logged in ---
                <>
                  <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <Link href="/settings">Settings</Link>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                    onClick={handleLogout} // Call logout function on click
                  >
                    Logout
                  </li>
                </>
              ) : (
                // --- If not logged in ---
                <>
                  <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link> {/* Close dropdown on click */}
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                    <Link href="/register" onClick={() => setIsOpen(false)}>Register</Link> {/* Close dropdown on click */}
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;