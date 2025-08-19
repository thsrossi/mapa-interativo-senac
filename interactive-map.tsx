"use client"

import { useState, useRef, useEffect } from "react"
import { TransformWrapper, TransformComponent, ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch"
import { LockKeyhole, MapPin, Trophy } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Topbar from "./components/Topbar/Topbar"
import { MapMarker, Category } from "@/types"
import { markersTerreo } from "./dal/Terreo"
import { markersMezanino } from "./dal/Mezanino"
import { markersMezaninoSuperior } from "./dal/MezaninoSuperior"
import { markersL1 } from "./dal/primeiroAndar"
import { markersL2 } from "./dal/segundoAndar"
import { markersL3 } from "./dal/terceiroAndar"
import { markersL4 } from "./dal/quartoAndar"
import Image from "next/image"
import MarkerDrawer from "./components/MarkerDrawer/MarkerDrawer"

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
  const [markerAberto, setMarkerAberto] = useState<MapMarker | null>(null)

  const markersPorAndar: Record<string, MapMarker[]> = {
    terreo: markersTerreo,
    mezanino: markersMezanino,
    mezaninoSuperior: markersMezaninoSuperior,
    primeiroAndar: markersL1,
    segundoAndar: markersL2,
    terceiroAndar: markersL3,
    quartoAndar: markersL4,
  }

  const imagensPorAndar: Record<string, string> = {
    terreo: "https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/PisoTerreoteste.webp",
    mezanino: "https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/Mezanino.webp",
    mezaninoSuperior: "https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/MezaninoSuperior.webp",
    primeiroAndar: "https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/primeiroandar.webp",
    segundoAndar: "https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/segundoAndar.webp",
    terceiroAndar: "https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/terceiroAndar.webp",
    quartoAndar: "https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/quartoAndar.webp",
  }
  const imagemMapa = imagensPorAndar[andarSelecionado]

  useEffect(() => {
    setImageLoaded(false)

    const novosMarkers = markersPorAndar[andarSelecionado] || []
    setMarkers(novosMarkers)

    const categorias = Array.from(
      new Map(novosMarkers.map((m) => [`${m.category}-${m.color}`, { name: m.category, color: m.color }])).values()
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

    const { zoomToElement } = transformComponentRef.current

    const fakeElement = document.getElementById(`marker-offset-${marker.id}`)
    if (fakeElement && zoomToElement) {
      zoomToElement(fakeElement, isMobile ? 1 : 1.2, 200, "easeOut")
    }
  }

  const tooltipRef = useRef<HTMLDivElement | null>(null)

  // Fecha tooltip ao clicar fora dela e fora do marcador
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!selectedMarker) return

      const tooltipEl = tooltipRef.current
      const markerEl = document.getElementById(`marker-${selectedMarker}`)

      if (
        tooltipEl &&
        !tooltipEl.contains(event.target as Node) &&
        markerEl &&
        !markerEl.contains(event.target as Node)
      ) {
        setSelectedMarker(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedMarker])

  // Fecha tooltip ao abrir drawer
  useEffect(() => {
    if (markerAberto) {
      setSelectedMarker(null)
    }
  }, [markerAberto])

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
          isMobile={isMobile}
        />

        <div className="flex-1 relative max-w-screen z-20 mt-5" style={{ overflow: "auto" }}>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
              <p>Carregando planta...</p>
            </div>
          )}

          <TransformWrapper
            ref={transformComponentRef}
            initialScale={isMobile ? 0.7 : 1}
            minScale={0.5}
            maxScale={4}
            centerOnInit={false}
            wheel={{ step: 0.1 }}
            pinch={{ step: 0.1 }}
            panning={{ disabled: isMobile && sidebarOpen }}
            doubleClick={{ mode: "zoomIn", step: 0.3 }}
            onPanning={(_, e) => handleMapTouchMove(e)}
          >
            <TransformComponent wrapperClass="max-w-screen max-h-screen" contentClass="w-full h-screen flex items-center justify-center" >
              <div className="relative inline-block z-20 py-16 m-40"
              >
                <img
                  src={imagemMapa}
                  alt="Planta Baixa"
                  className="max-w-none w-[1200px] h-[800px] object-contain"
                  draggable={false}
                  onClick={(e) => {
                    e.stopPropagation()

                  }}
                  onLoad={() => setImageLoaded(true)}
                />

                {imageLoaded && markers.filter(m => m.visible).map((marker) => (
                  <div
                    key={marker.id}
                    id={`marker-${marker.id}`}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${selectedMarker === marker.id || hoveredMarker === marker.id ? "scale-125 z-30" : "z-20"}`}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    onClick={() => {
                      if (isMobile) {
                        setSelectedMarker(prev => prev === marker.id ? null : marker.id)
                      }
                      centerOnMarker(marker)
                    }}
                    // MOVA o mouse enter/leave pro container maior:
                    onMouseEnter={() => { if (!isMobile) setHoveredMarker(marker.id) }}
                    onMouseLeave={() => { if (!isMobile) { setHoveredMarker(null); setSelectedMarker(null) } }}
                  ><div
                      id={`marker-offset-${marker.id}`}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '250px', // altura acima do marcador real, ajuste conforme necessário
                        width: '1px',
                        height: '1px',
                      }}
                    />
                    <div className="relative flex flex-col items-center z-10">
                      <div className={`w-6 h-6 rounded-full ${marker.color} border-2 border-white shadow-lg flex items-center justify-center`}>
                        {marker.category === 'Restrito' ? (
                          <LockKeyhole className="w-3 h-3 text-white" />
                        ) : marker.category === "Competição" ? (
                          <Trophy className="w-3 h-3 text-white" />
                        ) : (
                          <MapPin className="w-3 h-3 text-white" />
                        )}
                      </div>
                      {marker?.name && <Badge className="max-w-65 justify-start">{marker?.name}</Badge>}

                      {(hoveredMarker === marker.id || selectedMarker === marker.id) && (
                        <div
                          ref={tooltipRef}
                          className={`absolute ${marker.name ? 'top-6' : 'top-6'} max-w-48 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-2xl px-3 py-2 w-60 z-[999] pointer-events-auto`}
                        // REMOVE onMouseEnter e onMouseLeave do tooltip
                        >
                          {marker.image && (
                            <Image
                              src={`https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/markersImages/${marker.image}`}
                              alt={`Preview de ${marker.name}`}
                              className="w-full h-24 object-cover rounded-md mb-2"
                              loading="lazy"
                              width={166}
                              height={96}
                            />
                          )}

                          <h4 className="font-semibold text-sm text-gray-900">{marker.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{marker.description}</p>
                          <Badge variant="outline" className="text-xs mt-2">{marker.category}</Badge>

                          {marker?.video &&
                            <div className="mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setMarkerAberto(marker)
                                }}
                                className="mt-2 text-blue-600 text-sm hover:underline"
                              >
                                Ver mais
                              </button>
                            </div>}
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
      <MarkerDrawer
        marker={markerAberto || {} as MapMarker} // Ou um objeto vazio, ou pode fazer MarkerDrawer tratar marker optional
        open={!!markerAberto}
        onOpenChange={(open) => !open && setMarkerAberto(null)}
      />
    </TooltipProvider>
  )
}
