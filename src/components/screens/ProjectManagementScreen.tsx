import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { KanbanCard } from "../KanbanCard";
import { Calendar as CalendarIcon, Users, Clock, ChevronLeft, ChevronRight, Plus, CheckCircle, AlertCircle, DollarSign, BarChart3, Edit, Trash2, Eye, Download, Upload, X, MessageSquare, Phone, MapPin } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export function ProjectManagementScreen() {
  // Test if component renders
  console.log("ProjectManagementScreen is rendering");
  
  // State management
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [currentMonth, setCurrentMonth] = useState("October 2025");
  const [currentWeek, setCurrentWeek] = useState("Week of Oct 14, 2025");
  const [calendarViewType, setCalendarViewType] = useState("weekly"); // "weekly" or "monthly"
  const [showScheduleDetails, setShowScheduleDetails] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState(null);
  const [showEditSchedule, setShowEditSchedule] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState(null);
  const [showEditMember, setShowEditMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedSystemType, setSelectedSystemType] = useState("");
  const [otherSelections, setOtherSelections] = useState({});
  const [editingProject, setEditingProject] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [userEmail] = useState("project.manager@xtechs.com"); // This would come from auth context
  const [columns, setColumns] = useState(null); // Will be initialized from kanbanColumns
  const [newProject, setNewProject] = useState({
    title: "",
    assignee: "",
    assignees: [],
    startDate: "",
    endDate: "",
    priority: "",
    clientType: "",
    clientName: "",
    jobType: "",
    inspectionDate: "",
    inspectionTime: "",
    inspectionBooked: false,
    stage1Date: "",
    stage1Time: "",
    stage1Booked: false,
    stage2Date: "",
    stage2Time: "",
    stage2Booked: false,
    fullSystemDate: "",
    fullSystemTime: "",
    fullSystemBooked: false,
    systemSize: "",
    projectType: "",
    value: "",
    description: "",
    // Customer Information
    customerName: "",
    customerEmail: "",
    customerContact: "",
    customerAddress: "",
    location: "",
    // Property Information
    houseStorey: "",
    roofType: "",
    propertyType: "",
    accessTo2ndStorey: "",
    accessToInverter: "",
    monitoring: "",
    // System Information
    inverterSize: "",
    batterySize: "",
    panelBrand: "",
    inverterBrand: "",
    batteryBrand: "",
    evChargerBrand: ""
  });

  const projects = [
    { id: 1, name: "Smith Residence", start: "Oct 20", end: "Oct 22", assignee: "Team A", status: "scheduled" },
    { id: 2, name: "Brown Warehouse", start: "Oct 23", end: "Oct 27", assignee: "Team B", status: "in-progress" },
    { id: 3, name: "Davis Home", start: "Oct 28", end: "Oct 30", assignee: "Team A", status: "scheduled" },
  ];

  // On-field site visit data (from completed assessments ready for project creation)
  const onFieldSiteVisits = [
    {
      id: "OF-001",
      customerName: "John Smith",
      propertyAddress: "123 Solar Street, Brisbane QLD 4000",
      technician: "Alex Thompson",
      visitDate: "2024-01-16",
      status: "completed",
      installationType: "Solar Panels + Inverter",
      systemSize: "6.6kW",
      roofAssessment: "Excellent",
      electricalAssessment: "Good",
      safetyScore: 95,
      installationReadiness: "Ready",
      estimatedDuration: "6-8 hours",
      specialRequirements: "Crane access required",
      notes: "Site ready for installation, all permits obtained",
      customerEmail: "john.smith@email.com",
      customerContact: "+61 400 555 001",
      value: "$12,500"
    },
    {
      id: "OF-002",
      customerName: "Sarah Wilson",
      propertyAddress: "456 Green Avenue, Sydney NSW 2000",
      technician: "Mike Chen",
      visitDate: "2024-01-18",
      status: "completed",
      installationType: "Solar + Battery",
      systemSize: "8.5kW",
      roofAssessment: "Good",
      electricalAssessment: "Excellent",
      safetyScore: 92,
      installationReadiness: "Ready",
      estimatedDuration: "8-10 hours",
      specialRequirements: "Battery installation space prepared",
      notes: "Customer ready for installation, battery location confirmed",
      customerEmail: "sarah.wilson@email.com",
      customerContact: "+61 400 555 002",
      value: "$18,900"
    },
    {
      id: "OF-003",
      customerName: "David Brown",
      propertyAddress: "789 Sunshine Road, Melbourne VIC 3001",
      technician: "Lisa Anderson",
      visitDate: "2024-01-20",
      status: "completed",
      installationType: "Commercial Solar",
      systemSize: "25kW",
      roofAssessment: "Excellent",
      electricalAssessment: "Good",
      safetyScore: 98,
      installationReadiness: "Ready",
      estimatedDuration: "12-16 hours",
      specialRequirements: "Commercial grade equipment, multiple inverters",
      notes: "Large commercial installation, all safety protocols reviewed",
      customerEmail: "david.brown@brownbusiness.com",
      customerContact: "+61 400 555 003",
      value: "$45,000"
    }
  ];

  // Kanban columns with projects
  const kanbanColumns = [
    {
      id: "new",
      title: "New",
      color: "border-gray-300",
      projects: [
        // Projects from on-field site visits (ready for installation)
        ...onFieldSiteVisits.filter(visit => visit.installationReadiness === "Ready").map((visit, index) => ({
          id: 100 + index, // Unique IDs starting from 100
          title: visit.customerName + " - " + visit.installationType,
          assignee: visit.technician.split(' ').map(n => n[0]).join(''), // Initials
          assignees: [visit.technician, "Installation Team"],
          date: `Estimated: ${visit.estimatedDuration}`,
          tags: [visit.systemSize, visit.installationType.includes('Commercial') ? 'Commercial' : 'Residential'],
          priority: visit.safetyScore >= 95 ? "high" : visit.safetyScore >= 90 ? "medium" : "low" as const,
          value: visit.value,
          status: "new",
          customerName: visit.customerName,
          customerEmail: visit.customerEmail,
          customerContact: visit.customerContact,
          customerAddress: visit.propertyAddress,
          systemType: visit.installationType.toLowerCase().includes('battery') ? "pv-battery" : 
                      visit.installationType.toLowerCase().includes('commercial') ? "pv-only" : "pv-only",
          systemSize: visit.systemSize.replace('kW', ''),
          // Additional on-field specific data
          roofAssessment: visit.roofAssessment,
          electricalAssessment: visit.electricalAssessment,
          safetyScore: visit.safetyScore,
          installationReadiness: visit.installationReadiness,
          estimatedDuration: visit.estimatedDuration,
          specialRequirements: visit.specialRequirements,
          technicianNotes: visit.notes,
          technician: visit.technician,
          onFieldVisitId: visit.id,
          comments: [
            {
              id: `of-${visit.id}-1`,
              text: `On-field assessment completed. ${visit.notes}`,
              author: visit.technician,
              email: `${visit.technician.toLowerCase().replace(' ', '.')}@xtechs.com`,
              timestamp: new Date(visit.visitDate).toLocaleDateString() + " 2:30 PM"
            },
            {
              id: `of-${visit.id}-2`,
              text: `Safety score: ${visit.safetyScore}%. Roof condition: ${visit.roofAssessment}. Ready for installation.`,
              author: "Site Assessment Team",
              email: "assessment@xtechs.com",
              timestamp: new Date(visit.visitDate).toLocaleDateString() + " 4:15 PM"
            }
          ]
        }))
      ]
    },
    {
      id: "site-inspection",
      title: "Site Inspection",
      color: "border-purple-300",
      projects: []
    },
    {
      id: "stage-1",
      title: "Stage 1",
      color: "border-orange-300",
      projects: []
    },
    {
      id: "stage-2",
      title: "Stage 2",
      color: "border-yellow-300",
      projects: []
    },
    {
      id: "full-system",
      title: "Full System",
      color: "border-green-300",
      projects: []
    },
    {
      id: "canceled",
      title: "Canceled",
      color: "border-red-300",
      projects: []
    },
    {
      id: "to-be-scheduled",
      title: "To Be Scheduled",
      color: "border-blue-300",
      projects: [
        {
          id: 2,
          title: "Johnson Commercial",
          assignee: "TB",
          assignees: ["Team B", "Mike Chen", "Lisa Anderson"],
          date: "Nov 5 - Nov 10",
          tags: ["15kW System", "Commercial"],
          priority: "high" as const,
          value: "$24,000",
          status: "to-be-scheduled",
          customerName: "John Johnson",
          customerEmail: "john@johnson.com",
          customerContact: "+61 400 789 012",
          customerAddress: "456 Business Ave, Sydney NSW 2000",
          systemType: "pv-battery",
          systemSize: "15",
          comments: []
        }
      ]
    },
    {
      id: "scheduled",
      title: "Scheduled",
      color: "border-green-300",
      projects: [
        {
          id: 3,
          title: "Smith Residence",
          assignee: "TA",
          assignees: ["Team A", "Emily Davis"],
          date: "Oct 20 - Oct 22",
          tags: ["3.5kW System", "Residential"],
          priority: "high" as const,
          value: "$6,200",
          status: "scheduled",
          customerName: "Sarah Smith",
          customerEmail: "sarah@smith.com",
          customerContact: "+61 400 555 123",
          customerAddress: "789 Oak St, Brisbane QLD 4000",
          systemType: "pv-only",
          systemSize: "3.5",
          comments: []
        }
      ]
    },
    {
      id: "to-be-rescheduled",
      title: "To Be Rescheduled",
      color: "border-orange-300",
      projects: [
        {
          id: 4,
          title: "Brown Warehouse",
          assignee: "TB",
          date: "Oct 23 - Oct 27",
          tags: ["20kW System", "Industrial"],
          priority: "high" as const,
          value: "$32,000",
          status: "to-be-rescheduled",
          customerName: "Michael Brown",
          customerEmail: "michael@brown.com",
          customerContact: "+61 400 666 789",
          customerAddress: "321 Industrial Rd, Perth WA 6000",
          systemType: "pv-battery-ev-charger",
          systemSize: "20",
          comments: []
        }
      ]
    },
    {
      id: "completed",
      title: "Installation Completed",
      color: "border-green-500",
      projects: [
        {
          id: 5,
          title: "Davis Home",
          assignee: "TA",
          date: "Oct 28 - Oct 30",
          tags: ["4kW System", "Residential"],
          priority: "medium" as const,
          value: "$7,100",
          status: "completed",
          customerName: "Emily Davis",
          customerEmail: "emily@davis.com",
          customerContact: "+61 400 777 456",
          customerAddress: "654 Pine Ave, Adelaide SA 5000",
          systemType: "pv-only",
          systemSize: "4",
          comments: []
        }
      ]
    },
    {
      id: "ces-certificate-applied",
      title: "CES Certificate Applied",
      color: "border-purple-300",
      projects: [
        {
          id: 6,
          title: "Anderson Villa",
          assignee: "TB",
          date: "Oct 10 - Oct 15",
          tags: ["6kW System", "Residential"],
          priority: "low" as const,
          value: "$10,500",
          status: "ces-certificate-applied",
          customerName: "Robert Anderson",
          customerEmail: "robert@anderson.com",
          customerContact: "+61 400 888 321",
          customerAddress: "987 Villa Dr, Gold Coast QLD 4217",
          systemType: "pv-battery",
          systemSize: "6",
          comments: []
        }
      ]
    },
    {
      id: "ces-certificate-received",
      title: "CES Certificate Received",
      color: "border-indigo-300",
      projects: [
        {
          id: 7,
          title: "Wilson Office",
          assignee: "TA",
          date: "Oct 5 - Oct 9",
          tags: ["8kW System", "Commercial"],
          priority: "low" as const,
          value: "$14,200",
          status: "ces-certificate-received",
          customerName: "Lisa Wilson",
          customerEmail: "lisa@wilson.com",
          customerContact: "+61 400 999 654",
          customerAddress: "147 Office Blvd, Canberra ACT 2600",
          systemType: "pv-only",
          systemSize: "8",
          comments: []
        }
      ]
    },
    {
      id: "ces-certificate-submitted",
      title: "CES Certificate Submitted",
      color: "border-teal-500",
      projects: [
        {
          id: 8,
          title: "Thompson Retail",
          assignee: "TC",
          date: "Sep 25 - Sep 30",
          tags: ["12kW System", "Commercial"],
          priority: "medium" as const,
          value: "$18,500",
          status: "ces-certificate-submitted",
          customerName: "David Thompson",
          customerEmail: "david@thompson.com",
          customerContact: "+61 400 111 987",
          customerAddress: "258 Retail St, Darwin NT 0800",
          systemType: "pv-battery",
          systemSize: "12",
          comments: []
        }
      ]
    },
    {
      id: "grid-connect-initiated",
      title: "Grid Connect Initiated",
      color: "border-cyan-300",
      projects: [
        {
          id: 9,
          title: "Green Energy House",
          assignee: "TC",
          date: "Nov 1 - Nov 5",
          tags: ["7kW System", "Residential"],
          priority: "medium" as const,
          value: "$12,800",
          status: "grid-connect-initiated",
          customerName: "Jennifer Green",
          customerEmail: "jennifer@green.com",
          customerContact: "+61 400 222 333",
          customerAddress: "456 Green St, Melbourne VIC 3001",
          systemType: "pv-only",
          systemSize: "7",
          comments: []
        }
      ]
    },
    {
      id: "grid-connection-completed",
      title: "Grid Connection Completed",
      color: "border-emerald-400",
      projects: [
        {
          id: 10,
          title: "Solar Solutions Office",
          assignee: "TA",
          date: "Oct 15 - Oct 20",
          tags: ["10kW System", "Commercial"],
          priority: "high" as const,
          value: "$18,000",
          status: "grid-connection-completed",
          customerName: "Mark Solutions",
          customerEmail: "mark@solutions.com",
          customerContact: "+61 400 444 555",
          customerAddress: "789 Business Park, Sydney NSW 2001",
          systemType: "pv-battery",
          systemSize: "10",
          comments: []
        }
      ]
    },
    {
      id: "system-handover",
      title: "System Handover",
      color: "border-violet-400",
      projects: [
        {
          id: 11,
          title: "Eco Friendly Villa",
          assignee: "TB",
          date: "Oct 8 - Oct 12",
          tags: ["8kW System", "Residential"],
          priority: "low" as const,
          value: "$15,200",
          status: "system-handover",
          customerName: "Anna Eco",
          customerEmail: "anna@eco.com",
          customerContact: "+61 400 666 777",
          customerAddress: "321 Eco Ave, Brisbane QLD 4001",
          systemType: "pv-battery-ev-charger",
          systemSize: "8",
          comments: []
        }
      ]
    },
    {
      id: "done",
      title: "Done",
      color: "border-green-600",
      projects: [
        {
          id: 12,
          title: "Smart Home Project",
          assignee: "TC",
          date: "Sep 20 - Sep 25",
          tags: ["12kW System", "Residential"],
          priority: "completed" as const,
          value: "$22,000",
          status: "done",
          customerName: "Tom Smart",
          customerEmail: "tom@smart.com",
          customerContact: "+61 400 888 999",
          customerAddress: "654 Smart St, Perth WA 6001",
          systemType: "pv-battery",
          systemSize: "12",
          comments: []
        }
      ]
    }
  ];

  const team = [
    { id: 1, name: "John Davis", role: "Lead Electrician", availability: 85, projects: 3 },
    { id: 2, name: "Mike Thompson", role: "Lead Electrician", availability: 60, projects: 5 },
    { id: 3, name: "Sarah Chen", role: "Apprentice", availability: 90, projects: 2 },
    { id: 4, name: "Tom Wilson", role: "Apprentice", availability: 75, projects: 3 },
  ];

  const weeklySchedule = [
    { 
      day: "Mon 14", 
      projects: [
        {
          id: 1,
          title: "Smith Install",
          customerName: "Sarah Smith",
          customerPhone: "+61 400 555 123",
          customerAddress: "789 Oak St, Brisbane QLD 4000",
          location: "Brisbane QLD",
          time: "9:00 AM - 3:00 PM",
          teamAssigned: "Team A (John Davis, Mike Thompson)"
        },
        {
          id: 2,
          title: "Davis Survey",
          customerName: "Emily Davis",
          customerPhone: "+61 400 777 456",
          customerAddress: "654 Pine Ave, Adelaide SA 5000",
          location: "Adelaide SA",
          time: "2:00 PM - 4:00 PM",
          teamAssigned: "Team B (Sarah Chen)"
        }
      ]
    },
    { 
      day: "Tue 15", 
      projects: [
        {
          id: 3,
          title: "Brown Install Day 1",
          customerName: "Michael Brown",
          customerPhone: "+61 400 666 789",
          customerAddress: "321 Industrial Rd, Perth WA 6000",
          location: "Perth WA",
          time: "8:00 AM - 5:00 PM",
          teamAssigned: "Team A (John Davis, Mike Thompson, Tom Wilson)"
        }
      ]
    },
    { 
      day: "Wed 16", 
      projects: [
        {
          id: 4,
          title: "Brown Install Day 2",
          customerName: "Michael Brown",
          customerPhone: "+61 400 666 789",
          customerAddress: "321 Industrial Rd, Perth WA 6000",
          location: "Perth WA",
          time: "8:00 AM - 5:00 PM",
          teamAssigned: "Team A (John Davis, Mike Thompson, Tom Wilson)"
        },
        {
          id: 5,
          title: "Johnson Inspection",
          customerName: "John Johnson",
          customerPhone: "+61 400 789 012",
          customerAddress: "456 Business Ave, Sydney NSW 2000",
          location: "Sydney NSW",
          time: "11:00 AM - 1:00 PM",
          teamAssigned: "Team B (Sarah Chen)"
        }
      ]
    },
    { 
      day: "Thu 17", 
      projects: [
        {
          id: 6,
          title: "Brown Install Day 3",
          customerName: "Michael Brown",
          customerPhone: "+61 400 666 789",
          customerAddress: "321 Industrial Rd, Perth WA 6000",
          location: "Perth WA",
          time: "8:00 AM - 4:00 PM",
          teamAssigned: "Team A (John Davis, Mike Thompson, Tom Wilson)"
        }
      ]
    },
    { 
      day: "Fri 18", 
      projects: [
        {
          id: 7,
          title: "Martinez Site Visit",
          customerName: "Maria Martinez",
          customerPhone: "+61 400 123 456",
          customerAddress: "123 Main St, Melbourne VIC 3000",
          location: "Melbourne VIC",
          time: "10:00 AM - 12:00 PM",
          teamAssigned: "Team B (Sarah Chen, Tom Wilson)"
        }
      ]
    },
  ];

  const monthlySchedule = [
    { 
      date: "Oct 14", 
      projects: [
        {
          id: 1,
          title: "Smith Install",
          customerName: "Sarah Smith",
          customerPhone: "+61 400 555 123",
          customerAddress: "789 Oak St, Brisbane QLD 4000",
          location: "Brisbane QLD",
          time: "9:00 AM - 3:00 PM",
          teamAssigned: "Team A"
        }
      ]
    },
    { 
      date: "Oct 15", 
      projects: [
        {
          id: 3,
          title: "Brown Install Day 1",
          customerName: "Michael Brown",
          customerPhone: "+61 400 666 789",
          customerAddress: "321 Industrial Rd, Perth WA 6000",
          location: "Perth WA",
          time: "8:00 AM - 5:00 PM",
          teamAssigned: "Team A"
        }
      ]
    },
    { 
      date: "Oct 16", 
      projects: [
        {
          id: 4,
          title: "Brown Install Day 2",
          customerName: "Michael Brown",
          customerPhone: "+61 400 666 789",
          customerAddress: "321 Industrial Rd, Perth WA 6000",
          location: "Perth WA",
          time: "8:00 AM - 5:00 PM",
          teamAssigned: "Team A"
        }
      ]
    },
    { 
      date: "Oct 17", 
      projects: [
        {
          id: 6,
          title: "Brown Install Day 3",
          customerName: "Michael Brown",
          customerPhone: "+61 400 666 789",
          customerAddress: "321 Industrial Rd, Perth WA 6000",
          location: "Perth WA",
          time: "8:00 AM - 4:00 PM",
          teamAssigned: "Team A"
        }
      ]
    },
    { 
      date: "Oct 18", 
      projects: [
        {
          id: 7,
          title: "Martinez Site Visit",
          customerName: "Maria Martinez",
          customerPhone: "+61 400 123 456",
          customerAddress: "123 Main St, Melbourne VIC 3000",
          location: "Melbourne VIC",
          time: "10:00 AM - 12:00 PM",
          teamAssigned: "Team B"
        }
      ]
    },
    { 
      date: "Oct 21", 
      projects: [
        {
          id: 8,
          title: "Anderson System Check",
          customerName: "Robert Anderson",
          customerPhone: "+61 400 888 321",
          customerAddress: "987 Villa Dr, Gold Coast QLD 4217",
          location: "Gold Coast QLD",
          time: "1:00 PM - 3:00 PM",
          teamAssigned: "Team B"
        }
      ]
    },
    { 
      date: "Oct 22", 
      projects: [
        {
          id: 9,
          title: "Wilson Office Install",
          customerName: "Lisa Wilson",
          customerPhone: "+61 400 999 654",
          customerAddress: "147 Office Blvd, Canberra ACT 2600",
          location: "Canberra ACT",
          time: "9:00 AM - 4:00 PM",
          teamAssigned: "Team A"
        }
      ]
    }
  ];

  // Handler functions
  const handleExportSchedule = () => {
    setShowExportDialog(true);
  };

  const handleScheduleNewProject = () => {
    setShowNewProjectDialog(true);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleAddProject = (columnId) => {
    setNewProject({ ...newProject, status: columnId });
    setShowNewProjectDialog(true);
  };

  const handleStatsClick = (type) => {
    setShowStatsDialog(true);
  };

  const handleTeamMemberClick = (member) => {
    setSelectedTeamMember(member);
    setShowTeamMemberDialog(true);
  };

  const handleAvailabilityClick = (member, day, availability) => {
    setSelectedAvailability({ member, day, availability });
    setShowAvailabilityDialog(true);
  };

  const handleCalendarNavigation = (direction) => {
    // This would update the calendar view
    console.log(`Navigate ${direction} in calendar`);
  };

  const handleScheduleItemClick = (scheduleItem) => {
    setSelectedScheduleItem(scheduleItem);
    setShowScheduleDetails(true);
  };

  const handleEditSchedule = () => {
    setEditingScheduleItem({ ...selectedScheduleItem });
    setShowScheduleDetails(false);
    setShowEditSchedule(true);
  };

  const handleSaveScheduleChanges = () => {
    // Here you would typically update the schedule in your data store
    console.log("Saving schedule changes:", editingScheduleItem);
    
    // Update the schedule data (this would normally be done via API call)
    // For now, we'll just close the dialog
    setShowEditSchedule(false);
    setEditingScheduleItem(null);
    
    // Show success message
    alert("Schedule updated successfully!");
  };

  const handleEditMember = () => {
    setEditingMember({ ...selectedTeamMember });
    setShowTeamMemberDialog(false);
    setShowEditMember(true);
  };

  const handleSaveMemberChanges = () => {
    // Here you would typically update the team member in your data store
    console.log("Saving member changes:", editingMember);
    
    // Update the team data (this would normally be done via API call)
    // For now, we'll just close the dialog
    setShowEditMember(false);
    setEditingMember(null);
    
    // Show success message
    alert("Team member updated successfully!");
  };

  const handleOtherSelection = (field, value) => {
    setOtherSelections(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatTimeDisplay = (time) => {
    const timeMap = {
      '09:00': '9:00 AM',
      '10:00': '10:00 AM',
      '11:00': '11:00 AM',
      '12:00': '12:00 PM',
      '13:00': '1:00 PM',
      '14:00': '2:00 PM',
      '15:00': '3:00 PM',
      '16:00': '4:00 PM',
      '17:00': '5:00 PM'
    };
    return timeMap[time] || time;
  };

  const handleNewProjectSubmit = () => {
    // Determine the target column based on job type
    let targetColumnId = "new"; // Default column
    let projectStatus = "new"; // Default status
    
    if (newProject.jobType === "site-inspection") {
      targetColumnId = "site-inspection";
      projectStatus = "site-inspection";
    } else if (newProject.jobType === "stage-1") {
      targetColumnId = "stage-1";
      projectStatus = "stage-1";
    } else if (newProject.jobType === "stage-2") {
      targetColumnId = "stage-2";
      projectStatus = "stage-2";
    } else if (newProject.jobType === "full-system") {
      targetColumnId = "full-system";
      projectStatus = "full-system";
    }

    // Create the new project object
    const newProjectData = {
      id: Date.now(), // Generate unique ID
      title: newProject.title || `${newProject.customerName} - ${newProject.jobType}`,
      assignee: newProject.assignees.length > 0 ? newProject.assignees[0].split(' ').map(n => n[0]).join('') : "PM",
      assignees: newProject.assignees.length > 0 ? newProject.assignees : ["Project Manager"],
      date: newProject.startDate && newProject.endDate ? 
            `${new Date(newProject.startDate).toLocaleDateString()} - ${new Date(newProject.endDate).toLocaleDateString()}` : 
            "TBD",
      tags: [
        newProject.systemSize ? `${newProject.systemSize}kW System` : "System",
        newProject.clientType === "builder" ? "Builder" : "Residential"
      ],
      priority: newProject.priority || "medium",
      value: newProject.value || "TBD",
      status: projectStatus,
      customerName: newProject.customerName,
      customerEmail: newProject.customerEmail,
      customerContact: newProject.customerContact,
      customerAddress: newProject.customerAddress,
      systemType: newProject.projectType || "pv-only",
      systemSize: newProject.systemSize,
      // Job type specific data
      jobType: newProject.jobType,
      clientType: newProject.clientType,
      clientName: newProject.clientName,
      // Booking information
      inspectionDate: newProject.inspectionDate,
      inspectionTime: newProject.inspectionTime,
      inspectionBooked: newProject.inspectionBooked,
      stage1Date: newProject.stage1Date,
      stage1Booked: newProject.stage1Booked,
      stage2Date: newProject.stage2Date,
      stage2Booked: newProject.stage2Booked,
      fullSystemDate: newProject.fullSystemDate,
      fullSystemBooked: newProject.fullSystemBooked,
      comments: [
        {
          id: `new-${Date.now()}`,
          text: `Project created with job type: ${newProject.jobType}. ${newProject.clientType ? `Client type: ${newProject.clientType}.` : ''} ${newProject.clientName ? `Client: ${newProject.clientName}.` : ''}`,
          author: "Project Manager",
          email: "pm@xtechs.com",
          timestamp: new Date().toLocaleString()
        }
      ]
    };

    // Update the kanban columns to add the project to the appropriate column
    const updatedColumns = kanbanColumns.map(column => {
      if (column.id === targetColumnId) {
        return {
          ...column,
          projects: [...column.projects, newProjectData]
        };
      }
      return column;
    });

    // Update the columns state
    setColumns(updatedColumns);

    console.log("Creating new project with data:", newProjectData);
    console.log("Adding to column:", targetColumnId);
    
    alert(`New project created successfully and added to ${targetColumnId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} column!`);
    
    setShowNewProjectDialog(false);
    setSelectedSystemType("");
    setOtherSelections({});
    setNewProject({
      title: "",
      assignee: "",
      assignees: [],
      startDate: "",
      endDate: "",
      priority: "",
      clientType: "",
      clientName: "",
      jobType: "",
      inspectionDate: "",
      inspectionTime: "",
      inspectionBooked: false,
      stage1Date: "",
      stage1Time: "",
      stage1Booked: false,
      stage2Date: "",
      stage2Time: "",
      stage2Booked: false,
      fullSystemDate: "",
      fullSystemTime: "",
      fullSystemBooked: false,
      systemSize: "",
      projectType: "",
      value: "",
      description: "",
      customerName: "",
      customerEmail: "",
      customerContact: "",
      customerAddress: "",
      location: "",
      houseStorey: "",
      roofType: "",
      propertyType: "",
      accessTo2ndStorey: "",
      accessToInverter: "",
      monitoring: "",
      inverterSize: "",
      batterySize: "",
      panelBrand: "",
      inverterBrand: "",
      batteryBrand: "",
      evChargerBrand: ""
    });
  };

  const handleExportConfirm = () => {
    alert("Schedule exported successfully!");
    setShowExportDialog(false);
  };

  // Initialize columns state
  React.useEffect(() => {
    console.log("Setting columns, total count:", kanbanColumns.length);
    setColumns(kanbanColumns);
  }, []);

  // Drag and drop handler
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    const draggedProject = sourceColumn.projects.find(p => p.id.toString() === draggableId);

    // Update project status
    const updatedProject = { ...draggedProject, status: destination.droppableId };

    // Remove from source
    const newSourceProjects = sourceColumn.projects.filter(p => p.id.toString() !== draggableId);
    
    // Add to destination
    const newDestProjects = [...destColumn.projects];
    newDestProjects.splice(destination.index, 0, updatedProject);

    // Update columns
    const newColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, projects: newSourceProjects };
      }
      if (col.id === destination.droppableId) {
        return { ...col, projects: newDestProjects };
      }
      return col;
    });

    setColumns(newColumns);
  };

  // Enhanced project click handler for editing
  const handleProjectEditClick = (project) => {
    setEditingProject(project);
    setSelectedSystemType(project.systemType || "");
    setShowProjectDetails(true);
  };

  // Status change handler
  const handleStatusChange = (newStatus) => {
    if (!editingProject) return;

    const newColumns = columns.map(col => ({
      ...col,
      projects: col.projects.map(p => 
        p.id === editingProject.id 
          ? { ...p, status: newStatus }
          : p
      ).filter(p => p.id !== editingProject.id || col.id === newStatus)
    }));

    // Add project to new column if it's not already there
    const targetColumn = newColumns.find(col => col.id === newStatus);
    if (targetColumn && !targetColumn.projects.find(p => p.id === editingProject.id)) {
      targetColumn.projects.push({ ...editingProject, status: newStatus });
    }

    setColumns(newColumns);
    setEditingProject({ ...editingProject, status: newStatus });
  };

  // Comment submission handler
  const handleSubmitComment = () => {
    if (!commentText.trim() || !editingProject) return;

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      author: "Project Manager", // This would come from auth context
      email: userEmail,
      timestamp: new Date().toLocaleString()
    };

    const updatedProject = {
      ...editingProject,
      comments: [...(editingProject.comments || []), newComment]
    };

    // Update the project in columns
    const newColumns = columns.map(col => ({
      ...col,
      projects: col.projects.map(p => 
        p.id === editingProject.id ? updatedProject : p
      )
    }));

    setColumns(newColumns);
    setEditingProject(updatedProject);
    setCommentText("");
  };

  // Update project details handler
  const handleUpdateProject = (updatedData) => {
    if (!editingProject) return;

    const updatedProject = { ...editingProject, ...updatedData };

    const newColumns = columns.map(col => ({
      ...col,
      projects: col.projects.map(p => 
        p.id === editingProject.id ? updatedProject : p
      )
    }));

    setColumns(newColumns);
    setEditingProject(updatedProject);
  };

  try {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-muted-foreground">Schedule and manage installations</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportSchedule}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
            <Button onClick={handleScheduleNewProject}>Schedule New Project</Button>
        </div>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Project Timeline</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCalendarNavigation('previous')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span>{currentMonth}</span>
                  <Button variant="outline" size="sm" onClick={() => handleCalendarNavigation('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4" key="kanban-columns-12">
                  {(columns || kanbanColumns).map((column) => {
                    console.log("Rendering column:", column.title);
                    return (
                    <div key={column.id} className="space-y-4 min-w-[280px] flex-shrink-0">
                    <div className={`border-l-4 ${column.color} pl-3`}>
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold truncate">{column.title}</h3>
                          <Badge variant="secondary" className="ml-2 flex-shrink-0">{column.projects.length}</Badge>
                      </div>
                        <p className="text-xs text-muted-foreground">
                          {column.id === "new" && "New projects awaiting review"}
                          {column.id === "site-inspection" && "Site inspection scheduled/completed"}
                          {column.id === "stage-1" && "Stage 1 installation phase"}
                          {column.id === "stage-2" && "Stage 2 installation phase"}
                          {column.id === "full-system" && "Full system installation"}
                          {column.id === "canceled" && "Canceled projects"}
                          {column.id === "to-be-scheduled" && "Ready for scheduling"}
                          {column.id === "scheduled" && "Confirmed schedule"}
                          {column.id === "to-be-rescheduled" && "Schedule changes needed"}
                          {column.id === "completed" && "Installation completed"}
                          {column.id === "ces-certificate-applied" && "Certificate applied"}
                          {column.id === "ces-certificate-received" && "Certificate received"}
                          {column.id === "ces-certificate-submitted" && "Certificate submitted"}
                          {column.id === "grid-connect-initiated" && "Grid connection process started"}
                          {column.id === "grid-connection-completed" && "Grid connection established"}
                          {column.id === "system-handover" && "System ready for customer handover"}
                          {column.id === "done" && "Project fully completed"}
                      </p>
                    </div>

                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                              snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200' : ''
                            }`}
                          >
                            {column.projects.map((project, index) => (
                              <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`cursor-pointer transition-transform ${
                                      snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
                                    }`}
                                    onClick={() => handleProjectEditClick(project)}
                                  >
                        <KanbanCard
                          title={project.title}
                          assignee={project.assignee}
                          date={project.date}
                          tags={project.tags}
                          priority={project.priority}
                          value={project.value}
                        />
                                  </div>
                                )}
                              </Draggable>
                      ))}
                            {provided.placeholder}
                      
                      {/* Only show Add Project button for specific columns */}
                      {!["new", "canceled", "to-be-scheduled", "scheduled", "to-be-rescheduled", "completed", "ces-certificate-applied", "ces-certificate-received", "ces-certificate-submitted", "grid-connect-initiated", "grid-connection-completed", "system-handover", "done"].includes(column.id) && (
                      <Button 
                        variant="ghost" 
                        className="w-full border-2 border-dashed hover:border-solid hover:bg-muted"
                          onClick={() => handleAddProject(column.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                      )}
                    </div>
                        )}
                      </Droppable>
                  </div>
                    );
                  })}
              </div>
              </DragDropContext>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('total')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Projects</p>
                    <h3 className="mt-1">12</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('in-progress')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">In Progress</p>
                    <h3 className="mt-1">2</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('completed')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Completed</p>
                    <h3 className="mt-1">2</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('value')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <h3 className="mt-1">$188K</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle>Schedule</CardTitle>
                <div className="flex items-center gap-2">
                    <Button 
                      variant={calendarViewType === "weekly" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setCalendarViewType("weekly")}
                    >
                      Weekly Schedule
                    </Button>
                    <Button 
                      variant={calendarViewType === "monthly" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setCalendarViewType("monthly")}
                    >
                      Monthly Schedule
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCalendarNavigation('previous')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span>{calendarViewType === "weekly" ? currentWeek : currentMonth}</span>
                  <Button variant="outline" size="sm" onClick={() => handleCalendarNavigation('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {calendarViewType === "weekly" ? (
              <div className="grid grid-cols-5 gap-4">
                  {weeklySchedule.map((day, index) => (
                  <div key={index} className="border rounded-lg p-4">
                      <h4 className="mb-3 font-semibold">{day.day}</h4>
                    <div className="space-y-2">
                      {day.projects.map((project, idx) => (
                        <div
                          key={idx}
                            className="p-3 bg-primary/10 border border-primary/20 rounded text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => handleScheduleItemClick(project)}
                        >
                            <p className="font-medium text-sm">{project.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{project.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {/* Calendar Header */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center font-semibold text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells for calendar alignment */}
                  {[1, 2, 3, 4, 5, 6].map((empty) => (
                    <div key={empty} className="p-2 h-24 border rounded"></div>
                  ))}
                  
                  {/* Calendar days with projects */}
                  {monthlySchedule.map((day, index) => (
                    <div key={index} className="p-2 h-24 border rounded">
                      <div className="text-sm font-medium mb-1">{day.date.split(' ')[1]}</div>
                      <div className="space-y-1">
                        {day.projects.map((project, idx) => (
                          <div
                            key={idx}
                            className="text-xs p-1 bg-primary/10 border border-primary/20 rounded text-primary cursor-pointer hover:bg-primary/20 transition-colors truncate"
                            onClick={() => handleScheduleItemClick(project)}
                            title={project.title}
                          >
                            {project.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Fill remaining calendar cells */}
                  {Array.from({ length: 35 - 6 - monthlySchedule.length }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2 h-24 border rounded"></div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.map((member) => (
                  <div key={member.id} className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTeamMemberClick(member)}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p>{member.name}</p>
                        <p className="text-muted-foreground">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p>{member.availability}% Available</p>
                        <p className="text-muted-foreground">{member.projects} active projects</p>
                      </div>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          member.availability > 70
                            ? "bg-success"
                            : member.availability > 40
                            ? "bg-warning"
                            : "bg-destructive"
                        }`}
                        style={{ width: `${member.availability}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                <div className="p-2"></div>
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                  <div key={day} className="p-2 text-center text-muted-foreground">
                    {day}
                  </div>
                ))}

                {team.map((member) => (
                  <React.Fragment key={member.id}>
                    <div className="p-2 text-muted-foreground">{member.name.split(" ")[0]}</div>
                    {[90, 60, 80, 70, 85].map((avail, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded text-center cursor-pointer ${
                          avail > 70
                            ? "bg-success/20 hover:bg-success/30"
                            : avail > 40
                            ? "bg-warning/20 hover:bg-warning/30"
                            : "bg-destructive/20 hover:bg-destructive/30"
                        }`}
                        onClick={() => handleAvailabilityClick(member, ["Mon", "Tue", "Wed", "Thu", "Fri"][idx], avail)}
                      >
                        {avail}%
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success/20 rounded" />
                  <span className="text-muted-foreground">70-100% Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning/20 rounded" />
                  <span className="text-muted-foreground">40-70% Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive/20 rounded" />
                  <span className="text-muted-foreground">0-40% Available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drag to Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 border-2 border-dashed rounded-lg text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">Drag projects to team members to assign</p>
                <Button variant="outline">View Interactive Scheduler</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {/* Export Schedule Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Schedule
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Export Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" placeholder="Start Date" />
                <Input type="date" placeholder="End Date" />
              </div>
            </div>
            <div>
              <Label>Include</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="projects" defaultChecked />
                  <Label htmlFor="projects">Project Details</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="team" defaultChecked />
                  <Label htmlFor="team">Team Assignments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="timeline" defaultChecked />
                  <Label htmlFor="timeline">Timeline</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportConfirm}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Schedule New Project</span>
              <Button variant="ghost" size="sm" onClick={() => setShowNewProjectDialog(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Project Overview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input 
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input 
                    value={newProject.value}
                    onChange={(e) => setNewProject({ ...newProject, value: e.target.value })}
                    placeholder="e.g., $15,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newProject.priority} onValueChange={(value) => setNewProject({ ...newProject, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Client Type</Label>
                  <Select value={newProject.clientType} onValueChange={(value) => setNewProject({ ...newProject, clientType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="builder">Builder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Textarea
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    placeholder="Enter client name"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={newProject.jobType || ""} onValueChange={(value) => setNewProject({ ...newProject, jobType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site-inspection">Site Inspection</SelectItem>
                      <SelectItem value="stage-1">Stage 1</SelectItem>
                      <SelectItem value="stage-2">Stage 2</SelectItem>
                      <SelectItem value="full-system">Full System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Site Inspection Booking - Show only when Site Inspection is selected */}
              {newProject.jobType === "site-inspection" && !newProject.inspectionBooked && (
                <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="text-md font-semibold text-blue-800">Book Site Inspection</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inspection Date</Label>
                      <Input
                        type="date"
                        value={newProject.inspectionDate}
                        onChange={(e) => setNewProject({ ...newProject, inspectionDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Slot</Label>
                      <Select value={newProject.inspectionTime} onValueChange={(value) => setNewProject({ ...newProject, inspectionTime: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-center mt-6 mb-4">
                    <Button 
                      onClick={() => {
                        if (newProject.inspectionDate && newProject.inspectionTime) {
                          setNewProject({ ...newProject, inspectionBooked: true });
                          alert(`Site inspection booked for ${new Date(newProject.inspectionDate).toLocaleDateString()} at ${formatTimeDisplay(newProject.inspectionTime)}`);
                        } else {
                          alert("Please select both date and time slot for the inspection.");
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium rounded-md shadow-md"
                      style={{ 
                        minHeight: '36px', 
                        minWidth: '150px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        border: '1px solid #333333'
                      }}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" style={{ color: '#ffffff' }} />
                      <span style={{ color: '#ffffff' }}>Book Site Inspection</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Site Inspection Summary - Show after booking */}
              {newProject.jobType === "site-inspection" && newProject.inspectionBooked && (
                <div className="space-y-4 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-green-800">Site Inspection Booked</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewProject({ ...newProject, inspectionBooked: false })}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Job Type</Label>
                      <p className="text-sm font-semibold">Site Inspection</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Date</Label>
                      <p className="text-sm font-semibold">
                        {newProject.inspectionDate ? new Date(newProject.inspectionDate).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Time</Label>
                      <p className="text-sm font-semibold">
                        {newProject.inspectionTime ? formatTimeDisplay(newProject.inspectionTime) : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 1 Booking - Show only when Stage 1 is selected */}
              {newProject.jobType === "stage-1" && !newProject.stage1Booked && (
                <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="text-md font-semibold text-blue-800">Book Stage 1</h4>
                  <div className="space-y-2">
                    <Label>Stage 1 Date</Label>
                    <Input
                      type="date"
                      value={newProject.stage1Date}
                      onChange={(e) => setNewProject({ ...newProject, stage1Date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex justify-center mt-6 mb-4">
                    <Button 
                      onClick={() => {
                        if (newProject.stage1Date) {
                          setNewProject({ ...newProject, stage1Booked: true });
                          alert(`Stage 1 booked for ${new Date(newProject.stage1Date).toLocaleDateString()}`);
                        } else {
                          alert("Please select a date for Stage 1.");
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium rounded-md shadow-md"
                      style={{ 
                        minHeight: '36px', 
                        minWidth: '150px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        border: '1px solid #333333'
                      }}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" style={{ color: '#ffffff' }} />
                      <span style={{ color: '#ffffff' }}>Book Stage 1</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Stage 1 Summary - Show after booking */}
              {newProject.jobType === "stage-1" && newProject.stage1Booked && (
                <div className="space-y-4 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-green-800">Stage 1 Booked</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewProject({ ...newProject, stage1Booked: false })}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Job Type</Label>
                      <p className="text-sm font-semibold">Stage 1</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Date</Label>
                      <p className="text-sm font-semibold">
                        {newProject.stage1Date ? new Date(newProject.stage1Date).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 2 Booking - Show only when Stage 2 is selected */}
              {newProject.jobType === "stage-2" && !newProject.stage2Booked && (
                <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="text-md font-semibold text-blue-800">Book Stage 2</h4>
                  <div className="space-y-2">
                    <Label>Stage 2 Date</Label>
                    <Input
                      type="date"
                      value={newProject.stage2Date}
                      onChange={(e) => setNewProject({ ...newProject, stage2Date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex justify-center mt-6 mb-4">
                    <Button 
                      onClick={() => {
                        if (newProject.stage2Date) {
                          setNewProject({ ...newProject, stage2Booked: true });
                          alert(`Stage 2 booked for ${new Date(newProject.stage2Date).toLocaleDateString()}`);
                        } else {
                          alert("Please select a date for Stage 2.");
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium rounded-md shadow-md"
                      style={{ 
                        minHeight: '36px', 
                        minWidth: '150px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        border: '1px solid #333333'
                      }}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" style={{ color: '#ffffff' }} />
                      <span style={{ color: '#ffffff' }}>Book Stage 2</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Stage 2 Summary - Show after booking */}
              {newProject.jobType === "stage-2" && newProject.stage2Booked && (
                <div className="space-y-4 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-green-800">Stage 2 Booked</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewProject({ ...newProject, stage2Booked: false })}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Job Type</Label>
                      <p className="text-sm font-semibold">Stage 2</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Date</Label>
                      <p className="text-sm font-semibold">
                        {newProject.stage2Date ? new Date(newProject.stage2Date).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Full System Booking - Show only when Full System is selected */}
              {newProject.jobType === "full-system" && !newProject.fullSystemBooked && (
                <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="text-md font-semibold text-blue-800">Book Full System</h4>
                  <div className="space-y-2">
                    <Label>Full System Date</Label>
                    <Input
                      type="date"
                      value={newProject.fullSystemDate}
                      onChange={(e) => setNewProject({ ...newProject, fullSystemDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex justify-center mt-6 mb-4">
                    <Button 
                      onClick={() => {
                        if (newProject.fullSystemDate) {
                          setNewProject({ ...newProject, fullSystemBooked: true });
                          alert(`Full System booked for ${new Date(newProject.fullSystemDate).toLocaleDateString()}`);
                        } else {
                          alert("Please select a date for Full System.");
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium rounded-md shadow-md"
                      style={{ 
                        minHeight: '36px', 
                        minWidth: '150px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        border: '1px solid #333333'
                      }}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" style={{ color: '#ffffff' }} />
                      <span style={{ color: '#ffffff' }}>Book Full System</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Full System Summary - Show after booking */}
              {newProject.jobType === "full-system" && newProject.fullSystemBooked && (
                <div className="space-y-4 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-green-800">Full System Booked</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewProject({ ...newProject, fullSystemBooked: false })}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Job Type</Label>
                      <p className="text-sm font-semibold">Full System</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-600">Date</Label>
                      <p className="text-sm font-semibold">
                        {newProject.fullSystemDate ? new Date(newProject.fullSystemDate).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* System Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Type</h3>
              <Select value={selectedSystemType} onValueChange={setSelectedSystemType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select system type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pv-only">PV Only</SelectItem>
                  <SelectItem value="pv-battery">PV+Battery</SelectItem>
                  <SelectItem value="only-battery">Only Battery</SelectItem>
                  <SelectItem value="only-ev-charger">Only EV Charger</SelectItem>
                  <SelectItem value="pv-battery-ev-charger">PV+Battery+EV Charger</SelectItem>
                  <SelectItem value="battery-ev-charger">Battery+EV Charger</SelectItem>
                  <SelectItem value="pv-ev-charger">PV+EV Charger</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name*</Label>
                  <Input 
                    value={newProject.customerName}
                    onChange={(e) => setNewProject({ ...newProject, customerName: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Email*</Label>
                  <Input 
                    value={newProject.customerEmail}
                    onChange={(e) => setNewProject({ ...newProject, customerEmail: e.target.value })}
                    placeholder="customer@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Contact Number*</Label>
                  <Input 
                    value={newProject.customerContact}
                    onChange={(e) => setNewProject({ ...newProject, customerContact: e.target.value })}
                    placeholder="+61 4XX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Address*</Label>
                  <Input 
                    value={newProject.customerAddress}
                    onChange={(e) => setNewProject({ ...newProject, customerAddress: e.target.value })}
                    placeholder="Start typing address..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location (Google Maps)</Label>
                  <Input 
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    placeholder="Search location"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>House Storey</Label>
                  <Select onValueChange={(value) => handleOtherSelection('houseStorey', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select storey" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="triple">Triple</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {otherSelections.houseStorey === 'other' && (
                  <div className="space-y-2">
                    <Label>Please specify house storey</Label>
                    <Textarea 
                      placeholder="Please specify the house storey details..." 
                      className="min-h-[40px]"
                      value={otherSelections.houseStoreyOther || ''}
                      onChange={(e) => handleOtherSelection('houseStoreyOther', e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Roof Type</Label>
                  <Select onValueChange={(value) => handleOtherSelection('roofType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select roof type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colorbond">ColorBond</SelectItem>
                      <SelectItem value="tin-kliplock">Tin KlipLock</SelectItem>
                      <SelectItem value="tin-kliplock-tily">Tin KlipLock+Tily</SelectItem>
                      <SelectItem value="tile-terracotta">Tile Terracotta</SelectItem>
                      <SelectItem value="tile-concrete">Tile Concrete</SelectItem>
                      <SelectItem value="tile-shilung-terracotta">Tile Shilung+Terracotta</SelectItem>
                      <SelectItem value="concrete">Concrete</SelectItem>
                      <SelectItem value="na">NA</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {otherSelections.roofType === 'other' && (
                  <div className="space-y-2">
                    <Label>Please specify roof type</Label>
                    <Textarea 
                      placeholder="Please specify the roof type details..." 
                      className="min-h-[40px]"
                      value={otherSelections.roofTypeOther || ''}
                      onChange={(e) => handleOtherSelection('roofTypeOther', e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select onValueChange={(value) => handleOtherSelection('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {otherSelections.propertyType === 'other' && (
                  <div className="space-y-2">
                    <Label>Please specify property type</Label>
                    <Textarea 
                      placeholder="Please specify the property type details..." 
                      className="min-h-[40px]"
                      value={otherSelections.propertyTypeOther || ''}
                      onChange={(e) => handleOtherSelection('propertyTypeOther', e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Access To 2nd Storey</Label>
                  <Select value={newProject.accessTo2ndStorey} onValueChange={(value) => setNewProject({ ...newProject, accessTo2ndStorey: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Access To Inverter</Label>
                  <Select value={newProject.accessToInverter} onValueChange={(value) => setNewProject({ ...newProject, accessToInverter: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monitoring</Label>
                  <Select onValueChange={(value) => handleOtherSelection('monitoring', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select monitoring" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {otherSelections.monitoring === 'yes' && (
                  <div className="space-y-2">
                    <Label>How Much?</Label>
                    <Textarea 
                      placeholder="Please specify monitoring details..." 
                      className="min-h-[40px]"
                      value={otherSelections.monitoringOther || ''}
                      onChange={(e) => handleOtherSelection('monitoringOther', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* System Information - Only visible when system type is selected */}
            {selectedSystemType && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">System Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column - Sizes */}
                  <div className="space-y-4">
                    {/* System Size - Show for all system types */}
                    <div className="space-y-2">
                      <Label>System Size (kW)</Label>
                      <Input 
                        value={newProject.systemSize}
                        onChange={(e) => setNewProject({ ...newProject, systemSize: e.target.value })}
                        placeholder="e.g., 6.6"
                      />
                    </div>
                    
                    {/* Inverter Size - Show for PV systems */}
                    {(selectedSystemType.includes('pv') || selectedSystemType.includes('battery')) && (
                      <div className="space-y-2">
                        <Label>Inverter Size (kW)</Label>
                        <Input 
                          value={newProject.inverterSize}
                          onChange={(e) => setNewProject({ ...newProject, inverterSize: e.target.value })}
                          placeholder="e.g., 5.0"
                        />
                      </div>
                    )}
                    
                    {/* Battery Size - Show for battery systems */}
                    {(selectedSystemType.includes('battery')) && (
                      <div className="space-y-2">
                        <Label>Battery Size (kWh)</Label>
                        <Input 
                          value={newProject.batterySize}
                          onChange={(e) => setNewProject({ ...newProject, batterySize: e.target.value })}
                          placeholder="e.g., 10.0"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column - Brands */}
                  <div className="space-y-4">
                    {/* Panel Brand - Show for PV systems */}
                    {(selectedSystemType.includes('pv')) && (
                      <div className="space-y-2">
                        <Label>Panel Brand</Label>
                        <Select onValueChange={(value) => handleOtherSelection('panelBrand', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Panel Brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunpower">SunPower</SelectItem>
                            <SelectItem value="lg">LG</SelectItem>
                            <SelectItem value="panasonic">Panasonic</SelectItem>
                            <SelectItem value="jinko">Jinko</SelectItem>
                            <SelectItem value="canadian-solar">Canadian Solar</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {otherSelections.panelBrand === 'other' && (
                          <Textarea 
                            placeholder="Please specify panel brand..." 
                            className="min-h-[40px]"
                            value={otherSelections.panelBrandOther || ''}
                            onChange={(e) => handleOtherSelection('panelBrandOther', e.target.value)}
                          />
                        )}
                      </div>
                    )}
                    
                    {/* Inverter Brand - Show for PV and battery systems */}
                    {(selectedSystemType.includes('pv') || selectedSystemType.includes('battery')) && (
                      <div className="space-y-2">
                        <Label>Inverter Brand</Label>
                        <Select onValueChange={(value) => handleOtherSelection('inverterBrand', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Inverter Brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enphase">Enphase</SelectItem>
                            <SelectItem value="solaredge">SolarEdge</SelectItem>
                            <SelectItem value="fronius">Fronius</SelectItem>
                            <SelectItem value="sma">SMA</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {otherSelections.inverterBrand === 'other' && (
                          <Textarea 
                            placeholder="Please specify inverter brand..." 
                            className="min-h-[40px]"
                            value={otherSelections.inverterBrandOther || ''}
                            onChange={(e) => handleOtherSelection('inverterBrandOther', e.target.value)}
                          />
                        )}
                      </div>
                    )}
                    
                    {/* Battery Brand - Show for battery systems */}
                    {(selectedSystemType.includes('battery')) && (
                      <div className="space-y-2">
                        <Label>Battery Brand</Label>
                        <Select onValueChange={(value) => handleOtherSelection('batteryBrand', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Battery Brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tesla">Tesla Powerwall</SelectItem>
                            <SelectItem value="lg">LG Chem</SelectItem>
                            <SelectItem value="enphase">Enphase</SelectItem>
                            <SelectItem value="sonnen">Sonnen</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {otherSelections.batteryBrand === 'other' && (
                          <Textarea 
                            placeholder="Please specify battery brand..." 
                            className="min-h-[40px]"
                            value={otherSelections.batteryBrandOther || ''}
                            onChange={(e) => handleOtherSelection('batteryBrandOther', e.target.value)}
                          />
                        )}
                      </div>
                    )}

                    {/* EV Charger Brand - Show for EV charger systems */}
                    {(selectedSystemType.includes('ev-charger')) && (
                      <div className="space-y-2">
                        <Label>EV Charger Brand</Label>
                        <Select onValueChange={(value) => handleOtherSelection('evChargerBrand', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select EV Charger Brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tesla">Tesla</SelectItem>
                            <SelectItem value="chargepoint">ChargePoint</SelectItem>
                            <SelectItem value="wallbox">Wallbox</SelectItem>
                            <SelectItem value="juicebox">JuiceBox</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {otherSelections.evChargerBrand === 'other' && (
                          <Textarea 
                            placeholder="Please specify EV charger brand..." 
                            className="min-h-[40px]"
                            value={otherSelections.evChargerBrandOther || ''}
                            onChange={(e) => handleOtherSelection('evChargerBrandOther', e.target.value)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Project Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Timeline</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Assignees */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assignees</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                  {newProject.assignees && newProject.assignees.length > 0 ? (
                    newProject.assignees.map((assignee, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {assignee}
                        <button
                          type="button"
                          onClick={() => {
                            const newAssignees = newProject.assignees.filter((_, i) => i !== index);
                            setNewProject({ ...newProject, assignees: newAssignees });
                          }}
                          className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No assignees selected</span>
                  )}
                </div>
                <Select onValueChange={(value) => {
                  const currentAssignees = newProject.assignees || [];
                  if (!currentAssignees.includes(value)) {
                    setNewProject({ ...newProject, assignees: [...currentAssignees, value] });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                    <SelectItem value="James Wilson">James Wilson</SelectItem>
                    <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
                    <SelectItem value="Team A">Team A</SelectItem>
                    <SelectItem value="Team B">Team B</SelectItem>
                    <SelectItem value="Team C">Team C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Project Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Notes</h3>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Additional project notes and requirements..."
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleNewProjectSubmit} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Project Details/Edit Dialog */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Edit Project - {editingProject?.title}</span>
              <Button variant="ghost" size="sm" onClick={() => setShowProjectDetails(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {editingProject && (
            <div className="space-y-6">
                {/* Project Overview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input 
                        value={editingProject.title}
                        onChange={(e) => handleUpdateProject({ title: e.target.value })}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input 
                        value={editingProject.value}
                        onChange={(e) => handleUpdateProject({ value: e.target.value })}
                        placeholder="e.g., $15,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={editingProject.priority} onValueChange={(value) => handleUpdateProject({ priority: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editingProject.status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="site-inspection">Site Inspection</SelectItem>
                          <SelectItem value="stage-1">Stage 1</SelectItem>
                          <SelectItem value="stage-2">Stage 2</SelectItem>
                          <SelectItem value="full-system">Full System</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                          <SelectItem value="to-be-scheduled">To Be Scheduled</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="to-be-rescheduled">To Be Rescheduled</SelectItem>
                          <SelectItem value="completed">Installation Completed</SelectItem>
                          <SelectItem value="ces-certificate-applied">CES Certificate Applied</SelectItem>
                          <SelectItem value="ces-certificate-received">CES Certificate Received</SelectItem>
                          <SelectItem value="ces-certificate-submitted">CES Certificate Submitted</SelectItem>
                          <SelectItem value="grid-connect-initiated">Grid Connect Initiated</SelectItem>
                          <SelectItem value="grid-connection-completed">Grid Connection Completed</SelectItem>
                          <SelectItem value="system-handover">System Handover</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Assignee</Label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                          {editingProject.assignees && editingProject.assignees.length > 0 ? (
                            editingProject.assignees.map((assignee, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {assignee}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newAssignees = editingProject.assignees.filter((_, i) => i !== index);
                                    handleUpdateProject({ assignees: newAssignees });
                                  }}
                                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No assignees selected</span>
                          )}
                        </div>
                        <Select onValueChange={(value) => {
                          const currentAssignees = editingProject.assignees || [];
                          if (!currentAssignees.includes(value)) {
                            handleUpdateProject({ assignees: [...currentAssignees, value] });
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                            <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                            <SelectItem value="James Wilson">James Wilson</SelectItem>
                            <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
                            <SelectItem value="Team A">Team A</SelectItem>
                            <SelectItem value="Team B">Team B</SelectItem>
                            <SelectItem value="Team C">Team C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Type Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">System Type</h3>
                  <Select value={selectedSystemType} onValueChange={setSelectedSystemType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select system type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pv-only">PV Only</SelectItem>
                      <SelectItem value="pv-battery">PV+Battery</SelectItem>
                      <SelectItem value="only-battery">Only Battery</SelectItem>
                      <SelectItem value="only-ev-charger">Only EV Charger</SelectItem>
                      <SelectItem value="pv-battery-ev-charger">PV+Battery+EV Charger</SelectItem>
                      <SelectItem value="battery-ev-charger">Battery+EV Charger</SelectItem>
                      <SelectItem value="pv-ev-charger">PV+EV Charger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Customer Name*</Label>
                      <Input 
                        value={editingProject.customerName || ""}
                        onChange={(e) => handleUpdateProject({ customerName: e.target.value })}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer Email*</Label>
                      <Input 
                        value={editingProject.customerEmail || ""}
                        onChange={(e) => handleUpdateProject({ customerEmail: e.target.value })}
                        placeholder="customer@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer Contact Number*</Label>
                      <Input 
                        value={editingProject.customerContact || ""}
                        onChange={(e) => handleUpdateProject({ customerContact: e.target.value })}
                        placeholder="+61 4XX XXX XXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer Address*</Label>
                      <Input 
                        value={editingProject.customerAddress || ""}
                        onChange={(e) => handleUpdateProject({ customerAddress: e.target.value })}
                        placeholder="Start typing address..."
                      />
                    </div>
                  </div>
                </div>

                {/* On-Field Site Visit Information - Show only for projects from on-field visits */}
                {editingProject.onFieldVisitId && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">On-Field Site Assessment</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Roof Assessment</Label>
                        <Select value={editingProject.roofAssessment || ""} onValueChange={(value) => handleUpdateProject({ roofAssessment: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select roof condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Electrical Assessment</Label>
                        <Select value={editingProject.electricalAssessment || ""} onValueChange={(value) => handleUpdateProject({ electricalAssessment: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select electrical condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Needs Upgrade">Needs Upgrade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Safety Score (%)</Label>
                        <Input 
                          type="number"
                          min="0"
                          max="100"
                          value={editingProject.safetyScore || ""}
                          onChange={(e) => handleUpdateProject({ safetyScore: parseInt(e.target.value) })}
                          placeholder="e.g., 95"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Installation Readiness</Label>
                        <Select value={editingProject.installationReadiness || ""} onValueChange={(value) => handleUpdateProject({ installationReadiness: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select readiness status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ready">Ready</SelectItem>
                            <SelectItem value="Pending Permits">Pending Permits</SelectItem>
                            <SelectItem value="Requires Preparation">Requires Preparation</SelectItem>
                            <SelectItem value="Not Ready">Not Ready</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Duration</Label>
                        <Input 
                          value={editingProject.estimatedDuration || ""}
                          onChange={(e) => handleUpdateProject({ estimatedDuration: e.target.value })}
                          placeholder="e.g., 6-8 hours"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Technician</Label>
                        <Input 
                          value={editingProject.technician || ""}
                          onChange={(e) => handleUpdateProject({ technician: e.target.value })}
                          placeholder="Assessment technician name"
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Special Requirements</Label>
                      <Textarea 
                        value={editingProject.specialRequirements || ""}
                        onChange={(e) => handleUpdateProject({ specialRequirements: e.target.value })}
                        placeholder="Enter any special requirements for installation..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Technician Notes</Label>
                      <Textarea 
                        value={editingProject.technicianNotes || ""}
                        onChange={(e) => handleUpdateProject({ technicianNotes: e.target.value })}
                        placeholder="Notes from on-field assessment..."
                        rows={3}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                )}

                {/* System Information */}
                {selectedSystemType && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">System Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>System Size (kW)</Label>
                        <Input 
                          value={editingProject.systemSize || ""}
                          onChange={(e) => handleUpdateProject({ systemSize: e.target.value })}
                          placeholder="e.g., 6.6"
                        />
                      </div>
                      {(selectedSystemType.includes('pv') || selectedSystemType.includes('battery')) && (
                        <div className="space-y-2">
                          <Label>Inverter Size (kW)</Label>
                          <Input 
                            value={editingProject.inverterSize || ""}
                            onChange={(e) => handleUpdateProject({ inverterSize: e.target.value })}
                            placeholder="e.g., 5.0"
                          />
                        </div>
                      )}
                      {selectedSystemType.includes('battery') && (
                        <div className="space-y-2">
                          <Label>Battery Size (kWh)</Label>
                          <Input 
                            value={editingProject.batterySize || ""}
                            onChange={(e) => handleUpdateProject({ batterySize: e.target.value })}
                            placeholder="e.g., 10.0"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Timeline</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={editingProject.startDate || ""}
                        onChange={(e) => handleUpdateProject({ startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={editingProject.endDate || ""}
                        onChange={(e) => handleUpdateProject({ endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>


                {/* Comments Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Comments</h3>
                  
                  {/* Display existing comments */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {editingProject.comments && editingProject.comments.length > 0 ? (
                      editingProject.comments.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-3 bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">({comment.email})</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No comments yet.</p>
                    )}
                  </div>

                  {/* Add new comment */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="space-y-2">
                      <Label>Add Comment</Label>
                      <Textarea
                        placeholder="Write your comment here..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Commenting as: {userEmail}
                    </div>
                    <Button 
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim()}
                      size="sm"
                      className="w-full"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowProjectDetails(false)} className="flex-1">
                    Close
                  </Button>
                  <Button onClick={() => {
                    alert("Project updated successfully!");
                    setShowProjectDetails(false);
                  }} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Project Statistics
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Not Started</span>
                      <Badge variant="secondary">2</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>In Progress</span>
                      <Badge variant="default">2</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Inspection</span>
                      <Badge variant="outline">1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completed</span>
                      <Badge variant="secondary">2</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Total Value</span>
                      <span className="font-semibold">$102,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completed Value</span>
                      <span className="font-semibold text-green-600">$24,700</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>In Progress Value</span>
                      <span className="font-semibold text-blue-600">$38,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Value</span>
                      <span className="font-semibold text-orange-600">$39,100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Team A</span>
                    <div className="flex items-center gap-2">
                      <span>4 projects</span>
                      <Badge variant="outline">85% efficiency</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Team B</span>
                    <div className="flex items-center gap-2">
                      <span>3 projects</span>
                      <Badge variant="outline">92% efficiency</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatsDialog(false)}>
              Close
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Member Dialog */}
      <Dialog open={showTeamMemberDialog} onOpenChange={setShowTeamMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Member Details
            </DialogTitle>
          </DialogHeader>
          {selectedTeamMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-lg font-semibold">{selectedTeamMember.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <p className="text-lg">{selectedTeamMember.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Availability</Label>
                  <p className="text-lg font-semibold">{selectedTeamMember.availability}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Active Projects</Label>
                  <p className="text-lg">{selectedTeamMember.projects}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Availability Status</Label>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      selectedTeamMember.availability > 70
                        ? "bg-success"
                        : selectedTeamMember.availability > 40
                        ? "bg-warning"
                        : "bg-destructive"
                    }`}
                    style={{ width: `${selectedTeamMember.availability}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTeamMember.availability > 70 ? "High availability" : 
                   selectedTeamMember.availability > 40 ? "Moderate availability" : "Low availability"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Current Projects</Label>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-sm">Smith Residence - In Progress</div>
                  <div className="p-2 bg-muted rounded text-sm">Davis Home - Scheduled</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeamMemberDialog(false)}>
              Close
            </Button>
            <Button onClick={handleEditMember}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditMember} onOpenChange={setShowEditMember}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Edit Team Member</span>
              <Button variant="ghost" size="sm" onClick={() => setShowEditMember(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {editingMember && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input 
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      placeholder="Enter member name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select 
                      value={editingMember.role} 
                      onValueChange={(value) => setEditingMember({ ...editingMember, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lead Electrician">Lead Electrician</SelectItem>
                        <SelectItem value="Apprentice">Apprentice</SelectItem>
                        <SelectItem value="Senior Technician">Senior Technician</SelectItem>
                        <SelectItem value="Project Manager">Project Manager</SelectItem>
                        <SelectItem value="Site Supervisor">Site Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Availability Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Availability Percentage</Label>
                    <Input 
                      type="number"
                      min="0"
                      max="100"
                      value={editingMember.availability}
                      onChange={(e) => setEditingMember({ ...editingMember, availability: parseInt(e.target.value) || 0 })}
                      placeholder="Enter availability percentage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Active Projects</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={editingMember.projects}
                      onChange={(e) => setEditingMember({ ...editingMember, projects: parseInt(e.target.value) || 0 })}
                      placeholder="Number of active projects"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={editingMember.email || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input 
                      type="tel"
                      value={editingMember.phone || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Skills & Certifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills & Certifications</h3>
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <Textarea 
                    value={editingMember.skills || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, skills: e.target.value })}
                    placeholder="Enter skills and certifications"
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowEditMember(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMemberChanges}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Availability Details
            </DialogTitle>
          </DialogHeader>
          {selectedAvailability && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Team Member</Label>
                  <p className="text-lg font-semibold">{selectedAvailability.member.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Day</Label>
                  <p className="text-lg">{selectedAvailability.day}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Availability</Label>
                  <p className="text-lg font-semibold">{selectedAvailability.availability}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={selectedAvailability.availability > 70 ? 'default' : selectedAvailability.availability > 40 ? 'secondary' : 'destructive'}>
                    {selectedAvailability.availability > 70 ? 'High' : selectedAvailability.availability > 40 ? 'Moderate' : 'Low'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Scheduled Tasks</Label>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded text-sm">Morning: Site Survey</div>
                  <div className="p-2 bg-muted rounded text-sm">Afternoon: Installation Work</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvailabilityDialog(false)}>
              Close
            </Button>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Details Dialog */}
      <Dialog open={showScheduleDetails} onOpenChange={setShowScheduleDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Schedule Details</span>
              <Button variant="ghost" size="sm" onClick={() => setShowScheduleDetails(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedScheduleItem && (
            <div className="space-y-6">
              {/* Project Title */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary">{selectedScheduleItem.title}</h2>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Customer Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Customer Name</p>
                        <p className="text-muted-foreground">{selectedScheduleItem.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone Number</p>
                        <p className="text-muted-foreground">{selectedScheduleItem.customerPhone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">{selectedScheduleItem.customerAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Schedule Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{selectedScheduleItem.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-muted-foreground">{selectedScheduleItem.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Team Assigned</p>
                        <p className="text-muted-foreground">{selectedScheduleItem.teamAssigned}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowScheduleDetails(false)}>
                  Close
                </Button>
                <Button onClick={handleEditSchedule}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Schedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={showEditSchedule} onOpenChange={setShowEditSchedule}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Edit Schedule</span>
              <Button variant="ghost" size="sm" onClick={() => setShowEditSchedule(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {editingScheduleItem && (
            <div className="space-y-6">
              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input 
                      value={editingScheduleItem.title}
                      onChange={(e) => setEditingScheduleItem({ ...editingScheduleItem, title: e.target.value })}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      value={editingScheduleItem.location}
                      onChange={(e) => setEditingScheduleItem({ ...editingScheduleItem, location: e.target.value })}
                      placeholder="Enter location"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input 
                      value={editingScheduleItem.customerName}
                      onChange={(e) => setEditingScheduleItem({ ...editingScheduleItem, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input 
                      value={editingScheduleItem.customerPhone}
                      onChange={(e) => setEditingScheduleItem({ ...editingScheduleItem, customerPhone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input 
                      value={editingScheduleItem.customerAddress}
                      onChange={(e) => setEditingScheduleItem({ ...editingScheduleItem, customerAddress: e.target.value })}
                      placeholder="Enter customer address"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Schedule Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input 
                      value={editingScheduleItem.time}
                      onChange={(e) => setEditingScheduleItem({ ...editingScheduleItem, time: e.target.value })}
                      placeholder="e.g., 9:00 AM - 3:00 PM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Team Assigned</Label>
                    <Select 
                      value={editingScheduleItem.teamAssigned} 
                      onValueChange={(value) => setEditingScheduleItem({ ...editingScheduleItem, teamAssigned: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Team A (John Davis, Mike Thompson)">Team A (John Davis, Mike Thompson)</SelectItem>
                        <SelectItem value="Team B (Sarah Chen, Tom Wilson)">Team B (Sarah Chen, Tom Wilson)</SelectItem>
                        <SelectItem value="Team A (John Davis, Mike Thompson, Tom Wilson)">Team A (John Davis, Mike Thompson, Tom Wilson)</SelectItem>
                        <SelectItem value="Team B (Sarah Chen)">Team B (Sarah Chen)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowEditSchedule(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveScheduleChanges}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    );
  } catch (error) {
    console.error("Error in ProjectManagementScreen:", error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Project Management</h1>
        <p className="text-red-600">There was an error loading the project management page.</p>
        <p className="text-sm text-gray-600 mt-2">Please check the console for more details.</p>
    </div>
  );
  }
}
