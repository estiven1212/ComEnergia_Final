import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Casos() {
  const [modal, setModal] = useState(null);

  const casos = [
    {
      name: "Comunidad Solar La Guajira",
      region: "Alta Guajira, Colombia",
      desc: "Electrificación solar para comunidades wayuu sin acceso al servicio eléctrico.",
      details:
        "Este proyecto apoya a viviendas y servicios esenciales como agua potable y refrigeración para alimentos y medicina. Se enfoca en mejorar la calidad de vida mediante acceso a energía confiable.",
      img: "/guajira.jpg",
      empresa: "UPME • MinMinas",
      link: "https://www1.upme.gov.co/",
      fuente:
        "Ministerio de Minas y Energía y UPME – Programas de energización rural",
    },
    {
      name: "Solar Andes",
      region: "Antioquia, Colombia",
      desc: "Sistema solar comunitario que abastece infraestructura educativa y comunitaria.",
      details:
        "Este piloto involucra a las familias rurales en el aprendizaje y manejo de soluciones solares comunitarias, mejorando el acceso a servicios básicos y fomentando autonomía energética.",
      img: "/andes.png",
      empresa: "CREG – Alianzas comunitarias",
      link: "https://www.creg.gov.co/",
      fuente:
        "Comisión de Regulación de Energía y Gas – Programas de autoabastecimiento",
    },
    {
      name: "EcoAndina",
      region: "Boyacá, Colombia",
      desc: "Capacitación técnica en energías renovables para comunidades rurales.",
      details:
        "Se forman instaladores locales para garantizar sostenibilidad del mantenimiento y generar empleo verde en territorios agrícolas.",
      img: "/ecoandina.png",
      empresa: "SENA • EcoFormar",
      link: "https://www.sena.edu.co/",
      fuente:
        "SENA – Programas de formación en energías renovables",
    },
    {
      name: "EnerMov Medellín",
      region: "Medellín, Colombia",
      desc: "Movilidad eléctrica comunitaria con estaciones de carga.",
      details:
        "Promueve transporte sostenible mediante acceso a vehículos eléctricos compartidos administrados por la comunidad.",
      img: "/enermov.png",
      empresa: "EPM – MinTransporte",
      link: "https://www.mintransporte.gov.co/",
      fuente:
        "Ministerio de Transporte y EPM – Estrategias de movilidad sostenible",
    },
    {
      name: "Comunidad Energética La Estrecha",
      region: "Patía, Cauca, Colombia",
      desc: "Primera comunidad energética formal reconocida en Colombia.",
      details:
        "Más de 20 familias comparten energía solar y participan en decisiones energéticas locales dentro del programa Energía para la Gente.",
      img: "/Salvador.png",
      empresa: "Enel • MinMinas • E2",
      link: "https://www.minenergia.gov.co/comunidades-energeticas/",
      fuente:
        "MinMinas – Programa Energía para la Gente",
    },
    {
      name: "Comunidad Energética San Bernardo",
      region: "Cundinamarca, Colombia",
      desc: "Modelo urbano piloto con generación distribuida y almacenamiento.",
      details:
        "Busca demostrar la viabilidad de energía comunitaria en ciudades, con gestión de excedentes y reducción de costos eléctricos.",
      img: "/Bernardo.png",
      empresa: "UPME – BID – Alcaldía",
      link: "https://www1.upme.gov.co/Paginas/Comunidades-Energeticas.aspx",
      fuente:
        "UPME y BID – Proyectos urbanos de comunidades energéticas",
    },
  ];

  return (
    <section id="casos" className="py-20 bg-[#f7faf9]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Casos y proyectos reales en Colombia
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Proyectos que impulsan autonomía energética, sostenibilidad y desarrollo local.
        </p>

        {/* Tarjetas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {casos.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => setModal(c)}
            >
              <img
                src={c.img}
                alt={c.name}
                className="h-48 w-full object-cover"
                onError={(e) => (e.target.src = "/paneles.png")}
              />
              <div className="p-5">
                <h3 className="font-semibold text-[#07a68a] text-lg">{c.name}</h3>
                <div className="text-sm text-gray-500">{c.region}</div>
                <p className="text-gray-600 text-sm mt-2">{c.desc}</p>
                <div className="mt-3 text-xs text-gray-500">
                  Entidades: {c.empresa}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-lg relative"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
              >
                <button
                  onClick={() => setModal(null)}
                  className="absolute top-3 right-4 text-gray-500 text-lg"
                >
                  ✕
                </button>

                <img
                  src={modal.img}
                  alt={modal.name}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                  onError={(e) => (e.target.src = "/paneles.png")}
                />

                <h3 className="text-2xl font-bold text-[#07a68a]">{modal.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{modal.region}</p>

                <p className="text-gray-700 mb-6 leading-relaxed">{modal.details}</p>

                <p className="text-sm text-gray-700 mb-4">
                  <strong>Entidad responsable:</strong> {modal.empresa}
                </p>

                <a
                  href={modal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#07a68a] text-white rounded-xl hover:brightness-110 transition"
                >
                  Ver fuente oficial
                </a>

                <p className="text-[11px] text-gray-400 mt-3">
                  Fuente: {modal.fuente}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
