"use client";
import React, { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";

const Form = () => {
  const ref=useRef();
  const passref = useRef();
  const [form, setform] = useState({ site: "", sitename: "", password: "" });
  const [maintask, setmaintask] = useState([]);

  const getpasswords = async()=>{
    let req = await fetch("https://pmanager-backend.onrender.com");
    let passwords = await req.json();
    setmaintask(passwords)
  }

  useEffect(() => {
    getpasswords()
  }, []);

  const showpassword=()=>{
   if(ref.current.src.includes("icons/closeeye.png")){
    ref.current.src="icons/openeye.png";
    passref.current.type="password";
   }else{
    ref.current.src="icons/closeeye.png";
    passref.current.type="text";
   }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(form.id){
      await fetch("https://pmanager-backend.onrender.com",{
      method:"PUT",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(form)
    });
    toast("Edited!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type:"success",
      theme: "dark",
    });
    }else{
    const newData={
      id:uuidv4(),
      site:form.site,
      sitename:form.sitename,
      password:form.password,
    };

    await fetch("https://pmanager-backend.onrender.com",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(newData)
    });
  }
    // setmaintask([...maintask, form]);
    // localStorage.setItem("maintask", JSON.stringify([...maintask, form]));
    setform({ site: "", sitename: "", password: "" });
    getpasswords();
    console.log([...maintask, form]);
  };
  
  const handledel = async(item) => {
    console.log("Delete is Working");
    let deltask = [...maintask];
    deltask.splice(item, 1);
    // setmaintask(deltask);
    // localStorage.setItem("maintask", JSON.stringify(deltask));
    confirm("If You Deleted This Task!")
    await fetch("https://pmanager-backend.onrender.com",{
      method:"DELETE",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id:item.id})
    })
    getpasswords();
    toast("Task Deleted Successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      type:"error"
    });
  };

  const editask=(i)=>{
    console.log("Edit is working");
    const tasktoedit = maintask[i];
    setform(tasktoedit);

    const updatedtask=[...maintask];
    updatedtask.splice(i,1);
    
    // setmaintask(updatedtask)
    // localStorage.setItem("maintask", JSON.stringify(updatedtask));
    //delete,same name already exist, sign up and signin form 
  }

  const copytask = (copy) => {
    navigator.clipboard.writeText(copy);
    toast("Copy to Clipboard!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type:"success",
      theme: "dark",
    });
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center items-center">
          <input
            type="url"
            name="site"
            id="site"
            placeholder=" Enter Your Url"
            className="border border-gray-950 rounded-md p-2 w-11/12 mt-5"
            value={form.site}
            onChange={(e) => {
              setform({ ...form, [e.target.name]: e.target.value });
            }}
          />
        </div>
        <div className="flex justify-center gap-3 mt-3">
          <input
            type="text"
            name="sitename"
            id="sitename"
            placeholder=" Enter The Unique Name"
            className="border border-gray-950 rounded-md p-2  w-3/12"
            value={form.sitename}
            onChange={(e) => {
              setform({ ...form, [e.target.name]: e.target.value });
            }}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder=" Enter The Password"
            className="border border-gray-950 rounded-md p-2  w-3/12"
            value={form.password}
            onChange={(e) => {
              setform({ ...form, [e.target.name]: e.target.value });
            }}
            ref={passref}
          />
          <span
                className="absolute right-0 cursor-pointer"
                onClick={showpassword}
              >
                <img
                  ref={ref}
                  src="icons/openeye.png"
                  alt="openeye"
                  className="h-5 px-2 mt-2 "
                />
              </span>
        </div>
        <div className="flex justify-center mt-4 items-center">
          <div className="bg-green-500 w-24 p-3 flex justify-center items-center rounded-md text-white font-bold hover:bg-green-400">
            <button className="flex justify-center items-center ">
              <lord-icon
                src="https://cdn.lordicon.com/vjgknpfx.json"
                trigger="hover"
                stroke="bold"
                colors="primary:#000000,secondary:#000000"
                style={{ width: "30px", height: "30px" }}
              ></lord-icon>
              Save
            </button>
          </div>
        </div>
      </form>

      <div className="mt-3 flex justify-center items-center">
        <table className="border">
          <thead className="border">
            <tr>
              <th className="border p-2 w-60 font-semibold">Site Url</th>
              <th className="border p-2 w-60 font-semibold">Site Name</th>
              <th className="border p-2 w-60 font-semibold">Password</th>
              <th className="border p-2 w-60 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {maintask.map((item, index) => (
              <tr key={index}>
                <td className="border text-center p-2">
                  <a href={item.site} target="_blank">
                    {item.site}
                  </a>
                  <button
                    onClick={() => {
                      copytask(item.site);
                    }}
                  >
                    <lord-icon
                      src="https://cdn.lordicon.com/ysqeagpz.json"
                      trigger="hover"
                      stroke="bold"
                      colors="primary:#000000,secondary:#000000"
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    ></lord-icon>
                  </button>
                </td>
                <td className="border text-center p-2">
                  {item.sitename}
                  <button
                    onClick={() => {
                      copytask(item.sitename);
                    }}
                  >
                    <lord-icon
                      src="https://cdn.lordicon.com/ysqeagpz.json"
                      trigger="hover"
                      stroke="bold"
                      colors="primary:#000000,secondary:#000000"
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    ></lord-icon>
                  </button>
                </td>
                <td className="border text-center p-2">
                  {"*".repeat(item.password.length)}
                  <button
                    onClick={() => {
                      copytask(item.password);
                    }}
                  >
                    <lord-icon
                      src="https://cdn.lordicon.com/ysqeagpz.json"
                      trigger="hover"
                      stroke="bold"
                      colors="primary:#000000,secondary:#000000"
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    ></lord-icon>
                  </button>
                </td>
                <td className="border text-center p-2">
                  <button onClick={() => handledel(item)}>
                    <lord-icon
                      src="https://cdn.lordicon.com/jzinekkv.json"
                      trigger="hover"
                      stroke="bold"
                      colors="primary:#000000,secondary:#000000"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </button>
                  <button onClick={()=>{
                    editask(index)
                  }}>
                    <lord-icon
    src="https://cdn.lordicon.com/fikcyfpp.json"
    trigger="hover"
    stroke="bold"
    colors="primary:#000000,secondary:#000000"
    style={{ width: "30px", height: "30px" }}>
</lord-icon>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Form;
