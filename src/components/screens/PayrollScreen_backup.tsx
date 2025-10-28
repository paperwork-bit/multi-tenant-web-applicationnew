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

  // Sample employee payroll data
  const employees: EmployeePayroll[] = [];

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReimbursements = reimbursements.filter(reimb => {
      employeeId: "EMP001",
      role: "Senior Installer",
      payType: "hourly",
      hourlyRate: 45.50,
      hoursWorked: 42,
      regularHours: 38,
      overtimeHours: 4,
      grossPay: 2002.00,
      tax: 400.40,
      superannuation: 220.22,
      netPay: 1381.38,
      bankAccount: "123456789",
      bsb: "063-000"
    },
    {
      id: 2,
      name: "Mike Chen",
      employeeId: "EMP002",
      role: "Project Manager",
      payType: "salary",
      hoursWorked: 40,
      regularHours: 40,
      overtimeHours: 0,
      grossPay: 2115.38,
      tax: 529.85,
      superannuation: 232.69,
      netPay: 1352.84,
      bankAccount: "987654321",
      bsb: "063-000"
    },
    {
      id: 3,
      name: "Emily Davis",
      employeeId: "EMP003",
      role: "Sales Executive",
      payType: "salary",
      hoursWorked: 38,
      regularHours: 38,
      overtimeHours: 0,
      grossPay: 1923.08,
      tax: 480.77,
      superannuation: 211.54,
      netPay: 1230.77,
      bankAccount: "456789123",
      bsb: "063-000"
    },
    {
      id: 4,
      name: "James Wilson",
      employeeId: "EMP004",
      role: "Installer",
      payType: "hourly",
      hourlyRate: 38.00,
      hoursWorked: 40,
      regularHours: 38,
      overtimeHours: 2,
      grossPay: 1558.00,
      tax: 311.60,
      superannuation: 171.38,
      netPay: 1075.02,
      bankAccount: "789123456",
      bsb: "063-000"
    },
    {
      id: 5,
      name: "Lisa Anderson",
      employeeId: "EMP005",
      role: "Quality Inspector",
      payType: "hourly",
      hourlyRate: 42.00,
      hoursWorked: 38,
      regularHours: 38,
      overtimeHours: 0,
      grossPay: 1596.00,
      tax: 319.20,
      superannuation: 175.56,
      netPay: 1101.24,
      bankAccount: "321654987",
      bsb: "063-000"
    },
  ];

  // Sample reimbursement data
  const reimbursements: Reimbursement[] = [];
    {
      id: 1,
      employeeName: "Sarah Johnson",
      employeeId: "EMP001",
      category: "Travel",
      amount: 145.50,
      gst: 13.23,
      totalAmount: 158.73,
      description: "Client site visit - fuel and parking for Brisbane project",
      receiptAttached: true,
      submittedOn: "2025-10-14",
      expenseDate: "2025-10-12",
      status: "pending",
      bankAccount: "123456789",
      bsb: "063-000"
    },
    {
      id: 2,
      employeeName: "Mike Chen",
      employeeId: "EMP002",
      category: "Equipment",
      amount: 380.00,
      gst: 34.55,
      totalAmount: 414.55,
      description: "Safety gear and tools for installation team",
      receiptAttached: true,
      submittedOn: "2025-10-15",
      expenseDate: "2025-10-14",
      status: "pending",
      bankAccount: "987654321",
      bsb: "063-000"
    },
    {
      id: 3,
      employeeName: "Lisa Anderson",
      employeeId: "EMP005",
      category: "Training",
      amount: 650.00,
      gst: 59.09,
      totalAmount: 709.09,
      description: "Solar certification course - Level 2",
      receiptAttached: true,
      submittedOn: "2025-10-13",
      expenseDate: "2025-10-10",
      status: "pending",
      bankAccount: "321654987",
      bsb: "063-000"
    },
    {
      id: 4,
      employeeName: "James Wilson",
      employeeId: "EMP004",
      category: "Meals",
      amount: 85.50,
      gst: 7.77,
      totalAmount: 93.27,
      description: "Client lunch meeting - Gold Coast",
      receiptAttached: true,
      submittedOn: "2025-10-14",
      expenseDate: "2025-10-13",
      status: "pending",
      bankAccount: "789123456",
      bsb: "063-000"
    },
    {
      id: 5,
      employeeName: "Emily Davis",
      employeeId: "EMP003",
      category: "Travel",
      amount: 210.00,
      gst: 19.09,
      totalAmount: 229.09,
      description: "Return trip to Sunshine Coast for site assessment",
      receiptAttached: true,
      submittedOn: "2025-10-15",
      expenseDate: "2025-10-15",
      status: "pending",
      bankAccount: "456789123",
      bsb: "063-000"
    },
  ];

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
    totalGST: filteredReimbursements.reduce((sum, r) => sum + r.gst, 0),
  };

  const generateABAFile = () => {
    // Generate ABA file content
    const today = new Date();
    const processDate = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    let abaContent = '';
    
    // Descriptive Record (Type 0)
    const descriptiveRecord = [
      '0',                              // Record Type
      '                 ',              // Blank (17 spaces)
      '01',                             // Reel Sequence Number
      'WBC',                            // Financial Institution
      '        ',                       // Blank (7 spaces)
      'xTechs Renewables',              // User Preferred Name (26 chars)
      '999999',                         // User ID Number
      'Payroll',                        // Description (12 chars)
      processDate,                      // Process Date (DDMMYY)
      '                                        ', // Blank (40 spaces)
    ].join('');
    
    abaContent += descriptiveRecord.padEnd(120, ' ') + '\n';
    
    // Detail Records (Type 1) - One for each employee
    employees.forEach((emp, index) => {
      const detailRecord = [
        '1',                            // Record Type
        emp.bsb.replace('-', ''),       // BSB Number
        emp.bankAccount.padEnd(9, ' '), // Account Number
        ' ',                            // Indicator
        '50',                           // Transaction Code (50 = credit)
        Math.round(emp.netPay * 100).toString().padStart(10, '0'), // Amount in cents
        emp.name.padEnd(32, ' '),       // Account Name
        'Salary Payment'.padEnd(18, ' '), // Lodgement Reference
        'XTECHS'.padEnd(16, ' '),       // Trace BSB
        emp.employeeId.padEnd(16, ' '), // Trace Account
        'xTechs Ren'.padEnd(16, ' '),   // Name of Remitter
        Math.round(emp.tax * 100).toString().padStart(8, '0'), // Withholding Tax
      ].join('');
      
      abaContent += detailRecord.padEnd(120, ' ') + '\n';
    });
    
    // File Total Record (Type 7)
    const totalNetAmount = Math.round(stats.totalNetPay * 100);
    const totalTaxAmount = Math.round(stats.totalTax * 100);
    
    const fileTotalRecord = [
      '7',                              // Record Type
      '999-999',                        // BSB
      '            ',                   // Blank (12 spaces)
      totalNetAmount.toString().padStart(10, '0'), // Net Total
      totalNetAmount.toString().padStart(10, '0'), // Credit Total
      '0000000000',                     // Debit Total
      '                    ',           // Blank (24 spaces)
      employees.length.toString().padStart(6, '0'), // Number of records
      '                                        ', // Blank (40 spaces)
    ].join('');
    
    abaContent += fileTotalRecord.padEnd(120, ' ') + '\n';
    
    // Create and download the file
    const blob = new Blob([abaContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PAYROLL_${processDate}_XTECHS.aba`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleApprovePayroll = () => {
    setPayrollApproved(true);
    setShowApprovalDialog(false);
  };

  const viewEmployeeDetails = (employee: EmployeePayroll) => {
    setSelectedEmployee(employee);
    setShowEmployeeDialog(true);
  };

  const handleConnectXero = () => {
    setShowXeroDialog(true);
  };

  const confirmXeroConnection = () => {
    // Simulate Xero OAuth connection
    setTimeout(() => {
      setXeroConnected(true);
      setShowXeroDialog(false);
    }, 1000);
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
    }, 2000);
  };

  const disconnectXero = () => {
    setXeroConnected(false);
    setLastXeroSync(null);
    setLastReimbursementSync(null);
    setShowXeroDialog(false);
  };

  const viewReimbursementDetails = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement);
    setShowReimbursementDialog(true);
  };

  const handleApproveReimbursement = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement);
    setReimbursementAction("approve");
    setShowReimbursementApprovalDialog(true);
  };

  const handleRejectReimbursement = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement);
    setReimbursementAction("reject");
    setShowReimbursementApprovalDialog(true);
  };

  const confirmReimbursementAction = () => {
    // In real app, would update backend
    console.log(`${reimbursementAction} reimbursement:`, selectedReimbursement);
    setShowReimbursementApprovalDialog(false);
    setSelectedReimbursement(null);
  };

  const handleApproveAllReimbursements = () => {
    setReimbursementsApproved(true);
  };

  const handleSyncReimbursementsToXero = () => {
    setShowReimbursementXeroSyncDialog(true);
  };

  const confirmSyncReimbursementsToXero = () => {
    setXeroReimbursementSyncing(true);
    setShowReimbursementXeroSyncDialog(false);
    
    setTimeout(() => {
      setXeroReimbursementSyncing(false);
      setLastReimbursementSync(new Date());
    }, 2000);
  };

  const generateReimbursementABAFile = () => {
    const today = new Date();
    const processDate = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    let abaContent = '';
    
    // Descriptive Record
    const descriptiveRecord = [
      '0',
      '                 ',
      '01',
      'WBC',
      '        ',
      'xTechs Renewables',
      '999999',
      'Reimbursement',
      processDate,
      '                                        ',
    ].join('');
    
    abaContent += descriptiveRecord.padEnd(120, ' ') + '\n';
    
    // Detail Records
    filteredReimbursements.forEach((reimb) => {
      const detailRecord = [
        '1',
        reimb.bsb.replace('-', ''),
        reimb.bankAccount.padEnd(9, ' '),
        ' ',
        '50',
        Math.round(reimb.totalAmount * 100).toString().padStart(10, '0'),
        reimb.employeeName.padEnd(32, ' '),
        'Expense Reimb'.padEnd(18, ' '),
        'XTECHS'.padEnd(16, ' '),
        reimb.employeeId.padEnd(16, ' '),
        'xTechs Ren'.padEnd(16, ' '),
        '00000000',
      ].join('');
      
      abaContent += detailRecord.padEnd(120, ' ') + '\n';
    });
    
    // File Total Record
    const totalAmount = Math.round(reimbursementStats.totalAmount * 100);
    
    const fileTotalRecord = [
      '7',
      '999-999',
      '            ',
      totalAmount.toString().padStart(10, '0'),
      totalAmount.toString().padStart(10, '0'),
      '0000000000',
      '                    ',
      filteredReimbursements.length.toString().padStart(6, '0'),
      '                                        ',
    ].join('');
    
    abaContent += fileTotalRecord.padEnd(120, ' ') + '\n';
    
    const blob = new Blob([abaContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `REIMBURSEMENT_${processDate}_XTECHS.aba`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert("Reimbursement ABA file generated successfully!");
  };

  // New handler functions for enhanced functionality
  const handleStatsClick = (statType: string) => {
    setSelectedStatType(statType);
    setShowStatsDialog(true);
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    switch (cardType) {
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
      default:
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
    const data = employees.map(emp => ({
      'Employee Name': emp.name,
      'Employee ID': emp.employeeId,
      'Role': emp.role,
      'Pay Type': emp.payType,
      'Hours Worked': emp.hoursWorked,
      'Regular Hours': emp.regularHours,
      'Overtime Hours': emp.overtimeHours,
      'Gross Pay': emp.grossPay,
      'Tax': emp.tax,
      'Superannuation': emp.superannuation,
      'Net Pay': emp.netPay,
      'BSB': emp.bsb,
      'Account Number': emp.bankAccount
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const csvContent = data.map(row => Object.values(row).join(',')).join('\n');
      const fullContent = headers + '\n' + csvContent;
      
      const blob = new Blob([fullContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payroll_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    
    setShowExportDialog(false);
    alert(`Payroll data exported as ${format.toUpperCase()} successfully!`);
  };

  const exportReimbursementData = (format: string) => {
    const data = filteredReimbursements.map(reimb => ({
      'Employee Name': reimb.employeeName,
      'Employee ID': reimb.employeeId,
      'Category': reimb.category,
      'Amount': reimb.amount,
      'GST': reimb.gst,
      'Total Amount': reimb.totalAmount,
      'Description': reimb.description,
      'Receipt Attached': reimb.receiptAttached ? 'Yes' : 'No',
      'Expense Date': reimb.expenseDate,
      'Submitted On': reimb.submittedOn,
      'Status': reimb.status,
      'BSB': reimb.bsb,
      'Account Number': reimb.bankAccount
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const csvContent = data.map(row => Object.values(row).join(',')).join('\n');
      const fullContent = headers + '\n' + csvContent;
      
      const blob = new Blob([fullContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reimbursement_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    
    setShowExportDialog(false);
    alert(`Reimbursement data exported as ${format.toUpperCase()} successfully!`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll Management</h1>
          <p className="text-gray-600">Process weekly payroll for all employees</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleViewHistory}>
            <FileText className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {!xeroConnected ? (
            <Button 
              onClick={handleConnectXero}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link2 className="w-4 h-4 mr-2" />
              Connect Xero
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleSyncToXero}
                disabled={!payrollApproved || xeroSyncing}
                className="bg-secondary hover:bg-secondary/90"
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
            </>
          )}
          
          {!payrollApproved ? (
            <Button 
              onClick={() => setShowApprovalDialog(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Payroll
            </Button>
          ) : (
            <Button 
              onClick={generateABAFile}
              className="bg-success hover:bg-success/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Generate ABA File
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
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
              {xeroConnected && (
                <Badge className="bg-secondary text-secondary-foreground">
                  <Link2 className="w-3 h-3 mr-1" />
                  Xero Connected
                </Badge>
              )}
            </div>
          </div>
          {xeroConnected && lastXeroSync && (
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Last Xero sync: {lastXeroSync.toLocaleString('en-AU', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleConnectXero}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Connection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('employees')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Employees</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalEmployees}</h3>
                <p className="text-sm text-blue-600">Active payroll</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('hours')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Hours</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalHours}</h3>
                <p className="text-sm text-purple-600">This period</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('gross-pay')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Gross Pay</p>
                <h3 className="text-2xl font-bold mt-2">${stats.totalGrossPay.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-sm text-green-600">Before deductions</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('net-pay')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Net Pay</p>
                <h3 className="text-2xl font-bold mt-2">${stats.totalNetPay.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-sm text-indigo-600">Final payout</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Pay Type</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Regular</TableHead>
                <TableHead className="text-right">Overtime</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Super</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <p>{employee.name}</p>
                      <p className="text-muted-foreground">{employee.role}</p>
                    </div>
                  </TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {employee.payType === "hourly" ? `$${employee.hourlyRate}/hr` : "Salary"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{employee.hoursWorked}h</TableCell>
                  <TableCell className="text-right">{employee.regularHours}h</TableCell>
                  <TableCell className="text-right">
                    {employee.overtimeHours > 0 ? (
                      <span className="text-warning">{employee.overtimeHours}h</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    ${employee.grossPay.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    ${employee.tax.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    ${employee.superannuation.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    ${employee.netPay.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewEmployeeDetails(employee)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3}><strong>TOTAL</strong></TableCell>
                <TableCell className="text-right"><strong>{stats.totalHours}h</strong></TableCell>
                <TableCell colSpan={2}></TableCell>
                <TableCell className="text-right">
                  <strong>${stats.totalGrossPay.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </TableCell>
                <TableCell className="text-right">
                  <strong>${stats.totalTax.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </TableCell>
                <TableCell className="text-right">
                  <strong>${stats.totalSuper.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </TableCell>
                <TableCell className="text-right">
                  <strong>${stats.totalNetPay.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('payroll-summary')}>
          <CardHeader>
            <CardTitle>Payroll Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Gross Pay</span>
              <span>${stats.totalGrossPay.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tax Withheld</span>
              <span className="text-destructive">-${stats.totalTax.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Superannuation</span>
              <span className="text-secondary">${stats.totalSuper.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span>Total Net Pay</span>
              <span className="text-success">${stats.totalNetPay.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('xero-integration')}>
          <CardHeader>
            <CardTitle>Xero Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {xeroConnected ? (
              <>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Connected to Xero</span>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Sync payroll data directly to Xero accounting software.</p>
                  {lastXeroSync && (
                    <p className="text-muted-foreground">Last synced: {lastXeroSync.toLocaleDateString('en-AU')}</p>
                  )}
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Organisation</p>
                  <p>xTechs Renewables Pty Ltd</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-5 h-5" />
                  <span>Not Connected</span>
                </div>
                <p className="text-muted-foreground">Connect to Xero to automatically sync payroll data and streamline your accounting.</p>
                <Button 
                  onClick={handleConnectXero}
                  className="w-full"
                  variant="outline"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect to Xero
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('aba-file')}>
          <CardHeader>
            <CardTitle>ABA File Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <FileText className="w-5 h-5 text-primary mt-1" />
              <div>
                <p>Download ABA file for direct bank upload.</p>
                <p className="text-muted-foreground mt-1">Contains {employees.length} payment records.</p>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Payment Method</p>
              <p>Electronic Funds Transfer (EFT)</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">File Format</p>
              <p>Australian Banking Association (ABA)</p>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        {/* REIMBURSEMENTS TAB */}
        <TabsContent value="reimbursements" className="space-y-6">
          {/* Reimbursement Period Info */}
          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Receipt className="w-8 h-8 text-secondary" />
                  <div>
                    <p className="text-muted-foreground">Reimbursement Processing</p>
                    <h3>Every 2 Days Payment Cycle</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Next Payment</p>
                  <h3 className="text-secondary">Tuesday, 22 October 2025</h3>
                </div>
                <div className="flex gap-2">
                  {reimbursementsApproved ? (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-warning text-warning-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {reimbursementStats.pendingClaims} Pending
                    </Badge>
                  )}
                  {xeroConnected && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      <Link2 className="w-3 h-3 mr-1" />
                      Xero Connected
                    </Badge>
                  )}
                </div>
              </div>
              {xeroConnected && lastReimbursementSync && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Last Xero sync: {lastReimbursementSync.toLocaleString('en-AU', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSyncReimbursementsToXero}
                      disabled={!reimbursementsApproved || xeroReimbursementSyncing}
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90"
                    >
                      {xeroReimbursementSyncing ? (
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
                    {reimbursementsApproved && (
                      <Button 
                        onClick={generateReimbursementABAFile}
                        size="sm"
                        className="bg-success hover:bg-success/90"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generate ABA
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reimbursement Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleReimbursementStatsClick('total-claims')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Claims</p>
                    <h3 className="text-2xl font-bold mt-2">{reimbursementStats.totalClaims}</h3>
                    <p className="text-sm text-blue-600">All submissions</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleReimbursementStatsClick('pending')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Pending</p>
                    <h3 className="text-2xl font-bold mt-2">{reimbursementStats.pendingClaims}</h3>
                    <p className="text-sm text-orange-600">Awaiting approval</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleReimbursementStatsClick('total-amount')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <h3 className="text-2xl font-bold mt-2">${reimbursementStats.totalAmount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-sm text-green-600">Including GST</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleReimbursementStatsClick('gst-claimable')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">GST Claimable</p>
                    <h3 className="text-2xl font-bold mt-2">${reimbursementStats.totalGST.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-sm text-purple-600">Tax refund</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Reimbursements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by employee or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Meals">Meals</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reimbursement Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reimbursement Claims</CardTitle>
                {!reimbursementsApproved && reimbursementStats.pendingClaims > 0 && (
                  <Button 
                    onClick={handleApproveAllReimbursements}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve All Pending
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Expense Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">GST</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReimbursements.map((reimb) => (
                    <TableRow key={reimb.id}>
                      <TableCell>
                        <div>
                          <p>{reimb.employeeName}</p>
                          <p className="text-muted-foreground">{reimb.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{reimb.category}</Badge>
                      </TableCell>
                      <TableCell>{new Date(reimb.expenseDate).toLocaleDateString('en-AU')}</TableCell>
                      <TableCell className="text-right">
                        ${reimb.amount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        ${reimb.gst.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        ${reimb.totalAmount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {reimb.receiptAttached ? (
                          <Badge className="bg-success text-success-foreground">
                            <FileText className="w-3 h-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {reimb.status === "pending" && (
                          <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                        )}
                        {reimb.status === "approved" && (
                          <Badge className="bg-success text-success-foreground">Approved</Badge>
                        )}
                        {reimb.status === "rejected" && (
                          <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewReimbursementDetails(reimb)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {reimb.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveReimbursement(reimb)}
                                className="text-success hover:text-success"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRejectReimbursement(reimb)}
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReimbursements.length > 0 && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={3}><strong>TOTAL</strong></TableCell>
                      <TableCell className="text-right">
                        <strong>${filteredReimbursements.reduce((sum, r) => sum + r.amount, 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })}</strong>
                      </TableCell>
                      <TableCell className="text-right">
                        <strong>${reimbursementStats.totalGST.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</strong>
                      </TableCell>
                      <TableCell className="text-right">
                        <strong>${reimbursementStats.totalAmount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</strong>
                      </TableCell>
                      <TableCell colSpan={3}></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payroll</DialogTitle>
            <DialogDescription>
              Please review the payroll details before approval
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pay Period:</span>
                <span>{payPeriod.start} - {payPeriod.end}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Date:</span>
                <span className="text-primary">{payPeriod.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Employees:</span>
                <span>{stats.totalEmployees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Net Payment:</span>
                <span className="text-success">${stats.totalNetPay.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="p-4 border-l-4 border-warning bg-warning/10 rounded">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p>Once approved, you can generate the ABA file for bank processing.</p>
                  <p className="text-muted-foreground mt-1">Make sure all employee hours and rates are correct.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprovePayroll}
              className="bg-success hover:bg-success/90"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Payroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Payroll Details</DialogTitle>
            <DialogDescription>
              {selectedEmployee?.name} ({selectedEmployee?.employeeId})
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={selectedEmployee.role} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Pay Type</Label>
                  <Input value={selectedEmployee.payType === "hourly" ? `Hourly ($${selectedEmployee.hourlyRate}/hr)` : "Salary"} disabled />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Total Hours</Label>
                  <Input value={`${selectedEmployee.hoursWorked}h`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Regular Hours</Label>
                  <Input value={`${selectedEmployee.regularHours}h`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Overtime Hours</Label>
                  <Input value={`${selectedEmployee.overtimeHours}h`} disabled />
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Pay</span>
                  <span>${selectedEmployee.grossPay.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Withheld</span>
                  <span className="text-destructive">-${selectedEmployee.tax.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Superannuation (11%)</span>
                  <span className="text-secondary">${selectedEmployee.superannuation.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span>Net Pay</span>
                  <span className="text-success">${selectedEmployee.netPay.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>BSB</Label>
                  <Input value={selectedEmployee.bsb} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input value={selectedEmployee.bankAccount} disabled />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowEmployeeDialog(false)}>
              Close
            </Button>
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
                ? "Manage your Xero integration settings" 
                : "Connect your Xero account to sync payroll data automatically"
              }
            </DialogDescription>
          </DialogHeader>

          {xeroConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 text-success mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Successfully Connected</span>
                </div>
                <p className="text-muted-foreground">Your Xero account is connected and ready to sync.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Organisation</p>
                  <p>xTechs Renewables Pty Ltd</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Connected Account</p>
                  <p>admin@xtechsrenewables.com.au</p>
                </div>
                {lastXeroSync && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Last Sync</p>
                    <p>{lastXeroSync.toLocaleString('en-AU', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-l-4 border-warning bg-warning/10 rounded">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p>Disconnecting will stop automatic payroll sync.</p>
                    <p className="text-muted-foreground mt-1">You can reconnect at any time.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4>Benefits of Xero Integration:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Automatic payroll data sync</li>
                  <li>• Real-time accounting updates</li>
                  <li>• Reduced manual data entry</li>
                  <li>• Seamless tax and super reporting</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-primary bg-primary/10 rounded">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p>You'll be redirected to Xero to authorize the connection.</p>
                    <p className="text-muted-foreground mt-1">Make sure you have admin access to your Xero account.</p>
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
                  className="bg-secondary hover:bg-secondary/90"
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
            <DialogTitle>Sync Payroll to Xero</DialogTitle>
            <DialogDescription>
              Send this payroll period's data to Xero accounting software
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pay Period:</span>
                <span>{payPeriod.start} - {payPeriod.end}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Employees:</span>
                <span>{stats.totalEmployees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Pay:</span>
                <span>${stats.totalGrossPay.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Pay:</span>
                <span className="text-success">${stats.totalNetPay.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4>What will be synced:</h4>
              <ul className="space-y-1 text-muted-foreground ml-5">
                <li>• Employee pay run details</li>
                <li>• Tax withholding (PAYG)</li>
                <li>• Superannuation contributions</li>
                <li>• Leave accruals and balances</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-secondary bg-secondary/10 rounded">
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p>Data will be posted to your Xero organisation.</p>
                  <p className="text-muted-foreground mt-1">This may take a few moments to complete.</p>
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
              className="bg-secondary hover:bg-secondary/90"
            >
              <CloudUpload className="w-4 h-4 mr-2" />
              Sync to Xero
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reimbursement Details Dialog */}
      <Dialog open={showReimbursementDialog} onOpenChange={setShowReimbursementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reimbursement Details</DialogTitle>
            <DialogDescription>
              {selectedReimbursement?.employeeName} ({selectedReimbursement?.employeeId})
            </DialogDescription>
          </DialogHeader>

          {selectedReimbursement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={selectedReimbursement.category} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Expense Date</Label>
                  <Input value={new Date(selectedReimbursement.expenseDate).toLocaleDateString('en-AU')} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={selectedReimbursement.description} disabled />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Amount (excl GST)</Label>
                  <Input value={`${selectedReimbursement.amount.toFixed(2)}`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>GST</Label>
                  <Input value={`${selectedReimbursement.gst.toFixed(2)}`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input value={`${selectedReimbursement.totalAmount.toFixed(2)}`} disabled className="font-semibold" />
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt Attached</span>
                  <span>{selectedReimbursement.receiptAttached ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted On</span>
                  <span>{new Date(selectedReimbursement.submittedOn).toLocaleDateString('en-AU')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">{selectedReimbursement.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>BSB</Label>
                  <Input value={selectedReimbursement.bsb} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input value={selectedReimbursement.bankAccount} disabled />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowReimbursementDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reimbursement Approval/Rejection Dialog */}
      <Dialog open={showReimbursementApprovalDialog} onOpenChange={setShowReimbursementApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reimbursementAction === "approve" ? "Approve Reimbursement" : "Reject Reimbursement"}
            </DialogTitle>
            <DialogDescription>
              {selectedReimbursement?.employeeName} - ${selectedReimbursement?.totalAmount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          {selectedReimbursement && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{selectedReimbursement.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>${selectedReimbursement.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="text-right">{selectedReimbursement.description}</span>
                </div>
              </div>

              <div className={`p-4 border-l-4 rounded ${
                reimbursementAction === "approve" 
                  ? "border-success bg-success/10" 
                  : "border-destructive bg-destructive/10"
              }`}>
                <div className="flex gap-2">
                  {reimbursementAction === "approve" ? (
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p>
                      {reimbursementAction === "approve" 
                        ? "This reimbursement will be included in the next payment run." 
                        : "This reimbursement will be rejected and returned to the employee."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReimbursementApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmReimbursementAction}
              className={reimbursementAction === "approve" 
                ? "bg-success hover:bg-success/90" 
                : "bg-destructive hover:bg-destructive/90"}
            >
              {reimbursementAction === "approve" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reimbursement Xero Sync Dialog */}
      <Dialog open={showReimbursementXeroSyncDialog} onOpenChange={setShowReimbursementXeroSyncDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync Reimbursements to Xero</DialogTitle>
            <DialogDescription>
              Send approved reimbursements to Xero accounting software
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Claims:</span>
                <span>{reimbursementStats.totalClaims}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span>${reimbursementStats.totalAmount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST Claimable:</span>
                <span className="text-secondary">${reimbursementStats.totalGST.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4>What will be synced:</h4>
              <ul className="space-y-1 text-muted-foreground ml-5">
                <li>• Employee expense claims</li>
                <li>• GST calculations</li>
                <li>• Receipt attachments</li>
                <li>• Expense categories</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-secondary bg-secondary/10 rounded">
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p>Reimbursements will be posted to Xero as expense claims.</p>
                  <p className="text-muted-foreground mt-1">This enables accurate GST reporting and accounting.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReimbursementXeroSyncDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmSyncReimbursementsToXero}
              className="bg-secondary hover:bg-secondary/90"
            >
              <CloudUpload className="w-4 h-4 mr-2" />
              Sync to Xero
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Payroll Statistics - {selectedStatType}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStatType === 'employees' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Employee Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {employees.map((emp) => (
                        <div key={emp.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-sm text-gray-600">{emp.role} - {emp.employeeId}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{emp.hoursWorked}h</p>
                            <p className="text-sm text-gray-600">${emp.netPay.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'hours' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hours Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{employees.reduce((sum, emp) => sum + emp.regularHours, 0)}</div>
                        <p className="text-sm text-gray-600">Regular Hours</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{employees.reduce((sum, emp) => sum + emp.overtimeHours, 0)}</div>
                        <p className="text-sm text-gray-600">Overtime Hours</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {employees.map((emp) => (
                        <div key={emp.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-sm text-gray-600">{emp.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{emp.hoursWorked}h total</p>
                            <p className="text-sm text-gray-600">{emp.regularHours}h reg + {emp.overtimeHours}h OT</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'gross-pay' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gross Pay Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">${stats.totalGrossPay.toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Total Gross Pay</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">${(stats.totalGrossPay / stats.totalEmployees).toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Average per Employee</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {employees.map((emp) => (
                        <div key={emp.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-sm text-gray-600">{emp.payType === 'hourly' ? `$${emp.hourlyRate}/hr` : 'Salary'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${emp.grossPay.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{emp.hoursWorked}h worked</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'net-pay' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Net Pay Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">${stats.totalNetPay.toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Total Net Pay</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">${stats.totalTax.toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Total Tax</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">${stats.totalSuper.toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Total Super</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {employees.map((emp) => (
                        <div key={emp.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-sm text-gray-600">Gross: ${emp.grossPay.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${emp.netPay.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">Tax: ${emp.tax.toFixed(2)} | Super: ${emp.superannuation.toFixed(2)}</p>
                          </div>
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

      {/* Reimbursement Stats Dialog */}
      <Dialog open={showReimbursementStatsDialog} onOpenChange={setShowReimbursementStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Reimbursement Statistics - {selectedStatType}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStatType === 'total-claims' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">All Claims Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredReimbursements.map((reimb) => (
                        <div key={reimb.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{reimb.employeeName}</p>
                            <p className="text-sm text-gray-600">{reimb.category} - {reimb.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${reimb.totalAmount.toFixed(2)}</p>
                            <Badge className={reimb.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                                           reimb.status === 'approved' ? 'bg-green-100 text-green-600' : 
                                           'bg-red-100 text-red-600'}>
                              {reimb.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'pending' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pending Claims</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredReimbursements.filter(r => r.status === 'pending').map((reimb) => (
                        <div key={reimb.id} className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                          <div>
                            <p className="font-medium">{reimb.employeeName}</p>
                            <p className="text-sm text-gray-600">{reimb.category} - {new Date(reimb.submittedOn).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${reimb.totalAmount.toFixed(2)}</p>
                            <p className="text-sm text-orange-600">Awaiting approval</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'total-amount' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Amount Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">${reimbursementStats.totalAmount.toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">${(reimbursementStats.totalAmount / reimbursementStats.totalClaims).toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Average per Claim</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {filteredReimbursements.map((reimb) => (
                        <div key={reimb.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{reimb.employeeName}</p>
                            <p className="text-sm text-gray-600">{reimb.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${reimb.totalAmount.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">GST: ${reimb.gst.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'gst-claimable' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">GST Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">${reimbursementStats.totalGST.toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Total GST Claimable</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{((reimbursementStats.totalGST / reimbursementStats.totalAmount) * 100).toFixed(1)}%</div>
                        <p className="text-sm text-gray-600">GST Percentage</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {filteredReimbursements.map((reimb) => (
                        <div key={reimb.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{reimb.employeeName}</p>
                            <p className="text-sm text-gray-600">{reimb.category} - ${reimb.amount.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-purple-600">${reimb.gst.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">GST Component</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReimbursementStatsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Payroll Data</DialogTitle>
            <DialogDescription>
              Choose the format and type of data to export
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => exportPayrollData('csv')} className="h-20 flex-col">
                <FileText className="w-8 h-8 mb-2" />
                Export Payroll CSV
              </Button>
              <Button onClick={() => exportReimbursementData('csv')} className="h-20 flex-col" variant="outline">
                <Receipt className="w-8 h-8 mb-2" />
                Export Reimbursements CSV
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Payroll History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Payroll Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Pay Period: 22 Oct - 28 Oct 2025</p>
                      <p className="text-sm text-gray-600">5 employees - $6,141.25 net pay</p>
                    </div>
                    <Badge className="bg-green-100 text-green-600">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Pay Period: 15 Oct - 21 Oct 2025</p>
                      <p className="text-sm text-gray-600">5 employees - $5,987.50 net pay</p>
                    </div>
                    <Badge className="bg-green-100 text-green-600">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Pay Period: 08 Oct - 14 Oct 2025</p>
                      <p className="text-sm text-gray-600">5 employees - $6,234.75 net pay</p>
                    </div>
                    <Badge className="bg-green-100 text-green-600">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4</div>
                    <p className="text-sm text-gray-600">Pay Runs This Month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$24,503.50</div>
                    <p className="text-sm text-gray-600">Total Net Pay</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$8,167.83</div>
                    <p className="text-sm text-gray-600">Total Tax & Super</p>
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

      {/* Pay Period Dialog */}
      <Dialog open={showPayPeriodDialog} onOpenChange={setShowPayPeriodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Period Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pay Period:</span>
                  <span className="font-medium">{payPeriod.start} - {payPeriod.end}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium text-blue-600">{payPeriod.paymentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {payrollApproved ? (
                    <Badge className="bg-green-100 text-green-600">Approved</Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-600">Pending Approval</Badge>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Employees:</span>
                  <span className="font-medium">{stats.totalEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{stats.totalHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Payment:</span>
                  <span className="font-medium text-green-600">${stats.totalNetPay.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayPeriodDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payroll Summary Dialog */}
      <Dialog open={showPayrollSummaryDialog} onOpenChange={setShowPayrollSummaryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detailed Payroll Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Gross Pay</span>
                  <span className="font-medium">${stats.totalGrossPay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Total Tax Withheld</span>
                  <span>-${stats.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Total Superannuation</span>
                  <span>${stats.totalSuper.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total Net Pay</span>
                  <span className="text-green-600">${stats.totalNetPay.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employee Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {employees.map((emp) => (
                    <div key={emp.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{emp.name}</span>
                      <span className="text-sm font-medium">${emp.netPay.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayrollSummaryDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Xero Integration Dialog */}
      <Dialog open={showXeroIntegrationDialog} onOpenChange={setShowXeroIntegrationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xero Integration Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {xeroConnected ? (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-green-600 mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Connected to Xero</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Organisation:</span>
                      <span>xTechs Renewables Pty Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connected Account:</span>
                      <span>admin@xtechsrenewables.com.au</span>
                    </div>
                    {lastXeroSync && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Sync:</span>
                        <span>{lastXeroSync.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Payroll data is automatically synced to Xero after approval, including employee pay runs, tax withholding, and superannuation contributions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Not Connected</span>
                  </div>
                  <p className="text-gray-600">Connect to Xero to automatically sync payroll data and streamline your accounting processes.</p>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Benefits:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Automatic payroll data sync</li>
                      <li>• Real-time accounting updates</li>
                      <li>• Reduced manual data entry</li>
                      <li>• Seamless tax and super reporting</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowXeroIntegrationDialog(false)}>Close</Button>
            {!xeroConnected && (
              <Button onClick={handleConnectXero}>Connect to Xero</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ABA File Dialog */}
      <Dialog open={showABAFileDialog} onOpenChange={setShowABAFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ABA File Export Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Australian Banking Association Format</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Records:</span>
                    <span>{employees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">${stats.totalNetPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>Electronic Funds Transfer (EFT)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span>Westpac Banking Corporation</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    The ABA file contains all employee payment details in the standard banking format for direct upload to your bank's business banking platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowABAFileDialog(false)}>Close</Button>
            {payrollApproved && (
              <Button onClick={generateABAFile}>
                <Download className="w-4 h-4 mr-2" />
                Generate ABA File
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
