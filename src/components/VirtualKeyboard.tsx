"use client"

import React, { useEffect, useState, JSX } from "react"
import { ArrowUp, X, Smile, Mic } from "lucide-react"

interface VirtualKeyboardProps {
  onType?: (char: string) => void;
}

export default function VirtualKeyboard({ onType }: VirtualKeyboardProps) {
  const [activeKey, setActiveKey] = useState<string>("")
  const [clickedKey, setClickedKey] = useState<string>("")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      setActiveKey(key)
      onType?.(e.key)
    }

    const handleKeyUp = () => {
      setActiveKey("")
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [onType])

  const handleKeyClick = (key: string | JSX.Element) => {
    if (typeof key === "string") {
      const keyValue = key === "space" ? " " : key
      setClickedKey(keyValue.toUpperCase())
      onType?.(keyValue)
      setTimeout(() => setClickedKey(""), 150)
    }
  }

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    [
      <ArrowUp key="shift" className="w-5 h-5" />,
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      <X key="backspace" className="w-5 h-5" />,
    ],
    [
      "123",
      <Smile key="emoji" className="w-5 h-5" />,
      <Mic key="mic" className="w-5 h-5" />,
      "space",
      "Return",
    ],
  ]

  return (
    <div className="w-full max-w-2xl mx-auto p-4 rounded-2xl bg-purple-900/90 backdrop-blur-sm shadow-2xl border border-purple-500/20">
      <div className="flex flex-col gap-1.5">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key, keyIndex) => {
              let width = "w-10"
              let content = key
              const keyString = typeof key === "string" ? key.toUpperCase() : (key as React.ReactElement).key
              const isActive = activeKey === keyString
              const isClicked = clickedKey === keyString

              if (typeof key === "string") {
                if (key === "space") {
                  width = "w-40"
                  content = "space"
                } else if (key === "Return") {
                  width = "w-20"
                }
              }

              return (
                <button
                  key={keyIndex}
                  onClick={() => handleKeyClick(key)}
                  className={`
                    ${width} h-12 flex items-center justify-center 
                    rounded-md bg-purple-800/90 text-pink-300 font-medium
                    shadow-md transition-all duration-150 relative
                    overflow-hidden border border-purple-600/30
                    ${
                      isActive || isClicked
                        ? "bg-purple-700/90 transform scale-90 shadow-inner text-pink-300 drop-shadow-[0_0_12px_rgba(244,114,182,0.7)]"
                        : "hover:bg-purple-700/90 hover:text-pink-200 hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.4)] hover:scale-105"
                    }
                    active:transform active:scale-90 active:bg-purple-600/90
                    active:shadow-inner active:drop-shadow-[0_0_16px_rgba(244,114,182,0.8)]
                  `}
                >
                  {/* Ripple effect overlay */}
                  <span className={`
                    absolute inset-0 bg-pink-300/20 rounded-md
                    ${isActive || isClicked ? "animate-ripple" : "opacity-0"}
                  `} />
                  
                  {/* Key content */}
                  <span className={`
                    relative z-10
                    ${isActive || isClicked ? "animate-bounce-subtle" : ""}
                  `}>
                    {content}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 0.15s ease-in-out;
        }
      `}</style>
    </div>
  )
} 