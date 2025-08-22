"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

type Props = {
    marker: {
        name: string
        description?: string
        image?: string
        videoUrl?: string
        category: string,
        video?: string
    }
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function MarkerDrawer({ marker, open, onOpenChange }: Props) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[9998]" />
                <Dialog.Content className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                        <Dialog.Title className="text-lg font-semibold">{marker.name}</Dialog.Title>
                        <Dialog.Close>
                            <X className="w-5 h-5 text-gray-500" />
                        </Dialog.Close>
                    </div>
                    {marker?.video &&
                        (
                            <div className="w-full flex items-center justify-center rounded-md overflow-hidden my-8">
                            <div className="w-full lg:w-1/2 aspect-video flex items-center justify-center rounded-xl overflow-hidden">

                                    <iframe
                                        src={'https://www.youtube.com/embed/' + marker?.video + (marker?.video.endsWith('&') ? 'rel=0' : '?rel=0')}
                                        title={`Vídeo de ${marker.name}`}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )
                    }

                    {marker.description && (
                        <p className="text-sm text-gray-700 my-2">{marker.description}</p>
                    )}

                    <Badge variant="outline" className="text-xs my-4">
                        {marker.category}
                    </Badge>
                    {marker.image && (
                        <Image
                            src={`https://cdn.jsdelivr.net/gh/thsrossi/mapa-interativo-senac@main/assets/markersImages/${marker.image}`}
                            alt={`Imagem de ${marker.name}`}
                            width={600}
                            height={300}
                            className="rounded-md w-full h-40 object-cover mb-3"
                        />
                    )}


                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
