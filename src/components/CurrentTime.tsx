import { useEffect, useState } from "react";

export const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="text-center py-12">
      <div className="text-8xl font-bold tracking-tight bg-gradient-dawn bg-clip-text text-transparent mb-4">
        {formatTime(time)}
      </div>
      <div className="text-xl text-muted-foreground capitalize">
        {formatDate(time)}
      </div>
    </div>
  );
};
