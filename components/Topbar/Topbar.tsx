"use client"

import { useRef, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { Badge } from "../ui/badge"
import { Switch } from "../ui/switch"
import { MapMarker, Category, TransformComponentRef } from "@/types"

interface TopBarProps {
    markers: MapMarker[]
    categories: Category[]
    transformComponentRef: React.RefObject<TransformComponentRef>
    selectedMarker: string | null
    setSelectedMarker: (id: string | null) => void
    hoveredMarker: string | null
    setHoveredMarker: (id: string | null) => void
    setMarkers: (markers: MapMarker[]) => void
    sidebarOpen: boolean // Adicione
    setSidebarOpen: (open: boolean) => void // Adicione
}

export default function Topbar({
    markers,
    categories,
    transformComponentRef,
    selectedMarker,
    setSelectedMarker,
    setMarkers,
    setSidebarOpen,
    sidebarOpen
}: TopBarProps) {
    const [andarSelecionado, setAndarSelecionado] = useState("terreo")

    const centerOnMarker = (marker: MapMarker) => {
        if (transformComponentRef.current) {
            setSelectedMarker(marker.id)
            setTimeout(() => {
                const markerElement = document.getElementById(`marker-${marker.id}`)
                if (markerElement) {
                    markerElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "center",
                    })
                }
            }, 100)
        }
    }

    const toggleMarkerVisibility = (markerId: string) => {
        setMarkers(
            markers.map((marker) =>
                marker.id === markerId ? { ...marker, visible: !marker.visible } : marker
            )
        )
    }

    const visibleMarkers = markers.filter((marker) => marker.visible)

    const handleSidebarTouchMove = (e: React.TouchEvent) => {
        e.stopPropagation()
    }

    return (
        <div className="max-w-screen" onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}>
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2 h-14">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <h2 className="text-base font-medium">Mapa Interativo</h2>

                <select
                    value={andarSelecionado}
                    className="border rounded px-2 py-1 text-sm"
                    onChange={(e) => setAndarSelecionado(e.target.value)}
                >
                    <option value="terreo">Térreo</option>
                    <option value="superior">Superior</option>
                </select>
            </div>
            {/* Sidebar */}
            <div onTouchMove={handleSidebarTouchMove} className={`fixed inset-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`} style={{ overflowY: 'scroll' }}>

                <div onTouchMove={handleSidebarTouchMove} onTouchStart={(e) => e.stopPropagation()}
                    className="relative top-0 left-0 inset-0 w-80 bg-white z-40 border-r border-gray-200 flex flex-col pt-14 h-full" style={{ overflowY: 'scroll' }}>
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-semibold text-gray-900">Mapa Interativo</h1>
                        <p className="text-sm text-gray-600 mt-1">Planta baixa com pontos de interesse</p>
                    </div>

                    {/* Controles de Zoom */}
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Controles</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => transformComponentRef.current?.zoomIn()}>
                                <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => transformComponentRef.current?.zoomOut()}>
                                <ZoomOut className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => transformComponentRef.current?.resetTransform()}>
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Filtros por Categoria */}
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Categorias</h3>
                        <div className="space-y-2">
                            {categories.map((category) => {
                                const categoryMarkers = markers.filter((m) => m.category === category.name)
                                const visibleCount = categoryMarkers.filter((m) => m.visible).length

                                return (
                                    <div key={category.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                                            <span className="text-sm text-gray-700">{category.name}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {visibleCount}/{categoryMarkers.length}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Lista de Pontos */}
                    <div className="flex-1 flex flex-col" >
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-medium text-gray-900">Pontos de Interesse ({visibleMarkers.length})</h3>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-2">
                                {markers.map((marker) => (
                                    <Card
                                        key={marker.id}
                                        className={`cursor-pointer transition-all hover:shadow-md ${selectedMarker === marker.id ? "ring-2 ring-blue-500" : ""
                                            } ${!marker.visible ? "opacity-50" : ""}`}
                                        onClick={() => centerOnMarker(marker)}
                                    >
                                        <CardContent className="p-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`w-2 h-2 rounded-full ${marker.color}`} />
                                                        <h4 className="text-sm font-medium text-gray-900">{marker.name}</h4>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-2">{marker.description}</p>
                                                    <Badge variant="outline" className="text-xs">
                                                        {marker.category}
                                                    </Badge>
                                                </div>
                                                <Switch
                                                    checked={marker.visible}
                                                    onCheckedChange={() => toggleMarkerVisibility(marker.id)}
                                                    className="ml-2"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-whiteAlpha md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>


            {/* Overlay */}

        </div>
    )
}