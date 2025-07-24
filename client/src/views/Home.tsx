import Benefits from "@/components/Benefits";
import Hero from "@/components/Hero";
import ReadyToLearn from "@/components/ReadToLearn";
import TopSkillCourses from "@/components/TopSkillCourses";
import TrustedByLearners from "@/components/TrustedByLearners";
import RoadmapShowcase from "@/components/RoadmapsShowcase";

export default function Home() {
    return (
        <>
            <Hero />
            <Benefits />
            <TrustedByLearners />
            <TopSkillCourses />
            <RoadmapShowcase />
            <ReadyToLearn />
        </>
    )
}