import React, { useState } from "react";
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
import { ArrowLeft, Save, Sparkles, MapPin, Camera, CheckSquare, Calendar as CalendarIcon, Plus, X, Download, Upload, Eye, Edit, Trash2, Phone, Mail, Clock, DollarSign, Zap, Home, Building, Car, Battery, Sun, Wind, Droplets, Thermometer, Lightbulb, Wifi, Shield, CheckCircle, AlertCircle, Star, Filter, Search, MoreHorizontal, Settings, Bell, BellOff, Heart, Share, Bookmark, Flag, MessageSquare, Send, Copy, ExternalLink, ArrowRight, ChevronDown, ChevronUp, PlusCircle, MinusCircle, RefreshCw, FileText, Image, Video, Music, File, Folder, FolderOpen, Archive, Trash, Lock, Unlock, Key, UserCheck, UserX, UserPlus, UserMinus, Users, ThumbsUp, ThumbsDown, BookmarkCheck, Tag, Tags, Hash, AtSign, Percent, Plus as PlusIcon, Minus, Divide, X as XIcon, Equal, NotEqual, GreaterThan, LessThan, GreaterThanOrEqual, LessThanOrEqual, Infinity, Pi, Sigma, Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Eta, Theta, Iota, Kappa, Lambda, Mu, Nu, Xi, Omicron, Rho, Tau, Upsilon, Phi, Chi, Psi, Omega, Wrench, HardHat, ClipboardList, AlertTriangle } from "lucide-react";

export function OnFieldSiteVisitScreen() {
  const [formData, setFormData] = useState({
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
    roofType: "",
    meterPhase: "",
    numberOfStory: "",
    shadingAssessment: [],
    primaryMotivation: [],
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
    safetyHazards: [],
    safetyNotes: "",
    ppeRequired: [],
    emergencyContacts: "",
    
    // Electrical Assessment
    mainPanelLocation: "",
    panelCondition: "",
    availableAmperage: "",
    groundingSystem: "",
    electricalHazards: [],
    electricalNotes: "",
    
    // Roof Assessment
    roofType: "",
    roofCondition: "",
    roofAccess: "",
    structuralIntegrity: "",
    mountingPoints: [],
    roofHazards: [],
    roofNotes: "",
    
    // Installation Requirements
    panelCount: "",
    panelType: "",
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
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("On-Field Site Visit Form submitted:", formData);
    alert("On-Field Site Visit form submitted successfully!");
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
      ["Current Energy Provider", formData.currentEnergyProvider],
      ["Energy Distributor", formData.energyDistributor],
      ["Average Monthly Bill", formData.averageMonthlyBill],
      ["Roof Orientation", formData.roofOrientation],
      
      // Property Assessment (from Sales Call)
      ["Roof Type", formData.roofType],
      ["Meter Phase", formData.meterPhase],
      ["Number of Story", formData.numberOfStory],
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
      ["Panel Type", formData.panelType],
      ["Inverter Location", formData.inverterLocation],
      ["Conduit Path", formData.conduitPath],
      ["Mounting System", formData.mountingSystem],
      ["Special Requirements", formData.specialRequirements],
      
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
              {/* Customer Information (from Sales Call) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Customer Information (from Sales Call)
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
                        placeholder="Customer name from sales call"
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
                        placeholder="Customer email from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Customer Phone</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                        placeholder="Customer phone from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Input
                        id="propertyType"
                        value={formData.propertyType}
                        onChange={(e) => handleInputChange("propertyType", e.target.value)}
                        placeholder="Property type from sales call"
                        className="bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Input
                      id="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                      placeholder="Property address from sales call"
                      className="bg-gray-50"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>

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
                      <Label htmlFor="currentEnergyProvider">Current Energy Provider</Label>
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
                      <Label htmlFor="numberOfStory">Number of Story</Label>
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
                      <Input
                        id="technicianName"
                        value={formData.technicianName}
                        onChange={(e) => handleInputChange("technicianName", e.target.value)}
                        placeholder="Enter technician name"
                      />
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
                            onCheckedChange={(checked) => handleArrayChange("safetyHazards", hazard, checked as boolean)}
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
                      <Select value={formData.roofType} onValueChange={(value) => handleInputChange("roofType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select roof type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tile">Tile</SelectItem>
                          <SelectItem value="metal">Metal</SelectItem>
                          <SelectItem value="shingle">Shingle</SelectItem>
                          <SelectItem value="flat">Flat</SelectItem>
                          <SelectItem value="slate">Slate</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="panelType">Panel Type</Label>
                      <Select value={formData.panelType} onValueChange={(value) => handleInputChange("panelType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select panel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monocrystalline">Monocrystalline</SelectItem>
                          <SelectItem value="polycrystalline">Polycrystalline</SelectItem>
                          <SelectItem value="thin-film">Thin Film</SelectItem>
                          <SelectItem value="bifacial">Bifacial</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <div className="space-y-2">
                      <Label htmlFor="mountingSystem">Mounting System</Label>
                      <Select value={formData.mountingSystem} onValueChange={(value) => handleInputChange("mountingSystem", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mounting system" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="roof-mounted">Roof Mounted</SelectItem>
                          <SelectItem value="ground-mounted">Ground Mounted</SelectItem>
                          <SelectItem value="pole-mounted">Pole Mounted</SelectItem>
                          <SelectItem value="tracking">Tracking System</SelectItem>
                        </SelectContent>
                      </Select>
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
                    onFilesChange={(files) => handleInputChange("photos", files)}
                    acceptedFileTypes="image/*"
                    maxFiles={10}
                  />
                </CardContent>
              </Card>

            </form>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Sales Data Integration Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Users className="w-5 h-5" />
                  Sales Data Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Customer information pre-populated from sales call</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Energy and property data from sales assessment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Sales notes and observations included</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Focus on technical installation requirements</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardHat className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Generate Work Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Safety Issue
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Supervisor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

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
