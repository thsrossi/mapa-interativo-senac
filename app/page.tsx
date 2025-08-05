"use client"
import { useState } from "react"

import InteractiveMap from "@/interactive-map"
import ShortsModal from "@/components/ShortsModal"
import ShortsPlayer from "@/components/ShortsModal"

const STORAGE_KEY = "shorts_modal_visits"

export default function Home() {
  const [showModal, setShowModal] = useState(true)

  return (
    <>
      {showModal && <ShortsPlayer onClose={() => setShowModal(false)} />}
      {!showModal && <InteractiveMap />}
    </>
  )
}