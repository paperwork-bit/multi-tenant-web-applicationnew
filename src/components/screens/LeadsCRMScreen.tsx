import React, { useState, useEffect } from "react";
import { db, firebaseEnabled } from "../../lib/firebase";
import { addDoc, collection, setDoc, doc, onSnapshot } from "firebase/firestore";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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
      projectManager?: string | string[];
      salesRep?: string | string[];
      leadElectrician?: string | string[];
      apprentice?: string | string[];
    };
    projectNotes?: string;
  };
  linkedProject?: { id: string; title: string };
  projectSnapshot?: any;
}

interface ProjectFormState {
  title: string;
  status: string;
  systemType: string;
  price: string;
  projectId: string;
  startDate: string;
  notes: string;
  clientType: string;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  customerAddress: string;
  location: string;
  houseStorey: string;
  houseStoreyOther: string;
  roofType: string;
  accessSecondStorey: string;
  accessInverter: string;
  monitoring: string;
  monitoringAmount: string;
  stcPortal: string;
  salesRep: string[];
  projectManager: string[];
  leadElectrician: string[];
  apprentice: string[];
  preApprovalNumber: string;
  distributor: string;
  meterNumber: string;
  nmiNumber: string;
  energyRetailer: string;
  solarVictoriaEligible: string;
  meterPhase: string;
  // System Information
  systemSize: string;
  panelBrand: string;
  panelModuleWatts: string;
  inverterBrand: string;
  inverterSize: string;
  batterySize: string;
  batteryBrand: string;
  batteryModel: string;
  evChargerBrand: string;
  evChargerModel: string;
  mountingType: string;
}

const createInitialProjectForm = (): ProjectFormState => ({
  title: "",
  status: "new",
  systemType: "",
  price: "",
  projectId: "",
  startDate: "",
  notes: "",
  clientType: "",
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
  salesRep: [],
  projectManager: [],
  leadElectrician: [],
  apprentice: [],
  preApprovalNumber: "",
  distributor: "",
  meterNumber: "",
  nmiNumber: "",
  energyRetailer: "",
  solarVictoriaEligible: "",
  meterPhase: "",
  // System Information
  systemSize: "",
  panelBrand: "",
  panelModuleWatts: "",
  inverterBrand: "",
  inverterSize: "",
  batterySize: "",
  batteryBrand: "",
  batteryModel: "",
  evChargerBrand: "",
  evChargerModel: "",
  mountingType: "",
});

interface ResourceMultiSelectProps {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  options: string[];
}

