import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CheckSquare, Camera, DollarSign, FileText, Clock, MapPin, User, Phone, Calendar, Users, CheckCircle, AlertCircle, Eye, Download, Upload, Plus, Edit, Trash2 } from "lucide-react";

export function InstallationDayScreen() {
  const [showJobDetailsDialog, setShowJobDetailsDialog] = useState(false);
  const [showChecklistItemDialog, setShowChecklistItemDialog] = useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showHandoverDialog, setShowHandoverDialog] = useState(false);
  const [showTimeTrackingDialog, setShowTimeTrackingDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showEditExpenseDialog, setShowEditExpenseDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showAddBreakDialog, setShowAddBreakDialog] = useState(false);
  const [newBreak, setNewBreak] = useState({ type: "", startTime: "", endTime: "" });
  const [jobStarted, setJobStarted] = useState(false);
  const [jobStartTime, setJobStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breaks, setBreaks] = useState([
    { id: 1, type: "Morning Break", startTime: "10:00 AM", endTime: "10:15 AM" },
    { id: 2, type: "Lunch Break", startTime: "12:00 PM", endTime: "12:30 PM" }
  ]);
  const [showPhotoCaptureDialog, setShowPhotoCaptureDialog] = useState(false);
  const [showHandoverPreviewDialog, setShowHandoverPreviewDialog] = useState(false);

  const checklist = [
    { id: 1, category: "Pre-Installation", item: "Safety briefing completed", checked: true },
    { id: 2, category: "Pre-Installation", item: "Site inspection done", checked: true },
    { id: 3, category: "Pre-Installation", item: "Tools and equipment ready", checked: true },
    { id: 4, category: "Installation", item: "Panel mounting rails installed", checked: true },
    { id: 5, category: "Installation", item: "Solar panels mounted", checked: false },
    { id: 6, category: "Installation", item: "Inverter installed and wired", checked: false },
    { id: 7, category: "Installation", item: "AC/DC isolators installed", checked: false },
    { id: 8, category: "Electrical", item: "Main switchboard connection", checked: false },
    { id: 9, category: "Electrical", item: "System testing and commissioning", checked: false },
    { id: 10, category: "Handover", item: "Customer walkthrough completed", checked: false },
    { id: 11, category: "Handover", item: "Documentation provided", checked: false },
    { id: 12, category: "Handover", item: "System operation explained", checked: false },
  ];

  const expenses = [
    { id: 1, item: "Additional cable run", amount: 85, receipt: true, description: "Extra 10m cable needed for inverter connection", date: "2024-01-15", category: "Materials" },
    { id: 2, item: "Parking permit", amount: 15, receipt: true, description: "Daily parking permit for installation vehicle", date: "2024-01-15", category: "Permits" },
  ];

  const photos = [
    { id: 1, title: "Roof - Before", description: "Initial roof condition before installation", timestamp: "8:00 AM", status: "Completed" },
    { id: 2, title: "Panel Install", description: "Solar panels being mounted on rails", timestamp: "10:30 AM", status: "In Progress" },
    { id: 3, title: "Inverter", description: "Inverter installation and wiring", timestamp: "11:45 AM", status: "Pending" },
    { id: 4, title: "Roof - After", description: "Final roof condition after installation", timestamp: "2:00 PM", status: "Pending" },
  ];

  const handleJobDetailsClick = () => {
    setShowJobDetailsDialog(true);
  };

  const handleChecklistItemClick = (item) => {
    setSelectedChecklistItem(item);
    setShowChecklistItemDialog(true);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoDialog(true);
  };

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense);
    setShowExpenseDialog(true);
  };

  const handleHandoverClick = () => {
    setShowHandoverDialog(true);
  };

  const handleTimeTrackingClick = () => {
    setShowTimeTrackingDialog(true);
  };

  const handleAttachReceipt = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Receipt attached: ${file.name}`);
        // Here you would typically upload the file or store it
      }
    };
    input.click();
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      // Add the new expense to the expenses array
      const expense = {
        id: expenses.length + 1,
        item: newExpense.description,
        amount: parseFloat(newExpense.amount),
        receipt: false,
        description: newExpense.description,
        date: new Date().toISOString().split('T')[0],
        category: "Other"
      };
      
      // In a real app, you would update the state or send to API
      alert(`Expense added: ${expense.item} - $${expense.amount}`);
      
      // Reset the form
      setNewExpense({ description: "", amount: "" });
    } else {
      alert("Please fill in both description and amount");
    }
  };

  const handleExpenseInputChange = (field, value) => {
    setNewExpense(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewReceipt = () => {
    setShowReceiptDialog(true);
  };

  const handleEditExpense = () => {
    setEditingExpense({ ...selectedExpense });
    setShowEditExpenseDialog(true);
  };

  const handleUpdateExpense = () => {
    if (editingExpense) {
      // In a real app, you would update the expenses array
      alert(`Expense updated: ${editingExpense.item} - $${editingExpense.amount}`);
      setShowEditExpenseDialog(false);
      setEditingExpense(null);
    }
  };

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Photo taken: ${file.name}`);
        setShowPhotoCaptureDialog(true);
      }
    };
    input.click();
  };

  const handlePreviewPack = () => {
    setShowHandoverPreviewDialog(true);
  };

  const handleDownloadPdf = () => {
    alert("Downloading Customer Handover Pack as PDF...");
  };

  const handleAddBreak = () => {
    if (newBreak.type && newBreak.startTime && newBreak.endTime) {
      const breakEntry = {
        id: breaks.length + 1,
        type: newBreak.type,
        startTime: newBreak.startTime,
        endTime: newBreak.endTime
      };
      setBreaks([...breaks, breakEntry]);
      setNewBreak({ type: "", startTime: "", endTime: "" });
      setShowAddBreakDialog(false);
      alert(`Break added: ${breakEntry.type} (${breakEntry.startTime} - ${breakEntry.endTime})`);
    } else {
      alert("Please fill in all break details");
    }
  };

  const handleStartJob = () => {
    setJobStarted(true);
    setJobStartTime(new Date());
    alert("Job started!");
  };

  const handleEndJob = () => {
    setJobStarted(false);
    setJobStartTime(null);
    alert("Job ended!");
  };

  const handleSaveProgress = () => {
    alert("Progress saved successfully!");
  };

  const handleBreakInputChange = (field, value) => {
    setNewBreak(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditExpenseInputChange = (field, value) => {
    setEditingExpense(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>Installation Day</h2>
            <p className="text-muted-foreground">Smith Residence</p>
          </div>
          <Badge className="bg-success text-success-foreground">In Progress</Badge>
        </div>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleJobDetailsClick}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Job Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Address</span>
              <span>123 Solar Street, Brisbane QLD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span>John Smith</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Contact</span>
              <Button variant="link" size="sm" className="h-auto p-0">
                +61 412 345 678
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Start Time</span>
              <span>8:00 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Team</span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>John Davis, Mike Chen</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              <CardTitle>Installation Checklist</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Pre-Installation", "Installation", "Electrical", "Handover"].map((category) => (
                <div key={category}>
                  <h4 className="mb-3">{category}</h4>
                  <div className="space-y-2">
                    {checklist
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors" onClick={() => handleChecklistItemClick(item)}>
                          <Checkbox id={`check-${item.id}`} checked={item.checked} onClick={(e) => e.stopPropagation()} />
                          <label htmlFor={`check-${item.id}`} className="flex-1 cursor-pointer">
                            {item.item}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span>Progress</span>
                <span>25% Complete</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-primary rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <CardTitle>Photo Documentation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors" onClick={() => handlePhotoClick(photo)}>
                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">{photo.title}</span>
              </div>
              ))}
            </div>
            <Button variant="outline" className="w-full" onClick={handleTakePhoto}>
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <CardTitle>Expenses & Reimbursements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleExpenseClick(expense)}>
                  <div className="flex-1">
                    <p>{expense.item}</p>
                    <p className="text-muted-foreground">${expense.amount}</p>
                  </div>
                  {expense.receipt && (
                    <Badge className="bg-success text-success-foreground">Receipt</Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="space-y-2">
                <Label>Expense Description</Label>
                <Input 
                  placeholder="e.g., Additional materials" 
                  value={newExpense.description}
                  onChange={(e) => handleExpenseInputChange("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  value={newExpense.amount}
                  onChange={(e) => handleExpenseInputChange("amount", e.target.value)}
                />
              </div>
              <Button variant="outline" className="w-full" onClick={handleAttachReceipt}>
                <Camera className="w-4 h-4 mr-2" />
                Attach Receipt
              </Button>
              <Button className="w-full" onClick={handleAddExpense}>Add Expense</Button>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span>Total Expenses</span>
                <span>${expenses.reduce((sum, e) => sum + e.amount, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleHandoverClick}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Customer Handover Pack</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="mb-2">Handover Pack Includes:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• System operation manual</li>
                <li>• Product warranties</li>
                <li>• Electrical compliance certificate</li>
                <li>• System monitoring app guide</li>
                <li>• Maintenance recommendations</li>
                <li>• Contact information for support</li>
              </ul>
            </div>

            <Button variant="outline" className="w-full" onClick={handlePreviewPack}>
              <FileText className="w-4 h-4 mr-2" />
              Preview Handover Pack
            </Button>

            <div className="space-y-2">
              <Label>Customer Notes</Label>
              <Textarea placeholder="Any special instructions or notes for the customer..." rows={4} />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleTimeTrackingClick}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Time Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobStarted ? (
            <div className="flex items-center justify-between p-4 bg-success/10 border border-success rounded-lg">
              <div>
                <p>Job Started</p>
                  <p className="text-muted-foreground">{jobStartTime?.toLocaleTimeString()}</p>
              </div>
              <Badge className="bg-success text-success-foreground">Active</Badge>
            </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted/50 border border-muted rounded-lg">
                <div>
                  <p>Job Status</p>
                  <p className="text-muted-foreground">Not Started</p>
                </div>
                <Badge variant="secondary">Inactive</Badge>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>Elapsed Time</span>
              <span>{jobStarted ? "2h 45m" : "0h 0m"}</span>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={jobStarted ? handleEndJob : handleStartJob}
              >
                {jobStarted ? "End Job" : "Start Job"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowAddBreakDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Break
            </Button>
            </div>
            <p className="text-muted-foreground text-center">
              Complete all checklist items to end job
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleSaveProgress}>Save Progress</Button>
          <Button className="flex-1" disabled>
            Complete Installation
          </Button>
        </div>

        {/* Job Details Dialog */}
        <Dialog open={showJobDetailsDialog} onOpenChange={setShowJobDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Job Details - Smith Residence
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Job ID</Label>
                  <p className="text-lg">#INST-2024-001</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className="bg-success text-success-foreground">In Progress</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p>123 Solar Street, Brisbane QLD 4000</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                  <p>John Smith</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+61 412 345 678</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p>john.smith@email.com</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Start Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>8:00 AM</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Expected Duration</Label>
                  <p>6-8 hours</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Installation Team</Label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>John Davis (Lead), Mike Chen (Technician)</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">System Specifications</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <ul className="space-y-1 text-sm">
                    <li>• 6.6kW Solar System</li>
                    <li>• 20 x 330W Monocrystalline Panels</li>
                    <li>• 5kW Inverter</li>
                    <li>• 6.6kW Battery Storage</li>
                    <li>• 25-year Panel Warranty</li>
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Checklist Item Dialog */}
        <Dialog open={showChecklistItemDialog} onOpenChange={setShowChecklistItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                {selectedChecklistItem?.item}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Status:</Label>
                <Badge className={selectedChecklistItem?.checked ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                  {selectedChecklistItem?.checked ? "Completed" : "Pending"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category:</Label>
                <p>{selectedChecklistItem?.category}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description:</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedChecklistItem?.category === "Pre-Installation" && "Complete all pre-installation safety and preparation tasks before beginning work."}
                  {selectedChecklistItem?.category === "Installation" && "Install solar panels, mounting systems, and electrical components according to specifications."}
                  {selectedChecklistItem?.category === "Electrical" && "Complete all electrical connections, testing, and commissioning procedures."}
                  {selectedChecklistItem?.category === "Handover" && "Provide customer with system documentation, training, and handover materials."}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Estimated Time:</Label>
                <p>15-30 minutes</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Notes:</Label>
                <Textarea placeholder="Add any notes or observations..." rows={3} />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Photo Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                {selectedPhoto?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Photo placeholder</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description:</Label>
                <p>{selectedPhoto?.description}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status:</Label>
                <Badge className={selectedPhoto?.status === "Completed" ? "bg-success text-success-foreground" : selectedPhoto?.status === "In Progress" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"}>
                  {selectedPhoto?.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Timestamp:</Label>
                <p>{selectedPhoto?.timestamp}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Expense Dialog */}
        <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {selectedExpense?.item}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount:</Label>
                <p className="text-2xl font-bold">${selectedExpense?.amount}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description:</Label>
                <p>{selectedExpense?.description}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category:</Label>
                <Badge variant="outline">{selectedExpense?.category}</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date:</Label>
                <p>{selectedExpense?.date}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Receipt Status:</Label>
                <div className="flex items-center gap-2">
                  {selectedExpense?.receipt ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Receipt attached</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-600">Receipt required</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleViewReceipt}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Receipt
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleEditExpense}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Handover Pack Dialog */}
        <Dialog open={showHandoverDialog} onOpenChange={setShowHandoverDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Customer Handover Pack
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-4 font-medium">Handover Pack Contents:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">System operation manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Product warranties</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Electrical compliance certificate</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">System monitoring app guide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Maintenance recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Contact information for support</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer Notes:</Label>
                  <Textarea placeholder="Any special instructions or notes for the customer..." rows={4} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handlePreviewPack}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Pack
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleDownloadPdf}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Time Tracking Dialog */}
        <Dialog open={showTimeTrackingDialog} onOpenChange={setShowTimeTrackingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time Tracking Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-success/10 border border-success rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Job Started</p>
                    <p className="text-muted-foreground">8:00 AM</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">Active</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Elapsed Time:</span>
                  <span className="text-2xl font-bold">2h 45m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expected Duration:</span>
                  <span>6-8 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Completion:</span>
                  <span>2:00 PM</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Break Times:</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Morning Break</span>
                    <span className="text-sm">10:00 AM - 10:15 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Lunch Break</span>
                    <span className="text-sm">12:00 PM - 12:30 PM</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={jobStarted ? handleEndJob : handleStartJob}>
                  <Clock className="w-4 h-4 mr-2" />
                  {jobStarted ? "End Job" : "Start Job"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddBreakDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Break
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Receipt Dialog */}
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                View Receipt
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Receipt Image</p>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Receipt for {selectedExpense?.item} - ${selectedExpense?.amount}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Expense Dialog */}
        <Dialog open={showEditExpenseDialog} onOpenChange={setShowEditExpenseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Expense
              </DialogTitle>
            </DialogHeader>
            {editingExpense && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={editingExpense.item}
                    onChange={(e) => handleEditExpenseInputChange("item", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input 
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) => handleEditExpenseInputChange("amount", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input 
                    value={editingExpense.category}
                    onChange={(e) => handleEditExpenseInputChange("category", e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditExpenseDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleUpdateExpense}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Break Dialog */}
        <Dialog open={showAddBreakDialog} onOpenChange={setShowAddBreakDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Break
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Break Type</Label>
                <Input 
                  placeholder="e.g., Lunch, Coffee, Personal"
                  value={newBreak.type}
                  onChange={(e) => handleBreakInputChange("type", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time"
                  value={newBreak.startTime}
                  onChange={(e) => handleBreakInputChange("startTime", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time"
                  value={newBreak.endTime}
                  onChange={(e) => handleBreakInputChange("endTime", e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddBreakDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddBreak}>
                  Add Break
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Photo Capture Dialog */}
        <Dialog open={showPhotoCaptureDialog} onOpenChange={setShowPhotoCaptureDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photo Captured
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Photo captured successfully!</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPhotoCaptureDialog(false)}>
                  Close
                </Button>
                <Button className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Handover Pack Preview Dialog */}
        <Dialog open={showHandoverPreviewDialog} onOpenChange={setShowHandoverPreviewDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Handover Pack Preview
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-4 font-medium">Preview of Customer Handover Pack:</h4>
                <div className="space-y-2">
                  <p className="text-sm">📋 System operation manual</p>
                  <p className="text-sm">📄 Product warranties</p>
                  <p className="text-sm">⚡ Electrical compliance certificate</p>
                  <p className="text-sm">📱 System monitoring app guide</p>
                  <p className="text-sm">🔧 Maintenance recommendations</p>
                  <p className="text-sm">📞 Contact information for support</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This is a preview of the handover pack that will be provided to the customer.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowHandoverPreviewDialog(false)}>
                  Close
                </Button>
                <Button className="flex-1" onClick={handleDownloadPdf}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
