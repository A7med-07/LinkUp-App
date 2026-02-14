import React from 'react'

export default function Footer() {
  return (
    <div className="relative bottom-0 left-0 w-full z-50 bg-[#1a1f2e] border-t border-gray-800 py-6">
      <div className="flex items-center justify-between px-8">

        {/* Logo - Left */}
        <h1 className="flex items-center gap-3 text-4xl font-semibold">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 text-white font-bold shadow-xl">
            L
          </span>
          <span className="text-white">LinkUp</span>
        </h1>

        {/* Text - Right */}
        <div className="flex gap-8 text-slate-500 text-sm font-medium text-right">
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-purple-400 transition-colors">By@ Ahmed Sabry</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Copyright 2026</a>
        </div>

      </div>
    </div>
  )
}

 
