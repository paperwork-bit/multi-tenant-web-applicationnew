import React, { useEffect, useState } from "react";
import { db, firebaseEnabled } from "../../lib/firebase";
import { onSnapshot, collection } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Camera, 
  Wrench, 
  Zap, 
  Home, 
  Building, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Target,
  Star,
  Flag,
  ChevronDown,
  ChevronUp,
  Plus,
  MoreHorizontal,
  Shield
} from "lucide-react";

export function ProjectManagementSiteVisitScreen() {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showVisitDetails, setShowVisitDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showOnFieldDialog, setShowOnFieldDialog] = useState(false);
  const [showLeadScoreDialog, setShowLeadScoreDialog] = useState(false);
  const [showSafetyScoreDialog, setShowSafetyScoreDialog] = useState(false);
  const [showEditVisitDialog, setShowEditVisitDialog] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);

  // Sales site visits (from storage/firestore)
  const [salesSiteVisits, setSalesSiteVisits] = useState<any[]>([]);

  useEffect(() => {
    const normalize = (it: any, idx: number) => ({
      id: it.id || `SV-${idx+1}`,
      customerName: it.customerName || '',
      propertyAddress: it.propertyAddress || '',
      salesPerson: it.salesPersonName || it.salesPersonEmail || '',
      salesPersonName: it.salesPersonName || '',
      salesPersonEmail: it.salesPersonEmail || '',
      visitDate: it.dateOfVisit || it.createdAt?.slice(0,10) || '',
      status: 'completed',
      propertyType: (it.propertyType || '').charAt(0).toUpperCase() + (it.propertyType || '').slice(1),
      energyProvider: it.currentEnergyProvider || '',
      energyDistributor: it.energyDistributor || '',
      meterPhase: it.meterPhase || '',
      monthlyBill: it.averageMonthlyBill || '',
      roofType: it.roofType || '',
      roofOrientation: it.roofOrientation || '',
      numberOfStory: it.numberOfStory || '',
      shadingAssessment: Array.isArray(it.shadingAssessment) ? it.shadingAssessment : [],
      primaryMotivation: Array.isArray(it.primaryMotivation) ? it.primaryMotivation : [],
      existingSolarInstallations: it.existingSolarInstallations || '',
      interestLevel: it.interestLevel || '',
      systemSize: it.systemSize || '',
      estimatedCost: it.estimatedCost || '',
      leadScore: 80,
      nextSteps: it.nextSteps || '',
      notes: it.siteNotes || '',
      siteNotes: it.siteNotes || '',
      specialRequirements: it.specialRequirements || '',
      electricianVisitDate: it.electricianVisitDate || '',
      electricianVisitTime: it.electricianVisitTime || '',
      electricianNotes: it.electricianNotes || '',
      customerEmail: it.customerEmail || '',
      customerPhone: it.customerPhone || '',
      attachments: Array.isArray(it.attachments) ? it.attachments : [],
      checklistItems: Array.isArray(it.checklist) ? it.checklist : [],
      checklist: Array.isArray(it.checklist)
        ? (it.checklist as any[]).reduce((acc: any, cur: any) => { acc[cur.item] = !!cur.checked; return acc; }, {})
        : {},
      raw: it
    });
    const loadLocal = () => {
      try {
        const raw = localStorage.getItem('xtr_site_visits');
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) setSalesSiteVisits(arr.map((it: any, i: number) => normalize(it, i)));
      } catch {}
    };
    loadLocal();
    const onStorage = (e: StorageEvent) => { if (e.key === 'xtr_site_visits') loadLocal(); };
    window.addEventListener('storage', onStorage);
    let unsub: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsub = onSnapshot(collection(db, 'site_visits'), (snap) => {
          const arr = snap.docs.map((d, i) => normalize(d.data(), i));
          if (Array.isArray(arr)) setSalesSiteVisits(arr as any);
        });
      } catch {}
    }
    return () => { window.removeEventListener('storage', onStorage); if (typeof unsub === 'function') unsub(); };
  }, []);

  // Fallback sample data when empty
  const fallbackSalesData = [
    {
      id: "SV-001",
      customerName: "[Customer Name]",
      propertyAddress: "123 Solar Street, Brisbane QLD 4000",
      salesPerson: "Sarah Johnson",
      visitDate: "2024-01-15",
      status: "completed",
      propertyType: "Residential",
      energyProvider: "Origin Energy",
      monthlyBill: "$180",
      roofType: "Tile",
      roofOrientation: "North",
      systemSize: "6.6kW",
      estimatedCost: "$12,500",
      leadScore: 85,
      nextSteps: "Follow up with proposal",
      notes: "Customer very interested, roof in good condition",
      checklist: {
        driverLicense: true,
        installationAddress: true,
        rentalProperty: false,
        ownedProperty: true,
        nmiNumber: true,
        meterNumber: true,
        solarVictoria: true
      }
    },
    {
      id: "SV-002",
      customerName: "[Customer Name 2]",
      propertyAddress: "456 Renewable Road, Melbourne VIC 3000",
      salesPerson: "Mike Chen",
      visitDate: "2024-01-14",
      status: "pending",
      propertyType: "Commercial",
      energyProvider: "AGL",
      monthlyBill: "$450",
      roofType: "Metal",
      roofOrientation: "North-East",
      systemSize: "15kW",
      estimatedCost: "$28,000",
      leadScore: 92,
      nextSteps: "Schedule electrician visit",
      notes: "Large commercial property, excellent solar potential",
      checklist: {
        driverLicense: true,
        installationAddress: true,
        rentalProperty: false,
        ownedProperty: true,
        nmiNumber: true,
        meterNumber: true,
        solarVictoria: false
      }
    },
    {
      id: "SV-003",
      customerName: "[Customer Name 3]",
      propertyAddress: "789 Green Avenue, Sydney NSW 2000",
      salesPerson: "Emma Davis",
      visitDate: "2024-01-13",
      status: "in-progress",
      propertyType: "Residential",
      energyProvider: "EnergyAustralia",
      monthlyBill: "$220",
      roofType: "Tile",
      roofOrientation: "South",
      systemSize: "8.2kW",
      estimatedCost: "$15,800",
      leadScore: 78,
      nextSteps: "Complete site assessment",
      notes: "Customer considering battery storage options",
      checklist: {
        driverLicense: true,
        installationAddress: true,
        rentalProperty: false,
        ownedProperty: true,
        nmiNumber: false,
        meterNumber: true,
        solarVictoria: true
      }
    }
  ];

  // On-field site visits (from storage/firestore)
  const [onFieldSiteVisits, setOnFieldSiteVisits] = useState<any[]>([]);

  useEffect(() => {
    const normalize = (it: any, idx: number) => ({
      id: it.id || `OF-${idx+1}`,
      customerName: it.customerName || it.title || '',
      propertyAddress: it.propertyAddress || it.customerAddress || '',
      technician: it.technicianName || it.technician || '',
      visitDate: it.visitDate || it.createdAt?.slice(0,10) || '',
      status: 'completed',
      installationType: it.installationType || 'Technical Assessment',
      systemSize: it.systemSize || '',
      roofAssessment: it.roofCondition || '',
      electricalAssessment: it.panelCondition || '',
      safetyScore: 0,
      installationReadiness: 'Ready',
      estimatedDuration: it.estimatedDuration || '',
      specialRequirements: it.specialRequirements || '',
      notes: it.generalNotes || it.salesNotes || '',
      checklist: {}
    });
    const loadLocal = () => {
      try {
        const raw = localStorage.getItem('xtr_onfield_assessments');
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) setOnFieldSiteVisits(arr.map((it: any, i: number) => normalize(it, i)));
      } catch {}
    };
    loadLocal();
    const onStorage = (e: StorageEvent) => { if (e.key === 'xtr_onfield_assessments') loadLocal(); };
    window.addEventListener('storage', onStorage);
    let unsub: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsub = onSnapshot(collection(db, 'onfield_site_visits'), (snap) => {
          const arr = snap.docs.map((d, i) => normalize(d.data(), i));
          if (Array.isArray(arr)) setOnFieldSiteVisits(arr as any);
        });
      } catch {}
    }
    return () => { window.removeEventListener('storage', onStorage); if (typeof unsub === 'function') unsub(); };
  }, []);

  // Mock data fallback for on-field site visits
  const fallbackOnField = [
    {
      id: "OF-001",
      customerName: "[Customer Name]",
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
      checklist: {
        siteAccess: true,
        roofIntegrity: true,
        electricalPanel: true,
        meterBox: true,
        safetyEquipment: true,
        toolsReady: true
      }
    },
    {
      id: "OF-002",
      customerName: "[Customer Name 2]",
      propertyAddress: "456 Renewable Road, Melbourne VIC 3000",
      technician: "Lisa Park",
      visitDate: "2024-01-17",
      status: "scheduled",
      installationType: "Commercial Solar System",
      systemSize: "15kW",
      roofAssessment: "Good",
      electricalAssessment: "Excellent",
      safetyScore: 88,
      installationReadiness: "Pending",
      estimatedDuration: "2-3 days",
      specialRequirements: "Weekend installation preferred",
      notes: "Large commercial installation, multiple phases",
      checklist: {
        siteAccess: true,
        roofIntegrity: false,
        electricalPanel: true,
        meterBox: true,
        safetyEquipment: false,
        toolsReady: true
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "pending": return <AlertCircle className="w-4 h-4" />;
      case "scheduled": return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredSalesVisits = (salesSiteVisits.length > 0 ? salesSiteVisits : fallbackSalesData).filter((visit: any) => {
    const matchesSearch = visit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.salesPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || visit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredOnFieldVisits = (onFieldSiteVisits.length > 0 ? onFieldSiteVisits : fallbackOnField).filter(visit => {
    const matchesSearch = visit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || visit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (visit, type) => {
    setSelectedVisit({ ...visit, type });
    setShowVisitDetails(true);
  };

  const handleExportData = () => {
    setShowExportDialog(true);
  };

  const handleStatsClick = (type) => {
    if (type === 'sales') {
      setShowStatsDialog(true);
    } else if (type === 'on-field') {
      setShowOnFieldDialog(true);
    } else if (type === 'lead-score') {
      setShowLeadScoreDialog(true);
    } else if (type === 'safety-score') {
      setShowSafetyScoreDialog(true);
    }
  };

  const handleEditVisit = (visit, type) => {
    setEditingVisit({ ...visit, type });
    setShowEditVisitDialog(true);
  };

  const handleExportConfirm = () => {
    alert("Exporting data... This would generate a CSV/Excel file with all site visit data.");
    setShowExportDialog(false);
  };

  const handleEditVisitSave = () => {
    alert("Visit updated successfully!");
    setShowEditVisitDialog(false);
    setEditingVisit(null);
  };

  const stats = {
    totalSalesVisits: salesSiteVisits.length,
    completedSalesVisits: salesSiteVisits.filter(v => v.status === "completed").length,
    totalOnFieldVisits: onFieldSiteVisits.length,
    completedOnFieldVisits: onFieldSiteVisits.filter(v => v.status === "completed").length,
    averageLeadScore: Math.round(salesSiteVisits.reduce((sum, v) => sum + v.leadScore, 0) / salesSiteVisits.length),
    averageSafetyScore: Math.round(onFieldSiteVisits.reduce((sum, v) => sum + v.safetyScore, 0) / onFieldSiteVisits.length)
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Visit Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage sales and on-field site visits</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('sales')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sales Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSalesVisits}</p>
                  <p className="text-sm text-green-600">{stats.completedSalesVisits} completed</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('on-field')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On-Field Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOnFieldVisits}</p>
                  <p className="text-sm text-green-600">{stats.completedOnFieldVisits} completed</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Wrench className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('lead-score')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Lead Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageLeadScore}</p>
                  <p className="text-sm text-blue-600">Sales quality</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('safety-score')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Safety Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageSafetyScore}</p>
                  <p className="text-sm text-green-600">Safety rating</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search visits by customer, address, or team member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs for Sales vs On-Field Visits */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sales">Sales Site Visits ({filteredSalesVisits.length})</TabsTrigger>
            <TabsTrigger value="on-field">On-Field Site Visits ({filteredOnFieldVisits.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 max-h-[520px] overflow-y-auto pr-1">
              {filteredSalesVisits.map((visit: any) => (
                <Card key={visit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{visit.customerName}</h3>
                          <Badge className={getStatusColor(visit.status)}>
                            {getStatusIcon(visit.status)}
                            <span className="ml-1 capitalize">{visit.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{visit.propertyAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Sales: {visit.salesPerson}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{visit.visitDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span>{visit.systemSize} - {visit.estimatedCost}</span>
                          </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="capitalize">{visit.meterPhase || '-'}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">Lead Score: {visit.leadScore}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            <span className="text-sm">{visit.propertyType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm">${visit.monthlyBill}/month</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(visit, 'sales')}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="on-field" className="space-y-4">
            <div className="grid gap-4 max-h-[520px] overflow-y-auto pr-1">
              {filteredOnFieldVisits.map((visit) => (
                <Card key={visit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{visit.customerName}</h3>
                          <Badge className={getStatusColor(visit.status)}>
                            {getStatusIcon(visit.status)}
                            <span className="ml-1 capitalize">{visit.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{visit.propertyAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Tech: {visit.technician}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{visit.visitDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            <span>{visit.installationType}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Safety: {visit.safetyScore}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            <span className="text-sm">Roof: {visit.roofAssessment}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm">Electrical: {visit.electricalAssessment}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(visit, 'on-field')}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Visit Details Dialog */}
        <Dialog open={showVisitDetails} onOpenChange={setShowVisitDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedVisit?.type === 'sales' ? <Users className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                {selectedVisit?.customerName} - {selectedVisit?.type === 'sales' ? 'Sales' : 'On-Field'} Visit Details
              </DialogTitle>
            </DialogHeader>
            {selectedVisit && (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Customer Name</Label>
                      <p className="text-lg">{selectedVisit.customerName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Property Address</Label>
                      <p className="text-lg">{selectedVisit.propertyAddress}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Visit Date</Label>
                      <p className="text-lg">{selectedVisit.visitDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <Badge className={getStatusColor(selectedVisit.status)}>
                        {getStatusIcon(selectedVisit.status)}
                        <span className="ml-1 capitalize">{selectedVisit.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales-specific details */}
                {selectedVisit.type === 'sales' && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Sales Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Sales Person</Label>
                          <p className="text-lg">{selectedVisit.salesPerson}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Customer Email</Label>
                          <p className="text-lg">{selectedVisit.customerEmail || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Customer Phone</Label>
                          <p className="text-lg">{selectedVisit.customerPhone || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Property Type</Label>
                          <p className="text-lg">{selectedVisit.propertyType}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Energy Provider</Label>
                          <p className="text-lg">{selectedVisit.energyProvider}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Energy Distributor</Label>
                          <p className="text-lg">{selectedVisit.energyDistributor || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Monthly Bill</Label>
                          <p className="text-lg">{selectedVisit.monthlyBill}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Meter Phase</Label>
                          <p className="text-lg capitalize">{selectedVisit.meterPhase || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Roof Orientation</Label>
                          <p className="text-lg">{selectedVisit.roofOrientation || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">System Size</Label>
                          <p className="text-lg">{selectedVisit.systemSize}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Estimated Cost</Label>
                          <p className="text-lg">{selectedVisit.estimatedCost}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Roof Type</Label>
                          <p className="text-lg">{selectedVisit.roofType || '-'}</p>
                            </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Number of Storey</Label>
                          <p className="text-lg">{selectedVisit.numberOfStory || '-'}</p>
                          </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Next Steps</Label>
                          <p className="text-lg">{selectedVisit.nextSteps}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-gray-600">Shading Assessment</Label>
                          <p className="text-lg">{Array.isArray(selectedVisit.shadingAssessment) && selectedVisit.shadingAssessment.length > 0 ? selectedVisit.shadingAssessment.join(', ') : '-'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-gray-600">Primary Motivation</Label>
                          <p className="text-lg">{Array.isArray(selectedVisit.primaryMotivation) && selectedVisit.primaryMotivation.length > 0 ? selectedVisit.primaryMotivation.join(', ') : '-'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Existing Solar Installations</Label>
                          <p className="text-lg capitalize">{selectedVisit.existingSolarInstallations || '-'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Interest Level</Label>
                          <p className="text-lg">{selectedVisit.interestLevel || '-'}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Site Visit Checklist</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Array.isArray(selectedVisit.checklistItems) && selectedVisit.checklistItems.length > 0 ? (
                            selectedVisit.checklistItems.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-2">
                                {item.checked ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              )}
                                <span>{item.item}</span>
                            </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-600">No checklist data</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {(selectedVisit.siteNotes || selectedVisit.specialRequirements || selectedVisit.electricianVisitDate || selectedVisit.electricianVisitTime || selectedVisit.electricianNotes) && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Notes & Electrician Site Visit</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-600">Site Notes</Label>
                            <p className="text-lg">{selectedVisit.siteNotes || '-'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-600">Special Requirements</Label>
                            <p className="text-lg">{selectedVisit.specialRequirements || '-'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Electrician Visit Date</Label>
                            <p className="text-lg">{selectedVisit.electricianVisitDate || '-'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Electrician Visit Time</Label>
                            <p className="text-lg">{selectedVisit.electricianVisitTime || '-'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-600">Notes for Electrician</Label>
                            <p className="text-lg">{selectedVisit.electricianNotes || '-'}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {/* On-field specific details */}
                {selectedVisit.type === 'on-field' && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Technical Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Technician</Label>
                          <p className="text-lg">{selectedVisit.technician}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Installation Type</Label>
                          <p className="text-lg">{selectedVisit.installationType}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">System Size</Label>
                          <p className="text-lg">{selectedVisit.systemSize}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Estimated Duration</Label>
                          <p className="text-lg">{selectedVisit.estimatedDuration}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Roof Assessment</Label>
                          <Badge className={selectedVisit.roofAssessment === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {selectedVisit.roofAssessment}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Electrical Assessment</Label>
                          <Badge className={selectedVisit.electricalAssessment === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {selectedVisit.electricalAssessment}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Safety Score</Label>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${selectedVisit.safetyScore}%` }}
                              ></div>
                            </div>
                            <span className="text-lg font-medium">{selectedVisit.safetyScore}%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Installation Readiness</Label>
                          <Badge className={selectedVisit.installationReadiness === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {selectedVisit.installationReadiness}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Technical Checklist</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(selectedVisit.checklist).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              {value ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              )}
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notes & Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedVisit.notes}</p>
                    {selectedVisit.specialRequirements && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-gray-600">Special Requirements</Label>
                        <p className="text-gray-700">{selectedVisit.specialRequirements}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Export Data Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Site Visit Data
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">Choose what data to export:</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Sales Site Visits ({stats.totalSalesVisits})</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>On-Field Site Visits ({stats.totalOnFieldVisits})</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Statistics & Metrics</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format:</label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleExportConfirm}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats Dialog */}
        <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Site Visit Statistics
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Visits Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Visits:</span>
                      <span className="font-bold">{stats.totalSalesVisits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-bold text-green-600">{stats.completedSalesVisits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>In Progress:</span>
                      <span className="font-bold text-blue-600">{salesSiteVisits.filter(v => v.status === "in-progress").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-bold text-yellow-600">{salesSiteVisits.filter(v => v.status === "pending").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-bold">{Math.round((stats.completedSalesVisits / stats.totalSalesVisits) * 100)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>On-Field Visits Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Visits:</span>
                      <span className="font-bold">{stats.totalOnFieldVisits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-bold text-green-600">{stats.completedOnFieldVisits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scheduled:</span>
                      <span className="font-bold text-purple-600">{onFieldSiteVisits.filter(v => v.status === "scheduled").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-bold">{Math.round((stats.completedOnFieldVisits / stats.totalOnFieldVisits) * 100)}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...salesSiteVisits, ...onFieldSiteVisits]
                      .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
                      .slice(0, 5)
                      .map((visit, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">{visit.customerName}</span>
                            <Badge className={getStatusColor(visit.status)}>
                              {visit.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">{visit.visitDate}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lead Score Dialog */}
        <Dialog open={showLeadScoreDialog} onOpenChange={setShowLeadScoreDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Lead Score Analysis
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Lead Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-yellow-500 h-3 rounded-full" 
                          style={{ width: `${stats.averageLeadScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-lg">{stats.averageLeadScore}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {salesSiteVisits.map((visit) => (
                      <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{visit.customerName}</span>
                          <p className="text-sm text-gray-600">{visit.salesPerson}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ width: `${visit.leadScore}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{visit.leadScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Score Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>90-100: Excellent lead - High conversion probability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>70-89: Good lead - Moderate conversion probability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>50-69: Fair lead - Requires follow-up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Below 50: Poor lead - Low conversion probability</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Safety Score Dialog */}
        <Dialog open={showSafetyScoreDialog} onOpenChange={setShowSafetyScoreDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safety Score Analysis
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Safety Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Safety Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full" 
                          style={{ width: `${stats.averageSafetyScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-lg">{stats.averageSafetyScore}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {onFieldSiteVisits.map((visit) => (
                      <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{visit.customerName}</span>
                          <p className="text-sm text-gray-600">{visit.technician}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${visit.safetyScore}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{visit.safetyScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Assessment Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Site Access: Clear and safe entry/exit points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Roof Integrity: Structural soundness and condition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Electrical Panel: Safe and accessible electrical connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Safety Equipment: Proper safety gear and tools available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Environmental: Weather and site conditions suitable for work</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* On-Field Visits Dialog */}
        <Dialog open={showOnFieldDialog} onOpenChange={setShowOnFieldDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                On-Field Visits Overview
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 overflow-y-auto flex-1 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Visits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{stats.totalOnFieldVisits}</div>
                    <p className="text-sm text-gray-600">Technical assessments</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{stats.completedOnFieldVisits}</div>
                    <p className="text-sm text-gray-600">Ready for installation</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round((stats.completedOnFieldVisits / stats.totalOnFieldVisits) * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">Completion rate</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>On-Field Visit Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {onFieldSiteVisits.map((visit) => (
                      <div key={visit.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Wrench className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{visit.customerName}</h4>
                              <p className="text-sm text-gray-600">{visit.propertyAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={visit.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                            visit.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                                            'bg-yellow-100 text-yellow-800'}>
                              {visit.status}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(visit, 'on-field')}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Technician:</span>
                            <p className="font-medium">{visit.technician}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Visit Date:</span>
                            <p className="font-medium">{visit.visitDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">System Size:</span>
                            <p className="font-medium">{visit.systemSize}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Safety Score:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${visit.safetyScore}%` }}
                                ></div>
                              </div>
                              <span className="font-medium">{visit.safetyScore}%</span>
                            </div>
                          </div>
                        </div>
                        
                        {visit.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{visit.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {onFieldSiteVisits.filter(v => v.installationReadiness === "Ready").length}
                      </div>
                      <p className="text-sm text-gray-600">Ready for Installation</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {onFieldSiteVisits.filter(v => v.roofAssessment === "Excellent").length}
                      </div>
                      <p className="text-sm text-gray-600">Excellent Roof Condition</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {onFieldSiteVisits.filter(v => v.electricalAssessment === "Good").length}
                      </div>
                      <p className="text-sm text-gray-600">Good Electrical Setup</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(onFieldSiteVisits.reduce((sum, v) => sum + parseFloat(v.estimatedDuration.split('-')[0]), 0) / onFieldSiteVisits.length)}h
                      </div>
                      <p className="text-sm text-gray-600">Avg Install Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Visit Dialog */}
        <Dialog open={showEditVisitDialog} onOpenChange={setShowEditVisitDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit {editingVisit?.type === 'sales' ? 'Sales' : 'On-Field'} Visit
              </DialogTitle>
            </DialogHeader>
            {editingVisit && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Customer Name</label>
                    <Input defaultValue={editingVisit.customerName} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Visit Date</label>
                    <Input type="date" defaultValue={editingVisit.visitDate} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select defaultValue={editingVisit.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Property Address</label>
                    <Input defaultValue={editingVisit.propertyAddress} />
                  </div>
                </div>
                
                {editingVisit.type === 'sales' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Sales Person</label>
                      <Input defaultValue={editingVisit.salesPerson} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Lead Score</label>
                      <Input type="number" defaultValue={editingVisit.leadScore} min="0" max="100" />
                    </div>
                  </div>
                )}
                
                {editingVisit.type === 'on-field' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Technician</label>
                      <Input defaultValue={editingVisit.technician} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Safety Score</label>
                      <Input type="number" defaultValue={editingVisit.safetyScore} min="0" max="100" />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <textarea 
                    className="w-full p-3 border rounded-md" 
                    rows={3} 
                    defaultValue={editingVisit.notes}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditVisitDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditVisitSave}>
                <Edit className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
