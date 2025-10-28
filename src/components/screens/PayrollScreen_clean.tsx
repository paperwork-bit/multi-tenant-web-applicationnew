import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  DollarSign, 
  Users, 
  Clock, 
  Calendar,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Edit,
  Eye,
  RefreshCw,
  Link2,
  ExternalLink,
  CloudUpload,
  Receipt,
  XCircle,
  Filter,
  Search
} from "lucide-react";

interface EmployeePayroll {
  id: number;
  name: string;
  employeeId: string;
  role: string;
  payType: "hourly" | "salary";
  hourlyRate?: number;
  hoursWorked: number;
  regularHours: number;
  overtimeHours: number;
  grossPay: number;
  tax: number;
  superannuation: number;
  netPay: number;
  bankAccount: string;
  bsb: string;
}

interface Reimbursement {
  id: number;
  employeeName: string;
  employeeId: string;
  category: string;
  amount: number;
  gst: number;
  totalAmount: number;
  description: string;
  receiptAttached: boolean;
  submittedOn: string;
  expenseDate: string;
  status: "pending" | "approved" | "rejected";
  bankAccount: string;
  bsb: string;
}

export function PayrollScreen() {
  const [selectedPayPeriod, setSelectedPayPeriod] = useState("current");
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showXeroDialog, setShowXeroDialog] = useState(false);
  const [showXeroSyncDialog, setShowXeroSyncDialog] = useState(false);
  const [showReimbursementDialog, setShowReimbursementDialog] = useState(false);
  const [showReimbursementApprovalDialog, setShowReimbursementApprovalDialog] = useState(false);
  const [showReimbursementXeroSyncDialog, setShowReimbursementXeroSyncDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeePayroll | null>(null);
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null);
  const [reimbursementAction, setReimbursementAction] = useState<"approve" | "reject">("approve");
  const [payrollApproved, setPayrollApproved] = useState(false);
  const [reimbursementsApproved, setReimbursementsApproved] = useState(false);
  const [xeroConnected, setXeroConnected] = useState(true);
  const [xeroSyncing, setXeroSyncing] = useState(false);
  const [xeroReimbursementSyncing, setXeroReimbursementSyncing] = useState(false);
  const [lastXeroSync, setLastXeroSync] = useState<Date | null>(new Date(2025, 9, 15, 14, 30));
  const [lastReimbursementSync, setLastReimbursementSync] = useState<Date | null>(new Date(2025, 9, 15, 10, 15));
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  
  // New dialog states for enhanced functionality
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showPayrollSummaryDialog, setShowPayrollSummaryDialog] = useState(false);
  const [showXeroIntegrationDialog, setShowXeroIntegrationDialog] = useState(false);
  const [showABAFileDialog, setShowABAFileDialog] = useState(false);
  const [showReimbursementStatsDialog, setShowReimbursementStatsDialog] = useState(false);
  const [showPayPeriodDialog, setShowPayPeriodDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<string>("");

  // Calculate current pay period (weekly, ending Tuesday)
  const getCurrentPayPeriod = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Calculate days until next Tuesday (2 = Tuesday)
    let daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
    if (daysUntilTuesday === 0) daysUntilTuesday = 7; // If today is Tuesday, next Tuesday
    
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + daysUntilTuesday);
    
    const startDate = new Date(nextTuesday);
    startDate.setDate(nextTuesday.getDate() - 6); // 7 days back from Tuesday
    
    return {
      start: startDate.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
      end: nextTuesday.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
      paymentDate: nextTuesday.toLocaleDateString('en-AU', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    };
  };

  const payPeriod = getCurrentPayPeriod();

  // Empty data arrays
  const employees: EmployeePayroll[] = [];
  const reimbursements: Reimbursement[] = [];

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter reimbursements based on search and filters
  const filteredReimbursements = reimbursements.filter(reimb => {
    const matchesSearch = reimb.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reimb.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || reimb.category === filterCategory;
    const matchesStatus = filterStatus === "all" || reimb.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalEmployees: employees.length,
    totalHours: employees.reduce((sum, emp) => sum + emp.hoursWorked, 0),
    totalGrossPay: employees.reduce((sum, emp) => sum + emp.grossPay, 0),
    totalNetPay: employees.reduce((sum, emp) => sum + emp.netPay, 0),
    totalTax: employees.reduce((sum, emp) => sum + emp.tax, 0),
    totalSuper: employees.reduce((sum, emp) => sum + emp.superannuation, 0),
  };

  const reimbursementStats = {
    totalClaims: filteredReimbursements.length,
    pendingClaims: filteredReimbursements.filter(r => r.status === "pending").length,
    totalAmount: filteredReimbursements.reduce((sum, r) => sum + r.totalAmount, 0),
    gstClaimable: filteredReimbursements.reduce((sum, r) => sum + r.gst, 0),
  };

  // Handler functions
  const handleStatsClick = (statType: string) => {
    setSelectedStatType(statType);
    setShowStatsDialog(true);
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    switch(cardType) {
      case 'payroll-summary':
        setShowPayrollSummaryDialog(true);
        break;
      case 'xero-integration':
        setShowXeroIntegrationDialog(true);
        break;
      case 'aba-file':
        setShowABAFileDialog(true);
        break;
      case 'pay-period':
        setShowPayPeriodDialog(true);
        break;
    }
  };

  const handleReimbursementStatsClick = (statType: string) => {
    setSelectedStatType(statType);
    setShowReimbursementStatsDialog(true);
  };

  const handleExportData = () => {
    setShowExportDialog(true);
  };

  const handleViewHistory = () => {
    setShowHistoryDialog(true);
  };

  const exportPayrollData = (format: string) => {
    const csvContent = [
      ["Employee ID", "Name", "Role", "Hours Worked", "Gross Pay", "Tax", "Super", "Net Pay"],
      ...employees.map(emp => [
        emp.employeeId,
        emp.name,
        emp.role,
        emp.hoursWorked.toString(),
        emp.grossPay.toString(),
        emp.tax.toString(),
        emp.superannuation.toString(),
        emp.netPay.toString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll-${payPeriod.start.replace(/\s/g, '-')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportReimbursementData = (format: string) => {
    const csvContent = [
      ["Employee ID", "Employee Name", "Category", "Amount", "GST", "Total", "Status", "Date"],
      ...reimbursements.map(reimb => [
        reimb.employeeId,
        reimb.employeeName,
        reimb.category,
        reimb.amount.toString(),
        reimb.gst.toString(),
        reimb.totalAmount.toString(),
        reimb.status,
        reimb.expenseDate
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reimbursements-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee payroll and reimbursements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewHistory}>
            <Clock className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payroll" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payroll">
            <Users className="w-4 h-4 mr-2" />
            Payroll ({stats.totalEmployees})
          </TabsTrigger>
          <TabsTrigger value="reimbursements">
            <Receipt className="w-4 h-4 mr-2" />
            Reimbursements ({reimbursementStats.pendingClaims} Pending)
          </TabsTrigger>
        </TabsList>

        {/* PAYROLL TAB */}
        <TabsContent value="payroll" className="space-y-6">
          {/* Pay Period Info */}
          <Card className="bg-primary/5 border-primary/20 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('pay-period')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Current Pay Period</p>
                    <h3>{payPeriod.start} - {payPeriod.end}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Payment Date</p>
                  <h3 className="text-primary">{payPeriod.paymentDate}</h3>
                </div>
                <div className="flex gap-2">
                  {payrollApproved ? (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-warning text-warning-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Approval
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('total-employees')}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                    <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('total-hours')}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold">{stats.totalHours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('gross-pay')}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Gross Pay</p>
                    <p className="text-2xl font-bold">${stats.totalGrossPay.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('net-pay')}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Net Pay</p>
                    <p className="text-2xl font-bold">${stats.totalNetPay.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No employees found</p>
                  <p className="text-sm text-muted-foreground">Employee payroll data will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{employee.hoursWorked}</TableCell>
                        <TableCell>${employee.grossPay.toLocaleString()}</TableCell>
                        <TableCell>${employee.netPay.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* REIMBURSEMENTS TAB */}
        <TabsContent value="reimbursements" className="space-y-6">
          {/* Reimbursement Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleReimbursementStatsClick('total-claims')}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Receipt className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Claims</p>
                    <p className="text-2xl font-bold">{reimbursementStats.totalClaims}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleReimbursementStatsClick('pending')}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{reimbursementStats.pendingClaims}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleReimbursementStatsClick('total-amount')}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">${reimbursementStats.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleReimbursementStatsClick('gst-claimable')}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">GST Claimable</p>
                    <p className="text-2xl font-bold">${reimbursementStats.gstClaimable.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reimbursements Table */}
          <Card>
            <CardHeader>
              <CardTitle>Reimbursement Claims</CardTitle>
            </CardHeader>
            <CardContent>
              {reimbursements.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reimbursement claims found</p>
                  <p className="text-sm text-muted-foreground">Reimbursement claims will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReimbursements.map((reimbursement) => (
                      <TableRow key={reimbursement.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reimbursement.employeeName}</p>
                            <p className="text-sm text-muted-foreground">{reimbursement.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{reimbursement.category}</TableCell>
                        <TableCell>${reimbursement.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              reimbursement.status === "approved"
                                ? "default"
                                : reimbursement.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {reimbursement.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{reimbursement.expenseDate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
