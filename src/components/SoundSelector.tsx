import { useRef } from "react";
import { ALARM_SOUNDS, playSound } from "@/utils/alarmSounds";
import { Label } from "@/components/ui/label";
import { Volume2, Music } from "lucide-react";

interface SoundSelectorProps {
  value: string;
  onChange: (soundId: string) => void;
}

export const SoundSelector = ({ value, onChange }: SoundSelectorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTestSound = (soundId: string) => {
    playSound(soundId);
  };

  const handleCustomSound = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const audioData = event.target?.result as string;
        onChange(audioData);
      };
      reader.readAsDataURL(file);
    }
  };

  const isCustomSound = value && !ALARM_SOUNDS.find(s => s.id === value);

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Sonido de alarma</Label>
      <div className="space-y-2">
        {ALARM_SOUNDS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => onChange(sound.id)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              value === sound.id
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary hover:bg-secondary/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                value === sound.id ? "bg-primary/20" : "bg-background"
              }`}>
                <Volume2 className={`w-5 h-5 ${
                  value === sound.id ? "text-primary" : "text-muted-foreground"
                }`} />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-sm text-foreground">
                  {sound.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {sound.description}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTestSound(sound.id);
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-background hover:bg-background/80 text-foreground transition-colors"
            >
              Probar
            </button>
          </button>
        ))}
        
        <button
          onClick={handleCustomSound}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
            isCustomSound
              ? "border-primary bg-primary/10"
              : "border-border bg-secondary hover:bg-secondary/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCustomSound ? "bg-primary/20" : "bg-background"
            }`}>
              <Music className={`w-5 h-5 ${
                isCustomSound ? "text-primary" : "text-muted-foreground"
              }`} />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-sm text-foreground">
                Seleccionar sonido
              </h4>
              <p className="text-xs text-muted-foreground">
                Elige desde tu dispositivo
              </p>
            </div>
          </div>
          {isCustomSound && (
            <span className="text-xs font-medium text-primary">
              Personalizado
            </span>
          )}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};
