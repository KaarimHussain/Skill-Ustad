import { SparklesCore } from '@/components/ui/sparkles';

export default function ReadyToLearn() {
    return (
        <div className="h-screen w-full overflow-hidden bg-white">
            <div className="mx-auto mt-32 w-screen max-w-5xl">
                <div className="text-center text-3xl md:text-3xl lg:text-5xl text-black">
                    <h2 className="text-indigo-500">Skill Ustad</h2>
                    <h2>Empower your learning journey.</h2>
                </div>
            </div>
            <div className="relative -mt-32 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#6366f1,transparent_70%)] before:opacity-40 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-indigo-500 after:bg-indigo-800">
                <SparklesCore
                    id="tsparticles"
                    particleColor='#6366f1'
                    background="transparent"
                    particleDensity={300}
                    className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
                />
            </div>
        </div>
    )
}
