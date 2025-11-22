import { useState } from "react";
import { ALARM_SOUNDS, playSound } from "@/utils/alarmSounds";
import { Label } from "@/components/ui/label";
import { Volume2, Check } from "lucide-react";

interface SoundSelectorProps {
  value: string;
  onChange: (soundId: string) => void;
}

export const SoundSelector = ({ value, onChange }: SoundSelectorProps) => {
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const handleTestSound = (soundId: string) => {
    setPlayingSound(soundId);
    playSound(soundId);
    setTimeout(() => setPlayingSound(null), 2000);
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Sonido de alarma</Label>
      <div className="grid grid-cols-2 gap-3">
        {ALARM_SOUNDS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => onChange(sound.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              value === sound.id
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary hover:bg-secondary/80"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-sm text-foreground">
                {sound.name}
              </h4>
              {value === sound.id && (
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {sound.description}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTestSound(sound.id);
              }}
              disabled={playingSound === sound.id}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                playingSound === sound.id
                  ? "bg-primary/20 text-primary"
                  : "bg-background hover:bg-background/80 text-foreground"
              }`}
            >
              <Volume2 className="w-3 h-3" />
              {playingSound === sound.id ? "Reproduciendo..." : "Probar"}
            </button>
          </button>
        ))}
      </div>
    </div>
  );
};
