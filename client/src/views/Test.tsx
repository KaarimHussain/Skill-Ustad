import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { GraduationCap, Trophy, Workflow, Users, Map, MessageCircle, Menu, X, BrainCircuit, BadgeDollarSign } from "lucide-react"
import Logo from "@/components/Logo"
import { Link } from "react-router-dom"

const navigationData = [
    {
        linkName: "Products",
        linkData: [
            {
                title: "Roadmaps",
                description: "Step by step learning paths tailored to your career goals and skills level.",
                icon: Workflow,
                href: "#",
                color: "from-blue-500/20 to-blue-500/20",
                iconColor: "text-blue-600",
                borderColor: "hover:border-blue-500/50",
                bgColor: "bg-blue-50",
            },
            {
                title: "Courses",
                description: "Comprehensive learning paths with hands on projects, AI Assistance, and expert mentorship",
                icon: GraduationCap,
                href: "#",
                color: "from-purple-500/20 to-purple-500/20",
                iconColor: "text-purple-600",
                borderColor: "hover:border-purple-500/50",
                bgColor: "bg-purple-50",
            },
            {
                title: "Challenges",
                description: "Test your skills with coding challenges and real-world problem-solving tasks.",
                icon: Trophy,
                href: "#",
                color: "from-emerald-500/20 to-emerald-500/20",
                iconColor: "text-emerald-600",
                borderColor: "hover:border-emerald-500/50",
                bgColor: "bg-emerald-50",
            },
            {
                title: "AI Tools",
                description: "Skill-Ustad's AI Tools Hub gives you instant access to free, no- code tools that help you build with the power of AI.",
                icon: BrainCircuit,
                href: "#",
                color: "from-rose-500/20 to-rose-500/20",
                iconColor: "text-rose-600",
                borderColor: "hover:border-rose-500/50",
                bgColor: "bg-rose-50",
            },
        ]
    },
    {
        linkName: "Features",
        linkData: [
            {
                title: "Community",
                description: "Connect with learners worldwide, share knowledge, and grow together.",
                icon: Users,
                href: "#",
                color: "from-orange-500/20 to-red-500/20",
                iconColor: "text-orange-600",
                borderColor: "hover:border-orange-500/50",
                bgColor: "bg-orange-50",
            },
            {
                title: "Roadmaps",
                description: "Visualize your learning journey with interactive skill progression maps.",
                icon: Map,
                href: "#",
                color: "from-teal-500/20 to-cyan-600/20",
                iconColor: "text-teal-600",
                borderColor: "hover:border-teal-500/50",
                bgColor: "bg-teal-50",
            },
            {
                title: "Q&A Hub",
                description: "Get answers to your questions from experts and fellow learners.",
                icon: MessageCircle,
                href: "#",
                color: "from-yellow-500/20 to-amber-500/20",
                iconColor: "text-yellow-600",
                borderColor: "hover:border-yellow-500/50",
                bgColor: "bg-yellow-50",
            },
            {
                title: "Pricing",
                description: "Flexible plans for every learner—start free or unlock advanced tools and mentor support to boost your tech journey.",
                icon: BadgeDollarSign,
                href: "#",
                color: "from-fuchsia-500/20 to-fuchsia-500/20",
                iconColor: "text-fuchsia-600",
                borderColor: "hover:border-fuchsia-500/50",
                bgColor: "bg-fuchsia-50",
            },
        ]
    },
]

