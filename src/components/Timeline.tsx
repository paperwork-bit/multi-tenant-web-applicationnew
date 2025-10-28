import React from "react";
import { Badge } from "./ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: "completed" | "current" | "upcoming";
  user?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            {item.status === "completed" ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : item.status === "current" ? (
              <Circle className="w-6 h-6 text-primary fill-primary" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
            {index < items.length - 1 && (
              <div className="w-0.5 h-full min-h-[40px] bg-border mt-2" />
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between mb-1">
              <h4>{item.title}</h4>
              <Badge variant={item.status === "completed" ? "default" : "outline"}>
                {item.status}
              </Badge>
            </div>
            {item.description && (
              <p className="text-muted-foreground mb-2">{item.description}</p>
            )}
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>{item.date}</span>
              {item.user && <span>• {item.user}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
