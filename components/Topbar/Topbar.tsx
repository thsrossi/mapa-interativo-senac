"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { Badge } from "../ui/badge"
import { Switch } from "../ui/switch"
import { MapMarker, Category, TransformComponentRef } from "@/types"
import { ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch"
import { ca } from "date-fns/locale"
import { Input } from "../ui/input"

interface TopBarProps {
    markers: MapMarker[]
    transformComponentRef: React.RefObject<ReactZoomPanPinchContentRef>
    selectedMarker: string | null
    setSelectedMarker: (id: string | null) => void
    hoveredMarker: string | null
    setHoveredMarker: (id: string | null) => void
    categoriasUnicas: Category[]
    setMarkers: (markers: MapMarker[]) => void
    sidebarOpen: boolean // 
    setSidebarOpen: (open: boolean) => void // 
    andarSelecionado: string
    setAndarSelecionado: (andar: string) => void
}

export default function Topbar({
    markers,
    transformComponentRef,
    selectedMarker,
    setSelectedMarker,
    setMarkers,
    setSidebarOpen,
    categoriasUnicas,
    sidebarOpen,
    andarSelecionado,
    setAndarSelecionado
}: TopBarProps) {



    const [categoriasVisiveis, setCategoriasVisiveis] = useState<string[]>(categoriasUnicas.map((c) => c.name));

    const toggleCategoria = (categoria: string) => {
        setCategoriasVisiveis((prev) =>
            prev.includes(categoria)
                ? prev.filter((c) => c !== categoria)
                : [...prev, categoria]
        );
    };

    const [filtro, setFiltro] = useState("")

    const markersFiltrados = useMemo(() => {
        return markers.filter((marker) =>
            `${marker.name} ${marker.description} ${marker.category}`
                .toLowerCase()
                .includes(filtro.toLowerCase())
        )
    }, [filtro, markers])

    const centerOnMarker = (marker: MapMarker) => {
        if (!transformComponentRef.current) return;
        setSidebarOpen(false)
        setSelectedMarker(marker.id);

        const { zoomToElement } = transformComponentRef.current;

        const markerElement = document.getElementById(`marker-${marker.id}`);
        if (markerElement && zoomToElement) {
            zoomToElement(markerElement, 1.5, 300); // Zoom 1.5x e animação de 300ms
        }
    };

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



    useEffect(() => {
        setCategoriasVisiveis(categoriasUnicas.map((c) => c.name))
        setFiltro("")
    }, [categoriasUnicas])

    useEffect(() => {
        setMarkers(
            markers.map((marker) => ({
                ...marker,
                visible: categoriasVisiveis.includes(marker.category),
            }))
        );
    }, [categoriasVisiveis]);

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
                    <option value="mezanino">Mezanino</option>
                </select>
            </div>
            {/* Sidebar */}
            <div onTouchMove={handleSidebarTouchMove} className={`fixed inset-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:max-h-screen'} 
                      md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`} style={{ overflowY: 'scroll' }}>

                <div onTouchMove={handleSidebarTouchMove} onTouchStart={(e) => e.stopPropagation()}
                    className="relative top-0 left-0 inset-0 w-80 bg-white z-40 border-r border-gray-200 flex flex-col pt-14 h-full" style={{ overflowY: 'scroll' }}>
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-semibold text-gray-900">Mapa Interativo</h1>
                        <p className="text-sm text-gray-600 mt-1">Planta baixa com pontos de interesse</p>
                    </div>

                    {/* Controles de Zoom */}
                    <div className="p-4 hidden md:block border-b">
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
                            {categoriasUnicas.map((category) => {

                                return (
                                    <div key={category.name} className="flex items-center justify-between " onClick={() => toggleCategoria(category.name)}>
                                        <div className="flex items-center gap-2">

                                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                                            <span className="text-sm text-gray-700">{category.name}</span>
                                        </div>
                                        <Switch checked={categoriasVisiveis.includes(category.name)} onClick={(e) => e.preventDefault()} onCheckedChange={() => toggleCategoria(category.name)} />
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
                        <div className="p-4">
                            <Input
                                placeholder="Buscar ponto de interesse..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <div className="p-4 space-y-2">
                                {markersFiltrados.map((marker) => (
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
                                                {/* <Switch
                                                    checked={marker.visible}
                                                    onCheckedChange={() => toggleMarkerVisibility(marker.id)}
                                                    className="ml-2"
                                                /> */}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
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