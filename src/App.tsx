import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./components/ui/button";
import { Moon, Sun, Home, Users, Clipboard, FileText, Wrench, Calendar, FileCheck, Mail, Smartphone, Search, DollarSign, Menu, Upload, CheckSquare, Wallet, Clock } from "lucide-react";
import companyLogo from "figma:asset/283027b090530df720ee88d43a780fd9aee6b0ad.png";
// Firebase removed

// Import all screens
import { AuthScreen, RetailerTeam } from "./components/screens/AuthScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { SubcontractorDashboard } from "./components/screens/SubcontractorDashboard";
import { InspectorDashboard } from "./components/screens/InspectorDashboard";
import { LeadsCRMScreen } from "./components/screens/LeadsCRMScreen";
import { SiteVisitScreen } from "./components/screens/SiteVisitScreen";
import { OnFieldSiteVisitScreen } from "./components/screens/OnFieldSiteVisitScreen";
import { ProjectManagementSiteVisitScreen } from "./components/screens/ProjectManagementSiteVisitScreen";
import { SubcontractorSiteVisitScreen } from "./components/screens/SubcontractorSiteVisitScreen";
import { ProjectManagementScreen } from "./components/screens/ProjectManagementScreen";
import { RebateComplianceScreen } from "./components/screens/RebateComplianceScreen";
import { InstallationDayScreen } from "./components/screens/InstallationDayScreen";
import { OnFieldCalendarScreen } from "./components/screens/OnFieldCalendarScreen";
import { InspectionScreen } from "./components/screens/InspectionScreen";
import { BillingPaymentsScreen } from "./components/screens/BillingPaymentsScreen";
import { ResourceManagementScreen } from "./components/screens/ResourceManagementScreen";
import { ApprovalsScreen } from "./components/screens/ApprovalsScreen";
import { PayrollScreen } from "./components/screens/PayrollScreen";
import { AttendanceScreen } from "./components/screens/AttendanceScreen";

const SESSION_STORAGE_KEY = "xtr_session";
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

type SessionSnapshot = {
  userRole: UserRole;
  retailerTeam: RetailerTeam | null;
  userEmail: string;
  currentScreen: Screen;
  lastActive: number;
};

const readStoredSession = (): SessionSnapshot | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) || {};
    const storedRole = parsed.userRole as UserRole | undefined;
    if (!storedRole) {
      return null;
    }
    const storedLastActive = typeof parsed.lastActive === "number" ? parsed.lastActive : 0;
    if (!storedLastActive || Date.now() - storedLastActive >= IDLE_TIMEOUT_MS) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    const restoredTeam = storedRole === "retailer" ? (parsed.retailerTeam as RetailerTeam | null | undefined) ?? null : null;
    const restoredEmail = typeof parsed.userEmail === "string" ? parsed.userEmail : "";
    const restoredScreen = (parsed.currentScreen as Screen) || "dashboard";

    return {
      userRole: storedRole,
      retailerTeam: restoredTeam,
      userEmail: restoredEmail,
      currentScreen: restoredScreen,
      lastActive: storedLastActive,
    };
  } catch (error) {
    console.error("Failed to parse stored session", error);
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (cleanupError) {
      console.error("Failed to clear invalid session", cleanupError);
    }
    return null;
  }
};

type Screen =
  | "auth"
  | "dashboard"
  | "leads-crm"
  | "site-visit"
  | "subcontractor-site-visit"
  | "project-management"
  | "rebate"
  | "installation"
  | "on-field-calendar"
  | "inspection"
  | "billing"
  | "resources"
  | "approvals"
  | "payroll"
  | "attendance";

type UserRole = "retailer" | "subcontractor" | "inspector";

