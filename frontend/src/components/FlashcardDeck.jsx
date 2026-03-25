import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiRefreshCw, FiChevronLeft, FiChevronRight, FiCheckCircle, FiBookOpen } from 'react-icons/fi'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

const FlashcardDeck = ({ masteredSkills, auth }) => {
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCards()
  }, [masteredSkills])

  const fetchCards = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/learning/flashcards`, {
        skills: masteredSkills
      })
      setCards(response.data)
      setCurrentIndex(0)
    } catch (err) {
      console.error('Flashcard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const nextCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, 150)
  }

  const prevCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }, 150)
  }

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <FiRefreshCw className="animate-spin text-3xl text-[#bc13fe]" />
    </div>
  )

  if (cards.length === 0) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-center grayscale opacity-30">
        <FiBookOpen className="text-6xl" />
        <p className="text-[10px] font-black uppercase tracking-widest text-white">Master some skills to generate recall drills</p>
    </div>
  )

  const currentCard = cards[currentIndex]

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Active Recall Master</span>
         <h2 className="text-xl font-black text-white mt-2 uppercase tracking-tight">Reinforce Neural Traces</h2>
      </div>

      <div className="perspective-1000 h-[320px] relative w-full group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
           initial={false}
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
           className="w-full h-full relative preserve-3d"
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden glass-card p-10 flex flex-col items-center justify-center text-center border-none bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl shadow-2xl">
             <div className="absolute top-6 left-6 px-3 py-1 bg-[#bc13fe]/10 border border-[#bc13fe]/20 rounded-full">
                <span className="text-[8px] font-black text-[#bc13fe] uppercase tracking-widest">{currentCard?.skill}</span>
             </div>
             <p className="text-lg font-bold text-white leading-relaxed">{currentCard.question}</p>
             <span className="mt-8 text-[9px] font-black uppercase tracking-widest text-gray-500">Click to reveal answer</span>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden glass-card p-10 flex flex-col items-center justify-center text-center border-none bg-gradient-to-br from-[#bc13fe]/10 to-[#00f3ff]/10 rounded-3xl shadow-2xl rotate-y-180">
             <div className="absolute top-6 right-6 flex items-center gap-2">
                <FiCheckCircle className="text-[#34d399]" />
                <span className="text-[8px] font-black text-[#34d399] uppercase tracking-widest">Correct Solution</span>
             </div>
             <p className="text-sm font-bold text-gray-200 leading-loose italic">{currentCard.answer}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between px-4">
        <button onClick={(e) => { e.stopPropagation(); prevCard() }} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <FiChevronLeft />
        </button>
        <div className="flex flex-col items-center gap-1">
           <span className="text-[10px] font-black uppercase tracking-widest text-[#bc13fe]">Session Card</span>
           <span className="text-xs font-black text-white">{currentIndex + 1} / {cards.length}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); nextCard() }} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <FiChevronRight />
        </button>
      </div>
    </div>
  )
}

export default FlashcardDeck
