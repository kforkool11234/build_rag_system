"use client"
import { useState,useEffect } from "react";
import axios from "axios"
import { usecollection } from "@/context";
import FloatingInput from "./floating";
function Sidebar() {
  const [collection,setcollection]= useState([])
  const [showInput, setShowInput] = useState(false);
  
  useEffect(()=>{
    const myToken = localStorage.getItem('token')
    const fetchdata= async()=>{
      const response= await axios.post("http://127.0.0.1:8000/collection/",{},{
        headers: {
          'Authorization': `Bearer ${myToken}`, 
          'Content-Type': 'application/json'
        }
      })
      setcollection(response.data)
      console.log("yo")
      console.log("here",response.data)
    }
    fetchdata()
  },[])

  const handleSubmit = async(text) => {
    console.log("Create new collection:", text);
    const myToken = localStorage.getItem('token')
    await axios.post("http://127.0.0.1:8000/create-collection/",{"c_name":text},{
      headers: {
        'Authorization': `Bearer ${myToken}`, 
        'Content-Type': 'application/json'
      }
    })
    setShowInput(false);
  };
  
  const [hover, setHover] = useState(false);
  const {setcoll}=usecollection()
  return (
    <div
      className="w-1/7 p-4 flex flex-col justify-between"
      style={{ backgroundColor: "#121F2B" }} // bg-ublack inline
    >
      <div className="mt-22">
        <h2 className="text-2xl mb-4" style={{ color: "#66C3FF" }}>
          COLLECTIONS
        </h2>
        <ul className="space-y-2">
            {collection.map((item) => ( 
              <li key={item.c_id} className="text-teal-400 cursor-pointer" onClick={() => setcoll(item.c_name)}>
                {item.c_name}
              </li>
            ))}
          </ul>
        
      </div>
      <FloatingInput
        isOpen={showInput}
        onClose={() => setShowInput(false)}
        onSubmit={handleSubmit}
        title="Create New Collection"
      />
      <button
        className="mt-4 text-teal-400 py-2 rounded"
        style={{ backgroundColor: hover ? "#374151" : "#0c151d" }} // hover bg-gray-800 and normal bg-rblack
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setShowInput(true)}
      >
        Create
      </button>
    </div>
  );
}

export default Sidebar;
