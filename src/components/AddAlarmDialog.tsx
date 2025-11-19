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

  useEffect(() => {
    if (editingAlarm) {
      setTime(editingAlarm.time);
      setLabel(editingAlarm.label || "");
      setSelectedDays(editingAlarm.days);
    } else {
      setTime("08:00");
      setLabel("");
      setSelectedDays([]);
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
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAlarm ? "Editar alarma" : "Nueva alarma"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="time">Hora</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-2xl font-bold h-14"
            />
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
        </div>

        <DialogFooter>
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
