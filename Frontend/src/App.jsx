import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import QueEs from "./components/QueEs";
import Beneficios from "./components/Beneficios"; // 🔹 Nuevo componente
import Servicios from "./components/Servicios";
import Casos from "./components/Casos";
import Normativa from "./components/Normativa";
import FAQ from "./components/FAQ";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <QueEs />
              <Beneficios />

              {/* 🔹 Nueva sección de servicios que ofrece cada empresa */}

              {/* Sección de servicios de intercambio */}
              <Servicios />

              <Casos />
              <Normativa />
              <FAQ />
            </>
          }
        />

        {/* Autenticación y perfil (Local Storage) */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>

      <Footer />
    </Router>
  );
}