export default function Test() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen container px-4 md:px-8 lg:px-35 pt-24">
                <h1 className="text-4xl md:text-5xl font-bold">Hello Hello...</h1>
                <h1 className="text-4xl md:text-5xl font-bold mt-4">Testing Code</h1>
                <div className="mt-8 space-y-4">
                    <p className="text-lg text-gray-600">Scroll down to see the navbar animation effect!</p>
                    {[...Array(20)].map((_, i) => (
                        <p key={i} className="text-gray-500">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    ))}
                </div>
            </div>
        </>
    )
}

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<number | null>(null)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            {/* Desktop Navigation */}
            <motion.nav
                className="hidden lg:block fixed top-0 left-0 right-0 z-50 p-4"
                initial={{ y: 0 }}
                animate={{ y: 0 }}
            >
                <motion.div
                    className="rounded-full py-3 px-6 mx-auto flex items-center justify-between"
                    initial={{
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderColor: "rgba(212, 212, 216, 0)",
                        backdropFilter: "blur(0px)",
                        maxWidth: "90rem"
                    }}
                    animate={{
                        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0)",
                        borderColor: isScrolled ? "rgba(212, 212, 216, 1)" : "rgba(212, 212, 216, 0)",
                        backdropFilter: isScrolled ? "blur(24px)" : "blur(0px)",
                        maxWidth: isScrolled ? "72rem" : "90rem",
                        boxShadow: isScrolled ? "0 1px 3px 0 rgb(0 0 0 / 0.05)" : "0 0 0 0 rgb(0 0 0 / 0)"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ borderWidth: "1px", borderStyle: "solid" }}
                >
                    {/* Navigation Links */}
                    <div className="flex items-center gap-1">
                        {navigationData.map((data, index) => (
                            <NavigationMenu key={index}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="text-black hover:text-indigo-600 bg-transparent hover:bg-gray-100 rounded-full px-4 py-2 transition-colors">
                                            {data.linkName}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <motion.div
                                                className="w-screen max-w-5xl p-4"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                                                    {data.linkData.map((linkData, idx) => {
                                                        const IconComponent = linkData.icon
                                                        return (
                                                            <NavigationMenuLink key={idx} asChild>
                                                                <motion.a
                                                                    href={linkData.href}
                                                                    className={`group relative flex flex-col gap-3 rounded-2xl p-5 transition-all duration-300 border-1 overflow-hidden`}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    {/* Gradient Background */}
                                                                    <div className={`absolute inset-0 bg-gradient-to-br ${linkData.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                                                    {/* Content */}
                                                                    <div className="relative z-10">
                                                                        <div className={`w-12 h-12 rounded-xl ${linkData.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3`}>
                                                                            <IconComponent className={`w-6 h-6 ${linkData.iconColor}`} />
                                                                        </div>
                                                                        <h3 className="font-bold text-gray-900 mb-2 text-lg">
                                                                            {linkData.title}
                                                                        </h3>
                                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                                            {linkData.description}
                                                                        </p>
                                                                    </div>
                                                                </motion.a>
                                                            </NavigationMenuLink>
                                                        )
                                                    })}
                                                </div>
                                            </motion.div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        ))}
                    </div>

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo logoOnly />
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="secondary" size="default" className="rounded-full">
                            Login
                        </Button>
                        <Button size="default" className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-md">
                            Register
                        </Button>
                    </div>
                </motion.div>
            </motion.nav>

            {/* Mobile Navigation */}
            <motion.nav
                className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4"
                initial={{ y: 0 }}
                animate={{ y: 0 }}
            >
                <motion.div
                    className="rounded-full py-3 px-4 flex items-center justify-between"
                    initial={{
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderColor: "rgba(212, 212, 216, 0)",
                        backdropFilter: "blur(0px)"
                    }}
                    animate={{
                        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0)",
                        borderColor: isScrolled ? "rgba(212, 212, 216, 1)" : "rgba(212, 212, 216, 0)",
                        backdropFilter: isScrolled ? "blur(24px)" : "blur(0px)",
                        boxShadow: isScrolled ? "0 1px 3px 0 rgb(0 0 0 / 0.05)" : "0 0 0 0 rgb(0 0 0 / 0)"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ borderWidth: "1px", borderStyle: "solid" }}
                >
                    <Logo logoOnly />

                    <motion.button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Toggle menu"
                        whileTap={{ scale: 0.95 }}
                    >
                        <AnimatePresence mode="wait">
                            {mobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="w-6 h-6 text-gray-700" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu className="w-6 h-6 text-gray-700" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            className="mt-2 bg-white/95 backdrop-blur-2xl rounded-3xl border border-zinc-300 shadow-xl overflow-hidden"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <div className="p-4 space-y-2">
                                {navigationData.map((data, index) => (
                                    <div key={index}>
                                        <motion.button
                                            onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === index ? null : index)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl font-medium text-gray-700 transition-colors"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {data.linkName}
                                        </motion.button>
                                        <AnimatePresence>
                                            {mobileSubmenuOpen === index && (
                                                <motion.div
                                                    className="mt-2 ml-2 space-y-2 overflow-hidden"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                >
                                                    {data.linkData.map((linkData, idx) => {
                                                        const IconComponent = linkData.icon
                                                        return (
                                                            <motion.a
                                                                key={idx}
                                                                href={linkData.href}
                                                                className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-300 border-2 border-transparent ${linkData.borderColor} relative overflow-hidden group`}
                                                                initial={{ x: -20, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                {/* Gradient Background */}
                                                                <div className={`absolute inset-0 bg-gradient-to-br ${linkData.color} opacity-50`}></div>

                                                                {/* Content */}
                                                                <div className={`relative z-10 w-10 h-10 rounded-lg ${linkData.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                                    <IconComponent className={`w-5 h-5 ${linkData.iconColor}`} />
                                                                </div>
                                                                <div className="relative z-10">
                                                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                                        {linkData.title}
                                                                    </h3>
                                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                                        {linkData.description}
                                                                    </p>
                                                                </div>
                                                            </motion.a>
                                                        )
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}

                                <Link
                                    to="/ai/tools"
                                    className="block px-4 py-3 hover:bg-gray-100 rounded-xl font-medium text-gray-700 transition-colors"
                                >
                                    AI Tools
                                </Link>
                                <Link
                                    to="/pricing"
                                    className="block px-4 py-3 hover:bg-gray-100 rounded-xl font-medium text-gray-700 transition-colors"
                                >
                                    Pricing
                                </Link>

                                <motion.div
                                    className="pt-4 border-t border-gray-200 mt-4 space-y-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Button variant="secondary" size="default" className="w-full rounded-xl">
                                        Login
                                    </Button>
                                    <Button size="default" className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600 text-white">
                                        Register
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    )
}