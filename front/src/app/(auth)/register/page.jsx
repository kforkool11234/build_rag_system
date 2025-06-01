"use client"
import axios from "axios";
import {useRouter} from 'next/navigation';
import { useState } from "react";
export default function Register() {
  const router = useRouter()
    const[username,setusername]=useState(null)
    const[password,setpassword]=useState(null)
  const handleregister=async(e)=>{
    e.preventDefault()
    const response=await axios.post("http://localhost:8000/register/",{
      
        "username": username,
        "password": password
      
    })
    console.log(response.data)
    router.push('/login');
  }
    return (
      <div className="h-screen flex items-center justify-center bg-dark text-white">
        <div className="bg-darker p-8 rounded shadow-md w-80 border border-accent">
          <h2 className="text-2xl font-semibold text-accent mb-6 text-center">Register</h2>
          <form className="space-y-4" onSubmit={handleregister}>
            <input
              type="text"
              placeholder="Username"
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
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account? <a href="/login" className="text-accent hover:underline">Login</a>
          </p>
        </div>
      </div>
    );
  }
  