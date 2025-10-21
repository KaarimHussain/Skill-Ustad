import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BadgeCheck } from 'lucide-react';

const TIERS = [
    {
        id: 'free',
        name: 'Free Learner',
        price: {
            monthly: 'Free',
        },
        description: 'Start your learning journey with essential tools.',
        features: [
            'Access to all free courses',
            '3 roadmap generations',
            'Community support',
            'Unlimited quiz attempts',
            '3 attempts of Interview Simulator',
        ],
        cta: 'Get Started',
    },
    {
        id: 'pro',
        name: 'Pro Learner',
        price: {
            monthly: "PKR 700"
        },
        description: 'Level up your skills with advanced tools and mentor help.',
        features: [
            'Everything in Free Learner',
            '50 roadmap generations per month',
            'Mentor assistance',
            'Email reminders for learning progress',
            '100 attempts of Interview Simulator',
        ],
        cta: 'Upgrade to Pro',
    },
    {
        id: 'dedicated',
        name: 'Dedicated Learner',
        price: {
            monthly: "PKR 2000",
        },
        description: 'For learners who want maximum guidance and recognition.',
        features: [
            'Everything in Pro Learner',
            'Unlimited roadmap generation',
            '1-on-1 voice & video guidance with mentors',
            'Special recognition from partner companies',
            '24/7 technical support from Skill Ustad',
            'Unlimited attempts of Interview Simulator',
        ],
        cta: 'Become Dedicated',
        highlighted: true, // if you want it styled as premium
    },
];


const HighlightedBackground = () => (
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:45px_45px] opacity-100 dark:opacity-30" />
);


const PricingCard = ({
    tier,
}: {
    tier: (typeof TIERS)[0];
}) => {
    const isHighlighted = tier.highlighted;
    return (
        <div
            className={cn(
                'relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow',
            )}
        >
            {isHighlighted && <HighlightedBackground />}
            <h2 className="flex items-center gap-3 text-3xl font-light capitalize">
                {tier.name}
            </h2>
            <div className="relative">
                <p className="text-4xl font-bold">{tier.price.monthly}</p>
            </div>
            <div className="flex-1 space-y-2">
                <h3 className="text-sm font-medium">{tier.description}</h3>
                <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                        <li
                            key={index}
                            className={cn(
                                'flex items-center gap-2 text-sm font-medium',
                            )}
                        >
                            <BadgeCheck strokeWidth={1} size={16} />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
            <Button
                className={cn(
                    'h-fit w-full rounded-lg bg-indigo-500 hover:bg-indigo-600',
                    isHighlighted && 'bg-accent text-foreground hover:bg-accent/95',
                )}
            >
                {tier.cta}
            </Button>
        </div>
    );
};

export default function Pricing() {
    return (
        <>
            <div className="min-h-screen pt-20">
                <section className="flex flex-col items-center gap-10 py-10 md:py-20">
                    <div className="space-y-7 text-center">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-medium md:text-5xl">
                                Plans and Pricing
                            </h1>
                            <p>
                                Flexible plans for every learner—start free or unlock advanced tools and mentor support to boost your tech journey.
                            </p>
                        </div>
                    </div>
                    <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {TIERS.map((tier, i) => (
                            <PricingCard
                                key={i}
                                tier={tier}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}