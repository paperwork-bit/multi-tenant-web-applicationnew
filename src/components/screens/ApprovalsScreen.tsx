import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  User,
  DollarSign,
  FileText,
  Briefcase,
  Receipt,
  AlertCircle,
  MessageSquare,
  Mail
} from "lucide-react";

interface LeaveRequest {
  id: number;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  appliedOn: string;
  status: "pending" | "approved" | "rejected";
}

interface DiscountRequest {
  id: number;
  salesPerson: string;
  customerName: string;
  projectValue: number;
  requestedDiscount: number;
  discountPercentage: number;
  reason: string;
  submittedOn: string;
  status: "pending" | "approved" | "rejected" | "approved-with-conditions";
}

interface JobSubmission {
  id: number;
  subcontractorName: string;
  submitterEmail: string;
  jobTitle: string;
  location: string;
  estimatedCost: number;
  startDate: string;
  duration: string;
  description: string;
  submittedOn: string;
  status: "pending" | "approved" | "rejected";
}

interface Reimbursement {
  id: number;
  employeeName: string;
  category: string;
  amount: number;
  description: string;
  receiptAttached: boolean;
  submittedOn: string;
  status: "pending" | "approved" | "rejected";
}

export function ApprovalsScreen() {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [currentApproval, setCurrentApproval] = useState<any>(null);
  const [currentJob, setCurrentJob] = useState<JobSubmission | null>(null);
  const [approvalType, setApprovalType] = useState<"approve" | "reject" | "approve-conditional">("approve");
  const [comments, setComments] = useState("");
  const [conditions, setConditions] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  
  // New dialog states
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedItemType, setSelectedItemType] = useState<string>("");

  // Sample data
  const leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      employeeName: "Sarah Johnson",
      department: "Installation",
      leaveType: "Annual Leave",
      startDate: "2025-10-20",
      endDate: "2025-10-27",
      days: 7,
      reason: "Family vacation",
      appliedOn: "2025-10-10",
      status: "pending"
    },
    {
      id: 2,
      employeeName: "Mike Chen",
      department: "Project Management",
      leaveType: "Sick Leave",
      startDate: "2025-10-18",
      endDate: "2025-10-19",
      days: 2,
      reason: "Medical appointment",
      appliedOn: "2025-10-15",
      status: "pending"
    },
    {
      id: 3,
      employeeName: "Emily Davis",
      department: "Sales",
      leaveType: "Personal Leave",
      startDate: "2025-10-22",
      endDate: "2025-10-22",
      days: 1,
      reason: "Personal matter",
      appliedOn: "2025-10-14",
      status: "pending"
    },
  ];

  const discountRequests: DiscountRequest[] = [
    {
      id: 1,
      salesPerson: "Emily Davis",
      customerName: "Smith Residence",
      projectValue: 15000,
      requestedDiscount: 1500,
      discountPercentage: 10,
      reason: "Competitor pricing match - customer has lower quote from another provider",
      submittedOn: "2025-10-15",
      status: "pending"
    },
    {
      id: 2,
      salesPerson: "John Williams",
      customerName: "Brown Warehouse",
      projectValue: 85000,
      requestedDiscount: 8500,
      discountPercentage: 10,
      reason: "Large commercial project - potential for future business",
      submittedOn: "2025-10-14",
      status: "pending"
    },
    {
      id: 3,
      salesPerson: "Emily Davis",
      customerName: "Green Valley Estate",
      projectValue: 32000,
      requestedDiscount: 1600,
      discountPercentage: 5,
      reason: "Repeat customer - third project with us",
      submittedOn: "2025-10-13",
      status: "pending"
    },
  ];

  const jobSubmissions: JobSubmission[] = [
    {
      id: 1,
      subcontractorName: "Elite Solar Installers",
      submitterEmail: "contact@elitesolar.com.au",
      jobTitle: "Residential Installation - North Brisbane",
      location: "North Brisbane",
      estimatedCost: 12000,
      startDate: "2025-10-25",
      duration: "3 days",
      description: "10kW residential solar system installation",
      submittedOn: "2025-10-14",
      status: "pending"
    },
    {
      id: 2,
      subcontractorName: "Quick Install Pros",
      submitterEmail: "jobs@quickinstall.com.au",
      jobTitle: "Commercial Roof Mounting",
      location: "Gold Coast",
      estimatedCost: 25000,
      startDate: "2025-10-28",
      duration: "5 days",
      description: "Commercial building solar panel mounting and wiring",
      submittedOn: "2025-10-13",
      status: "pending"
    },
  ];

  const reimbursements: Reimbursement[] = [
    {
      id: 1,
      employeeName: "Sarah Johnson",
      category: "Travel",
      amount: 145.50,
      description: "Client site visit - fuel and parking",
      receiptAttached: true,
      submittedOn: "2025-10-12",
      status: "pending"
    },
    {
      id: 2,
      employeeName: "Mike Chen",
      category: "Equipment",
      amount: 380.00,
      description: "Safety gear and tools for installation",
      receiptAttached: true,
      submittedOn: "2025-10-11",
      status: "pending"
    },
    {
      id: 3,
      employeeName: "Lisa Anderson",
      category: "Training",
      amount: 650.00,
      description: "Solar certification course",
      receiptAttached: true,
      submittedOn: "2025-10-10",
      status: "pending"
    },
  ];

  const handleApprove = (item: any, type: string) => {
    setCurrentApproval({ item, type });
    setApprovalType("approve");
    setComments("");
    setConditions("");
    setMaxDiscount("");
    setShowApprovalDialog(true);
  };

  const handleReject = (item: any, type: string) => {
    setCurrentApproval({ item, type });
    setApprovalType("reject");
    setComments("");
    setShowApprovalDialog(true);
  };

  const handleApproveWithConditions = (item: any) => {
    setCurrentApproval({ item, type: "discount" });
    setApprovalType("approve-conditional");
    setComments("");
    setConditions("");
    setMaxDiscount("");
    setShowApprovalDialog(true);
  };

  const handleReschedule = (job: JobSubmission) => {
    setCurrentJob(job);
    setRescheduleDate("");
    setRescheduleTime("");
    setShowRescheduleDialog(true);
  };

  const confirmReschedule = () => {
    // In a real app, this would update the backend
    console.log("Reschedule confirmed:", {
      job: currentJob,
      newDate: rescheduleDate,
      newTime: rescheduleTime,
    });
    setShowRescheduleDialog(false);
  };

  const confirmApproval = () => {
    // In a real app, this would update the backend
    console.log("Approval confirmed:", {
      approval: currentApproval,
      type: approvalType,
      comments,
      conditions: approvalType === "approve-conditional" ? conditions : undefined,
      maxDiscount: approvalType === "approve-conditional" ? maxDiscount : undefined,
    });
    alert(`${approvalType === "approve" ? "Approved" : approvalType === "reject" ? "Rejected" : "Approved with conditions"} successfully!`);
    setShowApprovalDialog(false);
  };

  const handleStatsClick = (statType: string) => {
    setSelectedStatType(statType);
    setShowStatsDialog(true);
  };

  const handleViewDetails = (item: any, type: string) => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setShowDetailsDialog(true);
  };

  const handleViewHistory = () => {
    setShowHistoryDialog(true);
  };

  const handleExportData = () => {
    const allData = [
      ...leaveRequests.map(item => ({ ...item, type: 'leave' })),
      ...discountRequests.map(item => ({ ...item, type: 'discount' })),
      ...jobSubmissions.map(item => ({ ...item, type: 'job' })),
      ...reimbursements.map(item => ({ ...item, type: 'reimbursement' }))
    ];
    
    const csvContent = allData.map(item => 
      `${item.type},${item.id},${item.status},${item.submittedOn || item.appliedOn}`
    ).join('\n');
    
    const header = 'Type,ID,Status,Date\n';
    const fullContent = header + csvContent;
    
    const blob = new Blob([fullContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'approvals_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert("Approvals data exported successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "approved-with-conditions":
        return <Badge className="bg-secondary text-secondary-foreground"><AlertCircle className="w-3 h-3 mr-1" />Approved with Conditions</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = {
    totalPending: leaveRequests.filter(l => l.status === "pending").length +
                  discountRequests.filter(d => d.status === "pending").length +
                  jobSubmissions.filter(j => j.status === "pending").length +
                  reimbursements.filter(r => r.status === "pending").length,
    leavePending: leaveRequests.filter(l => l.status === "pending").length,
    discountsPending: discountRequests.filter(d => d.status === "pending").length,
    jobsPending: jobSubmissions.filter(j => j.status === "pending").length,
    reimbursementsPending: reimbursements.filter(r => r.status === "pending").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Approvals</h1>
          <p className="text-gray-600">Review and approve pending requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleViewHistory}>
            <FileText className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Receipt className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('total')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Pending</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalPending}</h3>
                <p className="text-sm text-orange-600">Needs attention</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('leaves')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Leave Requests</p>
                <h3 className="text-2xl font-bold mt-2">{stats.leavePending}</h3>
                <p className="text-sm text-blue-600">Employee requests</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('discounts')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Discounts</p>
                <h3 className="text-2xl font-bold mt-2">{stats.discountsPending}</h3>
                <p className="text-sm text-green-600">Sales requests</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('jobs')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Job Submissions</p>
                <h3 className="text-2xl font-bold mt-2">{stats.jobsPending}</h3>
                <p className="text-sm text-purple-600">Subcontractor jobs</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('reimbursements')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Reimbursements</p>
                <h3 className="text-2xl font-bold mt-2">{stats.reimbursementsPending}</h3>
                <p className="text-sm text-indigo-600">Expense claims</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Receipt className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approvals Tabs */}
      <Tabs defaultValue="leaves" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaves">
            <Calendar className="w-4 h-4 mr-2" />
            Leave Requests ({stats.leavePending})
          </TabsTrigger>
          <TabsTrigger value="discounts">
            <DollarSign className="w-4 h-4 mr-2" />
            Discounts ({stats.discountsPending})
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Briefcase className="w-4 h-4 mr-2" />
            Jobs ({stats.jobsPending})
          </TabsTrigger>
          <TabsTrigger value="reimbursements">
            <Receipt className="w-4 h-4 mr-2" />
            Reimbursements ({stats.reimbursementsPending})
          </TabsTrigger>
        </TabsList>

        {/* Leave Requests Tab */}
        <TabsContent value="leaves" className="space-y-4">
          {leaveRequests.map((leave) => (
            <Card key={leave.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <CardTitle>{leave.employeeName}</CardTitle>
                      <p className="text-muted-foreground">{leave.department}</p>
                    </div>
                  </div>
                  {getStatusBadge(leave.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-muted-foreground">Leave Type</p>
                    <p>{leave.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p>{new Date(leave.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p>{new Date(leave.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p>{leave.days} {leave.days === 1 ? 'day' : 'days'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground">Reason</p>
                  <p>{leave.reason}</p>
                </div>

                <div className="text-muted-foreground">
                  Applied on {new Date(leave.appliedOn).toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleViewDetails(leave, "leave")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {leave.status === "pending" && (
                    <>
                      <Button 
                        onClick={() => handleApprove(leave, "leave")}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReject(leave, "leave")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Discount Requests Tab */}
        <TabsContent value="discounts" className="space-y-4">
          {discountRequests.map((discount) => (
            <Card key={discount.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-secondary" />
                    <div>
                      <CardTitle>{discount.customerName}</CardTitle>
                      <p className="text-muted-foreground">By {discount.salesPerson}</p>
                    </div>
                  </div>
                  {getStatusBadge(discount.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-muted-foreground">Project Value</p>
                    <p className="text-xl">${discount.projectValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Requested Discount</p>
                    <p className="text-xl text-warning">${discount.requestedDiscount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Discount %</p>
                    <p className="text-xl">{discount.discountPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Final Value</p>
                    <p className="text-xl text-success">
                      ${(discount.projectValue - discount.requestedDiscount).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground">Reason</p>
                  <p>{discount.reason}</p>
                </div>

                <div className="text-muted-foreground">
                  Submitted on {new Date(discount.submittedOn).toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleViewDetails(discount, "discount")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {discount.status === "pending" && (
                    <>
                      <Button 
                        onClick={() => handleApprove(discount, "discount")}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleApproveWithConditions(discount)}
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Approve with Conditions
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReject(discount, "discount")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Job Submissions Tab */}
        <TabsContent value="jobs" className="space-y-4">
          {jobSubmissions.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-success" />
                    <div>
                      <CardTitle>{job.jobTitle}</CardTitle>
                      <p className="text-muted-foreground">{job.subcontractorName}</p>
                    </div>
                  </div>
                  {getStatusBadge(job.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p>{job.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Cost</p>
                    <p className="text-xl">${job.estimatedCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p>{new Date(job.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p>{job.duration}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Submitter Email</p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {job.submitterEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted On</p>
                    <p>{new Date(job.submittedOn).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p>{job.description}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleViewDetails(job, "job")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {job.status === "pending" && (
                    <>
                      <Button 
                        onClick={() => handleApprove(job, "job")}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleReschedule(job)}
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Reschedule
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReject(job, "job")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Reimbursements Tab */}
        <TabsContent value="reimbursements" className="space-y-4">
          {reimbursements.map((reimb) => (
            <Card key={reimb.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-accent" />
                    <div>
                      <CardTitle>{reimb.employeeName}</CardTitle>
                      <p className="text-muted-foreground">{reimb.category}</p>
                    </div>
                  </div>
                  {getStatusBadge(reimb.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="text-2xl">${reimb.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p>{reimb.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Receipt</p>
                    <p>{reimb.receiptAttached ? (
                      <Badge className="bg-success text-success-foreground">
                        <FileText className="w-3 h-3 mr-1" />
                        Attached
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Attached</Badge>
                    )}</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p>{reimb.description}</p>
                </div>

                <div className="text-muted-foreground">
                  Submitted on {new Date(reimb.submittedOn).toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleViewDetails(reimb, "reimbursement")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {reimb.status === "pending" && (
                    <>
                      <Button 
                        onClick={() => handleApprove(reimb, "reimbursement")}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReject(reimb, "reimbursement")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalType === "approve" && "Approve Request"}
              {approvalType === "reject" && "Reject Request"}
              {approvalType === "approve-conditional" && "Approve with Conditions"}
            </DialogTitle>
            <DialogDescription>
              {approvalType === "approve" && "Please confirm you want to approve this request."}
              {approvalType === "reject" && "Please provide a reason for rejection."}
              {approvalType === "approve-conditional" && "Set conditions for this approval."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {approvalType === "approve-conditional" && (
              <>
                <div className="space-y-2">
                  <Label>Maximum Discount Amount (AUD)</Label>
                  <Input
                    type="number"
                    placeholder="Enter maximum discount"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conditions</Label>
                  <Textarea
                    placeholder="e.g., Payment within 7 days, Full amount upfront, etc."
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>
                {approvalType === "reject" ? "Reason for Rejection" : "Comments (Optional)"}
              </Label>
              <Textarea
                placeholder={approvalType === "reject" ? "Explain why this request is rejected" : "Add any additional comments"}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                required={approvalType === "reject"}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmApproval}
              className={
                approvalType === "approve" ? "bg-success hover:bg-success/90" :
                approvalType === "approve-conditional" ? "bg-secondary hover:bg-secondary/90" :
                "bg-destructive hover:bg-destructive/90"
              }
              disabled={approvalType === "reject" && !comments}
            >
              {approvalType === "approve" && <><CheckCircle2 className="w-4 h-4 mr-2" />Confirm Approval</>}
              {approvalType === "reject" && <><XCircle className="w-4 h-4 mr-2" />Confirm Rejection</>}
              {approvalType === "approve-conditional" && <><AlertCircle className="w-4 h-4 mr-2" />Approve with Conditions</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Job</DialogTitle>
            <DialogDescription>
              Set a new date and time for {currentJob?.jobTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p><span className="text-muted-foreground">Subcontractor:</span> {currentJob?.subcontractorName}</p>
              <p><span className="text-muted-foreground">Current Start Date:</span> {currentJob?.startDate ? new Date(currentJob.startDate).toLocaleDateString() : ''}</p>
            </div>

            <div className="space-y-2">
              <Label>New Start Date</Label>
              <Input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Reason for Rescheduling (Optional)</Label>
              <Textarea
                placeholder="Explain why this job is being rescheduled"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmReschedule}
              disabled={!rescheduleDate || !rescheduleTime}
              className="bg-secondary hover:bg-secondary/90"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Approval Statistics - {selectedStatType}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStatType === 'total' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.totalPending}</div>
                      <p className="text-sm text-gray-600">Total Pending</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {leaveRequests.filter(l => l.status === "approved").length + 
                         discountRequests.filter(d => d.status === "approved").length + 
                         jobSubmissions.filter(j => j.status === "approved").length + 
                         reimbursements.filter(r => r.status === "approved").length}
                      </div>
                      <p className="text-sm text-gray-600">Total Approved</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Breakdown by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Leave Requests</span>
                        <Badge>{stats.leavePending} pending</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount Requests</span>
                        <Badge>{stats.discountsPending} pending</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Job Submissions</span>
                        <Badge>{stats.jobsPending} pending</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Reimbursements</span>
                        <Badge>{stats.reimbursementsPending} pending</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'leaves' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Leave Request Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaveRequests.map((leave) => (
                        <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{leave.employeeName}</p>
                            <p className="text-sm text-gray-600">{leave.leaveType} - {leave.days} days</p>
                          </div>
                          {getStatusBadge(leave.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'discounts' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Discount Request Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {discountRequests.map((discount) => (
                        <div key={discount.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{discount.customerName}</p>
                            <p className="text-sm text-gray-600">${discount.requestedDiscount.toLocaleString()} ({discount.discountPercentage}%)</p>
                          </div>
                          {getStatusBadge(discount.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'jobs' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Submission Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {jobSubmissions.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{job.jobTitle}</p>
                            <p className="text-sm text-gray-600">{job.subcontractorName} - ${job.estimatedCost.toLocaleString()}</p>
                          </div>
                          {getStatusBadge(job.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'reimbursements' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reimbursement Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reimbursements.map((reimb) => (
                        <div key={reimb.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{reimb.employeeName}</p>
                            <p className="text-sm text-gray-600">{reimb.category} - ${reimb.amount.toFixed(2)}</p>
                          </div>
                          {getStatusBadge(reimb.status)}
                        </div>
                      ))}
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

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedItemType === 'leave' && 'Leave Request Details'}
              {selectedItemType === 'discount' && 'Discount Request Details'}
              {selectedItemType === 'job' && 'Job Submission Details'}
              {selectedItemType === 'reimbursement' && 'Reimbursement Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              {selectedItemType === 'leave' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Employee Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Employee Name</p>
                          <p className="font-medium">{selectedItem.employeeName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Department</p>
                          <p className="font-medium">{selectedItem.department}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Leave Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Leave Type</p>
                          <p className="font-medium">{selectedItem.leaveType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{selectedItem.days} {selectedItem.days === 1 ? 'day' : 'days'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-medium">{new Date(selectedItem.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-medium">{new Date(selectedItem.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-medium">{selectedItem.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Applied On</p>
                        <p className="font-medium">{new Date(selectedItem.appliedOn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        {getStatusBadge(selectedItem.status)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedItemType === 'discount' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sales Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Sales Person</p>
                          <p className="font-medium">{selectedItem.salesPerson}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="font-medium">{selectedItem.customerName}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Financial Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Project Value</p>
                          <p className="text-2xl font-bold text-blue-600">${selectedItem.projectValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested Discount</p>
                          <p className="text-2xl font-bold text-orange-600">${selectedItem.requestedDiscount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Discount Percentage</p>
                          <p className="text-xl font-bold">{selectedItem.discountPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Final Value</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${(selectedItem.projectValue - selectedItem.requestedDiscount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-medium">{selectedItem.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted On</p>
                        <p className="font-medium">{new Date(selectedItem.submittedOn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        {getStatusBadge(selectedItem.status)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedItemType === 'job' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Subcontractor Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Subcontractor</p>
                          <p className="font-medium">{selectedItem.subcontractorName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact Email</p>
                          <p className="font-medium">{selectedItem.submitterEmail}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Job Title</p>
                        <p className="font-medium text-lg">{selectedItem.jobTitle}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">{selectedItem.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Cost</p>
                          <p className="text-xl font-bold text-green-600">${selectedItem.estimatedCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-medium">{new Date(selectedItem.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{selectedItem.duration}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="font-medium">{selectedItem.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted On</p>
                        <p className="font-medium">{new Date(selectedItem.submittedOn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        {getStatusBadge(selectedItem.status)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedItemType === 'reimbursement' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Employee Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Employee Name</p>
                        <p className="font-medium">{selectedItem.employeeName}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Expense Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-medium">{selectedItem.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="text-2xl font-bold text-green-600">${selectedItem.amount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="font-medium">{selectedItem.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Receipt Status</p>
                        <div>
                          {selectedItem.receiptAttached ? (
                            <Badge className="bg-success text-success-foreground">
                              <FileText className="w-3 h-3 mr-1" />
                              Receipt Attached
                            </Badge>
                          ) : (
                            <Badge variant="outline">No Receipt</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted On</p>
                        <p className="font-medium">{new Date(selectedItem.submittedOn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        {getStatusBadge(selectedItem.status)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Approval History
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sarah Johnson - Annual Leave</p>
                      <p className="text-sm text-gray-600">7 days leave approved on Oct 16, 2025</p>
                    </div>
                    <Badge className="bg-success text-success-foreground">Approved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Green Valley Estate - Discount Request</p>
                      <p className="text-sm text-gray-600">5% discount ($1,600) approved with conditions on Oct 15, 2025</p>
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground">Approved with Conditions</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Elite Solar Installers - Job Submission</p>
                      <p className="text-sm text-gray-600">Residential installation job rejected on Oct 14, 2025</p>
                    </div>
                    <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mike Chen - Equipment Reimbursement</p>
                      <p className="text-sm text-gray-600">$380.00 reimbursement approved on Oct 13, 2025</p>
                    </div>
                    <Badge className="bg-success text-success-foreground">Approved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Approval Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <p className="text-sm text-gray-600">Approved This Month</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">6</div>
                    <p className="text-sm text-gray-600">Approved with Conditions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <p className="text-sm text-gray-600">Rejected This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
