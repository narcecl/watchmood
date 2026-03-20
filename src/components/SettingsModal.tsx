import { useState } from 'react';
import { Settings } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SettingsModalProps {
    apiKey: string;
    onSaveApiKey: (key: string) => void;
}

export default function SettingsModal({ apiKey, onSaveApiKey }: SettingsModalProps) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(apiKey);
    const [saved, setSaved] = useState(false);

    const handleOpen = (value: boolean) => {
        if (value) setInput(apiKey);
        setSaved(false);
        setOpen(value);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (trimmed && trimmed !== apiKey) {
            onSaveApiKey(trimmed);
        }
        setSaved(true);
        setTimeout(() => setOpen(false), 800);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpen}
        >
            <Button
                variant="ghost"
                title="Configuración"
                onClick={() => handleOpen(true)}
                className="text-muted-foreground hover:text-foreground"
            >
                <Settings className="size-4" />
                Configuración
            </Button>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Configuración</DialogTitle>
                    <DialogDescription>Ajustes de la aplicación</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSave}
                    className="flex flex-col gap-4 mt-2"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium">TMDB API Key</label>
                        <Input
                            type="password"
                            placeholder="Pega tu API key aquí..."
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setSaved(false);
                            }}
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground">
                            Consíguела gratis en{' '}
                            <span className="text-foreground/70 font-medium">
                                themoviedb.org → Settings → API
                            </span>
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={!input.trim() || saved}
                        className="w-full"
                    >
                        {saved ? '✓ Guardado' : 'Guardar cambios'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
