"use client"

import { useState, useRef, useEffect } from "react"
import { TransformWrapper, TransformComponent, ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch"
import { MapPin } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Topbar from "./components/Topbar/Topbar"
import { MapMarker, Category, TransformComponentRef } from "@/types"
import Mapa from './assets/PisoTerreo.jpg'
import L1 from './assets/PisoSuperior.jpg'


// Dados de exemplo dos marcadores
const markersTerreo: MapMarker[] = [
  {
    id: "1",
    name: "Entrada Principal",
    description: "Acesso principal do edifício com recepção",
    x: 15,
    y: 80,
    category: "Acesso",
    color: "bg-blue-500",
    visible: true,
  },
  {
    id: "2",
    name: "Confeitaria",
    description: "Um espaço equipado com bancadas, fornos e utensílios básicos para aulas práticas de culinária",
    x: 14.17,
    y: 26.38,
    category: "Aulas Culinária",
    color: "bg-green-500",
    visible: true,
  },
  {
    id: "3",
    name: "Área de Trabalho",
    description: "Espaço colaborativo com 20 estações",
    x: 65,
    y: 40,
    category: "Trabalho",
    color: "bg-purple-500",
    visible: true,
  },
  {
    id: "4",
    name: "Copa/Cozinha",
    description: "Área de descanso e alimentação",
    x: 80,
    y: 70,
    category: "Descanso",
    color: "bg-orange-500",
    visible: true,
  },
  {
    id: "5",
    name: "Banheiros",
    description: "Sanitários masculino e feminino",
    x: 25,
    y: 60,
    category: "Sanitário",
    color: "bg-gray-500",
    visible: true,
  },
  {
    id: "6",
    name: "Sala do Servidor",
    description: "Equipamentos de TI e telecomunicações",
    x: 85,
    y: 15,
    category: "Técnica",
    color: "bg-red-500",
    visible: true,
  },
]

const markersSuperior: MapMarker[] = [
  {
    id: "1",
    name: "Biblioteca",
    description: "Espaço silencioso com acervo de livros e mesas para estudo individual",
    x: 20,
    y: 25,
    category: "Estudo",
    color: "bg-indigo-500",
    visible: true,
  },
  {
    id: "2",
    name: "Sala de Música",
    description: "Ambiente acústico com instrumentos disponíveis para prática musical",
    x: 85,
    y: 30,
    category: "Artes",
    color: "bg-pink-500",
    visible: true,
  },
  {
    id: "3",
    name: "Laboratório de Ciências",
    description: "Laboratório equipado para aulas práticas de química e biologia",
    x: 75,
    y: 60,
    category: "Laboratório",
    color: "bg-teal-500",
    visible: true,
  },
  {
    id: "4",
    name: "Banheiros",
    description: "Sanitários masculino e feminino do segundo andar",
    x: 30,
    y: 40,
    category: "Sanitário",
    color: "bg-gray-500",
    visible: true,
  },
  {
    id: "5",
    name: "Refeitório",
    description: "Espaço para refeições com mesas comunitárias",
    x: 80,
    y: 75,
    category: "Alimentação",
    color: "bg-orange-500",
    visible: true,
  },
  {
    id: "6",
    name: "Espaço Zen",
    description: "Ambiente para relaxamento e meditação",
    x: 60,
    y: 50,
    category: "Bem-estar",
    color: "bg-lime-500",
    visible: true,
  },
]


// Categorias para filtros
const categories = [
  { name: "Acesso", color: "bg-blue-500" },
  { name: "Aulas Culinária", color: "bg-green-500" },
  { name: "Trabalho", color: "bg-purple-500" },
  { name: "Descanso", color: "bg-orange-500" },
  { name: "Sanitário", color: "bg-gray-500" },
  { name: "Técnica", color: "bg-red-500" },
]


export default function InteractiveMap() {
  const [markers, setMarkers] = useState<MapMarker[]>(markersTerreo)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const transformComponentRef = useRef<ReactZoomPanPinchContentRef>({} as ReactZoomPanPinchContentRef)
  const [andarSelecionado, setAndarSelecionado] = useState("terreo")

  const imagemMapa = andarSelecionado === "superior" ? L1 : Mapa



  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMapTouchMove = (e: TouchEvent | MouseEvent) => {
    if (sidebarOpen) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (andarSelecionado === "terreo") {
      setMarkers(markersTerreo)
    } else {
      setMarkers(markersSuperior)
    }
  }, [andarSelecionado])

  useEffect(() => {
    setIsMobile(typeof window !== "undefined" && window.outerWidth < 768)
  }, [])

  if (isMobile === null) return null

  return (
    <TooltipProvider>
      <div className="flex h-screen max-w-screen bg-gray-50">
        <Topbar
          markers={markers}
          categories={categories}
          transformComponentRef={transformComponentRef}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          hoveredMarker={hoveredMarker}
          setHoveredMarker={setHoveredMarker}
          setMarkers={setMarkers}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          andarSelecionado={andarSelecionado}
          setAndarSelecionado={setAndarSelecionado}
        />

        <div className="flex-1 relative max-w-screen z-20" style={{ overflow: "hidden" }}>
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
                />

                {markers.filter(m => m.visible).map((marker) => (
                  <Tooltip key={marker.id}>
                    <TooltipTrigger asChild>
                      <div
                        id={`marker-${marker.id}`}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${selectedMarker === marker.id ? "scale-125 z-20" : "z-10"
                          }`}
                        style={{
                          left: `${marker.x}%`,
                          top: `${marker.y}%`,
                        }}
                        onClick={() => setSelectedMarker(marker.id)}
                        onMouseEnter={() => setHoveredMarker(marker.id)}
                        onMouseLeave={() => setHoveredMarker(null)}
                      >
                        <div className={`relative`}>
                          <div className="flex flex-col items-center">

                            <div
                              className={`w-6 h-6 rounded-full ${marker.color} border-2 border-white shadow-lg flex items-center justify-center`}
                            >
                              <MapPin className="w-3 h-3 text-white" />
                            </div>
                            <Badge > {marker.name} </Badge>
                          </div>

                          {(selectedMarker === marker.id || hoveredMarker === marker.id) && (
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-48 z-30 border">
                              <h4 className="font-medium text-gray-900 text-sm">{marker.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{marker.description}</p>
                              <Badge variant="outline" className="text-xs mt-2">
                                {marker.category}
                              </Badge>
                            </div>
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