function App() {
  const storedSessionRef = useRef<SessionSnapshot | null>(null);
  if (storedSessionRef.current === null && typeof window !== "undefined") {
    storedSessionRef.current = readStoredSession();
  }
  const initialSession = storedSessionRef.current;

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => initialSession?.currentScreen ?? "auth");
  const [userRole, setUserRole] = useState<UserRole | null>(() => initialSession?.userRole ?? null);
  const [retailerTeam, setRetailerTeam] = useState<RetailerTeam | null>(() => initialSession?.retailerTeam ?? null);
  const [userEmail, setUserEmail] = useState<string>(() => initialSession?.userEmail ?? "");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Firebase removed

  // Firebase removed

  // (Rolled back) no Firebase auth persistence

  const lastActivityRef = useRef<number>(initialSession?.lastActive ?? Date.now());

  const handleLogout = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to clear session", error);
    }
    storedSessionRef.current = null;
    setUserRole(null);
    setRetailerTeam(null);
    setUserEmail("");
    setCurrentScreen("auth");
    lastActivityRef.current = Date.now();
  }, []);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogin = (role: UserRole, team?: RetailerTeam, email?: string) => {
    console.log("Login attempt:", { role, team, email });
    const normalizedEmail = (email || "").trim();
    const lowerEmail = normalizedEmail.toLowerCase();

    let resolvedRole: UserRole = role;
    let resolvedTeam: RetailerTeam | null = role === "retailer" ? team ?? null : null;

    const enforceRetailerTeam = (expectedTeam: RetailerTeam, message: string) => {
      if (role !== "retailer" || team !== expectedTeam) {
        alert(message);
        resolvedRole = role;
        resolvedTeam = role === "retailer" ? team ?? null : null;
        return false;
      }
      resolvedRole = "retailer";
      resolvedTeam = expectedTeam;
      return true;
    };

    if (lowerEmail === "neil@xtechsrenewables.com.au") {
      if (!enforceRetailerTeam("project-management", "Access denied: This account is restricted to Project Management team. Please select Project Management to continue.")) {
        return;
      }
    } else if (lowerEmail === "james@xtechsrenewables.com.au") {
      if (!enforceRetailerTeam("sales", "Access denied: This account is restricted to Sales team. Please select Sales Team to continue.")) {
        return;
      }
    } else if (lowerEmail === "paperwork@xtechsrenewables.com.au") {
      if (!enforceRetailerTeam("operations", "Access denied: This account is restricted to Operations team. Please select Operations to continue.")) {
        return;
    }
    } else if (lowerEmail === "ashley@xtechsrenewables.com.au") {
      if (!enforceRetailerTeam("on-field", "Access denied: This account is restricted to On-Field team. Please select On-Field to continue.")) {
        return;
      }
    } else if (lowerEmail === "liam@xtechsrenewables.com.au") {
      if (!enforceRetailerTeam("on-field", "Access denied: This account is restricted to On-Field team. Please select On-Field to continue.")) {
        return;
      }
    }

    setUserRole(resolvedRole);
    if (resolvedRole === "retailer") {
      setRetailerTeam(resolvedTeam);
    } else {
      setRetailerTeam(null);
    }
    setUserEmail(normalizedEmail);
    console.log("User email set to:", normalizedEmail);
    setCurrentScreen("dashboard");

    const now = Date.now();
    lastActivityRef.current = now;
    const sessionPayload = {
      userRole: resolvedRole,
      retailerTeam: resolvedRole === "retailer" ? resolvedTeam : null,
      userEmail: normalizedEmail,
      currentScreen: "dashboard" as Screen,
      lastActive: now,
    };
    storedSessionRef.current = sessionPayload;
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
    } catch (error) {
      console.error("Failed to persist session", error);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored);
      if (!parsed || !parsed.userRole) {
        return;
      }
      const storedLastActive = typeof parsed.lastActive === "number" ? parsed.lastActive : 0;
      if (Date.now() - storedLastActive >= IDLE_TIMEOUT_MS) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return;
      }
      const restoredRole = parsed.userRole as UserRole;
      const restoredTeam = restoredRole === "retailer" ? (parsed.retailerTeam as RetailerTeam | null | undefined) ?? null : null;
      let restoredScreen = (parsed.currentScreen as Screen) || "dashboard";
      const restoredEmail = typeof parsed.userEmail === "string" ? parsed.userEmail : "";
      
      // Project Management screen is available - no redirect needed

      setUserRole(restoredRole);
      setRetailerTeam(restoredTeam);
      setUserEmail(restoredEmail);
      setCurrentScreen(restoredScreen);

      lastActivityRef.current = Date.now();
      const refreshedPayload = {
        userRole: restoredRole,
        retailerTeam: restoredTeam,
        userEmail: restoredEmail,
        currentScreen: restoredScreen,
        lastActive: lastActivityRef.current,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(refreshedPayload));
    } catch (error) {
      console.error("Failed to restore session", error);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  // Listen for navigation events from inner screens
  useEffect(() => {
    const onNav = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as string;
        if (!detail) return;
        if (detail === 'site-visit') {
          setCurrentScreen('site-visit');
          const now = Date.now();
          lastActivityRef.current = now;
          const payload = {
            userRole,
            retailerTeam: userRole === 'retailer' ? retailerTeam : null,
            userEmail,
            currentScreen: 'site-visit' as Screen,
            lastActive: now,
          } as SessionSnapshot;
          storedSessionRef.current = payload;
          try { window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload)); } catch {}
        } else if (detail === 'leads-crm') {
          setCurrentScreen('leads-crm');
          const now = Date.now();
          lastActivityRef.current = now;
          const payload = {
            userRole,
            retailerTeam: userRole === 'retailer' ? retailerTeam : null,
            userEmail,
            currentScreen: 'leads-crm' as Screen,
            lastActive: now,
          } as SessionSnapshot;
          storedSessionRef.current = payload;
          try { window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload)); } catch {}
        }
      } catch {}
    };
    window.addEventListener('xtr-nav', onNav as EventListener);
    return () => window.removeEventListener('xtr-nav', onNav as EventListener);
  }, [userRole, retailerTeam, userEmail]);

  useEffect(() => {
    if (!userRole) {
      return;
    }
    const now = Date.now();
    lastActivityRef.current = now;
    const payload = {
      userRole,
      retailerTeam: userRole === "retailer" ? retailerTeam : null,
      userEmail,
      currentScreen,
      lastActive: now,
    } as SessionSnapshot;
    storedSessionRef.current = payload;
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to persist session", error);
    }
  }, [userRole, retailerTeam, userEmail, currentScreen]);

  useEffect(() => {
    if (!userRole) {
      return;
    }

    const updateActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      const payload = {
        userRole,
        retailerTeam: userRole === "retailer" ? retailerTeam : null,
        userEmail,
        currentScreen,
        lastActive: now,
      } as SessionSnapshot;
      storedSessionRef.current = payload;
      try {
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
      } catch (error) {
        console.error("Failed to persist session", error);
      }
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
    ];

    activityEvents.forEach((eventName) => window.addEventListener(eventName, updateActivity));
    updateActivity();

    const intervalId = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current >= IDLE_TIMEOUT_MS) {
        window.clearInterval(intervalId);
        activityEvents.forEach((eventName) => window.removeEventListener(eventName, updateActivity));
        alert("You have been logged out due to inactivity.");
        handleLogout();
      }
    }, 60 * 1000);

    return () => {
    activityEvents.forEach((eventName) => window.removeEventListener(eventName, updateActivity));
    window.clearInterval(intervalId);
  };
}, [userRole, retailerTeam, userEmail, currentScreen, handleLogout]);

  // Navigation items based on user role and team
  const getNavItems = () => {
    if (userRole === "retailer") {
      const allItems = [
        { id: "dashboard" as Screen, label: "Dashboard", icon: Home, teams: ["sales", "on-field", "project-management", "operations"] },
        { id: "leads-crm" as Screen, label: "Leads CRM", icon: Users, teams: ["sales"] },
        { id: "site-visit" as Screen, label: "Site Visit", icon: Search, teams: ["sales", "on-field", "project-management", "operations"] },
        { id: "subcontractor-site-visit" as Screen, label: "Retailer Site Visit", icon: Clipboard, teams: ["on-field"] },
        { id: "project-management" as Screen, label: "Project Management", icon: Calendar, teams: ["project-management", "operations"] },
        { id: "rebate" as Screen, label: "Rebate & Compliance", icon: FileCheck, teams: ["project-management"] },
        { id: "installation" as Screen, label: "Installation Day", icon: Wrench, teams: ["on-field"] },
        { id: "on-field-calendar" as Screen, label: "Calendar", icon: Calendar, teams: ["on-field"] },
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
  // Restrict Paperwork account to operations-only modules in UI
  const isPaperwork = userEmail?.toLowerCase() === "paperwork@xtechsrenewables.com.au";
  const operationsOnlyIds: Screen[] = [
    "dashboard",
    "project-management",
    "site-visit",
    "resources",
    "approvals",
    "payroll",
    "billing",
    "inspection",
    "attendance",
  ];
  const filteredNavItems = isPaperwork
    ? navItems.filter((item: any) => operationsOnlyIds.includes(item.id))
    : navItems;

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
        return <SiteVisitScreen userEmail={userEmail} />;
      case "subcontractor-site-visit":
        return <SubcontractorSiteVisitScreen />;
      case "project-management":
        return <ProjectManagementScreen />;
      case "rebate":
        return <RebateComplianceScreen />;
      case "installation":
        return <InstallationDayScreen />;
      case "on-field-calendar":
        return <OnFieldCalendarScreen />;
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
        return <AttendanceScreen userEmail={userEmail} department={
          retailerTeam === 'on-field' ? 'On-Field' :
          retailerTeam === 'project-management' ? 'Project Management' :
          retailerTeam === 'operations' ? 'Operations' :
          retailerTeam === 'sales' ? 'Sales' : undefined
        } />;
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
            {/* Firebase removed */}
            
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
              {filteredNavItems.map((item) => {
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
