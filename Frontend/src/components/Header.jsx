import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrent, logoutUser } from "../utils/auth";

export default function Header() {
  const [user, setUser] = useState(getCurrent());
  const navigate = useNavigate();
  const location = useLocation();

  // Escucha cambios en localStorage y rutas
  useEffect(() => {
    const handleStorage = () => setUser(getCurrent());
    window.addEventListener("storage", handleStorage);
    handleStorage();
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Valida usuario
  useEffect(() => {
    setUser(getCurrent());
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/");
  };

  // ✅ NUEVA FUNCIÓN: Navega a inicio y hace scroll a la sección
  const handleNavClick = (sectionId) => {
    // Si no estamos en la página principal, navegar primero
    if (location.pathname !== "/") {
      navigate("/");
      // Esperar a que cargue y hacer scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // Si ya estamos en inicio, solo hacer scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* === LOGO === */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="ComEnergia" className="w-10 h-10" />
          <div>
            <div className="font-bold text-lg text-[#07a68a]">ComEnergia</div>
            <div className="text-xs text-gray-500">
              Comunidades energéticas conectadas
            </div>
          </div>
        </Link>

        {/* === NAVEGACIÓN === */}
        <nav className="hidden lg:flex gap-6 items-center text-sm text-gray-700">
          <button 
            onClick={() => handleNavClick("inicio")} 
            className="hover:text-[#07a68a] cursor-pointer transition"
          >
            Inicio
          </button>
          <button 
            onClick={() => handleNavClick("que-es")} 
            className="hover:text-[#07a68a] cursor-pointer transition"
          >
            ¿Qué es?
          </button>
          <button 
            onClick={() => handleNavClick("beneficios")} 
            className="hover:text-[#07a68a] cursor-pointer transition"
          >
            Beneficios
          </button>
          <button 
            onClick={() => handleNavClick("servicios")} 
            className="hover:text-[#07a68a] cursor-pointer transition"
          >
            Servicios
          </button>
          <button 
            onClick={() => handleNavClick("casos")} 
            className="hover:text-[#07a68a] cursor-pointer transition"
          >
            Casos
          </button>
          <button 
            onClick={() => handleNavClick("normativa")} 
            className="hover:text-[#07a68a] cursor-pointer transition"
          >
            Normativa
          </button>
        </nav>

        {/* === SESIÓN === */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#07a68a]/10 rounded-full hover:bg-[#07a68a]/20 transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#07a68a] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-[#07a68a]">
                  {user?.name ? user.name.split(" ")[0] : "Usuario"}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm hover:text-[#07a68a] transition"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 bg-[#07a68a] text-white rounded-full text-sm shadow-sm hover:brightness-110 transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}