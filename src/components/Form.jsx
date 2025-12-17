"use client";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const Form = () => {
  const ref = useRef();
  const passref = useRef();

  const [form, setform] = useState({ site: "", sitename: "", password: "" });
  const [maintask, setmaintask] = useState([]);

  const getpasswords = async () => {
    let req = await fetch("https://pmanager-backend.onrender.com");
    let passwords = await req.json();
    setmaintask(passwords);
  };

  useEffect(() => {
    getpasswords();
  }, []);

  const showpassword = () => {
    if (ref.current.src.includes("closeeye")) {
      ref.current.src = "icons/openeye.png";
      passref.current.type = "password";
    } else {
      ref.current.src = "icons/closeeye.png";
      passref.current.type = "text";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isDuplicate = maintask.some(
      (item) =>
        item.sitename.toLowerCase() === form.sitename.toLowerCase() &&
        item.id !== form.id
    );

    if (isDuplicate) {
      toast("Sitename already exists!", {
        position: "top-right",
        autoClose: 1500,
        theme: "dark",
        type: "error",
      });
      return;
    }

    if (form.id) {
      await fetch("https://pmanager-backend.onrender.com", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast("Edited!", { theme: "dark", type: "success" });
    } else {
      await fetch("https://pmanager-backend.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: uuidv4() }),
      });
    }

    setform({ site: "", sitename: "", password: "" });
    getpasswords();
  };

  const handledel = async (item) => {
    if (!confirm("Delete this task?")) return;

    await fetch("https://pmanager-backend.onrender.com", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });

    toast("Task Deleted!", { theme: "dark", type: "error" });
    getpasswords();
  };

  const editask = (i) => setform(maintask[i]);

  const copytask = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied!", {
      position: "top-right",
      autoClose: 1000,
      theme: "dark",
      type: "success",
    });
  };

  return (
    <>
      <ToastContainer />

      {/* FORM */}
      <form onSubmit={handleSubmit} className="px-3">
        <input
          type="url"
          placeholder="Enter URL"
          className="border rounded p-2 w-full mt-4"
          value={form.site}
          onChange={(e) => setform({ ...form, site: e.target.value })}
        />

        <div className="flex flex-col sm:flex-row gap-3 mt-3 items-center">
          <input
            type="text"
            placeholder="Site Name"
            className="border rounded p-2 w-full sm:w-1/4"
            value={form.sitename}
            onChange={(e) =>
              setform({ ...form, sitename: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            ref={passref}
            className="border rounded p-2 w-full sm:w-1/4"
            value={form.password}
            onChange={(e) =>
              setform({ ...form, password: e.target.value })
            }
          />

          <span onClick={showpassword} className="cursor-pointer">
            <img ref={ref} src="icons/openeye.png" className="h-7" />
          </span>
        </div>

        <div className="flex justify-center mt-4">
          <button className="bg-green-500 text-white px-6 py-2 rounded font-bold">
            <lord-icon
              src="https://cdn.lordicon.com/vjgknpfx.json"
              trigger="hover"
              style={{ width: "25px", height: "25px" }}
            ></lord-icon>
            Save
          </button>
        </div>
      </form>

      {/* 📱 MOBILE CARD VIEW */}
      <div className="sm:hidden mt-5 space-y-3 px-3">
        {maintask.map((item, i) => (
          <div key={i} className="border rounded p-3 shadow">
            <p className="break-all">
              <b>Site:</b> {item.site}
            </p>
            <p>
              <b>Name:</b> {item.sitename}
            </p>
            <p>
              <b>Password:</b> {"*".repeat(item.password.length)}
            </p>

            <div className="flex gap-3 mt-2">
              <button onClick={() => copytask(item.password)}>
                <lord-icon
                  src="https://cdn.lordicon.com/ysqeagpz.json"
                  trigger="hover"
                  style={{ width: "22px", height: "22px" }}
                ></lord-icon>
              </button>

              <button onClick={() => editask(i)}>
                <lord-icon
                  src="https://cdn.lordicon.com/fikcyfpp.json"
                  trigger="hover"
                  style={{ width: "22px", height: "22px" }}
                ></lord-icon>
              </button>

              <button onClick={() => handledel(item)}>
                <lord-icon
                  src="https://cdn.lordicon.com/jzinekkv.json"
                  trigger="hover"
                  style={{ width: "22px", height: "22px" }}
                ></lord-icon>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 DESKTOP TABLE */}
      <div className="hidden sm:block mt-5 overflow-x-auto px-3">
        <table className="border w-full min-w-[700px]">
          <thead>
            <tr>
              <th className="border p-2">Site</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Password</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {maintask.map((item, i) => (
              <tr key={i}>
                <td className="border p-2 break-all">{item.site}</td>
                <td className="border p-2">{item.sitename}</td>
                <td className="border p-2">
                  {"*".repeat(item.password.length)}
                </td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button onClick={() => editask(i)}>
                    <lord-icon
                      src="https://cdn.lordicon.com/fikcyfpp.json"
                      trigger="hover"
                      style={{ width: "25px", height: "25px" }}
                    ></lord-icon>
                  </button>

                  <button onClick={() => handledel(item)}>
                    <lord-icon
                      src="https://cdn.lordicon.com/jzinekkv.json"
                      trigger="hover"
                      style={{ width: "25px", height: "25px" }}
                    ></lord-icon>
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
