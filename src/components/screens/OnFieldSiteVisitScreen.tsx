import React, { useEffect, useState } from "react";
import { db, firebaseEnabled } from "../../lib/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FileUploader } from "../FileUploader";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Save, MapPin, Camera, CheckSquare, Calendar as CalendarIcon, Download, Phone, Shield, CheckCircle, AlertTriangle, Users, Wrench, HardHat, ClipboardList, Zap, Home, FileText } from "lucide-react";

// Initial form state - reusable for resetting
const initialFormState = {
    // Project Basic Information
    projectId: "",
    projectName: "",
    projectPriority: "",
    projectSystemSize: "",
    projectType: "",
    projectCost: "",
    
    // Client & Job Information
    priceAud: "",
    
    // System Information
    systemSizeKw: "",
    inverterSizeKw: "",
    inverterBrand: "",
    inverterType: "",
    panelBrand: "",
    panelModuleWatts: "",
    
    // Property Information
    houseStorey: "",
    roofType: "",
    accessSecondStorey: "",
    accessToInverter: "",
    meterPhase: "",
    
    // Customer Information (from Sales Call)
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    propertyAddress: "",
    propertyType: "",
    
    // Energy Information (from Sales Call)
    currentEnergyProvider: "",
    energyDistributor: "",
    averageMonthlyBill: "",
    roofOrientation: "",
    
    // Property Assessment (from Sales Call)
    numberOfStory: "",
  shadingAssessment: [] as string[],
  primaryMotivation: [] as string[],
    existingSolarInstallations: "",
    interestLevel: "",
    
    // Site Visit Notes (from Sales Call)
    salesNotes: "",
    
    // Site Information
    visitDate: "",
    visitTime: "",
    technicianName: "",
    weatherConditions: "",
    
    // Safety Assessment
  safetyHazards: [] as string[],
    safetyNotes: "",
  ppeRequired: [] as string[],
    emergencyContacts: "",
    
    // Electrical Assessment
    mainPanelLocation: "",
    panelCondition: "",
    availableAmperage: "",
    groundingSystem: "",
  electricalHazards: [] as string[],
    electricalNotes: "",
    
    // Roof Assessment
    roofCondition: "",
    roofAccess: "",
    structuralIntegrity: "",
  mountingPoints: [] as string[],
  roofHazards: [] as string[],
    roofNotes: "",
    
    // Installation Requirements
    panelCount: "",
    inverterLocation: "",
    conduitPath: "",
    mountingSystem: "",
    specialRequirements: "",
    
    // Site Photos
    photos: [],
    
    // Installation Checklist
    checklist: [
      { id: 1, item: "Site safety assessment completed", checked: false },
      { id: 2, item: "Electrical panel inspection done", checked: false },
      { id: 3, item: "Roof condition verified", checked: false },
      { id: 4, item: "Structural assessment completed", checked: false },
      { id: 5, item: "Access routes identified", checked: false },
      { id: 6, item: "Utility connections verified", checked: false },
      { id: 7, item: "Permit requirements checked", checked: false },
      { id: 8, item: "Customer expectations discussed", checked: false },
    ],
    
    // Notes
    generalNotes: "",
    recommendations: "",
    nextSteps: "",
};

