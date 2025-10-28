import React, { useState } from "react";
import { KPICard } from "../KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { FileUploader } from "../FileUploader";
import { ClipboardCheck, Clock, CheckCircle2, AlertCircle, Upload, FileCheck, Phone, Mail, MapPin } from "lucide-react";

export function InspectorDashboard() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [inspectionDialog, setInspectionDialog] = useState(false);

  const pendingJobs = [
    { 
      id: 1, 
      project: "Smith Residence", 
      address: "123 Solar Street, Brisbane QLD 4000",
      customer: "John Smith",
      phone: "+61 412 345 678",
      email: "john.smith@email.com",
      systemSize: "6.4 kW",
      completedDate: "Oct 15, 2025",
      status: "pending-inspection",
      priority: "high"
    },
    { 
      id: 2, 
      project: "Brown Warehouse", 
      address: "456 Commercial Ave, Brisbane QLD 4000",
      customer: "Brown Industries",
      phone: "+61 412 555 888",
      email: "contact@brownindustries.com",
      systemSize: "25 kW",
      completedDate: "Oct 12, 2025",
      status: "pending-inspection",
      priority: "medium"
    },
  ];

  const completedInspections = [
    { id: 3, project: "Davis Home", address: "789 Energy Road, Gold Coast", status: "approved", date: "Oct 10, 2025" },
    { id: 4, project: "Martinez Property", address: "321 Solar Avenue, Brisbane", status: "approved", date: "Oct 8, 2025" },
  ];

  const handleInspect = (job: any) => {
    setSelectedJob(job);
    setInspectionDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Inspector Dashboard</h1>
        <p className="text-muted-foreground">Review and approve installation projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Pending Inspections"
          value={pendingJobs.length.toString()}
          change="Awaiting review"
          icon={Clock}
          trend="neutral"
        />
        <KPICard
          title="Inspections This Month"
          value="18"
          change="+6 from last month"
          icon={ClipboardCheck}
          trend="up"
        />
        <KPICard
          title="Approved Projects"
          value="16"
          change="89% approval rate"
          icon={CheckCircle2}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pending Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{job.project}</h4>
                        <Badge 
                          variant="outline"
                          className={job.priority === "high" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"}
                        >
                          {job.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{job.address}</p>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{job.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{job.email}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-warning text-warning-foreground">
                      Pending
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p>{job.customer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">System Size</p>
                      <p>{job.systemSize}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p>{job.completedDate}</p>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => handleInspect(job)}>
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Start Inspection
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Approved</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>16 projects</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Issues Found</span>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span>2 projects</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. Review Time</span>
                <span>2.5 days</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedInspections.map((inspection) => (
                  <div key={inspection.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p>{inspection.project}</p>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-muted-foreground">{inspection.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inspection Dialog */}
      <Dialog open={inspectionDialog} onOpenChange={setInspectionDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inspection: {selectedJob?.project}</DialogTitle>
            <DialogDescription>
              Review project details and complete the inspection checklist
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p>{selectedJob.customer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">System Size</p>
                      <p>{selectedJob.systemSize}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p>{selectedJob.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p>{selectedJob.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <p>{selectedJob.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Inspection Status</Label>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-success hover:bg-success/90">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Report Issues
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Issues or Notes</Label>
                <Textarea 
                  placeholder="Describe any issues found or add inspection notes..." 
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Checklist</Label>
                <div className="space-y-2 p-4 border rounded-lg">
                  {[
                    "Panel installation meets standards",
                    "Electrical connections secure",
                    "Inverter properly configured",
                    "Safety switches functional",
                    "Documentation complete"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="checkbox" id={`check-${idx}`} className="rounded" />
                      <label htmlFor={`check-${idx}`}>{item}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Certificate (if approved)</Label>
                <FileUploader accept=".pdf" maxFiles={1} />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Inspection
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setInspectionDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