const ResourceMultiSelect: React.FC<ResourceMultiSelectProps> = ({ label, value, onChange, placeholder, options }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((n) => n !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const displayText = value.length ? value.join(", ") : placeholder;
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Label>{label}</Label>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setSearchTerm("");
          }
        }}
        modal={false}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
            type="button"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className={displayText ? "truncate" : "text-muted-foreground"}>{displayText || placeholder}</span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start" sideOffset={4}>
          <div className="p-2 space-y-2">
            <Input
              autoFocus
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted-foreground">No resources found.</p>
              ) : (
                filteredOptions.map((option) => {
                  const selected = value.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted"
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleOption(option)}
                      />
                      <span className="truncate text-sm">{option}</span>
                    </label>
                  );
                })
              )}
            </div>
            {value.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                type="button"
                onClick={() => onChange([])}
              >
                Clear selection
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export function LeadsCRMScreen({ userEmail }: LeadsCRMScreenProps) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all-products");
  const [salesVisitsFs, setSalesVisitsFs] = useState<any[]>([]);
  const [onFieldFs, setOnFieldFs] = useState<any[]>([]);
  const [pmProjectsFs, setPmProjectsFs] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const [commentText, setCommentText] = useState("");
  const [commentEmail, setCommentEmail] = useState(userEmail || "");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedSystemType, setSelectedSystemType] = useState<string>("");
  const [otherSelections, setOtherSelections] = useState<{[key: string]: string}>({});
  const [pendingStatus, setPendingStatus] = useState<string>("new");

  // New Lead dialog state
  const [showNewLead, setShowNewLead] = useState(false);
  // Create Project dialog state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(() => createInitialProjectForm());
  const [newLeadForm, setNewLeadForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  // Team Assignment UI removed per request; resources are no longer loaded here

  // Update commentEmail when userEmail prop changes
  useEffect(() => {
    console.log("LeadsCRMScreen userEmail prop:", userEmail);
    if (userEmail) {
      setCommentEmail(userEmail);
      console.log("Comment email set to:", userEmail);
    }
  }, [userEmail]);

  // Subscribe to sales site visits from Firestore for cross-device visibility
  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsub = onSnapshot(collection(db, 'site_visits'), (snap: any) => {
          const arr = snap?.docs?.map((d: any) => d?.data && typeof d.data === 'function' ? d.data() : d?.data()) || [];
          if (Array.isArray(arr)) setSalesVisitsFs(arr as any);
        });
      } catch {}
    }
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsub = onSnapshot(collection(db, 'onfield_site_visits'), (snap: any) => {
          const arr = snap?.docs?.map((d: any) => d?.data && typeof d.data === 'function' ? d.data() : d?.data()) || [];
          if (Array.isArray(arr)) setOnFieldFs(arr as any);
        });
      } catch {}
    }
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  // PM projects cross-device snapshot for backfilling projectSnapshot on attach
  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsub = onSnapshot(collection(db, 'pm_projects'), (snap: any) => {
          const arr = snap?.docs?.map((d: any) => d?.data && typeof d.data === 'function' ? d.data() : d?.data()) || [];
          if (Array.isArray(arr)) setPmProjectsFs(arr as any);
        });
      } catch {}
    }
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  useEffect(() => {
    if (selectedLead) {
      setPendingStatus(selectedLead.status || 'new');
    }
  }, [selectedLead]);

  // Backfill project snapshot on selected lead if missing (local or Firestore PM projects)
  useEffect(() => {
    if (!selectedLead) return;
    const hasSnap = (selectedLead as any).projectSnapshot;
    if (hasSnap) return;
    try {
      const raw = localStorage.getItem('xtr_projects');
      const arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) {
        const name = (selectedLead as any)?.title;
        const addr = (selectedLead as any)?.company;
        const email = (selectedLead as any)?.tags?.[0];
        const match = arr.find((p: any) => (
          (name && p.customerName === name) || (email && p.customerEmail === email) || (addr && p.customerAddress === addr)
        ));
        if (match) { setSelectedLead({ ...(selectedLead as any), projectSnapshot: match } as any); return; }
      }
    } catch {}
    if (Array.isArray(pmProjectsFs) && pmProjectsFs.length > 0) {
      try {
        const name = (selectedLead as any)?.title;
        const addr = (selectedLead as any)?.company;
        const email = (selectedLead as any)?.tags?.[0];
        const matchFs = pmProjectsFs.find((p: any) => (
          (name && p.customerName === name) || (email && p.customerEmail === email) || (addr && p.customerAddress === addr)
        ));
        if (matchFs) { setSelectedLead({ ...(selectedLead as any), projectSnapshot: matchFs } as any); }
      } catch {}
    }
  }, [selectedLead, pmProjectsFs]);

  // Listen for site visit save events to attach data and move status
  useEffect(() => {
    const onAttachSiteVisit = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as any;
        const { leadId, siteVisit } = detail || {};
        if (!siteVisit) return;
        setColumns((prevCols: any) => {
          if (!prevCols) return prevCols;
          // Locate the lead either by provided id or by matching customer/email/address
          let sourceIdx = -1;
          let leadIdx = -1;
          let lead: any = null;
          if (leadId) {
            sourceIdx = prevCols.findIndex((c: any) => (c.leads || []).some((l: any) => String(l.id) === String(leadId)));
            if (sourceIdx !== -1) {
              leadIdx = prevCols[sourceIdx].leads.findIndex((l: any) => String(l.id) === String(leadId));
              lead = prevCols[sourceIdx].leads[leadIdx];
            }
          }
          if (!lead) {
            const svName = String(siteVisit.customerName || '').trim().toLowerCase();
            const svEmail = String(siteVisit.customerEmail || '').trim().toLowerCase();
            const svAddr = String(siteVisit.propertyAddress || '').trim().toLowerCase();
            prevCols.forEach((c: any, ci: number) => {
              const idx = (c.leads || []).findIndex((l: any) => {
                const lName = String(l.title || '').trim().toLowerCase();
                const lEmail = l.tags && l.tags[0] ? String(l.tags[0]).trim().toLowerCase() : '';
                const lAddr = String(l.company || '').trim().toLowerCase();
                return (svName && svName === lName) || (svEmail && svEmail === lEmail) || (svAddr && svAddr === lAddr);
              });
              if (idx >= 0 && lead == null) { sourceIdx = ci; leadIdx = idx; lead = c.leads[idx]; }
            });
          }
          if (!lead || sourceIdx === -1 || leadIdx === -1) {
            // If no matching lead found on board, upsert a lightweight card into Sales Site Visit
            const nextCols = prevCols.map((c: any) => ({ ...c, leads: [...(c.leads || [])] }));
            const destIdx = nextCols.findIndex((c: any) => c.id === 'sales-site-visit');
            const dest = destIdx >= 0 ? nextCols[destIdx] : { id: 'sales-site-visit', title: 'Sales Site Visit', count: 0, leads: [] };
            if (destIdx === -1) nextCols.push(dest);
            // Try to backfill project snapshot from local and Firestore PM projects
            let projectSnap: any = null; let linked: any = null;
            try {
              const raw = localStorage.getItem('xtr_projects');
              const arr = raw ? JSON.parse(raw) : [];
              const name = String(siteVisit.customerName || '').trim();
              const addr = String(siteVisit.propertyAddress || '').trim();
              const email = String(siteVisit.customerEmail || '').trim();
              const matchLocal = (Array.isArray(arr) ? arr : []).find((p: any) => (
                (name && p.customerName === name) || (email && p.customerEmail === email) || (addr && p.customerAddress === addr)
              ));
              if (matchLocal) { projectSnap = matchLocal; linked = { id: matchLocal.id, title: matchLocal.title }; }
            } catch {}
            if (!projectSnap && Array.isArray(pmProjectsFs) && pmProjectsFs.length > 0) {
              try {
                const name = String(siteVisit.customerName || '').trim();
                const addr = String(siteVisit.propertyAddress || '').trim();
                const email = String(siteVisit.customerEmail || '').trim();
                const matchFs = pmProjectsFs.find((p: any) => (
                  (name && p.customerName === name) || (email && p.customerEmail === email) || (addr && p.customerAddress === addr)
                ));
                if (matchFs) { projectSnap = matchFs; linked = { id: matchFs.id, title: matchFs.title }; }
              } catch {}
            }
            const newLead = {
              id: `lead-${Date.now()}`,
              title: siteVisit.customerName || 'Untitled',
              company: siteVisit.propertyAddress || '',
              value: siteVisit.customerPhone || '',
              date: (new Date().toISOString().slice(0,10)),
              tags: [siteVisit.customerEmail || ''].filter(Boolean),
              priority: 'medium',
              status: 'sales-site-visit',
              siteVisit,
              linkedProject: linked || undefined,
              projectSnapshot: projectSnap || undefined
            } as any;
            const finalDestIdx = nextCols.findIndex((c: any) => c.id === 'sales-site-visit');
            const finalDest = nextCols[finalDestIdx];
            const newLeads = [newLead, ...(finalDest.leads || [])];
            nextCols[finalDestIdx] = { ...finalDest, leads: newLeads, count: newLeads.length };
            persistColumns(nextCols);
            return nextCols;
          }
          const updatedLead = { ...lead, status: 'sales-site-visit', siteVisit };
          const nextCols = prevCols.map((c: any, i: number) => {
            if (i === sourceIdx) {
              const newLeads = c.leads.filter((l: any, idx: number) => idx !== leadIdx);
              return { ...c, leads: newLeads, count: newLeads.length };
            }
            return { ...c };
          });
          const destIdx = nextCols.findIndex((c: any) => c.id === 'sales-site-visit');
          if (destIdx >= 0) {
            const dest = nextCols[destIdx];
            const newLeads = [updatedLead, ...(dest.leads || [])];
            nextCols[destIdx] = { ...dest, leads: newLeads, count: newLeads.length };
          }
          // persist using existing helper
          persistColumns(nextCols);
          // update selectedLead panel if it's open for this lead
          if (selectedLead && (String(selectedLead.id) === String(leadId || lead?.id))) {
            setSelectedLead(updatedLead as any);
          }
          return nextCols;
        });
      } catch {}
    };
    window.addEventListener('xtr-leads-attach-site-visit', onAttachSiteVisit as EventListener);
    const onAttachOnField = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as any;
        const { leadId, assessment } = detail || {};
        if (!assessment) return;
        setColumns((prevCols: any) => {
          if (!prevCols) return prevCols;
          // Prefer ID match; otherwise match by name/email/address
          let colIdx = -1;
          if (leadId) {
            colIdx = prevCols.findIndex((c: any) => (c.leads || []).some((l: any) => String(l.id) === String(leadId)));
          }
          // Fallback matching
          let matchIdx = -1;
          if (colIdx === -1) {
            const name = String(assessment.customerName || '').trim().toLowerCase();
            const email = String(assessment.customerEmail || '').trim().toLowerCase();
            const addr = String(assessment.propertyAddress || '').trim().toLowerCase();
            prevCols.forEach((c: any, ci: number) => {
              const li = (c.leads || []).findIndex((l: any) => {
                const lName = String(l.title || '').trim().toLowerCase();
                const lEmail = l.tags && l.tags[0] ? String(l.tags[0]).trim().toLowerCase() : '';
                const lAddr = String(l.company || '').trim().toLowerCase();
                return (name && lName === name) || (email && lEmail === email) || (addr && lAddr === addr);
              });
              if (li >= 0 && colIdx === -1) { colIdx = ci; matchIdx = li; }
            });
          }
          if (colIdx === -1) return prevCols;
          const leads = prevCols[colIdx].leads.map((l: any, idx: number) => (String(l.id) === String(leadId) || idx === matchIdx) ? { ...l, onField: assessment, onFieldStatus: 'completed' } : l);
          const nextCols = prevCols.map((c: any, i: number) => i === colIdx ? { ...c, leads, count: leads.length } : c);
          persistColumns(nextCols);
          if (selectedLead) {
            const idMatch = leadId && String(selectedLead.id) === String(leadId);
            const nameMatch = String((selectedLead as any).title || '').trim().toLowerCase() === String(assessment.customerName || '').trim().toLowerCase();
            const emailMatch = ((selectedLead as any).tags && (selectedLead as any).tags[0] ? String((selectedLead as any).tags[0]).toLowerCase() : '') === String(assessment.customerEmail || '').trim().toLowerCase();
            const addrMatch = String((selectedLead as any).company || '').trim().toLowerCase() === String(assessment.propertyAddress || '').trim().toLowerCase();
            if (idMatch || nameMatch || emailMatch || addrMatch) setSelectedLead({ ...(selectedLead as any), onField: assessment, onFieldStatus: 'completed' } as any);
          }
          return nextCols;
        });
      } catch {}
    };
    window.addEventListener('xtr-leads-attach-onfield', onAttachOnField as EventListener);
    // Process any pending site visit saved during navigation
    try {
      const raw = localStorage.getItem('xtr_pending_site_visit');
      if (raw) {
        const pending = JSON.parse(raw) || {};
        if (pending.leadId && pending.siteVisit) {
          onAttachSiteVisit(new CustomEvent('evt', { detail: pending }) as unknown as Event);
        }
        localStorage.removeItem('xtr_pending_site_visit');
      }
    } catch {}
    try {
      const raw = localStorage.getItem('xtr_pending_onfield');
      if (raw) {
        const pending = JSON.parse(raw) || {};
        if (pending.leadId && pending.assessment) {
          onAttachOnField(new CustomEvent('evt', { detail: pending }) as unknown as Event);
        }
        localStorage.removeItem('xtr_pending_onfield');
      }
    } catch {}

    

    return () => {
      window.removeEventListener('xtr-leads-attach-site-visit', onAttachSiteVisit as EventListener);
      window.removeEventListener('xtr-leads-attach-onfield', onAttachOnField as EventListener);
    };
  }, [selectedLead]);

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
    const base = createInitialProjectForm();
    setProjectForm({
      ...base,
      title: selectedLead.title,
      status: 'new',
      systemType: '',
      projectId: autoId,
      startDate: new Date().toISOString().split('T')[0],
      notes: selectedLead.description || '',
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
    const projectId = (selectedLead as any).linkedProject?.id || Date.now().toString();
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
      clientType: projectForm.clientType || null,
      customerName: projectForm.customerName,
      customerEmail: projectForm.customerEmail,
      customerPhone: projectForm.customerContact,
      customerAddress: projectForm.customerAddress,
      location: projectForm.location || null,
      propertyInfo: {
        houseStorey: projectForm.houseStorey === 'other' ? (projectForm.houseStoreyOther || 'other') : (projectForm.houseStorey || null),
        roofType: projectForm.roofType || null,
        meterPhase: projectForm.meterPhase || null,
        accessSecondStorey: projectForm.accessSecondStorey || null,
        accessToInverter: projectForm.accessInverter || null,
      },
      additionalInfo: {
        monitoring: projectForm.monitoring || null,
        monitoringAmount: projectForm.monitoring === 'yes' ? (projectForm.monitoringAmount || null) : null,
        stcPortal: projectForm.stcPortal || null,
      },
      teamAssignment: {
        salesRep: projectForm.salesRep,
        projectManager: projectForm.projectManager,
        leadElectrician: projectForm.leadElectrician,
        apprentice: projectForm.apprentice,
      },
      utilityInfo: {
        preApprovalNumber: projectForm.preApprovalNumber || null,
        energyRetailer: projectForm.energyRetailer || null,
        solarVictoriaEligible: projectForm.solarVictoriaEligible || null,
        distributor: projectForm.distributor || null,
        nmiNumber: projectForm.nmiNumber || null,
        meterNumber: projectForm.meterNumber || null,
      },
      systemInfo: {
        systemSize: projectForm.systemSize || null,
        panelBrand: projectForm.panelBrand || null,
        panelModuleWatts: projectForm.panelModuleWatts || null,
        inverterBrand: projectForm.inverterBrand || null,
        inverterSize: projectForm.inverterSize || null,
        batterySize: projectForm.batterySize || null,
        batteryBrand: projectForm.batteryBrand || null,
        batteryModel: projectForm.batteryModel || null,
        evChargerBrand: projectForm.evChargerBrand || null,
        evChargerModel: projectForm.evChargerModel || null,
        mountingType: projectForm.mountingType || null,
      },
      createdAt: new Date().toISOString(),
    };
    await writeDocSafe('projects', projectId, projectPayload);
    try {
      if (firebaseEnabled && db) {
        await setDoc(doc(db, 'projects', projectId), projectPayload as any, { merge: true });
      }
    } catch {}
    // Link the newly created project to the selected lead and move status if changed
    const targetStatus = projectForm.status || selectedLead.status || 'new';
    const updatedLead = {
      ...selectedLead,
      status: targetStatus,
      linkedProject: { id: projectId, title: projectPayload.title },
      projectSnapshot: projectPayload,
    } as Lead;
    const sourceColId = selectedLead.status || 'new';
    const updatedColumns = columns.map(column => {
      if (column.id === sourceColId) {
        return { ...column, leads: column.leads.filter(l => l.id !== selectedLead.id), count: column.count };
      }
      return column;
    });
    const destIndex = updatedColumns.findIndex(c => c.id === targetStatus);
    if (destIndex >= 0) {
      const dest = updatedColumns[destIndex];
      const newLeads = [updatedLead, ...dest.leads];
      updatedColumns[destIndex] = { ...dest, leads: newLeads, count: newLeads.length } as any;
    }
    persistColumns(updatedColumns);
    setShowProjectForm(false);
    // Notify listeners that projects changed (for PM screen live update)
    try { window.dispatchEvent(new Event('xtr-projects-updated')); } catch {}
    alert('Project created successfully. It will remain in the Sales pipeline until you move the lead to Closed Won, then it will appear in Project Management (New).');
  };

  const handleOtherSelection = (fieldName: string, value: string) => {
    setOtherSelections(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleEditProject = () => {
    if (!selectedLead || !(selectedLead as any).projectSnapshot) return;
    const snap: any = (selectedLead as any).projectSnapshot;
    const base = createInitialProjectForm();
    setProjectForm({
      ...base,
      title: snap.title || '',
      status: snap.status || 'new',
      systemType: snap.systemType || '',
      price: snap.price || '',
      projectId: snap.projectCode || '',
      startDate: snap.startDate || '',
      notes: snap.notes || '',
      clientType: snap.clientType || '',
      customerName: snap.customerName || '',
      customerEmail: snap.customerEmail || '',
      customerContact: snap.customerPhone || '',
      customerAddress: snap.customerAddress || '',
      location: snap.location || '',
      houseStorey: snap.propertyInfo?.houseStorey || '',
      houseStoreyOther: '',
      roofType: snap.propertyInfo?.roofType || '',
      accessSecondStorey: snap.propertyInfo?.accessSecondStorey || '',
      accessInverter: snap.propertyInfo?.accessToInverter || '',
      monitoring: snap.additionalInfo?.monitoring || '',
      monitoringAmount: snap.additionalInfo?.monitoringAmount || '',
      stcPortal: snap.additionalInfo?.stcPortal || '',
      preApprovalNumber: snap.utilityInfo?.preApprovalNumber || '',
      distributor: snap.utilityInfo?.distributor || '',
      meterNumber: snap.utilityInfo?.meterNumber || '',
      nmiNumber: snap.utilityInfo?.nmiNumber || '',
      energyRetailer: snap.utilityInfo?.energyRetailer || '',
      solarVictoriaEligible: snap.utilityInfo?.solarVictoriaEligible || '',
      meterPhase: snap.propertyInfo?.meterPhase || '',
      systemSize: snap.systemInfo?.systemSize || '',
      panelBrand: snap.systemInfo?.panelBrand || '',
      panelModuleWatts: snap.systemInfo?.panelModuleWatts || '',
      inverterBrand: snap.systemInfo?.inverterBrand || '',
      inverterSize: snap.systemInfo?.inverterSize || '',
      batterySize: snap.systemInfo?.batterySize || '',
      batteryBrand: snap.systemInfo?.batteryBrand || '',
      batteryModel: snap.systemInfo?.batteryModel || '',
      evChargerBrand: snap.systemInfo?.evChargerBrand || '',
      evChargerModel: snap.systemInfo?.evChargerModel || '',
      mountingType: snap.systemInfo?.mountingType || '',
      salesRep: [],
      projectManager: [],
      leadElectrician: [],
      apprentice: [],
    });
    setShowProjectForm(true);
  };

  const persistColumns = (nextColumns: any[]) => {
    setColumns(nextColumns);
    // Save as a single doc payload
    writeDocSafe('leads_state', 'columns', { columns: nextColumns });
    // Also persist locally for other screens to access
    try { localStorage.setItem('xtr_leads_state_columns', JSON.stringify({ columns: nextColumns })); } catch {}
    // Firestore write for cross-device sync
    try {
      if (firebaseEnabled && db) {
        setDoc(doc(db, 'leads_state', 'columns'), { columns: nextColumns } as any, { merge: true });
      }
    } catch {}
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
    // Prefer Firestore realtime when available
    let unsubFs: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsubFs = onSnapshot(doc(db, 'leads_state', 'columns'), (snap: any) => {
          const data = typeof snap?.data === 'function' ? snap.data() : undefined;
      if (data && Array.isArray(data.columns)) {
        const next = migrate(data.columns as any);
        setColumns(next as any);
            try { localStorage.setItem('xtr_leads_state_columns', JSON.stringify({ columns: next })); } catch {}
          }
        });
      } catch {}
    }
    // Local fallback
    const unsubLocal = subscribeDoc<{ columns: any[] }>('leads_state', 'columns', (data) => {
      if (data && Array.isArray(data.columns)) {
        const next = migrate(data.columns as any);
        setColumns(next as any);
        try { localStorage.setItem('xtr_leads_state_columns', JSON.stringify({ columns: next })); } catch {}
      }
    });
    return () => {
      if (typeof unsubLocal === 'function') unsubLocal();
      if (typeof unsubFs === 'function') unsubFs();
    };
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
    if (destination.droppableId === 'on-field-inspection') {
      (draggedLead as any).onFieldStatus = 'pending';
      try {
        const snap = (draggedLead as any).projectSnapshot || {};
        const sv = (draggedLead as any).siteVisit || {};
        const salesNotesParts: string[] = [];
        if (sv.siteNotes) salesNotesParts.push(`• ${sv.siteNotes}`);
        if (sv.specialRequirements) salesNotesParts.push(`• ${sv.specialRequirements}`);
        if (sv.nextSteps) salesNotesParts.push(`• ${sv.nextSteps}`);
        const prefill = {
          customerName: snap.customerName || draggedLead.title || '',
          customerEmail: snap.customerEmail || (draggedLead.tags && draggedLead.tags[0]) || '',
          customerPhone: snap.customerPhone || draggedLead.value || '',
          propertyAddress: snap.customerAddress || draggedLead.company || '',
          propertyType: snap.clientType || '',
          currentEnergyProvider: snap.utilityInfo?.energyRetailer || sv.currentEnergyProvider || '',
          energyDistributor: snap.utilityInfo?.distributor || sv.energyDistributor || '',
          averageMonthlyBill: snap.siteVisitInfo?.averageMonthlyBill || sv.averageMonthlyBill || '',
          roofOrientation: snap.siteVisitInfo?.roofOrientation || sv.roofOrientation || '',
          roofType: snap.propertyInfo?.roofType || '',
          meterPhase: snap.propertyInfo?.meterPhase || '',
          numberOfStory: snap.propertyInfo?.houseStorey || '',
          shadingAssessment: snap.siteVisitInfo?.shadingAssessment || (Array.isArray(sv.shadingAssessment) ? sv.shadingAssessment : []),
          primaryMotivation: snap.siteVisitInfo?.primaryMotivation || (Array.isArray(sv.primaryMotivation) ? sv.primaryMotivation : []),
          existingSolarInstallations: snap.siteVisitInfo?.existingSolarInstallations || sv.existingSolarInstallations || '',
          interestLevel: snap.siteVisitInfo?.interestLevel || sv.interestLevel || '',
          salesNotes: salesNotesParts.join('\n'),
        } as any;
        localStorage.setItem('xtr_onfield_prefill', JSON.stringify(prefill));
        localStorage.setItem('xtr_onfield_context', JSON.stringify({ leadId: draggedLead.id }));
      } catch {}
    }

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
      setSelectedLead({ ...selectedLead, status: draggedLead.status, onFieldStatus: (draggedLead as any).onFieldStatus });
    }

    persistColumns(newColumns);

    // If this lead has a linked project and it just became Closed Won, push to PM 'new' column
    if (destination.droppableId === 'closed-won' && (draggedLead as any).linkedProject) {
      try {
        const projectsRaw = localStorage.getItem('xtr_projects');
        const existing = projectsRaw ? JSON.parse(projectsRaw) : [];
        const linked = (draggedLead as any).linkedProject as { id: string; title: string };
        const already = Array.isArray(existing) && existing.some((p: any) => String(p.id) === String(linked.id));
        if (!already) {
          const pmItem = {
            id: linked.id,
            title: linked.title,
            status: 'new',
            date: new Date().toISOString().split('T')[0],
            tags: [draggedLead?.projectDetails?.systemInfo?.systemSize || '', draggedLead?.projectDetails?.systemType || ''].filter(Boolean),
            priority: 'medium',
            value: draggedLead.value || '',
            customerName: draggedLead.title,
            customerEmail: (draggedLead.tags && draggedLead.tags[0]) || '',
            customerContact: draggedLead.value || '',
            customerAddress: draggedLead.company || '',
            projectSnapshot: (draggedLead as any).projectSnapshot || undefined,
            siteVisit: (draggedLead as any).siteVisit || undefined,
            onField: (draggedLead as any).onField || undefined,
            comments: Array.isArray((draggedLead as any).comments) ? (draggedLead as any).comments : [],
          };
          const next = [pmItem, ...existing];
          localStorage.setItem('xtr_projects', JSON.stringify(next));
          // Also persist to Firestore when enabled for cross-device durability
          try {
            if (firebaseEnabled && db) {
              addDoc(collection(db, 'pm_projects'), pmItem as any).catch(() => {});
            }
          } catch {}
          try { window.dispatchEvent(new Event('xtr-projects-updated')); } catch {}
        }
      } catch {}
    }
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

  // Inline status change from Lead details (dropdown)
  const handleInlineStatusChange = async (newStatus: string) => {
    if (!selectedLead || !newStatus) return;
    if (newStatus === (selectedLead.status || 'new')) return;

    const sourceColId = selectedLead.status || 'new';
    const updatedLead: Lead = { ...selectedLead, status: newStatus } as Lead;
    if (newStatus === 'on-field-inspection') {
      (updatedLead as any).onFieldStatus = 'pending';
    }

    const nextColumns = columns.map((column) => {
      if (column.id === sourceColId) {
        const newLeads = column.leads.filter((l: Lead) => l.id !== selectedLead.id);
        return { ...column, leads: newLeads, count: newLeads.length };
      }
      if (column.id === newStatus) {
        const newLeads = [updatedLead, ...column.leads];
        return { ...column, leads: newLeads, count: newLeads.length };
      }
      return column;
    });
    persistColumns(nextColumns);
    setSelectedLead(updatedLead);

    // If moved to Closed Won and a project is linked, ensure PM card exists
    if (newStatus === 'closed-won' && (updatedLead as any).linkedProject) {
      try {
        const linked = (updatedLead as any).linkedProject as { id: string; title: string };
        const projectsRaw = localStorage.getItem('xtr_projects');
        const existing = projectsRaw ? JSON.parse(projectsRaw) : [];
        const already = Array.isArray(existing) && existing.some((p: any) => String(p.id) === String(linked.id));
        if (!already) {
          const pmItem = {
            id: linked.id,
            title: linked.title,
            status: 'new',
            date: new Date().toISOString().split('T')[0],
            tags: [updatedLead?.projectDetails?.systemInfo?.systemSize || '', updatedLead?.projectDetails?.systemType || ''].filter(Boolean),
            priority: 'medium',
            value: updatedLead.value || '',
            customerName: updatedLead.title,
            customerEmail: (updatedLead.tags && updatedLead.tags[0]) || '',
            customerContact: updatedLead.value || '',
            customerAddress: updatedLead.company || '',
            projectSnapshot: (updatedLead as any).projectSnapshot || undefined,
            siteVisit: (updatedLead as any).siteVisit || undefined,
            onField: (updatedLead as any).onField || undefined,
            comments: Array.isArray((updatedLead as any).comments) ? (updatedLead as any).comments : [],
          };
          const next = [pmItem, ...(Array.isArray(existing) ? existing : [])];
          localStorage.setItem('xtr_projects', JSON.stringify(next));
          try {
            if (firebaseEnabled && db) {
              addDoc(collection(db, 'pm_projects'), pmItem as any).catch(() => {});
            }
          } catch {}
          try { window.dispatchEvent(new Event('xtr-projects-updated')); } catch {}
        }
      } catch {}
    }

    // If moved to Sales Site Visit, navigate and prefill Site Visit form
    if (newStatus === 'sales-site-visit') {
      try {
        const snap = (updatedLead as any).projectSnapshot || {};
        const sv = (updatedLead as any).siteVisit || {};
        const prefill = {
          // Basic Information
          salesPersonName: '', // Will be auto-filled from logged-in user
          customerName: snap.customerName || updatedLead.title || '',
          propertyAddress: snap.customerAddress || updatedLead.company || '',
          propertyType: snap.clientType || '', // Map clientType to propertyType
          
          // Energy Information
          currentEnergyProvider: snap.utilityInfo?.energyRetailer || sv.currentEnergyProvider || '',
          energyDistributor: snap.utilityInfo?.distributor || sv.energyDistributor || '',
          averageMonthlyBill: sv.averageMonthlyBill || snap.siteVisitInfo?.averageMonthlyBill || '',
          roofOrientation: sv.roofOrientation || snap.siteVisitInfo?.roofOrientation || '',
          
          // Property Details
          roofType: snap.propertyInfo?.roofType || sv.roofType || '',
          meterPhase: snap.propertyInfo?.meterPhase || sv.meterPhase || '',
          numberOfStory: snap.propertyInfo?.houseStorey || sv.numberOfStory || '',
        };
        localStorage.setItem('xtr_site_visit_prefill', JSON.stringify(prefill));
        localStorage.setItem('xtr_site_visit_context', JSON.stringify({ leadId: updatedLead.id }));
      } catch {}
      try { window.dispatchEvent(new CustomEvent('xtr-nav', { detail: 'site-visit' })); } catch {}
    }

    // If moved to On-Field Inspection, prefill On-Field assessment
    if (newStatus === 'on-field-inspection') {
      try {
        const snap = (updatedLead as any).projectSnapshot || {};
        const sv = (updatedLead as any).siteVisit || {};
        const salesNotesParts: string[] = [];
        if (sv.siteNotes) salesNotesParts.push(`• ${sv.siteNotes}`);
        if (sv.specialRequirements) salesNotesParts.push(`• ${sv.specialRequirements}`);
        if (sv.nextSteps) salesNotesParts.push(`• ${sv.nextSteps}`);
        const prefill = {
          customerName: snap.customerName || updatedLead.title || '',
          customerEmail: snap.customerEmail || (updatedLead.tags && updatedLead.tags[0]) || '',
          customerPhone: snap.customerPhone || updatedLead.value || '',
          propertyAddress: snap.customerAddress || updatedLead.company || '',
          propertyType: snap.clientType || '',
          currentEnergyProvider: snap.utilityInfo?.energyRetailer || sv.currentEnergyProvider || '',
          energyDistributor: snap.utilityInfo?.distributor || sv.energyDistributor || '',
          averageMonthlyBill: snap.siteVisitInfo?.averageMonthlyBill || sv.averageMonthlyBill || '',
          roofOrientation: snap.siteVisitInfo?.roofOrientation || sv.roofOrientation || '',
          roofType: snap.propertyInfo?.roofType || '',
          meterPhase: snap.propertyInfo?.meterPhase || '',
          numberOfStory: snap.propertyInfo?.houseStorey || '',
          shadingAssessment: snap.siteVisitInfo?.shadingAssessment || (Array.isArray(sv.shadingAssessment) ? sv.shadingAssessment : []),
          primaryMotivation: snap.siteVisitInfo?.primaryMotivation || (Array.isArray(sv.primaryMotivation) ? sv.primaryMotivation : []),
          existingSolarInstallations: snap.siteVisitInfo?.existingSolarInstallations || sv.existingSolarInstallations || '',
          interestLevel: snap.siteVisitInfo?.interestLevel || sv.interestLevel || '',
          salesNotes: salesNotesParts.join('\n'),
        };
        localStorage.setItem('xtr_onfield_prefill', JSON.stringify(prefill));
        localStorage.setItem('xtr_onfield_context', JSON.stringify({ leadId: updatedLead.id }));

        // Check if there's an electrician site visit scheduled
        let siteVisitData = sv;
        if (!siteVisitData || !siteVisitData.electricianVisitDate) {
          // Try to find site visit from localStorage
          try {
            const siteVisitsRaw = localStorage.getItem('xtr_site_visits');
            if (siteVisitsRaw) {
              const siteVisits = JSON.parse(siteVisitsRaw);
              if (Array.isArray(siteVisits)) {
                const name = snap.customerName || updatedLead.title || '';
                const email = snap.customerEmail || (updatedLead.tags && updatedLead.tags[0]) || '';
                const addr = snap.customerAddress || updatedLead.company || '';
                
                const match = siteVisits.find((svItem: any) => {
                  const svName = (svItem.customerName || '').toLowerCase().trim();
                  const svEmail = (svItem.customerEmail || '').toLowerCase().trim();
                  const svAddr = (svItem.propertyAddress || '').toLowerCase().trim();
                  const n = name.toLowerCase().trim();
                  const e = email.toLowerCase().trim();
                  const a = addr.toLowerCase().trim();
                  
                  return (n && svName && n === svName) ||
                         (e && svEmail && e === svEmail) ||
                         (a && svAddr && a === svAddr);
                });
                
                if (match && match.electricianVisitDate) {
                  siteVisitData = match;
                }
              }
            }
          } catch {}
          
          // Try Firestore if not found in localStorage
          if ((!siteVisitData || !siteVisitData.electricianVisitDate) && Array.isArray(salesVisitsFs) && salesVisitsFs.length > 0) {
            try {
              const name = snap.customerName || updatedLead.title || '';
              const email = snap.customerEmail || (updatedLead.tags && updatedLead.tags[0]) || '';
              const addr = snap.customerAddress || updatedLead.company || '';
              
              const matchFs = salesVisitsFs.find((svItem: any) => {
                const svName = (svItem.customerName || '').toLowerCase().trim();
                const svEmail = (svItem.customerEmail || '').toLowerCase().trim();
                const svAddr = (svItem.propertyAddress || '').toLowerCase().trim();
                const n = name.toLowerCase().trim();
                const e = email.toLowerCase().trim();
                const a = addr.toLowerCase().trim();
                
                return (n && svName && n === svName) ||
                       (e && svEmail && e === svEmail) ||
                       (a && svAddr && a === svAddr);
              });
              
              if (matchFs && matchFs.electricianVisitDate) {
                siteVisitData = matchFs;
              }
            } catch {}
          }
        }

        // If electrician visit is scheduled, create/update project for calendar visibility
        if (siteVisitData && siteVisitData.electricianVisitDate && siteVisitData.electricianVisitTime) {
          try {
            const projectsRaw = localStorage.getItem('xtr_projects');
            const existing = projectsRaw ? JSON.parse(projectsRaw) : [];
            const projects: any[] = Array.isArray(existing) ? existing : [];
            
            // Find existing project by matching customer name, email, or address
            const name = snap.customerName || updatedLead.title || '';
            const email = snap.customerEmail || (updatedLead.tags && updatedLead.tags[0]) || '';
            const addr = snap.customerAddress || updatedLead.company || '';
            
            let existingProjectIndex = -1;
            projects.forEach((p: any, idx: number) => {
              const pName = (p.projectSnapshot?.customerName || p.name || '').toLowerCase().trim();
              const pEmail = (p.projectSnapshot?.customerEmail || '').toLowerCase().trim();
              const pAddr = (p.projectSnapshot?.customerAddress || p.projectDetails?.additionalInfo?.customerAddress || '').toLowerCase().trim();
              const n = name.toLowerCase().trim();
              const e = email.toLowerCase().trim();
              const a = addr.toLowerCase().trim();
              
              if ((n && pName && n === pName) ||
                  (e && pEmail && e === pEmail) ||
                  (a && pAddr && a === pAddr)) {
                existingProjectIndex = idx;
              }
            });

            const electricianVisitDate = siteVisitData.electricianVisitDate;
            const electricianVisitTime = siteVisitData.electricianVisitTime || '';
            const electricianNotes = siteVisitData.electricianNotes || '';

            // Build project data
            const projectData: any = {
              name: snap.customerName || updatedLead.title || 'Electrician Site Visit',
              status: 'site-inspection',
              priority: updatedLead.priority || 'medium',
              startDate: electricianVisitDate,
              cost: snap.price || siteVisitData?.priceAud || '',
              systemSize: snap.systemInfo?.systemSize || siteVisitData?.systemSizeKw || '',
              type: snap.systemType || '',
              projectSnapshot: {
                ...snap,
                startDate: electricianVisitDate,
              },
              projectDetails: {
                ...(snap.projectDetails || {}),
                additionalInfo: {
                  ...(snap.projectDetails?.additionalInfo || {}),
                  siteInspection: {
                    date: electricianVisitDate,
                    time: electricianVisitTime,
                  },
                  priceAud: snap.price || siteVisitData?.priceAud || '',
                  customerEmail: snap.customerEmail || siteVisitData?.customerEmail || (updatedLead.tags && updatedLead.tags[0]) || '',
                  customerContact: snap.customerPhone || siteVisitData?.customerPhone || updatedLead.value || '',
                  customerAddress: snap.customerAddress || siteVisitData?.propertyAddress || updatedLead.company || '',
                },
                systemInfo: {
                  systemSize: snap.systemInfo?.systemSize || siteVisitData?.systemSizeKw || '',
                  inverterSize: snap.systemInfo?.inverterSize || siteVisitData?.inverterSizeKw || '',
                  inverterBrand: snap.systemInfo?.inverterBrand || siteVisitData?.inverterBrand || '',
                  inverterType: snap.systemInfo?.inverterType || siteVisitData?.inverterType || '',
                  panelBrand: snap.systemInfo?.panelBrand || siteVisitData?.panelBrand || '',
                  panelModuleWatts: snap.systemInfo?.panelModuleWatts || siteVisitData?.panelModuleWatts || '',
                  ...(snap.systemInfo || {}),
                },
                propertyInfo: {
                  ...(snap.projectDetails?.propertyInfo || snap.propertyInfo || {}),
                },
                utilityInfo: {
                  ...(snap.projectDetails?.utilityInfo || snap.utilityInfo || {}),
                },
              },
              siteVisit: {
                electricianVisitDate,
                electricianVisitTime,
                electricianNotes,
                customerName: snap.customerName || siteVisitData?.customerName || updatedLead.title || '',
                customerEmail: snap.customerEmail || siteVisitData?.customerEmail || (updatedLead.tags && updatedLead.tags[0]) || '',
                customerPhone: snap.customerPhone || siteVisitData?.customerPhone || updatedLead.value || '',
                propertyAddress: snap.customerAddress || siteVisitData?.propertyAddress || updatedLead.company || '',
                ...siteVisitData,
              },
              linkedLeadId: updatedLead.id,
            };

            if (existingProjectIndex >= 0) {
              // Update existing project
              projects[existingProjectIndex] = {
                ...projects[existingProjectIndex],
                ...projectData,
                id: projects[existingProjectIndex].id, // Preserve existing ID
              };
            } else {
              // Create new project
              const projectId = `PROJ-${Date.now()}`;
              projects.unshift({
                id: projectId,
                ...projectData,
                createdAt: new Date().toISOString(),
              });
            }

            // Save projects
            localStorage.setItem('xtr_projects', JSON.stringify(projects));
            
            // Sync to Firestore
            if (firebaseEnabled && db) {
              const projectToSave = existingProjectIndex >= 0 
                ? projects[existingProjectIndex]
                : projects[0];
              
              try {
                if (existingProjectIndex >= 0) {
                  // Update existing project in Firestore
                  const existingProject = projects[existingProjectIndex];
                  const pmProjectsRaw = localStorage.getItem('xtr_pm_projects_ids');
                  // Try to find Firestore ID
                  if (pmProjectsRaw) {
                    const pmProjectsIds = JSON.parse(pmProjectsRaw);
                    const fsId = pmProjectsIds[existingProject.id];
                    if (fsId) {
                      setDoc(doc(db, 'pm_projects', fsId), projectToSave as any, { merge: true }).catch(() => {});
                    } else {
                      addDoc(collection(db, 'pm_projects'), projectToSave as any).catch(() => {});
                    }
                  } else {
                    addDoc(collection(db, 'pm_projects'), projectToSave as any).catch(() => {});
                  }
                } else {
                  // Add new project to Firestore
                  addDoc(collection(db, 'pm_projects'), projectToSave as any).catch(() => {});
                }
              } catch {}
            }

            // Notify other components of project update
            try { window.dispatchEvent(new Event('xtr-projects-updated')); } catch {}
          } catch (err) {
            console.error('Error creating/updating project for electrician visit:', err);
          }
        }
      } catch {}
      // navigation left to user role (on-field techs)
    }
    // Close details dialog after saving status
    try { handleCloseModal(); } catch {}
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
                  <Label>Customer Name</Label>
                  <p className="text-sm">{selectedLead.title}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={pendingStatus} onValueChange={(v) => setPendingStatus(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
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
                <div>
                  <Label>On-Field Inspection Status</Label>
                  <p className="text-sm capitalize">{
                    (()=>{
                      const leadAny: any = selectedLead as any;
                      let status = leadAny?.onFieldStatus;
                      if (status !== 'completed') {
                        // infer completion if an on-field assessment exists for this lead
                        try {
                          const raw = localStorage.getItem('xtr_onfield_assessments');
                          const arr = raw ? JSON.parse(raw) : [];
                          const name = leadAny?.projectSnapshot?.customerName || leadAny?.title;
                          const addr = leadAny?.projectSnapshot?.customerAddress || leadAny?.company;
                          const matchLocal = Array.isArray(arr) && arr.some((v: any) => (
                            (!name || v.customerName === name) && (!addr || v.propertyAddress === addr)
                          ));
                          if (matchLocal) status = 'completed';
                        } catch {}
                        if (!status && Array.isArray(onFieldFs) && onFieldFs.length > 0) {
                          try {
                            const name = leadAny?.projectSnapshot?.customerName || leadAny?.title;
                            const addr = leadAny?.projectSnapshot?.customerAddress || leadAny?.company;
                            const matchFs = onFieldFs.some((v: any) => (
                              (!name || v.customerName === name) && (!addr || v.propertyAddress === addr)
                            ));
                            if (matchFs) status = 'completed';
                          } catch {}
                        }
                      }
                      return status || '-';
                    })()
                  }</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="text-sm">{selectedLead.date}</p>
                </div>
              </div>

              {/* Customer Email (renamed from Tags) */}
                <div>
                <Label>Customer Email</Label>
                <p className="text-sm">{selectedLead.tags?.[0] || '-'}</p>
              </div>

              

              {/* Project Details or Action */}
              <div className="pt-4 border-t">
                {selectedLead.projectSnapshot ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Project Details</h4>
                    {/* Basics */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Project Details</div>
                      <Button size="sm" variant="outline" onClick={handleEditProject}>Edit Project</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <Label>Title</Label>
                        <p>{selectedLead.projectSnapshot.title || '-'}</p>
                      </div>
                      
                      <div>
                        <Label>Project Code</Label>
                        <p>{selectedLead.projectSnapshot.projectCode || '-'}</p>
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <p>{selectedLead.projectSnapshot.startDate || '-'}</p>
                      </div>
                      <div>
                        <Label>Price (AUD)</Label>
                        <p>{selectedLead.projectSnapshot.price || '-'}</p>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <p className="whitespace-pre-wrap break-words">{selectedLead.projectSnapshot.notes || '-'}</p>
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <Label>Customer Name</Label>
                        <p>{selectedLead.projectSnapshot.customerName || '-'}</p>
                      </div>
                      <div>
                        <Label>Customer Email</Label>
                        <p>{selectedLead.projectSnapshot.customerEmail || '-'}</p>
                      </div>
                      <div>
                        <Label>Customer Contact</Label>
                        <p>{selectedLead.projectSnapshot.customerPhone || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <Label>Customer Address</Label>
                        <p>{selectedLead.projectSnapshot.customerAddress || '-'}</p>
                      </div>
                    </div>

                    {/* System Information */}
                    <div>
                      <p className="font-medium mb-2">System Information</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label>System Type</Label>
                          <p>{selectedLead.projectSnapshot.systemType || '-'}</p>
                        </div>
                        {(selectedLead.projectSnapshot.systemType === "pv-only" || 
                          selectedLead.projectSnapshot.systemType === "pv-battery" || 
                          selectedLead.projectSnapshot.systemType === "pv-battery-ev" || 
                          selectedLead.projectSnapshot.systemType === "pv-ev") && (
                          <>
                            <div>
                              <Label>System Size (kW)</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.systemSize || '-'}</p>
                            </div>
                            <div>
                              <Label>Panel Brand</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.panelBrand || '-'}</p>
                            </div>
                            <div>
                              <Label>Panel Module (Watts)</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.panelModuleWatts || '-'}</p>
                            </div>
                          </>
                        )}
                        {(selectedLead.projectSnapshot.systemType === "pv-only" || 
                          selectedLead.projectSnapshot.systemType === "pv-battery" || 
                          selectedLead.projectSnapshot.systemType === "pv-battery-ev" || 
                          selectedLead.projectSnapshot.systemType === "pv-ev") && (
                          <>
                            <div>
                              <Label>Inverter Brand</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.inverterBrand || '-'}</p>
                            </div>
                            <div>
                              <Label>Inverter Size (kW)</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.inverterSize || '-'}</p>
                            </div>
                          </>
                        )}
                        {(selectedLead.projectSnapshot.systemType === "battery-only" || 
                          selectedLead.projectSnapshot.systemType === "pv-battery" || 
                          selectedLead.projectSnapshot.systemType === "pv-battery-ev" || 
                          selectedLead.projectSnapshot.systemType === "battery-ev") && (
                          <>
                            <div>
                              <Label>Battery Size (kWh)</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.batterySize || '-'}</p>
                            </div>
                            <div>
                              <Label>Battery Brand</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.batteryBrand || '-'}</p>
                            </div>
                            <div>
                              <Label>Battery Model</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.batteryModel || '-'}</p>
                            </div>
                          </>
                        )}
                        {(selectedLead.projectSnapshot.systemType === "ev-only" || 
                          selectedLead.projectSnapshot.systemType === "pv-battery-ev" || 
                          selectedLead.projectSnapshot.systemType === "battery-ev" || 
                          selectedLead.projectSnapshot.systemType === "pv-ev") && (
                          <>
                            <div>
                              <Label>EV Charger Brand</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.evChargerBrand || '-'}</p>
                            </div>
                            <div>
                              <Label>EV Charger Model</Label>
                              <p>{selectedLead.projectSnapshot.systemInfo?.evChargerModel || '-'}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Property Information */}
                    <div>
                      <p className="font-medium mb-2">Property Information</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label>House Storey</Label>
                          <p>{selectedLead.projectSnapshot.propertyInfo?.houseStorey || '-'}</p>
                        </div>
                        <div>
                          <Label>Roof Type</Label>
                          <p>{selectedLead.projectSnapshot.propertyInfo?.roofType || '-'}</p>
                        </div>
                        <div>
                          <Label>Meter Phase</Label>
                          <p>{selectedLead.projectSnapshot.propertyInfo?.meterPhase || '-'}</p>
                        </div>
                        <div>
                          <Label>Access To 2nd Storey</Label>
                          <p>{selectedLead.projectSnapshot.propertyInfo?.accessSecondStorey || '-'}</p>
                        </div>
                        <div>
                          <Label>Access To Inverter</Label>
                          <p>{selectedLead.projectSnapshot.propertyInfo?.accessToInverter || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Utility Information */}
                    <div>
                      <p className="font-medium mb-2">Utility Information</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label>Pre-Approval Reference Number</Label>
                          <p>{selectedLead.projectSnapshot.utilityInfo?.preApprovalNumber || '-'}</p>
                        </div>
                        <div>
                          <Label>Energy Distributor</Label>
                          <p>{selectedLead.projectSnapshot.utilityInfo?.distributor || '-'}</p>
                        </div>
                        <div>
                          <Label>NMI Number</Label>
                          <p>{selectedLead.projectSnapshot.utilityInfo?.nmiNumber || '-'}</p>
                        </div>
                        <div>
                          <Label>Meter Number</Label>
                          <p>{selectedLead.projectSnapshot.utilityInfo?.meterNumber || '-'}</p>
                        </div>
                        <div>
                          <Label>Energy Retailer</Label>
                          <p>{selectedLead.projectSnapshot.utilityInfo?.energyRetailer || '-'}</p>
                        </div>
                        <div>
                          <Label>Solar Victoria Eligibility</Label>
                          <p className="capitalize">{selectedLead.projectSnapshot.utilityInfo?.solarVictoriaEligible || '-'}</p>
                        </div>
                      </div>
                    </div>

                  {/* On-Field Site Assessment (if available) */}
                  { (() => {
                    const leadAny: any = selectedLead as any;
                    let onField = leadAny?.onField;
                    if (!onField) {
                      try {
                        const raw = localStorage.getItem('xtr_onfield_assessments');
                        const arr = raw ? JSON.parse(raw) : [];
                        if (Array.isArray(arr)) {
                          const name = leadAny?.projectSnapshot?.customerName || leadAny?.title;
                          const addr = leadAny?.projectSnapshot?.customerAddress || leadAny?.company;
                          const matches = arr.filter((v: any) => (
                            (!name || v.customerName === name) && (!addr || v.propertyAddress === addr)
                          ));
                          if (matches.length > 0) {
                            matches.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                            onField = matches[0];
                          }
                        }
                      } catch {}
                      if (!onField && Array.isArray(onFieldFs) && onFieldFs.length > 0) {
                        try {
                          const name = leadAny?.projectSnapshot?.customerName || leadAny?.title;
                          const addr = leadAny?.projectSnapshot?.customerAddress || leadAny?.company;
                          const matchesFs = onFieldFs.filter((v: any) => (
                            (!name || v.customerName === name) && (!addr || v.propertyAddress === addr)
                          ));
                          if (matchesFs.length > 0) {
                            matchesFs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                            onField = matchesFs[0];
                          }
                        } catch {}
                      }
                    }
                    return onField ? (
                      <div className="p-3 border rounded-lg mt-3">
                        <p className="font-medium mb-2">On-Field Assessment</p>
                        {/* Show only details not already in Project Details or Sales Site Visit */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label>Visit Date</Label>
                            <p>{onField.visitDate || '-'}</p>
                          </div>
                          <div>
                            <Label>Visit Time</Label>
                            <p>{onField.visitTime || '-'}</p>
                          </div>
                          <div>
                            <Label>Technician</Label>
                            <p>{onField.technicianName || '-'}</p>
                          </div>
                          <div>
                            <Label>Weather</Label>
                            <p>{onField.weatherConditions || '-'}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <div className="col-span-2">
                            <Label>Electrical Hazards</Label>
                            <p>{Array.isArray(onField.electricalHazards) && onField.electricalHazards.length > 0 ? onField.electricalHazards.join(', ') : '-'}</p>
                          </div>
                          <div>
                            <Label>Main Panel Location</Label>
                            <p>{onField.mainPanelLocation || '-'}</p>
                          </div>
                          <div>
                            <Label>Panel Condition</Label>
                            <p className="capitalize">{onField.panelCondition || '-'}</p>
                          </div>
                          <div>
                            <Label>Available Amperage</Label>
                            <p>{onField.availableAmperage || '-'}</p>
                          </div>
                          <div>
                            <Label>Grounding System</Label>
                            <p className="capitalize">{onField.groundingSystem || '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Electrical Notes</Label>
                            <p>{onField.electricalNotes || '-'}</p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label>Roof Condition</Label>
                            <p className="capitalize">{onField.roofCondition || '-'}</p>
                          </div>
                          <div>
                            <Label>Roof Access</Label>
                            <p className="capitalize">{onField.roofAccess || '-'}</p>
                          </div>
                          <div>
                            <Label>Structural Integrity</Label>
                            <p className="capitalize">{onField.structuralIntegrity || '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Mounting Points</Label>
                            <p>{Array.isArray(onField.mountingPoints) && onField.mountingPoints.length > 0 ? onField.mountingPoints.join(', ') : '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Roof Hazards</Label>
                            <p>{Array.isArray(onField.roofHazards) && onField.roofHazards.length > 0 ? onField.roofHazards.join(', ') : '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Roof Notes</Label>
                            <p>{onField.roofNotes || '-'}</p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label>Panel Count</Label>
                            <p>{onField.panelCount || '-'}</p>
                          </div>
                          <div>
                            <Label>Inverter Location</Label>
                            <p>{onField.inverterLocation || '-'}</p>
                          </div>
                          <div>
                            <Label>Conduit Path</Label>
                            <p>{onField.conduitPath || '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Special Requirements</Label>
                            <p>{onField.specialRequirements || '-'}</p>
                          </div>
                        </div>

                      </div>
                    ) : null;
                  })()}
                    
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleCreateProject} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project from Lead
                    </Button>
                  </div>
                )}

                {/* Sales Site Visit (if available) - Display independently - Only show if site visit was actually submitted */}
                { (() => {
                  const leadAny: any = selectedLead as any;
                  let siteVisitData: any = null;
                  
                  // Only check submitted site visits (from storage or Firestore)
                  // Don't show if only attached to lead but not yet submitted
                  try {
                    const raw = localStorage.getItem('xtr_site_visits');
                    const arr = raw ? JSON.parse(raw) : [];
                    if (Array.isArray(arr)) {
                      const name = leadAny?.projectSnapshot?.customerName || leadAny?.title;
                      const addr = leadAny?.projectSnapshot?.customerAddress || leadAny?.company;
                      const matches = arr.filter((v: any) => (
                        (!name || v.customerName === name) && (!addr || v.propertyAddress === addr)
                      ));
                      if (matches.length > 0) {
                        matches.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        siteVisitData = matches[0];
                      }
                    }
                  } catch {}
                  
                  // Firestore fallback for teammates/devices without local storage
                  if (!siteVisitData && Array.isArray(salesVisitsFs) && salesVisitsFs.length > 0) {
                    try {
                      const name = leadAny?.projectSnapshot?.customerName || leadAny?.title;
                      const addr = leadAny?.projectSnapshot?.customerAddress || leadAny?.company;
                      const matchesFs = salesVisitsFs.filter((v: any) => (
                        (!name || v.customerName === name) && (!addr || v.propertyAddress === addr)
                      ));
                      if (matchesFs.length > 0) {
                        matchesFs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        siteVisitData = matchesFs[0];
                      }
                    } catch {}
                  }
                  
                  // Only show if site visit was actually submitted (has id and createdAt)
                  const isSubmitted = siteVisitData && siteVisitData.id && siteVisitData.createdAt;
                  
                  return isSubmitted ? (
                    <div className="p-3 border rounded-lg mt-4">
                      <p className="font-medium mb-2">Sales Site Visit Information</p>
                      {/* Basic details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label>Sales Person</Label>
                          <p>{siteVisitData.salesPersonName || siteVisitData.salesPersonEmail || '-'}</p>
                        </div>
                        <div>
                          <Label>Date of Visit</Label>
                          <p>{siteVisitData.dateOfVisit || '-'}</p>
                        </div>
                        <div>
                          <Label>Customer Name</Label>
                          <p>{siteVisitData.customerName || '-'}</p>
                        </div>
                        <div>
                          <Label>Customer Email</Label>
                          <p>{siteVisitData.customerEmail || '-'}</p>
                        </div>
                        <div>
                          <Label>Customer Contact</Label>
                          <p>{siteVisitData.customerPhone || siteVisitData.customerContact || '-'}</p>
                        </div>
                        <div>
                          <Label>Property Address</Label>
                          <p>{siteVisitData.propertyAddress || '-'}</p>
                        </div>
                        <div>
                          <Label>Price (AUD)</Label>
                          <p>{siteVisitData.price || siteVisitData.priceAud || siteVisitData.projectCost || '-'}</p>
                        </div>
                      </div>

                      {/* System Information */}
                      {(siteVisitData.systemSizeKw || siteVisitData.inverterBrand || siteVisitData.panelBrand) && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="font-medium mb-2">System Information</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <Label>System Size (kW)</Label>
                              <p>{siteVisitData.systemSizeKw || siteVisitData.systemSize || '-'}</p>
                            </div>
                            <div>
                              <Label>Inverter Size (kW)</Label>
                              <p>{siteVisitData.inverterSizeKw || '-'}</p>
                            </div>
                            <div>
                              <Label>Inverter Brand</Label>
                              <p>{siteVisitData.inverterBrand || '-'}</p>
                            </div>
                            <div>
                              <Label>Inverter Type</Label>
                              <p>{siteVisitData.inverterType || '-'}</p>
                            </div>
                            <div>
                              <Label>Panel Brand</Label>
                              <p>{siteVisitData.panelBrand || '-'}</p>
                            </div>
                            <div>
                              <Label>Panel Module (Watts)</Label>
                              <p>{siteVisitData.panelModuleWatts || '-'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Energy & Property Information */}
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label>Energy Retailer</Label>
                            <p>{siteVisitData.currentEnergyProvider || '-'}</p>
                          </div>
                          <div>
                            <Label>Energy Distributor</Label>
                            <p className="capitalize">{siteVisitData.energyDistributor || '-'}</p>
                          </div>
                          <div>
                            <Label>Average Monthly Bill</Label>
                            <p>{siteVisitData.averageMonthlyBill || '-'}</p>
                          </div>
                          <div>
                            <Label>Roof Orientation</Label>
                            <p className="capitalize">{siteVisitData.roofOrientation || '-'}</p>
                          </div>
                          <div>
                            <Label>Roof Type</Label>
                            <p className="capitalize">{siteVisitData.roofType || '-'}</p>
                          </div>
                          <div>
                            <Label>Meter Phase</Label>
                            <p className="capitalize">{siteVisitData.meterPhase || '-'}</p>
                          </div>
                          <div>
                            <Label>Number of Story</Label>
                            <p className="capitalize">{siteVisitData.numberOfStory || '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional assessments */}
                      <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                        <div className="col-span-2">
                          <Label>Shading Assessment</Label>
                          <p>{Array.isArray(siteVisitData.shadingAssessment) && siteVisitData.shadingAssessment.length > 0 ? siteVisitData.shadingAssessment.join(', ') : '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <Label>Primary Motivation</Label>
                          <p>{Array.isArray(siteVisitData.primaryMotivation) && siteVisitData.primaryMotivation.length > 0 ? siteVisitData.primaryMotivation.join(', ') : '-'}</p>
                        </div>
                        <div>
                          <Label>Existing Solar Installations</Label>
                          <p className="capitalize">{siteVisitData.existingSolarInstallations || '-'}</p>
                        </div>
                        <div>
                          <Label>Interest Level</Label>
                          <p>{siteVisitData.interestLevel || '-'}</p>
                        </div>
                      </div>

                      {/* Sales Site Visit Checklist */}
                      {Array.isArray(siteVisitData.salesChecklist) && siteVisitData.salesChecklist.length > 0 && (
                        <div className="mt-3">
                          <Label className="font-medium mb-2 block">Sales Site Visit Checklist</Label>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {siteVisitData.salesChecklist.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${item.checked ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                <span>{item.item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes & scheduling */}
                      <div className="space-y-2 mt-3 text-sm">
                        <div>
                          <Label>Next Steps</Label>
                          <p>{siteVisitData.nextSteps || '-'}</p>
                        </div>
                        <div>
                          <Label>Site Notes</Label>
                          <p>{siteVisitData.siteNotes || '-'}</p>
                        </div>
                        <div>
                          <Label>Special Requirements</Label>
                          <p>{siteVisitData.specialRequirements || '-'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div>
                            <Label>Electrician Visit Date</Label>
                            <p>{siteVisitData.electricianVisitDate || '-'}</p>
                          </div>
                          <div>
                            <Label>Electrician Visit Time</Label>
                            <p>{siteVisitData.electricianVisitTime || '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Notes for Electrician</Label>
                            <p>{siteVisitData.electricianNotes || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Comments Section (moved below Project Details) */}
                <div className="space-y-4 mt-6">
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
                <div className="flex justify-end gap-2 pt-4">
                  <Button onClick={() => handleInlineStatusChange(pendingStatus)}>Save</Button>
                  <Button variant="outline" onClick={handleCloseModal}>Close</Button>
                </div>
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

            {/* System Information - Only visible when system type is selected */}
            {projectForm.systemType && (
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="font-medium mb-3">System Information</p>
                <div className="grid grid-cols-2 gap-3">
                  {(projectForm.systemType === "pv-only" || projectForm.systemType === "pv-battery" || projectForm.systemType === "pv-battery-ev" || projectForm.systemType === "pv-ev") && (
                    <>
                  <div>
                    <Label>System Size (kW)</Label>
                    <Input 
                      value={projectForm.systemSize} 
                      onChange={(e) => setProjectForm({ ...projectForm, systemSize: e.target.value })} 
                      placeholder="e.g., 6.6" 
                      type="number"
                      step="0.1"
                    />
                  </div>
                      
                  <div>
                        <Label>Panel Brand</Label>
                        <Input 
                          value={projectForm.panelBrand}
                          onChange={(e) => setProjectForm({ ...projectForm, panelBrand: e.target.value })}
                          placeholder="e.g., Jinko, Longi"
                        />
                  </div>
                      <div>
                        <Label>Panel Module (Watts)</Label>
                        <Input 
                          type="number"
                          step="1"
                          value={projectForm.panelModuleWatts}
                          onChange={(e) => setProjectForm({ ...projectForm, panelModuleWatts: e.target.value })}
                          placeholder="e.g., 415"
                        />
                      </div>
                    </>
                  )}
                  {(projectForm.systemType === "pv-only" || projectForm.systemType === "pv-battery" || projectForm.systemType === "pv-battery-ev" || projectForm.systemType === "pv-ev") && (
                    <>
                    <div>
                        <Label>Inverter Brand</Label>
                        <Input 
                          value={projectForm.inverterBrand}
                          onChange={(e) => setProjectForm({ ...projectForm, inverterBrand: e.target.value })}
                          placeholder="e.g., Fronius, Sungrow"
                        />
                    </div>
                      <div>
                        <Label>Inverter Size (kW)</Label>
                        <Input 
                          type="number" 
                          step="0.1"
                          value={projectForm.inverterSize}
                          onChange={(e) => setProjectForm({ ...projectForm, inverterSize: e.target.value })}
                          placeholder="e.g., 5"
                        />
                      </div>
                    </>
                  )}
                  {(projectForm.systemType === "battery-only" || projectForm.systemType === "pv-battery" || projectForm.systemType === "pv-battery-ev" || projectForm.systemType === "battery-ev") && (
                    <>
                    <div>
                      <Label>Battery Size (kWh)</Label>
                      <Input 
                        value={projectForm.batterySize} 
                        onChange={(e) => setProjectForm({ ...projectForm, batterySize: e.target.value })} 
                        placeholder="e.g., 10" 
                        type="number"
                        step="0.1"
                      />
                    </div>
                  <div>
                        <Label>Battery Brand</Label>
                        <Input 
                          value={projectForm.batteryBrand}
                          onChange={(e) => setProjectForm({ ...projectForm, batteryBrand: e.target.value })}
                          placeholder="e.g., Tesla, Sungrow"
                        />
                  </div>
                      <div>
                        <Label>Battery Model</Label>
                        <Input 
                          value={projectForm.batteryModel}
                          onChange={(e) => setProjectForm({ ...projectForm, batteryModel: e.target.value })}
                          placeholder="e.g., Powerwall 2"
                        />
                      </div>
                    </>
                  )}

                  {(projectForm.systemType === "ev-only" || projectForm.systemType === "pv-battery-ev" || projectForm.systemType === "battery-ev" || projectForm.systemType === "pv-ev") && (
                    <>
                  <div>
                        <Label>EV Charger Brand</Label>
                        <Input 
                          value={projectForm.evChargerBrand}
                          onChange={(e) => setProjectForm({ ...projectForm, evChargerBrand: e.target.value })}
                          placeholder="e.g., Tesla, Wallbox, Zappi"
                        />
                  </div>
                      <div>
                        <Label>EV Charger Model</Label>
                        <Input 
                          value={projectForm.evChargerModel}
                          onChange={(e) => setProjectForm({ ...projectForm, evChargerModel: e.target.value })}
                          placeholder="e.g., Gen 3 Wall Connector"
                        />
                      </div>
                    </>
                  )}
                  
                </div>
              </div>
            )}

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
                <Label>Customer Name</Label>
                <Input value={projectForm.customerName} onChange={(e) => setProjectForm({ ...projectForm, customerName: e.target.value })} placeholder="Customer name" />
              </div>
              <div>
                <Label>Customer Email</Label>
                <Input value={projectForm.customerEmail} onChange={(e) => setProjectForm({ ...projectForm, customerEmail: e.target.value })} placeholder="customer@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Customer Contact</Label>
                <Input value={projectForm.customerContact} onChange={(e) => setProjectForm({ ...projectForm, customerContact: e.target.value })} placeholder="+61 ..." />
              </div>
              <div></div>
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
            

            {/* Property Information */}
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
                        <SelectItem value="tin-colorbond">Tin (Colorbond)</SelectItem>
                        <SelectItem value="tin-kliplock">Tin (Kliplock)</SelectItem>
                        <SelectItem value="tile-concrete">Tile (Concrete)</SelectItem>
                        <SelectItem value="tile-terracotta">Tile (Terracotta)</SelectItem>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Meter Phase</Label>
                    <Select value={projectForm.meterPhase} onValueChange={(v) => setProjectForm({ ...projectForm, meterPhase: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Meter Phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="three">Three</SelectItem>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no-access-required">No Access Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Utility Information */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              <div className="p-3 border rounded-lg">
                <p className="font-medium mb-2">Utility Information</p>
                <div className="space-y-3">
                  <div>
                    <Label>Pre-Approval Reference Number</Label>
                    <Input value={projectForm.preApprovalNumber} onChange={(e) => setProjectForm({ ...projectForm, preApprovalNumber: e.target.value })} placeholder="Pre-Approval Reference Number" />
                  </div>
                  <div>
                    <Label>Energy Retailer</Label>
                    <Input value={projectForm.energyRetailer} onChange={(e) => setProjectForm({ ...projectForm, energyRetailer: e.target.value })} placeholder="e.g., AGL, Origin" />
                  </div>
                  <div>
                    <Label>Energy Distributor</Label>
                    <Select value={projectForm.distributor} onValueChange={(v) => setProjectForm({ ...projectForm, distributor: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Distributor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AusNet">AusNet</SelectItem>
                        <SelectItem value="PowerCor">PowerCor</SelectItem>
                        <SelectItem value="CitiPower">CitiPower</SelectItem>
                        <SelectItem value="United Energy">United Energy</SelectItem>
                        <SelectItem value="Jemena">Jemena</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Solar Victoria Eligibility</Label>
                    <Select value={projectForm.solarVictoriaEligible} onValueChange={(v) => setProjectForm({ ...projectForm, solarVictoriaEligible: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>NMI Number</Label>
                    <Input value={projectForm.nmiNumber} onChange={(e) => setProjectForm({ ...projectForm, nmiNumber: e.target.value })} placeholder="National Meter Identifier" />
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