export function OnFieldSiteVisitScreen() {
  const [formData, setFormData] = useState(initialFormState);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Check on mount if assessment already exists for current lead
  useEffect(() => {
    try {
      const ctxRaw = localStorage.getItem('xtr_onfield_context');
      const ctx = ctxRaw ? JSON.parse(ctxRaw) : {};
      const leadId = ctx?.leadId;
      if (leadId) {
        const assessments = JSON.parse(localStorage.getItem('xtr_onfield_assessments') || '[]');
        const existingAssessment = Array.isArray(assessments) && assessments.find((a: any) => a.leadId === leadId);
        if (existingAssessment) {
          // Assessment already exists, don't prefill and mark as submitted
          setHasSubmitted(true);
          setFormData(initialFormState);
        }
      }
    } catch {}
  }, []);

  // Prefill from Leads CRM when status moved to On-Field Inspection
  useEffect(() => {
    // Don't prefill if form was just submitted
    if (hasSubmitted) return;
    
    try {
      const raw = localStorage.getItem('xtr_onfield_prefill');
      if (!raw) return;
      const pre = JSON.parse(raw) || {};
      
      // Check if assessment already exists for this lead
      const ctxRaw = localStorage.getItem('xtr_onfield_context');
      const ctx = ctxRaw ? JSON.parse(ctxRaw) : {};
      const leadId = ctx?.leadId;
      if (leadId) {
        try {
          const assessments = JSON.parse(localStorage.getItem('xtr_onfield_assessments') || '[]');
          const existingAssessment = Array.isArray(assessments) && assessments.find((a: any) => a.leadId === leadId);
          if (existingAssessment) {
            // Assessment already exists, don't prefill
            return;
          }
        } catch {}
      }
      
      setFormData(prev => ({
        ...prev,
        // Project Basic Information
        projectId: pre.projectId || prev.projectId,
        projectName: pre.projectName || prev.projectName,
        projectPriority: pre.projectPriority || prev.projectPriority,
        projectSystemSize: pre.projectSystemSize || prev.projectSystemSize,
        projectType: pre.projectType || prev.projectType,
        projectCost: pre.projectCost || pre.priceAud || pre._projectData?.siteVisit?.projectCost || pre._projectData?.siteVisit?.priceAud || pre._projectData?.siteVisit?.price || prev.projectCost || prev.priceAud,
        
        // Client & Job Information - Map all price sources to priceAud, including site visit price
        priceAud: pre.priceAud || pre.projectCost || pre._projectData?.siteVisit?.priceAud || pre._projectData?.siteVisit?.projectCost || pre._projectData?.siteVisit?.price || prev.priceAud || prev.projectCost,
        
        // System Information - Include projectSystemSize as fallback
        systemSizeKw: pre.systemSizeKw || pre.projectSystemSize || prev.systemSizeKw || prev.projectSystemSize,
        inverterSizeKw: pre.inverterSizeKw || prev.inverterSizeKw,
        inverterBrand: pre.inverterBrand || prev.inverterBrand,
        inverterType: pre.inverterType || prev.inverterType,
        panelBrand: pre.panelBrand || prev.panelBrand,
        panelModuleWatts: pre.panelModuleWatts || prev.panelModuleWatts,
        
        // Property Information
        houseStorey: pre.houseStorey || prev.houseStorey,
        accessSecondStorey: pre.accessSecondStorey || prev.accessSecondStorey,
        accessToInverter: pre.accessToInverter || prev.accessToInverter,
        
        // Customer Information - Ensure all sources are checked
        customerName: pre.customerName || prev.customerName,
        customerEmail: pre.customerEmail || pre._projectData?.projectSnapshot?.customerEmail || pre._projectData?.siteVisit?.customerEmail || prev.customerEmail,
        customerPhone: pre.customerPhone || pre._projectData?.projectSnapshot?.customerPhone || pre._projectData?.siteVisit?.customerPhone || prev.customerPhone,
        propertyAddress: pre.propertyAddress || prev.propertyAddress,
        propertyType: pre.propertyType || prev.propertyType,
        currentEnergyProvider: pre.currentEnergyProvider || prev.currentEnergyProvider,
        energyDistributor: pre.energyDistributor || prev.energyDistributor,
        averageMonthlyBill: pre.averageMonthlyBill || prev.averageMonthlyBill,
        roofOrientation: pre.roofOrientation || prev.roofOrientation,
        roofType: pre.roofType || prev.roofType,
        meterPhase: pre.meterPhase || prev.meterPhase,
        numberOfStory: pre.numberOfStory || pre.houseStorey || prev.numberOfStory || prev.houseStorey,
        shadingAssessment: Array.isArray(pre.shadingAssessment) ? pre.shadingAssessment : prev.shadingAssessment,
        primaryMotivation: Array.isArray(pre.primaryMotivation) ? pre.primaryMotivation : prev.primaryMotivation,
        existingSolarInstallations: pre.existingSolarInstallations || prev.existingSolarInstallations,
        interestLevel: pre.interestLevel || prev.interestLevel,
        salesNotes: pre.salesNotes || prev.salesNotes,
      }));
      // leave the prefill in storage so techs can refresh without losing
    } catch {}
  }, [hasSubmitted]);

  // Always derive from leads_state using context lead id to ensure fresh data
  useEffect(() => {
    // Don't prefill if form was just submitted
    if (hasSubmitted) return;
    
    try {
      const ctxRaw = localStorage.getItem('xtr_onfield_context');
      const ctx = ctxRaw ? JSON.parse(ctxRaw) : null;
      const leadId = ctx?.leadId;
      if (!leadId) return;
      
      // Check if assessment already exists for this lead
      try {
        const assessments = JSON.parse(localStorage.getItem('xtr_onfield_assessments') || '[]');
        const existingAssessment = Array.isArray(assessments) && assessments.find((a: any) => a.leadId === leadId);
        if (existingAssessment) {
          // Assessment already exists, don't prefill
          return;
        }
      } catch {}
      
      const boardRaw = localStorage.getItem('xtr_leads_state_columns');
      const board = boardRaw ? JSON.parse(boardRaw) : null;
      const columns = Array.isArray(board?.columns) ? board.columns : Array.isArray(board) ? board : [];
      let found: any = null;
      columns.forEach((col: any) => {
        (col?.leads || []).forEach((l: any) => { if (String(l.id) === String(leadId)) found = l; });
      });
      if (!found) return;
      const snap = found.projectSnapshot || {};
      let sv = found.siteVisit || {};
      // If siteVisit not attached on the lead, try to resolve from submitted visits store
      if (!sv || Object.keys(sv).length === 0) {
        try {
          const rawSV = localStorage.getItem('xtr_site_visits');
          const arr = rawSV ? JSON.parse(rawSV) : [];
          const name = snap.customerName || found.title;
          const addr = snap.customerAddress || found.company;
          if (Array.isArray(arr)) {
            const matches = arr.filter((v: any) => (
              (!name || v.customerName === name) && (!addr || v.propertyAddress === addr)
            ));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              sv = matches[0];
            }
          }
        } catch {}
      }
      const salesNotesParts: string[] = [];
      if (sv.siteNotes) salesNotesParts.push(`• ${sv.siteNotes}`);
      if (sv.specialRequirements) salesNotesParts.push(`• ${sv.specialRequirements}`);
      if (sv.nextSteps) salesNotesParts.push(`• ${sv.nextSteps}`);
      // Extract project data if it exists
      const projectData = found.projectData || {};
      const projectDetails = projectData.projectDetails || snap.projectDetails || {};
      const additionalInfo = projectDetails.additionalInfo || snap.additionalInfo || {};
      const systemInfo = projectDetails.systemInfo || snap.systemInfo || {};
      const propertyInfo = projectDetails.propertyInfo || snap.propertyInfo || {};
      const utilityInfo = projectDetails.utilityInfo || snap.utilityInfo || {};
      
      setFormData(prev => ({
        ...prev,
        // Project Basic Information
        projectId: projectData.id || found.id || prev.projectId,
        projectName: projectData.name || snap.projectName || found.title || prev.projectName,
        projectPriority: projectData.priority || snap.priority || prev.projectPriority,
        projectSystemSize: projectData.systemSize || systemInfo.systemSize || snap.systemSize || snap.systemInfo?.systemSize || prev.projectSystemSize,
        projectType: projectData.type || snap.type || prev.projectType,
        projectCost: sv.priceAud || sv.price || sv.projectCost || projectData.cost || additionalInfo.priceAud || snap.price || prev.projectCost || prev.priceAud,
        
        // Client & Job Information - Map all price sources to priceAud, including site visit price
        priceAud: sv.priceAud || sv.price || sv.projectCost || additionalInfo.priceAud || projectData.cost || snap.price || prev.priceAud || prev.projectCost,
        
        // System Information - Check all possible sources including snap.systemInfo
        systemSizeKw: systemInfo.systemSize || projectData.systemSize || snap.systemSize || snap.systemInfo?.systemSize || prev.systemSizeKw || prev.projectSystemSize,
        inverterSizeKw: systemInfo.inverterSize || snap.systemInfo?.inverterSize || snap.inverterSize || prev.inverterSizeKw,
        inverterBrand: systemInfo.inverterBrand || snap.systemInfo?.inverterBrand || snap.inverterBrand || prev.inverterBrand,
        inverterType: systemInfo.inverterType || snap.systemInfo?.inverterType || snap.inverterType || prev.inverterType,
        panelBrand: systemInfo.panelBrand || snap.systemInfo?.panelBrand || snap.panelBrand || prev.panelBrand,
        panelModuleWatts: systemInfo.panelModuleWatts || snap.systemInfo?.panelModuleWatts || snap.panelModuleWatts || prev.panelModuleWatts,
        
        // Property Information
        houseStorey: propertyInfo.houseStorey || snap.propertyInfo?.houseStorey || prev.houseStorey,
        accessSecondStorey: propertyInfo.accessSecondStorey || snap.accessSecondStorey || prev.accessSecondStorey,
        accessToInverter: propertyInfo.accessToInverter || snap.accessToInverter || prev.accessToInverter,
        
        // Customer Information - Check all sources including site visit
        customerName: snap.customerName || sv.customerName || found.title || prev.customerName,
        customerEmail: snap.customerEmail || sv.customerEmail || (found.tags && found.tags[0]) || prev.customerEmail,
        customerPhone: snap.customerPhone || sv.customerPhone || found.value || prev.customerPhone,
        propertyAddress: snap.customerAddress || sv.propertyAddress || found.company || prev.propertyAddress,
        propertyType: snap.clientType || prev.propertyType,
        currentEnergyProvider: utilityInfo.energyRetailer || snap.utilityInfo?.energyRetailer || sv.currentEnergyProvider || prev.currentEnergyProvider,
        energyDistributor: utilityInfo.distributor || snap.utilityInfo?.distributor || sv.energyDistributor || prev.energyDistributor,
        averageMonthlyBill: sv.averageMonthlyBill || prev.averageMonthlyBill,
        roofOrientation: sv.roofOrientation || prev.roofOrientation,
        roofType: propertyInfo.roofType || snap.propertyInfo?.roofType || sv.roofType || prev.roofType,
        meterPhase: propertyInfo.meterPhase || snap.propertyInfo?.meterPhase || sv.meterPhase || prev.meterPhase,
        numberOfStory: propertyInfo.houseStorey || snap.propertyInfo?.houseStorey || sv.numberOfStory || prev.numberOfStory,
        shadingAssessment: (snap.siteVisitInfo?.shadingAssessment) || (Array.isArray(sv.shadingAssessment) ? sv.shadingAssessment : prev.shadingAssessment),
        primaryMotivation: (snap.siteVisitInfo?.primaryMotivation) || (Array.isArray(sv.primaryMotivation) ? sv.primaryMotivation : prev.primaryMotivation),
        existingSolarInstallations: snap.siteVisitInfo?.existingSolarInstallations || sv.existingSolarInstallations || prev.existingSolarInstallations,
        interestLevel: snap.siteVisitInfo?.interestLevel || sv.interestLevel || prev.interestLevel,
        salesNotes: salesNotesParts.join('\n') || prev.salesNotes,
      }));
    } catch {}
  }, [hasSubmitted]);

  const handleInputChange = (field: string, value: any) => {
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

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const [drafts, setDrafts] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewRecord, setViewRecord] = useState<any | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState<any | null>(null);
  const [technicians, setTechnicians] = useState<string[]>([]);

  const normalizeForView = (rec: any) => {
    const toDisplay = (val: any): any => {
      if (val === null || val === undefined) return '';
      const t = typeof val;
      if (t === 'string' || t === 'number' || t === 'boolean') return String(val);
      if (Array.isArray(val)) return val.map((v) => toDisplay(v));
      if (t === 'object') {
        if ('name' in (val as any) && typeof (val as any).name === 'string') return (val as any).name;
        try { return JSON.stringify(val); } catch { return String(val); }
      }
      return String(val);
    };
    const out: any = {};
    Object.keys(rec || {}).forEach((k) => { out[k] = toDisplay(rec[k]); });
    return out;
  };

  useEffect(() => {
    try {
      const d = localStorage.getItem('xtr_onfield_drafts');
      setDrafts(d ? JSON.parse(d) : []);
    } catch { setDrafts([]); }
    try {
      const s = localStorage.getItem('xtr_onfield_assessments');
      setAssessments(s ? JSON.parse(s) : []);
    } catch { setAssessments([]); }
    // Load resources for technician names
    try {
      const rawRes = localStorage.getItem('xtr_resources');
      const resources = rawRes ? JSON.parse(rawRes) : [];
      if (Array.isArray(resources)) {
        const names = resources
          .filter((r: any) => (r?.status || 'active') === 'active')
          .map((r: any) => (typeof r?.name === 'string' ? r.name : undefined))
          .filter((n: any) => typeof n === 'string' && n.trim().length > 0) as string[];
        setTechnicians(names);
      }
    } catch { setTechnicians([]); }
  }, []);

  // Cross-device: subscribe to assessments from Firestore and merge with local
  useEffect(() => {
    const loadLocal = () => {
      try {
        const s = localStorage.getItem('xtr_onfield_assessments');
        setAssessments(s ? JSON.parse(s) : []);
      } catch { setAssessments([]); }
    };
    loadLocal();
    const onStorage = (e: StorageEvent) => { if (e.key === 'xtr_onfield_assessments') loadLocal(); };
    window.addEventListener('storage', onStorage);
    let unsub: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsub = onSnapshot(collection(db, 'onfield_site_visits'), (snap) => {
          const arr = snap.docs.map((d) => d.data());
          if (Array.isArray(arr)) setAssessments(arr as any);
        });
      } catch {}
    }
    return () => { window.removeEventListener('storage', onStorage); if (typeof unsub === 'function') unsub(); };
  }, []);

  const saveDraft = () => {
    const ctxRaw = localStorage.getItem('xtr_onfield_context');
    const ctx = ctxRaw ? JSON.parse(ctxRaw) : {};
    const draft = { id: `OFD-${Date.now()}`, leadId: ctx.leadId, updatedAt: new Date().toISOString(), ...formData };
    try {
      const prev = JSON.parse(localStorage.getItem('xtr_onfield_drafts') || '[]');
      let next = Array.isArray(prev) ? prev : [];
      if (isEditingDraft) {
        next = next.map((d: any) => d.id === isEditingDraft.id ? draft : d);
        setIsEditingDraft(null);
      } else {
        next = [draft, ...next];
      }
      localStorage.setItem('xtr_onfield_drafts', JSON.stringify(next));
      setDrafts(next);
      alert('Draft saved');
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ctxRaw = localStorage.getItem('xtr_onfield_context');
    const ctx = ctxRaw ? JSON.parse(ctxRaw) : {};
    const record = { id: `OF-${Date.now()}`, leadId: ctx.leadId, createdAt: new Date().toISOString(), ...formData };
    try {
      const prev = JSON.parse(localStorage.getItem('xtr_onfield_assessments') || '[]');
      const next = Array.isArray(prev) ? [record, ...prev] : [record];
      localStorage.setItem('xtr_onfield_assessments', JSON.stringify(next));
      setAssessments(next);
    } catch {}
    // Also persist to Firestore for PM visibility across devices
    try {
      if (firebaseEnabled && db) {
        addDoc(collection(db, 'onfield_site_visits'), record).catch(() => {});
      }
    } catch {}
    // Remove drafts for this lead (covers both edited-draft and submit-from-return flows)
    try {
      const prevDrafts = JSON.parse(localStorage.getItem('xtr_onfield_drafts') || '[]');
      const filtered = Array.isArray(prevDrafts) ? prevDrafts.filter((d: any) => d.leadId !== ctx.leadId) : [];
      localStorage.setItem('xtr_onfield_drafts', JSON.stringify(filtered));
      setDrafts(filtered);
      setIsEditingDraft(null);
    } catch {}
    try { localStorage.setItem('xtr_pending_onfield', JSON.stringify({ leadId: ctx.leadId, assessment: record })); } catch {}
    try { window.dispatchEvent(new CustomEvent('xtr-leads-attach-onfield', { detail: { leadId: ctx.leadId, assessment: record } })); } catch {}
    
    // Clear the form after successful submission
    setFormData({
      ...initialFormState,
      // Reset checklist to initial state
      checklist: [
        { id: 1, item: "Site safety assessment completed", checked: false },
        { id: 2, item: "Electrical panel inspection done", checked: false },
        { id: 3, item: "Roof condition verified", checked: false },
        { id: 4, item: "Structural assessment completed", checked: false },
        { id: 5, item: "Access routes identified", checked: false },
        { id: 6, item: "Utility connections verified", checked: false },
        { id: 7, item: "Permit requirements checked", checked: false },
        { id: 8, item: "Customer expectations discussed", checked: false },
      ],
    });
    
    // Clear prefill data and context after submission
    try {
      localStorage.removeItem('xtr_onfield_prefill');
      localStorage.removeItem('xtr_onfield_context');
    } catch {}
    
    // Set flag to prevent repopulation
    setHasSubmitted(true);
    
    alert("On-Field Site Assessment submitted successfully!");
  };

  const handleExportForm = () => {
    // Create CSV content
    const csvContent = [
      ["Field", "Value"],
      // Customer Information (from Sales Call)
      ["Customer Name", formData.customerName],
      ["Customer Email", formData.customerEmail],
      ["Customer Phone", formData.customerPhone],
      ["Property Address", formData.propertyAddress],
      ["Property Type", formData.propertyType],
      
      // Energy Information (from Sales Call)
      ["Energy Retailer", formData.currentEnergyProvider],
      ["Energy Distributor", formData.energyDistributor],
      ["Average Monthly Bill", formData.averageMonthlyBill],
      ["Roof Orientation", formData.roofOrientation],
      
      // Property Assessment (from Sales Call)
      ["Roof Type", formData.roofType],
      ["Meter Phase", formData.meterPhase],
      ["Number of Storey", formData.numberOfStory],
      ["Shading Assessment", formData.shadingAssessment.join(", ")],
      ["Primary Motivation", formData.primaryMotivation.join(", ")],
      ["Existing Solar Installations", formData.existingSolarInstallations],
      ["Interest Level", formData.interestLevel],
      
      // Site Visit Notes (from Sales Call)
      ["Sales Notes", formData.salesNotes],
      
      // Site Information
      ["Visit Date", formData.visitDate],
      ["Visit Time", formData.visitTime],
      ["Technician Name", formData.technicianName],
      ["Weather Conditions", formData.weatherConditions],
      
      // Safety Assessment
      ["Safety Hazards", formData.safetyHazards.join(", ")],
      ["Safety Notes", formData.safetyNotes],
      ["PPE Required", formData.ppeRequired.join(", ")],
      ["Emergency Contacts", formData.emergencyContacts],
      
      // Electrical Assessment
      ["Main Panel Location", formData.mainPanelLocation],
      ["Panel Condition", formData.panelCondition],
      ["Available Amperage", formData.availableAmperage],
      ["Grounding System", formData.groundingSystem],
      ["Electrical Hazards", formData.electricalHazards.join(", ")],
      ["Electrical Notes", formData.electricalNotes],
      
      // Roof Assessment
      ["Roof Type", formData.roofType],
      ["Roof Condition", formData.roofCondition],
      ["Roof Access", formData.roofAccess],
      ["Structural Integrity", formData.structuralIntegrity],
      ["Mounting Points", formData.mountingPoints.join(", ")],
      ["Roof Hazards", formData.roofHazards.join(", ")],
      ["Roof Notes", formData.roofNotes],
      
      // Installation Requirements
      ["Panel Count", formData.panelCount],
      ["Inverter Location", formData.inverterLocation],
      ["Conduit Path", formData.conduitPath],
      ["Special Requirements", formData.specialRequirements],
      ["Photos", Array.isArray(formData.photos) ? formData.photos.join(", ") : ""],
      
      // Checklist
      ...formData.checklist.map(item => [item.item, item.checked ? "Yes" : "No"]),
      
      // Notes
      ["General Notes", formData.generalNotes],
      ["Recommendations", formData.recommendations],
      ["Next Steps", formData.nextSteps],
    ];

    // Convert to CSV
    const csvString = csvContent.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    
    // Download CSV
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `on-field-site-visit-${formData.visitDate || 'report'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">On-Field Site Assessment</h1>
              <p className="text-gray-600 mt-2">Technical site evaluation and installation planning with sales data integration</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportForm}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" onClick={saveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="w-4 h-4 mr-2" />
                Submit Assessment
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Customer name"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Customer Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                        placeholder="Customer email"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Customer Contact</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                        placeholder="Customer contact"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="propertyAddress">Customer Address</Label>
                      <Input
                        id="propertyAddress"
                        value={formData.propertyAddress}
                        onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                        placeholder="Customer address"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (Google Maps)</Label>
                      <Input
                        id="location"
                        value=""
                        placeholder="Location"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceAud">Price (AUD)</Label>
                      <Input
                        id="priceAud"
                        value={formData.priceAud}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemSizeKw">System Size (kW)</Label>
                      <Input
                        id="systemSizeKw"
                        value={formData.systemSizeKw || formData.projectSystemSize}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inverterSizeKw">Inverter Size (kW)</Label>
                      <Input
                        id="inverterSizeKw"
                        value={formData.inverterSizeKw}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inverterBrand">Inverter Brand</Label>
                      <Input
                        id="inverterBrand"
                        value={formData.inverterBrand}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inverterType">Inverter Type</Label>
                      <Input
                        id="inverterType"
                        value={formData.inverterType}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panelBrand">Panel Brand</Label>
                      <Input
                        id="panelBrand"
                        value={formData.panelBrand}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panelModuleWatts">Panel Module (Watts)</Label>
                      <Input
                        id="panelModuleWatts"
                        value={formData.panelModuleWatts}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="houseStorey">House Storey</Label>
                      <Input
                        id="houseStorey"
                        value={formData.houseStorey || formData.numberOfStory}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roofType">Roof Type</Label>
                      <Input
                        id="roofType"
                        value={formData.roofType}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accessSecondStorey">Access to 2nd Storey</Label>
                      <Input
                        id="accessSecondStorey"
                        value={formData.accessSecondStorey}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accessToInverter">Access to Inverter</Label>
                      <Input
                        id="accessToInverter"
                        value={formData.accessToInverter}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meterPhase">Meter Phase</Label>
                      <Input
                        id="meterPhase"
                        value={formData.meterPhase}
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>On-Field Assessment</DialogTitle>
          </DialogHeader>
          {viewRecord && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Visit Date</Label>
                  <p>{viewRecord.visitDate || '-'}</p>
                </div>
                <div>
                  <Label>Visit Time</Label>
                  <p>{viewRecord.visitTime || '-'}</p>
                </div>
                <div>
                  <Label>Technician</Label>
                  <p>{viewRecord.technicianName || '-'}</p>
                </div>
                <div>
                  <Label>Weather</Label>
                  <p>{viewRecord.weatherConditions || '-'}</p>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Electrical Assessment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Main Panel Location</Label><p>{viewRecord.mainPanelLocation || '-'}</p></div>
                  <div><Label>Panel Condition</Label><p>{viewRecord.panelCondition || '-'}</p></div>
                  <div><Label>Available Amperage</Label><p>{viewRecord.availableAmperage || '-'}</p></div>
                  <div><Label>Grounding System</Label><p>{viewRecord.groundingSystem || '-'}</p></div>
                </div>
                <div className="mt-2"><Label>Electrical Hazards</Label><p>{Array.isArray(viewRecord.electricalHazards) && viewRecord.electricalHazards.length ? viewRecord.electricalHazards.join(', ') : '-'}</p></div>
                <div className="mt-2"><Label>Electrical Notes</Label><p>{viewRecord.electricalNotes || '-'}</p></div>
              </div>
              <div>
                <p className="font-medium mb-2">Roof Assessment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Roof Type</Label><p>{viewRecord.roofType || '-'}</p></div>
                  <div><Label>Roof Condition</Label><p>{viewRecord.roofCondition || '-'}</p></div>
                  <div><Label>Roof Access</Label><p>{viewRecord.roofAccess || '-'}</p></div>
                  <div><Label>Structural Integrity</Label><p>{viewRecord.structuralIntegrity || '-'}</p></div>
                </div>
                <div className="mt-2"><Label>Mounting Points</Label><p>{Array.isArray(viewRecord.mountingPoints) && viewRecord.mountingPoints.length ? viewRecord.mountingPoints.join(', ') : '-'}</p></div>
                <div className="mt-2"><Label>Roof Hazards</Label><p>{Array.isArray(viewRecord.roofHazards) && viewRecord.roofHazards.length ? viewRecord.roofHazards.join(', ') : '-'}</p></div>
                <div className="mt-2"><Label>Roof Notes</Label><p>{viewRecord.roofNotes || '-'}</p></div>
              </div>
              <div>
                <p className="font-medium mb-2">Installation Requirements</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Panel Count</Label><p>{viewRecord.panelCount || '-'}</p></div>
                  <div><Label>Inverter Location</Label><p>{viewRecord.inverterLocation || '-'}</p></div>
                  <div><Label>Conduit Path</Label><p>{viewRecord.conduitPath || '-'}</p></div>
                </div>
                <div className="mt-2"><Label>Special Requirements</Label><p>{viewRecord.specialRequirements || '-'}</p></div>
              </div>
              <div>
                <p className="font-medium mb-2">Photos</p>
                {Array.isArray(viewRecord.photos) && viewRecord.photos.length ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {viewRecord.photos.map((n: string, i: number) => <li key={i}>{n}</li>)}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No photos uploaded.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
              {/* Energy Information (from Sales Call) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Energy Information (from Sales Call)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentEnergyProvider">Energy Retailer</Label>
                      <Input
                        id="currentEnergyProvider"
                        value={formData.currentEnergyProvider}
                        onChange={(e) => handleInputChange("currentEnergyProvider", e.target.value)}
                        placeholder="Energy provider from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="energyDistributor">Energy Distributor</Label>
                      <Input
                        id="energyDistributor"
                        value={formData.energyDistributor}
                        onChange={(e) => handleInputChange("energyDistributor", e.target.value)}
                        placeholder="Energy distributor from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="averageMonthlyBill">Average Monthly Bill</Label>
                      <Input
                        id="averageMonthlyBill"
                        value={formData.averageMonthlyBill}
                        onChange={(e) => handleInputChange("averageMonthlyBill", e.target.value)}
                        placeholder="Monthly bill from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roofOrientation">Roof Orientation</Label>
                      <Input
                        id="roofOrientation"
                        value={formData.roofOrientation}
                        onChange={(e) => handleInputChange("roofOrientation", e.target.value)}
                        placeholder="Roof orientation from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Assessment (from Sales Call) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Property Assessment (from Sales Call)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roofType">Roof Type</Label>
                      <Input
                        id="roofType"
                        value={formData.roofType}
                        onChange={(e) => handleInputChange("roofType", e.target.value)}
                        placeholder="Roof type from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meterPhase">Meter Phase</Label>
                      <Input
                        id="meterPhase"
                        value={formData.meterPhase}
                        onChange={(e) => handleInputChange("meterPhase", e.target.value)}
                        placeholder="Meter phase from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfStory">Number of Storey</Label>
                      <Input
                        id="numberOfStory"
                        value={formData.numberOfStory}
                        onChange={(e) => handleInputChange("numberOfStory", e.target.value)}
                        placeholder="Number of story from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="existingSolarInstallations">Existing Solar Installations</Label>
                      <Input
                        id="existingSolarInstallations"
                        value={formData.existingSolarInstallations}
                        onChange={(e) => handleInputChange("existingSolarInstallations", e.target.value)}
                        placeholder="Existing solar from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Shading Assessment (from Sales Call)</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        {formData.shadingAssessment.length > 0 
                          ? formData.shadingAssessment.join(", ")
                          : "No shading assessment data from sales call"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Motivation (from Sales Call)</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        {formData.primaryMotivation.length > 0 
                          ? formData.primaryMotivation.join(", ")
                          : "No motivation data from sales call"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestLevel">Interest Level (from Sales Call)</Label>
                    <Input
                      id="interestLevel"
                      value={formData.interestLevel}
                      onChange={(e) => handleInputChange("interestLevel", e.target.value)}
                      placeholder="Interest level from sales call"
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Site Visit Notes (from Sales Call) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Sales Call Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="salesNotes">Notes from Sales Call</Label>
                    <Textarea
                      id="salesNotes"
                      value={formData.salesNotes}
                      onChange={(e) => handleInputChange("salesNotes", e.target.value)}
                      placeholder="Notes from the sales team's site visit"
                      className="min-h-[100px] bg-gray-50"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Site Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Site Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitDate">Visit Date</Label>
                      <Input
                        id="visitDate"
                        type="date"
                        value={formData.visitDate}
                        onChange={(e) => handleInputChange("visitDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visitTime">Visit Time</Label>
                      <Input
                        id="visitTime"
                        type="time"
                        value={formData.visitTime}
                        onChange={(e) => handleInputChange("visitTime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="technicianName">Technician Name</Label>
                      {technicians.length === 0 ? (
                        <Input id="technicianName" value={formData.technicianName || ""} readOnly placeholder="No resources found" />
                      ) : (
                        <Select value={formData.technicianName || undefined} onValueChange={(value) => handleInputChange("technicianName", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select technician" />
                          </SelectTrigger>
                          <SelectContent>
                            {technicians.map((name) => (
                              <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weatherConditions">Weather Conditions</Label>
                    <Select value={formData.weatherConditions} onValueChange={(value) => handleInputChange("weatherConditions", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weather conditions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="partly-cloudy">Partly Cloudy</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                        <SelectItem value="windy">Windy</SelectItem>
                        <SelectItem value="stormy">Stormy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Safety Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Safety Hazards Identified</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Electrical hazards",
                        "Fall hazards",
                        "Confined spaces",
                        "Overhead power lines",
                        "Unstable surfaces",
                        "Weather conditions",
                        "Wildlife",
                        "Other"
                      ].map((hazard) => (
                        <div key={hazard} className="flex items-center space-x-2">
                          <Checkbox
                            id={`safety-${hazard}`}
                            checked={formData.safetyHazards.includes(hazard)}
                            onCheckedChange={(checked: boolean) =>
                              handleArrayChange("safetyHazards", hazard, checked)
                            }
                          />
                          <Label htmlFor={`safety-${hazard}`} className="text-sm">{hazard}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="safetyNotes">Safety Notes</Label>
                    <Textarea
                      id="safetyNotes"
                      value={formData.safetyNotes}
                      onChange={(e) => handleInputChange("safetyNotes", e.target.value)}
                      placeholder="Document any safety concerns or observations"
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>PPE Required</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Hard hat",
                        "Safety glasses",
                        "High-vis vest",
                        "Safety boots",
                        "Gloves",
                        "Fall protection",
                        "Respirator",
                        "Other"
                      ].map((ppe) => (
                        <div key={ppe} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ppe-${ppe}`}
                            checked={formData.ppeRequired.includes(ppe)}
                            onCheckedChange={(checked) => handleArrayChange("ppeRequired", ppe, checked as boolean)}
                          />
                          <Label htmlFor={`ppe-${ppe}`} className="text-sm">{ppe}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContacts">Emergency Contacts</Label>
                    <Textarea
                      id="emergencyContacts"
                      value={formData.emergencyContacts}
                      onChange={(e) => handleInputChange("emergencyContacts", e.target.value)}
                      placeholder="List emergency contact numbers and procedures"
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Electrical Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Electrical Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mainPanelLocation">Main Panel Location</Label>
                      <Input
                        id="mainPanelLocation"
                        value={formData.mainPanelLocation}
                        onChange={(e) => handleInputChange("mainPanelLocation", e.target.value)}
                        placeholder="e.g., Garage, basement, exterior"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panelCondition">Panel Condition</Label>
                      <Select value={formData.panelCondition} onValueChange={(value) => handleInputChange("panelCondition", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select panel condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                          <SelectItem value="needs-replacement">Needs Replacement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availableAmperage">Available Amperage</Label>
                      <Input
                        id="availableAmperage"
                        value={formData.availableAmperage}
                        onChange={(e) => handleInputChange("availableAmperage", e.target.value)}
                        placeholder="e.g., 200A, 150A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groundingSystem">Grounding System</Label>
                      <Select value={formData.groundingSystem} onValueChange={(value) => handleInputChange("groundingSystem", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grounding system" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adequate">Adequate</SelectItem>
                          <SelectItem value="needs-upgrade">Needs Upgrade</SelectItem>
                          <SelectItem value="inadequate">Inadequate</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Electrical Hazards</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Exposed wiring",
                        "Overloaded circuits",
                        "Faulty breakers",
                        "Poor grounding",
                        "Water damage",
                        "Corrosion",
                        "Code violations",
                        "Other"
                      ].map((hazard) => (
                        <div key={hazard} className="flex items-center space-x-2">
                          <Checkbox
                            id={`electrical-${hazard}`}
                            checked={formData.electricalHazards.includes(hazard)}
                            onCheckedChange={(checked) => handleArrayChange("electricalHazards", hazard, checked as boolean)}
                          />
                          <Label htmlFor={`electrical-${hazard}`} className="text-sm">{hazard}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="electricalNotes">Electrical Notes</Label>
                    <Textarea
                      id="electricalNotes"
                      value={formData.electricalNotes}
                      onChange={(e) => handleInputChange("electricalNotes", e.target.value)}
                      placeholder="Document electrical observations and requirements"
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Roof Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Roof Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roofType">Roof Type</Label>
                      <Input
                        id="roofType"
                        value={formData.roofType}
                        onChange={(e) => handleInputChange("roofType", e.target.value)}
                        placeholder="Roof type from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roofCondition">Roof Condition</Label>
                      <Select value={formData.roofCondition} onValueChange={(value) => handleInputChange("roofCondition", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select roof condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                          <SelectItem value="needs-repair">Needs Repair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roofAccess">Roof Access</Label>
                      <Select value={formData.roofAccess} onValueChange={(value) => handleInputChange("roofAccess", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select roof access" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="difficult">Difficult</SelectItem>
                          <SelectItem value="restricted">Restricted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="structuralIntegrity">Structural Integrity</Label>
                      <Select value={formData.structuralIntegrity} onValueChange={(value) => handleInputChange("structuralIntegrity", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select structural integrity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                          <SelectItem value="needs-assessment">Needs Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Mounting Points</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Rafters accessible",
                        "Sufficient rafter spacing",
                        "Adequate load capacity",
                        "Penetration points clear",
                        "Ventilation clear",
                        "Drainage clear",
                        "Other considerations",
                        "None identified"
                      ].map((point) => (
                        <div key={point} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mounting-${point}`}
                            checked={formData.mountingPoints.includes(point)}
                            onCheckedChange={(checked) => handleArrayChange("mountingPoints", point, checked as boolean)}
                          />
                          <Label htmlFor={`mounting-${point}`} className="text-sm">{point}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Roof Hazards</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Weak structure",
                        "Damaged tiles/shingles",
                        "Moss/algae growth",
                        "Slippery surface",
                        "Narrow walkways",
                        "Steep pitch",
                        "Weather damage",
                        "Other"
                      ].map((hazard) => (
                        <div key={hazard} className="flex items-center space-x-2">
                          <Checkbox
                            id={`roof-hazard-${hazard}`}
                            checked={formData.roofHazards.includes(hazard)}
                            onCheckedChange={(checked) => handleArrayChange("roofHazards", hazard, checked as boolean)}
                          />
                          <Label htmlFor={`roof-hazard-${hazard}`} className="text-sm">{hazard}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roofNotes">Roof Notes</Label>
                    <Textarea
                      id="roofNotes"
                      value={formData.roofNotes}
                      onChange={(e) => handleInputChange("roofNotes", e.target.value)}
                      placeholder="Document roof observations and installation requirements"
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Installation Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Installation Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panelCount">Panel Count</Label>
                      <Input
                        id="panelCount"
                        type="number"
                        value={formData.panelCount}
                        onChange={(e) => handleInputChange("panelCount", e.target.value)}
                        placeholder="Number of panels"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inverterLocation">Inverter Location</Label>
                      <Input
                        id="inverterLocation"
                        value={formData.inverterLocation}
                        onChange={(e) => handleInputChange("inverterLocation", e.target.value)}
                        placeholder="e.g., Garage, basement, exterior"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conduitPath">Conduit Path</Label>
                      <Input
                        id="conduitPath"
                        value={formData.conduitPath}
                        onChange={(e) => handleInputChange("conduitPath", e.target.value)}
                        placeholder="Describe conduit routing"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                      placeholder="Any special installation requirements or considerations"
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Site Photos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Site Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    onFilesChange={(files) => handleInputChange("photos", files.map(f => f.name))}
                    accept="image/*"
                    maxFiles={10}
                  />
                </CardContent>
              </Card>


            </form>

            {/* Drafts Table */}
            <Card>
              <CardHeader>
                <CardTitle>Saved Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                {drafts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No drafts yet.</p>
                ) : (
                  <div className="space-y-2">
                    {drafts.map((d) => (
                      <div key={d.id} className="flex items-center justify-between border rounded p-3">
                        <div className="text-sm">
                          <div className="font-medium">{d.customerName || '-'}</div>
                          <div className="text-muted-foreground">Updated {new Date(d.updatedAt).toLocaleString()}</div>
                </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setViewRecord(normalizeForView(d)); setShowViewDialog(true); }}>View</Button>
                          <Button variant="outline" size="sm" onClick={() => { setFormData(d); setIsEditingDraft(d); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</Button>
                </div>
                </div>
                    ))}
                </div>
                )}
              </CardContent>
            </Card>

            {/* Submitted Assessments Table */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Submitted On-Field Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                {assessments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No submissions yet.</p>
                ) : (
                  <div className="space-y-2 max-h-[480px] overflow-y-auto">
                    {assessments.map((a) => (
                      <div key={a.id} className="flex items-center justify-between border rounded p-3">
                        <div className="text-sm">
                          <div className="font-medium">{a.customerName || '-'}</div>
                          <div className="text-muted-foreground">Created {new Date(a.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setViewRecord(normalizeForView(a)); setShowViewDialog(true); }}>View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            

            {/* Safety Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield className="w-5 h-5" />
                  Safety Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Always wear appropriate PPE</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Check weather conditions before starting</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Verify electrical safety before working</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Document all hazards and concerns</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Follow company safety protocols</span>
                </div>
              </CardContent>
            </Card>

            {/* Installation Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Installation Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.checklist.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`checklist-${item.id}`}
                        checked={item.checked}
                        onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                      />
                      <Label htmlFor={`checklist-${item.id}`} className="text-sm font-medium">
                        {item.item}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes & Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notes & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="generalNotes">General Notes</Label>
                  <Textarea
                    id="generalNotes"
                    value={formData.generalNotes}
                    onChange={(e) => handleInputChange("generalNotes", e.target.value)}
                    placeholder="General observations and notes about the site"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea
                    id="recommendations"
                    value={formData.recommendations}
                    onChange={(e) => handleInputChange("recommendations", e.target.value)}
                    placeholder="Recommendations for the installation"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextSteps">Next Steps</Label>
                  <Textarea
                    id="nextSteps"
                    value={formData.nextSteps}
                    onChange={(e) => handleInputChange("nextSteps", e.target.value)}
                    placeholder="Outline the next steps for the installation team"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
