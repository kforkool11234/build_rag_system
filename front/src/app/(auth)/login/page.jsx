"use client"
import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/navigation';
export default function Login() {
  const router = useRouter()
  const[username,setusername]=useState(null)
  const[password,setpassword]=useState(null)
  const HandleLogin=async(e)=>{
    e.preventDefault()    
    const response=await axios.post("http://127.0.0.1:8000/api/token/",{
      "username":username,
      "password":password
    })
    console.log(response.data.token)
    localStorage.setItem("token", response.data.token);
    router.push("/")
  }
    return (
      <div className="h-screen flex items-center justify-center bg-dark text-white">
        <div className="bg-darker p-8 rounded shadow-md w-80 border border-accent">
          <h2 className="text-2xl font-semibold text-accent mb-6 text-center">Login</h2>
          <form className="space-y-4" onSubmit={HandleLogin}>
            <input
              type="usename"
              placeholder="username"
              className="w-full p-2 bg-dark border border-gray-700 rounded text-sm text-white placeholder-gray-400"
              onChange={(e)=>setusername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 bg-dark border border-gray-700 rounded text-sm text-white placeholder-gray-400"
              onChange={(e)=>setpassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-accent text-dark py-2 rounded hover:bg-blue-400 transition">
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account? <a href="/register" className="text-accent hover:underline">Register</a>
          </p>
        </div>
      </div>
    );
  }
  