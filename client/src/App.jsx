// App.jsx

import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AppShell, Button } from '@mantine/core';
import '@mantine/core/styles.css';
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import axios from 'axios';


export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")
    // console.log("token:", token);

    if (token) {
      axios.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setUser(response.data)
      }).catch((err) => {
        console.log("Failed to fetch user:", err.response?.data || err.message);
      })
    }
  }, [])

  const onLogin = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
    navigate("/dashboard")
  };
  
  if (!user) return <Login onLogin={onLogin} />;


  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Login onLogin={onLogin} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AppShell>
  )
}

