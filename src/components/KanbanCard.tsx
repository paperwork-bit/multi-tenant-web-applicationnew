import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Calendar, DollarSign, Phone } from "lucide-react";

interface KanbanCardProps {
  title: string;
  company?: string;
  value?: string;
  date?: string;
  assignee?: string;
  tags?: string[];
  priority?: "high" | "medium" | "low";
  onClick?: () => void;
}

export function KanbanCard({ title, company, value, date, assignee, tags, priority, onClick }: KanbanCardProps) {
  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-warning text-warning-foreground",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="flex-1">{title}</h4>
          {priority && (
            <Badge variant="outline" className={priorityColors[priority]}>
              {priority}
            </Badge>
          )}
        </div>
        {company && <p className="text-muted-foreground mb-3">{company}</p>}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-muted-foreground">
          {value && (
            <div className="flex items-center gap-1">
              {(() => {
                const v = String(value).trim();
                const isPhone = !v.includes('$') && /^[+]?[\d\s-]{7,}$/.test(v);
                return isPhone ? <Phone className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />;
              })()}
              <span>{String(value).replace(/^\s*\$\s*/, '')}</span>
            </div>
          )}
          {date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
          )}
          {assignee && assignee !== 'PM' && (
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">{assignee}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
