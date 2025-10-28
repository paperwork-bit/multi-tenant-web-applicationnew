import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Upload, FileText, X, Eye, Download, Calendar, DollarSign, Users, Clock, AlertCircle, Info } from "lucide-react";

export function RebateComplianceScreen() {
  
  // Dialog states
  const [showStepDetails, setShowStepDetails] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRebateDetails, setShowRebateDetails] = useState(false);
  const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  
  // Form states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [aiProgress, setAiProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { 
      id: 1, 
      title: "System Details", 
      completed: true,
      description: "Solar system specifications and equipment details",
      completedDate: "Oct 10, 2025",
      completedBy: "John Davis"
    },
    { 
      id: 2, 
      title: "Customer Information", 
      completed: true,
      description: "Customer contact details and property information",
      completedDate: "Oct 11, 2025",
      completedBy: "Sarah Chen"
    },
    { 
      id: 3, 
      title: "Installation Details", 
      completed: false,
      description: "Installation date, CES number, and technical specifications",
      estimatedCompletion: "Oct 16, 2025"
    },
    { 
      id: 4, 
      title: "Document Upload", 
      completed: false,
      description: "Required certificates and compliance documents",
      estimatedCompletion: "Oct 17, 2025"
    },
    { 
      id: 5, 
      title: "Review & Submit", 
      completed: false,
      description: "Final review and submission to regulatory body",
      estimatedCompletion: "Oct 18, 2025"
    },
  ];

  const documents = [
    { 
      id: 1,
      name: "Installation Certificate", 
      uploaded: true, 
      required: true,
      uploadDate: "Oct 10, 2025",
      uploadedBy: "John Davis",
      fileSize: "2.4 MB",
      fileType: "PDF",
      description: "Certificate confirming proper installation of solar system"
    },
    { 
      id: 2,
      name: "Electrical Compliance Certificate", 
      uploaded: true, 
      required: true,
      uploadDate: "Oct 10, 2025",
      uploadedBy: "Mike Thompson",
      fileSize: "1.8 MB",
      fileType: "PDF",
      description: "Electrical safety and compliance certification"
    },
    { 
      id: 3,
      name: "Product Specifications", 
      uploaded: false, 
      required: true,
      description: "Detailed specifications of solar panels and inverter"
    },
    { 
      id: 4,
      name: "System Design", 
      uploaded: false, 
      required: true,
      description: "Technical drawings and system layout"
    },
    { 
      id: 5,
      name: "Customer ID (Driver's License)", 
      uploaded: true, 
      required: true,
      uploadDate: "Oct 9, 2025",
      uploadedBy: "Sarah Smith",
      fileSize: "0.8 MB",
      fileType: "JPG",
      description: "Customer identification document"
    },
    { 
      id: 6,
      name: "Proof of Property Ownership", 
      uploaded: false, 
      required: true,
      description: "Property title or ownership documentation"
    },
  ];

  const rebateApplications = [
    { 
      id: 1, 
      project: "Sample Project", 
      type: "STC", 
      amount: "$4,200", 
      status: "approved", 
      date: "Oct 10",
      customerName: "Sarah Smith",
      systemSize: "6.4kW",
      certificates: 84,
      submittedBy: "John Davis",
      approvedDate: "Oct 12, 2025"
    },
    { 
      id: 2, 
      project: "Sample Project 2", 
      type: "LGC", 
      amount: "$12,500", 
      status: "in-review", 
      date: "Oct 12",
      customerName: "Michael Brown",
      systemSize: "20kW",
      certificates: 156,
      submittedBy: "Mike Thompson",
      reviewStarted: "Oct 13, 2025"
    },
    { 
      id: 3, 
      project: "Sample Project 3", 
      type: "STC", 
      amount: "$3,800", 
      status: "draft", 
      date: "Oct 14",
      customerName: "Emily Davis",
      systemSize: "4kW",
      certificates: 62,
      draftedBy: "Sarah Chen"
    },
    { 
      id: 4, 
      project: "Martinez Property", 
      type: "State Rebate", 
      amount: "$2,500", 
      status: "submitted", 
      date: "Oct 13",
      customerName: "Maria Martinez",
      systemSize: "5kW",
      submittedBy: "Tom Wilson",
      submittedDate: "Oct 14, 2025"
    },
  ];

  // Handler functions
  const handleStepClick = (step) => {
    setSelectedStep(step);
    setShowStepDetails(true);
  };

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setShowDocumentDialog(true);
  };

  const handleUploadClick = (document) => {
    setSelectedDocument(document);
    setShowUploadDialog(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Simulate upload process
      setTimeout(() => {
        setShowUploadDialog(false);
        setUploadedFile(null);
        alert("File uploaded successfully!");
      }, 2000);
    }
  };

  const handleAIGenerate = () => {
    setShowAIDialog(true);
    setAiProgress(0);
    
    // Simulate AI processing
    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowAIDialog(false);
            alert("AI draft generated successfully!");
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
    setShowApplicationDetails(true);
  };

  const handlePreviewSubmission = () => {
    setShowPreviewDialog(true);
  };

  const handleRequestReview = () => {
    setShowReviewDialog(true);
  };

  const handleSubmitReview = () => {
    setShowReviewDialog(false);
    alert("Review request submitted successfully!");
  };

  const handleBackToList = () => {
    setShowBackDialog(true);
  };

  const handleSaveDraft = () => {
    setShowDraftDialog(true);
  };

  const handleDraftSave = () => {
    setShowDraftDialog(false);
    alert("Draft saved successfully!");
  };

  const handleDownloadPDF = () => {
    // Create PDF content
    const pdfContent = `
STC CLAIM - SMITH RESIDENCE
Project #4523 • 6.4kW Solar System

PROJECT INFORMATION
==================
Project Name: [Project Name]
System Size: 6.4 kW
Installation Date: 15/10/2025
Number of Panels: 16
Panel Wattage: 400W
Inverter Model: Fronius Primo 6.0
Installer License: A123456

CUSTOMER INFORMATION
===================
Customer Name: Sarah Smith
Property Address: 789 Oak St, Brisbane QLD 4000
Installation Zone: Zone 4 (Melbourne)

REBATE CALCULATION
=================
Rebate Type: STC (Small-scale Technology Certificates)
Estimated STCs: 84 certificates
Current STC Price: $36.50/STC
Deeming Period: 15 years
Market Trend: +2.5%

TOTAL ESTIMATED VALUE: $3,066

SUBMISSION SUMMARY
=================
This application will be submitted to the Clean Energy Regulator for processing.
All information has been verified and is accurate as of the submission date.

Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
`;

    // Create and download the file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'STC_Claim_Smith_Residence.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert("PDF preview downloaded successfully! (Note: This is a text file for demonstration purposes)");
  };

  const handleViewDocument = (document) => {
    if (!document.uploaded) {
      alert("Document not uploaded yet!");
      return;
    }

    // Create mock document content based on document type
    let documentContent = "";
    
    if (document.fileType === "PDF") {
      documentContent = `
${document.name.toUpperCase()}
${"=".repeat(document.name.length)}

Document Type: ${document.name}
File Size: ${document.fileSize}
Upload Date: ${document.uploadDate}
Uploaded By: ${document.uploadedBy}

DOCUMENT CONTENT:
This is a mock ${document.name} document for demonstration purposes.
In a real application, this would display the actual document content.

Certificate Details:
- Installation completed on ${document.uploadDate}
- Verified by ${document.uploadedBy}
- Meets all regulatory requirements
- Valid for rebate submission

Generated for: [Project Name]
Project #4523 • 6.4kW Solar System
`;
    } else if (document.fileType === "JPG") {
      alert(`Viewing ${document.name} (${document.fileType} - ${document.fileSize})\n\nThis would normally open an image viewer to display the customer ID document.`);
      return;
    }

    // Create a new window to display the document
    const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    newWindow.document.write(`
      <html>
        <head>
          <title>${document.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            h1 { color: #333; border-bottom: 2px solid #333; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>Document Viewer - ${document.name}</h1>
          <pre>${documentContent}</pre>
          <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px; background: #007cba; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  const handleDownloadDocument = (document) => {
    if (!document.uploaded) {
      alert("Document not uploaded yet!");
      return;
    }

    // Create mock document content
    let documentContent = "";
    let fileName = "";
    let mimeType = "text/plain";

    if (document.fileType === "PDF") {
      documentContent = `
${document.name.toUpperCase()}
${"=".repeat(document.name.length)}

Document Type: ${document.name}
File Size: ${document.fileSize}
Upload Date: ${document.uploadDate}
Uploaded By: ${document.uploadedBy}

CERTIFICATE DETAILS:
This certifies that the solar installation at [Property Address]
has been completed in accordance with all applicable standards
and regulations.

Installation Details:
- System Size: 6.4kW
- Number of Panels: 16
- Panel Wattage: 400W each
- Inverter: Fronius Primo 6.0
- Installation Date: 15/10/2025
- Installer License: A123456

This certificate is valid for rebate submission purposes.

Certified by: ${document.uploadedBy}
Date: ${document.uploadDate}
`;
      fileName = `${document.name.replace(/\s+/g, '_')}.txt`;
    } else if (document.fileType === "JPG") {
      // For image files, we'll create a text description
      documentContent = `Image Document: ${document.name}
File Type: ${document.fileType}
File Size: ${document.fileSize}
Upload Date: ${document.uploadDate}
Uploaded By: ${document.uploadedBy}

Note: This is a text representation of an image file.
In a real application, the actual image file would be downloaded.`;
      fileName = `${document.name.replace(/\s+/g, '_')}_info.txt`;
    }

    // Create and download the file
    const blob = new Blob([documentContent], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert(`${document.name} downloaded successfully!`);
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      alert(`Navigated to previous step: ${steps[newStep].title}\n\nStep ${newStep + 1} of ${steps.length}: ${steps[newStep].description}`);
    } else {
      alert("You are already at the first step!");
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      alert(`Navigated to next step: ${steps[newStep].title}\n\nStep ${newStep + 1} of ${steps.length}: ${steps[newStep].description}`);
    } else {
      alert("You are already at the last step! Ready to submit application.\n\nAll steps completed. You can now submit your rebate application.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h1>STC Claim - [Project Name]</h1>
            <p className="text-muted-foreground">Project #4523 • 6.4kW Solar System</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleAIGenerate}>
            <Sparkles className="w-4 h-4 mr-2" />
            Draft with AI
          </Button>
          <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors" onClick={() => handleStepClick(step)}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed
                        ? "bg-success text-success-foreground"
                        : index === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                  </div>
                  <div>
                    <p>{step.title}</p>
                    <p className="text-muted-foreground">
                      {step.completed ? "Complete" : step.id === currentStep ? "In Progress" : "Pending"}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${step.completed ? "bg-success" : "bg-border"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <Progress value={(steps.filter((s) => s.completed).length / steps.length) * 100} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Installation Date</Label>
                  <Input type="date" defaultValue="2025-10-15" />
                </div>
                <div className="space-y-2">
                  <Label>System Size (kW)</Label>
                  <Input type="number" defaultValue="6.4" />
                </div>
                <div className="space-y-2">
                  <Label>Number of Panels</Label>
                  <Input type="number" defaultValue="16" />
                </div>
                <div className="space-y-2">
                  <Label>Panel Wattage</Label>
                  <Input type="number" defaultValue="400" />
                </div>
                <div className="space-y-2">
                  <Label>Inverter Model</Label>
                  <Input defaultValue="Fronius Primo 6.0" />
                </div>
                <div className="space-y-2">
                  <Label>Installer License</Label>
                  <Input defaultValue="A123456" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>CES Number</Label>
                <Input placeholder="Enter CES number..." />
              </div>

              <div className="space-y-2">
                <Label>Deeming Period</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" />
                  <Input type="date" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleDocumentClick(doc)}>
                    <div className="flex items-center gap-3">
                      <Checkbox checked={doc.uploaded} />
                      <div>
                        <p>{doc.name}</p>
                        {doc.required && <Badge variant="outline">Required</Badge>}
                      </div>
                    </div>
                    {doc.uploaded ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleUploadClick(doc);
                      }}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Assisted Draft</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="mb-2">AI can help you:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Auto-fill forms based on project data</li>
                      <li>Verify compliance requirements</li>
                      <li>Check for missing documents</li>
                      <li>Generate submission summary</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={handleAIGenerate}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Draft with AI
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowRebateDetails(true)}>
            <CardHeader>
              <CardTitle>Rebate Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rebate Type</span>
                <Badge>STC</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated STCs</span>
                <span>84 certificates</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current STC Price</span>
                <span>$36.50/STC</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Estimated Value</span>
                <span>$3,066</span>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowWorkflowDetails(true)}>
            <CardHeader>
              <CardTitle>Workflow Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Draft Created</span>
                </div>
                <span className="text-muted-foreground">Oct 14</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-primary" />
                  <span>Human Review</span>
                </div>
                <Badge variant="outline" className="bg-primary text-primary-foreground">
                  Current
                </Badge>
              </div>
              <div className="flex items-center justify-between opacity-50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  <span>Submit to REC</span>
                </div>
                <span className="text-muted-foreground">Pending</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handlePreviewSubmission}>
                <FileText className="w-4 h-4 mr-2" />
                Preview Submission
              </Button>
              <Button variant="outline" className="w-full" onClick={handleRequestReview}>Request Review</Button>
              <Button className="w-full" disabled>
                Submit Application
              </Button>
              <p className="text-muted-foreground text-center mt-2">
                Complete all required fields to submit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rebateApplications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleApplicationClick(app)}>
                  <div className="flex items-center justify-between mb-2">
                    <p>{app.project}</p>
                    <Badge
                      variant={
                        app.status === "approved"
                          ? "default"
                          : app.status === "in-review"
                          ? "outline"
                          : "secondary"
                      }
                      className={
                        app.status === "approved"
                          ? "bg-success text-success-foreground"
                          : app.status === "in-review"
                          ? "bg-warning text-warning-foreground"
                          : ""
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{app.type}</span>
                    <span>{app.amount}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" disabled={currentStep === 0} onClick={handlePreviousStep}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Step
        </Button>
        <Button onClick={handleNextStep}>
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Step Details Dialog */}
      <Dialog open={showStepDetails} onOpenChange={setShowStepDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Step Details</span>
              <Button variant="ghost" size="sm" onClick={() => setShowStepDetails(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedStep && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedStep.completed ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
                }`}>
                  {selectedStep.completed ? <CheckCircle2 className="w-6 h-6" /> : selectedStep.id}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedStep.title}</h3>
                  <p className="text-muted-foreground">{selectedStep.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge variant={selectedStep.completed ? "default" : "outline"} className={selectedStep.completed ? "bg-success text-success-foreground" : ""}>
                    {selectedStep.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                
                {selectedStep.completed ? (
                  <>
                    <div className="space-y-2">
                      <Label>Completed Date</Label>
                      <p>{selectedStep.completedDate}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Completed By</Label>
                      <p>{selectedStep.completedBy}</p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label>Estimated Completion</Label>
                    <p>{selectedStep.estimatedCompletion}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Details Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Document Details</span>
              <Button variant="ghost" size="sm" onClick={() => setShowDocumentDialog(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedDocument.name}</h3>
                  <p className="text-muted-foreground">{selectedDocument.description}</p>
                </div>
                <Badge variant={selectedDocument.required ? "destructive" : "outline"}>
                  {selectedDocument.required ? "Required" : "Optional"}
                </Badge>
              </div>
              
              {selectedDocument.uploaded ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Upload Date</Label>
                    <p>{selectedDocument.uploadDate}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Uploaded By</Label>
                    <p>{selectedDocument.uploadedBy}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>File Size</Label>
                    <p>{selectedDocument.fileSize}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>File Type</Label>
                    <p>{selectedDocument.fileType}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-muted-foreground">This document has not been uploaded yet.</p>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                {selectedDocument.uploaded ? (
                  <>
                    <Button variant="outline" onClick={() => handleViewDocument(selectedDocument)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Document
                    </Button>
                    <Button variant="outline" onClick={() => handleDownloadDocument(selectedDocument)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => {
                    setShowDocumentDialog(false);
                    handleUploadClick(selectedDocument);
                  }}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedDocument.name}</h3>
                <p className="text-muted-foreground text-sm">{selectedDocument.description}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Select File</Label>
                <Input type="file" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
              </div>
              
              {uploadedFile && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">Uploading: {uploadedFile.name}</p>
                  <Progress value={50} className="mt-2" />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Generation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Draft Generation
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground">AI is analyzing your project data and generating the rebate application draft...</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{aiProgress}%</span>
              </div>
              <Progress value={aiProgress} />
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Analyzing system specifications</p>
              <p>✓ Validating customer information</p>
              <p>✓ Calculating rebate eligibility</p>
              <p>✓ Generating compliance documentation</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rebate Details Dialog */}
      <Dialog open={showRebateDetails} onOpenChange={setShowRebateDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Rebate Summary Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* System Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">System Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Rebate Type</Label>
                      <div>
                        <Badge className="text-xs px-3 py-1">STC</Badge>
                        <p className="text-sm text-muted-foreground mt-1">Small-scale Technology Certificates</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Installation Zone</Label>
                      <p className="text-base font-semibold">Zone 4 (Melbourne)</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">System Size</Label>
                      <p className="text-base font-semibold">6.4 kW</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Deeming Period</Label>
                      <p className="text-base font-semibold">15 years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Certificate Details</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Estimated STCs</Label>
                      <p className="text-2xl font-bold text-primary">84 certificates</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Market Trend</Label>
                      <Badge variant="outline" className="bg-success/10 text-success text-sm px-3 py-1">↗ +2.5%</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Current STC Price</Label>
                      <p className="text-lg font-semibold">$36.50/STC</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Estimated Value</Label>
                      <p className="text-3xl font-bold text-success">$3,066</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Important Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• STC prices fluctuate based on market conditions</li>
                <li>• Final value depends on REC registry approval</li>
                <li>• Certificates are typically processed within 5-10 business days</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Workflow Details Dialog */}
      <Dialog open={showWorkflowDetails} onOpenChange={setShowWorkflowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Workflow Status Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  <div>
                    <p className="font-medium">Draft Created</p>
                    <p className="text-sm text-muted-foreground">Initial application draft completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">Oct 14, 2025</p>
                  <p className="text-xs text-muted-foreground">by John Davis</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary/20" />
                  <div>
                    <p className="font-medium">Human Review</p>
                    <p className="text-sm text-muted-foreground">Technical review and validation in progress</p>
                  </div>
                </div>
                <Badge className="bg-primary text-primary-foreground">Current</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                  <div>
                    <p className="font-medium">Submit to REC</p>
                    <p className="text-sm text-muted-foreground">Final submission to regulatory body</p>
                  </div>
                </div>
                <p className="text-muted-foreground">Pending</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Next Steps</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete technical review by Oct 16</li>
                <li>• Upload remaining required documents</li>
                <li>• Submit to REC registry for processing</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Submission Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Submission</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Project Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Project Name:</span>
                    <span>[Project Name]</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Size:</span>
                    <span>6.4 kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installation Date:</span>
                    <span>15/10/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installer License:</span>
                    <span>A123456</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Rebate Calculation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Estimated STCs:</span>
                    <span>84 certificates</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STC Price:</span>
                    <span>$36.50</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Value:</span>
                    <span>$3,066</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Submission Summary</h4>
              <p className="text-sm text-muted-foreground">
                This application will be submitted to the Clean Energy Regulator for processing. 
                Please ensure all information is accurate before final submission.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>Close</Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Review</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Review Notes (Optional)</Label>
              <Textarea 
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add any specific notes or concerns for the reviewer..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview}>Submit Review Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Details Dialog */}
      <Dialog open={showApplicationDetails} onOpenChange={setShowApplicationDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{selectedApplication.project}</h3>
                <Badge variant={
                  selectedApplication.status === "approved" ? "default" :
                  selectedApplication.status === "in-review" ? "outline" : "secondary"
                } className={
                  selectedApplication.status === "approved" ? "bg-success text-success-foreground" :
                  selectedApplication.status === "in-review" ? "bg-warning text-warning-foreground" : ""
                }>
                  {selectedApplication.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <p>{selectedApplication.customerName}</p>
                </div>
                <div className="space-y-2">
                  <Label>System Size</Label>
                  <p>{selectedApplication.systemSize}</p>
                </div>
                <div className="space-y-2">
                  <Label>Rebate Type</Label>
                  <p>{selectedApplication.type}</p>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <p className="font-semibold text-success">{selectedApplication.amount}</p>
                </div>
                <div className="space-y-2">
                  <Label>Certificates</Label>
                  <p>{selectedApplication.certificates}</p>
                </div>
                <div className="space-y-2">
                  <Label>Submitted By</Label>
                  <p>{selectedApplication.submittedBy}</p>
                </div>
              </div>
              
              {selectedApplication.status === "approved" && selectedApplication.approvedDate && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-success font-medium">✓ Approved on {selectedApplication.approvedDate}</p>
                </div>
              )}
              
              {selectedApplication.status === "in-review" && selectedApplication.reviewStarted && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-warning font-medium">⏳ Review started on {selectedApplication.reviewStarted}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Back to List Dialog */}
      <Dialog open={showBackDialog} onOpenChange={setShowBackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return to Applications List</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium">Unsaved Changes</p>
                <p className="text-sm text-muted-foreground">You have unsaved changes that will be lost.</p>
              </div>
            </div>
            
            <p className="text-muted-foreground">Would you like to save your progress before returning to the applications list?</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackDialog(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => {
              setShowBackDialog(false);
              alert("Returned to applications list without saving");
            }}>
              Don't Save
            </Button>
            <Button onClick={() => {
              setShowBackDialog(false);
              alert("Changes saved and returned to applications list");
            }}>
              Save & Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Draft Dialog */}
      <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Draft</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Info className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Draft will be saved</p>
                <p className="text-sm text-muted-foreground">You can continue working on this application later.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Draft Name (Optional)</Label>
              <Input placeholder="Enter a name for this draft..." />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDraftDialog(false)}>Cancel</Button>
            <Button onClick={handleDraftSave}>Save Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
