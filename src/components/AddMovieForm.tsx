import { useState } from 'react';
import { MOODS, MoodId } from '@/types';
import { MOOD_DISPLAY } from '@/lib/const';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddMovieFormProps {
    initialMoods?: MoodId[];
    initialNote?: string;
    onAdd: (moods: MoodId[], note: string) => void;
    onCancel: () => void;
}

export default function AddMovieForm({
    initialMoods = [],
    initialNote = '',
    onAdd,
    onCancel,
}: AddMovieFormProps) {
    const [selectedMoods, setSelectedMoods] = useState<MoodId[]>(initialMoods);
    const [note, setNote] = useState(initialNote);

    const toggleMood = (id: MoodId) =>
        setSelectedMoods((prev) =>
            prev.includes(id) ? prev.filter((moodId) => moodId !== id) : [...prev, id],
        );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(selectedMoods, note);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => {
                    const { Icon, label } = MOOD_DISPLAY[mood.id];
                    const isSelected = selectedMoods.includes(mood.id);
                    return (
                        <button
                            key={mood.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => toggleMood(mood.id)}
                            className={cn(
                                'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm cursor-pointer transition-colors duration-150 select-none hover:bg-brand/30 hover:border-brand/50',
                                isSelected
                                    ? 'bg-brand! border border-transparent text-[#0a0a0f] font-medium'
                                    : 'bg-[#1a1a24] border border-[#333] text-white',
                            )}
                        >
                            <Icon
                                size={15}
                                aria-hidden="true"
                            />
                            {label}
                        </button>
                    );
                })}
            </div>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Notas opcionales..."
                rows={2}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand dark:bg-input/30"
            />

            <div className="flex gap-2">
                <Button
                    type="submit"
                    disabled={selectedMoods.length === 0}
                    className="flex-1"
                >
                    Guardar
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
}
