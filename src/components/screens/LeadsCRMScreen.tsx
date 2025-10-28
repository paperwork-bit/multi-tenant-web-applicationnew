import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { KanbanCard } from "../KanbanCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Badge } from "../ui/badge";
import { Plus, Search, Filter, Mail, X, MessageSquare, Calendar, User, Phone, MapPin, Clock, DollarSign, Zap, Home, Building, Car, Battery, Sun, Wind, Droplets, Thermometer, Lightbulb, Wifi, Shield, CheckCircle, AlertCircle, Star, Eye, Edit, Trash2, Download, Upload, Send, Copy, ExternalLink, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, PlusCircle, MinusCircle, Settings, MoreHorizontal, MoreVertical, Menu, Grid, List, Filter as FilterIcon, SortAsc, SortDesc, RefreshCw, Save, FileText, Image, Video, Music, File, Folder, FolderOpen, Archive, Trash, Share, Lock, Unlock, Key, UserCheck, UserX, Users, UserPlus, UserMinus, Heart, HeartOff, ThumbsUp, ThumbsDown, Flag, Bookmark, BookmarkCheck, Tag, Tags, Hash, AtSign, Hash as HashIcon, Percent, Plus as PlusIcon, Minus, Divide, X as XIcon, Equal, NotEqual, GreaterThan, LessThan, GreaterThanOrEqual, LessThanOrEqual, Infinity, Pi, Sigma, Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Eta, Theta, Iota, Kappa, Lambda, Mu, Nu, Xi, Omicron, Rho, Tau, Upsilon, Phi, Chi, Psi, Omega } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface LeadsCRMScreenProps {
  userEmail?: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  email: string;
}

interface Lead {
  id: string;
  title: string;
  company: string;
  value: string;
  date: string;
  tags: string[];
  priority: "high" | "medium" | "low";
  assignee?: string;
  status?: string;
  comments?: Comment[];
  // Project details
  projectDetails?: {
    systemType?: string;
    clientType?: string;
    propertyInfo?: {
      houseStorey?: string;
      houseStoreyOther?: string;
      roofType?: string;
      roofTypeOther?: string;
      propertyType?: string;
      propertyTypeOther?: string;
      accessTo2ndStorey?: string;
      accessToInverter?: string;
      monitoring?: string;
      monitoringAmount?: string;
    };
    utilityInfo?: {
      preApprovalNumber?: string;
      distributor?: string;
      meterNumber?: string;
    };
    systemInfo?: {
      systemSize?: string;
      panelType?: string;
      inverterType?: string;
      batterySize?: string;
      mountingType?: string;
    };
    additionalInfo?: {
      shading?: string;
      roofCondition?: string;
      electricalPanel?: string;
      mainBreaker?: string;
      subPanel?: string;
      existingSolar?: string;
      existingBattery?: string;
      existingEVCharger?: string;
    };
    projectTimeline?: {
      startDate?: string;
      expectedCompletion?: string;
      installationDate?: string;
      inspectionDate?: string;
    };
    teamAssignment?: {
      projectManager?: string;
      salesRep?: string;
      installer?: string;
      electrician?: string;
    };
    projectNotes?: string;
  };
}

