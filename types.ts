export interface MapMarker {
    id: string
    name: string
    description: string
    x: number
    y: number
    category: string
    color: string
    visible: boolean
    image?:string
    video?: string
}

export interface Category {
    name: string
    color: string
}

export interface TransformComponentRef {
    zoomIn: () => void
    zoomOut: () => void
    resetTransform: () => void
    zoomToElement: (element: HTMLElement) => void
}