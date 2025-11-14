import React, { useEffect, useState } from "react";
import { writeDocSafe } from "../../lib/persistence";
import { db, firebaseEnabled } from "../../lib/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FileUploader } from "../FileUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ArrowLeft, Save, MapPin, Camera, CheckSquare, Calendar as CalendarIcon, Plus, X, Download, Upload, Eye, Edit, Trash2, Phone, Mail, Clock, DollarSign, Zap, Home, Building, Car, Battery, Sun, Wind, Droplets, Thermometer, Lightbulb, Wifi, Shield, CheckCircle, AlertCircle, Star, Filter, Search, MoreHorizontal, Settings, Bell, BellOff, Heart, Share, Bookmark, Flag, MessageSquare, Send, Copy, ExternalLink, ArrowRight, ChevronDown, ChevronUp, PlusCircle, MinusCircle, RefreshCw, FileText, Image, Video, Music, File, Folder, FolderOpen, Archive, Trash, Lock, Unlock, Key, UserCheck, UserX, UserPlus, UserMinus, Users, ThumbsUp, ThumbsDown, BookmarkCheck, Tag, Tags, Hash, AtSign, Percent, Plus as PlusIcon, Minus, Divide, X as XIcon, Equal, NotEqual, GreaterThan, LessThan, GreaterThanOrEqual, LessThanOrEqual, Infinity, Pi, Sigma, Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Eta, Theta, Iota, Kappa, Lambda, Mu, Nu, Xi, Omicron, Rho, Tau, Upsilon, Phi, Chi, Psi, Omega } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface SiteVisitScreenProps { userEmail?: string }

