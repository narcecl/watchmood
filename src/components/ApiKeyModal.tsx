import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ApiKeyModalProps {
    onSave: (key: string) => void;
}

export default function ApiKeyModal({ onSave }: ApiKeyModalProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (trimmed) onSave(trimmed);
    };

    return (
        <Dialog
            open
            disablePointerDismissal
            onOpenChange={() => {}}
        >
            <DialogContent
                className="sm:max-w-md"
                showCloseButton={false}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        🎬 WatchMood
                    </DialogTitle>
                    <DialogDescription>
                        Para buscar películas necesitamos tu API key de TMDB. Se guarda solo en tu
                        navegador.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 mt-2"
                >
                    <Input
                        placeholder="Pega tu TMDB API key aquí..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim()}
                        className="w-full"
                    >
                        Guardar y continuar
                    </Button>
                    <p className="text-muted-foreground text-xs text-center">
                        Consigue tu key gratis en{' '}
                        <span className="text-primary font-medium">
                            themoviedb.org → Settings → API
                        </span>
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
}
