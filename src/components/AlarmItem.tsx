import { Alarm } from "@/types/alarm";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
}

const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

export const AlarmItem = ({ alarm, onToggle, onDelete, onEdit }: AlarmItemProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft transition-all hover:shadow-medium">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-5xl font-bold tracking-tight text-foreground">
              {alarm.time}
            </span>
            <Switch
              checked={alarm.enabled}
              onCheckedChange={() => onToggle(alarm.id)}
            />
          </div>
          
          {alarm.label && (
            <p className="text-sm text-muted-foreground mb-2">{alarm.label}</p>
          )}
          
          <div className="flex gap-2">
            {alarm.days.length === 7 ? (
              <span className="text-sm text-muted-foreground">Todos los días</span>
            ) : alarm.days.length === 0 ? (
              <span className="text-sm text-muted-foreground">Una vez</span>
            ) : (
              DAYS.map((day, index) => (
                <span
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    alarm.days.includes(index)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {day}
                </span>
              ))
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(alarm)}
            className="h-9 w-9"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(alarm.id)}
            className="h-9 w-9 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
