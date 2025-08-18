import { BarChart3, Brain, Code, DollarSign, Palette, TrendingUp } from "lucide-react";
import AuthService from "./auth.service";

export interface ISkillCourse {
    title: string,
    description: string,
    icon: any,
    color: string,
    iconColor: string,
    borderColor: string,
    students: string,
    duration: string,
    rating: number,
    level: string,
    projects: number,
    popular: boolean
}

export default class DashboardService {
    skillCourses = [
        {
            title: "Web Development",
            description: "Learn full-stack development using modern tools like React, Node.js & more.",
            icon: Code,
            color: "from-blue-500/20 to-cyan-500/20",
            iconColor: "text-blue-600",
            borderColor: "hover:border-blue-500/50",
            students: "12,847",
            duration: "16 weeks",
            rating: 4.9,
            level: "Beginner to Advanced",
            projects: 8,
            popular: true,
        },
        {
            title: "UI/UX Design",
            description: "Master design thinking, wireframing & real tools like Figma.",
            icon: Palette,
            color: "from-purple-500/20 to-pink-500/20",
            iconColor: "text-purple-600",
            borderColor: "hover:border-purple-500/50",
            students: "8,932",
            duration: "12 weeks",
            rating: 4.8,
            level: "Beginner to Pro",
            projects: 6,
            popular: false,
        },
        {
            title: "Digital Marketing",
            description: "Learn SEO, ads, content strategy & data-driven growth.",
            icon: TrendingUp,
            color: "from-green-500/20 to-emerald-500/20",
            iconColor: "text-green-600",
            borderColor: "hover:border-green-500/50",
            students: "6,543",
            duration: "10 weeks",
            rating: 4.7,
            level: "Beginner to Expert",
            projects: 5,
            popular: false,
        },
        {
            title: "AI & Machine Learning",
            description: "Build smart apps with Python, ML models & real datasets.",
            icon: Brain,
            color: "from-orange-500/20 to-red-500/20",
            iconColor: "text-orange-600",
            borderColor: "hover:border-orange-500/50",
            students: "9,876",
            duration: "20 weeks",
            rating: 4.9,
            level: "Intermediate to Advanced",
            projects: 10,
            popular: true,
        },
        {
            title: "Freelancing & Monetization",
            description: "Learn how to earn online with your skills.",
            icon: DollarSign,
            color: "from-yellow-500/20 to-amber-500/20",
            iconColor: "text-yellow-600",
            borderColor: "hover:border-yellow-500/50",
            students: "4,321",
            duration: "8 weeks",
            rating: 4.6,
            level: "All Levels",
            projects: 4,
            popular: false,
        },
        {
            title: "Data Science",
            description: "Analyze data, build models & make smarter decisions.",
            icon: BarChart3,
            color: "from-cyan-500/20 to-blue-500/20",
            iconColor: "text-cyan-600",
            borderColor: "hover:border-cyan-500/50",
            students: "7,654",
            duration: "18 weeks",
            rating: 4.8,
            level: "Intermediate to Advanced",
            projects: 7,
            popular: false,
        },
    ]

    public async getUserBasicData() {
        try {
            const data = AuthService.decodeToken(AuthService.getToken() || "");
            // console.log("Decoded User Data:", data);
            return data ? data.name : "User";
        } catch (error) {
            console.log("Error decoding token:", error);
            return "User";
        }
    }

    public async getUserType() {
        try {
            const data = AuthService.decodeToken(AuthService.getToken() || "");
            return data ? data.UserType : "Student";
        } catch (error) {
            console.log("Error decoding token:", error);
            return "Student";
        }
    }

    public getStaticData() {
        return this.skillCourses;
    }
}