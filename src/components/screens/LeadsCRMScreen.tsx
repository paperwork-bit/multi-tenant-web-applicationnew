import React, { useState, useEffect } from "react";
import { subscribeDoc, writeDocSafe } from "../../lib/persistence";
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
  description?: string;
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
  
  const [commentText, setCommentText] = useState("");
  const [commentEmail, setCommentEmail] = useState(userEmail || "");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedSystemType, setSelectedSystemType] = useState<string>("");
  const [otherSelections, setOtherSelections] = useState<{[key: string]: string}>({});

  // New Lead dialog state
  const [showNewLead, setShowNewLead] = useState(false);
  // Create Project dialog state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    status: "new",
    systemType: "pv-only",
    price: "",
    projectId: "",
    startDate: "",
    notes: "",
    clientType: "residential",
    customerName: "",
    customerEmail: "",
    customerContact: "",
    customerAddress: "",
    location: "",
    houseStorey: "",
    houseStoreyOther: "",
    roofType: "",
    accessSecondStorey: "",
    accessInverter: "",
    monitoring: "",
    monitoringAmount: "",
    stcPortal: "",
    // Team assignment
    salesRep: "",
    projectManager: "",
    leadInstaller: "",
    electrician: "",
    // Utility info
    preApprovalNumber: "",
    distributor: "",
    meterNumber: "",
  });
  const [newLeadForm, setNewLeadForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

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
      count: 0,
      leads: []
    },
    {
      id: "contacted",
      title: "Contacted",
      count: 0,
      leads: []
    },
    {
      id: "qualified",
      title: "Qualified",
      count: 0,
      leads: []
    },
    {
      id: "sales-site-visit",
      title: "Sales Site Visit",
      count: 0,
      leads: []
    },
    {
      id: "on-field-inspection",
      title: "On-Field Inspection",
      count: 0,
      leads: []
    },
    {
      id: "proposal",
      title: "Proposal Sent",
      count: 0,
      leads: []
    },
    {
      id: "negotiation",
      title: "Negotiation",
      count: 0,
      leads: []
    },
    {
      id: "closed-won",
      title: "Closed Won",
      count: 0,
      leads: []
    },
    {
      id: "closed-lost",
      title: "Closed Lost",
      count: 0,
      leads: []
    }
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
    setSelectedSystemType("");
    setOtherSelections({});
  };

  const handleCreateProject = () => {
    if (!selectedLead) return;
    const autoId = `PRJ-${Date.now().toString().slice(-6)}`;
    setProjectForm({
      title: selectedLead.title,
      status: 'new',
      systemType: 'pv-only',
      price: '',
      projectId: autoId,
      startDate: new Date().toISOString().split('T')[0],
      notes: selectedLead.description || '',
      clientType: '',
      customerName: selectedLead.title,
      customerEmail: (selectedLead.tags && selectedLead.tags[0]) || '',
      customerContact: selectedLead.value || '',
      customerAddress: selectedLead.company || '',
    });
    setShowProjectForm(true);
  };

  const handleSubmitProject = async () => {
    if (!selectedLead) return;
    if (!projectForm.title.trim()) { alert('Project title is required'); return; }
    const projectId = Date.now().toString();
    const projectPayload = {
      id: projectId,
      title: projectForm.title.trim(),
      status: projectForm.status,
      systemType: projectForm.systemType,
      price: projectForm.price || null,
      projectCode: projectForm.projectId,
      startDate: projectForm.startDate || null,
      notes: projectForm.notes || null,
      // derived from lead
      leadId: selectedLead.id,
      clientType: projectForm.clientType,
      customerName: projectForm.customerName,
      customerEmail: projectForm.customerEmail,
      customerPhone: projectForm.customerContact,
      customerAddress: projectForm.customerAddress,
      location: projectForm.location || null,
      propertyInfo: {
        houseStorey: projectForm.houseStorey === 'other' ? (projectForm.houseStoreyOther || 'other') : (projectForm.houseStorey || null),
        roofType: projectForm.roofType || null,
        accessSecondStorey: projectForm.accessSecondStorey || null,
        accessToInverter: projectForm.accessInverter || null,
      },
      additionalInfo: {
        monitoring: projectForm.monitoring || null,
        monitoringAmount: projectForm.monitoring === 'yes' ? (projectForm.monitoringAmount || null) : null,
        stcPortal: projectForm.stcPortal || null,
      },
      teamAssignment: {
        salesRep: projectForm.salesRep || null,
        projectManager: projectForm.projectManager || null,
        leadInstaller: projectForm.leadInstaller || null,
        electrician: projectForm.electrician || null,
      },
      utilityInfo: {
        preApprovalNumber: projectForm.preApprovalNumber || null,
        distributor: projectForm.distributor || null,
        meterNumber: projectForm.meterNumber || null,
      },
      createdAt: new Date().toISOString(),
    };
    await writeDocSafe('projects', projectId, projectPayload);
    try { localStorage.setItem('xtr_projects', JSON.stringify([projectPayload, ...JSON.parse(localStorage.getItem('xtr_projects') || '[]')])); } catch {}
    setShowProjectForm(false);
    alert('Project created successfully. You can manage it in Project Management.');
  };

  const handleOtherSelection = (fieldName: string, value: string) => {
    setOtherSelections(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const persistColumns = (nextColumns: any[]) => {
    setColumns(nextColumns);
    // Save as a single doc payload
    writeDocSafe('leads_state', 'columns', { columns: nextColumns });
  };

  useEffect(() => {
    const order = [
      'new','contacted','qualified','sales-site-visit','on-field-inspection','proposal','negotiation','closed-won','closed-lost'
    ];
    const migrate = (cols: any[]): any[] => {
      const byId: Record<string, any> = {};
      (cols || []).forEach(c => { byId[c.id] = c; });
      if (byId['closed']) {
        byId['closed-won'] = { ...byId['closed'], id: 'closed-won', title: 'Closed Won' };
        delete byId['closed'];
      }
      return order.map(id => byId[id] ? { ...byId[id] } : { id, title: columns.find(c => c.id === id)?.title || id, count: 0, leads: [] });
    };
    const unsub = subscribeDoc<{ columns: any[] }>('leads_state', 'columns', (data) => {
      if (data && Array.isArray(data.columns)) {
        const next = migrate(data.columns as any);
        setColumns(next as any);
        writeDocSafe('leads_state','columns',{ columns: next });
      }
    });
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;

    const draggedLead = { ...sourceColumn.leads[source.index] };
    draggedLead.status = destination.droppableId;

    const newColumns = columns.map(column => {
      if (column.id === source.droppableId) {
        const newLeads = [...column.leads];
        newLeads.splice(source.index, 1);
        return { ...column, leads: newLeads, count: newLeads.length };
      }
      if (column.id === destination.droppableId) {
        const newLeads = [...column.leads];
        newLeads.splice(destination.index, 0, draggedLead);
        return { ...column, leads: newLeads, count: newLeads.length };
      }
      return column;
    });

    // If the side panel is open for this lead, reflect the new status
    if (selectedLead && selectedLead.id === draggedLead.id) {
      setSelectedLead({ ...selectedLead, status: draggedLead.status });
    }

    persistColumns(newColumns);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() || !selectedLead) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      author: commentEmail.split('@')[0] || "Anonymous",
      email: commentEmail,
      timestamp: new Date().toLocaleString()
    };

    const updatedColumns = columns.map(column => ({
      ...column,
      leads: column.leads.map(lead => 
        lead.id === selectedLead.id 
          ? { ...lead, comments: [...(lead.comments || []), newComment] }
          : lead
      )
    }));

    persistColumns(updatedColumns);
    setSelectedLead({
      ...selectedLead,
      comments: [...(selectedLead.comments || []), newComment]
    });

    setCommentText("");
    setShowCommentForm(false);
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    leads: column.leads.filter(lead => 
      lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads CRM</h1>
          <p className="text-muted-foreground">Manage and track your sales leads</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("kanban")}
            >
              <Grid className="w-4 h-4 mr-2" />
              Kanban
          </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="w-4 h-4 mr-2" />
              List
          </Button>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 w-64"
            />
            </div>
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-products">All Products</SelectItem>
                <SelectItem value="pv-only">PV Only</SelectItem>
                <SelectItem value="pv-battery">PV + Battery</SelectItem>
                <SelectItem value="battery-only">Only Battery</SelectItem>
                <SelectItem value="ev-only">Only EV Charger</SelectItem>
                <SelectItem value="pv-battery-ev">PV + Battery + EV Charger</SelectItem>
                <SelectItem value="battery-ev">Battery + EV Charger</SelectItem>
                <SelectItem value="pv-ev">PV + EV Charger</SelectItem>
              </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Bulk Email
          </Button>
          <Button size="sm" onClick={() => setShowNewLead(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </Button>
          <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {filteredColumns.map((column) => (
              <div key={column.id} className="min-w-[300px] flex-shrink-0">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{column.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {column.leads.length}
                      </Badge>
                    </div>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3 min-h-[200px]"
                      >
                        {column.leads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <KanbanCard
                                  title={lead.title}
                                  subtitle={lead.company}
                                  date={lead.date}
                                  tags={lead.tags}
                                  assignee={lead.assignee}
                                  onClick={() => handleLeadClick(lead)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* List View */}
      {view === "list" && (
          <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredColumns.flatMap(column => column.leads).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleLeadClick(lead)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium">{lead.title}</h4>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    </div>
                    <div className="flex gap-2">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{lead.value}</p>
                      <p className="text-sm text-muted-foreground">{lead.date}</p>
                    </div>
                    <Badge
                      variant={
                        lead.priority === "high"
                          ? "destructive"
                          : lead.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {lead.priority}
                    </Badge>
                  </div>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>
      )}

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedLead?.title} - Lead Details</span>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Lead Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <p className="text-sm">{selectedLead.company}</p>
                </div>
                <div>
                  <Label>Value</Label>
                  <p className="text-sm">{selectedLead.value}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="text-sm">{selectedLead.date}</p>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge
                    variant={
                      selectedLead.priority === "high"
                        ? "destructive"
                        : selectedLead.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedLead.priority}
                  </Badge>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-1">
                  {selectedLead.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Comments</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCommentForm(!showCommentForm)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>

                {showCommentForm && (
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                    <div>
                      <Label htmlFor="comment-email">Email</Label>
                      <Input
                        id="comment-email"
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        placeholder="your.email@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="comment-text">Comment</Label>
                      <Textarea
                        id="comment-text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add your comment..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSubmitComment}>
                        Submit Comment
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCommentForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedLead.comments?.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            ({comment.email})
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                  {(!selectedLead.comments || selectedLead.comments.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No comments yet. Add the first comment above.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleCreateProject} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project from Lead
                </Button>
                <Button variant="outline" onClick={handleCloseModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Lead Dialog */}
      <Dialog open={showNewLead} onOpenChange={setShowNewLead}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Customer Name</Label>
              <Input value={newLeadForm.customerName} onChange={(e) => setNewLeadForm({ ...newLeadForm, customerName: e.target.value })} placeholder="Full name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Email</Label>
                <Input type="email" value={newLeadForm.email} onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })} placeholder="customer@email.com" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={newLeadForm.phone} onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })} placeholder="+61 400 000 000" />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input value={newLeadForm.address} onChange={(e) => setNewLeadForm({ ...newLeadForm, address: e.target.value })} placeholder="Street, City" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={newLeadForm.description} onChange={(e) => setNewLeadForm({ ...newLeadForm, description: e.target.value })} placeholder="Describe the lead/request" rows={3} />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={() => {
              if (!newLeadForm.customerName.trim()) { alert('Customer name is required'); return; }
              const newLead: Lead = {
                id: Date.now().toString(),
                title: newLeadForm.customerName.trim(),
                company: newLeadForm.address.trim() || '—',
                value: newLeadForm.phone.trim() || '—',
                date: new Date().toISOString().split('T')[0],
                tags: newLeadForm.email ? [newLeadForm.email.trim()] : [],
                priority: 'medium',
                description: newLeadForm.description.trim() || undefined,
                status: 'new',
              };
              const updated = columns.map(col => col.id === 'new' ? { ...col, leads: [newLead, ...col.leads], count: col.leads.length + 1 } : col);
              persistColumns(updated);
              setShowNewLead(false);
              setNewLeadForm({ customerName: '', email: '', phone: '', address: '', description: '' });
            }}>Add Lead</Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowNewLead(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Project from Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-1">
                <Label>Status</Label>
                <Select value={projectForm.status} onValueChange={(v) => setProjectForm({ ...projectForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="sales-site-visit">Sales Site Visit</SelectItem>
                    <SelectItem value="on-field-inspection">On-Field Inspection</SelectItem>
                    <SelectItem value="proposal">Proposal Sent</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label>System Type</Label>
                <Select value={projectForm.systemType} onValueChange={(v) => setProjectForm({ ...projectForm, systemType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pv-only">PV Only</SelectItem>
                    <SelectItem value="pv-battery">PV + Battery</SelectItem>
                    <SelectItem value="battery-only">Only Battery</SelectItem>
                    <SelectItem value="ev-only">Only EV Charger</SelectItem>
                    <SelectItem value="pv-battery-ev">PV + Battery + EV Charger</SelectItem>
                    <SelectItem value="battery-ev">Battery + EV Charger</SelectItem>
                    <SelectItem value="pv-ev">PV + EV Charger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label>Price (AUD)</Label>
                <Input value={projectForm.price} onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })} placeholder="$" />
              </div>
              <div className="col-span-1">
                <Label>Project ID</Label>
                <Input value={projectForm.projectId} readOnly />
              </div>
            </div>
            <div>
              <Label>Project Title</Label>
              <Input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project title" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={projectForm.startDate} onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })} />
              </div>
              
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Client Type</Label>
                <Select value={projectForm.clientType} onValueChange={(v) => setProjectForm({ ...projectForm, clientType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Client Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Customer Name</Label>
                <Input value={projectForm.customerName} onChange={(e) => setProjectForm({ ...projectForm, customerName: e.target.value })} placeholder="Customer name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Customer Email</Label>
                <Input value={projectForm.customerEmail} onChange={(e) => setProjectForm({ ...projectForm, customerEmail: e.target.value })} placeholder="customer@email.com" />
              </div>
              <div>
                <Label>Customer Contact</Label>
                <Input value={projectForm.customerContact} onChange={(e) => setProjectForm({ ...projectForm, customerContact: e.target.value })} placeholder="+61 ..." />
              </div>
            </div>
            <div>
              <Label>Customer Address</Label>
              <Input value={projectForm.customerAddress} onChange={(e) => setProjectForm({ ...projectForm, customerAddress: e.target.value })} placeholder="Street, City" />
            </div>
            <div>
              <Label>Location (Google Maps)</Label>
              <Input value={projectForm.location} onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })} placeholder="Search location" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea rows={3} value={projectForm.notes} onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })} placeholder="Additional notes" />
            </div>
            

            {/* Property Information & Additional Information */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-2">Property Information</p>
                <div className="space-y-3">
                  <div>
                    <Label>House Storey</Label>
                    <Select value={projectForm.houseStorey} onValueChange={(v) => setProjectForm({ ...projectForm, houseStorey: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Storey" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="triple">Triple</SelectItem>
                        <SelectItem value="other">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {projectForm.houseStorey === 'other' && (
                      <div className="mt-2">
                        <Label>Specify Storey</Label>
                        <Textarea rows={2} value={projectForm.houseStoreyOther} onChange={(e) => setProjectForm({ ...projectForm, houseStoreyOther: e.target.value })} placeholder="Describe the house storey" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Roof Type</Label>
                    <Select value={projectForm.roofType} onValueChange={(v) => setProjectForm({ ...projectForm, roofType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Roof Type" />
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Access To 2nd Storey</Label>
                    <Select value={projectForm.accessSecondStorey} onValueChange={(v) => setProjectForm({ ...projectForm, accessSecondStorey: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="na">NA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Access To Inverter</Label>
                    <Select value={projectForm.accessInverter} onValueChange={(v) => setProjectForm({ ...projectForm, accessInverter: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="none">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-2">Additional Information</p>
                <div className="space-y-3">
                  <div>
                    <Label>Monitoring</Label>
                    <Select value={projectForm.monitoring} onValueChange={(v) => setProjectForm({ ...projectForm, monitoring: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    {projectForm.monitoring === 'yes' && (
                      <div className="mt-2">
                        <Label>How Much?</Label>
                        <Textarea rows={2} value={projectForm.monitoringAmount} onChange={(e) => setProjectForm({ ...projectForm, monitoringAmount: e.target.value })} placeholder="Enter amount/details" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>STC's Processed Using Which Portal?</Label>
                    <Input value={projectForm.stcPortal} onChange={(e) => setProjectForm({ ...projectForm, stcPortal: e.target.value })} placeholder="Portal name" />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Assignment & Utility Information */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-2">Team Assignment</p>
                <div className="space-y-3">
                  <div>
                    <Label>Sales Representative</Label>
                    <Input value={projectForm.salesRep} onChange={(e) => setProjectForm({ ...projectForm, salesRep: e.target.value })} placeholder="e.g., John Smith" />
                  </div>
                  <div>
                    <Label>Project Manager</Label>
                    <Input value={projectForm.projectManager} onChange={(e) => setProjectForm({ ...projectForm, projectManager: e.target.value })} placeholder="e.g., Sarah Wilson" />
                  </div>
                  <div>
                    <Label>Lead Installer</Label>
                    <Input value={projectForm.leadInstaller} onChange={(e) => setProjectForm({ ...projectForm, leadInstaller: e.target.value })} placeholder="e.g., Mike Johnson" />
                  </div>
                  <div>
                    <Label>Electrician</Label>
                    <Input value={projectForm.electrician} onChange={(e) => setProjectForm({ ...projectForm, electrician: e.target.value })} placeholder="e.g., Tony Martinez" />
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-2">Utility Information</p>
                <div className="space-y-3">
                  <div>
                    <Label>Pre-Approval Number</Label>
                    <Input value={projectForm.preApprovalNumber} onChange={(e) => setProjectForm({ ...projectForm, preApprovalNumber: e.target.value })} placeholder="Pre-Approval Number" />
                  </div>
                  <div>
                    <Label>Distributor</Label>
                    <Input value={projectForm.distributor} onChange={(e) => setProjectForm({ ...projectForm, distributor: e.target.value })} placeholder="e.g., AusNet Services" />
                  </div>
                  <div>
                    <Label>Meter Number</Label>
                    <Input value={projectForm.meterNumber} onChange={(e) => setProjectForm({ ...projectForm, meterNumber: e.target.value })} placeholder="Meter Number" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={handleSubmitProject}>Create Project</Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowProjectForm(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
