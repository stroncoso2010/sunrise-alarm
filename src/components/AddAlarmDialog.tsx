import { useState, useEffect } from "react";
import { Alarm } from "@/types/alarm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/TimePicker";
import { SoundSelector } from "@/components/SoundSelector";

interface AddAlarmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (alarm: Omit<Alarm, "id">) => void;
  editingAlarm?: Alarm | null;
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export const AddAlarmDialog = ({
  open,
  onOpenChange,
  onSave,
  editingAlarm,
}: AddAlarmDialogProps) => {
  const [time, setTime] = useState("08:00");
  const [label, setLabel] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [snoozeEnabled, setSnoozeEnabled] = useState(false);
  const [snoozeInterval, setSnoozeInterval] = useState(10);
  const [sound, setSound] = useState("classic");

  useEffect(() => {
    if (editingAlarm) {
      setTime(editingAlarm.time);
      setLabel(editingAlarm.label || "");
      setSelectedDays(editingAlarm.days);
      setSnoozeEnabled(editingAlarm.snoozeEnabled);
      setSnoozeInterval(editingAlarm.snoozeInterval);
      setSound(editingAlarm.sound || "classic");
    } else {
      setTime("08:00");
      setLabel("");
      setSelectedDays([]);
      setSnoozeEnabled(false);
      setSnoozeInterval(10);
      setSound("classic");
    }
  }, [editingAlarm, open]);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    onSave({
      time,
      label: label || undefined,
      enabled: true,
      days: selectedDays,
      snoozeEnabled,
      snoozeInterval,
      sound,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {editingAlarm ? "Editar alarma" : "Nueva alarma"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4 overflow-y-auto flex-1 -mx-6 px-6">
          <div className="space-y-2">
            <TimePicker value={time} onChange={setTime} />
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Despertar</Label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {snoozeEnabled ? "SÍ" : "NO"}
                </span>
                <button
                  onClick={() => setSnoozeEnabled(!snoozeEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    snoozeEnabled ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      snoozeEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            
            {snoozeEnabled && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Repetir cada
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => setSnoozeInterval(minutes)}
                      className={`h-12 rounded-xl text-sm font-medium transition-colors ${
                        snoozeInterval === minutes
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {minutes} min
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const custom = prompt("Ingresa los minutos:", snoozeInterval.toString());
                      if (custom) {
                        const value = parseInt(custom);
                        if (value > 0 && value <= 60) {
                          setSnoozeInterval(value);
                        }
                      }
                    }}
                    className={`h-12 rounded-xl text-sm font-medium transition-colors ${
                      ![5, 10, 15].includes(snoozeInterval)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {![5, 10, 15].includes(snoozeInterval) ? `${snoozeInterval} min` : "Otro"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Etiqueta (opcional)</Label>
            <Input
              id="label"
              placeholder="Ej: Despertar, Reunión..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Repetir</Label>
            <div className="flex gap-2">
              {DAYS.map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDay(index)}
                  className={`flex-1 h-12 rounded-xl text-sm font-medium transition-colors ${
                    selectedDays.includes(index)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <SoundSelector value={sound} onChange={setSound} />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingAlarm ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
