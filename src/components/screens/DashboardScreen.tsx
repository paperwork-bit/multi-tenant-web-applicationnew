import React, { useState } from "react";
import { KPICard } from "../KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Users, Wrench, FileCheck, DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle, Calendar as CalendarIcon, Plus, X, Download, Upload, Eye, Edit, Trash2, Phone, Mail, MapPin, Star, Filter, Search, MoreHorizontal, Settings, Bell, BellOff, Heart, Share, Bookmark, Flag, MessageSquare, Send, Copy, ExternalLink, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, PlusCircle, MinusCircle, RefreshCw, Save, FileText, Image, Video, Music, File, Folder, FolderOpen, Archive, Trash, Lock, Unlock, Key, UserCheck, UserX, UserPlus, UserMinus, ThumbsUp, ThumbsDown, BookmarkCheck, Tag, Tags, Hash, AtSign, Percent, Plus as PlusIcon, Minus, Divide, X as XIcon, Equal, NotEqual, GreaterThan, LessThan, GreaterThanOrEqual, LessThanOrEqual, Infinity, Pi, Sigma, Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Eta, Theta, Iota, Kappa, Lambda, Mu, Nu, Xi, Omicron, Rho, Tau, Upsilon, Phi, Chi, Psi, Omega, CheckSquare } from "lucide-react";

interface DashboardScreenProps {
  retailerTeam?: "sales" | "on-field" | "project-management" | "operations";
}

