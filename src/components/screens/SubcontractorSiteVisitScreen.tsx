import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { FileUploader } from "../FileUploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Users, Zap, Home, MapPin, Shield, Calendar, Clock, Wrench, Camera, Download, Save, CheckCircle, CheckSquare, FileText } from "lucide-react";

export function SubcontractorSiteVisitScreen() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    propertyAddress: "",
    location: "",
    clientType: "",
    clientName: "",
    jobType: "",
    siteInspectionDate: "",
    siteInspectionTime: "",
    priceAud: "",
    systemSizeKw: "",
    inverterSizeKw: "",
    inverterBrand: "",
    inverterType: "",
    panelBrand: "",
    panelModuleWatts: "",
    houseStorey: "",
    roofType: "",
    accessSecondStorey: "",
    accessToInverter: "",
    meterPhase: "",
    visitDate: "",
    visitTime: "",
    technicianName: "",
    weatherConditions: "",
    safetyHazards: [] as string[],
    safetyNotes: "",
    ppeRequired: [] as string[],
    emergencyContacts: "",
    mainPanelLocation: "",
    panelCondition: "",
    availableAmperage: "",
    groundingSystem: "",
    electricalHazards: [] as string[],
    electricalNotes: "",
    roofCondition: "",
    roofAccess: "",
    structuralIntegrity: "",
    mountingPoints: [] as string[],
    roofHazards: [] as string[],
    roofNotes: "",
    panelCount: "",
    inverterLocation: "",
    conduitPath: "",
    specialRequirements: "",
    photos: [] as string[],
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
    generalNotes: "",
    recommendations: "",
    nextSteps: "",
  });

  const [technicians, setTechnicians] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewRecord, setViewRecord] = useState<any | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState<any | null>(null);

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
    
    // Load drafts and assessments
    try {
      const d = localStorage.getItem('xtr_retailer_site_visit_drafts');
      setDrafts(d ? JSON.parse(d) : []);
    } catch { setDrafts([]); }
    try {
      const s = localStorage.getItem('xtr_retailer_site_visit_assessments');
      setAssessments(s ? JSON.parse(s) : []);
    } catch { setAssessments([]); }
    
    // Prefill from project data when coming from calendar
    try {
      const raw = localStorage.getItem('xtr_retailer_site_visit_prefill');
      if (!raw) return;
      const pre = JSON.parse(raw) || {};
      
      setFormData(prev => ({
        ...prev,
        // Customer Information
        customerName: pre.customerName || prev.customerName,
        customerEmail: pre.customerEmail || prev.customerEmail,
        customerPhone: pre.customerPhone || prev.customerPhone,
        propertyAddress: pre.customerAddress || prev.propertyAddress,
        location: pre.location || prev.location,
        clientType: pre.clientType || prev.clientType,
        clientName: pre.clientName || prev.clientName,
        jobType: pre.jobType || prev.jobType,
        siteInspectionDate: pre.siteInspectionDate || prev.siteInspectionDate,
        siteInspectionTime: pre.siteInspectionTime || prev.siteInspectionTime,
        priceAud: pre.priceAud || prev.priceAud,
        
        // System Information - these will be shown in read-only fields but we store them here for export
        systemSizeKw: pre.systemSizeKw || prev.systemSizeKw,
        inverterSizeKw: pre.inverterSizeKw || prev.inverterSizeKw,
        inverterBrand: pre.inverterBrand || prev.inverterBrand,
        inverterType: pre.inverterType || prev.inverterType,
        panelBrand: pre.panelBrand || prev.panelBrand,
        panelModuleWatts: pre.panelModuleWatts || prev.panelModuleWatts,
        
        // Property Information
        houseStorey: pre.houseStorey || prev.houseStorey,
        roofType: pre.roofType || prev.roofType,
        accessSecondStorey: pre.accessSecondStorey || prev.accessSecondStorey,
        accessToInverter: pre.accessToInverter || prev.accessToInverter,
        meterPhase: pre.meterPhase || prev.meterPhase,
      }));
    } catch (err) {
      console.error('Error pre-filling form:', err);
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

  const handleChecklistChange = (id: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    }));
  };

  const saveDraft = () => {
    const draft = { 
      id: `RSD-${Date.now()}`, 
      customerName: formData.visitDate ? `Visit on ${formData.visitDate}` : 'Untitled Draft',
      updatedAt: new Date().toISOString(), 
      ...formData 
    };
    try {
      const prev = JSON.parse(localStorage.getItem('xtr_retailer_site_visit_drafts') || '[]');
      let next = Array.isArray(prev) ? prev : [];
      if (isEditingDraft) {
        next = next.map((d: any) => d.id === isEditingDraft.id ? draft : d);
        setIsEditingDraft(null);
      } else {
        next = [draft, ...next];
      }
      localStorage.setItem('xtr_retailer_site_visit_drafts', JSON.stringify(next));
      setDrafts(next);
      alert('Draft saved');
      
      // Clear all form fields after saving
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        propertyAddress: "",
        location: "",
        clientType: "",
        clientName: "",
        jobType: "",
        siteInspectionDate: "",
        siteInspectionTime: "",
        priceAud: "",
        systemSizeKw: "",
        inverterSizeKw: "",
        inverterBrand: "",
        inverterType: "",
        panelBrand: "",
        panelModuleWatts: "",
        houseStorey: "",
        roofType: "",
        accessSecondStorey: "",
        accessToInverter: "",
        meterPhase: "",
        visitDate: "",
        visitTime: "",
        technicianName: "",
        weatherConditions: "",
        safetyHazards: [],
        safetyNotes: "",
        ppeRequired: [],
        emergencyContacts: "",
        mainPanelLocation: "",
        panelCondition: "",
        availableAmperage: "",
        groundingSystem: "",
        electricalHazards: [],
        electricalNotes: "",
        roofCondition: "",
        roofAccess: "",
        structuralIntegrity: "",
        mountingPoints: [],
        roofHazards: [],
        roofNotes: "",
        panelCount: "",
        inverterLocation: "",
        conduitPath: "",
        specialRequirements: "",
        photos: [],
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
        generalNotes: "",
        recommendations: "",
        nextSteps: "",
      });
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = { 
      id: `RS-${Date.now()}`, 
      customerName: formData.visitDate ? `Visit on ${formData.visitDate}` : 'Untitled Assessment',
      createdAt: new Date().toISOString(), 
      ...formData 
    };
    try {
      const prev = JSON.parse(localStorage.getItem('xtr_retailer_site_visit_assessments') || '[]');
      const next = Array.isArray(prev) ? [record, ...prev] : [record];
      localStorage.setItem('xtr_retailer_site_visit_assessments', JSON.stringify(next));
      setAssessments(next);
    } catch {}
    // Remove drafts
    try {
      if (isEditingDraft) {
        const prevDrafts = JSON.parse(localStorage.getItem('xtr_retailer_site_visit_drafts') || '[]');
        const filtered = Array.isArray(prevDrafts) ? prevDrafts.filter((d: any) => d.id !== isEditingDraft.id) : [];
        localStorage.setItem('xtr_retailer_site_visit_drafts', JSON.stringify(filtered));
        setDrafts(filtered);
        setIsEditingDraft(null);
      }
    } catch {}
    
    // Clear the form after successful submission
    setFormData(prev => ({
      ...prev,
      visitDate: "",
      visitTime: "",
      technicianName: "",
      weatherConditions: "",
      safetyHazards: [],
      safetyNotes: "",
      ppeRequired: [],
      emergencyContacts: "",
      mainPanelLocation: "",
      panelCondition: "",
      availableAmperage: "",
      groundingSystem: "",
      electricalHazards: [],
      electricalNotes: "",
      roofCondition: "",
      roofAccess: "",
      structuralIntegrity: "",
      mountingPoints: [],
      roofHazards: [],
      roofNotes: "",
      panelCount: "",
      inverterLocation: "",
      conduitPath: "",
      specialRequirements: "",
      photos: [],
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
      generalNotes: "",
      recommendations: "",
      nextSteps: "",
    }));
    
    alert("Retailer Site Visit Assessment submitted successfully!");
  };

  const handleExportForm = () => {
    // Create CSV content
    const csvContent = [
      ["Field", "Value"],
      ["Visit Date", formData.visitDate],
      ["Visit Time", formData.visitTime],
      ["Technician Name", formData.technicianName],
      ["Weather Conditions", formData.weatherConditions],
      ["Safety Hazards", formData.safetyHazards.join(", ")],
      ["Safety Notes", formData.safetyNotes],
      ["PPE Required", formData.ppeRequired.join(", ")],
      ["Emergency Contacts", formData.emergencyContacts],
      ["Main Panel Location", formData.mainPanelLocation],
      ["Panel Condition", formData.panelCondition],
      ["Available Amperage", formData.availableAmperage],
      ["Grounding System", formData.groundingSystem],
      ["Electrical Hazards", formData.electricalHazards.join(", ")],
      ["Electrical Notes", formData.electricalNotes],
      ["Roof Condition", formData.roofCondition],
      ["Roof Access", formData.roofAccess],
      ["Structural Integrity", formData.structuralIntegrity],
      ["Mounting Points", formData.mountingPoints.join(", ")],
      ["Roof Hazards", formData.roofHazards.join(", ")],
      ["Roof Notes", formData.roofNotes],
      ["Panel Count", formData.panelCount],
      ["Inverter Location", formData.inverterLocation],
      ["Conduit Path", formData.conduitPath],
      ["Special Requirements", formData.specialRequirements],
      ["Photos", Array.isArray(formData.photos) ? formData.photos.join(", ") : ""],
      ...formData.checklist.map(item => [item.item, item.checked ? "Yes" : "No"]),
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
    a.download = `retailer-site-visit-${formData.visitDate || 'report'}.csv`;
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
              <h1 className="text-3xl font-bold text-gray-900">Retailer Site Visit</h1>
              <p className="text-gray-600 mt-2">Technical site evaluation and assessment for retailer projects</p>
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
                <Label>Customer Name</Label>
                <Input value={formData.customerName || ''} placeholder="Enter customer name" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Customer Email</Label>
                <Input type="email" value={formData.customerEmail || ''} placeholder="Enter customer email" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Customer Contact</Label>
                <Input value={formData.customerPhone || ''} placeholder="Enter customer contact" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Customer Address</Label>
                <Input value={formData.propertyAddress || ''} placeholder="Enter customer address" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Location (Google Maps)</Label>
                <Input value={formData.location || ''} placeholder="Enter location" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Client Type</Label>
                <Input value={formData.clientType || ''} placeholder="Enter client type" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input value={formData.clientName || ''} placeholder="Enter client name" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Input value={formData.jobType || ''} placeholder="Enter job type" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Site Inspection Date</Label>
                <Input type="date" value={formData.siteInspectionDate || ''} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Site Inspection Time</Label>
                <Input type="time" value={formData.siteInspectionTime || ''} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Price (AUD)</Label>
                <Input value={formData.priceAud || ''} placeholder="Enter price in AUD" readOnly className="bg-gray-50" />
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
                <Label>System Size (kW)</Label>
                <Input value={formData.systemSizeKw || ''} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Inverter Size (kW)</Label>
                <Input value={formData.inverterSizeKw || ''} placeholder="Enter inverter size in kW" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Inverter Brand</Label>
                <Input value={formData.inverterBrand || ''} placeholder="Enter inverter brand" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Inverter Type</Label>
                <Input value={formData.inverterType || ''} placeholder="Enter inverter type" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Panel Brand</Label>
                <Input value={formData.panelBrand || ''} placeholder="Enter panel brand" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Panel Module (Watts)</Label>
                <Input value={formData.panelModuleWatts || ''} placeholder="Enter panel module watts" readOnly className="bg-gray-50" />
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
                <Label>House Storey</Label>
                <Input value={formData.houseStorey || ''} placeholder="Enter house storey" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Roof Type</Label>
                <Input value={formData.roofType || ''} placeholder="Enter roof type" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Access to 2nd Storey</Label>
                <Input value={formData.accessSecondStorey || ''} placeholder="Enter access information" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Access to Inverter</Label>
                <Input value={formData.accessToInverter || ''} placeholder="Enter access information" readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Meter Phase</Label>
                <Input value={formData.meterPhase || ''} placeholder="Enter meter phase" readOnly className="bg-gray-50" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Site Information Section */}
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
                <div className="flex items-center gap-2">
                  <Input
                    id="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => handleInputChange("visitDate", e.target.value)}
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitTime">Visit Time</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="visitTime"
                    type="time"
                    value={formData.visitTime}
                    onChange={(e) => handleInputChange("visitTime", e.target.value)}
                    placeholder="--:--"
                  />
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
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

        {/* Safety Assessment Section */}
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

        {/* Electrical Assessment Section */}
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

        {/* Roof Assessment Section */}
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
                  value={formData.roofType || ''}
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

        {/* Installation Requirements Section */}
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

        {/* Site Photos Section */}
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

        {/* Saved Drafts Section */}
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

        {/* Submitted On-Field Assessments Section */}
        <Card>
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

            </form>
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

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Retailer Site Visit Assessment</DialogTitle>
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
              {viewRecord.safetyNotes && (
                <div>
                  <Label>Safety Notes</Label>
                  <p>{viewRecord.safetyNotes}</p>
                </div>
              )}
              {viewRecord.electricalNotes && (
                <div>
                  <Label>Electrical Notes</Label>
                  <p>{viewRecord.electricalNotes}</p>
                </div>
              )}
              {viewRecord.roofNotes && (
                <div>
                  <Label>Roof Notes</Label>
                  <p>{viewRecord.roofNotes}</p>
                </div>
              )}
              {viewRecord.specialRequirements && (
                <div>
                  <Label>Special Requirements</Label>
                  <p>{viewRecord.specialRequirements}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


