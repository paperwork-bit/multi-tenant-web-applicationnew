import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  DollarSign, 
  FileText, 
  Link as LinkIcon, 
  Download, 
  Send, 
  CreditCard, 
  AlertCircle,
  Eye,
  Edit,
  Copy,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  Filter,
  Search,
  Plus,
  X,
  RefreshCw,
  CloudUpload,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

export function BillingPaymentsScreen() {
  // State variables for enhanced functionality
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showCreateInvoiceDialog, setShowCreateInvoiceDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showStripeDialog, setShowStripeDialog] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [showAgingDialog, setShowAgingDialog] = useState(false);
  const [showXeroDialog, setShowXeroDialog] = useState(false);
  const [showXeroSyncDialog, setShowXeroSyncDialog] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedAging, setSelectedAging] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    project: "",
    amount: "",
    dueDate: "",
    description: ""
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "",
    reference: "",
    notes: ""
  });
  const [reminderForm, setReminderForm] = useState({
    subject: "",
    message: "",
    sendDate: ""
  });
  const [stripeForm, setStripeForm] = useState({
    invoiceNumber: "INV-2025-1040",
    amount: "18200",
    customerEmail: "emily.davis@email.com",
    description: "Davis Home - Final Payment"
  });
  const [creditForm, setCreditForm] = useState({
    customer: "",
    amount: "",
    referredBy: "",
    notes: ""
  });

  // Xero integration state
  const [xeroConnected, setXeroConnected] = useState(true);
  const [xeroSyncing, setXeroSyncing] = useState(false);
  const [lastXeroSync, setLastXeroSync] = useState<Date | null>(new Date(2025, 9, 28, 14, 30));

  const invoices = [
    { id: 1, invoice: "INV-2025-1042", customer: "John Smith", project: "Smith Residence", amount: 21500, paid: 21500, status: "paid", due: "Oct 15" },
    { id: 2, invoice: "INV-2025-1041", customer: "Brown Industries", project: "Brown Warehouse", amount: 125000, paid: 87500, status: "partial", due: "Oct 20" },
    { id: 3, invoice: "INV-2025-1040", customer: "Emily Davis", project: "Davis Home", amount: 18200, paid: 0, status: "outstanding", due: "Oct 10" },
    { id: 4, invoice: "INV-2025-1039", customer: "Carlos Martinez", project: "Martinez Property", amount: 16500, paid: 4950, status: "partial", due: "Oct 18" },
    { id: 5, invoice: "INV-2025-1038", customer: "Lisa Anderson", project: "Anderson Home", amount: 19800, paid: 19800, status: "paid", due: "Oct 5" },
  ];

  const arAgingData = [
    { range: "Current", amount: 45000, fill: "#10b981" },
    { range: "1-30 Days", amount: 28000, fill: "#f59e0b" },
    { range: "31-60 Days", amount: 12000, fill: "#ef4444" },
    { range: "60+ Days", amount: 8000, fill: "#991b1b" },
  ];

  const paymentMethods = [
    { id: 1, method: "Bank Transfer", details: "BSB: 123-456 | Acc: 12345678" },
    { id: 2, method: "Stripe Link", details: "Generate secure payment link" },
    { id: 3, method: "Credit Card", details: "Process card payment" },
  ];

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handleStatsClick = (statType: string) => {
    setSelectedStatType(statType);
    setShowStatsDialog(true);
  };

  const handleInvoiceClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDialog(true);
  };

  const handleCreateInvoice = () => {
    setShowCreateInvoiceDialog(true);
  };

  const handleExportReport = () => {
    setShowExportDialog(true);
  };

  const handleSendReminder = (invoice?: any) => {
    if (invoice) {
      setSelectedInvoice(invoice);
      setReminderForm({
        subject: `Payment Reminder - ${invoice.invoice}`,
        message: `Dear ${invoice.customer},\n\nThis is a friendly reminder that your invoice ${invoice.invoice} for $${invoice.amount.toLocaleString()} is due on ${invoice.due}.\n\nPlease process payment at your earliest convenience.\n\nThank you,\nxTechs Renewables`,
        sendDate: new Date().toISOString().split('T')[0]
      });
    }
    setShowReminderDialog(true);
  };

  const handleRecordPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: (invoice.amount - invoice.paid).toString(),
      method: "",
      reference: "",
      notes: ""
    });
    setShowPaymentDialog(true);
  };

  const handleGenerateStripeLink = () => {
    setShowStripeDialog(true);
  };

  const handleApplyCredit = () => {
    setShowCreditDialog(true);
  };

  const handleAgingClick = (agingData: any) => {
    setSelectedAging(agingData);
    setShowAgingDialog(true);
  };

  const submitNewInvoice = () => {
    if (xeroConnected) {
      createXeroInvoice(newInvoice);
    } else {
      console.log("Creating new invoice:", newInvoice);
      alert("Invoice created successfully!");
      setShowCreateInvoiceDialog(false);
      setNewInvoice({ customer: "", project: "", amount: "", dueDate: "", description: "" });
    }
  };

  const submitPayment = () => {
    console.log("Recording payment:", paymentForm, "for invoice:", selectedInvoice);
    alert("Payment recorded successfully!");
    setShowPaymentDialog(false);
    setPaymentForm({ amount: "", method: "", reference: "", notes: "" });
  };

  const sendReminder = () => {
    console.log("Sending reminder:", reminderForm, "for invoice:", selectedInvoice);
    alert("Payment reminder sent successfully!");
    setShowReminderDialog(false);
    setReminderForm({ subject: "", message: "", sendDate: "" });
  };

  const generateStripeLink = () => {
    const mockLink = `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}`;
    console.log("Generated Stripe link:", mockLink, "for:", stripeForm);
    alert("Stripe payment link generated successfully!");
    setShowStripeDialog(false);
  };

  const applyReferralCredit = () => {
    console.log("Applying referral credit:", creditForm);
    alert("Referral credit applied successfully!");
    setShowCreditDialog(false);
    setCreditForm({ customer: "", amount: "", referredBy: "", notes: "" });
  };

  const exportData = (format: string) => {
    const data = filteredInvoices.map(inv => ({
      'Invoice': inv.invoice,
      'Customer': inv.customer,
      'Project': inv.project,
      'Amount': inv.amount,
      'Paid': inv.paid,
      'Outstanding': inv.amount - inv.paid,
      'Status': inv.status,
      'Due Date': inv.due
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const csvContent = data.map(row => Object.values(row).join(',')).join('\n');
      const fullContent = headers + '\n' + csvContent;
      
      const blob = new Blob([fullContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billing_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    
    setShowExportDialog(false);
    alert(`Billing report exported as ${format.toUpperCase()} successfully!`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const downloadInvoicePDF = (invoice: any) => {
    // Create mock PDF content as text (in a real app, you'd use a PDF library like jsPDF)
    const pdfContent = `
INVOICE

xTechs Renewables Pty Ltd
Multi-tenant Solar Platform
ABN: 12 345 678 901

Invoice Number: ${invoice.invoice}
Invoice Date: ${new Date().toLocaleDateString()}
Due Date: ${invoice.due}

Bill To:
${invoice.customer}
${invoice.project}

Description                          Amount
Solar Installation - ${invoice.project}     $${invoice.amount.toLocaleString()}

Subtotal:                           $${invoice.amount.toLocaleString()}
GST (10%):                         $${(invoice.amount * 0.1).toLocaleString()}
Total Amount:                      $${(invoice.amount * 1.1).toLocaleString()}

Amount Paid:                       $${invoice.paid.toLocaleString()}
Outstanding Balance:               $${(invoice.amount - invoice.paid).toLocaleString()}

Payment Terms: Net 30 days
Payment Status: ${invoice.status.toUpperCase()}

Thank you for your business!

For payment inquiries, please contact:
Email: billing@xtechsrenewables.com.au
Phone: 1300 XTECH (98324)
    `;

    // Create and download the file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoice}_Invoice.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert("Invoice PDF downloaded successfully!");
  };

  // Xero integration functions
  const handleConnectXero = () => {
    setShowXeroDialog(true);
  };

  const confirmXeroConnection = () => {
    // Simulate Xero OAuth connection
    setTimeout(() => {
      setXeroConnected(true);
      setShowXeroDialog(false);
      alert("Successfully connected to Xero!");
    }, 1000);
  };

  const disconnectXero = () => {
    setXeroConnected(false);
    setLastXeroSync(null);
    setShowXeroDialog(false);
    alert("Disconnected from Xero");
  };

  const handleSyncToXero = () => {
    setShowXeroSyncDialog(true);
  };

  const confirmSyncToXero = () => {
    setXeroSyncing(true);
    setShowXeroSyncDialog(false);
    
    // Simulate sync process
    setTimeout(() => {
      setXeroSyncing(false);
      setLastXeroSync(new Date());
      alert("Invoices synced to Xero successfully!");
    }, 2000);
  };

  const createXeroInvoice = (invoiceData: any) => {
    if (!xeroConnected) {
      alert("Please connect to Xero first");
      return;
    }

    // Simulate Xero invoice creation
    console.log("Creating Xero invoice:", invoiceData);
    
    // In a real implementation, this would call Xero API
    setTimeout(() => {
      alert(`Invoice ${invoiceData.customer} created in Xero successfully!`);
      setShowCreateInvoiceDialog(false);
      setNewInvoice({ customer: "", project: "", amount: "", dueDate: "", description: "" });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing & Payments</h1>
          <p className="text-gray-600">Manage invoices and track payments</p>
        </div>
        <div className="flex gap-3">
          {!xeroConnected ? (
            <Button 
              onClick={handleConnectXero}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Connect Xero
            </Button>
          ) : (
            <Button 
              onClick={handleSyncToXero}
              disabled={xeroSyncing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {xeroSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4 mr-2" />
                  Sync to Xero
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleCreateInvoice}>
            <FileText className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('total-ar')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total AR</p>
                <h2 className="text-2xl font-bold mt-2">$93,000</h2>
                <p className="text-sm text-blue-600">Outstanding receivables</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('overdue')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Overdue</p>
                <h2 className="text-2xl font-bold mt-2">$20,000</h2>
                <p className="text-sm text-red-600">3 overdue invoices</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('this-month')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">This Month</p>
                <h2 className="text-2xl font-bold mt-2">$108,300</h2>
                <p className="text-sm text-green-600">+15% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('avg-payment')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Avg Payment Time</p>
                <h2 className="text-2xl font-bold mt-2">12 days</h2>
                <p className="text-sm text-purple-600">From invoice date</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="aging">AR Aging</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice List</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Search invoices..." 
                      className="w-64 pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="outstanding">Outstanding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Invoice</th>
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Project</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Paid</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Due Date</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleInvoiceClick(invoice)}>
                        <td className="p-4 font-medium">{invoice.invoice}</td>
                        <td className="p-4">{invoice.customer}</td>
                        <td className="p-4">{invoice.project}</td>
                        <td className="p-4 font-medium">${invoice.amount.toLocaleString()}</td>
                        <td className="p-4 font-medium">${invoice.paid.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-600"
                                : invoice.status === "partial"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-red-100 text-red-600"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="p-4">{invoice.due}</td>
                        <td className="p-4">
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" onClick={() => handleInvoiceClick(invoice)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleSendReminder(invoice)}>
                              <Send className="w-4 h-4" />
                            </Button>
                            {invoice.status !== "paid" && (
                              <Button variant="ghost" size="sm" onClick={() => handleRecordPayment(invoice)}>
                                <CreditCard className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4>{method.method}</h4>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <p className="text-muted-foreground">{method.details}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stripe Payment Link Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p>Invoice Number</p>
                    <Input defaultValue="INV-2025-1040" />
                  </div>

                  <div className="space-y-2">
                    <p>Amount ($)</p>
                    <Input type="number" defaultValue="18200" />
                  </div>

                  <div className="space-y-2">
                    <p>Customer Email</p>
                    <Input type="email" defaultValue="emily.davis@email.com" />
                  </div>

                  <div className="space-y-2">
                    <p>Description</p>
                    <Input defaultValue="Davis Home - Final Payment" />
                  </div>

                  <Button className="w-full" onClick={handleGenerateStripeLink}>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Generate Stripe Link
                  </Button>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground mb-2">Generated Link:</p>
                    <div className="flex gap-2">
                      <Input value="https://stripe.com/pay/inv_12345..." readOnly className="flex-1" />
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Referral Credit System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary rounded-lg">
                    <h4 className="mb-2">Apply Referral Credit</h4>
                    <p className="text-muted-foreground mb-4">
                      Reward customers for referrals by applying credit to their invoices
                    </p>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <p>Select Customer</p>
                        <Input defaultValue="John Smith" />
                      </div>

                      <div className="space-y-2">
                        <p>Credit Amount ($)</p>
                        <Input type="number" placeholder="500" />
                      </div>

                      <div className="space-y-2">
                        <p>Referred By</p>
                        <Input placeholder="Customer name or ID" />
                      </div>

                      <Button className="w-full" onClick={handleApplyCredit}>Apply Credit</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="mb-3">Recent Referral Credits</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p>Lisa Anderson</p>
                          <p className="text-muted-foreground">Referred by Mike Brown</p>
                        </div>
                        <span>$500</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p>Carlos Martinez</p>
                          <p className="text-muted-foreground">Referred by Sarah Johnson</p>
                        </div>
                        <span>$500</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paid in Full</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success text-success-foreground">2</Badge>
                      <span>$41,300</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Partial Payment</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-warning text-warning-foreground">2</Badge>
                      <span>$51,700</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Outstanding</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-destructive text-destructive-foreground">1</Badge>
                      <span>$18,200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => handleSendReminder()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Payment Reminder
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => exportData('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export to CSV
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleExportReport}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Reminders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border border-destructive rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <p>Overdue</p>
                    </div>
                    <p className="text-muted-foreground">Emily Davis - INV-1040</p>
                    <p>$18,200 • 6 days overdue</p>
                  </div>
                  <div className="p-3 border border-warning rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <p>Due Soon</p>
                    </div>
                    <p className="text-muted-foreground">Carlos Martinez - INV-1039</p>
                    <p>$11,550 • Due in 2 days</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="aging" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Accounts Receivable Aging</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={arAgingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                      {arAgingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6">
                {arAgingData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAgingClick(item)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }} />
                      <p className="text-gray-600">{item.range}</p>
                    </div>
                    <h3 className="text-xl font-bold">${item.amount.toLocaleString()}</h3>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Billing Statistics - {selectedStatType}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStatType === 'total-ar' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Accounts Receivable Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">$93,000</div>
                        <p className="text-sm text-gray-600">Total Outstanding</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">$108,300</div>
                        <p className="text-sm text-gray-600">Collected This Month</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {filteredInvoices.filter(inv => inv.status !== 'paid').map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{invoice.customer}</p>
                            <p className="text-sm text-gray-600">{invoice.invoice} - {invoice.project}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(invoice.amount - invoice.paid).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Due {invoice.due}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'overdue' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Overdue Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredInvoices.filter(inv => inv.status === 'outstanding').map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                          <div>
                            <p className="font-medium">{invoice.customer}</p>
                            <p className="text-sm text-gray-600">{invoice.invoice} - {invoice.project}</p>
                            <p className="text-sm text-red-600">Due {invoice.due}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">${invoice.amount.toLocaleString()}</p>
                            <Button size="sm" onClick={() => handleSendReminder(invoice)}>
                              Send Reminder
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'this-month' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">This Month's Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">$108,300</div>
                        <p className="text-sm text-gray-600">Total Collected</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">+15%</div>
                        <p className="text-sm text-gray-600">Growth Rate</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">5</div>
                        <p className="text-sm text-gray-600">Invoices Paid</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {filteredInvoices.filter(inv => inv.status === 'paid').map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{invoice.customer}</p>
                            <p className="text-sm text-gray-600">{invoice.invoice} - {invoice.project}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${invoice.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Paid on {invoice.due}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'avg-payment' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Time Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">12 days</div>
                        <p className="text-sm text-gray-600">Average Payment Time</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <p className="text-sm text-gray-600">On-Time Payment Rate</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Payment Trends</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">0-7 days:</span>
                            <span>60% of payments</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">8-15 days:</span>
                            <span>25% of payments</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">16-30 days:</span>
                            <span>10% of payments</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">30+ days:</span>
                            <span>5% of payments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoice} - {selectedInvoice?.customer}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Invoice Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Number:</span>
                      <span className="font-medium">{selectedInvoice.invoice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{selectedInvoice.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project:</span>
                      <span className="font-medium">{selectedInvoice.project}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">{selectedInvoice.due}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={
                        selectedInvoice.status === "paid" ? "bg-green-100 text-green-600" :
                        selectedInvoice.status === "partial" ? "bg-orange-100 text-orange-600" :
                        "bg-red-100 text-red-600"
                      }>
                        {selectedInvoice.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">${selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-green-600">${selectedInvoice.paid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Outstanding:</span>
                      <span className="font-medium text-red-600">${(selectedInvoice.amount - selectedInvoice.paid).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3">
                {selectedInvoice.status !== "paid" && (
                  <>
                    <Button onClick={() => handleRecordPayment(selectedInvoice)}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Record Payment
                    </Button>
                    <Button variant="outline" onClick={() => handleSendReminder(selectedInvoice)}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => downloadInvoicePDF(selectedInvoice)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={showCreateInvoiceDialog} onOpenChange={setShowCreateInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Generate a new invoice for a customer
              {xeroConnected && (
                <div className="flex items-center gap-2 mt-2 text-blue-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Will be created in Xero</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={newInvoice.customer}
                onChange={(e) => setNewInvoice({...newInvoice, customer: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={newInvoice.project}
                onChange={(e) => setNewInvoice({...newInvoice, project: e.target.value})}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                placeholder="Enter invoice amount"
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newInvoice.description}
                onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                placeholder="Enter invoice description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateInvoiceDialog(false)}>Cancel</Button>
            <Button onClick={submitNewInvoice}>
              {xeroConnected ? (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Create in Xero
                </>
              ) : (
                "Create Invoice"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {selectedInvoice?.invoice}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Invoice Amount:</span>
                <span>${selectedInvoice?.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Already Paid:</span>
                <span>${selectedInvoice?.paid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Outstanding:</span>
                <span>${selectedInvoice ? (selectedInvoice.amount - selectedInvoice.paid).toLocaleString() : 0}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Amount ($)</Label>
              <Input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                placeholder="Enter payment amount"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentForm.method} onValueChange={(value) => setPaymentForm({...paymentForm, method: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input
                value={paymentForm.reference}
                onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                placeholder="Enter reference number"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                placeholder="Enter payment notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={submitPayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <DialogDescription>
              Send a payment reminder email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={reminderForm.subject}
                onChange={(e) => setReminderForm({...reminderForm, subject: e.target.value})}
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={reminderForm.message}
                onChange={(e) => setReminderForm({...reminderForm, message: e.target.value})}
                placeholder="Enter reminder message"
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Send Date</Label>
              <Input
                type="date"
                value={reminderForm.sendDate}
                onChange={(e) => setReminderForm({...reminderForm, sendDate: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderDialog(false)}>Cancel</Button>
            <Button onClick={sendReminder}>
              <Send className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Billing Report</DialogTitle>
            <DialogDescription>
              Choose the format for your billing report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => exportData('csv')} className="h-20 flex-col">
                <FileText className="w-8 h-8 mb-2" />
                Export as CSV
              </Button>
              <Button onClick={() => exportData('pdf')} className="h-20 flex-col" variant="outline">
                <Download className="w-8 h-8 mb-2" />
                Export as PDF
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stripe Link Dialog */}
      <Dialog open={showStripeDialog} onOpenChange={setShowStripeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Stripe Payment Link</DialogTitle>
            <DialogDescription>
              Create a secure payment link for your customer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={stripeForm.invoiceNumber}
                onChange={(e) => setStripeForm({...stripeForm, invoiceNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                value={stripeForm.amount}
                onChange={(e) => setStripeForm({...stripeForm, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Customer Email</Label>
              <Input
                type="email"
                value={stripeForm.customerEmail}
                onChange={(e) => setStripeForm({...stripeForm, customerEmail: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={stripeForm.description}
                onChange={(e) => setStripeForm({...stripeForm, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStripeDialog(false)}>Cancel</Button>
            <Button onClick={generateStripeLink}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Generate Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Credit Dialog */}
      <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Referral Credit</DialogTitle>
            <DialogDescription>
              Apply a referral credit to a customer's account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={creditForm.customer}
                onChange={(e) => setCreditForm({...creditForm, customer: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Credit Amount ($)</Label>
              <Input
                type="number"
                value={creditForm.amount}
                onChange={(e) => setCreditForm({...creditForm, amount: e.target.value})}
                placeholder="Enter credit amount"
              />
            </div>
            <div className="space-y-2">
              <Label>Referred By</Label>
              <Input
                value={creditForm.referredBy}
                onChange={(e) => setCreditForm({...creditForm, referredBy: e.target.value})}
                placeholder="Enter referrer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={creditForm.notes}
                onChange={(e) => setCreditForm({...creditForm, notes: e.target.value})}
                placeholder="Enter additional notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreditDialog(false)}>Cancel</Button>
            <Button onClick={applyReferralCredit}>Apply Credit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AR Aging Dialog */}
      <Dialog open={showAgingDialog} onOpenChange={setShowAgingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AR Aging Details</DialogTitle>
            <DialogDescription>
              {selectedAging?.range} - ${selectedAging?.amount.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedAging && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: selectedAging.fill }} />
                    <h3 className="text-lg font-medium">{selectedAging.range}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">${selectedAging.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Invoices:</span>
                      <span className="font-medium">
                        {selectedAging.range === 'Current' ? '2 invoices' :
                         selectedAging.range === '1-30 Days' ? '1 invoice' :
                         selectedAging.range === '31-60 Days' ? '1 invoice' : '1 invoice'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage of Total AR:</span>
                      <span className="font-medium">{((selectedAging.amount / 93000) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Recommended Actions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {selectedAging.range === 'Current' && (
                    <>
                      <li>• Monitor for timely payment</li>
                      <li>• Send payment confirmations</li>
                    </>
                  )}
                  {selectedAging.range === '1-30 Days' && (
                    <>
                      <li>• Send friendly payment reminder</li>
                      <li>• Verify customer contact information</li>
                    </>
                  )}
                  {selectedAging.range === '31-60 Days' && (
                    <>
                      <li>• Send formal payment notice</li>
                      <li>• Contact customer directly</li>
                      <li>• Consider payment plan options</li>
                    </>
                  )}
                  {selectedAging.range === '60+ Days' && (
                    <>
                      <li>• Escalate to collections</li>
                      <li>• Consider legal action</li>
                      <li>• Review credit terms</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAgingDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Xero Connection Dialog */}
      <Dialog open={showXeroDialog} onOpenChange={setShowXeroDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {xeroConnected ? "Xero Connection Settings" : "Connect to Xero"}
            </DialogTitle>
            <DialogDescription>
              {xeroConnected 
                ? "Manage your Xero integration settings for invoice management" 
                : "Connect your Xero account to automatically create and sync invoices"
              }
            </DialogDescription>
          </DialogHeader>

          {xeroConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Successfully Connected</span>
                </div>
                <p className="text-green-600">Your Xero account is connected and ready for invoice management.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Organisation</p>
                  <p className="font-medium">xTechs Renewables Pty Ltd</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Connected Account</p>
                  <p className="font-medium">admin@xtechsrenewables.com.au</p>
                </div>
                {lastXeroSync && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Last Sync</p>
                    <p className="font-medium">{lastXeroSync.toLocaleString('en-AU', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-l-4 border-orange-400 bg-orange-50 rounded">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-orange-800">Disconnecting will stop automatic invoice sync.</p>
                    <p className="text-orange-600 mt-1">You can reconnect at any time.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <h4 className="font-medium">Benefits of Xero Integration:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Automatic invoice creation in Xero</li>
                  <li>• Real-time invoice status updates</li>
                  <li>• Seamless accounting integration</li>
                  <li>• Automated payment tracking</li>
                  <li>• GST compliance and reporting</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-blue-400 bg-blue-50 rounded">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800">You'll be redirected to Xero to authorize the connection.</p>
                    <p className="text-blue-600 mt-1">Make sure you have admin access to your Xero account.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {xeroConnected ? (
              <>
                <Button variant="outline" onClick={() => setShowXeroDialog(false)}>
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  onClick={disconnectXero}
                >
                  Disconnect Xero
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowXeroDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={confirmXeroConnection}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect to Xero
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Xero Sync Dialog */}
      <Dialog open={showXeroSyncDialog} onOpenChange={setShowXeroSyncDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync Invoices to Xero</DialogTitle>
            <DialogDescription>
              Synchronize your invoices and payment data with Xero accounting software
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Invoices:</span>
                <span className="font-medium">{invoices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Outstanding Amount:</span>
                <span className="font-medium">$93,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid This Month:</span>
                <span className="font-medium text-green-600">$108,300</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">What will be synced:</h4>
              <ul className="space-y-1 text-gray-600 ml-5">
                <li>• Invoice details and line items</li>
                <li>• Customer information</li>
                <li>• Payment records and status</li>
                <li>• GST calculations</li>
                <li>• Due dates and terms</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 rounded">
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800">Data will be posted to your Xero organisation.</p>
                  <p className="text-blue-600 mt-1">This may take a few moments to complete.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowXeroSyncDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmSyncToXero}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CloudUpload className="w-4 h-4 mr-2" />
              Sync to Xero
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
