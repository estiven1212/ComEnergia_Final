import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline, IoKeyOutline } from "react-icons/io5";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await loginUser({ email, password });
      navigate("/profile");
    } catch (error) {
      setErr(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-[#013220] relative overflow-hidden py-20">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-[#07a68a]/20 blur-3xl rounded-full top-1/3 left-1/3 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-[#09ffb4]/10 blur-2xl rounded-full bottom-10 right-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-[#07a68a]/40 shadow-lg p-8 rounded-2xl w-96">
        <h3 className="text-3xl font-bold mb-6 text-center text-[#07a68a] drop-shadow-lg">Iniciar sesión</h3>

        <form onSubmit={handle} className="space-y-4">
          <div className="relative flex items-center">
            <MdEmail className="absolute left-3 text-[#07a68a]" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-10 border border-[#07a68a]/40 bg-transparent text-white placeholder-gray-400 rounded px-3 py-2 focus:ring-2 focus:ring-[#07a68a] outline-none"
            />
          </div>

          <div className="relative flex items-center">
            <IoKeyOutline className="absolute left-3 text-[#07a68a]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 border border-[#07a68a]/40 bg-transparent text-white placeholder-gray-400 rounded px-3 py-2 focus:ring-2 focus:ring-[#07a68a] outline-none"
            />
            <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-300 cursor-pointer">
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </div>
          </div>

          {err && <div className="text-red-400 text-sm">{err}</div>}

          <button className="w-full py-2 bg-[#07a68a] hover:brightness-110 text-white rounded shadow-md transition-all">
            Ingresar
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button className="w-full py-2 border border-[#07a68a]/40 flex items-center justify-center gap-2 rounded text-white hover:bg-[#07a68a]/20 transition-all">
            <FcGoogle className="text-xl" /> Iniciar con Google
          </button>
          <button className="w-full py-2 border border-[#07a68a]/40 flex items-center justify-center gap-2 rounded text-white hover:bg-[#07a68a]/20 transition-all">
            <FaMicrosoft className="text-blue-400 text-xl" /> Iniciar con Microsoft
          </button>
        </div>
      </div>
    </main>
  );
}
