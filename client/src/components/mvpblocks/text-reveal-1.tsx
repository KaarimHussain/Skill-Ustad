import { TextReveal } from '@/components/ui/text-reveal';
import { cn } from '@/lib/utils';


export default function TextRevealLetters() {
  return (
    <TextReveal
      className={cn(
        `bg-primary from-foreground to-primary via-rose-200 bg-clip-text text-6xl font-bold text-transparent dark:bg-gradient-to-b`,
      )}
      from="bottom"
      split="letter"
    >
      Welcome to Mvpblocks!
    </TextReveal>
  );
}
