import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Moon, Sun, Home, Users, Clipboard, FileText, Wrench, Calendar, FileCheck, Mail, Smartphone, Search, DollarSign, Menu, Upload, CheckSquare, Wallet, Clock } from "lucide-react";
import companyLogo from "figma:asset/283027b090530df720ee88d43a780fd9aee6b0ad.png";
import { checkFirebaseConnection } from "./lib/firebase";

// Import all screens
import { AuthScreen, RetailerTeam } from "./components/screens/AuthScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { SubcontractorDashboard } from "./components/screens/SubcontractorDashboard";
import { InspectorDashboard } from "./components/screens/InspectorDashboard";
import { LeadsCRMScreen } from "./components/screens/LeadsCRMScreen";
import { SiteVisitScreen } from "./components/screens/SiteVisitScreen";
import { OnFieldSiteVisitScreen } from "./components/screens/OnFieldSiteVisitScreen";
import { ProjectManagementSiteVisitScreen } from "./components/screens/ProjectManagementSiteVisitScreen";
import { ProjectManagementScreen } from "./components/screens/ProjectManagementScreen";
import { RebateComplianceScreen } from "./components/screens/RebateComplianceScreen";
import { InstallationDayScreen } from "./components/screens/InstallationDayScreen";
import { InspectionScreen } from "./components/screens/InspectionScreen";
import { BillingPaymentsScreen } from "./components/screens/BillingPaymentsScreen";
import { ResourceManagementScreen } from "./components/screens/ResourceManagementScreen";
import { ApprovalsScreen } from "./components/screens/ApprovalsScreen";
import { PayrollScreen } from "./components/screens/PayrollScreen";
import { AttendanceScreen } from "./components/screens/AttendanceScreen";

type Screen =
  | "auth"
  | "dashboard"
  | "leads-crm"
  | "site-visit"
  | "project-management"
  | "rebate"
  | "installation"
  | "inspection"
  | "billing"
  | "resources"
  | "approvals"
  | "payroll"
  | "attendance";

