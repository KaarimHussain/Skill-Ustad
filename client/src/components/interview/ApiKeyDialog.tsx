import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Settings } from 'lucide-react';

interface ApiKeyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (keys: { openRouterKey: string; elevenLabsKey: string }) => void;
    currentKeys?: { openRouterKey: string; elevenLabsKey: string };
}

export const ApiKeyDialog = ({ open, onOpenChange, onSave, currentKeys }: ApiKeyDialogProps) => {
    const [openRouterKey, setOpenRouterKey] = useState(currentKeys?.openRouterKey || '');
    const [elevenLabsKey, setElevenLabsKey] = useState(currentKeys?.elevenLabsKey || '');

    const handleSave = () => {
        onSave({ openRouterKey, elevenLabsKey });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-gradient-card border-border">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-full bg-gradient-primary">
                            <Key className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <DialogTitle className="text-foreground">API Configuration</DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground">
                        Enter your API keys to enable voice-to-voice conversation. Keys are stored locally in your browser.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="openrouter" className="text-foreground font-medium">
                            OpenRouter API Key
                        </Label>
                        <Input
                            id="openrouter"
                            type="password"
                            placeholder="sk-or-v1-..."
                            value={openRouterKey}
                            onChange={(e) => setOpenRouterKey(e.target.value)}
                            className="bg-input border-border text-foreground"
                        />
                        <p className="text-xs text-muted-foreground">
                            Get your key from{' '}
                            <a
                                href="https://openrouter.ai/keys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                openrouter.ai/keys
                            </a>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="elevenlabs" className="text-foreground font-medium">
                            ElevenLabs API Key
                        </Label>
                        <Input
                            id="elevenlabs"
                            type="password"
                            placeholder="sk_..."
                            value={elevenLabsKey}
                            onChange={(e) => setElevenLabsKey(e.target.value)}
                            className="bg-input border-border text-foreground"
                        />
                        <p className="text-xs text-muted-foreground">
                            Get your key from{' '}
                            <a
                                href="https://elevenlabs.io/app/speech-synthesis"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                elevenlabs.io
                            </a>
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!openRouterKey || !elevenLabsKey}
                            className="bg-gradient-primary text-primary-foreground shadow-button hover:opacity-90"
                        >
                            Save Keys
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};