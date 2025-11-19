export interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  days: number[];
  label?: string;
  snoozeEnabled: boolean;
  snoozeInterval: number;
  snoozeCount?: number;
  lastTriggered?: string;
}
