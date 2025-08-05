"use client"

import { useState, useRef, useEffect } from "react"
import { TransformWrapper, TransformComponent, ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch"
import { LockKeyhole, MapPin, Trophy } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Topbar from "./components/Topbar/Topbar"
import { MapMarker, Category, TransformComponentRef } from "@/types"
import Mapa from './assets/PisoTerreo.jpg'
import L1 from './assets/Mezanino.jpg'


// Dados de exemplo dos marcadores
const markersTerreo = [
  {
    id: "1",
    name: "Entrada Principal",
    description: "Acesso principal do edifício",
    x: 5,
    y: 35,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "2",
    name: "Confeitaria",
    description: "Um espaço equipado com bancadas, fornos e utensílios para aulas práticas de gastronomia",
    x: 14.17,
    y: 26.38,
    category: "Aulas Gastronomia",
    color: "bg-green-500",
    visible: true,
  },
  {
    id: "3",
    name: "Capela",
    description: "?",
    x: 25.75,
    y: 23.75,
    category: "Capela",
    color: "bg-purple-500",
    visible: true,
  },
  {
    id: "4",
    name: "Vestiários",
    description: "Vestiários mascunilno e feminino",
    x: 33,
    y: 25,
    category: "Vestiário",
    color: "bg-orange-500",
    visible: true,
  },
  {
    id: "5",
    name: "Banheiros",
    description: "Sanitários masculinos e femininos",
    x: 51,
    y: 59,
    category: "Sanitário",
    color: "bg-gray-500",
    visible: true,
  },
  {
    id: "6",
    name: "Banheiro Feminino",
    description: "Sanitário Feminino",
    x: 39,
    y: 29,
    category: "Sanitário",
    color: "bg-gray-500",
    visible: true,
  },
  {
    id: "7",
    name: "",
    description: "A partir deste ponto: acesso restrito, somente funcionários.",
    x: 42,
    y: 33,
    category: "Restrito",
    color: "bg-red-500",
    visible: true,
  },
  {
    id: "8",
    name: "Recepção/Portaria",
    description: "Recepção",
    x: 15,
    y: 37,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "9",
    name: "Escada Auditório",
    description: "Escadaria que dá acesso ao auditório",
    x: 21.67,
    y: 44,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "10",
    name: "Elevador",
    description: "?",
    x: 49.17,
    y: 42.25,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "11",
    name: "Café do Paço",
    description: "?",
    x: 70.49,
    y: 46.25,
    category: "Alimentação",
    color: "bg-yellow-500",
    visible: true,
  },
  {
    id: "12",
    name: "Escada Mezanino",
    description: "Escada que dá acesso ao mezanino",
    x: 6.58,
    y: 49.75,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "13",
    name: "Central de Matrículas",
    description: "?",
    x: 14.33,
    y: 56.5,
    category: "Secretaria",
    color: "bg-orange-900",
    visible: true,
  },
  {
    id: "14",
    name: "Biblioteca",
    description: "?",
    x: 30.58,
    y: 63,
    category: "Biblioteca",
    color: "bg-indigo-500",
    visible: true,
  },
  {
    id: "15",
    name: "Secretaria Escolar",
    description: "Acesso restrito, somente atendimentos telefonicos",
    x: 15.92,
    y: 66.5,
    category: "Restrito",
    color: "bg-red-500",
    visible: true,
  },
  {
    id: "16",
    name: "Escada",
    description: "Escada que dá acesso à coordenação gastronomia e café bar",
    x: 21.75,
    y: 63.63,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "17",
    name: "",
    description: "A partir deste ponto: acesso restrito, somente funcionários.",
    x: 56.6,
    y: 64.5,
    category: "Restrito",
    color: "bg-red-500",
    visible: true,
  },
  {
    id: "18",
    name: "Escada Rouparia",
    description: "Escada que dá acesso à rouparia",
    x: 60,
    y: 69,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "19",
    name: "",
    description: "A partir deste ponto: acesso restrito, somente funcionários.",
    x: 66.68,
    y: 77.5,
    category: "Restrito",
    color: "bg-red-500",
    visible: true,
  },
  {
    id: "20",
    name: "Laboratórios Informática",
    description: "Um espaço equipado com computadores, destinado à aulas de informática - Salas 1, 2 e 3",
    x: 19.75,
    y: 71.3,
    category: "Aulas Informática",
    color: "bg-green-900",
    visible: true,
  },
  {
    id: "21",
    name: "Sala 4",
    description: "Ambiente Pedagógico convencional, destinado à aulas teóricas gerais",
    x: 30.42,
    y: 71.3,
    category: "Ambiente Pedagógico",
    color: "bg-gray-900",
    visible: true,
  },
  {
    id: "22",
    name: "Sala 5",
    description: "Ambiente Pedagógico convencional, destinado à aulas teóricas gerais",
    x: 40.33,
    y: 71.3,
    category: "Ambiente Pedagógico",
    color: "bg-gray-900",
    visible: true,
  },
  {
    id: "23",
    name: "Laboratório Informática",
    description: "Um espaço equipado com computadores, destinado à aulas de informática - Sala 6",
    x: 50.01,
    y: 77.38,
    category: "Aulas Informática",
    color: "bg-green-900",
    visible: true,
  },
  {
    id: "24",
    name: "Laboratório Informática",
    description: "Um espaço equipado com computadores, destinado à aulas de informática - Salas 7",
    x: 60.35,
    y: 74,
    category: "Aulas Informática",
    color: "bg-green-900",
    visible: true,
  },
  {
    id: "25",
    name: "Mesas Circulação",
    description: "Um espaço com mesas livres, ideais para descanso, alimentação, entre outros",
    x: 37.55,
    y: 66,
    category: "Descanso",
    color: "bg-green-200",
    visible: true,
  },
  {
    id: "26",
    name: "Elevador",
    description: "Elevador de acesso ao primeiro e demais andares",
    x: 38,
    y: 38,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "27",
    name: "Rampa",
    description: "Rampa de acesso ao primeiro e demais andares",
    x: 26.63,
    y: 35,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
]


const markersMezanino: MapMarker[] = [
  {
    id: "1",
    name: "Escada",
    description: "Escadaria que dá acesso ao térreo e mezanino superior",
    x: 35.97,
    y: 27,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "2",
    name: "Vestiários",
    description: "Vestiários masculinos e femininos",
    x: 80.88,
    y: 29.75,
    category: "Vestiário",
    color: "bg-orange-500",
    visible: true,
  },
  {
    id: "3",
    name: "Rouparia",
    description: "",
    x: 86.24,
    y: 33,
    category: "Vestiário",
    color: "bg-orange-500",
    visible: true,
  },
  {
    id: "4",
    name: "Aperfeiçoamento Cabeleireiro",
    description:
      "Espaço destinado à prática e aperfeiçoamento das técnicas de corte, coloração e penteado, onde os alunos desenvolvem habilidades avançadas em ambiente profissional - Sala 9",
    x: 8.05,
    y: 39.88,
    category: "Aulas Beleza",
    color: "bg-pink-400",
    visible: true,
  },
  {
    id: "5",
    name: "Recepção Podologia",
    description:
      "Espaço acolhedor onde os clientes voluntários são recebidos e aguardam atendimento. Aqui, os alunos colocam em prática os conhecimentos adquiridos, sempre sob supervisão profissional, proporcionando cuidados especializados em saúde dos pés.",
    x: 12.05,
    y: 46.5,
    category: "Aulas Saúde",
    color: "bg-violet-500",
    visible: true,
  },
  {
    id: "6",
    name: "Laboratório Podologia",
    description:
      "Ambiente equipado para a prática das técnicas podológicas, onde os alunos realizam atendimentos supervisionados, desenvolvendo habilidades em prevenção, diagnóstico e cuidados com a saúde dos pés.",
    x: 7.05,
    y: 55.5,
    category: "Aulas Saúde",
    color: "bg-violet-500",
    visible: true,
  },
  {
    id: "7",
    name: "Escada ",
    description: "Escadaria que dá acesso ao térreo",
    x: 21.63,
    y: 50.13,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "8",
    name: "Café bar",
    description:
      "Os alunos treinam técnicas de barismo e coquetelaria em um ambiente que simula estabelecimentos reais - Sala 11",
    x: 39.88,
    y: 42.38,
    category: "Alimentação",
    color: "bg-yellow-500",
    visible: true,
  },
  {
    id: "9",
    name: "Banheiros",
    description: "Sanitários masculinos e femininos",
    x: 53.63,
    y: 44.13,
    category: "Sanitário",
    color: "bg-gray-500",
    visible: true,
  },
  {
    id: "10",
    name: "Coordenação Faculdade Gastronomia",
    description: "Responsável pela gestão acadêmica do curso e apoio a alunos e professores.",
    x: 62.97,
    y: 38.5,
    category: "Administrativo Senac",
    color: "bg-orange-900",
    visible: true,
  },
  {
    id: "11",
    name: "Ambiente de Treinamento para Competição – Recepção de Hotel",
    description:
      "Espaço dedicado ao treino prático e simulações de provas, preparando os alunos para competições na área de recepção hoteleira.",
    x: 66.13,
    y: 47.25,
    category: "Competição",
    color: "bg-[#D4AF37]",
    visible: true,
  },
  {
    id: "12",
    name: "Sala 16",
    description: "Ambiente Pedagógico convencional, destinado à aulas teóricas gerais",
    x: 17.22,
    y: 65.88,
    category: "Ambiente Pedagógico",
    color: "bg-gray-900",
    visible: true,
  },
  {
    id: "13",
    name: "Sala 15",
    description: "Ambiente Pedagógico convencional, destinado à aulas teóricas gerais",
    x: 39.63,
    y: 65.88,
    category: "Ambiente Pedagógico",
    color: "bg-gray-900",
    visible: true,
  },
  {
    id: "14",
    name: "Sala de Moda e Design",
    description:
      "Local para criação, prova de roupas e ensaio, e apresentações de moda - Sala 14",
    x: 48.3,
    y: 65.88,
    category: "Aulas Moda",
    color: "bg-purple-400",
    visible: true,
  },
  {
    id: "15",
    name: "Sala de Moda e Design",
    description:
      "Local para criação, prova de roupas e ensaio, e apresentações de moda - Sala 13",
    x: 63.58,
    y: 65.88,
    category: "Aulas Moda",
    color: "bg-purple-400",
    visible: true,
  },
  {
    id: "16",
    name: "Sala de Moda e Design",
    description:
      "Local para criação, prova de roupas e ensaio, e apresentações de moda - Sala 12",
    x: 79.75,
    y: 65.88,
    category: "Aulas Moda",
    color: "bg-purple-400",
    visible: true,
  },
  {
    id: "17",
    name: "Escadaria",
    description: "Escadaria que dá acesso ao térreo",
    x: 92.75,
    y: 63.38,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "18",
    name: "Cozinha Didáica",
    description:
      "Ambiente equipado para o ensino prático de técnicas culinárias, onde os alunos desenvolvem habilidades de preparo, higiene e apresentação de alimentos em condições reais de trabalho.",
    x: 32.83,
    y: 43.13,
    category: "Alimentação",
    color: "bg-yellow-500",
    visible: true,
  },
  {
    id: "19",
    name: "Escadaria",
    description:
      "Escadaria que dá acesso ao térreo e mezanino superior",
    x: 63.63,
    y: 59.13,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
];



export default function InteractiveMap() {
  const [markers, setMarkers] = useState<MapMarker[]>(markersTerreo)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const transformComponentRef = useRef<ReactZoomPanPinchContentRef>({} as ReactZoomPanPinchContentRef)
  const [andarSelecionado, setAndarSelecionado] = useState("terreo")
  const [imageLoaded, setImageLoaded] = useState(false)

  const imagemMapa = andarSelecionado === "mezanino" ? L1 : Mapa

  const [categoriasUnicas, setCategoriasUnicas] = useState<Category[]>({} as Category[])

  // useMemo(() => { return Array.from(new Set(markers.map((m) => { return ({ name: m.category, color: m.color }) }))) }, [andarSelecionado])


  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMapTouchMove = (e: TouchEvent | MouseEvent) => {
    if (sidebarOpen) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (andarSelecionado === "terreo") {
      setMarkers(markersTerreo)
      const arrayAuxiliar = Array.from(
        new Map(
          markersTerreo.map((m) => [`${m.category}-${m.color}`, { name: m.category, color: m.color }])
        ).values()
      )
      setCategoriasUnicas(arrayAuxiliar)
    } else {
      setMarkers(markersMezanino)
      const arrayAuxiliar = Array.from(
        new Map(
          markersMezanino.map((m) => [`${m.category}-${m.color}`, { name: m.category, color: m.color }])
        ).values()
      )
      setCategoriasUnicas(arrayAuxiliar)

    }

    // Resetar o zoom e pan
    setTimeout(() => {
      transformComponentRef.current?.resetTransform()
    }, 0)
  }, [andarSelecionado])

  useEffect(() => {
    setIsMobile(typeof window !== "undefined" && window.outerWidth < 768)
  }, [])

  const centerOnMarker = (marker: MapMarker) => {
    if (!transformComponentRef.current) return;

    setSelectedMarker(marker.id);

    const { zoomToElement } = transformComponentRef.current;

    const markerElement = document.getElementById(`marker-${marker.id}`);
    if (markerElement && zoomToElement) {
      zoomToElement(markerElement, 1.5, 300); // Zoom 1.5x e animação de 300ms
    }
  };

  if (isMobile === null) return null

  return (
    <TooltipProvider>
      <div className="flex h-screen max-w-screen bg-gray-50">
        <Topbar
          markers={markers}
          transformComponentRef={transformComponentRef}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          categoriasUnicas={categoriasUnicas}
          hoveredMarker={hoveredMarker}
          setHoveredMarker={setHoveredMarker}
          setMarkers={setMarkers}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          andarSelecionado={andarSelecionado}
          setAndarSelecionado={setAndarSelecionado}
        />

        <div className="flex-1 relative max-w-screen z-20 mt-5" style={{ overflow: "auto" }}>

          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
              <p>Carregando planta...</p>
            </div>
          )}

          {/* <img
            src={imagemMapa.src}
            alt="Planta Baixa"
            className="max-w-none w-[1200px] h-[800px] object-contain"
            draggable={false}
            onClick={(e) => {
              e.stopPropagation()
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              console.log(`x: ${x.toFixed(2)}%, y: ${y.toFixed(2)}%`);
            }}
          /> */}
        <TransformWrapper
            ref={transformComponentRef}
            initialScale={isMobile ? 0.7 : 1}
            minScale={0.5}
            maxScale={4}
            centerOnInit={false}


            wheel={{ step: 0.1 }}
            pinch={{ step: .1 }}
            panning={{
              disabled: (isMobile && sidebarOpen), // Desabilita panning quando sidebar está aberta

            }}
            doubleClick={{ mode: "zoomIn", step: 0.3 }}
            // onTouchMove={handleMapTouchMove}

            onPanning={(_, e) => handleMapTouchMove(e)}
          >
            <TransformComponent

              wrapperClass="max-w-screen max-h-screen"
              contentClass="w-full h-screen flex items-center justify-center"
            >
              <div className="relative inline-block z-20 py-16">
                <img
                  src={imagemMapa.src}
                  alt="Planta Baixa"
                  className="max-w-none w-[1200px] h-[800px] object-contain"
                  draggable={false}
                  onClick={(e) => {
                    e.stopPropagation()
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = ((e.clientX - rect.left) / rect.width) * 100
                    const y = ((e.clientY - rect.top) / rect.height) * 100
                    console.log(`x: ${x.toFixed(2)}%, y: ${y.toFixed(2)}%`)
                  }}
                  onLoad={() => setImageLoaded(true)}

                />

                {imageLoaded && markers.filter(m => m.visible).map((marker) => (
                  <Tooltip key={marker.id}>
                    <TooltipTrigger asChild >
                      <div
                        id={`marker-${marker.id}`}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${selectedMarker === marker.id ? "scale-125 z-20" : "z-10"
                          }`}
                        style={{
                          left: `${marker.x}%`,
                          top: `${marker.y}%`,
                        }}
                        onClick={() => { setSelectedMarker(marker.id); centerOnMarker(marker) }}
                        onMouseEnter={() => setHoveredMarker(marker.id)}
                        onMouseLeave={() => { setHoveredMarker(null); setSelectedMarker(null) }}

                      >
                        <div className={`relative`}>
                          <div className="flex flex-col items-center z-10">

                            <div
                              className={`w-6 h-6 rounded-full ${marker.color} border-2 border-white shadow-lg flex items-center justify-center`}
                            >
                              {marker.category === 'Restrito' ? <LockKeyhole className="w-3 h-3 text-white" /> : marker.category === "Competição" ? <Trophy className="w-3 h-3 text-white" />: <MapPin className="w-3 h-3 text-white" />}
                            </div>
                            {marker?.name && <Badge className="max-w-65 justify-start" > {marker?.name} </Badge>}
                          </div>

                          {(selectedMarker === marker.id || hoveredMarker === marker.id) && (
                            <TooltipContent>

                              {/* <div className={` ${marker.name && 'top-12'} left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-48 z-50 border`}> */}
                              <h4 className="font-medium text-gray-900 text-sm">{marker.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{marker.description}</p>
                              <Badge variant="outline" className="text-xs mt-2">
                                {marker.category}
                              </Badge>
                              {/* </div> */}
                            </TooltipContent>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                ))}
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
    </TooltipProvider>
  )
}