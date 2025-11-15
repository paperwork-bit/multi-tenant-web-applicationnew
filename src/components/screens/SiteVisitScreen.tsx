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
import { Save, Download, CheckSquare, Calendar as CalendarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface SiteVisitScreenProps { userEmail?: string }

export function SiteVisitScreen({ userEmail }: SiteVisitScreenProps) {
  const initialForm = {
    // Image 1: Basic Information
    salesPersonName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    propertyAddress: "",
    price: "",
    
    // System Information
    systemSizeKw: "",
    inverterSizeKw: "",
    inverterBrand: "",
    inverterType: "",
    panelBrand: "",
    panelModuleWatts: "",
    
    // Image 2: Energy Information
    currentEnergyProvider: "",
    energyDistributor: "",
    averageMonthlyBill: "",
    roofOrientation: "",
    
    // Image 3: Property Details
    roofType: "",
    roofTypeOther: "",
    meterPhase: "",
    numberOfStory: "",
    numberOfStoryOther: "",
    accessSecondStorey: "",
    accessToInverter: "",
    
    // Image 4: Assessment Information
    shadingAssessment: [] as string[],
    shadingAssessmentOther: "",
    primaryMotivation: [] as string[],
    primaryMotivationOther: "",
    existingSolarInstallations: "",
    interestLevel: "",
    
    // Image 5: Additional Information
    nextSteps: "",
    attachments: [] as string[],
    
    // Legacy fields for compatibility
    dateOfVisit: "",
    siteNotes: "",
    specialRequirements: "",
    electricianVisitDate: "",
    electricianVisitTime: "",
    electricianNotes: "",
    salesChecklist: [
      { id: 1, item: "Customer greeted and welcomed", checked: false },
      { id: 2, item: "Property overview completed", checked: false },
      { id: 3, item: "Energy needs and usage discussed", checked: false },
      { id: 4, item: "Roof assessment completed", checked: false },
      { id: 5, item: "Meter location identified", checked: false },
      { id: 6, item: "Photos of property taken", checked: false },
      { id: 7, item: "Quote prepared and discussed", checked: false },
      { id: 8, item: "Customer questions answered", checked: false },
      { id: 9, item: "Next steps agreed upon", checked: false },
      { id: 10, item: "Follow-up scheduled", checked: false },
    ] as Array<{ id: number; item: string; checked: boolean }>,
    checklist: [
      { id: 1, item: "Site safety assessment completed", checked: false },
      { id: 2, item: "Electrical panel inspection done", checked: false },
      { id: 3, item: "Roof condition verified", checked: false },
      { id: 4, item: "Structural assessment completed", checked: false },
      { id: 5, item: "Access routes identified", checked: false },
      { id: 6, item: "Utility connections verified", checked: false },
      { id: 7, item: "Permit requirements checked", checked: false },
      { id: 8, item: "Customer expectations discussed", checked: false },
    ] as Array<{ id: number; item: string; checked: boolean }>,
  };

  const [formData, setFormData] = useState(initialForm);
  const [leadContext, setLeadContext] = useState<{ leadId?: string } | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewVisit, setViewVisit] = useState<any | null>(null);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);


  // Helper function to map energy distributor values from Leads CRM to Site Visit form
  const mapEnergyDistributor = (value: string | null | undefined): string => {
    if (!value) return '';
    const normalized = value.toLowerCase().trim();
    // Map various formats to the form's expected values
    if (normalized.includes('ausnet') || normalized === 'ausnet') return 'ausnet';
    if (normalized.includes('powercor') || normalized === 'powercor') return 'powercor';
    if (normalized.includes('citipower') || normalized === 'citipower') return 'citipower';
    if (normalized.includes('jemena') || normalized === 'jemena') return 'jemena';
    if (normalized.includes('united') && normalized.includes('energy')) return 'united-energy';
    return value; // Return as-is if no match
  };

  // Helper function to map meter phase values from Leads CRM to Site Visit form
  const mapMeterPhase = (value: string | null | undefined): string => {
    if (!value) return '';
    const normalized = value.toLowerCase().trim();
    // Map from "single", "double", "three" to "single-phase", "double-phase", "three-phase"
    if (normalized === 'single' || normalized === 'single-phase') return 'single-phase';
    if (normalized === 'double' || normalized === 'double-phase') return 'double-phase';
    if (normalized === 'three' || normalized === 'three-phase') return 'three-phase';
    return value; // Return as-is if already in correct format or unknown
  };

  // Prefill from project data if available
  useEffect(() => {
    try {
      // First try to get prefill from localStorage (direct prefill)
      const raw = localStorage.getItem('xtr_site_visit_prefill');
      if (raw) {
        const pre = JSON.parse(raw) || {};
        setFormData(prev => ({
          ...prev,
          // Basic Information - from project details
          salesPersonName: pre.salesPersonName || prev.salesPersonName,
          customerName: pre.customerName || prev.customerName,
          customerEmail: pre.customerEmail || prev.customerEmail,
          customerPhone: pre.customerPhone || pre.customerContact || prev.customerPhone,
          propertyAddress: pre.propertyAddress || pre.customerAddress || prev.propertyAddress,
          price: pre.price || pre.priceAud || pre.projectCost || prev.price,
          
          // System Information
          systemSizeKw: pre.systemSizeKw || pre.systemSize || prev.systemSizeKw,
          inverterSizeKw: pre.inverterSizeKw || prev.inverterSizeKw,
          inverterBrand: pre.inverterBrand || prev.inverterBrand,
          inverterType: pre.inverterType || prev.inverterType,
          panelBrand: pre.panelBrand || prev.panelBrand,
          panelModuleWatts: pre.panelModuleWatts || prev.panelModuleWatts,
          
          // Energy Information - from project details (with mapping)
          currentEnergyProvider: pre.currentEnergyProvider || prev.currentEnergyProvider,
          energyDistributor: mapEnergyDistributor(pre.energyDistributor) || prev.energyDistributor,
          averageMonthlyBill: pre.averageMonthlyBill || prev.averageMonthlyBill,
          roofOrientation: pre.roofOrientation || prev.roofOrientation,
          
          // Property Details - from project details (with mapping)
          roofType: pre.roofType || prev.roofType,
          meterPhase: mapMeterPhase(pre.meterPhase) || prev.meterPhase,
          numberOfStory: pre.numberOfStory || pre.houseStorey || prev.numberOfStory,
          accessSecondStorey: pre.accessSecondStorey || prev.accessSecondStorey,
          accessToInverter: pre.accessToInverter || prev.accessToInverter,
        }));
        // Clear once consumed to avoid stale data on future opens
        localStorage.removeItem('xtr_site_visit_prefill');
        return;
      }

      // If no direct prefill, try to load from lead context
      const contextRaw = localStorage.getItem('xtr_site_visit_context');
      if (contextRaw) {
        const context = JSON.parse(contextRaw) || {};
        const leadId = context.leadId;
        
        if (leadId) {
          // Load leads from localStorage
          const leadsRaw = localStorage.getItem('xtr_leads_state_columns');
          if (leadsRaw) {
            const leadsData = JSON.parse(leadsRaw);
            const columns = Array.isArray(leadsData?.columns) ? leadsData.columns : (Array.isArray(leadsData) ? leadsData : []);
            
            // Find the lead across all columns
            let foundLead: any = null;
            columns.forEach((col: any) => {
              if (foundLead) return;
              const lead = (col.leads || []).find((l: any) => String(l.id) === String(leadId));
              if (lead) foundLead = lead;
            });
            
            if (foundLead) {
              const snap = foundLead.projectSnapshot || {};
              const sv = foundLead.siteVisit || {};
              
              setFormData(prev => ({
                ...prev,
                // Basic Information - from project details
                customerName: snap.customerName || foundLead.title || prev.customerName,
                customerEmail: snap.customerEmail || (foundLead.tags && foundLead.tags[0]) || sv.customerEmail || prev.customerEmail,
                customerPhone: snap.customerPhone || foundLead.value || sv.customerPhone || prev.customerPhone,
                propertyAddress: snap.customerAddress || foundLead.company || sv.propertyAddress || prev.propertyAddress,
                price: snap.price || snap.projectDetails?.additionalInfo?.priceAud || prev.price,
                
                // System Information
                systemSizeKw: snap.systemInfo?.systemSize || snap.systemSize || sv.systemSizeKw || prev.systemSizeKw,
                inverterSizeKw: snap.systemInfo?.inverterSize || sv.inverterSizeKw || prev.inverterSizeKw,
                inverterBrand: snap.systemInfo?.inverterBrand || sv.inverterBrand || prev.inverterBrand,
                inverterType: snap.systemInfo?.inverterType || sv.inverterType || prev.inverterType,
                panelBrand: snap.systemInfo?.panelBrand || sv.panelBrand || prev.panelBrand,
                panelModuleWatts: snap.systemInfo?.panelModuleWatts || sv.panelModuleWatts || prev.panelModuleWatts,
                
                // Energy Information - from project details (with mapping)
                currentEnergyProvider: snap.utilityInfo?.energyRetailer || sv.currentEnergyProvider || prev.currentEnergyProvider,
                energyDistributor: mapEnergyDistributor(snap.utilityInfo?.distributor || sv.energyDistributor) || prev.energyDistributor,
                averageMonthlyBill: sv.averageMonthlyBill || prev.averageMonthlyBill,
                roofOrientation: sv.roofOrientation || prev.roofOrientation,
                
                // Property Details - from project details (with mapping)
                roofType: snap.propertyInfo?.roofType || sv.roofType || prev.roofType,
                meterPhase: mapMeterPhase(snap.propertyInfo?.meterPhase || sv.meterPhase) || prev.meterPhase,
                numberOfStory: snap.propertyInfo?.houseStorey || sv.numberOfStory || prev.numberOfStory,
                accessSecondStorey: snap.propertyInfo?.accessSecondStorey || sv.accessSecondStorey || prev.accessSecondStorey,
                accessToInverter: snap.propertyInfo?.accessToInverter || sv.accessToInverter || prev.accessToInverter,
              }));
            }
          }
        }
      }
    } catch (err) {
      console.error('Error pre-filling form:', err);
    }
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

  const handleSalesChecklistChange = (id: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      salesChecklist: prev.salesChecklist.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    }));
  };

  const handleShadingAssessmentChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      shadingAssessment: checked 
        ? [...(prev.shadingAssessment || []).filter(item => item !== value), value]
        : (prev.shadingAssessment || []).filter(item => item !== value)
    }));
  };

  const handlePrimaryMotivationChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      primaryMotivation: checked 
        ? [...(prev.primaryMotivation || []).filter(item => item !== value), value]
        : (prev.primaryMotivation || []).filter(item => item !== value)
    }));
  };

  const handleFileUpload = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: files.map(f => f.name)
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const siteVisitId = `SV-${Date.now()}`;
    // Ensure dateOfVisit is set to current date if not already set
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const siteVisit = {
      id: siteVisitId,
      createdAt: new Date().toISOString(),
      salesPersonEmail: userEmail || '',
      ...formData,
      dateOfVisit: formData.dateOfVisit || currentDate,
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
    let resolvedLeadId: any = leadContext?.leadId;
    try {
      const key = 'xtr_leads_state_columns';
      const raw = localStorage.getItem(key);
      const data = raw ? JSON.parse(raw) : { columns: [] };
      const cols: any[] = Array.isArray(data?.columns) ? data.columns : (Array.isArray(data) ? data : []);
      if (Array.isArray(cols)) {
        // Resolve target lead id either from context or by matching customer/email/address
        let targetId: any = leadContext?.leadId;
        let srcIdx = -1;
        let srcLeadIdx = -1;
        let foundLead: any = null;
        if (!targetId) {
          const name = (formData.customerName || '').toLowerCase();
          const addr = (formData.propertyAddress || '').toLowerCase();
          const email = ((siteVisit as any).customerEmail || (siteVisit as any).customerContact || '').toLowerCase();
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

    // Clear prefill and context data to prevent re-population
    try {
      localStorage.removeItem('xtr_site_visit_prefill');
      localStorage.removeItem('xtr_site_visit_context');
    } catch {}
    
    // Reset form to blank after submitting
    setFormData(initialForm);
    
    // Navigate back to Leads CRM
    try { window.dispatchEvent(new CustomEvent('xtr-nav', { detail: 'leads-crm' })); } catch {}
    alert("Site visit form submitted successfully!");
  };

  const handleSaveDraft = () => {
    const id = editingDraftId || `DRAFT-${Date.now()}`;
    // Ensure dateOfVisit is set to current date if not already set
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const draft = { 
      id, 
      updatedAt: new Date().toISOString(), 
      ...formData,
      dateOfVisit: formData.dateOfVisit || currentDate,
    } as any;
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
      
      // Clear prefill and context data to prevent re-population
      try {
        localStorage.removeItem('xtr_site_visit_prefill');
        localStorage.removeItem('xtr_site_visit_context');
      } catch {}
      
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
      ["Customer Email", formData.customerEmail],
      ["Customer Contact", formData.customerPhone],
      ["Property Address", formData.propertyAddress],
      ["Price (AUD)", formData.price],
      
      // System Information
      ["System Size (kW)", formData.systemSizeKw],
      ["Inverter Size (kW)", formData.inverterSizeKw],
      ["Inverter Brand", formData.inverterBrand],
      ["Inverter Type", formData.inverterType],
      ["Panel Brand", formData.panelBrand],
      ["Panel Module (Watts)", formData.panelModuleWatts],
      
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
      ["Access to 2nd Storey", formData.accessSecondStorey],
      ["Access to Inverter", formData.accessToInverter],
      ["Shading Assessment", (formData.shadingAssessment || []).join(", ")],
      ["Shading Assessment Other", formData.shadingAssessmentOther],
      
      // Customer Assessment
      ["Primary Motivation", (formData.primaryMotivation || []).join(", ")],
      ["Primary Motivation Other", formData.primaryMotivationOther],
      ["Existing Solar Installations", formData.existingSolarInstallations],
      ["Interest Level", formData.interestLevel],
      
      // Sales Site Visit Checklist
      ...(formData.salesChecklist || []).map(item => [item.item, item.checked ? "Completed" : "Pending"]),
      
      // Site Visit Checklist
      ...(formData.checklist || []).map(item => [item.item, item.checked ? "Completed" : "Pending"]),
      
      // Additional Information
      ["Attachments", (formData.attachments || []).join(", ")],
      
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
                  <div>
                    <Label>Price (AUD)</Label>
                    <p>{viewVisit.price || viewVisit.priceAud || '-'}</p>
                  </div>
                </div>
              </div>

              {/* System Information */}
              {(viewVisit.systemSizeKw || viewVisit.inverterBrand || viewVisit.panelBrand) && (
                <div>
                  <p className="font-medium mb-2">System Information</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>System Size (kW)</Label>
                      <p>{viewVisit.systemSizeKw || '-'}</p>
                    </div>
                    <div>
                      <Label>Inverter Size (kW)</Label>
                      <p>{viewVisit.inverterSizeKw || '-'}</p>
                    </div>
                    <div>
                      <Label>Inverter Brand</Label>
                      <p>{viewVisit.inverterBrand || '-'}</p>
                    </div>
                    <div>
                      <Label>Inverter Type</Label>
                      <p>{viewVisit.inverterType || '-'}</p>
                    </div>
                    <div>
                      <Label>Panel Brand</Label>
                      <p>{viewVisit.panelBrand || '-'}</p>
                    </div>
                    <div>
                      <Label>Panel Module (Watts)</Label>
                      <p>{viewVisit.panelModuleWatts || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

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
                  <div>
                    <Label>Access to 2nd Storey</Label>
                    <p className="capitalize">{viewVisit.accessSecondStorey || '-'}</p>
                  </div>
                  <div>
                    <Label>Access to Inverter</Label>
                    <p className="capitalize">{viewVisit.accessToInverter || '-'}</p>
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

              {/* Sales Checklist */}
              <div>
                <p className="font-medium mb-2">Sales Site Visit Checklist</p>
                <div className="grid grid-cols-2 gap-2">
                  {Array.isArray(viewVisit.salesChecklist) && viewVisit.salesChecklist.length > 0 ? (
                    viewVisit.salesChecklist.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${item.checked ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span>{item.item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No sales checklist data.</p>
                  )}
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
          {/* Image 1: Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salesPersonName">Sales Person Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="salesPersonName"
                    value={formData.salesPersonName}
                    onChange={(e) => handleInputChange("salesPersonName", e.target.value)}
                    placeholder="Short answer text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Short answer text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                    placeholder="customer@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Contact</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                    placeholder="+61 400 000 000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Textarea
                    id="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                    placeholder="Long answer text"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (AUD)</Label>
                  <Input
                    id="price"
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="$"
                  />
                </div>
              </div>
              
              {/* System Information */}
              <div className="pt-4 border-t">
                <Label className="text-base font-semibold mb-4 block">System Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemSizeKw">System Size (kW)</Label>
                    <Input
                      id="systemSizeKw"
                      type="number"
                      step="0.1"
                      value={formData.systemSizeKw}
                      onChange={(e) => handleInputChange("systemSizeKw", e.target.value)}
                      placeholder="e.g., 6.6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inverterSizeKw">Inverter Size (kW)</Label>
                    <Input
                      id="inverterSizeKw"
                      type="number"
                      step="0.1"
                      value={formData.inverterSizeKw}
                      onChange={(e) => handleInputChange("inverterSizeKw", e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inverterBrand">Inverter Brand</Label>
                    <Input
                      id="inverterBrand"
                      value={formData.inverterBrand}
                      onChange={(e) => handleInputChange("inverterBrand", e.target.value)}
                      placeholder="e.g., Fronius, Sungrow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inverterType">Inverter Type</Label>
                    <Input
                      id="inverterType"
                      value={formData.inverterType}
                      onChange={(e) => handleInputChange("inverterType", e.target.value)}
                      placeholder="e.g., String, Micro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panelBrand">Panel Brand</Label>
                    <Input
                      id="panelBrand"
                      value={formData.panelBrand}
                      onChange={(e) => handleInputChange("panelBrand", e.target.value)}
                      placeholder="e.g., Jinko, Longi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panelModuleWatts">Panel Module (Watts)</Label>
                    <Input
                      id="panelModuleWatts"
                      type="number"
                      step="1"
                      value={formData.panelModuleWatts}
                      onChange={(e) => handleInputChange("panelModuleWatts", e.target.value)}
                      placeholder="e.g., 415"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image 2: Energy Information */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentEnergyProvider">Current Energy Provider <span className="text-red-500">*</span></Label>
                  <Input
                    id="currentEnergyProvider"
                    value={formData.currentEnergyProvider}
                    onChange={(e) => handleInputChange("currentEnergyProvider", e.target.value)}
                    placeholder="Short answer text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="energyDistributor">Energy Distributor <span className="text-red-500">*</span></Label>
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
                  <Label htmlFor="averageMonthlyBill">Average Monthly Electricity Bill (approx.) <span className="text-red-500">*</span></Label>
                  <Input
                    id="averageMonthlyBill"
                    value={formData.averageMonthlyBill}
                    onChange={(e) => handleInputChange("averageMonthlyBill", e.target.value)}
                    placeholder="Short answer text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roofOrientation">Roof Orientation (Main Solar Area) <span className="text-red-500">*</span></Label>
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
              </div>
            </CardContent>
          </Card>

          {/* Image 3: Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roofType">Roof Type <span className="text-red-500">*</span></Label>
                  <Select value={formData.roofType} onValueChange={(value) => {
                    handleInputChange("roofType", value);
                    if (value !== "other") handleInputChange("roofTypeOther", "");
                  }}>
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
                    <Label htmlFor="roofTypeOther">Please specify</Label>
                    <Input
                      id="roofTypeOther"
                      value={formData.roofTypeOther}
                      onChange={(e) => handleInputChange("roofTypeOther", e.target.value)}
                      placeholder="Specify roof type"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="meterPhase">Meter Phase <span className="text-red-500">*</span></Label>
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
                  <Label htmlFor="numberOfStory">Number of Story <span className="text-red-500">*</span></Label>
                  <Select value={formData.numberOfStory} onValueChange={(value) => {
                    handleInputChange("numberOfStory", value);
                    if (value !== "other") handleInputChange("numberOfStoryOther", "");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of storeys" />
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
                    <Label htmlFor="numberOfStoryOther">Please specify</Label>
                    <Input
                      id="numberOfStoryOther"
                      value={formData.numberOfStoryOther}
                      onChange={(e) => handleInputChange("numberOfStoryOther", e.target.value)}
                      placeholder="Specify number of storeys"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="accessSecondStorey">Access to 2nd Storey</Label>
                  <Select value={formData.accessSecondStorey} onValueChange={(value) => handleInputChange("accessSecondStorey", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="na">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessToInverter">Access to Inverter</Label>
                  <Select value={formData.accessToInverter} onValueChange={(value) => handleInputChange("accessToInverter", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no-access-required">No Access Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image 4: Assessment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Shading Assessment</Label>
                <div className="space-y-2">
                  {["No significant shading", "Partial shading in morning", "Partial shading in afternoon", "Heavy shading from trees", "Heavy shading from adjacent buildings", "Other (specify in notes)"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`shading-${option}`}
                        checked={formData.shadingAssessment?.includes(option) || false}
                        onCheckedChange={(checked) => handleShadingAssessmentChange(option, checked as boolean)}
                      />
                      <Label htmlFor={`shading-${option}`} className="font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.shadingAssessment?.includes("Other (specify in notes)") && (
                  <div className="space-y-2">
                    <Label htmlFor="shadingAssessmentOther">Please specify</Label>
                    <Textarea
                      id="shadingAssessmentOther"
                      value={formData.shadingAssessmentOther}
                      onChange={(e) => handleInputChange("shadingAssessmentOther", e.target.value)}
                      placeholder="Specify shading assessment"
                      rows={2}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Customer's Primary Motivation for Solar <span className="text-red-500">*</span></Label>
                <div className="space-y-2">
                  {["Reduce electricity bill", "Environmental concerns", "Energy independence", "Increase property value", "Government incentives/rebates", "Other"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`motivation-${option}`}
                        checked={formData.primaryMotivation?.includes(option) || false}
                        onCheckedChange={(checked) => handlePrimaryMotivationChange(option, checked as boolean)}
                      />
                      <Label htmlFor={`motivation-${option}`} className="font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.primaryMotivation?.includes("Other") && (
                  <div className="space-y-2">
                    <Label htmlFor="primaryMotivationOther">Please specify</Label>
                    <Input
                      id="primaryMotivationOther"
                      value={formData.primaryMotivationOther}
                      onChange={(e) => handleInputChange("primaryMotivationOther", e.target.value)}
                      placeholder="Specify motivation"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Any existing solar installations or previous quotes? <span className="text-red-500">*</span></Label>
                <RadioGroup value={formData.existingSolarInstallations} onValueChange={(value) => handleInputChange("existingSolarInstallations", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="existing-yes" />
                    <Label htmlFor="existing-yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="existing-no" />
                    <Label htmlFor="existing-no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Customer Interest Level in Solar <span className="text-red-500">*</span></Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Not interested</span>
                  <RadioGroup value={formData.interestLevel} onValueChange={(value) => handleInputChange("interestLevel", value)} className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <div key={num} className="flex flex-col items-center gap-1">
                        <RadioGroupItem value={num.toString()} id={`interest-${num}`} />
                        <Label htmlFor={`interest-${num}`} className="text-xs cursor-pointer">{num}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <span className="text-sm text-muted-foreground">Very interested</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image 5: Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nextSteps">Next Steps Discussed <span className="text-red-500">*</span></Label>
                <Textarea
                  id="nextSteps"
                  value={formData.nextSteps}
                  onChange={(e) => handleInputChange("nextSteps", e.target.value)}
                  placeholder="Long answer text"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">Upload photos of the property (roof, electrical panel, etc.)</Label>
                <FileUploader onFilesChange={handleFileUpload} />
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Uploaded: {formData.attachments.join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar: Sales Checklist and Electrician Scheduling */}
        <div className="lg:col-span-1 space-y-6">
          {/* Sales Site Visit Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Sales Site Visit Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.salesChecklist.map((item) => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`sales-checklist-${item.id}`}
                    checked={item.checked}
                    onCheckedChange={(checked) => handleSalesChecklistChange(item.id, checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor={`sales-checklist-${item.id}`} className="font-normal cursor-pointer text-sm leading-tight">
                    {item.item}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Electrician Site Visit Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Electrician Site Visit Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="electricianVisitDate">Visit Date</Label>
                  <Input
                    id="electricianVisitDate"
                    type="date"
                    value={formData.electricianVisitDate}
                    onChange={(e) => handleInputChange("electricianVisitDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electricianVisitTime">Visit Time</Label>
                  <Input
                    id="electricianVisitTime"
                    type="time"
                    value={formData.electricianVisitTime}
                    onChange={(e) => handleInputChange("electricianVisitTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electricianNotes">Notes for Electrician</Label>
                  <Textarea
                    id="electricianNotes"
                    value={formData.electricianNotes}
                    onChange={(e) => handleInputChange("electricianNotes", e.target.value)}
                    placeholder="Add any special instructions or notes for the electrician"
                    rows={3}
                  />
                </div>
              </div>
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