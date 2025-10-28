import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Mail, Inbox, Send, Archive, Star, Search, Plus, Edit, Trash2 } from "lucide-react";

export function EmailTemplatesScreen() {
  const emails = [
    { id: 1, from: "John Smith", subject: "Re: Solar Installation Quote", preview: "Thanks for the detailed proposal...", date: "Oct 14", starred: true, unread: true },
    { id: 2, from: "Sarah Johnson", subject: "Site visit confirmation", preview: "Confirmed for tomorrow at 10am", date: "Oct 14", starred: false, unread: true },
    { id: 3, from: "Mike Brown", subject: "Payment received", preview: "Thank you for the quick installation...", date: "Oct 13", starred: false, unread: false },
    { id: 4, from: "Emily Davis", subject: "Question about battery storage", preview: "I'm interested in adding battery...", date: "Oct 13", starred: true, unread: false },
  ];

  const templates = [
    { id: 1, name: "Welcome Email", category: "Onboarding", lastUsed: "Oct 14" },
    { id: 2, name: "Proposal Follow-up", category: "Sales", lastUsed: "Oct 13" },
    { id: 3, name: "Site Visit Reminder", category: "Operations", lastUsed: "Oct 12" },
    { id: 4, name: "Installation Confirmation", category: "Operations", lastUsed: "Oct 11" },
    { id: 5, name: "Payment Reminder", category: "Finance", lastUsed: "Oct 10" },
    { id: 6, name: "Project Completion", category: "Operations", lastUsed: "Oct 9" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Email & Templates</h1>
          <p className="text-muted-foreground">Manage communications and email templates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Compose Email
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">
            <Inbox className="w-4 h-4 mr-2" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="sent">
            <Send className="w-4 h-4 mr-2" />
            Sent
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Mail className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search emails..." className="pl-10" />
                  </div>

                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Inbox className="w-4 h-4 mr-2" />
                      Inbox
                      <Badge className="ml-auto">12</Badge>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Star className="w-4 h-4 mr-2" />
                      Starred
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Send className="w-4 h-4 mr-2" />
                      Sent
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Archive className="w-4 h-4 mr-2" />
                      Archived
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {emails.map((email) => (
                      <div
                        key={email.id}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                          email.unread ? "bg-muted/30" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {email.starred && <Star className="w-4 h-4 text-warning fill-warning" />}
                            <p>{email.from}</p>
                          </div>
                          <span className="text-muted-foreground">{email.date}</span>
                        </div>
                        <h4 className="mb-1">{email.subject}</h4>
                        <p className="text-muted-foreground line-clamp-1">{email.preview}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emails.map((email) => (
                  <div key={email.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p>To: {email.from}</p>
                      <span className="text-muted-foreground">{email.date}</span>
                    </div>
                    <h4 className="mb-1">{email.subject}</h4>
                    <p className="text-muted-foreground">{email.preview}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div key={template.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4>{template.name}</h4>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{template.category}</Badge>
                          <span className="text-muted-foreground">Last used: {template.lastUsed}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview - Welcome Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p>Subject:</p>
                    <Input defaultValue="Welcome to xTechs Renewables - {{customer.name}}" />
                  </div>

                  <div className="space-y-2">
                    <p>Body:</p>
                    <Textarea
                      rows={12}
                      defaultValue={`Hi {{customer.name}},

Welcome to xTechs Renewables! We're excited to help you transition to clean, renewable energy.

Your project details:
- System Size: {{system.size}}kW
- Installation Date: {{install.date}}
- Project Manager: {{manager.name}}

Next Steps:
1. Review and sign your proposal
2. Schedule your site visit
3. Finalize installation details

If you have any questions, feel free to reach out to us at any time.

Best regards,
The xTechs Renewables Team`}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">Preview</Button>
                    <Button>Save Template</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Variables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="mb-2">Customer</h4>
                    <div className="space-y-1">
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{customer.name}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{customer.email}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{customer.phone}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{customer.address}}`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2">Installation</h4>
                    <div className="space-y-1">
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{install.date}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{install.time}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{install.team}}`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2">System</h4>
                    <div className="space-y-1">
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{system.size}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{system.panels}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{system.inverter}}`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2">Project</h4>
                    <div className="space-y-1">
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{project.id}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{project.value}}`}
                      </code>
                      <code className="block p-2 bg-muted rounded text-xs">
                        {`{{manager.name}}`}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">Duplicate Template</Button>
                  <Button variant="outline" className="w-full">Export Templates</Button>
                  <Button variant="outline" className="w-full">Import Templates</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
