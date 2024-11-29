import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage></RegisterPage>}></Route>
      <Route path="/admin" element={<AdminPanel></AdminPanel>}></Route>
      <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
    </Routes>
  );
}
