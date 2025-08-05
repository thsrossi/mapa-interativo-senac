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
import MezaninoSuperior from './assets/MezaninoSuperior.jpg'
import PrimeiroAndar from './assets/primeiroandar.jpg'
import SegundoAndar from './assets/segundoAndar.jpg'
import TerceiroAndar from './assets/terceiroAndar.jpg'
import QuartoAndar from './assets/quartoAndar.jpg'
import { markersTerreo } from "./dal/Terreo"
import { markersMezanino } from "./dal/Mezanino"
import { StaticImageData } from "next/image"
import { markersMezaninoSuperior } from "./dal/MezaninoSuperior"
import { markersL1 } from "./dal/primeiroAndar"
import { markersL2 } from "./dal/segundoAndar"
import { markersL3 } from "./dal/terceiroAndar"
import { markersL4 } from "./dal/quartoAndar"


// Dados de exemplo dos marcadores







export default function InteractiveMap() {
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const transformComponentRef = useRef<ReactZoomPanPinchContentRef>({} as ReactZoomPanPinchContentRef)
  const [andarSelecionado, setAndarSelecionado] = useState("terreo")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [categoriasUnicas, setCategoriasUnicas] = useState<Category[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const markersPorAndar: Record<string, MapMarker[]> = {
    terreo: markersTerreo,
    mezanino: markersMezanino,
    mezaninoSuperior: markersMezaninoSuperior,
    primeiroAndar: markersL1,
    segundoAndar: markersL2,
    terceiroAndar: markersL3,
    quartoAndar: markersL4 
  }

  const imagensPorAndar: Record<string, StaticImageData> = {
    terreo: Mapa,
    mezanino: L1,
    mezaninoSuperior: MezaninoSuperior,
    primeiroAndar: PrimeiroAndar,
    segundoAndar: SegundoAndar,
    terceiroAndar: TerceiroAndar,
    quartoAndar: QuartoAndar
  }

  const imagemMapa = imagensPorAndar[andarSelecionado]

  useEffect(() => {
    setImageLoaded(false)

    const novosMarkers = markersPorAndar[andarSelecionado] || []
    setMarkers(novosMarkers)

    const categorias = Array.from(
      new Map(
        novosMarkers.map((m) => [`${m.category}-${m.color}`, { name: m.category, color: m.color }])
      ).values()
    )

    setCategoriasUnicas(categorias)

    setTimeout(() => {
      transformComponentRef.current?.resetTransform()
    }, 0)
  }, [andarSelecionado])

  useEffect(() => {
    setIsMobile(typeof window !== "undefined" && window.outerWidth < 768)
  }, [])

  const handleMapTouchMove = (e: TouchEvent | MouseEvent) => {
    if (sidebarOpen) {
      e.preventDefault()
    }
  }

  const centerOnMarker = (marker: MapMarker) => {
    if (!transformComponentRef.current) return

    setSelectedMarker(marker.id)

    const { zoomToElement  } = transformComponentRef.current

    const markerElement = document.getElementById(`marker-${marker.id}`)
    if (markerElement && zoomToElement) {
      zoomToElement(markerElement, isMobile ? 1.2 : 1.5, 300)
    }
  }

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
            onPanningStart={(e)=>{isMobile && setSelectedMarker(null)}}

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
                  <div
                    key={marker.id}
                    id={`marker-${marker.id}`}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${selectedMarker === marker.id || hoveredMarker === marker.id ? "scale-125 z-20" : "z-10"}`}
                    style={{
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                    }}
                    onClick={() => {
                      if (isMobile) {
                        setSelectedMarker(prev => prev === marker.id ? null : marker.id)
                      }
                        centerOnMarker(marker)
                      
                    }}
                    onMouseEnter={() => {!isMobile && (setHoveredMarker(marker.id)); !isMobile && setSelectedMarker(null)}}
                    onMouseLeave={() => {!isMobile && setHoveredMarker(null); setSelectedMarker(null)}}
                  >
                    <div className="relative">
                      <div className="flex flex-col items-center z-10">
                        <div
                          className={`w-6 h-6 rounded-full ${marker.color} border-2 border-white shadow-lg flex items-center justify-center`}
                        >
                          {marker.category === 'Restrito' ? (
                            <LockKeyhole className="w-3 h-3 text-white" />
                          ) : marker.category === "Competição" ? (
                            <Trophy className="w-3 h-3 text-white" />
                          ) : (
                            <MapPin className="w-3 h-3 text-white" />
                          )}
                        </div>
                        {marker?.name && (
                          <Badge className="max-w-65 justify-start">{marker?.name}</Badge>
                        )}
                      </div>

                      {(hoveredMarker === marker.id || selectedMarker === marker.id) && (
                        <div className={`absolute ${marker.name && 'top-12'} max-w-48 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 w-60 z-50`}>
                          <h4 className="font-semibold text-sm text-gray-900">{marker.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{marker.description}</p>
                          <Badge variant="outline" className="text-xs mt-2">
                            {marker.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
    </TooltipProvider>
  )
}