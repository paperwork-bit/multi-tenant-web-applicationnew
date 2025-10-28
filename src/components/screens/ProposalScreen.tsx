import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { ArrowLeft, Plus, Trash2, FileSignature, Link as LinkIcon, CheckCircle } from "lucide-react";

export function ProposalScreen() {
  const products = [
    { id: 1, name: "Solar Panel - 400W Tier 1", qty: 16, price: 350, total: 5600 },
    { id: 2, name: "Inverter - 6kW Hybrid", qty: 1, price: 2400, total: 2400 },
    { id: 3, name: "Battery Storage - 10kWh", qty: 1, price: 8500, total: 8500 },
    { id: 4, name: "EV Charger - 7kW", qty: 1, price: 1800, total: 1800 },
    { id: 5, name: "Installation & Labor", qty: 1, price: 3200, total: 3200 },
  ];

  const subtotal = products.reduce((sum, p) => sum + p.total, 0);
  const discount = 1500;
  const gst = (subtotal - discount) * 0.1;
  const total = subtotal - discount + gst;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1>Proposal #PRO-2025-1042</h1>
              <Badge variant="outline" className="bg-warning text-warning-foreground">
                Pending Signature
              </Badge>
            </div>
            <p className="text-muted-foreground">Smith Residence - John Smith</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <LinkIcon className="w-4 h-4 mr-2" />
            Sync from Pylon
          </Button>
          <Button variant="outline">Save Draft</Button>
          <Button>
            <FileSignature className="w-4 h-4 mr-2" />
            Send for Signature
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Builder</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3">Product</th>
                      <th className="text-left p-3">Qty</th>
                      <th className="text-left p-3">Unit Price</th>
                      <th className="text-left p-3">Total</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-3">{product.name}</td>
                        <td className="p-3">
                          <Input type="number" defaultValue={product.qty} className="w-20" />
                        </td>
                        <td className="p-3">${product.price.toLocaleString()}</td>
                        <td className="p-3">${product.total.toLocaleString()}</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Discounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Apply Discount</Label>
                <div className="flex gap-3">
                  <Select defaultValue="fixed">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed ($)</SelectItem>
                      <SelectItem value="percent">Percent (%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" defaultValue={discount} className="flex-1" />
                  <Button variant="outline">Apply</Button>
                </div>
                <div className="flex items-center justify-between text-destructive">
                  <span>Discount Applied</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">GST (10%)</span>
                <span>${gst.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Deposit (30%)</Label>
                  <Input value={`$${(total * 0.3).toLocaleString()}`} readOnly />
                  <p className="text-muted-foreground">Due on signing</p>
                </div>
                <div className="space-y-2">
                  <Label>Progress (40%)</Label>
                  <Input value={`$${(total * 0.4).toLocaleString()}`} readOnly />
                  <p className="text-muted-foreground">Due on installation</p>
                </div>
                <div className="space-y-2">
                  <Label>Final (30%)</Label>
                  <Input value={`$${(total * 0.3).toLocaleString()}`} readOnly />
                  <p className="text-muted-foreground">Due on completion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <p>Sales Manager</p>
                      <p className="text-muted-foreground">Approved by Sarah Mitchell</p>
                    </div>
                  </div>
                  <Badge className="bg-success text-success-foreground">Approved</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-warning" />
                    <div>
                      <p>Finance Manager</p>
                      <p className="text-muted-foreground">Pending review</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-warning text-warning-foreground">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2" />
                    <div>
                      <p>Operations Manager</p>
                      <p className="text-muted-foreground">Awaiting</p>
                    </div>
                  </div>
                  <Badge variant="outline">Not Started</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>E-Signature Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-warning/10 border border-warning rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileSignature className="w-5 h-5 text-warning" />
                  <p>Awaiting Customer Signature</p>
                </div>
                <p className="text-muted-foreground">
                  Document sent to john.smith@email.com on Oct 14
                </p>
              </div>
              <Button variant="outline" className="w-full">Resend Document</Button>
              <Button variant="outline" className="w-full">View Document</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solar Capacity</span>
                <span>6.4 kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual Production</span>
                <span>9,200 kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Battery Storage</span>
                <span>10 kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Savings (Year 1)</span>
                <span>$2,850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payback Period</span>
                <span>5.2 years</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">CO₂ Offset</span>
                <span>7.8 tonnes/year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Proposal Document
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Terms & Conditions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                System Design
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Product Specifications
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valid Until</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="date" defaultValue="2025-11-14" />
              <p className="text-muted-foreground mt-2">Proposal expires in 30 days</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
