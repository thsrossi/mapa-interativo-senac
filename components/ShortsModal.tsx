"use client"

import { useState, useEffect, useRef } from "react"

export default function VideoModal({ onClose }: { onClose: () => void }) {


    return (
        <>

            <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 p-4">

                <>

                    <div className="w-full h-[360px] max-w-lg mx-auto">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/1gbN46xrbtw?rel=0&autoplay=0&mute=0&playsinline=1"
                            title="YouTube Shorts"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="eager"
                        ></iframe>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Ver mapa
                    </button>
                </>

            </div>

        </>
    )
}
