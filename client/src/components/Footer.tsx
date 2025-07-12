"use client"
import {
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Github,
    Mail,
    MapPin,
    Phone,
    ArrowUpRight,
    Sparkles,
    BookOpen,
    Users,
    Brain,
    Trophy,
    Target,
    MessageCircle,
    HelpCircle,
    Shield,
    FileText,
    Briefcase,
    Star,
} from "lucide-react"
import { memo } from "react"
import { Link } from "react-router-dom"
import Logo from "./Logo"

// Background elements matching hero theme
const FooterBackground = memo(() => (
    <>
        {/* Gradient background matching hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100 via-indigo-200 to-white" />

        {/* Light rays effect similar to hero */}
        <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute bottom-[20%] left-[-10%] rotate-[-30deg] blur-[60px] flex gap-12">
                <div
                    className="h-[500px] w-[140px] rounded-full bg-white/60 animate-pulse"
                    style={{ animationDuration: "10s", animationDelay: "0.8s" }}
                />
                <div
                    className="h-[700px] w-[180px] rounded-full bg-white/80 animate-pulse"
                    style={{ animationDuration: "13s", animationDelay: "1.6s" }}
                />
                <div
                    className="h-[450px] w-[100px] rounded-full bg-white/70 animate-pulse"
                    style={{ animationDuration: "11s", animationDelay: "1.1s" }}
                />
            </div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                }}
            />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/3 w-[35vw] h-[35vw] max-w-[350px] max-h-[350px] rounded-full bg-gradient-to-br from-indigo-200/25 via-purple-200/15 to-transparent opacity-60 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-[25vw] h-[25vw] max-w-[250px] max-h-[250px] rounded-full bg-gradient-to-tl from-purple-200/20 via-blue-200/10 to-transparent opacity-40 blur-2xl animate-pulse pointer-events-none" />
    </>
))

const footerLinks = {
    learning: {
        title: "Learning",
        links: [
            { name: "All Courses", href: "/courses", icon: BookOpen },
            { name: "Roadmaps", href: "/roadmaps", icon: Target },
            { name: "Challenges", href: "/challenges", icon: Trophy },
            { name: "Certifications", href: "/certifications", icon: Star },
            { name: "Free Resources", href: "/resources", icon: FileText },
            { name: "Bootcamps", href: "/bootcamps", icon: Briefcase },
        ],
    },
    community: {
        title: "Community",
        links: [
            { name: "Discussion Forums", href: "/community/forums", icon: MessageCircle },
            { name: "Study Groups", href: "/community/groups", icon: Users },
            { name: "Events & Webinars", href: "/events", icon: Users },
            { name: "Success Stories", href: "/success-stories", icon: Star },
            { name: "Mentorship", href: "/mentorship", icon: Users },
            { name: "Ambassador Program", href: "/ambassadors", icon: Trophy },
        ],
    },
    aiTools: {
        title: "AI Tools",
        links: [
            { name: "Interview Simulator", href: "/ai/interview-simulator", icon: Brain },
            { name: "AI Quiz Taker", href: "/ai/quiz-taker", icon: HelpCircle },
            { name: "Career Advisor", href: "/ai/career-advisor", icon: Target },
            { name: "Code Reviewer", href: "/ai/code-review", icon: Brain },
            { name: "Resume Builder", href: "/ai/resume-builder", icon: FileText },
            { name: "Skill Assessment", href: "/ai/assessment", icon: Trophy },
        ],
    },
    company: {
        title: "Company",
        links: [
            { name: "About Us", href: "/about", icon: Users },
            { name: "Careers", href: "/careers", icon: Briefcase },
            { name: "Press Kit", href: "/press", icon: FileText },
            { name: "Partnerships", href: "/partnerships", icon: Users },
            { name: "Investors", href: "/investors", icon: Briefcase },
            { name: "Blog", href: "/blog", icon: FileText },
        ],
    },
    support: {
        title: "Support",
        links: [
            { name: "Help Center", href: "/help", icon: HelpCircle },
            { name: "Contact Support", href: "/support", icon: Mail },
            { name: "System Status", href: "/status", icon: Shield },
            { name: "API Documentation", href: "/docs", icon: FileText },
            { name: "Pricing", href: "/pricing", icon: Target },
            { name: "Enterprise", href: "/enterprise", icon: Briefcase },
        ],
    },
    legal: {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "/privacy", icon: Shield },
            { name: "Terms of Service", href: "/terms", icon: FileText },
            { name: "Cookie Policy", href: "/cookies", icon: Shield },
            { name: "GDPR", href: "/gdpr", icon: Shield },
            { name: "Accessibility", href: "/accessibility", icon: Users },
            { name: "Refund Policy", href: "/refunds", icon: FileText },
        ],
    },
}

