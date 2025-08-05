import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getTooltipText = (difficulty: string) => {
    switch (difficulty) {
        case "Easy":
            return "Suitable for beginners. Give it a try!";
        case "Medium":
            return "Requires some experience. Challenge yourself!";
        case "Hard":
            return "For advanced users. Test your skills!";
        default:
            return "Difficulty level information.";
    }
};

const DifficultyBadge = ({ difficulty = "Medium" }) => {
    const tooltipText = getTooltipText(difficulty);

    let badgeClass = "";
    if (difficulty === "Easy") {
        badgeClass = "py-1 px-4 border border-green-500 bg-green-700/20 text-green-600 rounded-full";
    } else if (difficulty === "Medium") {
        badgeClass = "py-1 px-4 border border-amber-500 bg-amber-700/20 text-amber-600 rounded-full";
    } else if (difficulty === "Hard") {
        badgeClass = "py-1 px-4 border border-rose-500 bg-rose-700/20 text-rose-600 rounded-full";
    } else {
        badgeClass = "py-1 px-4 border border-amber-500 bg-amber-700/20 text-amber-600 rounded-full";
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={badgeClass}>
                        {difficulty}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs max-w-xs">
                    {tooltipText}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default DifficultyBadge;