type UserRole = "retailer" | "subcontractor" | "inspector";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [retailerTeam, setRetailerTeam] = useState<RetailerTeam | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Initialize Firebase on app start
  useEffect(() => {
    const initializeFirebase = () => {
      try {
        const isConnected = checkFirebaseConnection();
        setFirebaseConnected(isConnected);
        
        if (isConnected) {
          console.log('✅ Firebase connected successfully');
        } else {
          console.log('❌ Firebase connection failed');
        }
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setFirebaseConnected(false);
      }
    };

    initializeFirebase();
  }, []);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogin = (role: UserRole, team?: RetailerTeam, email?: string) => {
    console.log("Login attempt:", { role, team, email });
    setUserRole(role);
    if (role === "retailer" && team) {
      setRetailerTeam(team);
    }
    if (email) {
      setUserEmail(email);
      console.log("User email set to:", email);
    }
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setUserRole(null);
    setRetailerTeam(null);
    setUserEmail("");
    setCurrentScreen("auth");
  };

  // Navigation items based on user role and team
  const getNavItems = () => {
    if (userRole === "retailer") {
      const allItems = [
        { id: "dashboard" as Screen, label: "Dashboard", icon: Home, teams: ["sales", "on-field", "project-management", "operations"] },
        { id: "leads-crm" as Screen, label: "Leads CRM", icon: Users, teams: ["sales"] },
        { id: "site-visit" as Screen, label: "Site Visit", icon: Search, teams: ["sales", "on-field", "project-management", "operations"] },
        { id: "project-management" as Screen, label: "Project Management", icon: Calendar, teams: ["project-management", "operations"] },
        { id: "rebate" as Screen, label: "Rebate & Compliance", icon: FileCheck, teams: ["project-management"] },
        { id: "installation" as Screen, label: "Installation Day", icon: Wrench, teams: ["on-field"] },
        { id: "inspection" as Screen, label: "Inspection & Grid", icon: Search, teams: ["project-management", "operations"] },
        { id: "attendance" as Screen, label: "Attendance", icon: Clock, teams: ["sales", "on-field", "project-management", "operations"] },
        { id: "resources" as Screen, label: "Resource Management", icon: Users, teams: ["operations"] },
        { id: "approvals" as Screen, label: "Approvals", icon: CheckSquare, teams: ["operations"] },
        { id: "payroll" as Screen, label: "Payroll", icon: Wallet, teams: ["operations"] },
        { id: "billing" as Screen, label: "Billing & Payments", icon: DollarSign, teams: ["operations"] },
      ];

      // Filter based on retailer team
      if (retailerTeam) {
        return allItems
          .filter(item => item.teams.includes(retailerTeam))
          .map(({ teams, ...item }) => item);
      }
      
      return allItems.map(({ teams, ...item }) => item);
    } else if (userRole === "subcontractor") {
      return [
        { id: "dashboard" as Screen, label: "My Jobs", icon: Home },
        { id: "project-management" as Screen, label: "Schedule", icon: Calendar },
      ];
    } else if (userRole === "inspector") {
      return [
        { id: "dashboard" as Screen, label: "Inspections", icon: Home },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const renderScreen = () => {
    switch (currentScreen) {
      case "auth":
        return <AuthScreen onLogin={handleLogin} />;
      case "dashboard":
        if (userRole === "subcontractor") {
          return <SubcontractorDashboard />;
        } else if (userRole === "inspector") {
          return <InspectorDashboard />;
        }
        return <DashboardScreen retailerTeam={retailerTeam} />;
      case "leads-crm":
        return <LeadsCRMScreen userEmail={userEmail} />;
      case "site-visit":
        if (retailerTeam === "on-field") {
          return <OnFieldSiteVisitScreen />;
        } else if (retailerTeam === "project-management" || retailerTeam === "operations") {
          return <ProjectManagementSiteVisitScreen />;
        }
        return <SiteVisitScreen />;
      case "project-management":
        return <ProjectManagementScreen />;
      case "rebate":
        return <RebateComplianceScreen />;
      case "installation":
        return <InstallationDayScreen />;
      case "inspection":
        return <InspectionScreen />;
      case "billing":
        return <BillingPaymentsScreen />;
      case "resources":
        return <ResourceManagementScreen />;
      case "approvals":
        return <ApprovalsScreen />;
      case "payroll":
        return <PayrollScreen />;
      case "attendance":
        return <AttendanceScreen />;
      default:
        return <DashboardScreen retailerTeam={retailerTeam} />;
    }
  };

  if (currentScreen === "auth") {
    return (
      <div>
        <AuthScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img src={companyLogo} alt="xTechs Renewables" className="w-8 h-8" />
              <div>
                <h3>xTechs Renewables</h3>
                <p className="text-muted-foreground">Multi-tenant Solar Platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Firebase Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                Firebase {firebaseConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {userRole && (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-primary/10 rounded-lg">
                  <span className="text-primary capitalize">{userRole}</span>
                </div>
                {userRole === "retailer" && retailerTeam && (
                  <div className="px-3 py-1 bg-secondary/10 rounded-lg">
                    <span className="text-secondary capitalize">
                      {retailerTeam === "on-field" ? "On-Field" : retailerTeam === "project-management" ? "PM Team" : retailerTeam}
                    </span>
                  </div>
                )}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        {sidebarOpen && (
          <aside className="w-64 border-r bg-card min-h-[calc(100vh-73px)] sticky top-[73px]">
            <div className="p-4 border-b flex items-center gap-3">
              <img src={companyLogo} alt="xTechs Renewables" className="w-10 h-10 flex-shrink-0" />
              <h2>xTechs Renewables</h2>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentScreen === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentScreen(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">{renderScreen()}</main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-muted-foreground">© 2025 xTechs Renewables Pty Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Button variant="link" size="sm">Privacy Policy</Button>
            <Button variant="link" size="sm">Terms of Service</Button>
            <Button variant="link" size="sm">Support</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
