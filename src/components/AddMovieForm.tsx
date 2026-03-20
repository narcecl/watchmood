import { useState } from 'react';
import { MOODS, MoodId, TMDBResult } from '@/types';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddMovieFormProps {
    result?: TMDBResult;
    initialMoods?: MoodId[];
    initialNote?: string;
    onAdd: (moods: MoodId[], note: string) => void;
    onCancel: () => void;
}

export default function AddMovieForm({
    result: _result,
    initialMoods = [],
    onAdd,
    onCancel,
}: AddMovieFormProps) {
    const [selectedMoods, setSelectedMoods] = useState<MoodId[]>(initialMoods);
    // const [note, setNote] = useState(initialNote);

    const toggleMood = (id: MoodId) =>
        setSelectedMoods((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
        );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // onAdd(selectedMoods, note.trim());
        onAdd(selectedMoods, ''); // TODO: add note input back in
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <div className="flex flex-col gap-0.5">
                <p className="text-muted-foreground px-1 mb-4">
                    ¿Qué mood se te viene a la cabeza con esta{' '}
                    {(_result?.mediaType === 'movie' && 'película') || 'serie'}?
                </p>
                {MOODS.map((mood) => (
                    <label
                        key={mood.id}
                        className={cn(
                            'border border-neutral-900 flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm select-none bg-neutral-950',
                            selectedMoods.includes(mood.id)
                                ? 'bg-neutral-900 text-primary'
                                : 'hover:bg-accent',
                        )}
                    >
                        <input
                            type="checkbox"
                            checked={selectedMoods.includes(mood.id)}
                            onChange={() => toggleMood(mood.id)}
                            className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
                        />
                        {mood.label}
                    </label>
                ))}
            </div>

            {/* <Input
                placeholder="Nota opcional (¿por qué la guardas?)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-xs h-8"
            /> */}

            <div className="flex gap-2">
                <Button
                    type="submit"
                    disabled={selectedMoods.length === 0}
                    className="flex-1"
                >
                    Añadir a mi lista
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
