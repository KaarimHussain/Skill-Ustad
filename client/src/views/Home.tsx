import Benefits from "@/components/Benefits";
import Hero from "@/components/Hero";
import ProductFeatures from "@/components/ProductFeatures";
import ReadyToLearn from "@/components/ReadToLearn";
import TrustedByLearners from "@/components/TrustedByLearners";

export default function Home() {
    return (
        <>
            <Hero />
            <Benefits />
            <TrustedByLearners />
            <ProductFeatures/>
            <ReadyToLearn />
        </>
    )
}