const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/skillustad", color: "hover:text-blue-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/skillustad", color: "hover:text-blue-600" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/skillustad", color: "hover:text-pink-500" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/skillustad", color: "hover:text-red-500" },
    { name: "GitHub", icon: Github, href: "https://github.com/skillustad", color: "hover:text-gray-700" },
]

const contactInfo = [
    { icon: Mail, text: "skillustad2025@gmail.com", href: "mailto:skillustad2025@gmail.com" },
    { icon: Phone, text: "+92 (317) 3009130", href: "tel:+923173009130" },
    { icon: MapPin, text: "Karachi, PK", href: "#" },
]

// Memoized components for performance
const FooterSection = memo(({ title, links }: { title: string; links: any[] }) => (
    <div className="space-y-4">
        <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            {title}
        </h3>
        <ul className="space-y-3">
            {links.map((link) => (
                <li key={link.name}>
                    <a
                        href={link.href}
                        className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 text-sm"
                    >
                        <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                    </a>
                </li>
            ))}
        </ul>
    </div>
))

const NewsletterSection = memo(() => (
    <div
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover:bg-white/80 hover:border-white/80 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50"
        style={{
            boxShadow: "0 8px 32px rgba(99, 102, 241, 0.1)",
        }}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 rounded-2xl"></div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-900 font-semibold text-lg">Stay Updated</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Get the latest courses, AI tools, and career insights delivered to your inbox.
            </p>
            <div className="flex gap-2">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/60 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all backdrop-blur-sm"
                />
                <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-1 hover:scale-105">
                    <span className="hidden sm:inline">Subscribe</span>
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
))

const StatsSection = memo(() => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-200">
        {[
            { number: "50K+", label: "Active Learners" },
            { number: "200+", label: "Courses Available" },
            { number: "95%", label: "Success Rate" },
            { number: "24/7", label: "AI Support" },
        ].map((stat, index) => (
            <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
        ))}
    </div>
))

export default function Footer() {
    return (
        <footer className="relative overflow-hidden">
            <FooterBackground />

            <div className="relative z-10">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    {/* Top Section with Newsletter */}
                    <div className="grid lg:grid-cols-4 gap-8 mb-16">
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <Link to={"/"}>
                                    <Logo />
                                </Link>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                Empowering the next generation of tech professionals with AI-powered learning, personalized roadmaps,
                                and expert mentorship.
                            </p>
                            {/* Contact Info */}
                            <div className="space-y-3">
                                {contactInfo.map((contact, index) => (
                                    <a
                                        key={index}
                                        href={contact.href}
                                        className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm group"
                                    >
                                        <contact.icon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <span>{contact.text}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-3 relative">
                            <NewsletterSection />
                        </div>
                    </div>

                    {/* Stats Section */}
                    <StatsSection />

                    {/* Links Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 py-16">
                        <FooterSection title={footerLinks.learning.title} links={footerLinks.learning.links} />
                        <FooterSection title={footerLinks.community.title} links={footerLinks.community.links} />
                        <FooterSection title={footerLinks.aiTools.title} links={footerLinks.aiTools.links} />
                        <FooterSection title={footerLinks.company.title} links={footerLinks.company.links} />
                        <FooterSection title={footerLinks.support.title} links={footerLinks.support.links} />
                        <FooterSection title={footerLinks.legal.title} links={footerLinks.legal.links} />
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-6 py-8 border-t border-gray-200">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                className={`group p-3 rounded-full bg-white/60 hover:bg-white/80 text-gray-600 ${social.color} transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-indigo-100/50`}
                                aria-label={social.name}
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Massive Brand Text Section */}
                <div className="relative border-t border-gray-200">
                    <div className="py-16">
                        <div className="w-full mx-auto px-6">
                            <h2 className="text-nowrap text-[8vw] md:text-[10vw] lg:text-[12vw] text-center font-black leading-none text-transparent bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 bg-clip-text select-none">
                                SKILL-USTAD
                            </h2>
                            {/* Floating Elements */}
                            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 opacity-20">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-2xl rotate-45 animate-pulse" />
                            </div>
                            <div className="absolute top-1/3 right-1/4 opacity-20">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-200/40 to-indigo-200/40 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-200 py-6 bg-white/50 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4 text-gray-600 text-sm">
                                <span>© 2024 Skill-Ustad. All rights reserved.</span>
                                <div className="hidden md:block w-1 h-1 bg-gray-400 rounded-full" />
                                <span className="hidden md:inline">Built with ❤️ for learners worldwide</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span>All systems operational</span>
                                </div>
                                <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm flex items-center gap-1 hover:scale-105">
                                    <ArrowUpRight className="w-4 h-4" />
                                    Back to top
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