export function DashboardScreen({ retailerTeam }: DashboardScreenProps) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showActiveLeadsModal, setShowActiveLeadsModal] = useState(false);
  const [showScheduledInstallsModal, setShowScheduledInstallsModal] = useState(false);
  const [showRebatesModal, setShowRebatesModal] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAllTasksModal, setShowAllTasksModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    title: "",
    client: "",
    type: "",
    date: "",
    time: "",
    duration: "",
    notes: ""
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    customerName: "",
    assignedTo: "",
    projectValue: "",
    projectId: "",
    status: "pending",
    notes: ""
  });

  const activities = [];

  const tasks = [];

  const appointments = [];

  const handleKpiClick = (title: string) => {
    console.log(`Clicked on ${title}`);
    // Add specific functionality for each KPI
    switch(title) {
      case "Active Leads":
        setShowActiveLeadsModal(true);
        break;
      case "Scheduled Installs":
        setShowScheduledInstallsModal(true);
        break;
      case "Rebates in Progress":
        setShowRebatesModal(true);
        break;
      case "AR Outstanding":
        setShowARModal(true);
        break;
    }
  };

  const handleActivityClick = (activity: any) => {
    console.log("Activity clicked:", activity);
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const handleTaskClick = (task: any) => {
    console.log("Task clicked:", task);
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleViewAllTasks = () => {
    setShowAllTasksModal(true);
  };

  const handleScheduleClick = () => {
    setShowCalendarModal(true);
  };

  const handleNewAppointment = () => {
    setShowNewAppointmentModal(true);
  };

  const handleExportCalendar = () => {
    // Create CSV content
    const csvContent = [
      ["Title", "Client", "Type", "Date", "Time"],
      ...appointments.map(apt => [apt.title, apt.client, apt.type, apt.date, apt.time])
    ].map(row => row.join(",")).join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calendar-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New appointment:", appointmentForm);
    alert("Appointment created successfully!");
    setShowNewAppointmentModal(false);
    setAppointmentForm({
      title: "",
      client: "",
      type: "",
      date: "",
      time: "",
      duration: "",
      notes: ""
    });
  };

  const handleMarkAllComplete = () => {
    console.log("Marking all tasks as complete");
    alert("All tasks have been marked as complete!");
  };

  const handleAddNewTask = () => {
    console.log("Opening add new task form");
    setIsEditingTask(false);
    setTaskForm({
      title: "",
      description: "",
      priority: "",
      dueDate: "",
      customerName: "",
      assignedTo: "",
      projectValue: "",
      projectId: "",
      status: "pending",
      notes: ""
    });
    setShowNewTaskModal(true);
  };

  const handleExportTasks = () => {
    // Create CSV content for tasks
    const csvContent = [
      ["Title", "Priority", "Due Date", "Customer", "Assigned To", "Value"],
      ...tasks.map(task => [
        task.title,
        task.priority,
        task.due,
        task.details?.customerName || "",
        task.details?.assignedTo || "",
        task.details?.projectValue || ""
      ])
    ].map(row => row.join(",")).join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log("Tasks exported successfully");
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New task:", taskForm);
    alert("Task created successfully!");
    setShowNewTaskModal(false);
    setTaskForm({
      title: "",
      description: "",
      priority: "",
      dueDate: "",
      customerName: "",
      assignedTo: "",
      projectValue: "",
      projectId: "",
      status: "pending",
      notes: ""
    });
  };

  const handleMarkTaskComplete = (taskId: number) => {
    console.log(`Marking task ${taskId} as complete`);
    alert(`Task ${taskId} has been marked as complete!`);
    setShowTaskModal(false);
  };

  const handleEditTask = (task: any) => {
    console.log("Editing task:", task);
    setIsEditingTask(true);
    // Pre-populate the task form with existing data
    setTaskForm({
      title: task.title,
      description: task.details?.description || "",
      priority: task.priority,
      dueDate: task.details?.dueDate || "",
      customerName: task.details?.customerName || "",
      assignedTo: task.details?.assignedTo || "",
      projectValue: task.details?.projectValue || "",
      projectId: task.details?.projectId || "",
      status: task.details?.status || "pending",
      notes: task.details?.notes || ""
    });
    setShowTaskModal(false);
    setShowNewTaskModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${
        retailerTeam === "sales" || retailerTeam === "on-field" ? "lg:grid-cols-2" : "lg:grid-cols-4"
      } gap-6`}>
        <div onClick={() => handleKpiClick("Active Leads")} className="cursor-pointer">
        <KPICard
          title="Active Leads"
          value="24"
          change="+12% from last month"
          icon={Users}
          trend="up"
        />
        </div>
        <div onClick={() => handleKpiClick("Scheduled Installs")} className="cursor-pointer">
        <KPICard
          title="Scheduled Installs"
          value="8"
          change="3 this week"
          icon={Wrench}
          trend="neutral"
        />
        </div>
        {/* Only show Rebates and AR Outstanding to Project Management and Operations teams */}
        {retailerTeam !== "sales" && retailerTeam !== "on-field" && (
          <>
            <div onClick={() => handleKpiClick("Rebates in Progress")} className="cursor-pointer">
            <KPICard
              title="Rebates in Progress"
              value="15"
              change="$87,500 total"
              icon={FileCheck}
              trend="neutral"
            />
            </div>
            <div onClick={() => handleKpiClick("AR Outstanding")} className="cursor-pointer">
            <KPICard
              title="AR Outstanding"
              value="$52,340"
              change="-8% from last month"
              icon={DollarSign}
              trend="up"
            />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 pb-4 border-b last:border-0 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className={`p-2 rounded-lg ${
                    activity.status === "completed" || activity.status === "success" || activity.status === "approved"
                      ? "bg-success/10"
                      : activity.status === "new"
                      ? "bg-primary/10"
                      : "bg-warning/10"
                  }`}>
                    {activity.status === "completed" || activity.status === "success" || activity.status === "approved" ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : activity.status === "new" ? (
                      <TrendingUp className="w-5 h-5 text-primary" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleTaskClick(task)}
                  >
                    <input type="checkbox" className="mt-1 rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-muted-foreground">{task.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={handleViewAllTasks}>
                View All Tasks
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <h4>This Week</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Monday</span>
                      <span className="text-foreground font-medium">3 appointments</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Tuesday</span>
                      <span className="text-foreground font-medium">5 appointments</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Wednesday</span>
                      <span className="text-foreground font-medium">2 appointments</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Thursday</span>
                      <span className="text-foreground font-medium">4 appointments</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Friday</span>
                      <span className="text-foreground font-medium">3 appointments</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleScheduleClick}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                  View Full Calendar
                </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleNewAppointment}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Appointment
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleExportCalendar}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Calendar Modal */}
      <Dialog open={showCalendarModal} onOpenChange={setShowCalendarModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Full Calendar View</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleNewAppointment}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Appointment
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCalendar}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Calendar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowCalendarModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Custom Calendar */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">October 2025</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="text-center text-sm font-medium text-muted-foreground py-2">Sun</div>
                <div className="text-center text-sm font-medium text-muted-foreground py-2">Mon</div>
                <div className="text-center text-sm font-medium text-muted-foreground py-2">Tue</div>
                <div className="text-center text-sm font-medium text-muted-foreground py-2">Wed</div>
                <div className="text-center text-sm font-medium text-muted-foreground py-2">Thu</div>
                <div className="text-center text-sm font-medium text-muted-foreground py-2">Fri</div>
                <div className="text-center text-sm font-medium text-muted-foreground py-2">Sat</div>
              </div>
              
              {/* Calendar dates */}
              <div className="grid grid-cols-7 gap-2">
                {/* Previous month dates */}
                <div className="text-center py-3 text-sm text-muted-foreground">28</div>
                <div className="text-center py-3 text-sm text-muted-foreground">29</div>
                <div className="text-center py-3 text-sm text-muted-foreground">30</div>
                <div className="text-center py-3 text-sm text-muted-foreground">1</div>
                <div className="text-center py-3 text-sm text-muted-foreground">2</div>
                <div className="text-center py-3 text-sm text-muted-foreground">3</div>
                <div className="text-center py-3 text-sm text-muted-foreground">4</div>
                
                {/* Week 1 */}
                <div className="text-center py-3 text-sm">5</div>
                <div className="text-center py-3 text-sm">6</div>
                <div className="text-center py-3 text-sm">7</div>
                <div className="text-center py-3 text-sm">8</div>
                <div className="text-center py-3 text-sm">9</div>
                <div className="text-center py-3 text-sm">10</div>
                <div className="text-center py-3 text-sm">11</div>
                
                {/* Week 2 */}
                <div className="text-center py-3 text-sm">12</div>
                <div className="text-center py-3 text-sm">13</div>
                <div className="text-center py-3 text-sm">14</div>
                <div className="text-center py-3 text-sm">15</div>
                <div className="text-center py-3 text-sm">16</div>
                <div className="text-center py-3 text-sm">17</div>
                <div className="text-center py-3 text-sm">18</div>
                
                {/* Week 3 */}
                <div className="text-center py-3 text-sm">19</div>
                <div className="text-center py-3 text-sm">20</div>
                <div className="text-center py-3 text-sm">21</div>
                <div className="text-center py-3 text-sm">22</div>
                <div className="text-center py-3 text-sm">23</div>
                <div className="text-center py-3 text-sm">24</div>
                <div className="text-center py-3 text-sm">25</div>
                
                {/* Week 4 */}
                <div className="text-center py-3 text-sm">26</div>
                <div className="text-center py-3 text-sm bg-primary text-primary-foreground rounded-full">27</div>
                <div className="text-center py-3 text-sm">28</div>
                <div className="text-center py-3 text-sm">29</div>
                <div className="text-center py-3 text-sm">30</div>
                <div className="text-center py-3 text-sm">31</div>
                <div className="text-center py-3 text-sm text-muted-foreground">1</div>
              </div>
            </div>
            
            {/* Appointments for selected date */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Appointments for October 27, 2025
              </h3>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        <p className="text-muted-foreground">{appointment.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.time}</p>
                        <Badge variant="outline">{appointment.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Appointment Modal */}
      <Dialog open={showNewAppointmentModal} onOpenChange={setShowNewAppointmentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Add New Appointment</span>
              <Button variant="ghost" size="sm" onClick={() => setShowNewAppointmentModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAppointmentSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={appointmentForm.title}
                  onChange={(e) => setAppointmentForm({...appointmentForm, title: e.target.value})}
                  placeholder="Enter appointment title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={appointmentForm.client}
                  onChange={(e) => setAppointmentForm({...appointmentForm, client: e.target.value})}
                  placeholder="Enter client name"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={appointmentForm.type} onValueChange={(value) => setAppointmentForm({...appointmentForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site-visit">Site Visit</SelectItem>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={appointmentForm.duration}
                  onChange={(e) => setAppointmentForm({...appointmentForm, duration: e.target.value})}
                  placeholder="60"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                placeholder="Enter any additional notes..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Create Appointment
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewAppointmentModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Active Leads Modal */}
      <Dialog open={showActiveLeadsModal} onOpenChange={setShowActiveLeadsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Active Leads Overview</span>
              <Button variant="ghost" size="sm" onClick={() => setShowActiveLeadsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total Active Leads</h3>
                <p className="text-3xl font-bold text-blue-600">24</p>
                <p className="text-sm text-blue-700">+12% from last month</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Hot Leads</h3>
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-sm text-green-700">High priority prospects</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Follow-ups Due</h3>
                <p className="text-3xl font-bold text-orange-600">5</p>
                <p className="text-sm text-orange-700">Today</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Lead Activity</h3>
              <div className="space-y-3">
                {activities.filter(a => a.type === "lead").map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="outline">New</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => setShowActiveLeadsModal(false)}>
                <Users className="w-4 h-4 mr-2" />
                View All Leads
              </Button>
              <Button variant="outline" onClick={() => setShowActiveLeadsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scheduled Installs Modal */}
      <Dialog open={showScheduledInstallsModal} onOpenChange={setShowScheduledInstallsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Scheduled Installs Overview</span>
              <Button variant="ghost" size="sm" onClick={() => setShowScheduledInstallsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total Scheduled</h3>
                <p className="text-3xl font-bold text-blue-600">8</p>
                <p className="text-sm text-blue-700">This week</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Completed Today</h3>
                <p className="text-3xl font-bold text-green-600">3</p>
                <p className="text-sm text-green-700">On schedule</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Pending</h3>
                <p className="text-3xl font-bold text-orange-600">5</p>
                <p className="text-sm text-orange-700">This week</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Installations</h3>
              <div className="space-y-3">
                {appointments.filter(a => a.type === "Installation").map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.client}</p>
                        <p className="text-sm text-muted-foreground">{appointment.date} at {appointment.time}</p>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => setShowScheduledInstallsModal(false)}>
                <Wrench className="w-4 h-4 mr-2" />
                View Installation Schedule
              </Button>
              <Button variant="outline" onClick={() => setShowScheduledInstallsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rebates Modal */}
      <Dialog open={showRebatesModal} onOpenChange={setShowRebatesModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Rebates in Progress</span>
              <Button variant="ghost" size="sm" onClick={() => setShowRebatesModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total in Progress</h3>
                <p className="text-3xl font-bold text-blue-600">15</p>
                <p className="text-sm text-blue-700">$87,500 total value</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Approved</h3>
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-sm text-green-700">This month</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Pending Review</h3>
                <p className="text-3xl font-bold text-orange-600">7</p>
                <p className="text-sm text-orange-700">Awaiting approval</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Rebate Activity</h3>
              <div className="space-y-3">
                {activities.filter(a => a.type === "rebate").map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                        <p className="text-sm text-muted-foreground">Project: {activity.details?.projectId}</p>
                      </div>
                      <Badge variant="outline">Approved</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => setShowRebatesModal(false)}>
                <FileCheck className="w-4 h-4 mr-2" />
                View All Rebates
              </Button>
              <Button variant="outline" onClick={() => setShowRebatesModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AR Outstanding Modal */}
      <Dialog open={showARModal} onOpenChange={setShowARModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Accounts Receivable Outstanding</span>
              <Button variant="ghost" size="sm" onClick={() => setShowARModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total Outstanding</h3>
                <p className="text-3xl font-bold text-blue-600">$52,340</p>
                <p className="text-sm text-blue-700">-8% from last month</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Overdue</h3>
                <p className="text-3xl font-bold text-green-600">$12,500</p>
                <p className="text-sm text-green-700">3 invoices</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Due This Week</h3>
                <p className="text-3xl font-bold text-orange-600">$8,200</p>
                <p className="text-sm text-orange-700">5 invoices</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Payment Activity</h3>
              <div className="space-y-3">
                {activities.filter(a => a.type === "payment").map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                        <p className="text-sm text-muted-foreground">Project: {activity.details?.projectId}</p>
                      </div>
                      <Badge variant="outline">Received</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => setShowARModal(false)}>
                <DollarSign className="w-4 h-4 mr-2" />
                View All Invoices
              </Button>
              <Button variant="outline" onClick={() => setShowARModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Detail Modal */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Activity Details</span>
              <Button variant="ghost" size="sm" onClick={() => setShowActivityModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{selectedActivity.title}</h3>
                <p className="text-muted-foreground">{selectedActivity.time}</p>
                
                {selectedActivity.details && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedActivity.details).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <p className="text-sm">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button onClick={() => setShowActivityModal(false)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
                <Button variant="outline" onClick={() => setShowActivityModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Detail Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Task Details</span>
              <Button variant="ghost" size="sm" onClick={() => setShowTaskModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedTask.priority === "high" ? "destructive" : selectedTask.priority === "medium" ? "default" : "secondary"}>
                    {selectedTask.priority}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Due: {selectedTask.due}</span>
                </div>
                
                {selectedTask.details && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedTask.details).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <p className="text-sm">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button onClick={() => selectedTask && handleMarkTaskComplete(selectedTask.id)}>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
                <Button variant="outline" onClick={() => selectedTask && handleEditTask(selectedTask)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
                <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View All Tasks Modal */}
      <Dialog open={showAllTasksModal} onOpenChange={setShowAllTasksModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>All Tasks</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleAddNewTask}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAllTasksModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900">High Priority</h3>
                <p className="text-3xl font-bold text-red-600">{tasks.filter(t => t.priority === "high").length}</p>
                <p className="text-sm text-red-700">Urgent tasks</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Medium Priority</h3>
                <p className="text-3xl font-bold text-blue-600">{tasks.filter(t => t.priority === "medium").length}</p>
                <p className="text-sm text-blue-700">Important tasks</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Low Priority</h3>
                <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.priority === "low").length}</p>
                <p className="text-sm text-green-700">Normal tasks</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Due Today</h3>
                <p className="text-3xl font-bold text-orange-600">{tasks.filter(t => t.due === "Today").length}</p>
                <p className="text-sm text-orange-700">Deadline today</p>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">All Tasks</h3>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowTaskModal(true);
                      setShowAllTasksModal(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox 
                          checked={false} 
                          onCheckedChange={(checked) => {
                            // Handle task completion
                            console.log(`Task ${task.id} ${checked ? 'completed' : 'uncompleted'}`);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                            >
                              {task.priority}
                            </Badge>
                            <span className="text-sm text-muted-foreground">Due: {task.due}</span>
                          </div>
                          {task.details && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p><strong>Customer:</strong> {task.details.customerName}</p>
                              <p><strong>Assigned to:</strong> {task.details.assignedTo}</p>
                              {task.details.projectValue && <p><strong>Value:</strong> {task.details.projectValue}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                            setShowTaskModal(true);
                            setShowAllTasksModal(false);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Tasks */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Tasks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Follow up with Brown Industries - Commercial proposal</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default">high</Badge>
                    <span className="text-sm text-muted-foreground">Due: Tomorrow</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Large commercial project worth $120,000</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Prepare site visit report for Martinez Property</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">low</Badge>
                    <span className="text-sm text-muted-foreground">Due: This week</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Site visit completed, report pending</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Update project timeline for Anderson Home</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default">medium</Badge>
                    <span className="text-sm text-muted-foreground">Due: Tomorrow</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Installation delayed due to weather</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Review and approve Wilson Property contract</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="destructive">high</Badge>
                    <span className="text-sm text-muted-foreground">Due: Today</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Contract ready for final review</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleMarkAllComplete}>
                <CheckSquare className="w-4 h-4 mr-2" />
                Mark All Complete
              </Button>
              <Button variant="outline" onClick={handleAddNewTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Task
              </Button>
              <Button variant="outline" onClick={handleExportTasks}>
                <Download className="w-4 h-4 mr-2" />
                Export Tasks
              </Button>
              <Button variant="outline" onClick={() => setShowAllTasksModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Task Modal */}
      <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{isEditingTask ? "Edit Task" : "Add New Task"}</span>
              <Button variant="ghost" size="sm" onClick={() => setShowNewTaskModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleTaskSubmit} className="space-y-6">
            {/* Basic Task Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Task Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Task Title *</Label>
                  <Input
                    id="taskTitle"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskPriority">Priority *</Label>
                  <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({...taskForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taskDescription">Description</Label>
                <Textarea
                  id="taskDescription"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  placeholder="Enter task description"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Customer & Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer & Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={taskForm.customerName}
                    onChange={(e) => setTaskForm({...taskForm, customerName: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectId">Project ID</Label>
                  <Input
                    id="projectId"
                    value={taskForm.projectId}
                    onChange={(e) => setTaskForm({...taskForm, projectId: e.target.value})}
                    placeholder="Enter project ID"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectValue">Project Value</Label>
                  <Input
                    id="projectValue"
                    value={taskForm.projectValue}
                    onChange={(e) => setTaskForm({...taskForm, projectValue: e.target.value})}
                    placeholder="Enter project value"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select value={taskForm.assignedTo} onValueChange={(value) => setTaskForm({...taskForm, assignedTo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="bob-wilson">Bob Wilson</SelectItem>
                      <SelectItem value="lisa-anderson">Lisa Anderson</SelectItem>
                      <SelectItem value="david-brown">David Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Due Date & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskStatus">Status</Label>
                  <Select value={taskForm.status} onValueChange={(value) => setTaskForm({...taskForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="taskNotes">Notes</Label>
                <Textarea
                  id="taskNotes"
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({...taskForm, notes: e.target.value})}
                  placeholder="Enter any additional notes or special instructions"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                {isEditingTask ? "Update Task" : "Create Task"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewTaskModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
