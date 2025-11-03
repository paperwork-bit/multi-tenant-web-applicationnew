import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Clock, 
  MapPin, 
  Calendar,
  CheckCircle2,
  LogIn,
  LogOut,
  Eye,
  Edit,
  AlertCircle,
  FileText,
  Plus,
  XCircle
} from "lucide-react";

interface AttendanceRecord {
  id: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  checkInLocation: string | null;
  checkOutLocation: string | null;
  duration: string | null;
  status: "present" | "absent" | "half-day" | "leave";
  notes?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  approvalComment?: string;
}

interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
}

export function AttendanceScreen({ userEmail, department }: { userEmail?: string; department?: string }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [currentLocation, setCurrentLocation] = useState("Loading location...");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("2025-10");
  const [editReason, setEditReason] = useState("");
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showLeaveBalanceDialog, setShowLeaveBalanceDialog] = useState(false);
  const [showLeaveRequestDialog, setShowLeaveRequestDialog] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null);
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState<AttendanceRecord | null>(null);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app, would reverse geocode to get address
          setCurrentLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          setCurrentLocation("Location unavailable");
        }
      );
    }
  }, []);

  // Hydrate attendance records from localStorage
  useEffect(() => {
    try {
      const key = `xtr_attendance_records_${(userEmail || 'guest').toLowerCase()}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as AttendanceRecord[];
        // Normalize legacy notes that embedded "Approval: <comment>"
        const normalized = parsed.map((r) => {
          if (r.approvalComment) return r;
          if (r.notes && r.notes.includes('Approval:')) {
            const idx = r.notes.lastIndexOf('Approval:');
            const base = r.notes.slice(0, idx).replace(/\|\s*$/,'').trim();
            const comment = r.notes.slice(idx + 'Approval:'.length).trim();
            return { ...r, notes: base || undefined, approvalComment: comment } as AttendanceRecord;
          }
          return r;
        });
        setAttendanceRecords(normalized);
        // If there's an open record for today without checkout, restore check-in state
        const todayKey = new Date().toISOString().slice(0, 10);
        const open = normalized.find(r => r.date === todayKey && r.checkIn && !r.checkOut);
        if (open && open.checkIn) {
          const [h, m] = open.checkIn.split(":");
          const restored = new Date();
          restored.setHours(Number(h), Number(m), 0, 0);
          setCheckInTime(restored);
          setIsCheckedIn(true);
        }
      }
    } catch {
      // ignore
    }
  }, [userEmail]);

  // Persist attendance records
  useEffect(() => {
    try {
      const key = `xtr_attendance_records_${(userEmail || 'guest').toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(attendanceRecords));
    } catch {
      // ignore
    }
  }, [attendanceRecords, userEmail]);

  // Update elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - checkInTime.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  // Utility: has completed attendance for today
  const hasCompletedToday = (() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const rec = attendanceRecords.find(r => r.date === todayKey);
    return Boolean(rec && rec.checkIn && rec.checkOut);
  })();

  const handleCheckIn = () => {
    // Prevent re-check-in if today is already completed
    if (hasCompletedToday) {
      return;
    }
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    // Save record for today (or update if exists)
    const dateKey = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
    setAttendanceRecords(prev => {
      const existingIndex = prev.findIndex(r => r.date === dateKey);
      const next: AttendanceRecord[] = [...prev];
      if (existingIndex >= 0) {
        next[existingIndex] = {
          ...next[existingIndex],
          checkIn: timeStr,
          checkOut: null,
          checkInLocation: currentLocation,
          status: "absent",
        };
      } else {
        next.unshift({
          id: Date.now(),
          date: dateKey,
          checkIn: timeStr,
          checkOut: null,
          checkInLocation: currentLocation,
          checkOutLocation: null,
          duration: null,
          status: "absent",
          notes: undefined,
        });
      }
      return next;
    });
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
    setAttendanceRecords(prev => {
      const idx = prev.findIndex(r => r.date === dateKey);
      if (idx === -1) return prev; // nothing to update
      const rec = prev[idx];
      // compute duration if checkIn exists
      let duration: string | null = rec.duration ?? null;
      if (rec.checkIn) {
        const [ciH, ciM] = rec.checkIn.split(":").map(Number);
        const start = new Date(now);
        start.setHours(ciH, ciM, 0, 0);
        const diff = now.getTime() - start.getTime();
        const hours = Math.max(0, Math.floor(diff / 3600000));
        const minutes = Math.max(0, Math.floor((diff % 3600000) / 60000));
        duration = `${hours}h ${minutes}m`;
      }
      // Determine status based on shift hours (8h threshold)
      const minutes = (() => {
        if (!duration) return 0;
        const m = duration.match(/(\d+)h\s+(\d+)m/);
        if (!m) return 0;
        return Number(m[1]) * 60 + Number(m[2]);
      })();
      const completedEightHours = minutes >= 8 * 60;

      const next = [...prev];
      next[idx] = {
        ...rec,
        checkOut: timeStr,
        checkOutLocation: currentLocation,
        duration,
        status: completedEightHours ? "present" : "absent",
      };
      return next;
    });
  };

  // Month selector default to current month
  useEffect(() => {
    const d = new Date();
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(ym);
  }, []);

  const leaveBalances: LeaveBalance[] = [];

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Load and keep leave requests for this user in sync
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('xtr_leave_approvals');
        const items = (raw ? JSON.parse(raw) : []) as any[];
        const filtered = items
          .filter(i => String(i.employeeName || '').toLowerCase() === (userEmail || 'user').toLowerCase())
          .map(i => ({
            id: i.id,
            type: i.leaveType,
            startDate: i.startDate,
            endDate: i.endDate,
            duration: i.days === 0.5 ? 'Half Day' : `${i.days} day${i.days === 1 ? '' : 's'}`,
            reason: i.reason,
            appliedOn: i.appliedOn,
            status: i.status as 'pending' | 'approved' | 'rejected',
          })) as LeaveRequest[];
        setLeaveRequests(filtered);
      } catch {
        setLeaveRequests([]);
      }
    };
    load();
    const onStorage = (e: StorageEvent) => { if (!e.key || e.key === 'xtr_leave_approvals') load(); };
    const onCustom = () => load();
    window.addEventListener('storage', onStorage);
    window.addEventListener('xtr-approvals-updated', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('xtr-approvals-updated', onCustom as EventListener);
    };
  }, [userEmail]);

  const handleEditAttendance = (record: AttendanceRecord) => {
    setSelectedAttendance(record);
    setEditCheckIn(record.checkIn || "");
    setEditCheckOut(record.checkOut || "");
    setEditReason("");
    setShowEditDialog(true);
  };

  const submitEditAttendance = () => {
    if (!selectedAttendance) {
      setShowEditDialog(false);
      return;
    }

    setAttendanceRecords((prev) => {
      const next = [...prev];
      const idx = next.findIndex((r) => r.id === selectedAttendance.id);
      if (idx === -1) return prev;

      // Compute duration if both times are provided
      let duration: string | null = null;
      if (editCheckIn && editCheckOut) {
        const [ciH, ciM] = editCheckIn.split(":").map(Number);
        const [coH, coM] = editCheckOut.split(":").map(Number);
        const start = new Date();
        start.setHours(ciH || 0, ciM || 0, 0, 0);
        const end = new Date();
        end.setHours(coH || 0, coM || 0, 0, 0);
        let diff = end.getTime() - start.getTime();
        if (diff < 0) diff = 0;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        duration = `${hours}h ${minutes}m`;
      }

      next[idx] = {
        ...next[idx],
        checkIn: editCheckIn || next[idx].checkIn,
        checkOut: editCheckOut || next[idx].checkOut,
        duration: duration ?? next[idx].duration,
        // Do not flip status yet; await approval
        approvalStatus: "pending",
        notes: editReason ? `Edit reason: ${editReason}` : next[idx].notes,
      };
      const updated = next[idx];
      // Enqueue approval request for operations
      try {
        const approvalsKey = "xtr_attendance_approvals";
        const raw = localStorage.getItem(approvalsKey);
        const approvals = raw ? JSON.parse(raw) : [];
        approvals.unshift({
          id: Date.now(),
          userKey: (userEmail || 'guest').toLowerCase(),
          userEmail: userEmail || 'guest',
          recordId: updated.id,
          date: updated.date,
          proposedCheckIn: updated.checkIn,
          proposedCheckOut: updated.checkOut,
          proposedDuration: updated.duration,
          reason: editReason,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem(approvalsKey, JSON.stringify(approvals));
        try { window.dispatchEvent(new Event('xtr-approvals-updated')); } catch {}
      } catch {}

      return next;
    });

    setShowEditDialog(false);
    try { alert('Attendance edit submitted for approval.'); } catch {}
  };

  const resolveApproval = (recordId: number, approve: boolean) => {
    setAttendanceRecords(prev => {
      const next = [...prev];
      const idx = next.findIndex(r => r.id === recordId);
      if (idx === -1) return prev;
      const rec = next[idx];

      // On approval, set status based on duration (8h threshold); on rejection, absent
      let status = rec.status;
      if (approve) {
        const minutesTotal = (() => {
          if (!rec.duration) return 0;
          const m = rec.duration.match(/(\d+)h\s+(\d+)m/);
          if (!m) return 0;
          return Number(m[1]) * 60 + Number(m[2]);
        })();
        status = minutesTotal >= 8 * 60 ? "present" : "absent";
      } else {
        status = "absent";
      }

      next[idx] = {
        ...rec,
        status,
        approvalStatus: approve ? "approved" : "rejected",
      };
      return next;
    });
  };

  const submitLeaveRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const leaveType = String(formData.get('leaveType') || '');
    const duration = String(formData.get('duration') || '');
    const startDate = String(formData.get('startDate') || '');
    const endDate = String(formData.get('endDate') || '');
    const reason = String(formData.get('reason') || '');

    const overrideDept = (() => {
      const em = String(userEmail || '').toLowerCase();
      if (em === 'ashely@xtechsrenewables.com.au') return 'On-Field';
      if (em === 'liam@xtechsrenewables.com.au') return 'On-Field';
      if (em === 'james@xtechsrenewables.com.au') return 'Sales';
      if (em === 'neil@xtechsrenewables.com.au') return 'Project Management';
      if (em === 'paperwork@xtechsrenewables.com.au') return 'Operations';
      return undefined;
    })();

    const payload = {
      id: Date.now(),
      employeeName: (userEmail || 'User'),
      department: overrideDept || department || 'General',
      leaveType,
      startDate,
      endDate,
      days: duration.includes('half') ? 0.5 : Number(duration.includes('full') ? 1 : (duration || '1').replace(/[^0-9.]/g, '')) || 1,
      reason,
      appliedOn: new Date().toISOString(),
      status: 'pending',
      reviewerComment: undefined as string | undefined,
    };

    try {
      const key = 'xtr_leave_approvals';
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : [];
      existing.unshift(payload);
      localStorage.setItem(key, JSON.stringify(existing));
      try { window.dispatchEvent(new Event('xtr-approvals-updated')); } catch {}
    } catch {}

    setShowLeaveDialog(false);
    try { alert('Leave request submitted for approval.'); } catch {}
  };

  const handleStatsClick = (statType: string) => {
    setShowStatsDialog(true);
  };

  const handleLeaveBalanceClick = (balance: LeaveBalance) => {
    setShowLeaveBalanceDialog(true);
  };

  const handleLeaveRequestClick = (request: LeaveRequest) => {
    setSelectedLeaveRequest(request);
    setShowLeaveRequestDialog(true);
  };

  const handleAttendanceRecordClick = (record: AttendanceRecord) => {
    setSelectedAttendanceRecord(record);
    setShowAttendanceDetails(true);
  };

  const stats = {
    totalDays: attendanceRecords.length,
    presentDays: attendanceRecords.filter(r => r.status === "present" || r.status === "half-day").length,
    leaveDays: attendanceRecords.filter(r => r.status === "leave").length,
    avgHours: (() => {
      const durations = attendanceRecords
        .map(r => r.duration)
        .filter(Boolean) as string[];
      if (!durations.length) return "0h 0m";
      const totalMin = durations.reduce((sum, d) => {
        const match = d.match(/(\d+)h\s+(\d+)m/);
        if (!match) return sum;
        return sum + Number(match[1]) * 60 + Number(match[2]);
      }, 0);
      const avg = Math.floor(totalMin / durations.length);
      return `${Math.floor(avg / 60)}h ${avg % 60}m`;
    })()
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Attendance</h1>
          <p className="text-muted-foreground">Track your daily attendance and manage leaves</p>
        </div>
      </div>

      {/* Check In/Out Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            {!isCheckedIn ? (
              <>
                <div className="text-center">
                  <h2 className="mb-2">Ready to start your day?</h2>
                  <p className="text-muted-foreground">Check in to begin tracking your time</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{currentLocation}</span>
                </div>
                <Button 
                  onClick={handleCheckIn}
                  size="lg"
                  className="bg-success hover:bg-success/90 text-success-foreground px-12"
                  disabled={hasCompletedToday}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Check In
                </Button>
                {hasCompletedToday && (
                  <p className="text-sm text-muted-foreground">You've already checked in and out today.</p>
                )}
              </>
            ) : (
              <>
                <div className="text-center">
                  <Badge className="bg-success text-success-foreground mb-3">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Checked In
                  </Badge>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Check in: {checkInTime?.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{currentLocation}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Elapsed Time</p>
                  <h1 className="text-primary">{elapsedTime}</h1>
                </div>
                <Button 
                  onClick={handleCheckOut}
                  size="lg"
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-12"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Check Out
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatsClick('total')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Days</p>
                <h3 className="mt-2">{stats.totalDays}</h3>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatsClick('present')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Present Days</p>
                <h3 className="mt-2">{stats.presentDays}</h3>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatsClick('leave')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Leave Days</p>
                <h3 className="mt-2">{stats.leaveDays}</h3>
              </div>
              <XCircle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatsClick('hours')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Avg Hours/Day</p>
                <h3 className="mt-2">{stats.avgHours}</h3>
              </div>
              <Clock className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance">
            <Calendar className="w-4 h-4 mr-2" />
            Attendance Records
          </TabsTrigger>
          <TabsTrigger value="leaves">
            <FileText className="w-4 h-4 mr-2" />
            Leave Management
          </TabsTrigger>
        </TabsList>

        {/* ATTENDANCE TAB */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance History</CardTitle>
                <div className="flex gap-3">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-10">October 2025</SelectItem>
                      <SelectItem value="2025-09">September 2025</SelectItem>
                      <SelectItem value="2025-08">August 2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowAttendanceDialog(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow 
                      key={record.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleAttendanceRecordClick(record)}
                    >
                      <TableCell>
                        {new Date(record.date).toLocaleDateString('en-AU', { 
                          weekday: 'short', 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </TableCell>
                      <TableCell>
                        {record.checkIn ? (
                          <div>
                            <p>{record.checkIn}</p>
                            {record.checkInLocation && (
                              <p className="text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{record.checkInLocation}</span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.checkOut ? (
                          <div>
                            <p>{record.checkOut}</p>
                            {record.checkOutLocation && (
                              <p className="text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{record.checkOutLocation}</span>
                              </p>
                            )}
                          </div>
                        ) : record.status === "leave" ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          <Badge variant="outline" className="border-warning text-warning">
                            Missed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{record.duration || "-"}</TableCell>
                      <TableCell>
                        {record.status === "present" && (
                          <Badge className="bg-success text-success-foreground">Present</Badge>
                        )}
                        {record.status === "absent" && (
                          <Badge className="bg-destructive text-destructive-foreground">Absent</Badge>
                        )}
                        {record.status === "half-day" && (
                          <Badge className="bg-warning text-warning-foreground">Half Day</Badge>
                        )}
                        {record.status === "leave" && (
                          <Badge variant="outline">Leave</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.notes ? (
                          <span className="text-muted-foreground">{record.notes}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {record.approvalStatus === "pending" && (
                          <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                        )}
                        {record.approvalStatus === "approved" && (
                          <Badge variant="outline" className="border-success text-success">Approved</Badge>
                        )}
                        {record.approvalStatus === "rejected" && (
                          <Badge variant="outline" className="border-destructive text-destructive">Rejected</Badge>
                        )}
                        {!record.approvalStatus && <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        {record.approvalComment ? (
                          <span className="text-muted-foreground">{record.approvalComment}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-start">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAttendanceRecordClick(record);
                            }}
                            aria-label="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {((!record.checkIn || !record.checkOut) || record.status === "absent") && record.status !== "leave" && !record.approvalStatus && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAttendance(record);
                              }}
                              aria-label="Edit record"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LEAVES TAB */}
        <TabsContent value="leaves" className="space-y-6">
          {/* Leave Balances */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leaveBalances.map((balance, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
                    onClick={() => handleLeaveBalanceClick(balance)}
                  >
                    <h4 className="mb-3">{balance.type}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Total</span>
                        <span>{balance.total} days</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Used</span>
                        <span>{balance.used} days</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span>Remaining</span>
                        <span className="text-primary">{balance.remaining} days</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Requests</CardTitle>
                <Button onClick={() => setShowLeaveDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Leave
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow 
                      key={request.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleLeaveRequestClick(request)}
                    >
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        {new Date(request.startDate).toLocaleDateString('en-AU', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(request.endDate).toLocaleDateString('en-AU', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell>{request.duration}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        {new Date(request.appliedOn).toLocaleDateString('en-AU', { 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                        )}
                        {request.status === "approved" && (
                          <Badge className="bg-success text-success-foreground">Approved</Badge>
                        )}
                        {request.status === "rejected" && (
                          <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attendance Calendar Dialog */}
      <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Attendance Calendar - {selectedMonth}</DialogTitle>
            <DialogDescription>Monthly attendance overview</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-7 gap-2">
            {/* Calendar Header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-medium p-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2025-10-${dayNum.toString().padStart(2, '0')}`;
              const record = attendanceRecords.find(r => r.date === dateStr);
              
              return (
                <div
                  key={i}
                  className={`aspect-square p-2 border rounded-lg flex flex-col items-center justify-center ${
                    record?.status === "present" 
                      ? "bg-success/10 border-success" 
                      : record?.status === "half-day"
                      ? "bg-warning/10 border-warning"
                      : record?.status === "leave"
                      ? "bg-muted border-muted"
                      : "border-border"
                  }`}
                >
                  <span className="text-sm">{dayNum}</span>
                  {record && (
                    <div className="w-2 h-2 rounded-full mt-1 ${
                      record.status === 'present' ? 'bg-success' : 
                      record.status === 'half-day' ? 'bg-warning' : 'bg-muted-foreground'
                    }"></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/10 border border-success"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning/10 border border-warning"></div>
              <span className="text-sm">Half Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted border border-muted"></div>
              <span className="text-sm">Leave</span>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAttendanceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Attendance Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
            <DialogDescription>
              Update missed check in/out for {selectedAttendance?.date && new Date(selectedAttendance.date).toLocaleDateString('en-AU')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 border-l-4 border-warning bg-warning/10 rounded">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p>You are editing attendance for a past date.</p>
                  <p className="text-muted-foreground mt-1">Please provide a valid reason for the missed entry.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Check In Time</Label>
              <Input
                type="time"
                value={editCheckIn}
                onChange={(e) => setEditCheckIn(e.target.value)}
                placeholder="HH:MM"
              />
            </div>

            <div className="space-y-2">
              <Label>Check Out Time</Label>
              <Input
                type="time"
                value={editCheckOut}
                onChange={(e) => setEditCheckOut(e.target.value)}
                placeholder="HH:MM"
              />
            </div>

            <div className="space-y-2">
              <Label>Reason for Edit *</Label>
              <Select value={editReason} onValueChange={setEditReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forgot-checkin">Forgot to check in</SelectItem>
                  <SelectItem value="forgot-checkout">Forgot to check out</SelectItem>
                  <SelectItem value="system-issue">System/Technical issue</SelectItem>
                  <SelectItem value="field-work">On field work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editReason === "other" && (
              <div className="space-y-2">
                <Label>Additional Details</Label>
                <Textarea placeholder="Provide details..." rows={3} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitEditAttendance} disabled={!editReason}>
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Leave Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>Submit a leave request for approval</DialogDescription>
          </DialogHeader>

          <form onSubmit={submitLeaveRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type *</Label>
              <Select name="leaveType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="unpaid">Leave Without Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Select name="duration" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-day">Full Day</SelectItem>
                  <SelectItem value="half-day-morning">Half Day (Morning)</SelectItem>
                  <SelectItem value="half-day-afternoon">Half Day (Afternoon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input type="date" name="startDate" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input type="date" name="endDate" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea 
                name="reason" 
                placeholder="Provide reason for leave..." 
                rows={3}
                required
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">Your leave request will be sent to your manager for approval.</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowLeaveDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats Details Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance Statistics Details</DialogTitle>
            <DialogDescription>Detailed breakdown of your attendance data</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Total Working Days</h4>
                <p className="text-2xl font-bold text-primary">{stats.totalDays}</p>
                <p className="text-sm text-muted-foreground">Days tracked this month</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Present Days</h4>
                <p className="text-2xl font-bold text-success">{stats.presentDays}</p>
                <p className="text-sm text-muted-foreground">Days you were present</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Leave Days</h4>
                <p className="text-2xl font-bold text-warning">{stats.leaveDays}</p>
                <p className="text-sm text-muted-foreground">Days on leave</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Average Hours</h4>
                <p className="text-2xl font-bold text-secondary">{stats.avgHours}</p>
                <p className="text-sm text-muted-foreground">Per working day</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Attendance Rate</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(stats.presentDays / stats.totalDays) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {Math.round((stats.presentDays / stats.totalDays) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowStatsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Balance Details Dialog */}
      <Dialog open={showLeaveBalanceDialog} onOpenChange={setShowLeaveBalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Balance Details</DialogTitle>
            <DialogDescription>Detailed breakdown of your leave balances</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {leaveBalances.map((balance, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">{balance.type}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Allocated</span>
                    <span className="font-medium">{balance.total} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used</span>
                    <span className="font-medium text-warning">{balance.used} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining</span>
                    <span className="font-medium text-primary">{balance.remaining} days</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(balance.used / balance.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((balance.used / balance.total) * 100)}% used
                  </p>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowLeaveBalanceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Request Details Dialog */}
      <Dialog open={showLeaveRequestDialog} onOpenChange={setShowLeaveRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>Detailed information about your leave request</DialogDescription>
          </DialogHeader>
          
          {selectedLeaveRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Leave Type</Label>
                  <p className="text-lg">{selectedLeaveRequest.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {selectedLeaveRequest.status === "pending" && (
                      <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                    )}
                    {selectedLeaveRequest.status === "approved" && (
                      <Badge className="bg-success text-success-foreground">Approved</Badge>
                    )}
                    {selectedLeaveRequest.status === "rejected" && (
                      <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-lg">
                    {new Date(selectedLeaveRequest.startDate).toLocaleDateString('en-AU', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-lg">
                    {new Date(selectedLeaveRequest.endDate).toLocaleDateString('en-AU', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <p className="text-lg">{selectedLeaveRequest.duration}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Reason</Label>
                <p className="text-lg">{selectedLeaveRequest.reason}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Applied On</Label>
                <p className="text-lg">
                  {new Date(selectedLeaveRequest.appliedOn).toLocaleDateString('en-AU', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowLeaveRequestDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance Record Details Dialog */}
      <Dialog open={showAttendanceDetails} onOpenChange={setShowAttendanceDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance Record Details</DialogTitle>
            <DialogDescription>Detailed information about this attendance record</DialogDescription>
          </DialogHeader>
          
              {selectedAttendanceRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-lg">
                    {new Date(selectedAttendanceRecord.date).toLocaleDateString('en-AU', { 
                      weekday: 'long',
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1 flex items-center gap-2">
                    {selectedAttendanceRecord.status === "present" && (
                      <Badge className="bg-success text-success-foreground">Present</Badge>
                    )}
                    {selectedAttendanceRecord.status === "half-day" && (
                      <Badge className="bg-warning text-warning-foreground">Half Day</Badge>
                    )}
                    {selectedAttendanceRecord.status === "leave" && (
                      <Badge variant="outline">Leave</Badge>
                    )}
                    {selectedAttendanceRecord.status === "absent" && (
                      <Badge className="bg-destructive text-destructive-foreground">Absent</Badge>
                    )}
                    {selectedAttendanceRecord.approvalStatus === "approved" && (
                      <Badge variant="outline" className="border-success text-success">Approved</Badge>
                    )}
                    {selectedAttendanceRecord.approvalStatus === "rejected" && (
                      <Badge variant="outline" className="border-destructive text-destructive">Rejected</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Check In</Label>
                  <p className="text-lg">{selectedAttendanceRecord.checkIn || "Not recorded"}</p>
                  {selectedAttendanceRecord.checkInLocation && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedAttendanceRecord.checkInLocation}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Check Out</Label>
                  <p className="text-lg">{selectedAttendanceRecord.checkOut || "Not recorded"}</p>
                  {selectedAttendanceRecord.checkOutLocation && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedAttendanceRecord.checkOutLocation}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Duration</Label>
                <p className="text-lg">{selectedAttendanceRecord.duration || "Not calculated"}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-lg">{selectedAttendanceRecord.notes || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Approval</Label>
                  <p className="text-lg">
                    {selectedAttendanceRecord.approvalStatus ? selectedAttendanceRecord.approvalStatus.charAt(0).toUpperCase() + selectedAttendanceRecord.approvalStatus.slice(1) : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Comments</Label>
                  <p className="text-lg">{selectedAttendanceRecord.approvalComment || "-"}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowAttendanceDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
