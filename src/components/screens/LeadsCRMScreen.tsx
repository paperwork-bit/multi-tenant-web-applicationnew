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
      id: "closed",
      title: "Closed Won",
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
    setShowProjectForm(true);
    setSelectedSystemType("");
    setOtherSelections({});
  };

  const handleOtherSelection = (fieldName: string, value: string) => {
    setOtherSelections(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;

    const draggedLead = sourceColumn.leads[source.index];
    
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

    setColumns(newColumns);
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

    setColumns(updatedColumns);
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
              <SelectItem value="solar">Solar Only</SelectItem>
              <SelectItem value="battery">Battery Only</SelectItem>
              <SelectItem value="solar-battery">Solar + Battery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Bulk Email
          </Button>
          <Button size="sm">
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
                                  value={lead.value}
                                  date={lead.date}
                                  tags={lead.tags}
                                  priority={lead.priority}
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
    </div>
  );
}
