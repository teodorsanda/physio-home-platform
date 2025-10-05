"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toaster() {
  return <ToastContainer position="bottom-right" closeOnClick theme="colored" />;
}
