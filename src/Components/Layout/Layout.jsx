import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Hash, Users, Bookmark, TrendingUp, Flame, Zap, Sparkles } from 'lucide-react'

export default function Layout() {
    const location = useLocation();
    
    // تحديد الصفحات اللي هتظهر فيها الـ Sidebars
    const showSidebars = location.pathname === '/home' || location.pathname === '/profile';

    const trendingTopics = [
        { name: '#LinkUp_Next', posts: '1.2K POSTS', icon: <Zap className="w-4 h-4" /> },
        { name: '#React_2026', posts: '1.2K POSTS', icon: <Flame className="w-4 h-4" /> },
        { name: '#TailwindCSS', posts: '1.2K POSTS', icon: <Sparkles className="w-4 h-4" /> },
        { name: '#UI_UX', posts: '1.2K POSTS', icon: <TrendingUp className="w-4 h-4" /> },
    ]

    return <>
        <Navbar />
        
        <div className="flex bg-[#0f1419] min-h-screen">
            {/* Left Sidebar - يظهر بس في Home و Profile */}
            {showSidebars && (
                <aside className="hidden lg:block w-56 bg-[#1a1f2e] border-r border-gray-800 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-purple-500" />
                            Quick Menu
                        </h2>
                        
                        <nav className="space-y-2">
                            <NavLink 
                                to="/home" 
                                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                    isActive 
                                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border-l-4 border-purple-500' 
                                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                }`}
                            >
                                <Hash className="w-5 h-5" />
                                <span className="font-medium">Home Feed</span>
                            </NavLink>

                            <NavLink 
                                to="/communities" 
                                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                    isActive 
                                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border-l-4 border-purple-500' 
                                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                }`}
                            >
                                <Users className="w-5 h-5" />
                                <span className="font-medium">Communities</span>
                            </NavLink>

                            <NavLink 
                                to="/saved" 
                                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                    isActive 
                                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border-l-4 border-purple-500' 
                                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                }`}
                            >
                                <Bookmark className="w-5 h-5" />
                                <span className="font-medium">Saved</span>
                            </NavLink>
                        </nav>

                        <div className="mt-6 pt-4 border-t border-gray-800">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Discover</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all text-left">
                                    <Flame className="w-4 h-4" />
                                    <span className="text-sm">Popular Now</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all text-left">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm">Fresh Posts</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content - يتكيف حسب وجود الـ Sidebars */}
            <main className={`flex-1 ${showSidebars ? 'lg:ml-56 lg:mr-72' : ''} pt-16`}>
                <Outlet />
            </main>

            {/* Right Sidebar - يظهر بس في Home و Profile */}
            {showSidebars && (
                <aside className="hidden lg:block w-72 bg-[#1a1f2e] border-l border-gray-800 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                            <h2 className="text-lg font-bold text-white">Trending</h2>
                        </div>

                        <div className="space-y-3">
                            {trendingTopics.map((topic, index) => (
                                <div 
                                    key={index}
                                    className="group bg-[#242938] hover:bg-[#2a3142] border border-gray-800 hover:border-purple-500/30 rounded-xl p-4 cursor-pointer transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                                                    {topic.icon}
                                                </span>
                                                <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                                                    {topic.name}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium">{topic.posts}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Sparkles className="w-4 h-4 text-purple-400" />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 group-hover:w-full"
                                            style={{width: `${70 - index * 10}%`}}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-800">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Suggested for you</h3>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-[#242938] hover:bg-[#2a3142] rounded-lg cursor-pointer transition-all">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        A
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-white">AI Enthusiasts</h4>
                                        <p className="text-xs text-gray-500">2.3K members</p>
                                    </div>
                                    <button className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">
                                        Join
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-[#242938] hover:bg-[#2a3142] rounded-lg cursor-pointer transition-all">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold">
                                        D
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-white">Dev Community</h4>
                                        <p className="text-xs text-gray-500">5.1K members</p>
                                    </div>
                                    <button className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">
                                        Join
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-[#242938] hover:bg-[#2a3142] rounded-lg cursor-pointer transition-all">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                        W
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-white">Web3 Creators</h4>
                                        <p className="text-xs text-gray-500">1.8K members</p>
                                    </div>
                                    <button className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <h3 className="text-sm font-semibold text-white">Your Activity</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Posts this week</span>
                                    <span className="text-white font-semibold">12</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Comments</span>
                                    <span className="text-white font-semibold">34</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Reactions</span>
                                    <span className="text-white font-semibold">156</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            )}
        </div>

        <Footer />
    </>
}