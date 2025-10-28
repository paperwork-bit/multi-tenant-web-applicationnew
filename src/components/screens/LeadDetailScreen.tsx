import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Timeline } from "../Timeline";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, DollarSign, FileText, Send, Video } from "lucide-react";

export function LeadDetailScreen() {
  const timelineItems = [
    {
      id: "1",
      title: "Lead Created",
      description: "Initial inquiry from website contact form",
      date: "Oct 12, 2025 - 2:30 PM",
      status: "completed" as const,
      user: "System",
    },
    {
      id: "2",
      title: "First Contact",
      description: "Called customer to discuss solar requirements",
      date: "Oct 12, 2025 - 4:15 PM",
      status: "completed" as const,
      user: "John Davis",
    },
    {
      id: "3",
      title: "Qualification",
      description: "Verified property ownership and energy usage",
      date: "Oct 13, 2025 - 10:00 AM",
      status: "completed" as const,
      user: "John Davis",
    },
    {
      id: "4",
      title: "Site Visit Scheduled",
      description: "Appointment set for Oct 18, 2025",
      date: "Oct 14, 2025 - 2:00 PM",
      status: "current" as const,
      user: "Sarah Mitchell",
    },
    {
      id: "5",
      title: "Proposal",
      description: "Generate and send proposal",
      date: "Pending",
      status: "upcoming" as const,
    },
  ];

  const communications = [
    { id: 1, type: "email", subject: "Re: Solar Installation Quote", date: "Oct 14, 2:30 PM", from: "John Smith" },
    { id: 2, type: "call", subject: "Follow-up call - 15 minutes", date: "Oct 13, 4:15 PM", from: "You" },
    { id: 3, type: "note", subject: "Customer interested in battery storage", date: "Oct 13, 10:30 AM", from: "You" },
    { id: 4, type: "email", subject: "Initial inquiry about solar panels", date: "Oct 12, 2:30 PM", from: "John Smith" },
  ];

  const files = [
    { name: "Energy Bill - Sep 2025.pdf", size: "245 KB", date: "Oct 13" },
    { name: "Property Photo - Front.jpg", size: "1.2 MB", date: "Oct 13" },
    { name: "Roof Specifications.pdf", size: "180 KB", date: "Oct 13" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leads
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1>Smith Residence</h1>
              <Badge>Qualified</Badge>
              <Badge variant="outline" className="bg-warning text-warning-foreground">High Priority</Badge>
            </div>
            <p className="text-muted-foreground">John Smith • Residential Solar Installation</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Book Site Visit
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Send Proposal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="emails">Emails</TabsTrigger>
                  <TabsTrigger value="calls">Calls</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {communications.map((comm) => (
                      <div key={comm.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className={`p-2 rounded-lg ${
                          comm.type === "email" ? "bg-primary/10" : comm.type === "call" ? "bg-success/10" : "bg-warning/10"
                        }`}>
                          {comm.type === "email" ? (
                            <Mail className="w-5 h-5 text-primary" />
                          ) : comm.type === "call" ? (
                            <Phone className="w-5 h-5 text-success" />
                          ) : (
                            <FileText className="w-5 h-5 text-warning" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4>{comm.subject}</h4>
                          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                            <span>{comm.from}</span>
                            <span>•</span>
                            <span>{comm.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    <Label>Add Note or Email</Label>
                    <Textarea placeholder="Type your message..." rows={4} />
                    <div className="flex gap-2">
                      <Button>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Log Call
                      </Button>
                      <Button variant="outline">Save Note</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files & Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p>{file.name}</p>
                        <p className="text-muted-foreground">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">Upload Files</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value="John Smith" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Input value="john.smith@email.com" readOnly className="flex-1" />
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="flex items-center gap-2">
                  <Input value="+61 412 345 678" readOnly className="flex-1" />
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Property Address</Label>
                <div className="flex items-start gap-2">
                  <Input value="123 Solar Street, Brisbane QLD 4000" readOnly className="flex-1" />
                  <Button variant="outline" size="sm">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Input value="Website Contact Form" readOnly />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated Value</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>$15,000</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Product Interest</span>
                <div className="flex gap-2">
                  <Badge>Solar</Badge>
                  <Badge>Battery</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Assigned To</span>
                <span>John Davis</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>Oct 12, 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>Oct 14, 2025</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Site Visit
              </Button>
              <Button variant="outline" className="w-full">
                <Video className="w-4 h-4 mr-2" />
                Virtual Consultation
              </Button>
              <Button variant="outline" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Proposal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