export function SiteVisitScreen({ userEmail }: SiteVisitScreenProps) {
  const initialForm = {
    // Sales Information
    dateOfVisit: "",
    salesPersonName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    propertyAddress: "",
    propertyType: "",
    
    // Energy Information
    currentEnergyProvider: "",
    energyDistributor: "",
    averageMonthlyBill: "",
    roofOrientation: "",
    
    // Property Assessment
    roofType: "",
    roofTypeOther: "",
    meterPhase: "",
    numberOfStory: "",
    numberOfStoryOther: "",
    shadingAssessment: [] as string[],
    shadingAssessmentOther: "",
    
    // Customer Assessment
    primaryMotivation: [] as string[],
    primaryMotivationOther: "",
    existingSolarInstallations: "",
    interestLevel: "",
    
    // Site Visit Checklist
    checklist: [
      { id: 1, item: "Name as per Driver License", checked: false },
      { id: 2, item: "Address provided is the Installation Address", checked: false },
      { id: 3, item: "Rental Property", checked: false },
      { id: 4, item: "Owned Property", checked: false },
      { id: 5, item: "NMI Number Provided", checked: false },
      { id: 6, item: "Meter Number Provided", checked: false },
      { id: 7, item: "Solar Victoria Customer", checked: false },
    ],
    
    // Additional Notes
    siteNotes: "",
    specialRequirements: "",
    nextSteps: "",
    
    // Electrician Booking
    electricianVisitDate: "",
    electricianVisitTime: "",
    electricianNotes: "",

    // Attachments
    attachments: [] as string[],
  };

  const [formData, setFormData] = useState(initialForm);
  const [leadContext, setLeadContext] = useState<{ leadId?: string } | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewVisit, setViewVisit] = useState<any | null>(null);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);

  // Prefill from Leads CRM handoff
  useEffect(() => {
    try {
      const raw = localStorage.getItem('xtr_site_visit_prefill');
      if (!raw) return;
      const pre = JSON.parse(raw) || {};
      const mapDistributor = (d: string): string => {
        const m = (d || '').toLowerCase();
        if (m.includes('ausnet')) return 'ausnet';
        if (m.includes('powercor')) return 'powercor';
        if (m.includes('citipower')) return 'citipower';
        if (m.includes('united')) return 'united-energy';
        if (m.includes('jemena')) return 'jemena';
        return '';
      };
      const mapRoofType = (r: string): string => {
        const v = (r || '').toLowerCase();
        if (v.includes('colorbond')) return 'tin-colorbond';
        if (v.includes('klip') || v.includes('kliplock')) return 'tin-kliplock';
        if (v.includes('tile') && v.includes('concrete')) return 'tile-concrete';
        if (v.includes('tile') && v.includes('terracotta')) return 'tile-terracotta';
        if (v.includes('flat')) return 'flat';
        return '';
      };
      const mapHouseStorey = (h: string): string => {
        const v = (h || '').toLowerCase();
        if (v.includes('single')) return 'single';
        if (v.includes('double') || v.includes('two')) return 'double';
        if (v.includes('triple') || v.includes('three')) return 'triple';
        return '';
      };
      const mapMeterPhase = (p: string): string => {
        const v = (p || '').toLowerCase();
        if (v.includes('single')) return 'single-phase';
        if (v.includes('double') || v.includes('two')) return 'double-phase';
        if (v.includes('three') || v.includes('3')) return 'three-phase';
        return '';
      };
      const mapped: any = {
        customerName: pre.customerName || '',
        customerEmail: pre.customerEmail || '',
        customerPhone: pre.customerPhone || '',
        propertyAddress: pre.customerAddress || '',
        propertyType: pre.clientType === 'residential' || pre.clientType === 'commercial' ? pre.clientType : (pre.propertyType || ''),
        energyDistributor: mapDistributor(pre.distributor || pre.energyDistributor || ''),
        roofType: mapRoofType(pre.roofType || ''),
        numberOfStory: mapHouseStorey(pre.houseStorey || ''),
        meterPhase: mapMeterPhase(pre.meterPhase || ''),
        currentEnergyProvider: pre.energyRetailer || '',
      };
      setFormData(prev => ({ ...prev, ...mapped }));
      // Clear once consumed to avoid stale data on future opens
      localStorage.removeItem('xtr_site_visit_prefill');
    } catch {}
  }, []);

  // Read context (lead id) for handoff
  useEffect(() => {
    try {
      const raw = localStorage.getItem('xtr_site_visit_context');
      if (raw) setLeadContext(JSON.parse(raw));
    } catch {}
  }, []);

  // Load drafts for table view
  useEffect(() => {
    const loadDrafts = () => {
      try {
        const raw = localStorage.getItem('xtr_site_visit_drafts');
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) setDrafts(arr);
      } catch { setDrafts([]); }
    };
    loadDrafts();
    const onStorage = (e: StorageEvent) => { if (e.key === 'xtr_site_visit_drafts') loadDrafts(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Cross-device: subscribe to sales site visits from Firestore and merge with local storage
  useEffect(() => {
    const loadLocal = () => {
      try {
        const raw = localStorage.getItem('xtr_site_visits');
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) setVisits(arr);
      } catch { setVisits([]); }
    };
    loadLocal();
    const onStorage = (e: StorageEvent) => { if (e.key === 'xtr_site_visits') loadLocal(); };
    window.addEventListener('storage', onStorage);
    let unsub: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsub = onSnapshot(collection(db, 'site_visits'), (snap) => {
          const arr = snap.docs.map((d) => d.data());
          if (Array.isArray(arr)) setVisits(arr as any);
        });
      } catch {}
    }
    return () => { window.removeEventListener('storage', onStorage); if (typeof unsub === 'function') unsub(); };
  }, []);

  // Load submitted site visits for table view
  useEffect(() => {
    const loadVisits = () => {
      try {
        const raw = localStorage.getItem('xtr_site_visits');
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) setVisits(arr);
      } catch { setVisits([]); }
    };
    loadVisits();
    const onStorage = (e: StorageEvent) => { if (e.key === 'xtr_site_visits') loadVisits(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Prefill sales person name from logged-in user email
  useEffect(() => {
    if (userEmail) {
      const toFullName = (email: string): string => {
        try {
          const local = (email || '').split('@')[0];
          if (!local) return email;
          const words = local
            .replace(/[._-]+/g, ' ')
            .split(' ')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1));
          const name = words.join(' ');
          return name || email;
        } catch {
          return email;
        }
      };
      const fullName = toFullName(userEmail);
      if (!formData.salesPersonName || formData.salesPersonName === userEmail) {
        setFormData(prev => ({ ...prev, salesPersonName: fullName }));
      }
    }
  }, [userEmail]);


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChecklistChange = (id: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    }));
  };

  const handleShadingAssessmentChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      shadingAssessment: checked 
        ? [...prev.shadingAssessment, value]
        : prev.shadingAssessment.filter(item => item !== value)
    }));
  };

  const handlePrimaryMotivationChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      primaryMotivation: checked 
        ? [...prev.primaryMotivation, value]
        : prev.primaryMotivation.filter(item => item !== value)
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const siteVisitId = `SV-${Date.now()}`;
    const siteVisit = {
      id: siteVisitId,
      createdAt: new Date().toISOString(),
      salesPersonEmail: userEmail || '',
      ...formData,
    } as any;
    try {
      // Save in a simple collection for PM/Operations visibility
      const prev = JSON.parse(localStorage.getItem('xtr_site_visits') || '[]');
      const next = Array.isArray(prev) ? [siteVisit, ...prev] : [siteVisit];
      localStorage.setItem('xtr_site_visits', JSON.stringify(next));
      setVisits(next);
      if (firebaseEnabled && db) {
        addDoc(collection(db, 'site_visits'), siteVisit).catch(() => {});
      }
    } catch {}

    // Update Leads board: attach site visit and move to sales-site-visit
    try {
      const key = 'xtr_leads_state_columns';
      const raw = localStorage.getItem(key);
      const data = raw ? JSON.parse(raw) : { columns: [] };
      const cols: any[] = Array.isArray(data?.columns) ? data.columns : (Array.isArray(data) ? data : []);
      let resolvedLeadId: any = leadContext?.leadId;
      if (Array.isArray(cols)) {
        // Resolve target lead id either from context or by matching customer/email/address
        let targetId: any = leadContext?.leadId;
        let srcIdx = -1;
        let srcLeadIdx = -1;
        let foundLead: any = null;
        if (!targetId) {
          const name = (formData.customerName || '').toLowerCase();
          const addr = (formData.propertyAddress || '').toLowerCase();
          const email = ((siteVisit as any).customerEmail || '').toLowerCase();
          cols.forEach((c, ci) => {
            const li = (c.leads || []).findIndex((l: any) => {
              const lName = (l.title || '').toLowerCase();
              const lAddr = (l.company || '').toLowerCase();
              const lEmail = ((l.tags && l.tags[0]) ? String(l.tags[0]).toLowerCase() : '');
              return (name && lName === name) || (email && lEmail === email) || (addr && lAddr === addr);
            });
            if (li >= 0 && targetId == null) { targetId = (c.leads[li] || {}).id; srcIdx = ci; srcLeadIdx = li; foundLead = c.leads[li]; }
          });
        } else {
          cols.forEach((c, ci) => {
            const li = (c.leads || []).findIndex((l: any) => String(l.id) === String(targetId));
            if (li >= 0) { srcIdx = ci; srcLeadIdx = li; foundLead = c.leads[li]; }
          });
        }

        if (foundLead) {
          const updatedLead = { ...foundLead, status: 'sales-site-visit', siteVisit };
          resolvedLeadId = resolvedLeadId || foundLead.id || targetId;
          if (srcIdx >= 0 && srcLeadIdx >= 0) {
            cols[srcIdx].leads.splice(srcLeadIdx, 1);
            cols[srcIdx].count = (cols[srcIdx].leads || []).length;
          }
          let destIdx = cols.findIndex((c: any) => c.id === 'sales-site-visit');
          if (destIdx < 0) {
            cols.push({ id: 'sales-site-visit', title: 'Sales Site Visit', count: 0, leads: [] });
            destIdx = cols.length - 1;
          }
          cols[destIdx].leads = [updatedLead, ...(cols[destIdx].leads || [])];
          cols[destIdx].count = (cols[destIdx].leads || []).length;
          writeDocSafe('leads_state','columns',{ columns: cols });
          try { localStorage.setItem(key, JSON.stringify({ columns: cols })); } catch {}
        }
      }
    } catch {}
    // Persist a pending attachment for CRM to process on mount (use resolved lead id)
    try {
      const ctxRaw = localStorage.getItem('xtr_site_visit_context');
      const ctx = ctxRaw ? JSON.parse(ctxRaw) : {};
      const leadId = (typeof resolvedLeadId !== 'undefined' && resolvedLeadId != null) ? resolvedLeadId : (ctx?.leadId || leadContext?.leadId);
      localStorage.setItem('xtr_pending_site_visit', JSON.stringify({ leadId, siteVisit }));
      // Also broadcast in case CRM is already mounted
      window.dispatchEvent(new CustomEvent('xtr-leads-attach-site-visit', { detail: { leadId, siteVisit } }));
    } catch {}

    // Navigate back to Leads CRM
    try { window.dispatchEvent(new CustomEvent('xtr-nav', { detail: 'leads-crm' })); } catch {}
    alert("Site visit form submitted successfully!");
  };

  const handleSaveDraft = () => {
    const id = editingDraftId || `DRAFT-${Date.now()}`;
    const draft = { id, updatedAt: new Date().toISOString(), salesPersonName: formData.salesPersonName, ...formData } as any;
    try {
      const prev = JSON.parse(localStorage.getItem('xtr_site_visit_drafts') || '[]');
      let next: any[];
      if (editingDraftId) {
        next = (Array.isArray(prev) ? prev : []).map((d: any) => d.id === id ? draft : d);
      } else {
        next = [draft, ...(Array.isArray(prev) ? prev : [])];
      }
      localStorage.setItem('xtr_site_visit_drafts', JSON.stringify(next));
      setDrafts(next);
      // Reset form to blank after saving draft
      setFormData(initialForm);
      setEditingDraftId(null);
    } catch {}
    alert("Draft saved successfully!");
  };

  // Removed Generate Energy Assessment per request

  const handleExportForm = () => {
    // Create CSV content
    const csvContent = [
      ["Field", "Value"],
      // Sales Information
      ["Date of Visit", formData.dateOfVisit],
      ["Sales Person Name", formData.salesPersonName],
      ["Customer Name", formData.customerName],
      ["Property Address", formData.propertyAddress],
      ["Property Type", formData.propertyType],
      
      // Energy Information
      ["Energy Retailer", formData.currentEnergyProvider],
      ["Energy Distributor", formData.energyDistributor],
      ["Average Monthly Bill", formData.averageMonthlyBill],
      ["Roof Orientation", formData.roofOrientation],
      
      // Property Assessment
      ["Roof Type", formData.roofType],
      ["Roof Type Other", formData.roofTypeOther],
      ["Meter Phase", formData.meterPhase],
      ["Number of Storey", formData.numberOfStory],
      ["Number of Storey Other", formData.numberOfStoryOther],
      ["Shading Assessment", formData.shadingAssessment.join(", ")],
      ["Shading Assessment Other", formData.shadingAssessmentOther],
      
      // Customer Assessment
      ["Primary Motivation", formData.primaryMotivation.join(", ")],
      ["Primary Motivation Other", formData.primaryMotivationOther],
      ["Existing Solar Installations", formData.existingSolarInstallations],
      ["Interest Level", formData.interestLevel],
      
      // Site Visit Checklist
      ...formData.checklist.map(item => [item.item, item.checked ? "Completed" : "Pending"]),
      
      // Additional Notes
      ["Site Notes", formData.siteNotes],
      ["Special Requirements", formData.specialRequirements],
      ["Next Steps", formData.nextSteps],
      
      // Electrician Booking
      ["Electrician Visit Date", formData.electricianVisitDate],
      ["Electrician Visit Time", formData.electricianVisitTime],
      ["Electrician Notes", formData.electricianNotes],
    ].map(row => row.join(",")).join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solar-site-visit-form.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1>Solar Energy Sales Call - Customer Property Visit</h1>
            <p className="text-muted-foreground">Complete site visit documentation and sales information</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={handleExportForm}>
            <Download className="w-4 h-4 mr-2" />
            Export Form
          </Button>
        </div>
      </div>

      

      {/* View Visit Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sales Site Visit</DialogTitle>
          </DialogHeader>
          {viewVisit && (
            <div className="space-y-6 text-sm">
              {/* Customer Information */}
              <div>
                <p className="font-medium mb-2">Customer Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Customer</Label>
                    <p>{viewVisit.customerName || '-'}</p>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <p>{viewVisit.dateOfVisit || '-'}</p>
                  </div>
                  <div>
                    <Label>Customer Email</Label>
                    <p>{viewVisit.customerEmail || '-'}</p>
                  </div>
                  <div>
                    <Label>Customer Phone</Label>
                    <p>{viewVisit.customerPhone || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Property Address</Label>
                    <p>{viewVisit.propertyAddress || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Energy Information */}
              <div>
                <p className="font-medium mb-2">Energy Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Energy Retailer</Label>
                    <p>{viewVisit.currentEnergyProvider || '-'}</p>
                  </div>
                  <div>
                    <Label>Energy Distributor</Label>
                    <p>{viewVisit.energyDistributor || '-'}</p>
                  </div>
                  <div>
                    <Label>Meter Phase</Label>
                    <p className="capitalize">{viewVisit.meterPhase || '-'}</p>
                  </div>
                  <div>
                    <Label>Avg Monthly Bill</Label>
                    <p>{viewVisit.averageMonthlyBill || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Roof Orientation</Label>
                    <p>{viewVisit.roofOrientation || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Property Assessment */}
              <div>
                <p className="font-medium mb-2">Property Assessment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Roof Type</Label>
                    <p className="capitalize">{viewVisit.roofType || '-'}</p>
                  </div>
                  <div>
                    <Label>Number of Storey</Label>
                    <p className="capitalize">{viewVisit.numberOfStory || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Shading Assessment</Label>
                    <p>{Array.isArray(viewVisit.shadingAssessment) && viewVisit.shadingAssessment.length > 0 ? viewVisit.shadingAssessment.join(', ') : '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Primary Motivation</Label>
                    <p>{Array.isArray(viewVisit.primaryMotivation) && viewVisit.primaryMotivation.length > 0 ? viewVisit.primaryMotivation.join(', ') : '-'}</p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <p className="font-medium mb-2">Site Visit Checklist</p>
                <div className="grid grid-cols-2 gap-2">
                  {Array.isArray(viewVisit.checklist) && viewVisit.checklist.length > 0 ? (
                    viewVisit.checklist.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${item.checked ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span>{item.item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No checklist data.</p>
                  )}
                </div>
              </div>

              {/* Attachments */}
              <div>
                <p className="font-medium mb-2">Attachments</p>
                {Array.isArray(viewVisit.attachments) && viewVisit.attachments.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {viewVisit.attachments.map((name: string, idx: number) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No files uploaded.</p>
                )}
              </div>

              {/* Electrician Booking */}
              <div>
                <p className="font-medium mb-2">Electrician Site Visit</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Visit Date</Label>
                    <p>{viewVisit.electricianVisitDate || '-'}</p>
                  </div>
                  <div>
                    <Label>Visit Time</Label>
                    <p>{viewVisit.electricianVisitTime || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Notes</Label>
                    <p>{viewVisit.electricianNotes || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* Sales Information */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Solar Energy Sales Call - Customer Property Visit
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfVisit">Date of Visit</Label>
                  <Input
                    id="dateOfVisit"
                    type="date"
                    value={formData.dateOfVisit}
                    onChange={(e) => handleInputChange("dateOfVisit", e.target.value)}
                    placeholder="Month, day, year"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesPersonName">Sales Person Name</Label>
                  <Input
                    id="salesPersonName"
                    value={formData.salesPersonName}
                    onChange={(e) => handleInputChange("salesPersonName", e.target.value)}
                    placeholder="Enter sales person name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Textarea
                    id="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                    placeholder="Enter property address"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
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
                {formData.propertyType === "other" && (
                  <div className="space-y-2">
                    <Label htmlFor="propertyTypeOther">Please specify property type</Label>
                    <Textarea
                      id="propertyTypeOther"
                      value={formData.propertyTypeOther}
                      onChange={(e) => handleInputChange("propertyTypeOther", e.target.value)}
                      placeholder="Enter property type details"
                      className="min-h-[80px]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Energy Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Energy Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentEnergyProvider">Energy Retailer</Label>
                  <Input
                    id="currentEnergyProvider"
                    value={formData.currentEnergyProvider}
                    onChange={(e) => handleInputChange("currentEnergyProvider", e.target.value)}
                    placeholder="e.g., AGL, Origin, EnergyAustralia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="energyDistributor">Energy Distributor</Label>
                  <Select value={formData.energyDistributor} onValueChange={(value) => handleInputChange("energyDistributor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select energy distributor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ausnet">Ausnet</SelectItem>
                      <SelectItem value="powercor">PowerCor</SelectItem>
                      <SelectItem value="citipower">Citipower</SelectItem>
                      <SelectItem value="jemena">Jemena</SelectItem>
                      <SelectItem value="united-energy">United Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="averageMonthlyBill">Average Monthly Electricity Bill (approx.)</Label>
                  <Input
                    id="averageMonthlyBill"
                    value={formData.averageMonthlyBill}
                    onChange={(e) => handleInputChange("averageMonthlyBill", e.target.value)}
                    placeholder="Short answer text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roofOrientation">Roof Orientation (Main Solar Area)</Label>
                  <Select value={formData.roofOrientation} onValueChange={(value) => handleInputChange("roofOrientation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select roof orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North</SelectItem>
                      <SelectItem value="northeast">Northeast</SelectItem>
                      <SelectItem value="east">East</SelectItem>
                      <SelectItem value="southeast">Southeast</SelectItem>
                      <SelectItem value="south">South</SelectItem>
                      <SelectItem value="southwest">Southwest</SelectItem>
                      <SelectItem value="west">West</SelectItem>
                      <SelectItem value="northwest">Northwest</SelectItem>
                      <SelectItem value="flat-roof">Flat Roof</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </CardContent>
          </Card>

            {/* Property Assessment */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Property Assessment
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roofType">Roof Type</Label>
                  <Select value={formData.roofType} onValueChange={(value) => handleInputChange("roofType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select roof type" />
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
                {formData.roofType === "other" && (
                  <div className="space-y-2">
                    <Label htmlFor="roofTypeOther">Please specify roof type</Label>
                    <Textarea
                      id="roofTypeOther"
                      value={formData.roofTypeOther}
                      onChange={(e) => handleInputChange("roofTypeOther", e.target.value)}
                      placeholder="Enter roof type details"
                      className="min-h-[80px]"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="meterPhase">Meter Phase</Label>
                  <Select value={formData.meterPhase} onValueChange={(value) => handleInputChange("meterPhase", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meter phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-phase">Single Phase</SelectItem>
                      <SelectItem value="double-phase">Double Phase</SelectItem>
                      <SelectItem value="three-phase">Three Phase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfStory">Number of Storey</Label>
                  <Select value={formData.numberOfStory} onValueChange={(value) => handleInputChange("numberOfStory", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of stories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="triple">Triple</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.numberOfStory === "other" && (
                  <div className="space-y-2">
                    <Label htmlFor="numberOfStoryOther">Please specify number of stories</Label>
                    <Textarea
                      id="numberOfStoryOther"
                      value={formData.numberOfStoryOther}
                      onChange={(e) => handleInputChange("numberOfStoryOther", e.target.value)}
                      placeholder="Enter number of stories details"
                      className="min-h-[80px]"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Shading Assessment</Label>
                  <Select 
                    value={formData.shadingAssessment[0] || ""} 
                    onValueChange={(value) => {
                      if (value && !formData.shadingAssessment.includes(value)) {
                        setFormData(prev => ({
                          ...prev,
                          shadingAssessment: [...prev.shadingAssessment, value]
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shading conditions (multiple allowed)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-shading">No significant shading</SelectItem>
                      <SelectItem value="morning-shading">Partial shading in morning</SelectItem>
                      <SelectItem value="afternoon-shading">Partial shading in afternoon</SelectItem>
                      <SelectItem value="heavy-shading">Heavy shading from trees</SelectItem>
                      <SelectItem value="heavy-shading-buildings">Heavy shading from adjacent buildings</SelectItem>
                      <SelectItem value="other-shading">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.shadingAssessment.includes("other-shading") && (
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="shadingAssessmentOther">Please specify shading conditions</Label>
                      <Textarea
                        id="shadingAssessmentOther"
                        value={formData.shadingAssessmentOther}
                        onChange={(e) => handleInputChange("shadingAssessmentOther", e.target.value)}
                        placeholder="Enter shading assessment details"
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                  {formData.shadingAssessment.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.shadingAssessment.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                        >
                          <span>
                            {item === "no-shading" && "No significant shading"}
                            {item === "morning-shading" && "Partial shading in morning"}
                            {item === "afternoon-shading" && "Partial shading in afternoon"}
                            {item === "heavy-shading" && "Heavy shading from trees"}
                            {item === "heavy-shading-buildings" && "Heavy shading from adjacent buildings"}
                            {item === "other-shading" && "Other"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleShadingAssessmentChange(item, false)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                </div>
                      ))}
              </div>
                  )}
              </div>
            </CardContent>
          </Card>

            {/* Customer Assessment */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Assessment
                </CardTitle>
            </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Motivation */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Customer's Primary Motivation for Solar</Label>
                  <Select 
                    value={formData.primaryMotivation[0] || ""} 
                    onValueChange={(value) => {
                      if (value && !formData.primaryMotivation.includes(value)) {
                        setFormData(prev => ({
                          ...prev,
                          primaryMotivation: [...prev.primaryMotivation, value]
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select motivation factors (multiple allowed)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reduce-bill">Reduce electricity bill</SelectItem>
                      <SelectItem value="environmental">Environmental concerns</SelectItem>
                      <SelectItem value="energy-independence">Energy independence</SelectItem>
                      <SelectItem value="property-value">Increase property value</SelectItem>
                      <SelectItem value="government-incentives">Government incentives/rebates</SelectItem>
                      <SelectItem value="other-motivation">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.primaryMotivation.includes("other-motivation") && (
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="primaryMotivationOther">Please specify motivation</Label>
                      <Textarea
                        id="primaryMotivationOther"
                        value={formData.primaryMotivationOther}
                        onChange={(e) => handleInputChange("primaryMotivationOther", e.target.value)}
                        placeholder="Enter motivation details"
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                  {formData.primaryMotivation.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.primaryMotivation.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                        >
                          <span>
                            {item === "reduce-bill" && "Reduce electricity bill"}
                            {item === "environmental" && "Environmental concerns"}
                            {item === "energy-independence" && "Energy independence"}
                            {item === "property-value" && "Increase property value"}
                            {item === "government-incentives" && "Government incentives/rebates"}
                            {item === "other-motivation" && "Other"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePrimaryMotivationChange(item, false)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Existing Solar Installations */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Any existing solar installations or previous quotes?</Label>
                  <RadioGroup 
                    value={formData.existingSolarInstallations} 
                    onValueChange={(value) => handleInputChange("existingSolarInstallations", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="existing-yes" />
                      <Label htmlFor="existing-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="existing-no" />
                      <Label htmlFor="existing-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Interest Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Customer Interest Level in Solar</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Not interested</span>
                    <RadioGroup 
                      value={formData.interestLevel} 
                      onValueChange={(value) => handleInputChange("interestLevel", value)}
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div key={num} className="flex flex-col items-center space-y-1">
                          <RadioGroupItem value={num.toString()} id={`interest-${num}`} />
                          <Label htmlFor={`interest-${num}`} className="text-xs">{num}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <span className="text-sm text-gray-600">Very interested</span>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Additional Notes */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Site Visit Notes
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="siteNotes">Site Visit Notes</Label>
                  <Textarea
                    id="siteNotes"
                    placeholder="Document key findings, measurements, and observations from the site visit..."
                    className="min-h-[100px]"
                    value={formData.siteNotes}
                    onChange={(e) => handleInputChange("siteNotes", e.target.value)}
                  />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Note any special installation requirements, restrictions, or considerations..."
                    className="min-h-[80px]"
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                  />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="nextSteps">Next Steps</Label>
                  <Textarea
                    id="nextSteps"
                    placeholder="Outline the next steps for the customer and project team..."
                    className="min-h-[80px]"
                    value={formData.nextSteps}
                    onChange={(e) => handleInputChange("nextSteps", e.target.value)}
                  />
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Right Sidebar */}
        <div className="space-y-6">
            {/* Site Visit Checklist */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                  Site Visit Checklist
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                  {formData.checklist.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`checklist-${item.id}`}
                        checked={item.checked}
                        onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                      />
                      <Label
                        htmlFor={`checklist-${item.id}`}
                        className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                      >
                      {item.item}
                      </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

            {/* File Upload */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photos & Documents
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FileUploader onFilesChange={(files) => setFormData(prev => ({
                  ...prev,
                  attachments: files.map(f => f.name)
                }))} />
              </CardContent>
            </Card>

            {/* Electrician Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Electrician Site Visit Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="electricianVisitDate">Visit Date</Label>
                  <Input
                    id="electricianVisitDate"
                    type="date"
                    value={formData.electricianVisitDate}
                    onChange={(e) => handleInputChange("electricianVisitDate", e.target.value)}
                    placeholder="Select date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electricianVisitTime">Visit Time</Label>
                  <Select 
                    value={formData.electricianVisitTime} 
                    onValueChange={(value) => handleInputChange("electricianVisitTime", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="08:30">8:30 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="09:30">9:30 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="10:30">10:30 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="11:30">11:30 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="12:30">12:30 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="13:30">1:30 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="14:30">2:30 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="15:30">3:30 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="16:30">4:30 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electricianNotes">Notes for Electrician</Label>
                  <Textarea
                    id="electricianNotes"
                    value={formData.electricianNotes}
                    onChange={(e) => handleInputChange("electricianNotes", e.target.value)}
                    placeholder="Add any specific notes or requirements for the electrician..."
                    className="min-h-[80px]"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    if (formData.electricianVisitDate && formData.electricianVisitTime) {
                      alert(`Electrician visit scheduled for ${formData.electricianVisitDate} at ${formData.electricianVisitTime}`);
                    } else {
                      alert("Please select both date and time for the electrician visit");
                    }
                  }}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Schedule Visit
                </Button>
            </CardContent>
          </Card>

        </div>
      </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button type="submit">
            Submit Site Visit
          </Button>
        </div>
      </form>

      {/* Saved Drafts */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Saved Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] overflow-y-scroll pr-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Energy Retailer</TableHead>
                <TableHead>Meter Phase</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">No drafts yet.</TableCell>
                </TableRow>
              ) : (
                drafts.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.customerName || '-'}</TableCell>
                    <TableCell className="max-w-[320px] truncate">{d.propertyAddress || '-'}</TableCell>
                    <TableCell>{d.dateOfVisit || '-'}</TableCell>
                    <TableCell>{d.currentEnergyProvider || '-'}</TableCell>
                    <TableCell className="capitalize">{d.meterPhase || '-'}</TableCell>
                    <TableCell>{new Date(d.updatedAt || d.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => {
                        setFormData({ ...formData, ...d });
                        setEditingDraftId(d.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Submitted Site Visits */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Submitted Site Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[320px] overflow-y-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Energy Retailer</TableHead>
                <TableHead>Meter Phase</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No submissions yet.</TableCell>
                </TableRow>
              ) : (
                visits.map((v) => (
                  <TableRow key={v.id || v.createdAt}>
                    <TableCell>{v.customerName || '-'}</TableCell>
                    <TableCell>{v.dateOfVisit || '-'}</TableCell>
                    <TableCell>{v.currentEnergyProvider || '-'}</TableCell>
                    <TableCell className="capitalize">{v.meterPhase || '-'}</TableCell>
                    <TableCell>{new Date(v.createdAt || Date.now()).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => { setViewVisit(v); setShowViewDialog(true); }}>View</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}