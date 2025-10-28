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

export function AttendanceScreen() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [currentLocation, setCurrentLocation] = useState("Loading location...");
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

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    // In real app, would save to backend with location
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    // In real app, would save to backend with location
  };

  // Sample attendance data
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      date: "2025-10-20",
      checkIn: "08:45 AM",
      checkOut: "05:30 PM",
      checkInLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      checkOutLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      duration: "8h 45m",
      status: "present"
    },
    {
      id: 2,
      date: "2025-10-19",
      checkIn: "09:00 AM",
      checkOut: "05:15 PM",
      checkInLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      checkOutLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      duration: "8h 15m",
      status: "present"
    },
    {
      id: 3,
      date: "2025-10-18",
      checkIn: "08:50 AM",
      checkOut: "01:00 PM",
      checkInLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      checkOutLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      duration: "4h 10m",
      status: "half-day",
      notes: "Medical appointment"
    },
    {
      id: 4,
      date: "2025-10-17",
      checkIn: null,
      checkOut: null,
      checkInLocation: null,
      checkOutLocation: null,
      duration: null,
      status: "leave"
    },
    {
      id: 5,
      date: "2025-10-16",
      checkIn: "08:55 AM",
      checkOut: "05:45 PM",
      checkInLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      checkOutLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      duration: "8h 50m",
      status: "present"
    },
    {
      id: 6,
      date: "2025-10-15",
      checkIn: "09:15 AM",
      checkOut: null,
      checkInLocation: "-27.4698, 153.0251 (Brisbane CBD)",
      checkOutLocation: null,
      duration: null,
      status: "present",
      notes: "Missed check out"
    },
  ];

  const leaveBalances: LeaveBalance[] = [
    { type: "Annual Leave", total: 20, used: 8, remaining: 12 },
    { type: "Sick Leave", total: 10, used: 3, remaining: 7 },
    { type: "Personal Leave", total: 5, used: 1, remaining: 4 },
  ];

  const leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      type: "Annual Leave",
      startDate: "2025-11-15",
      endDate: "2025-11-19",
      duration: "5 days",
      reason: "Family vacation",
      status: "pending",
      appliedOn: "2025-10-20"
    },
    {
      id: 2,
      type: "Sick Leave",
      startDate: "2025-10-17",
      endDate: "2025-10-17",
      duration: "1 day",
      reason: "Flu",
      status: "approved",
      appliedOn: "2025-10-16"
    },
  ];

  const handleEditAttendance = (record: AttendanceRecord) => {
    setSelectedAttendance(record);
    setEditCheckIn(record.checkIn || "");
    setEditCheckOut(record.checkOut || "");
    setEditReason("");
    setShowEditDialog(true);
  };

  const submitEditAttendance = () => {
    // In real app, would save to backend
    console.log("Edit attendance:", {
      id: selectedAttendance?.id,
      checkIn: editCheckIn,
      checkOut: editCheckOut,
      reason: editReason
    });
    setShowEditDialog(false);
  };

  const submitLeaveRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // In real app, would save to backend
    console.log("Leave request:", Object.fromEntries(formData));
    setShowLeaveDialog(false);
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
    avgHours: "8h 30m"
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
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Check In
                </Button>
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
                        {(!record.checkIn || !record.checkOut) && record.status !== "leave" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAttendance(record);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
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
                  <div className="mt-1">
                    {selectedAttendanceRecord.status === "present" && (
                      <Badge className="bg-success text-success-foreground">Present</Badge>
                    )}
                    {selectedAttendanceRecord.status === "half-day" && (
                      <Badge className="bg-warning text-warning-foreground">Half Day</Badge>
                    )}
                    {selectedAttendanceRecord.status === "leave" && (
                      <Badge variant="outline">Leave</Badge>
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
              
              {selectedAttendanceRecord.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-lg">{selectedAttendanceRecord.notes}</p>
                </div>
              )}
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
