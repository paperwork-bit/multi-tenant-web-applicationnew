import React, { useEffect, useRef, useState, useRef as useReactRef } from "react";
import { db, firebaseEnabled } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  UserX, 
  Phone, 
  Mail, 
  Calendar,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
  Award,
  TrendingUp,
  Activity,
  FileText,
  Download,
  MessageSquare,
  Settings,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Shield,
  X,
  DollarSign
} from "lucide-react";

interface Resource {
  id: number;
  docId?: string; // Firestore document id (not used after rollback)
  name: string;
  role: string;
  department: string;
  employeeId: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  currentProject?: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  performance: number;
  completedProjects: number;
  certifications: string[];
  payRate: number;
  payType: 'hourly' | 'salary' | 'contract';
  weeklyHours: number;
  lastActive: string;
  availability: 'available' | 'busy' | 'unavailable';
  createdBy?: string;
}

export function ResourceManagementScreen() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // New dialog states
  const [showResourceDetails, setShowResourceDetails] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showPerformanceDialog, setShowPerformanceDialog] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [showReportsDialog, setShowReportsDialog] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState<string>("");
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  
  // Form state for new resource
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joinDate: "",
    skills: "",
    currentProject: "",
    role: "",
    department: "",
    employeeId: ""
  });

  // Reset form when dialog opens/closes
  const handleDialogChange = (open: boolean) => {
    setShowAddDialog(open);
    if (!open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        joinDate: "",
        skills: "",
        currentProject: "",
        role: "",
        department: "",
        employeeId: ""
      });
      setSelectedResource(null);
    } else if (selectedResource) {
      setFormData({
        name: selectedResource.name || "",
        email: selectedResource.email || "",
        phone: selectedResource.phone || "",
        location: selectedResource.location || "",
        joinDate: selectedResource.joinDate || "",
        skills: (selectedResource.skills || []).join(", "),
        currentProject: selectedResource.currentProject || "",
        role: selectedResource.role,
        department: selectedResource.department,
        employeeId: selectedResource.employeeId
      });
    }
  };

  // Role code mapping
  const getRoleCode = (role: string): string => {
    const roleCodes: { [key: string]: string } = {
      "Lead Electrician": "ELE-LEAD",
      "Apprentice": "APP",
      "Sales Manager": "MGR", 
      "Sales Executive": "EXE",
      "Operations Manager": "MGR",
      "Project Manager": "MGR",
      "Director": "DIR"
    };
    return roleCodes[role] || "UNK";
  };

  // Department code mapping
  const getDepartmentCode = (department: string): string => {
    const deptCodes: { [key: string]: string } = {
      "Sales": "SAL",
      "On-Field": "FLD",
      "Project Management": "PMG",
      "Operations": "OPS"
    };
    return deptCodes[department] || "UNK";
  };

  // Generate employee ID
  const generateEmployeeId = (role: string, department: string): string => {
    if (!role || !department) return "";
    
    const roleCode = getRoleCode(role);
    const deptCode = getDepartmentCode(department);
    
    // Get next sequence number for this role-department combination
    const existingIds = resources
      .filter(r => r.employeeId && r.employeeId.startsWith(`XTR-${deptCode}-${roleCode}`))
      .map(r => {
        const parts = r.employeeId.split('-');
        return parseInt(parts[parts.length - 1]) || 0;
      });
    
    const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const paddedNumber = nextNumber.toString().padStart(3, '0');
    
    return `XTR-${deptCode}-${roleCode}-${paddedNumber}`;
  };

  const [resources, setResources] = useState<Resource[]>([]);

  // Persist resources locally (since backend was removed)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('xtr_resources');
      if (saved) {
        const parsed: Resource[] = JSON.parse(saved);
        if (Array.isArray(parsed)) setResources(parsed);
      }
    } catch (e) {
      console.error('[ResourceManagement] Failed to load saved resources', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('xtr_resources', JSON.stringify(resources));
    } catch (e) {
      console.error('[ResourceManagement] Failed to persist resources', e);
    }
  }, [resources]);

  // Firestore realtime sync if Firebase is enabled
  const firestoreHasDataRef = useReactRef<boolean>();
  if (firestoreHasDataRef.current === undefined) firestoreHasDataRef.current = false;
  useEffect(() => {
    if (!firebaseEnabled || !db) return;
    console.log('[ResourceManagement] Firestore enabled. Subscribing to resources...');
    const unsub = onSnapshot(collection(db, 'resources'), (snap) => {
      console.log('[ResourceManagement] Snapshot received. Docs:', snap.size);
      const list: Resource[] = snap.docs.map((d) => {
        const data: any = d.data();
        return {
          id: Number(data.id) || Date.now(),
          docId: d.id,
          name: data.name || '',
          role: data.role || '',
          department: data.department || '',
          employeeId: data.employeeId || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          skills: Array.isArray(data.skills) ? data.skills : (data.skills ? String(data.skills).split(',').map((s: string) => s.trim()) : []),
          currentProject: data.currentProject,
          joinDate: data.joinDate || '',
          status: (data.status as any) || 'active',
          performance: Number(data.performance ?? 80),
          completedProjects: Number(data.completedProjects ?? 0),
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
          payRate: Number(data.payRate ?? 0),
          payType: (data.payType as any) || 'hourly',
          weeklyHours: Number(data.weeklyHours ?? 40),
          lastActive: data.lastActive || new Date().toISOString().split('T')[0],
          availability: (data.availability as any) || 'available',
          createdBy: data.createdBy || '',
        };
      });
      if (list.length === 0 && !firestoreHasDataRef.current) {
        // Do not clobber local data with an empty remote snapshot
        try {
          const saved = localStorage.getItem('xtr_resources');
          if (saved) {
            const parsed: Resource[] = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setResources(parsed);
              // Bootstrap Firestore with local copy to make persistence durable
              Promise.all(
                parsed.map((r) => addDoc(collection(db, 'resources'), r as any).catch(() => null))
              ).then(() => {
                console.log('[ResourceManagement] Bootstrapped Firestore with local resources');
              });
            }
            return;
          }
        } catch (e) {
          console.warn('[ResourceManagement] No Firestore data and failed to read local backup', e);
        }
        setResources([]);
        return;
      }
      setResources(list);
      firestoreHasDataRef.current = list.length > 0;
      // Also persist Firestore data locally for refresh/offline
      try {
        localStorage.setItem('xtr_resources', JSON.stringify(list));
      } catch {}
    });
    return () => unsub();
  }, []);

  const departments = ["all", "Sales", "On-Field", "Project Management", "Operations"];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || resource.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    // Preload form with the selected resource to avoid race conditions with onOpenChange
    setFormData({
      name: resource.name || "",
      email: resource.email || "",
      phone: resource.phone || "",
      location: resource.location || "",
      joinDate: resource.joinDate || "",
      skills: (resource.skills || []).join(", "),
      currentProject: resource.currentProject || "",
      role: resource.role || "",
      department: resource.department || "",
      employeeId: resource.employeeId || "",
    });
    setShowAddDialog(true);
  };

  // Ensure form data hydrates when a resource is selected and dialog opens
  useEffect(() => {
    if (showAddDialog && selectedResource) {
      setFormData({
        name: selectedResource.name || "",
        email: selectedResource.email || "",
        phone: selectedResource.phone || "",
        location: selectedResource.location || "",
        joinDate: selectedResource.joinDate || "",
        skills: (selectedResource.skills || []).join(", "),
        currentProject: selectedResource.currentProject || "",
        role: selectedResource.role || "",
        department: selectedResource.department || "",
        employeeId: selectedResource.employeeId || "",
      });
    }
  }, [showAddDialog, selectedResource]);

  const handleToggleActive = (id: number) => {
    const target = resources.find(r => r.id === id);
    if (!target) return;
    const toStatus = target.status === 'inactive' ? 'active' : 'inactive';
    const confirmMsg = toStatus === 'inactive'
      ? 'Are you sure you want to deactivate this resource?'
      : 'Activate this resource?';
    if (!confirm(confirmMsg)) return;
    const applyLocal = () => setResources(prev => {
      const next = prev.map(r => r.id === id ? { ...r, status: toStatus as any } : r);
      try { localStorage.setItem('xtr_resources', JSON.stringify(next)); } catch {}
      return next;
    });
    if (firebaseEnabled && db && target.docId) {
      updateDoc(doc(db, 'resources', target.docId), { status: toStatus } as any)
        .then(() => console.log('[ResourceManagement] Status updated to', toStatus))
        .catch((e) => { console.error('[ResourceManagement] Firestore toggle failed', e); applyLocal(); });
    } else {
      applyLocal();
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this resource permanently? This cannot be undone.')) return;
    const target = resources.find(r => r.id === id);
    const applyLocal = () => setResources(prev => {
      const next = prev.filter(r => r.id !== id);
      try { localStorage.setItem('xtr_resources', JSON.stringify(next)); } catch {}
      return next;
    });
    if (firebaseEnabled && db && target?.docId) {
      // use update to mark deleted if needed; here we simply remove locally
      applyLocal();
    } else {
      applyLocal();
    }
  };

  const handleViewDetails = (resource: Resource) => {
    setViewingResource(resource);
    setShowResourceDetails(true);
  };

  const handleStatsClick = (statType: string) => {
    setSelectedStatType(statType);
    setShowStatsDialog(true);
  };

  const handlePerformanceClick = () => {
    setShowPerformanceDialog(true);
  };

  const handleAvailabilityClick = () => {
    setShowAvailabilityDialog(true);
  };

  const handleReportsClick = () => {
    setShowReportsDialog(true);
  };

  const handleExportData = () => {
    const csvContent = resources.map(r => 
      `${r.name},${r.employeeId},${r.role},${r.department},${r.email},${r.phone},${r.location},${r.status},${r.performance}%,${r.completedProjects}`
    ).join('\n');
    
    const header = 'Name,Employee ID,Role,Department,Email,Phone,Location,Status,Performance,Completed Projects\n';
    const fullContent = header + csvContent;
    
    const blob = new Blob([fullContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resource_management_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert("Resource data exported successfully!");
  };

  const [payType, setPayType] = useState<'hourly' | 'salary' | 'contract'>('hourly');
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleAddOrUpdateResource = () => {
    console.log('[ResourceManagement] Starting resource save...');
    const formElement = formRef.current;
    if (!formElement) {
      console.error('[ResourceManagement] Form element not found');
      setShowAddDialog(false);
      return;
    }
    const fd = new FormData(formElement);
    // Debug: log raw form entries
    const rawEntries: Record<string, any> = {};
    fd.forEach((v, k) => { rawEntries[k] = v; });
    console.log('[ResourceManagement] Raw FormData entries:', rawEntries);

    // Prefer FormData first (captures browser autofill), then fall back to controlled state
    const nameVal = (((fd.get('name') as string) || formData.name) || '').trim();
    const emailVal = (((fd.get('email') as string) || formData.email) || '').trim();
    const phoneVal = (((fd.get('phone') as string) || formData.phone) || '').trim();
    const locationVal = (((fd.get('location') as string) || formData.location) || '').trim();
    const joinDateVal = (((fd.get('joinDate') as string) || formData.joinDate) || '').trim();
    const currentProjectVal = (((fd.get('currentProject') as string) || formData.currentProject) || '').trim();
    const roleVal = formData.role || (fd.get('role') as string) || '';
    const deptVal = formData.department || (fd.get('department') as string) || '';
    const employeeIdVal = formData.employeeId || (fd.get('employeeId') as string) || '';
    const skillsRaw = formData.skills || (fd.get('skills') as string) || '';
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    // Basic validation
    if (!roleVal || !deptVal) {
      alert('Please select Role and Department.');
      return;
    }
    if (!nameVal) {
      alert('Please enter a Name.');
      return;
    }

    const newData: Resource = {
      id: selectedResource ? selectedResource.id : Date.now(),
      name: nameVal,
      role: roleVal,
      department: deptVal,
      employeeId: employeeIdVal,
      email: emailVal,
      phone: phoneVal,
      location: locationVal,
      skills,
      currentProject: currentProjectVal || '',
      joinDate: joinDateVal,
      status: 'active',
      performance: 80,
      completedProjects: 0,
      certifications: [],
      payRate: parseFloat((fd.get('payRate') as string) || '0') || 0,
      payType: ((fd.get('payType') as string) || 'hourly') as 'hourly' | 'salary' | 'contract',
      weeklyHours: parseFloat((fd.get('weeklyHours') as string) || '40') || 40,
      lastActive: new Date().toISOString().split('T')[0],
      availability: 'available',
      createdBy: ''
    };

    // Firestore write when enabled, else local state
    if (firebaseEnabled && db) {
      console.log('[ResourceManagement] Attempting Firestore write...');
      if (selectedResource?.docId) {
        updateDoc(doc(db, 'resources', selectedResource.docId), newData as any)
          .then(() => console.log('[ResourceManagement] Firestore update success'))
          .catch((e) => {
          console.error('[ResourceManagement] Firestore update failed, applying local state', e);
          setResources(prev => {
            const next = prev.map(r => r.id === selectedResource.id ? newData : r);
            try { localStorage.setItem('xtr_resources', JSON.stringify(next)); } catch {}
            return next;
          });
        });
      } else {
        addDoc(collection(db, 'resources'), newData as any)
          .then(() => console.log('[ResourceManagement] Firestore add success'))
          .catch((e) => {
          console.error('[ResourceManagement] Firestore add failed, applying local state', e);
          setResources(prev => {
            const next = [...prev, newData];
            try { localStorage.setItem('xtr_resources', JSON.stringify(next)); } catch {}
            return next;
          });
        });
      }
    } else {
      console.warn('[ResourceManagement] Firebase disabled or db missing. Saving locally.');
      if (selectedResource) {
        setResources(prev => {
          const next = prev.map(r => r.id === selectedResource.id ? newData : r);
          try { localStorage.setItem('xtr_resources', JSON.stringify(next)); } catch {}
          return next;
        });
      } else {
        setResources(prev => {
          const next = [...prev, newData];
          try { localStorage.setItem('xtr_resources', JSON.stringify(next)); } catch {}
          return next;
        });
      }
    }
    console.log('[ResourceManagement] Saved resource:', newData);
    // Ensure filters don't hide the newly added resource
    setFilterDepartment('all');
    setSearchQuery('');
    setShowAddDialog(false);
    setSelectedResource(null);
    alert('Resource saved successfully.');
  };

  const ResourceForm = React.memo(() => (
    <form ref={formRef} data-form="resource-form" className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4>Basic Information</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              name="name" 
              placeholder="John Smith" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => {
                const newFormData = { ...formData, role: value };
                if (newFormData.department) {
                  newFormData.employeeId = generateEmployeeId(value, newFormData.department);
                }
                setFormData(newFormData);
              }}
            >
              {/* Hidden input to capture Select value in FormData */}
              <input type="hidden" name="role" value={formData.role} />
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead Electrician">Lead Electrician</SelectItem>
                <SelectItem value="Apprentice">Apprentice</SelectItem>
                <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <Select 
            value={formData.department}
            onValueChange={(value) => {
              const newFormData = { ...formData, department: value };
              if (newFormData.role) {
                newFormData.employeeId = generateEmployeeId(newFormData.role, value);
              }
              setFormData(newFormData);
            }}
          >
            {/* Hidden input to capture Select value in FormData */}
            <input type="hidden" name="department" value={formData.department} />
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="On-Field">On-Field</SelectItem>
              <SelectItem value="Project Management">Project Management</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Employee ID</Label>
          <Input 
            name="employeeId"
            value={formData.employeeId} 
            readOnly 
            placeholder="Auto-generated based on role and department"
            className="bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              name="email" 
              type="email" 
              placeholder="john@xtechs.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input 
              name="phone" 
              placeholder="+61 412 345 678" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input 
              name="location" 
              placeholder="Brisbane" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Join Date</Label>
            <Input 
              name="joinDate" 
              type="date" 
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Skills (comma-separated)</Label>
          <Input 
            name="skills"
            placeholder="Solar Installation, Electrical Work, Safety Compliance" 
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Current Project (if any)</Label>
          <Input 
            name="currentProject" 
            placeholder="Project name" 
            value={formData.currentProject}
            onChange={(e) => setFormData({ ...formData, currentProject: e.target.value })}
          />
        </div>
      </div>

      {/* Pay & Compensation */}
      <div className="space-y-4">
        <h4>Pay & Compensation</h4>
        
        <div className="space-y-2">
          <Label>Pay Type</Label>
          <Select value={payType} onValueChange={(v) => setPayType(v as any)}>
            {/* Hidden input to capture Select value in FormData */}
            <input type="hidden" name="payType" value={payType} />
            <SelectTrigger>
              <SelectValue placeholder="Select Pay Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Pay Rate (AUD)</Label>
          <Input name="payRate" type="number" step="0.01" placeholder="e.g., 25.50" />
        </div>

        <div className="space-y-2">
          <Label>Weekend Rate Multiplier (Optional)</Label>
          <Input type="number" step="0.1" placeholder="e.g., 1.5" />
        </div>
      </div>

      {/* Work Schedule */}
      <div className="space-y-4">
        <h4>Work Schedule</h4>
        
        <div className="space-y-2">
          <Label>Training Days per Week (Optional)</Label>
          <Input name="trainingDays" type="number" min="0" max="7" placeholder="e.g., 1" />
        </div>

        <div className="space-y-2">
          <Label>Weekly Hours Default</Label>
          <Input name="weeklyHours" type="number" min="0" placeholder="40" defaultValue="40" />
        </div>
      </div>

      {/* Leave Entitlements */}
      <div className="space-y-4">
        <h4>Leave Entitlements</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Sick Leave Days</Label>
            <Input name="sickLeaveDays" type="number" min="0" placeholder="10" defaultValue="10" />
          </div>
          <div className="space-y-2">
            <Label>Annual Leave Days</Label>
            <Input name="annualLeaveDays" type="number" min="0" placeholder="15" defaultValue="15" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" className="flex-1" onClick={handleAddOrUpdateResource}>
          {selectedResource ? "Update Resource" : "Add Resource"}
        </Button>
        <Button 
          type="button"
          variant="outline" 
          className="flex-1" 
          onClick={() => {
            setShowAddDialog(false);
            setSelectedResource(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  ));

  const stats = {
    total: resources.length,
    withProjects: resources.filter(r => r.currentProject).length,
    departments: [...new Set(resources.map(r => r.department))].length,
    active: resources.filter(r => r.status === 'active').length,
    onLeave: resources.filter(r => r.status === 'on-leave').length,
    averagePerformance: Math.round(resources.reduce((sum, r) => sum + r.performance, 0) / resources.length),
    available: resources.filter(r => r.availability === 'available').length,
    totalProjects: resources.reduce((sum, r) => sum + r.completedProjects, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resource Management</h1>
          <p className="text-gray-600">Manage team members and resource allocation</p>
          <div className="mt-1 text-xs">
            <span className={firebaseEnabled ? "text-green-600" : "text-red-600"}>
              {firebaseEnabled ? `Firebase: ON (${import.meta.env.VITE_FIREBASE_PROJECT_ID || '-'})` : 'Firebase: OFF'}
            </span>
        </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReportsClick}>
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        <Button onClick={() => {
          setSelectedResource(null);
            setFormData({
              name: "",
              email: "",
              phone: "",
              location: "",
              joinDate: "",
              skills: "",
              currentProject: "",
              role: "",
              department: "",
              employeeId: ""
            });
          setShowAddDialog(true);
        }}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('total')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Resources</p>
                <h3 className="text-2xl font-bold mt-2">{stats.total}</h3>
                <p className="text-sm text-green-600">{stats.active} active</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStatsClick('projects')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active Projects</p>
                <h3 className="text-2xl font-bold mt-2">{stats.withProjects}</h3>
                <p className="text-sm text-blue-600">{stats.totalProjects} total completed</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Removed Avg Performance and Available Now cards per request */}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources View Tabs */}
      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden min-h-[420px]">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{resource.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold truncate">{resource.name || 'No Name'}</h4>
                      </div>
                      <div className="text-muted-foreground truncate">{resource.role || 'No Role'}</div>
                      <div className="text-xs text-blue-600 font-mono">
                        <span className="text-gray-500">Employee ID: </span>
                        {resource.employeeId || 'Not Generated'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span className="truncate">{resource.department || 'No Department'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-foreground" />
                      <span className="break-words">{resource.email || 'No Email'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span className="truncate">{resource.phone || 'No Phone'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{resource.location || 'No Location'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="truncate">Joined: {resource.joinDate || 'Not Set'}</span>
                    </div>
                  </div>

                  {resource.currentProject && (
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">Current Project</p>
                      <p className="text-sm font-medium truncate">{resource.currentProject}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.length === 0 ? (
                        <span className="text-xs text-muted-foreground">-</span>
                      ) : (
                        resource.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Metrics removed per request: Performance, Status, Availability */}

                  <div className="flex gap-2 pt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(resource)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(resource)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleToggleActive(resource.id)}
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      {resource.status === 'inactive' ? 'Activate' : 'Deactivate'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Current Project</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{resource.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{resource.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-blue-600">{resource.employeeId}</span>
                      </TableCell>
                      <TableCell>{resource.role}</TableCell>
                      <TableCell>{resource.department}</TableCell>
                      <TableCell>
                        <div className="text-muted-foreground">
                          <div>{resource.email}</div>
                          <div>{resource.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{resource.location}</TableCell>
                      <TableCell>
                        {resource.currentProject ? (
                          <span>{resource.currentProject}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(resource)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleActive(resource.id)}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(resource.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            <DialogDescription>
              {selectedResource 
                ? "Update the resource information below" 
                : "Fill in the details to add a new team member"}
            </DialogDescription>
          </DialogHeader>
          <ResourceForm />
        </DialogContent>
      </Dialog>

      {/* Resource Details Dialog */}
      <Dialog open={showResourceDetails} onOpenChange={setShowResourceDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Resource Details - {viewingResource?.name}
            </DialogTitle>
          </DialogHeader>
          {viewingResource && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{viewingResource.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{viewingResource.name || '-'}</h3>
                        <p className="text-gray-600">{viewingResource.role || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-32">Name</span>
                        <span className="font-medium">{viewingResource.name || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span>{viewingResource.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{viewingResource.email || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{viewingResource.phone || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{viewingResource.location || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Joined: {viewingResource.joinDate || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Employee ID</span>
                        <Badge variant="outline" className="font-mono text-blue-600">
                          {viewingResource.employeeId}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills & Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {viewingResource.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {viewingResource.certifications.map((cert, idx) => (
                        <Badge key={idx} className="bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Pay Type</p>
                      <p className="font-medium capitalize">{viewingResource.payType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pay Rate</p>
                      <p className="font-medium">
                        ${viewingResource.payRate.toLocaleString()} 
                        {viewingResource.payType === 'hourly' ? '/hour' : '/year'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Weekly Hours</p>
                    <p className="font-medium">{viewingResource.weeklyHours} hours</p>
                  </div>

                  {viewingResource.currentProject && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Current Project</p>
                      <p className="font-medium">{viewingResource.currentProject}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResourceDetails(false)}>Close</Button>
            <Button onClick={() => {
              setShowResourceDetails(false);
              handleEdit(viewingResource!);
            }}>Edit Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resource Statistics - {selectedStatType}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStatType === 'total' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        <p className="text-sm text-gray-600">Active Resources</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.onLeave}</div>
                        <p className="text-sm text-gray-600">On Leave</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Department Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {departments.filter(d => d !== 'all').map(dept => {
                        const count = resources.filter(r => r.department === dept).length;
                        const percentage = Math.round((count / resources.length) * 100);
                        return (
                          <div key={dept} className="flex items-center justify-between">
                            <span>{dept}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedStatType === 'projects' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.withProjects}</div>
                      <p className="text-sm text-gray-600">Currently Assigned</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.totalProjects}</div>
                      <p className="text-sm text-gray-600">Total Completed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(stats.totalProjects / resources.length)}
                      </div>
                      <p className="text-sm text-gray-600">Avg per Person</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resources
                        .sort((a, b) => b.completedProjects - a.completedProjects)
                        .slice(0, 3)
                        .map((resource, idx) => (
                          <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {idx + 1}
                              </div>
                              <span className="font-medium">{resource.name}</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">{resource.completedProjects}</span>
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

      {/* Performance Dialog */}
      <Dialog open={showPerformanceDialog} onOpenChange={setShowPerformanceDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.averagePerformance}%</div>
                  <p className="text-sm text-gray-600">Average Performance</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {resources.filter(r => r.performance >= 90).length}
                  </div>
                  <p className="text-sm text-gray-600">High Performers (90%+)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {resources.filter(r => r.performance < 80).length}
                  </div>
                  <p className="text-sm text-gray-600">Need Improvement (&lt;80%)</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance by Resource</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources
                    .sort((a, b) => b.performance - a.performance)
                    .map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{resource.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-gray-600">{resource.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={resource.performance} className="w-24 h-2" />
                          <span className="font-semibold text-lg">{resource.performance}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPerformanceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Resource Availability
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                  <p className="text-sm text-gray-600">Available</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {resources.filter(r => r.availability === 'busy').length}
                  </div>
                  <p className="text-sm text-gray-600">Busy</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {resources.filter(r => r.availability === 'unavailable').length}
                  </div>
                  <p className="text-sm text-gray-600">Unavailable</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Availability Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{resource.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-sm text-gray-600">{resource.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={resource.availability === 'available' ? 'default' : 
                                      resource.availability === 'busy' ? 'secondary' : 'destructive'}>
                          {resource.availability}
                        </Badge>
                        {resource.currentProject && (
                          <span className="text-sm text-gray-600">{resource.currentProject}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvailabilityDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reports Dialog */}
      <Dialog open={showReportsDialog} onOpenChange={setShowReportsDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Resource Management Reports
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">Generate and download various reports about your resources.</p>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export All Resource Data (CSV)
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                alert("Performance report generated!");
                setShowReportsDialog(false);
              }}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance Summary Report
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                alert("Availability report generated!");
                setShowReportsDialog(false);
              }}>
                <Activity className="w-4 h-4 mr-2" />
                Availability Status Report
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                alert("Skills matrix report generated!");
                setShowReportsDialog(false);
              }}>
                <Target className="w-4 h-4 mr-2" />
                Skills Matrix Report
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                alert("Payroll summary generated!");
                setShowReportsDialog(false);
              }}>
                <DollarSign className="w-4 h-4 mr-2" />
                Payroll Summary Report
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