export function LeadsCRMScreen({ userEmail }: LeadsCRMScreenProps) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all-products");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentEmail, setCommentEmail] = useState(userEmail || "");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedSystemType, setSelectedSystemType] = useState<string>("");
  const [otherSelections, setOtherSelections] = useState<{[key: string]: string}>({});

  // Update commentEmail when userEmail prop changes
  useEffect(() => {
    console.log("LeadsCRMScreen userEmail prop:", userEmail);
    if (userEmail) {
      setCommentEmail(userEmail);
      console.log("Comment email set to:", userEmail);
    }
  }, [userEmail]);

  const [columns, setColumns] = useState([
    {
      id: "new",
      title: "New",
      count: 8,
      leads: [
        { 
          id: "1", 
          title: "Smith Residence", 
          company: "John Smith", 
          value: "$15,000", 
          date: "Oct 14", 
          tags: ["Residential", "Solar"], 
          priority: "high" as const,
          comments: []
        },
        { 
          id: "2", 
          title: "Commercial Building", 
          company: "ABC Corp", 
          value: "$85,000", 
          date: "Oct 13", 
          tags: ["Commercial", "Solar + Battery"], 
          priority: "high" as const,
          comments: []
        },
        { 
          id: "3", 
          title: "Jones Property", 
          company: "Sarah Jones", 
          value: "$12,500", 
          date: "Oct 12", 
          tags: ["Residential"], 
          priority: "medium" as const,
          comments: []
        },
      ],
    },
    {
      id: "in-progress",
      title: "In-Progress",
      count: 5,
      leads: [
        { 
          id: "4", 
          title: "Williams Home", 
          company: "Mike Williams", 
          value: "$18,500", 
          date: "Oct 11", 
          tags: ["Residential", "Battery"], 
          assignee: "JD", 
          priority: "high" as const,
          status: "In-progress",
          comments: [],
          projectDetails: {
            systemType: "Solar + Battery",
            propertyInfo: {
              houseStorey: "2",
              roofType: "Tile",
              propertyType: "Residential",
              accessTo2ndStorey: "Yes",
              accessToInverter: "Full",
              monitoring: "Yes",
              monitoringAmount: "Monthly"
            },
            utilityInfo: {
              preApprovalNumber: "PA-2024-001",
              distributor: "Ausgrid",
              meterNumber: "M123456"
            },
            systemInfo: {
              systemSize: "6.6kW",
              panelType: "Mono-crystalline",
              inverterType: "String Inverter",
              batterySize: "10kWh",
              mountingType: "Roof Mounted"
            },
            additionalInfo: {
              shading: "Minimal",
              roofCondition: "Good",
              electricalPanel: "200A",
              mainBreaker: "200A",
              subPanel: "No",
              existingSolar: "No",
              existingBattery: "No",
              existingEVCharger: "No"
            },
            projectTimeline: {
              startDate: "2024-10-15",
              expectedCompletion: "2024-11-15",
              installationDate: "2024-11-01",
              inspectionDate: "2024-11-10"
            },
            teamAssignment: {
              projectManager: "John Doe",
              salesRep: "Jane Smith",
              installer: "Mike Johnson",
              electrician: "Bob Wilson"
            },
            projectNotes: "Customer prefers morning installation. Access via side gate."
          }
        },
      ],
    },
    {
      id: "qualified",
      title: "Qualified",
      count: 12,
      leads: [
        { 
          id: "5", 
          title: "Brown Warehouse", 
          company: "Brown Industries", 
          value: "$120,000", 
          date: "Oct 10", 
          tags: ["Commercial"], 
          assignee: "SM", 
          priority: "medium" as const,
          status: "Qualified",
          comments: [],
          projectDetails: {
            systemType: "Solar + Battery + EV Charger",
            propertyInfo: {
              houseStorey: "1",
              roofType: "Metal",
              propertyType: "Commercial",
              accessTo2ndStorey: "N/A",
              accessToInverter: "Full",
              monitoring: "Yes",
              monitoringAmount: "Real-time"
            },
            utilityInfo: {
              preApprovalNumber: "PA-2024-002",
              distributor: "Endeavour Energy",
              meterNumber: "M789012"
            },
            systemInfo: {
              systemSize: "50kW",
              panelType: "Poly-crystalline",
              inverterType: "Central Inverter",
              batterySize: "100kWh",
              mountingType: "Ground Mounted"
            },
            additionalInfo: {
              shading: "None",
              roofCondition: "Excellent",
              electricalPanel: "400A",
              mainBreaker: "400A",
              subPanel: "Yes",
              existingSolar: "No",
              existingBattery: "No",
              existingEVCharger: "No"
            },
            projectTimeline: {
              startDate: "2024-10-20",
              expectedCompletion: "2024-12-20",
              installationDate: "2024-11-15",
              inspectionDate: "2024-12-10"
            },
            teamAssignment: {
              projectManager: "Sarah Miller",
              salesRep: "Tom Brown",
              installer: "David Lee",
              electrician: "Alex Chen"
            },
            projectNotes: "Large commercial installation. Requires crane access for ground mounting."
          }
        },
      ],
    },
    {
      id: "proposal-sent",
      title: "Proposal Sent",
      count: 6,
      leads: [
        { 
          id: "6", 
          title: "Davis Residence", 
          company: "Emily Davis", 
          value: "$16,200", 
          date: "Oct 9", 
          tags: ["Residential", "EV Charger"], 
          assignee: "JD", 
          priority: "high" as const,
          status: "Proposal Sent",
          comments: [],
          projectDetails: {
            systemType: "PV + EV Charger",
            propertyInfo: {
              houseStorey: "2",
              roofType: "Tile Terracotta",
              propertyType: "Residential",
              accessTo2ndStorey: "Yes",
              accessToInverter: "Partial",
              monitoring: "No",
              monitoringAmount: ""
            },
            utilityInfo: {
              preApprovalNumber: "PA-2024-003",
              distributor: "Ausgrid",
              meterNumber: "M345678"
            },
            systemInfo: {
              systemSize: "8.2kW",
              panelType: "Mono-crystalline",
              inverterType: "Micro Inverter",
              batterySize: "",
              mountingType: "Roof Mounted"
            },
            additionalInfo: {
              shading: "Moderate",
              roofCondition: "Good",
              electricalPanel: "200A",
              mainBreaker: "200A",
              subPanel: "No",
              existingSolar: "No",
              existingBattery: "No",
              existingEVCharger: "No"
            },
            projectTimeline: {
              startDate: "2024-10-25",
              expectedCompletion: "2024-11-25",
              installationDate: "2024-11-10",
              inspectionDate: "2024-11-20"
            },
            teamAssignment: {
              projectManager: "John Doe",
              salesRep: "Jane Smith",
              installer: "Mike Johnson",
              electrician: "Bob Wilson"
            },
            projectNotes: "Customer has Tesla Model 3. EV charger installation in garage."
          }
        },
      ],
    },
    {
      id: "sales-site-visit",
      title: "Sales Site Visit",
      count: 3,
      leads: [
        { 
          id: "7", 
          title: "Johnson Residence", 
          company: "Robert Johnson", 
          value: "$19,200", 
          date: "Oct 15", 
          tags: ["Residential", "Solar"], 
          assignee: "JD", 
          priority: "high" as const,
          status: "Sales Site Visit",
          comments: [],
          projectDetails: {
            systemType: "PV Only",
            propertyInfo: {
              houseStorey: "1",
              roofType: "ColorBond",
              propertyType: "Residential",
              accessTo2ndStorey: "N/A",
              accessToInverter: "Full",
              monitoring: "Yes",
              monitoringAmount: "Daily"
            },
            utilityInfo: {
              preApprovalNumber: "PA-2024-004",
              distributor: "Essential Energy",
              meterNumber: "M901234"
            },
            systemInfo: {
              systemSize: "6.6kW",
              panelType: "Mono-crystalline",
              inverterType: "String Inverter",
              batterySize: "",
              mountingType: "Roof Mounted"
            },
            additionalInfo: {
              shading: "Minimal",
              roofCondition: "Excellent",
              electricalPanel: "200A",
              mainBreaker: "200A",
              subPanel: "No",
              existingSolar: "No",
              existingBattery: "No",
              existingEVCharger: "No"
            },
            projectTimeline: {
              startDate: "2024-10-30",
              expectedCompletion: "2024-11-30",
              installationDate: "2024-11-15",
              inspectionDate: "2024-11-25"
            },
            teamAssignment: {
              projectManager: "John Doe",
              salesRep: "Jane Smith",
              installer: "Mike Johnson",
              electrician: "Bob Wilson"
            },
            projectNotes: "Site visit completed. Roof in excellent condition. North-facing roof ideal for solar."
          }
        },
      ],
    },
    {
      id: "site-visit-scheduled",
      title: "Site Visit Scheduled",
      count: 4,
      leads: [
        { 
          id: "8", 
          title: "Martinez Property", 
          company: "Carlos Martinez", 
          value: "$14,800", 
          date: "Oct 16", 
          tags: ["Residential"], 
          assignee: "JD", 
          priority: "high" as const,
          status: "Site Visit Scheduled",
          comments: [],
          projectDetails: {
            systemType: "PV + Battery",
            propertyInfo: {
              houseStorey: "2",
              roofType: "Tile Concrete",
              propertyType: "Residential",
              accessTo2ndStorey: "Yes",
              accessToInverter: "Full",
              monitoring: "Yes",
              monitoringAmount: "Weekly"
            },
            utilityInfo: {
              preApprovalNumber: "PA-2024-005",
              distributor: "Ausgrid",
              meterNumber: "M567890"
            },
            systemInfo: {
              systemSize: "7.4kW",
              panelType: "Mono-crystalline",
              inverterType: "Power Optimizer",
              batterySize: "13.5kWh",
              mountingType: "Roof Mounted"
            },
            additionalInfo: {
              shading: "Heavy",
              roofCondition: "Fair",
              electricalPanel: "200A",
              mainBreaker: "200A",
              subPanel: "Yes",
              existingSolar: "No",
              existingBattery: "No",
              existingEVCharger: "No"
            },
            projectTimeline: {
              startDate: "2024-11-05",
              expectedCompletion: "2024-12-05",
              installationDate: "2024-11-20",
              inspectionDate: "2024-11-30"
            },
            teamAssignment: {
              projectManager: "John Doe",
              salesRep: "Jane Smith",
              installer: "Mike Johnson",
              electrician: "Bob Wilson"
            },
            projectNotes: "Site visit scheduled for Oct 20th. Customer concerned about shading from large tree."
          }
        },
      ],
    },
    {
      id: "won",
      title: "Won",
      count: 24,
      leads: [
        { 
          id: "9", 
          title: "Anderson Home", 
          company: "Lisa Anderson", 
          value: "$17,500", 
          date: "Oct 5", 
          tags: ["Residential", "Solar"], 
          assignee: "SM", 
          priority: "low" as const,
          status: "Won",
          comments: [],
          projectDetails: {
            systemType: "PV + Battery + EV Charger",
            propertyInfo: {
              houseStorey: "2",
              roofType: "Tin KlipLock",
              propertyType: "Residential",
              accessTo2ndStorey: "Yes",
              accessToInverter: "Full",
              monitoring: "Yes",
              monitoringAmount: "Real-time"
            },
            utilityInfo: {
              preApprovalNumber: "PA-2024-006",
              distributor: "Essential Energy",
              meterNumber: "M123789"
            },
            systemInfo: {
              systemSize: "9.9kW",
              panelType: "Mono-crystalline",
              inverterType: "Micro Inverter",
              batterySize: "20kWh",
              mountingType: "Roof Mounted"
            },
            additionalInfo: {
              shading: "None",
              roofCondition: "Excellent",
              electricalPanel: "200A",
              mainBreaker: "200A",
              subPanel: "No",
              existingSolar: "No",
              existingBattery: "No",
              existingEVCharger: "No"
            },
            projectTimeline: {
              startDate: "2024-10-10",
              expectedCompletion: "2024-11-10",
              installationDate: "2024-10-25",
              inspectionDate: "2024-11-05"
            },
            teamAssignment: {
              projectManager: "Sarah Miller",
              salesRep: "Tom Brown",
              installer: "David Lee",
              electrician: "Alex Chen"
            },
            projectNotes: "Project completed successfully. Customer very satisfied with installation quality."
          }
        },
      ],
    },
    {
      id: "lost",
      title: "Lost",
      count: 8,
      leads: [
        { 
          id: "10", 
          title: "Wilson Property", 
          company: "Tom Wilson", 
          value: "$22,300", 
          date: "Oct 3", 
          tags: ["Residential", "Solar + Battery"], 
          assignee: "JD", 
          priority: "low" as const,
          status: "Lost",
          comments: [],
          projectDetails: {
            systemType: "PV + Battery",
            propertyInfo: {
              houseStorey: "2",
              roofType: "Tile Shilung+Terracotta",
              propertyType: "Residential",
              accessTo2ndStorey: "Yes",
              accessToInverter: "Full",
              monitoring: "Yes",
              monitoringAmount: "Monthly"
            },
            utilityInfo: {
              preApprovalNumber: "PA-2024-007",
              distributor: "Ausgrid",
              meterNumber: "M456123"
            },
            systemInfo: {
              systemSize: "8.5kW",
              panelType: "Mono-crystalline",
              inverterType: "String Inverter",
              batterySize: "15kWh",
              mountingType: "Roof Mounted"
            },
            additionalInfo: {
              shading: "Moderate",
              roofCondition: "Good",
              electricalPanel: "200A",
              mainBreaker: "200A",
              subPanel: "No",
              existingSolar: "No",
              existingBattery: "No",
              existingEVCharger: "No"
            },
            projectTimeline: {
              startDate: "2024-10-15",
              expectedCompletion: "2024-11-15",
              installationDate: "2024-10-30",
              inspectionDate: "2024-11-10"
            },
            teamAssignment: {
              projectManager: "John Doe",
              salesRep: "Jane Smith",
              installer: "Mike Johnson",
              electrician: "Bob Wilson"
            },
            projectNotes: "Project lost due to budget constraints. Customer chose competitor with lower price."
          }
        },
      ],
    },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLeadClick = (lead: Lead) => {
    console.log("Lead clicked:", lead);
    setSelectedLead(lead);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setShowProjectForm(false);
    setSelectedSystemType(""); // Reset system type when closing modal
    setOtherSelections({}); // Reset other selections when closing modal
  };

  const handleCreateProject = () => {
    setShowProjectForm(true);
    setSelectedSystemType(""); // Reset system type when opening form
    setOtherSelections({}); // Reset other selections
  };

  const handleOtherSelection = (fieldName: string, value: string) => {
    setOtherSelections(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = columns.find(col => col.id === source.droppableId);
    const finishColumn = columns.find(col => col.id === destination.droppableId);

    if (!startColumn || !finishColumn) {
      return;
    }

    if (startColumn === finishColumn) {
      const newLeads = Array.from(startColumn.leads);
      const [removed] = newLeads.splice(source.index, 1);
      newLeads.splice(destination.index, 0, removed);

      const newColumn = {
        ...startColumn,
        leads: newLeads,
      };

      setColumns(columns.map(col => col.id === newColumn.id ? newColumn : col));
    } else {
      const startLeads = Array.from(startColumn.leads);
      const [removed] = startLeads.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        leads: startLeads,
        count: startLeads.length,
      };

      const finishLeads = Array.from(finishColumn.leads);
      finishLeads.splice(destination.index, 0, removed);
      const newFinishColumn = {
        ...finishColumn,
        leads: finishLeads,
        count: finishLeads.length,
      };

      setColumns(columns.map(col => {
        if (col.id === newStartColumn.id) return newStartColumn;
        if (col.id === newFinishColumn.id) return newFinishColumn;
        return col;
      }));
    }
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() || !commentEmail.trim() || !selectedLead) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      author: commentEmail.split('@')[0],
      timestamp: new Date().toLocaleString(),
      email: commentEmail,
    };

    const updatedLead = {
      ...selectedLead,
      comments: [...(selectedLead.comments || []), newComment],
    };

    setSelectedLead(updatedLead);

    // Update the lead in the columns
    setColumns(columns.map(col => ({
      ...col,
      leads: col.leads.map(lead => 
        lead.id === selectedLead.id ? updatedLead : lead
      )
    })));

    setCommentText("");
    setShowCommentForm(false);
  };

  const handleBulkEmail = () => {
    alert("Bulk email functionality would be implemented here");
  };

  const handleNewLead = () => {
    alert("New lead form would open here");
  };

  const filteredLeads = columns.map(column => ({
    ...column,
    leads: column.leads.filter(lead => {
      const matchesSearch = lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSource = selectedSource === "all" || true; // Add source filtering logic
      const matchesProduct = selectedProduct === "all-products" || 
                            lead.tags.some(tag => tag.toLowerCase().includes(selectedProduct));
      return matchesSearch && matchesSource && matchesProduct;
    })
  }));

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1>Leads CRM</h1>
          <p className="text-muted-foreground">Manage your sales pipeline</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Action Buttons Row */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBulkEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Bulk Email
          </Button>
              <Button onClick={handleNewLead}>
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </Button>
      </div>

            {/* Filter Row */}
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative w-full md:w-48 flex-shrink-0">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search leads..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={handleSearch}
                />
            </div>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-full md:w-48 flex-shrink-0">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
              </SelectContent>
            </Select>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full md:w-48 flex-shrink-0">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-products">All Products</SelectItem>
                <SelectItem value="solar">Solar Only</SelectItem>
                <SelectItem value="battery">Battery</SelectItem>
                <SelectItem value="ev">EV Charger</SelectItem>
              </SelectContent>
            </Select>
              <Button variant="outline" className="flex-shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "list")}>
        <TabsList>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="w-full overflow-x-auto custom-scrollbar kanban-scroll-container" style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: '#cbd5e1 #f1f5f9',
              minHeight: '400px'
            }}>
              <div className="flex gap-4 pb-4 pr-4 min-w-max">
                {filteredLeads.map((column) => (
                  <div key={column.id} className="w-[320px] flex-shrink-0">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{column.title}</CardTitle>
                          <span className="bg-muted px-2 py-1 rounded">{column.leads.length}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                        <Droppable droppableId={column.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[200px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                            >
                              {column.leads.map((lead, index) => (
                                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`mb-3 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                    >
                                      <div {...provided.dragHandleProps} className="cursor-grab">
                                        <KanbanCard 
                                          {...lead} 
                                          onClick={() => handleLeadClick(lead)}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                    <Button variant="ghost" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Card
                    </Button>
                            </div>
                          )}
                        </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-left p-4">Lead</th>
                      <th className="text-left p-4">Company</th>
                      <th className="text-left p-4">Value</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.flatMap((col) =>
                      col.leads.map((lead, idx) => (
                        <tr key={`${col.id}-${idx}`} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">{lead.title}</td>
                          <td className="p-4">{lead.company}</td>
                          <td className="p-4">{lead.value}</td>
                          <td className="p-4">{lead.status || col.title}</td>
                          <td className="p-4">{lead.date}</td>
                          <td className="p-4">{lead.assignee || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedLead.title} - {selectedLead.company}</span>
                <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                  <X className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Project Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Value</Label>
                    <p className="text-lg font-semibold">{selectedLead.value}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                    <Badge variant={selectedLead.priority === "high" ? "destructive" : selectedLead.priority === "medium" ? "default" : "secondary"}>
                      {selectedLead.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                    <p>{selectedLead.date}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Select value={selectedLead.status || "New"} onValueChange={(value) => {
                      setSelectedLead({...selectedLead, status: value});
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In-progress">In-progress</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                        <SelectItem value="Sales Site Visit">Sales Site Visit</SelectItem>
                        <SelectItem value="Site Visit Scheduled">Site Visit Scheduled</SelectItem>
                        <SelectItem value="Won">Won</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Details */}
              {selectedLead.projectDetails && (
                <div className="space-y-6">
                  {/* System Information */}
                  {selectedLead.projectDetails.systemInfo && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">System Information</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedLead.projectDetails.systemInfo.systemSize && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">System Size</Label>
                            <p>{selectedLead.projectDetails.systemInfo.systemSize}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.systemInfo.panelType && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Panel Type</Label>
                            <p>{selectedLead.projectDetails.systemInfo.panelType}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.systemInfo.inverterType && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Inverter Type</Label>
                            <p>{selectedLead.projectDetails.systemInfo.inverterType}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.systemInfo.batterySize && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Battery Size</Label>
                            <p>{selectedLead.projectDetails.systemInfo.batterySize}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.systemInfo.mountingType && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Mounting Type</Label>
                            <p>{selectedLead.projectDetails.systemInfo.mountingType}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Property Information */}
                  {selectedLead.projectDetails.propertyInfo && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Property Information</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedLead.projectDetails.propertyInfo.houseStorey && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">House Storey</Label>
                            <p>{selectedLead.projectDetails.propertyInfo.houseStorey}{selectedLead.projectDetails.propertyInfo.houseStoreyOther && ` - ${selectedLead.projectDetails.propertyInfo.houseStoreyOther}`}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.propertyInfo.roofType && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Roof Type</Label>
                            <p>{selectedLead.projectDetails.propertyInfo.roofType}{selectedLead.projectDetails.propertyInfo.roofTypeOther && ` - ${selectedLead.projectDetails.propertyInfo.roofTypeOther}`}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.propertyInfo.propertyType && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Property Type</Label>
                            <p>{selectedLead.projectDetails.propertyInfo.propertyType}{selectedLead.projectDetails.propertyInfo.propertyTypeOther && ` - ${selectedLead.projectDetails.propertyInfo.propertyTypeOther}`}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.propertyInfo.accessTo2ndStorey && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Access To 2nd Storey</Label>
                            <p>{selectedLead.projectDetails.propertyInfo.accessTo2ndStorey}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.propertyInfo.accessToInverter && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Access To Inverter</Label>
                            <p>{selectedLead.projectDetails.propertyInfo.accessToInverter}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.propertyInfo.monitoring && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Monitoring</Label>
                            <p>{selectedLead.projectDetails.propertyInfo.monitoring}{selectedLead.projectDetails.propertyInfo.monitoringAmount && ` - ${selectedLead.projectDetails.propertyInfo.monitoringAmount}`}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Utility Information */}
                  {selectedLead.projectDetails.utilityInfo && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Utility Information</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedLead.projectDetails.utilityInfo.preApprovalNumber && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Pre-Approval Number</Label>
                            <p>{selectedLead.projectDetails.utilityInfo.preApprovalNumber}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.utilityInfo.distributor && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Distributor</Label>
                            <p>{selectedLead.projectDetails.utilityInfo.distributor}</p>
                          </div>
                        )}
                        {selectedLead.projectDetails.utilityInfo.meterNumber && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Meter Number</Label>
                            <p>{selectedLead.projectDetails.utilityInfo.meterNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  {selectedLead.projectDetails.additionalInfo && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Additional Information</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(selectedLead.projectDetails.additionalInfo).map(([key, value]) => (
                          value && (
                            <div key={key} className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Label>
                              <p>{value}</p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Timeline */}
                  {selectedLead.projectDetails.projectTimeline && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Project Timeline</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(selectedLead.projectDetails.projectTimeline).map(([key, value]) => (
                          value && (
                            <div key={key} className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Label>
                              <p>{value}</p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Team Assignment */}
                  {selectedLead.projectDetails.teamAssignment && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Team Assignment</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(selectedLead.projectDetails.teamAssignment).map(([key, value]) => (
                          value && (
                            <div key={key} className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Label>
                              <p>{value}</p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Notes */}
                  {selectedLead.projectDetails.projectNotes && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Project Notes</h3>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {selectedLead.projectDetails.projectNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Comments</h3>
                
                {/* Display existing comments */}
                {selectedLead.comments && selectedLead.comments.length > 0 && (
                  <div className="space-y-3">
                    {selectedLead.comments.map((comment) => (
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
                    ))}
                  </div>
                )}

                {/* Add new comment form */}
                <div className="border-t pt-4">
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmitComment(); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="modal-comment-email">Your Email</Label>
                      <Input
                        id="modal-comment-email"
                        type="email"
                        placeholder="Enter your email"
                        value={commentEmail || userEmail || ""}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modal-comment-text">Add a comment</Label>
                      <Textarea
                        id="modal-comment-text"
                        placeholder="Write your comment here..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Comment
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setCommentText("")}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowProjectForm(true);
                }} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project from Lead
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Project Creation Form Modal */}
      {showProjectForm && selectedLead && (
        <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Create Project from Lead - {selectedLead.title}</span>
                <Button variant="ghost" size="sm" onClick={() => setShowProjectForm(false)}>
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
                    <Input defaultValue={selectedLead.title} />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input defaultValue={selectedLead.value} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue="In-progress">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In-progress">In-progress</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                        <SelectItem value="Sales Site Visit">Sales Site Visit</SelectItem>
                        <SelectItem value="Site Visit Scheduled">Site Visit Scheduled</SelectItem>
                        <SelectItem value="Won">Won</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select>
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
                    <Select>
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

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name*</Label>
                    <Input defaultValue={selectedLead.company} />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Email*</Label>
                    <Input placeholder="customer@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Contact Number*</Label>
                    <Input placeholder="+61 4XX XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Address*</Label>
                    <Input placeholder="Start typing address..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Location (Google Maps)</Label>
                    <Input placeholder="Search location" />
                  </div>
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
                        <Input placeholder="e.g., 6.6" />
                      </div>
                      
                      {/* Inverter Size - Show for PV systems */}
                      {(selectedSystemType.includes('pv') || selectedSystemType.includes('battery')) && (
                        <div className="space-y-2">
                          <Label>Inverter Size (kW)</Label>
                          <Input placeholder="e.g., 5.0" />
                        </div>
                      )}
                      
                      {/* Battery Size - Show for battery systems */}
                      {(selectedSystemType.includes('battery')) && (
                        <div className="space-y-2">
                          <Label>Battery Size (kWh)</Label>
                          <Input placeholder="e.g., 10.0" />
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
                    
                    {/* Right Column - Brands and Power Ratings */}
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
                              <SelectItem value="sonnen">Sonnen</SelectItem>
                              <SelectItem value="enphase">Enphase</SelectItem>
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
                      
                      {/* EV Charger Power - Show for EV charger systems */}
                      {(selectedSystemType.includes('ev-charger')) && (
                        <div className="space-y-2">
                          <Label>EV Charger Power (kW)</Label>
                          <Select onValueChange={(value) => handleOtherSelection('evChargerPower', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Power Rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3.7">3.7 kW</SelectItem>
                              <SelectItem value="7.4">7.4 kW</SelectItem>
                              <SelectItem value="11">11 kW</SelectItem>
                              <SelectItem value="22">22 kW</SelectItem>
                              <SelectItem value="50">50 kW</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {otherSelections.evChargerPower === 'other' && (
                            <Textarea 
                              placeholder="Please specify EV charger power..." 
                              className="min-h-[40px]"
                              value={otherSelections.evChargerPowerOther || ''}
                              onChange={(e) => handleOtherSelection('evChargerPowerOther', e.target.value)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Utility Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Utility Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Pre-Approval Number</Label>
                    <Input placeholder="Enter pre-approval number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Distributor</Label>
                    <Input placeholder="Enter distributor" />
                  </div>
                  <div className="space-y-2">
                    <Label>Meter Number</Label>
                    <Input placeholder="Enter meter number" />
                  </div>
                </div>
              </div>


              {/* Team Assignment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Team Assignment</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Project Manager</Label>
                    <Input placeholder="Enter project manager" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sales Rep</Label>
                    <Input placeholder="Enter sales rep" />
                  </div>
                  <div className="space-y-2">
                    <Label>Installer</Label>
                    <Input placeholder="Enter installer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Electrician</Label>
                    <Input placeholder="Enter electrician" />
                  </div>
                </div>
              </div>

              {/* Project Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Notes</h3>
                <Textarea 
                  placeholder="Enter any additional notes or special requirements..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={() => {
                  // Move lead to In-Progress column
                  const updatedColumns = columns.map(col => {
                    if (col.id === "in-progress") {
                      return {
                        ...col,
                        leads: [...col.leads, { ...selectedLead, status: "In-progress" }],
                        count: col.leads.length + 1
                      };
                    }
                    if (col.id === "new") {
                      return {
                        ...col,
                        leads: col.leads.filter(lead => lead.id !== selectedLead.id),
                        count: col.leads.length - 1
                      };
                    }
                    return col;
                  });
                  setColumns(updatedColumns);
                  setShowProjectForm(false);
                  setSelectedLead(null);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
                <Button variant="outline" onClick={() => setShowProjectForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}