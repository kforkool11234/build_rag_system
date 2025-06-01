"use client"
import { useState } from "react"
import axios from "axios"
import { usecollection } from "@/context"
function Upload(){
    const [files,setfiles]=useState([])
    const [fileStatuses, setFileStatuses] = useState({});
    const {coll}=usecollection()
    const handleUpload = async (e) => {
        const myToken = localStorage.getItem('token');
        e.preventDefault();
        const selectedFiles = Array.from(e.target.files);
        setfiles(selectedFiles);
      
        // Initialize statuses to "uploading"
        const newStatuses = {};
        selectedFiles.forEach(file => {
          newStatuses[file.name] = "uploading";
        });
        setFileStatuses(prev => ({ ...prev, ...newStatuses }));
      
        const data = new FormData();
        selectedFiles.forEach(file => data.append('files', file));
        data.append('c_name', coll);
      
        try {
          const res = await axios.post("http://127.0.0.1:8000/upload/", data, {
            headers: {
              'Authorization': `Bearer ${myToken}`,
            }
          });
      
          // Mark all as done after success
          const updatedStatuses = {};
          selectedFiles.forEach(file => {
            updatedStatuses[file.name] = "done";
          });
          setFileStatuses(prev => ({ ...prev, ...updatedStatuses }));
        } catch (err) {
          console.error(err);
          // optionally handle error states
        }
      };
      
    return(
        <div
              className="bg-darker p-6 rounded shadow-lg w-full h-full flex flex-col justify-end"
              style={{ backgroundColor: "#121F2B" }}
            >
                {files.length > 0 &&
  files.map((file) => (
    <div key={file.name} className="flex items-center gap-2 text-lg text-white">
      <span>{file.name}</span>
      {fileStatuses[file.name] === "uploading" ? (
        <span className="animate-spin text-blue-400">&#9696;</span>  // spinner
      ) : (
        <span className="text-green-400">&#10003;</span> // checkmark
      )}
    </div>
  ))}

              <label
        htmlFor="hiddenFileInput"
        className="cursor-pointer text-teal-400 border-t border-gray-600 w-full text-center pt-2 text-xl leading-tight"
      >
        CLICK TO UPLOAD FILE
      </label>

      <input
        id="hiddenFileInput"
        type="file"
        onChange={handleUpload}
        multiple
        className="hidden"
      />
            </div>
    )
}
export default Upload