import { useState, useEffect } from "react";
import { Alarm } from "@/types/alarm";
import { AlarmItem } from "@/components/AlarmItem";
import { AddAlarmDialog } from "@/components/AddAlarmDialog";
import { CurrentTime } from "@/components/CurrentTime";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    const savedAlarms = localStorage.getItem("alarms");
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDay = (now.getDay() + 6) % 7;

      alarms.forEach((alarm) => {
        if (
          alarm.enabled &&
          alarm.time === currentTime &&
          (alarm.days.length === 0 || alarm.days.includes(currentDay))
        ) {
          playAlarmSound();
          toast.success(`¡Alarma! ${alarm.label || alarm.time}`, {
            description: "Tu alarma está sonando",
            duration: 10000,
          });
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  const playAlarmSound = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 2
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  };

  const handleToggle = (id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const handleDelete = (id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
    toast.success("Alarma eliminada");
  };

  const handleEdit = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setDialogOpen(true);
  };

  const handleSave = (alarmData: Omit<Alarm, "id">) => {
    if (editingAlarm) {
      setAlarms((prev) =>
        prev.map((alarm) =>
          alarm.id === editingAlarm.id ? { ...alarm, ...alarmData } : alarm
        )
      );
      toast.success("Alarma actualizada");
      setEditingAlarm(null);
    } else {
      const newAlarm: Alarm = {
        ...alarmData,
        id: Date.now().toString(),
      };
      setAlarms((prev) => [...prev, newAlarm]);
      toast.success("Alarma creada");
    }
  };

  const handleOpenDialog = () => {
    setEditingAlarm(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-dawn flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Despertador</h1>
          </div>
          <Button
            onClick={handleOpenDialog}
            size="lg"
            className="rounded-full gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva alarma
          </Button>
        </div>

        <CurrentTime />

        <div className="space-y-4 mt-12">
          {alarms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No hay alarmas configuradas
              </p>
              <Button onClick={handleOpenDialog} variant="outline" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Crear primera alarma
              </Button>
            </div>
          ) : (
            alarms.map((alarm) => (
              <AlarmItem
                key={alarm.id}
                alarm={alarm}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>

        <AddAlarmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
          editingAlarm={editingAlarm}
        />
      </div>
    </div>
  );
};

export default Index;
