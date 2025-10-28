import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { FileCheck, Upload, Download, Send, CheckCircle2, AlertCircle, Clock, X, Eye, Phone, MapPin, Calendar, User, FileText } from "lucide-react";

export function InspectionScreen() {
  // State variables for dialogs
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showStepDetails, setShowStepDetails] = useState(false);
  const [showConnectionTracker, setShowConnectionTracker] = useState(false);
  const [showSTCDialog, setShowSTCDialog] = useState(false);
  const [showQuickActionDialog, setShowQuickActionDialog] = useState(false);
  const [showSubmitGridDialog, setShowSubmitGridDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Selected items
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedQuickAction, setSelectedQuickAction] = useState("");
  
  // Form data
  const [gridForm, setGridForm] = useState({
    networkProvider: "energex",
    nmiNumber: "",
    meterNumber: ""
  });

  const projects = [
    { 
      id: 1, 
      name: "[Project Name]", 
      address: "123 Solar Street, Melbourne VIC 3000", 
      status: "pending-inspection", 
      inspector: null,
      customerName: "[Customer Name]",
      customerPhone: "+61 400 123 456",
      customerEmail: "john.smith@email.com",
      systemSize: "[System Size]",
      installationDate: "[Installation Date]",
      projectId: "[Project ID]",
      priority: "Standard"
    },
    { 
      id: 2, 
      name: "Brown Warehouse", 
      address: "456 Commercial Ave, Sydney NSW 2000", 
      status: "inspection-scheduled", 
      inspector: "Mike Thompson",
      customerName: "Michael Brown",
      customerPhone: "+61 400 789 012",
      systemSize: "20 kW",
      projectId: "#4524",
      priority: "High"
    },
    { 
      id: 3, 
      name: "Davis Home", 
      address: "789 Energy Road, Brisbane QLD 4000", 
      status: "inspection-complete", 
      inspector: "Sarah Chen",
      customerName: "Emily Davis",
      customerPhone: "+61 400 555 123",
      systemSize: "4 kW",
      projectId: "#4522",
      priority: "Standard"
    },
  ];

  const inspectionSteps = [
    { 
      id: 1, 
      step: "Inspector Assignment", 
      status: "completed",
      description: "Qualified inspector has been assigned to the project",
      completedDate: "Oct 16, 2025",
      assignedTo: "Mike Thompson"
    },
    { 
      id: 2, 
      step: "CES Upload", 
      status: "completed",
      description: "Certificate of Electrical Safety has been uploaded and verified",
      completedDate: "Oct 16, 2025",
      assignedTo: "System Admin"
    },
    { 
      id: 3, 
      step: "Inspection Scheduled", 
      status: "current",
      description: "On-site inspection has been scheduled with the customer",
      scheduledDate: "Oct 18, 2025",
      assignedTo: "Mike Thompson"
    },
    { 
      id: 4, 
      step: "Inspection Complete", 
      status: "pending",
      description: "Physical inspection of the solar installation",
      estimatedDate: "Oct 18, 2025",
      assignedTo: "Mike Thompson"
    },
    { 
      id: 5, 
      step: "Grid Connection Submitted", 
      status: "pending",
      description: "Application submitted to network provider for grid connection",
      estimatedDate: "Oct 19, 2025",
      assignedTo: "Project Manager"
    },
    { 
      id: 6, 
      step: "STC Pack Generated", 
      status: "pending",
      description: "Small-scale Technology Certificate pack generated for rebate claim",
      estimatedDate: "Oct 20, 2025",
      assignedTo: "System Admin"
    },
  ];

  // Handler functions
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleStepClick = (step) => {
    setSelectedStep(step);
    setShowStepDetails(true);
  };

  const handleSubmitGridConnection = () => {
    setShowSubmitGridDialog(true);
  };

  const handleScheduleInspection = () => {
    alert("Inspection scheduled successfully!");
  };

  const handleCESUpload = () => {
    setShowUploadDialog(true);
  };

  const handleCESDownload = () => {
    const cesContent = `
CERTIFICATE OF ELECTRICAL SAFETY
================================

Certificate Number: CES2025004523
Project: [Project Name]
System Size: 6.4kW
Installation Date: October 15, 2025

ELECTRICAL DETAILS:
- Inverter: Fronius Primo 6.0
- AC Isolator: Installed and labeled
- DC Isolator: Installed and labeled
- Earthing: Compliant with AS/NZS 5033
- Wiring: Compliant with AS/NZS 3000

SAFETY COMPLIANCE:
✓ All electrical work completed to Australian Standards
✓ System tested and commissioned
✓ Safety switches operational
✓ Labeling complete and compliant

Electrician: John Electrician
License: A123456
Date: October 16, 2025

This certificate confirms the electrical installation is safe and compliant.
`;

    const blob = new Blob([cesContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CES-2025-4523.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert("CES Certificate downloaded successfully!");
  };

  const handleConnectionTrackerClick = () => {
    setShowConnectionTracker(true);
  };

  const handleSTCGeneratorClick = () => {
    setShowSTCDialog(true);
  };

  const handleQuickAction = (action) => {
    setSelectedQuickAction(action);
    setShowQuickActionDialog(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setShowUploadDialog(false);
      alert(`File "${file.name}" uploaded successfully!`);
    }
  };

  const handleGridSubmit = () => {
    setShowSubmitGridDialog(false);
    alert("Grid connection application submitted successfully to " + gridForm.networkProvider + "!");
  };

  const handleGridFormChange = (field, value) => {
    setGridForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inspection & Grid Connection</h1>
          <p className="text-gray-600">Manage inspections and grid connections</p>
        </div>
        <Button onClick={handleSubmitGridConnection}>
          <Send className="w-4 h-4 mr-2" />
          Submit Grid Connection
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleProjectClick(projects[0])}>
            <CardHeader>
              <CardTitle>Project: [Project Name]</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Project ID</p>
                  <p>[Project ID]</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Installation Date</p>
                  <p>[Installation Date]</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">System Size</p>
                  <p>[System Size]</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Customer</p>
                  <p>[Customer Name]</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4">Inspection Progress</h3>
                <div className="space-y-4">
                  {inspectionSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => handleStepClick(step)}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === "completed"
                            ? "bg-green-500 text-white"
                            : step.status === "current"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : step.status === "current" ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <div className="w-2 h-2 bg-current rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p>{step.step}</p>
                        <p className="text-gray-600">
                          {step.status === "completed"
                            ? "Complete"
                            : step.status === "current"
                            ? "In Progress"
                            : "Pending"}
                        </p>
                      </div>
                      {step.status === "completed" && (
                        <Badge className="bg-green-500 text-white">Done</Badge>
                      )}
                      {step.status === "current" && (
                        <Badge className="bg-blue-500 text-white">Active</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Progress value={33} />
                  <p className="text-gray-600 text-center mt-2">33% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inspector Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Assign Inspector</Label>
                <Select defaultValue="mt">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mt">Mike Thompson</SelectItem>
                    <SelectItem value="sc">Sarah Chen</SelectItem>
                    <SelectItem value="jd">John Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Inspection Date</Label>
                  <Input type="date" defaultValue="2025-10-18" />
                </div>
                <div className="space-y-2">
                  <Label>Inspection Time</Label>
                  <Input type="time" defaultValue="10:00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes for Inspector</Label>
                <Input placeholder="Any special instructions..." />
              </div>

              <Button className="w-full" onClick={handleScheduleInspection}>Schedule Inspection</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CES Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Certificate of Electrical Safety</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-2">Drag and drop CES file here</p>
                  <Button variant="outline" onClick={handleCESUpload}>Browse Files</Button>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p>CES-2025-4523.pdf</p>
                    <p className="text-gray-600">Uploaded Oct 16, 2025</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCESDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>CES Number</Label>
                <Input defaultValue="CES2025004523" />
              </div>

              <div className="space-y-2">
                <Label>Electrician License</Label>
                <Input defaultValue="A123456" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleConnectionTrackerClick}>
            <CardHeader>
              <CardTitle>Connection Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <p>Pending Submission</p>
                </div>
                <p className="text-gray-600">
                  Complete all requirements before submitting
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Application Status</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Not Submitted
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estimated Timeline</span>
                  <span>10-15 business days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Priority</span>
                  <Badge>Standard</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleSTCGeneratorClick}>
            <CardHeader>
              <CardTitle>STC Pack Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="mb-2">STC Pack Includes:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• CES Certificate</li>
                  <li>• Installation Declaration</li>
                  <li>• Product Specifications</li>
                  <li>• System Design</li>
                  <li>• Deeming Calculation</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estimated STCs</span>
                  <span>84 certificates</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Value</span>
                  <span>$3,066</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" disabled>
                <FileCheck className="w-4 h-4 mr-2" />
                Generate STC Pack
              </Button>
              <p className="text-gray-600 text-center">
                Available after inspection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => handleProjectClick(project)}>
                  <div className="flex items-center justify-between mb-2">
                    <p>{project.name}</p>
                    <Badge
                      variant={project.status === "inspection-complete" ? "default" : "outline"}
                      className={
                        project.status === "inspection-complete"
                          ? "bg-green-500 text-white"
                          : project.status === "inspection-scheduled"
                          ? "bg-blue-500 text-white"
                          : ""
                      }
                    >
                      {project.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{project.address}</p>
                  {project.inspector && (
                    <p className="text-gray-600">Inspector: {project.inspector}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" onClick={() => handleQuickAction("View Inspection History")}>View Inspection History</Button>
              <Button variant="outline" className="w-full" onClick={() => handleQuickAction("Download Reports")}>Download Reports</Button>
              <Button variant="outline" className="w-full" onClick={() => handleQuickAction("Contact Network Provider")}>Contact Network Provider</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Details - {selectedProject?.name}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Project ID</Label>
                    <p className="text-base font-semibold">{selectedProject.projectId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Customer Name</Label>
                    <p className="text-base font-semibold">{selectedProject.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-base font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {selectedProject.customerPhone}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">System Size</Label>
                    <p className="text-base font-semibold">{selectedProject.systemSize}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Installation Date</Label>
                    <p className="text-base font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {selectedProject.installationDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Priority</Label>
                    <Badge variant={selectedProject.priority === "High" ? "destructive" : "outline"}>
                      {selectedProject.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Address</Label>
                <p className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {selectedProject.address}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Inspector Assigned</Label>
                <p className="text-base font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {selectedProject.inspector || "Not assigned"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Status</Label>
                <Badge variant="outline" className="ml-2">
                  {selectedProject.status.replace("-", " ")}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProjectDetails(false)}>Close</Button>
            <Button onClick={() => {
              setShowProjectDetails(false);
              handleScheduleInspection();
            }}>Schedule Inspection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Details Dialog */}
      <Dialog open={showStepDetails} onOpenChange={setShowStepDetails}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Step Details - {selectedStep?.step}</DialogTitle>
          </DialogHeader>
          {selectedStep && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-base">{selectedStep.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge variant={selectedStep.status === "completed" ? "default" : selectedStep.status === "current" ? "secondary" : "outline"}>
                    {selectedStep.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Assigned To</Label>
                  <p className="text-base font-semibold">{selectedStep.assignedTo}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  {selectedStep.status === "completed" ? "Completed Date" : 
                   selectedStep.status === "current" ? "Scheduled Date" : "Estimated Date"}
                </Label>
                <p className="text-base font-semibold">
                  {selectedStep.completedDate || selectedStep.scheduledDate || selectedStep.estimatedDate}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStepDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Grid Connection Dialog */}
      <Dialog open={showSubmitGridDialog} onOpenChange={setShowSubmitGridDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Submit Grid Connection Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Network Provider</Label>
              <Select value={gridForm.networkProvider} onValueChange={(value) => handleGridFormChange("networkProvider", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energex">Energex</SelectItem>
                  <SelectItem value="ergon">Ergon Energy</SelectItem>
                  <SelectItem value="ausgrid">Ausgrid</SelectItem>
                  <SelectItem value="essential">Essential Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>NMI Number</Label>
              <Input 
                value={gridForm.nmiNumber} 
                onChange={(e) => handleGridFormChange("nmiNumber", e.target.value)}
                placeholder="Enter NMI number..."
              />
            </div>

            <div>
              <Label>Meter Number</Label>
              <Input 
                value={gridForm.meterNumber} 
                onChange={(e) => handleGridFormChange("meterNumber", e.target.value)}
                placeholder="Enter meter number..."
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Application Summary</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Project:</strong> [Project Name] (#4523)</p>
                <p><strong>System Size:</strong> 6.4 kW</p>
                <p><strong>Network Provider:</strong> {gridForm.networkProvider}</p>
                <p><strong>Estimated Processing:</strong> 10-15 business days</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitGridDialog(false)}>Cancel</Button>
            <Button onClick={handleGridSubmit}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connection Tracker Dialog */}
      <Dialog open={showConnectionTracker} onOpenChange={setShowConnectionTracker}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Connection Tracker Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <p className="font-semibold">Pending Submission</p>
              </div>
              <p className="text-gray-600">
                Complete all requirements before submitting to network provider
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Application Status</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Not Submitted</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Network Provider</span>
                <span className="font-semibold">Energex</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Estimated Timeline</span>
                <span className="font-semibold">10-15 business days</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Priority Level</span>
                <Badge>Standard</Badge>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Next Steps</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Complete inspection process</li>
                <li>• Upload missing inverter certificate</li>
                <li>• Submit grid connection application</li>
                <li>• Await network provider approval</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectionTracker(false)}>Close</Button>
            <Button onClick={() => {
              setShowConnectionTracker(false);
              setShowSubmitGridDialog(true);
            }}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* STC Generator Dialog */}
      <Dialog open={showSTCDialog} onOpenChange={setShowSTCDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>STC Pack Generator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">STC Pack Contents</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• CES Certificate</li>
                <li>• Installation Declaration</li>
                <li>• Product Specifications</li>
                <li>• System Design Documents</li>
                <li>• Deeming Calculation</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <Label className="text-sm font-medium text-gray-600">Estimated STCs</Label>
                <p className="text-2xl font-bold text-blue-600">84 certificates</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Label className="text-sm font-medium text-gray-600">Current Value</Label>
                <p className="text-2xl font-bold text-green-600">$3,066</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="font-semibold">Generation Requirements</p>
              </div>
              <p className="text-gray-600 text-sm">
                STC pack generation is available after successful inspection completion and grid connection approval.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">System Details</Label>
              <div className="text-sm space-y-1">
                <p><strong>Project:</strong> [Project Name] (#4523)</p>
                <p><strong>System Size:</strong> 6.4 kW</p>
                <p><strong>Installation Zone:</strong> Zone 4 (Melbourne)</p>
                <p><strong>Deeming Period:</strong> 15 years</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSTCDialog(false)}>Close</Button>
            <Button disabled>
              <FileCheck className="w-4 h-4 mr-2" />
              Generate STC Pack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Actions Dialog */}
      <Dialog open={showQuickActionDialog} onOpenChange={setShowQuickActionDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedQuickAction}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedQuickAction === "View Inspection History" && (
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">Davis Home Inspection</p>
                    <Badge className="bg-green-500 text-white">Completed</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">Inspector: Sarah Chen</p>
                  <p className="text-gray-600 text-sm">Date: Oct 12, 2025</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">Brown Warehouse Inspection</p>
                    <Badge className="bg-blue-500 text-white">Scheduled</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">Inspector: Mike Thompson</p>
                  <p className="text-gray-600 text-sm">Date: Oct 22, 2025</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">[Project Name] Inspection</p>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">Inspector: Not assigned</p>
                  <p className="text-gray-600 text-sm">Date: To be scheduled</p>
                </div>
              </div>
            )}

            {selectedQuickAction === "Download Reports" && (
              <div className="space-y-3">
                <p className="text-gray-600">Available reports for download:</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Inspection Summary Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Grid Connection Status Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    STC Generation Report
                  </Button>
                </div>
              </div>
            )}

            {selectedQuickAction === "Contact Network Provider" && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Energex Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Phone:</strong> 13 12 53</p>
                    <p><strong>Email:</strong> connections@energex.com.au</p>
                    <p><strong>Website:</strong> www.energex.com.au</p>
                    <p><strong>Business Hours:</strong> Mon-Fri 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div>
                  <Label>Message to Network Provider</Label>
                  <Textarea placeholder="Enter your message here..." rows={4} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuickActionDialog(false)}>Close</Button>
            {selectedQuickAction === "Contact Network Provider" && (
              <Button onClick={() => {
                setShowQuickActionDialog(false);
                alert("Message sent to network provider!");
              }}>Send Message</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload CES Certificate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">Select CES certificate file</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" onClick={() => document.getElementById('file-upload').click()}>
                Browse Files
              </Button>
            </div>
            <p className="text-gray-600 text-sm text-center">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}