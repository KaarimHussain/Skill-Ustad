import Benefits from '@/components/Benefits';
import HeroComponent from '../components/Hero'
import TrustedByLearners from '@/components/TrustedByLearners';
import TopSkillCourses from '@/components/TopSkillCourse';
import ReadyToLearn from '@/components/ReadToLearn';

export default function Home() {
    return (
        <>
            <HeroComponent />
            <Benefits />
            <TrustedByLearners />
            <TopSkillCourses />
            <ReadyToLearn />
        </>
    );
}
