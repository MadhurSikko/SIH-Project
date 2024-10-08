import React, { useState } from "react";
import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LeftSideBar from "./components/LeftSideBar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Payment from "./components/Payment";
import Thanks from "./components/Thanks";
import Scan from "./components/Scan";
import Output from "./components/Output";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <BrowserRouter>
      {/* Header with toggleSidebar passed as prop */}
      <Header toggleSidebar={toggleSidebar} />
      {/* Sidebar component with isOpen and closeSidebar passed as props */}
      <LeftSideBar isOpen={isOpen} closeSidebar={closeSidebar} />
      <Routes>
        
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/thank-you" element={<Thanks />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/output" element={<Output />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
