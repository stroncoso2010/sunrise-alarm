import { useState, useRef, useEffect } from "react";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export const TimePicker = ({ value, onChange }: TimePickerProps) => {
  const [mode, setMode] = useState<"hours" | "minutes">("hours");
  const [hours, setHours] = useState(parseInt(value.split(":")[0]) || 8);
  const [minutes, setMinutes] = useState(parseInt(value.split(":")[1]) || 0);
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const [h, m] = value.split(":").map(Number);
    setHours(h || 8);
    setMinutes(m || 0);
  }, [value]);

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clockRef.current) return;
    
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;
    
    if (mode === "hours") {
      const newHours = Math.round(angle / 30) % 12;
      const finalHours = newHours === 0 ? 12 : newHours;
      setHours(finalHours);
      onChange(`${finalHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
      setMode("minutes");
    } else {
      const newMinutes = Math.round(angle / 6) % 60;
      setMinutes(newMinutes);
      onChange(`${hours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`);
    }
  };

  const renderNumbers = () => {
    const numbers = mode === "hours" ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 12 }, (_, i) => i * 5);
    const radius = 85;
    
    return numbers.map((num, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      const isSelected = mode === "hours" ? num === hours : num === minutes;
      
      return (
        <div
          key={num}
          className={`absolute text-sm font-medium transition-colors ${
            isSelected ? "text-primary font-bold scale-125" : "text-muted-foreground"
          }`}
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {num}
        </div>
      );
    });
  };

  const getHandAngle = () => {
    if (mode === "hours") {
      return ((hours % 12) * 30 - 90);
    } else {
      return (minutes * 6 - 90);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 text-center">
        <button
          onClick={() => setMode("hours")}
          className={`text-4xl font-bold px-4 py-2 rounded-lg transition-colors ${
            mode === "hours" ? "text-primary bg-primary/10" : "text-muted-foreground"
          }`}
        >
          {hours.toString().padStart(2, "0")}
        </button>
        <span className="text-4xl font-bold text-muted-foreground">:</span>
        <button
          onClick={() => setMode("minutes")}
          className={`text-4xl font-bold px-4 py-2 rounded-lg transition-colors ${
            mode === "minutes" ? "text-primary bg-primary/10" : "text-muted-foreground"
          }`}
        >
          {minutes.toString().padStart(2, "0")}
        </button>
      </div>

      <div
        ref={clockRef}
        onClick={handleClockClick}
        className="relative w-64 h-64 rounded-full bg-secondary cursor-pointer"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary z-10" />
          <div
            className="absolute w-1 bg-primary origin-bottom transition-transform duration-200"
            style={{
              height: "80px",
              bottom: "50%",
              left: "50%",
              transform: `translateX(-50%) rotate(${getHandAngle()}deg)`,
            }}
          />
        </div>
        {renderNumbers()}
      </div>

      <div className="text-sm text-muted-foreground">
        {mode === "hours" ? "Selecciona la hora" : "Selecciona los minutos"}
      </div>
    </div>
  );
};
