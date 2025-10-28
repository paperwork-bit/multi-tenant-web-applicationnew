import React, { useState } from "react";
import { KPICard } from "../KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FileUploader } from "../FileUploader";
import { Briefcase, Calendar, Clock, Upload, CheckCircle, AlertCircle } from "lucide-react";

export function SubcontractorDashboard() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const myJobs = [
    { id: 1, project: "Smith Residence Install", address: "123 Solar Street, Brisbane", date: "Oct 20, 8:00 AM", status: "scheduled", duration: "4 hours" },
    { id: 2, project: "Davis Home Install", address: "789 Energy Road, Gold Coast", date: "Oct 22, 9:00 AM", status: "scheduled", duration: "5 hours" },
    { id: 3, project: "Brown Warehouse", address: "456 Commercial Ave, Brisbane", date: "Oct 15, 7:00 AM", status: "completed", duration: "8 hours" },
  ];

  const upcomingSlots = [
    { date: "Oct 18", slots: ["8:00 AM", "1:00 PM"] },
    { date: "Oct 19", slots: ["9:00 AM"] },
    { date: "Oct 21", slots: ["7:00 AM", "2:00 PM"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Subcontractor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your installation jobs.</p>
        </div>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Jobs"
          value="24"
          change="+3 this month"
          icon={Briefcase}
          trend="up"
        />
        <KPICard
          title="Scheduled Jobs"
          value="8"
          change="Next 2 weeks"
          icon={Calendar}
          trend="neutral"
        />
        <KPICard
          title="Completed Jobs"
          value="16"
          change="This month"
          icon={CheckCircle}
          trend="up"
        />
      </div>

      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input placeholder="e.g., Johnson Residence Install" />
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site-inspection">Site Inspection</SelectItem>
                    <SelectItem value="stage-1">Stage 1</SelectItem>
                    <SelectItem value="stage-2">Stage 2</SelectItem>
                    <SelectItem value="full-system">Full System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input placeholder="John Johnson" />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input placeholder="+61 412 345 678" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Property Address</Label>
              <Input placeholder="123 Main Street, Brisbane QLD 4000" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8am">8:00 AM</SelectItem>
                    <SelectItem value="9am">9:00 AM</SelectItem>
                    <SelectItem value="1pm">1:00 PM</SelectItem>
                    <SelectItem value="2pm">2:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (hours)</Label>
                <Input type="number" placeholder="4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea placeholder="Describe the installation requirements..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label>Documents</Label>
              <FileUploader accept=".pdf,.doc,.docx,.jpg,.png" maxFiles={5} />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">Submit Job</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowUploadForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4>{job.project}</h4>
                      <p className="text-muted-foreground">{job.address}</p>
                    </div>
                    <Badge
                      className={
                        job.status === "completed"
                          ? "bg-success text-success-foreground"
                          : job.status === "scheduled"
                          ? "bg-primary text-primary-foreground"
                          : "bg-warning text-warning-foreground"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{job.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <p>Availability Tips</p>
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Book jobs in advance</li>
                    <li>• Unavailable slots are greyed out</li>
                    <li>• You can reschedule 48hrs before</li>
                  </ul>
                </div>
                <div className="p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <p>Job Completion</p>
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Take photos of completed work</li>
                    <li>• Upload all documentation</li>
                    <li>• Get customer sign-off</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSlots.map((slot, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <p className="mb-2">{slot.date}</p>
                    <div className="flex flex-wrap gap-2">
                      {slot.slots.map((time, i) => (
                        <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
