import { Outlet, Link } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/solid";

export default function Layout() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <SparklesIcon className="h-8 w-8 text-indigo-600" />
                            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                MonProjet
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <ul className="hidden md:flex space-x-8 items-center">
                            <li>
                                <Link to="/" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                                    Acceuil
                                </Link>
                            </li>
                            <li>
                                <Link to="/Marketplace" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                                    Marketplace
                                </Link>
                            </li>
                            <li>
                                <Link to="/Predict" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                                    Predict
                                </Link>
                            </li>
                        </ul>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/Login" className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                                Connexion
                            </Link>
                            <Link to="/Register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                Inscription
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} MonProjet. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    )
}