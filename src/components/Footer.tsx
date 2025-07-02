"use client"

import { Twitter, Linkedin, Instagram, Youtube, Github } from "lucide-react"

const footerLinks = {
    left: [
        { name: "Courses", href: "/courses" },
        { name: "Pricing", href: "/pricing" },
        { name: "About", href: "/about" },
    ],
    center: [
        { name: "Community", href: "/community" },
        { name: "Blog", href: "/blog" },
        { name: "Support", href: "/support" },
    ],
    right: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Contact", href: "/contact" },
    ],
}

const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/skillsmoker" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/skillsmoker" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/skillsmoker" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/skillsmoker" },
    { name: "GitHub", icon: Github, href: "https://github.com/skillsmoker" },
]

export default function Footer() {
    return (
        <footer className="bg-black text-white relative overflow-hidden">
            {/* Top Navigation Links */}
            <div className="relative z-10 px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        {/* Left Links */}
                        <div className="flex flex-wrap gap-6">
                            {footerLinks.left.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Center Links */}
                        <div className="flex flex-wrap gap-6">
                            {footerLinks.center.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Right Links */}
                        <div className="flex flex-wrap gap-6">
                            {footerLinks.right.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Social Links Row */}
                    <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-zinc-800">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                className="p-2 text-zinc-400 hover:text-white transition-colors duration-200"
                                aria-label={social.name}
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Massive Brand Text */}
            <div className="relative">
                <div className="pb-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-[13vw] text-center font-black leading-none text-white select-none text-nowrap">
                            Skill-Ustad
                        </h2>
                    </div>
                </div>

                {/* Copyright */}
                <div className="absolute bottom-5 right-8">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">©</span>
                    </div>
                </div>

                {/* Year */}
                <div className="absolute bottom-8 left-8">
                    <span className="text-zinc-400 text-sm">2024</span>
                </div>
            </div>
        </footer>
    )
}
