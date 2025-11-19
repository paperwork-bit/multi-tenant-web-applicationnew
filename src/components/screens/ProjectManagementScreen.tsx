import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar, ChevronLeft, ChevronRight, Download, Plus, Edit, Trash2, X, Save, ChevronDown, MessageSquare, RefreshCw } from "lucide-react";

// Types
type Priority = "low" | "medium" | "high";
type ProjectType = "Residential" | "Commercial" | "Industrial";
type ProjectStatus = 
  | "new" 
  | "scheduled" 
  | "to-be-rescheduled" 
  | "installation-in-progress" 
  | "installation-completed" 
  | "ces-certificate-applied" 
  | "ces-certificate-received" 
  | "ces-certificate-submitted" 
  | "grid-connection-initiated" 
  | "grid-connection-completed" 
  | "system-handover" 
  | "done"
  | "not-started"  // For Retailer Projects (legacy)
  | "in-progress"  // For Retailer Projects (legacy)
  | "inspection"   // For Retailer Projects (legacy)
  | "completed"    // For Retailer Projects (legacy)
  // New Retailer Projects statuses
  | "retailer-new"
  | "site-inspection"
  | "stage-one"
  | "stage-two"
  | "full-system"
  | "canceled"
  | "retailer-scheduled"
  | "retailer-to-be-rescheduled"
  | "retailer-installation-in-progress"
  | "retailer-installation-completed"
  | "retailer-ces-certificate-applied"
  | "retailer-ces-certificate-received"
  | "retailer-ces-certificate-submitted"
  | "retailer-done";

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  date: string;
  time: string;
}

interface Project {
  id: string;
  name: string;
  priority: Priority;
  systemSize: string;
  type: ProjectType;
  cost: string;
  startDate: string;
  endDate: string;
  assignee: string;
  assignees?: string[]; // Multiple assignees
  comments?: Comment[]; // Comments array
  status: ProjectStatus;
  // Additional data from Lead CRM
  leadData?: {
    title?: string;
    company?: string;
    value?: string;
    date?: string;
    tags?: string[];
    assignee?: string;
    description?: string;
    comments?: any[];
  };
  projectDetails?: {
    systemType?: string;
    clientType?: string;
    propertyInfo?: any;
    utilityInfo?: any;
    systemInfo?: any;
    additionalInfo?: any;
    projectTimeline?: any;
    teamAssignment?: any;
    projectNotes?: string;
  };
  siteVisit?: any;
  onFieldAssessment?: any;
  projectSnapshot?: any;
}

// Initial projects - empty array (no demo data)
const initialProjects: Project[] = [];

// In-House Projects columns
const inHouseColumns = [
  {
    id: "new" as ProjectStatus,
    title: "New",
    description: "New projects",
  },
  {
    id: "scheduled" as ProjectStatus,
    title: "Scheduled",
    description: "Projects scheduled for installation",
  },
  {
    id: "to-be-rescheduled" as ProjectStatus,
    title: "To Be Rescheduled",
    description: "Projects requiring rescheduling",
  },
  {
    id: "installation-in-progress" as ProjectStatus,
    title: "Installation In-Progress",
    description: "Installations currently in progress",
  },
  {
    id: "installation-completed" as ProjectStatus,
    title: "Installation Completed",
    description: "Installations completed",
  },
  {
    id: "ces-certificate-applied" as ProjectStatus,
    title: "CES Certificate Applied",
    description: "CES certificate application submitted",
  },
  {
    id: "ces-certificate-received" as ProjectStatus,
    title: "CES Certificate Received",
    description: "CES certificate received",
  },
  {
    id: "grid-connection-initiated" as ProjectStatus,
    title: "Grid Connection Initiated",
    description: "Grid connection process started",
  },
  {
    id: "grid-connection-completed" as ProjectStatus,
    title: "Grid Connection Completed",
    description: "Grid connection completed",
  },
  {
    id: "system-handover" as ProjectStatus,
    title: "System Handover",
    description: "System ready for handover",
  },
  {
    id: "done" as ProjectStatus,
    title: "Done",
    description: "Project completed",
  },
];

// Retailer Projects columns
const retailerColumns = [
  {
    id: "retailer-new" as ProjectStatus,
    title: "New",
    description: "New retailer projects",
  },
  {
    id: "site-inspection" as ProjectStatus,
    title: "Site Inspection",
    description: "Site inspection in progress",
  },
  {
    id: "stage-one" as ProjectStatus,
    title: "Stage One",
    description: "Stage one projects",
  },
  {
    id: "stage-two" as ProjectStatus,
    title: "Stage Two",
    description: "Stage two projects",
  },
  {
    id: "full-system" as ProjectStatus,
    title: "Full System",
    description: "Full system projects",
  },
  {
    id: "canceled" as ProjectStatus,
    title: "Canceled",
    description: "Canceled projects",
  },
  {
    id: "retailer-scheduled" as ProjectStatus,
    title: "Scheduled",
    description: "Projects scheduled for installation",
  },
  {
    id: "retailer-to-be-rescheduled" as ProjectStatus,
    title: "To Be Rescheduled",
    description: "Projects requiring rescheduling",
  },
  {
    id: "retailer-installation-in-progress" as ProjectStatus,
    title: "Installation In-Progress",
    description: "Installations currently in progress",
  },
  {
    id: "retailer-installation-completed" as ProjectStatus,
    title: "Installation Completed",
    description: "Installations completed",
  },
  {
    id: "retailer-ces-certificate-applied" as ProjectStatus,
    title: "CES Certificate Applied",
    description: "CES certificate application submitted",
  },
  {
    id: "retailer-ces-certificate-received" as ProjectStatus,
    title: "CES Certificate Received",
    description: "CES certificate received",
  },
  {
    id: "retailer-ces-certificate-submitted" as ProjectStatus,
    title: "CES Certificate Submitted",
    description: "CES certificate submitted",
  },
  {
    id: "retailer-done" as ProjectStatus,
    title: "Done",
    description: "Project completed",
  },
];

// Legacy columns for backward compatibility
const columns = retailerColumns;

interface Resource {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'active' | 'inactive' | 'on-leave';
}

// Resource Multi-Select Component
interface ResourceMultiSelectProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  options: string[];
}

const ResourceMultiSelect: React.FC<ResourceMultiSelectProps> = ({ label, value, onChange, placeholder, options }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((n) => n !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const displayText = value.length ? value.join(", ") : placeholder;
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setSearchTerm("");
          }
        }}
        modal={false}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300"
            type="button"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className={displayText !== placeholder ? "truncate text-gray-900" : "text-gray-500"}>{displayText}</span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" sideOffset={4}>
          <div className="p-2 space-y-2">
            <Input
              autoFocus
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted-foreground">No resources found.</p>
              ) : (
                filteredOptions.map((option) => {
                  const selected = value.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted"
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleOption(option)}
                      />
                      <span className="truncate text-sm">{option}</span>
                    </label>
                  );
                })
              )}
            </div>
            {value.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                type="button"
                onClick={() => onChange([])}
              >
                Clear selection
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export function ProjectManagementScreen() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showProjectDetailsDialog, setShowProjectDetailsDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<"kanban" | "retailer-projects" | "calendar">("kanban");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarViewType, setCalendarViewType] = useState<"month" | "week">("month");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [resources, setResources] = useState<Resource[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  
  // Comments state
  const [newComment, setNewComment] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  
  // Installation Day data state
  const [installationData, setInstallationData] = useState<{
    checklist: Array<{ id: number; category: string; item: string; checked: boolean }>;
    checklistNotes: Record<number, string>;
    expenses: Array<{ id: number; item: string; amount: number; description: string; date: string; category: string; employeeName?: string; employeeEmail?: string }>;
    breaks: Array<{ id: number; type: string; startTime: string; endTime: string }>;
    customerNotes: string;
    jobStatus: { jobStarted: boolean; jobPaused: boolean; jobStartTime: string | null; totalPausedDuration: number };
    photos: Array<{ id: number; title: string; description: string; timestamp: string; status: string; imageData?: string; fileName?: string }>;
  } | null>(null);

  // New project form state
  const [newProject, setNewProject] = useState({
    name: "",
    priority: "medium" as Priority,
    systemSize: "",
    type: "Residential" as ProjectType,
    cost: "",
    startDate: "",
    endDate: "",
    assignee: "",
      status: "new" as ProjectStatus,
    // Retailer-specific fields
    projectId: "",
    customerName: "",
    customerEmail: "",
    customerContact: "",
    customerAddress: "",
    location: "",
    clientType: "",
    clientName: "",
    jobType: "",
    siteInspectionDate: "",
    siteInspectionTime: "",
    siteInspectionStatus: "",
    priceAud: "",
    // System configuration
    systemType: "",
    pvSystemSizeKw: "",
    inverterSizeKw: "",
    inverterBrand: "",
    inverterModel: "",
    panelBrand: "",
    panelModuleWatts: "",
    batterySizeKwh: "",
    batteryBrand: "",
    batteryModel: "",
    evChargerBrand: "",
    evChargerModel: "",
    // Property info
    houseStorey: "",
    houseStoreyOther: "",
    roofType: "",
    roofTypeOther: "",
    meterPhase: "",
    accessSecondStorey: "",
    accessToInverter: "",
    // Utility info
    energyRetailer: "",
    energyDistributor: "",
    solarVictoriaEligible: "",
    preApprovalNumber: "",
    nmiNumber: "",
    meterNumber: "",
  });

  // Edit project form state
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Get user email from session
  useEffect(() => {
    try {
      const sessionData = localStorage.getItem('xtr_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.userEmail) {
          setUserEmail(session.userEmail);
          // Convert email to name (e.g., "john.doe@example.com" -> "John Doe")
          const emailName = session.userEmail.split('@')[0];
          const nameParts = emailName.replace(/[._-]/g, ' ').split(' ').map((part: string) => 
            part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          );
          setUserName(nameParts.join(' ') || session.userEmail);
        }
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    }
  }, []);

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        const localProjects = localStorage.getItem('xtr_projects');
        if (localProjects) {
          const parsed = JSON.parse(localProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Remove duplicates based on ID first
            const uniqueById = new Map<string, Project>();
            parsed.forEach((p: Project) => {
              if (p.id && !uniqueById.has(p.id)) {
                uniqueById.set(p.id, p);
              }
            });
            
            // Also remove duplicates based on name + email/address combination
            const uniqueProjects: Project[] = [];
            const seenCombinations = new Set<string>();
            
            Array.from(uniqueById.values()).forEach((p: Project) => {
              // Filter out invalid/nameless projects using validation function
              if (!isValidProject(p)) {
                console.log('Filtering out invalid/unnamed project:', { id: p.id, name: p.name });
                return;
              }
              
              // Create a unique key based on name and identifying info
              const name = (p.name || '').trim();
              const nameLower = name.toLowerCase();
              const email = (p.projectDetails?.additionalInfo?.customerEmail || 
                            p.projectSnapshot?.customerEmail || 
                            p.leadData?.tags?.find((t: string) => t.includes('@')) || 
                            '').toLowerCase().trim();
              const address = (p.projectDetails?.additionalInfo?.customerAddress || 
                              p.projectSnapshot?.customerAddress || 
                              p.leadData?.company || 
                              '').toLowerCase().trim();
              
              // Create unique key
              const uniqueKey = `${nameLower}|${email}|${address}`;
              
              // Only add if we haven't seen this combination before
              if (uniqueKey && !seenCombinations.has(uniqueKey)) {
                seenCombinations.add(uniqueKey);
                uniqueProjects.push(p);
              } else if (!uniqueKey || uniqueKey === '||') {
                // If no unique identifier, keep by ID only (already deduplicated)
                uniqueProjects.push(p);
              }
            });
            
            console.log(`[localStorage Load] Deduplicated projects: ${parsed.length} -> ${uniqueProjects.length}`);
            
            // Debug: Log retailer projects from localStorage
            const retailerProjectsLocal = uniqueProjects.filter(p => 
              ["retailer-new", "site-inspection", "stage-one", "stage-two", "full-system", "canceled", "retailer-scheduled"].includes(p.status)
            );
            console.log(`[localStorage Load] Retailer projects found: ${retailerProjectsLocal.length}`, 
              retailerProjectsLocal.map(p => ({ id: p.id, name: p.name, status: p.status }))
            );
            
            // Debug: Check for "Rishi" in localStorage
            const rishiLocal = uniqueProjects.filter(p => 
              (p.name || '').toLowerCase().includes('rishi')
            );
            if (rishiLocal.length > 0) {
              console.log(`[localStorage Load] Found Rishi in localStorage:`, rishiLocal.map(p => ({ 
                id: p.id, 
                name: p.name, 
                status: p.status 
              })));
            }
            
            // Save deduplicated projects back to localStorage
            if (uniqueProjects.length !== parsed.length) {
              localStorage.setItem('xtr_projects', JSON.stringify(uniqueProjects));
              console.log('[localStorage Load] Removed duplicate projects from localStorage');
            }
            
            setProjects(uniqueProjects);
          }
        }
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
      }
    };

    loadProjects();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'xtr_projects') {
        loadProjects();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  


  
  /*
  useEffect(() => {
    if (!cloudSyncEnabled || !db) {
      console.log('[ProjectManagement] Firestore not enabled, using localStorage only');
      return;
    }

    console.log('[ProjectManagement] Setting up Firestore sync for projects');
    
    // Force initial sync: upload all local projects to Firestore immediately
    const performInitialSync = async () => {
      try {
        const localProjects = localStorage.getItem('xtr_projects');
        if (localProjects) {
          const parsed = JSON.parse(localProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
              const validProjects = parsed.filter(isValidProject);
            
            if (validProjects.length > 0) {
              console.log(`[ProjectManagement] 🔄 Initial sync: Uploading ${validProjects.length} local project(s) to Firestore...`);
              
              // Upload all local projects to Firestore (will merge if they already exist)
              await Promise.all(
                validProjects.map((p: Project) => {
                  if (p.id) {
                    return setDoc(doc(db, 'projects', p.id), p as any, { merge: true })
                      .then(() => {
                        console.log(`[ProjectManagement] ✅ Initial sync: Uploaded ${p.id} - ${p.name}`);
                      })
                      .catch((err) => {
                        console.error(`[ProjectManagement] ❌ Initial sync error for ${p.id}:`, err);
                      });
                  }
                  return Promise.resolve();
                })
              );
              
              console.log(`[ProjectManagement] ✅ Initial sync complete: Uploaded ${validProjects.length} project(s)`);
            }
          }
        }
      } catch (error) {
        console.error('[ProjectManagement] Initial sync error:', error);
      }
    };
    
    // Run initial sync once when component mounts and Firebase is ready
    performInitialSync();
    
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      console.log('[ProjectManagement] Firestore snapshot received. Docs:', snap.size, 'isSyncing:', isSyncingRef.current);
      console.log('[ProjectManagement] Snapshot metadata - hasPendingWrites:', snap.metadata.hasPendingWrites, 'fromCache:', snap.metadata.fromCache);
      
      // Always process Firestore updates - don't block them
      // The isSyncingRef is only used to prevent infinite loops during merges
      
      const firestoreProjects: Project[] = [];
      snap.forEach((d) => {
        const data = d.data();
        firestoreProjects.push({
          ...data,
          id: d.id,
        } as Project);
      });

      if (firestoreProjects.length === 0 && !firestoreHasDataRef.current) {
        // Bootstrap Firestore with local data if Firestore is empty
        try {
          const localProjects = localStorage.getItem('xtr_projects');
          if (localProjects) {
            const parsed = JSON.parse(localProjects);
            if (Array.isArray(parsed) && parsed.length > 0) {
              console.log('[ProjectManagement] Bootstrapping Firestore with local projects:', parsed.length);
              
              // Filter and validate projects before bootstrapping
              const validProjects = parsed.filter(isValidProject);
              
              console.log('[ProjectManagement] Valid projects to bootstrap:', validProjects.length, 
                validProjects.map(p => ({ id: p.id, name: p.name, status: p.status })));
              
              isSyncingRef.current = true;
              Promise.all(
                validProjects.map((p: Project) => {
                  if (p.id) {
                    return setDoc(doc(db, 'projects', p.id), p as any).catch((err) => {
                      console.error('Error bootstrapping project:', err);
                      return null;
                    });
                  }
                  return null;
                })
              ).then(() => {
                console.log('[ProjectManagement] Bootstrapped Firestore with local projects');
                isSyncingRef.current = false;
              });
              
              // Keep local projects in state while bootstrapping
              setProjects(validProjects);
            }
          }
        } catch (e) {
          console.warn('[ProjectManagement] Failed to bootstrap Firestore', e);
        }
        return;
      }

      if (firestoreProjects.length > 0) {
        firestoreHasDataRef.current = true;
        
        // Process updates immediately - always process Firestore updates
        // Don't skip even if syncing - this allows real-time updates from other devices
        const wasSyncing = isSyncingRef.current;
        if (wasSyncing) {
          console.log('[ProjectManagement] Processing Firestore update while syncing (real-time update from other device)');
        }
        
        isSyncingRef.current = true;
        try {
          const localProjects = localStorage.getItem('xtr_projects');
          const localProjectsList: Project[] = localProjects ? JSON.parse(localProjects) : [];
          
          // Create a map of Firestore projects by ID
          const firestoreMap = new Map<string, Project>();
          firestoreProjects.forEach((p) => {
            if (p.id) {
              firestoreMap.set(p.id, p);
            }
          });
          
          // Check if there are new projects from other devices
          const currentLocalIds = new Set(localProjectsList.map(p => p.id).filter(Boolean));
          const firestoreIds = new Set(firestoreProjects.map(p => p.id).filter(Boolean));
          const newProjectIds = [...firestoreIds].filter(id => !currentLocalIds.has(id));
          
          if (newProjectIds.length > 0) {
            console.log(`[ProjectManagement] 🔄 REAL-TIME SYNC: Detected ${newProjectIds.length} new project(s) from other device(s):`, 
              newProjectIds.map(id => {
                const proj = firestoreProjects.find(p => p.id === id);
                return proj ? { id: proj.id, name: proj.name, status: proj.status } : id;
              })
            );
            
            // Check specifically for Arthur Romas
            const arthurProjects = firestoreProjects.filter(p => 
              (p.name || '').toLowerCase().includes('arthur') || (p.name || '').toLowerCase().includes('romas')
            );
            if (arthurProjects.length > 0) {
              console.log(`[ProjectManagement] ✅ Found Arthur Romas project(s) in Firestore BEFORE merge:`, 
                arthurProjects.map(p => ({ 
                  id: p.id, 
                  name: p.name, 
                  status: p.status,
                  nameLength: (p.name || '').length,
                  hasValidId: !!(p.id && p.id.trim() !== ''),
                  isValid: isValidProject(p),
                  nameTrimmed: (p.name || '').trim()
                }))
              );
            }
          }
          
          // Merge: Firestore takes precedence, but keep local projects not in Firestore
          const mergedProjects: Project[] = [];
          const seenIds = new Set<string>();
          
          // First, add all Firestore projects (these are the source of truth)
          firestoreProjects.forEach((p) => {
            if (p.id && !seenIds.has(p.id)) {
              seenIds.add(p.id);
              mergedProjects.push(p);
            }
          });
          
          // Check Arthur Romas after merge
          const arthurInMerged = mergedProjects.filter(p => 
            (p.name || '').toLowerCase().includes('arthur') || (p.name || '').toLowerCase().includes('romas')
          );
          if (arthurInMerged.length > 0) {
            console.log(`[ProjectManagement] ✅ Arthur Romas in mergedProjects (${mergedProjects.length} total):`, 
              arthurInMerged.map(p => ({ id: p.id, name: p.name, status: p.status }))
            );
          }
          
          // Then, add local projects that aren't in Firestore
          const localProjectsToSync: Project[] = [];
          localProjectsList.forEach((p) => {
            if (p.id && !seenIds.has(p.id)) {
              seenIds.add(p.id);
              mergedProjects.push(p);
              localProjectsToSync.push(p);
            }
          });
          
          // Sync all local projects that aren't in Firestore (batch sync)
          if (localProjectsToSync.length > 0) {
            console.log(`[ProjectManagement] 🔄 UPLOADING ${localProjectsToSync.length} local project(s) to Firestore:`, 
              localProjectsToSync.map(p => ({ id: p.id, name: p.name, status: p.status }))
            );
            
            // Sync each local project to Firestore immediately
            Promise.all(
              localProjectsToSync.map((p) => {
                if (p.id) {
                  return setDoc(doc(db, 'projects', p.id), p as any, { merge: true })
                    .then(() => {
                      console.log(`[ProjectManagement] ✅ Uploaded local project to Firestore: ${p.id} - ${p.name}`);
                    })
                    .catch((err) => {
                      console.error(`[ProjectManagement] ❌ Error uploading local project ${p.id} to Firestore:`, err);
                    });
                }
                return Promise.resolve();
              })
            ).then(() => {
              console.log(`[ProjectManagement] ✅ Finished uploading ${localProjectsToSync.length} local project(s) to Firestore`);
            });
          }
          
          // Check Arthur Romas before validation
          const arthurBeforeValidation = mergedProjects.filter(p => 
            (p.name || '').toLowerCase().includes('arthur') || (p.name || '').toLowerCase().includes('romas')
          );
          console.log(`[ProjectManagement] 📊 Before validation: ${mergedProjects.length} total projects, ${arthurBeforeValidation.length} Arthur Romas projects`);
          
          // Filter out invalid/nameless projects
          const validProjects = mergedProjects.filter((p) => {
            const isValid = isValidProject(p);
            // Log if Arthur Romas is being filtered out
            const isArthur = (p.name || '').toLowerCase().includes('arthur') || (p.name || '').toLowerCase().includes('romas');
            if (isArthur && !isValid) {
              const name = (p.name || '').trim();
              console.error(`[ProjectManagement] ❌ Arthur Romas FAILED validation:`, {
                id: p.id,
                name: name,
                nameLength: name.length,
                hasId: !!(p.id && p.id.trim() !== ''),
                nameCheck: name && name !== '' && name !== 'Untitled Project' && name.length >= 2,
                containsUnnamed: name.toLowerCase().includes('unnamed') || name.toLowerCase().includes('untitled'),
                fullProject: p
              });
            }
            return isValid;
          });
          
          // Check Arthur Romas after validation
          const arthurAfterValidation = validProjects.filter(p => 
            (p.name || '').toLowerCase().includes('arthur') || (p.name || '').toLowerCase().includes('romas')
          );
          console.log(`[ProjectManagement] 📊 After validation: ${validProjects.length} valid projects, ${arthurAfterValidation.length} Arthur Romas projects`);
          
          // Remove duplicates
          const uniqueProjects: Project[] = [];
          const seenCombinations = new Set<string>();
          const seenIdsFinal = new Set<string>();
          
          validProjects.forEach((p) => {
            // Skip if we've already seen this ID
            if (p.id && seenIdsFinal.has(p.id)) {
              const isArthur = (p.name || '').toLowerCase().includes('arthur') || (p.name || '').toLowerCase().includes('romas');
              if (isArthur) {
                console.warn(`[ProjectManagement] ⚠️ Arthur Romas duplicate ID detected: ${p.id} - ${p.name}`);
              }
              return;
            }
            
            const name = (p.name || '').toLowerCase().trim();
            const email = (p.projectDetails?.additionalInfo?.customerEmail || 
                          p.projectSnapshot?.customerEmail || 
                          p.leadData?.tags?.find((t: string) => t.includes('@')) || 
                          '').toLowerCase().trim();
            const address = (p.projectDetails?.additionalInfo?.customerAddress || 
                            p.projectSnapshot?.customerAddress || 
                            p.leadData?.company || 
                            '').toLowerCase().trim();
            const key = `${name}|${email}|${address}`;
            
            const isArthur = (p.name || '').toLowerCase().includes('arthur') || (p.name || '').toLowerCase().includes('romas');
            
            if (key && key !== '||' && !seenCombinations.has(key)) {
              seenCombinations.add(key);
              if (p.id) seenIdsFinal.add(p.id);
              uniqueProjects.push(p);
              if (isArthur) {
                console.log(`[ProjectManagement] ✅ Arthur Romas added to uniqueProjects with key: ${key}`);
              }
            } else if (!key || key === '||') {
              // Keep by ID only if no unique identifier
              if (p.id && !seenIdsFinal.has(p.id)) {
                seenIdsFinal.add(p.id);
                uniqueProjects.push(p);
                if (isArthur) {
                  console.log(`[ProjectManagement] ✅ Arthur Romas added to uniqueProjects by ID only (no key): ${p.id}`);
                }
              } else if (isArthur) {
                console.warn(`[ProjectManagement] ⚠️ Arthur Romas NOT added - key: "${key}", ID already seen: ${seenIdsFinal.has(p.id || '')}`);
              }
            } else if (isArthur) {
              console.warn(`[ProjectManagement] ⚠️ Arthur Romas NOT added - duplicate key: "${key}" (already seen: ${seenCombinations.has(key)})`);
            }
          });
          
          setProjects(uniqueProjects);
          localStorage.setItem('xtr_projects', JSON.stringify(uniqueProjects));
          console.log(`[ProjectManagement] Synced ${uniqueProjects.length} projects from Firestore`);
          
          // Debug: Log all retailer projects
          const retailerProjects = uniqueProjects.filter(p => 
            ["retailer-new", "site-inspection", "stage-one", "stage-two", "full-system", "canceled", "retailer-scheduled"].includes(p.status)
          );
          console.log(`[ProjectManagement] Retailer projects found: ${retailerProjects.length}`, 
            retailerProjects.map(p => ({ id: p.id, name: p.name, status: p.status, nameLength: (p.name || '').length }))
          );
          
          // Debug: Log ALL projects to see what we have
          console.log(`[ProjectManagement] ALL projects (${uniqueProjects.length}):`, 
            uniqueProjects.map(p => ({ id: p.id, name: p.name, status: p.status }))
          );
          
          // Dispatch event to notify other components of the update
          window.dispatchEvent(new CustomEvent('xtr-projects-updated'));
          
          // Update sync status after merge
          checkSyncStatus().catch(err => console.error('[Sync Status] Error updating sync status:', err));
          
          // Debug: Check for "Rishi" specifically
          const rishiProjects = uniqueProjects.filter(p => 
            (p.name || '').toLowerCase().includes('rishi')
          );
          if (rishiProjects.length > 0) {
            console.log(`[ProjectManagement] Found Rishi projects:`, rishiProjects.map(p => ({ 
              id: p.id, 
              name: p.name, 
              status: p.status,
              nameLength: (p.name || '').length,
              hasId: !!p.id
            })));
          } else {
            console.log(`[ProjectManagement] No Rishi projects found in ${uniqueProjects.length} total projects`);
          }
          
          // Debug: Check for "Scott Megens" specifically
          const scottProjects = uniqueProjects.filter(p => 
            (p.name || '').toLowerCase().includes('scott') || (p.name || '').toLowerCase().includes('megens')
          );
          if (scottProjects.length > 0) {
            console.log(`[ProjectManagement] Found Scott Megens projects:`, scottProjects.map(p => ({ 
              id: p.id, 
              name: p.name, 
              status: p.status,
              nameLength: (p.name || '').length,
              hasId: !!p.id
            })));
          } else {
            console.log(`[ProjectManagement] No Scott Megens projects found in ${uniqueProjects.length} total projects`);
          }
          
          // Debug: Log all stage-one projects
          const stageOneProjects = uniqueProjects.filter(p => p.status === 'stage-one');
          console.log(`[ProjectManagement] All stage-one projects (${stageOneProjects.length}):`, 
            stageOneProjects.map(p => ({ id: p.id, name: p.name, status: p.status }))
          );
          
          // Check for Arthur Romas in final list
          const arthurInFinal = uniqueProjects.filter(p => 
            (p.name || '').toLowerCase().includes('arthur') || (p.name || '').toLowerCase().includes('romas')
          );
          if (arthurInFinal.length > 0) {
            console.log(`[ProjectManagement] ✅ Arthur Romas project is in the final merged list:`, 
              arthurInFinal.map(p => ({ id: p.id, name: p.name, status: p.status }))
            );
          } else {
            console.warn(`[ProjectManagement] ⚠️ Arthur Romas project NOT found in final merged list`);
          }
        } catch (error) {
          console.error('[ProjectManagement] Error merging Firestore data:', error);
        } finally {
          isSyncingRef.current = false;
        }
      }
    }, (error) => {
      console.error('[ProjectManagement] Firestore snapshot error:', error);
    });

    return () => {
      unsub();
    };
  }, []);
  */

  useEffect(() => {
    console.log('[ProjectManagement] Firebase sync removed; using localStorage only');
  }, []);

  // Load resources from localStorage and Firestore
  useEffect(() => {
    const loadResources = () => {
      try {
        // Try localStorage first
        const localResources = localStorage.getItem('xtr_resources');
        if (localResources) {
          const parsed = JSON.parse(localResources);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeResources = parsed
              .filter((r: any) => r.status === 'active')
              .map((r: any) => ({
                id: r.id,
                name: r.name,
                role: r.role || '',
                department: r.department || '',
                email: r.email || '',
                status: r.status || 'active'
              }));
            setResources(activeResources);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading resources:', error);
      }
    };

    loadResources();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'xtr_resources') {
        loadResources();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch closed-won leads from Lead CRM and add to "New" column
  useEffect(() => {
    const loadClosedWonLeads = () => {
      console.log('[loadClosedWonLeads] Starting to load closed-won leads');
      try {
        // Get leads from localStorage - check both possible keys
        let leadsStateRaw = localStorage.getItem('xtr_leads_state_columns');
        if (!leadsStateRaw) {
          leadsStateRaw = localStorage.getItem('leads_state');
        }
        if (!leadsStateRaw) {
          console.log('[loadClosedWonLeads] No leads state found in localStorage');
          return;
        }

        const leadsData = JSON.parse(leadsStateRaw);
        // Handle both formats: { columns: [...] } or just [...]
        const leadsState = Array.isArray(leadsData) ? leadsData : (leadsData?.columns || []);
        if (!Array.isArray(leadsState)) {
          console.log('[loadClosedWonLeads] Leads state is not an array');
          return;
        }

        // Find all closed-won leads
        const closedWonLeads: any[] = [];
        leadsState.forEach((column: any) => {
          if (column.id === 'closed-won' && Array.isArray(column.leads)) {
            closedWonLeads.push(...column.leads);
          }
        });

        console.log('[loadClosedWonLeads] Found', closedWonLeads.length, 'closed-won leads:', closedWonLeads.map(l => l.title || l.company));

        if (closedWonLeads.length === 0) return;

        // Convert closed-won leads to projects and add to "new" status
        // Use functional update to get current projects state
        setProjects(prev => {
          const existingProjectIds = new Set(prev.map(p => p.id));
          // Also track by name + email/address to prevent duplicates
          const existingCombinations = new Set<string>();
          prev.forEach((p: Project) => {
            const name = (p.name || '').toLowerCase().trim();
            const email = (p.projectDetails?.additionalInfo?.customerEmail || 
                          p.projectSnapshot?.customerEmail || 
                          p.leadData?.tags?.find((t: string) => t.includes('@')) || 
                          '').toLowerCase().trim();
            const address = (p.projectDetails?.additionalInfo?.customerAddress || 
                            p.projectSnapshot?.customerAddress || 
                            p.leadData?.company || 
                            '').toLowerCase().trim();
            const key = `${name}|${email}|${address}`;
            if (key && key !== '||') {
              existingCombinations.add(key);
            }
          });
          
          const newProjects: Project[] = [];

          closedWonLeads.forEach((lead: any) => {
            const leadTitle = lead.title || lead.company || '';
            const isTest8 = leadTitle.toLowerCase().includes('test 8') || leadTitle.toLowerCase().includes('test8');
            
            if (isTest8) {
              console.log('[loadClosedWonLeads] Processing Test 8 lead:', {
                id: lead.id,
                title: lead.title,
                company: lead.company,
                email: lead.tags?.find((t: string) => t.includes('@')),
                hasProjectSnapshot: !!lead.projectSnapshot,
                projectSnapshotTitle: lead.projectSnapshot?.title,
                projectSnapshotCustomerName: lead.projectSnapshot?.customerName
              });
            }
            
            // Check if already exists as a project by ID - if so, update status to "new" if needed
            if (existingProjectIds.has(lead.id)) {
              const existingProject = prev.find((p: Project) => p.id === lead.id);
              if (existingProject) {
                // If existing project is not in "new" status, update it to "new"
                if (existingProject.status !== 'new') {
                  if (isTest8) {
                    console.log('[loadClosedWonLeads] Test 8: updating existing project by ID status from', existingProject.status, 'to "new"');
                  }
                  const updatedProject = { ...existingProject, status: 'new' as ProjectStatus };
                  const updatedProjects = prev.map((p: Project) => p.id === existingProject.id ? updatedProject : p);
                  
                  // Save updated projects
                  saveProjectsToStorage(updatedProjects).then(() => {
                    console.log(`[loadClosedWonLeads] Updated existing project "${existingProject.name}" (ID: ${existingProject.id}) to "new" status from closed-won lead`);
                  });
                  
                  // Return updated projects without creating a new one
                  return updatedProjects;
                } else {
                  // Already in "new" status, skip
                  if (isTest8) {
                    console.log('[loadClosedWonLeads] Test 8 skipped: already exists as project by ID with status "new":', lead.id);
                  }
                  return prev;
                }
              }
              
              // If ID exists but project not found, skip
              if (isTest8) {
                console.log('[loadClosedWonLeads] Test 8 skipped: ID exists but project not found:', lead.id);
              }
              return prev;
            }
            
            // Also check by name + email/address combination
            const leadName = leadTitle.toLowerCase().trim();
            const leadEmail = (lead.tags?.find((t: string) => t.includes('@')) || '').toLowerCase().trim();
            const leadAddr = (lead.company || lead.projectDetails?.propertyInfo?.propertyAddress || '').toLowerCase().trim();
            const leadKey = `${leadName}|${leadEmail}|${leadAddr}`;
            
            // If duplicate found, find existing project and update its status to "new" if needed
            if (leadKey && leadKey !== '||' && existingCombinations.has(leadKey)) {
              // Find the existing project with this combination
              const existingProject = prev.find((p: Project) => {
                const projName = (p.name || '').toLowerCase().trim();
                const projEmail = (p.projectDetails?.additionalInfo?.customerEmail || 
                                  p.projectSnapshot?.customerEmail || 
                                  p.leadData?.tags?.find((t: string) => t.includes('@')) || 
                                  '').toLowerCase().trim();
                const projAddr = (p.projectDetails?.additionalInfo?.customerAddress || 
                                p.projectSnapshot?.customerAddress || 
                                p.leadData?.company || 
                                '').toLowerCase().trim();
                const projKey = `${projName}|${projEmail}|${projAddr}`;
                return projKey === leadKey;
              });
              
              if (existingProject) {
                // If existing project is not in "new" status, update it to "new"
                if (existingProject.status !== 'new') {
                  if (isTest8) {
                    console.log('[loadClosedWonLeads] Test 8: updating existing project status from', existingProject.status, 'to "new"');
                  }
                  const updatedProject = { ...existingProject, status: 'new' as ProjectStatus };
                  const updatedProjects = prev.map((p: Project) => p.id === existingProject.id ? updatedProject : p);
                  
                  // Save updated projects
                  saveProjectsToStorage(updatedProjects).then(() => {
                    console.log(`[loadClosedWonLeads] Updated existing project "${existingProject.name}" to "new" status from closed-won lead`);
                  });
                  
                  // Return updated projects without creating a new one
                  return updatedProjects;
                } else {
                  // Already in "new" status, skip
                  if (isTest8) {
                    console.log('[loadClosedWonLeads] Test 8 skipped: already exists with status "new"');
                  }
                  return prev;
                }
              }
              
              // If we couldn't find the existing project but key exists, skip
              if (isTest8) {
                console.log('[loadClosedWonLeads] Test 8 skipped: duplicate combination but project not found:', leadKey);
              } else {
                console.log('Skipping duplicate lead:', lead.title || lead.company);
              }
              return prev;
            }

            // Get site visit data - check multiple sources
            let siteVisitData = null;
            try {
              // First, check if lead has siteVisit attached directly (most reliable)
              if ((lead as any).siteVisit) {
                siteVisitData = (lead as any).siteVisit;
              }
              
              // Also check projectSnapshot which might contain site visit data
              if (!siteVisitData && lead.projectSnapshot?.siteVisit) {
                siteVisitData = lead.projectSnapshot.siteVisit;
              }
              
              // Try different localStorage keys
              if (!siteVisitData) {
                const keys = ['xtr_site_visits', 'site_visits', 'sales_site_visits'];
                for (const key of keys) {
                  const siteVisitsRaw = localStorage.getItem(key);
                  if (siteVisitsRaw) {
                    const siteVisits = JSON.parse(siteVisitsRaw);
                    if (Array.isArray(siteVisits)) {
                      // More flexible matching - case insensitive, partial matches
                      const leadTitleLower = (lead.title || '').toLowerCase().trim();
                      const leadCompanyLower = (lead.company || '').toLowerCase().trim();
                      const leadEmail = lead.tags?.find((t: string) => t.includes('@'))?.toLowerCase().trim() || '';
                      
                      siteVisitData = siteVisits.find((sv: any) => {
                        const svName = (sv.customerName || '').toLowerCase().trim();
                        const svEmail = (sv.customerEmail || '').toLowerCase().trim();
                        const svAddr = (sv.propertyAddress || '').toLowerCase().trim();
                        const leadAddr = (lead.projectDetails?.propertyInfo?.propertyAddress || '').toLowerCase().trim();
                        
                        return svName === leadTitleLower || 
                               svName === leadCompanyLower ||
                               svEmail === leadEmail ||
                               (svEmail && leadEmail && svEmail === leadEmail) ||
                               (svName && leadTitleLower && svName.includes(leadTitleLower)) ||
                               (svName && leadCompanyLower && svName.includes(leadCompanyLower)) ||
                               (svAddr && leadAddr && svAddr === leadAddr);
                      });
                      if (siteVisitData) break;
                    }
                  }
                }
              }
            } catch (error) {
              console.error('Error loading site visit data:', error);
            }

            // Get on-field assessment data - check multiple sources
            let onFieldData = null;
            try {
              // First, check if lead has onField attached directly
              if ((lead as any).onField) {
                onFieldData = (lead as any).onField;
              }
              
              // Also check projectSnapshot which might contain on-field data
              if (!onFieldData && lead.projectSnapshot?.onField) {
                onFieldData = lead.projectSnapshot.onField;
              }
              
              // Try different localStorage keys
              if (!onFieldData) {
                const keys = ['xtr_onfield_assessments', 'onfield_assessments', 'onfield_site_visits'];
                for (const key of keys) {
                  const onFieldRaw = localStorage.getItem(key);
                  if (onFieldRaw) {
                    const onFieldAssessments = JSON.parse(onFieldRaw);
                    if (Array.isArray(onFieldAssessments)) {
                      // More flexible matching - case insensitive, partial matches
                      const leadTitleLower = (lead.title || '').toLowerCase().trim();
                      const leadCompanyLower = (lead.company || '').toLowerCase().trim();
                      const leadEmail = lead.tags?.find((t: string) => t.includes('@'))?.toLowerCase().trim() || '';
                      
                      onFieldData = onFieldAssessments.find((of: any) => {
                        const ofName = (of.customerName || '').toLowerCase().trim();
                        const ofEmail = (of.customerEmail || '').toLowerCase().trim();
                        const ofAddr = (of.propertyAddress || '').toLowerCase().trim();
                        const leadAddr = (lead.projectDetails?.propertyInfo?.propertyAddress || '').toLowerCase().trim();
                        
                        return ofName === leadTitleLower || 
                               ofName === leadCompanyLower ||
                               ofEmail === leadEmail ||
                               (ofEmail && leadEmail && ofEmail === leadEmail) ||
                               (ofName && leadTitleLower && ofName.includes(leadTitleLower)) ||
                               (ofName && leadCompanyLower && ofName.includes(leadCompanyLower)) ||
                               (ofAddr && leadAddr && ofAddr === leadAddr);
                      });
                      if (onFieldData) break;
                    }
                  }
                }
              }
            } catch (error) {
              console.error('Error loading on-field assessment data:', error);
            }

            // Create project from lead with all details
            // Prioritize projectSnapshot if available (most complete data)
            const snap = lead.projectSnapshot || {};
            const projDetails = lead.projectDetails || {};
            
            // Get project name - ensure it's valid
            const projectName = snap.title || lead.title || lead.company || snap.customerName || '';
            if (!projectName || projectName.trim() === '' || projectName.trim().length < 2) {
              if (isTest8) {
                console.log('[loadClosedWonLeads] Test 8 skipped: invalid name:', { id: lead.id, title: lead.title, company: lead.company, projectName });
              } else {
                console.log('Skipping lead with invalid name:', lead.id, lead.title, lead.company);
              }
              return;
            }
            
            if (isTest8) {
              console.log('[loadClosedWonLeads] Test 8 creating project with name:', projectName.trim());
            }
            
            const project: Project = {
              id: lead.id || snap.id || `lead-${Date.now()}-${Math.random()}`,
              name: projectName.trim(),
              priority: lead.priority || 'medium',
              systemSize: snap.systemInfo?.systemSize || 
                         projDetails?.systemInfo?.systemSize || 
                         projDetails?.systemSize || 
                         lead.tags?.find((t: string) => t.includes('kW')) || 
                         'Not specified',
              type: (snap.clientType || (projDetails?.clientType === 'Commercial' ? 'Commercial' :
                    projDetails?.clientType === 'Industrial' ? 'Industrial' : 'Residential')) as ProjectType,
              cost: snap.price || lead.value || '$0',
              startDate: snap.startDate?.slice(0, 10) || 
                        projDetails?.projectTimeline?.startDate?.slice(0, 10) || 
                        lead.date || 
                        new Date().toISOString().slice(0, 10),
              endDate: projDetails?.projectTimeline?.expectedCompletion?.slice(0, 10) || 
                      projDetails?.projectTimeline?.installationDate?.slice(0, 10) || 
                      '',
              assignee: (Array.isArray(snap.teamAssignment?.projectManager) 
                         ? snap.teamAssignment.projectManager[0] 
                         : snap.teamAssignment?.projectManager) ||
                       (Array.isArray(projDetails?.teamAssignment?.projectManager) 
                         ? projDetails.teamAssignment.projectManager[0] 
                         : projDetails?.teamAssignment?.projectManager) ||
                       lead.assignee || 
                       '',
              status: 'new' as ProjectStatus,
              // Store all lead data
              leadData: {
                title: lead.title,
                company: lead.company,
                value: lead.value,
                date: lead.date,
                tags: lead.tags,
                assignee: lead.assignee,
                description: lead.description,
                comments: lead.comments,
              },
              // Merge projectDetails and projectSnapshot to ensure nothing is lost
              projectDetails: snap.id ? {
                // Use projectSnapshot data as primary, fallback to projectDetails
                systemType: snap.systemType || projDetails?.systemType,
                clientType: snap.clientType || projDetails?.clientType,
                propertyInfo: snap.propertyInfo || projDetails?.propertyInfo,
                utilityInfo: snap.utilityInfo || projDetails?.utilityInfo,
                systemInfo: snap.systemInfo || projDetails?.systemInfo,
                additionalInfo: snap.additionalInfo || projDetails?.additionalInfo,
                projectTimeline: snap.projectTimeline || projDetails?.projectTimeline,
                teamAssignment: snap.teamAssignment || projDetails?.teamAssignment,
                projectNotes: snap.notes || projDetails?.projectNotes,
              } : (projDetails ? { ...projDetails } : undefined),
              siteVisit: siteVisitData || snap.siteVisit,
              onFieldAssessment: onFieldData || snap.onField,
              // Store complete projectSnapshot (most important - contains all data)
              projectSnapshot: lead.projectSnapshot || snap,
            };

            // Track this combination to prevent duplicates
            const projName = (project.name || '').toLowerCase().trim();
            const projEmail = (project.projectDetails?.additionalInfo?.customerEmail || 
                              project.projectSnapshot?.customerEmail || 
                              project.leadData?.tags?.find((t: string) => t.includes('@')) || 
                              '').toLowerCase().trim();
            const projAddr = (project.projectDetails?.additionalInfo?.customerAddress || 
                            project.projectSnapshot?.customerAddress || 
                            project.leadData?.company || 
                            '').toLowerCase().trim();
            const projKey = `${projName}|${projEmail}|${projAddr}`;
            if (projKey && projKey !== '||') {
              existingCombinations.add(projKey);
            }
            
            if (isTest8) {
              console.log('[loadClosedWonLeads] Test 8 project created:', {
                id: project.id,
                name: project.name,
                status: project.status,
                isValid: isValidProject(project)
              });
            }
            
            newProjects.push(project);
          });

          // Add new projects if any
          if (newProjects.length > 0) {
            const updatedProjects = [...prev, ...newProjects];
            
            // Save to both localStorage and Firestore
            saveProjectsToStorage(updatedProjects).then(() => {
              console.log(`Added ${newProjects.length} new projects from closed-won leads`);
            });
            
            return updatedProjects;
          }
          
          return prev;
        });
      } catch (error) {
        console.error('Error loading closed-won leads:', error);
      }
    };

    // Load on mount
    loadClosedWonLeads();

    // Listen for updates from Lead CRM
    const handleLeadsUpdate = () => {
      loadClosedWonLeads();
    };

    window.addEventListener('xtr-leads-updated', handleLeadsUpdate);
    window.addEventListener('xtr-projects-updated', handleLeadsUpdate);

    // Also listen to localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'leads_state') {
        loadClosedWonLeads();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Poll for changes (fallback)
    const interval = setInterval(loadClosedWonLeads, 5000);

    return () => {
      window.removeEventListener('xtr-leads-updated', handleLeadsUpdate);
      window.removeEventListener('xtr-projects-updated', handleLeadsUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []); // Run once on mount and cleanup on unmount

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get color for project status in calendar
  const getStatusColor = (status: ProjectStatus): { dot: string; bg: string; text: string; hover: string } => {
    const colorMap: Record<ProjectStatus, { dot: string; bg: string; text: string; hover: string }> = {
      // In-House Projects
      "new": { dot: "#6b7280", bg: "bg-gray-100", text: "text-gray-800", hover: "hover:bg-gray-200" },
      "scheduled": { dot: "#3b82f6", bg: "bg-blue-100", text: "text-blue-800", hover: "hover:bg-blue-200" },
      "to-be-rescheduled": { dot: "#f59e0b", bg: "bg-amber-100", text: "text-amber-800", hover: "hover:bg-amber-200" },
      "installation-in-progress": { dot: "#8b5cf6", bg: "bg-purple-100", text: "text-purple-800", hover: "hover:bg-purple-200" },
      "installation-completed": { dot: "#10b981", bg: "bg-green-100", text: "text-green-800", hover: "hover:bg-green-200" },
      "ces-certificate-applied": { dot: "#06b6d4", bg: "bg-cyan-100", text: "text-cyan-800", hover: "hover:bg-cyan-200" },
      "ces-certificate-received": { dot: "#14b8a6", bg: "bg-teal-100", text: "text-teal-800", hover: "hover:bg-teal-200" },
      "ces-certificate-submitted": { dot: "#0ea5e9", bg: "bg-sky-100", text: "text-sky-800", hover: "hover:bg-sky-200" },
      "grid-connection-initiated": { dot: "#6366f1", bg: "bg-indigo-100", text: "text-indigo-800", hover: "hover:bg-indigo-200" },
      "grid-connection-completed": { dot: "#a855f7", bg: "bg-violet-100", text: "text-violet-800", hover: "hover:bg-violet-200" },
      "system-handover": { dot: "#ec4899", bg: "bg-pink-100", text: "text-pink-800", hover: "hover:bg-pink-200" },
      "done": { dot: "#059669", bg: "bg-emerald-100", text: "text-emerald-800", hover: "hover:bg-emerald-200" },
      // Retailer Projects
      "retailer-new": { dot: "#6b7280", bg: "bg-gray-100", text: "text-gray-800", hover: "hover:bg-gray-200" },
      "site-inspection": { dot: "#f97316", bg: "bg-orange-100", text: "text-orange-800", hover: "hover:bg-orange-200" },
      "stage-one": { dot: "#3b82f6", bg: "bg-blue-100", text: "text-blue-800", hover: "hover:bg-blue-200" },
      "stage-two": { dot: "#8b5cf6", bg: "bg-purple-100", text: "text-purple-800", hover: "hover:bg-purple-200" },
      "full-system": { dot: "#10b981", bg: "bg-green-100", text: "text-green-800", hover: "hover:bg-green-200" },
      "canceled": { dot: "#ef4444", bg: "bg-red-100", text: "text-red-800", hover: "hover:bg-red-200" },
      "retailer-scheduled": { dot: "#3b82f6", bg: "bg-blue-100", text: "text-blue-800", hover: "hover:bg-blue-200" },
      "retailer-to-be-rescheduled": { dot: "#f59e0b", bg: "bg-amber-100", text: "text-amber-800", hover: "hover:bg-amber-200" },
      "retailer-installation-in-progress": { dot: "#8b5cf6", bg: "bg-purple-100", text: "text-purple-800", hover: "hover:bg-purple-200" },
      "retailer-installation-completed": { dot: "#10b981", bg: "bg-green-100", text: "text-green-800", hover: "hover:bg-green-200" },
      "retailer-ces-certificate-applied": { dot: "#06b6d4", bg: "bg-cyan-100", text: "text-cyan-800", hover: "hover:bg-cyan-200" },
      "retailer-ces-certificate-received": { dot: "#14b8a6", bg: "bg-teal-100", text: "text-teal-800", hover: "hover:bg-teal-200" },
      "retailer-ces-certificate-submitted": { dot: "#0ea5e9", bg: "bg-sky-100", text: "text-sky-800", hover: "hover:bg-sky-200" },
      "retailer-done": { dot: "#059669", bg: "bg-emerald-100", text: "text-emerald-800", hover: "hover:bg-emerald-200" },
      // Legacy statuses
      "not-started": { dot: "#6b7280", bg: "bg-gray-100", text: "text-gray-800", hover: "hover:bg-gray-200" },
      "in-progress": { dot: "#8b5cf6", bg: "bg-purple-100", text: "text-purple-800", hover: "hover:bg-purple-200" },
      "inspection": { dot: "#f97316", bg: "bg-orange-100", text: "text-orange-800", hover: "hover:bg-orange-200" },
      "completed": { dot: "#10b981", bg: "bg-green-100", text: "text-green-800", hover: "hover:bg-green-200" },
    };
    
    return colorMap[status] || { dot: "#6b7280", bg: "bg-gray-100", text: "text-gray-800", hover: "hover:bg-gray-200" };
  };

  // Helper function to validate and filter projects
  const isValidProject = (p: Project): boolean => {
    const name = (p.name || '').trim();
    // Filter out: empty names, "Untitled Project", names less than 2 characters, missing IDs
    return name && 
           name !== '' && 
           name !== 'Untitled Project' && 
           name.length >= 2 && 
           p.id && 
           p.id.trim() !== '' &&
           !name.toLowerCase().includes('unnamed') &&
           !name.toLowerCase().includes('untitled');
  };

  // Helper function to save projects to both localStorage and Firestore
  const saveProjectsToStorage = async (projectsToSave: Project[]) => {
    try {
      // Check for Test 8 before filtering
      const test8Before = projectsToSave.find(p => (p.name || '').toLowerCase().includes('test 8') || (p.name || '').toLowerCase().includes('test8'));
      if (test8Before) {
        console.log('[saveProjectsToStorage] Test 8 before filtering:', {
          id: test8Before.id,
          name: test8Before.name,
          isValid: isValidProject(test8Before)
        });
      }
      
      // Filter valid projects before saving - remove all invalid/unnamed projects
      const validProjects = projectsToSave.filter(isValidProject);
      
      // Check for Test 8 after filtering
      const test8After = validProjects.find(p => (p.name || '').toLowerCase().includes('test 8') || (p.name || '').toLowerCase().includes('test8'));
      if (test8After) {
        console.log('[saveProjectsToStorage] Test 8 after filtering:', {
          id: test8After.id,
          name: test8After.name,
          status: test8After.status
        });
      } else if (test8Before) {
        console.error('[saveProjectsToStorage] Test 8 was filtered out!', {
          id: test8Before.id,
          name: test8Before.name,
          nameLength: (test8Before.name || '').length,
          hasId: !!test8Before.id,
          idLength: (test8Before.id || '').trim().length
        });
      }
      
      if (validProjects.length < projectsToSave.length) {
        const removedCount = projectsToSave.length - validProjects.length;
        console.log(`[saveProjectsToStorage] Removed ${removedCount} invalid/unnamed project(s) before saving`);
      }
      
      // Save to localStorage
      localStorage.setItem('xtr_projects', JSON.stringify(validProjects));
      console.log(`[ProjectManagement] Saved ${validProjects.length} projects to localStorage`);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('xtr-projects-updated'));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const getProjectsByStatus = (status: ProjectStatus) => {
    // Debug: Log all projects before filtering
    if (status === "stage-one") {
      console.log(`[getProjectsByStatus] ALL projects before filtering (${projects.length}):`, 
        projects.map(p => ({ id: p.id, name: p.name, status: p.status, nameLength: (p.name || '').length }))
      );
    }
    
    const filtered = projects.filter((p) => {
      // Filter by status
      if (p.status !== status) {
        if (status === "stage-one" && (p.name || '').toLowerCase().includes('rishi')) {
          console.log(`[getProjectsByStatus] Rishi project status mismatch:`, { id: p.id, name: p.name, projectStatus: p.status, requestedStatus: status });
        }
        return false;
      }
      
      // Filter out invalid/nameless projects using validation function
      if (!isValidProject(p)) {
        console.log(`[getProjectsByStatus] Filtering out invalid/unnamed project:`, { id: p.id, name: p.name, status: p.status });
        return false;
      }
      
      return true;
    });
    
    // Debug logging for retailer projects
    if (status === "stage-one" || status === "stage-two" || status === "full-system" || status === "site-inspection") {
      console.log(`[getProjectsByStatus] Status: ${status}, Found ${filtered.length} projects:`, filtered.map(p => ({ id: p.id, name: p.name, status: p.status })));
      
      // Check if Scott Megens should be here
      const scottInAll = projects.find(p => (p.name || '').toLowerCase().includes('scott') || (p.name || '').toLowerCase().includes('megens'));
      if (scottInAll && status === "stage-one") {
        console.log(`[getProjectsByStatus] Scott Megens project exists in projects array:`, { 
          id: scottInAll.id, 
          name: scottInAll.name, 
          projectStatus: scottInAll.status, 
          requestedStatus: status,
          matches: scottInAll.status === status
        });
      }
      
      // Check if Rishi should be here
      const rishiInAll = projects.find(p => (p.name || '').toLowerCase().includes('rishi'));
      if (rishiInAll && status === "stage-one") {
        console.log(`[getProjectsByStatus] Rishi project exists in projects array:`, { 
          id: rishiInAll.id, 
          name: rishiInAll.name, 
          projectStatus: rishiInAll.status, 
          requestedStatus: status,
          matches: rishiInAll.status === status
        });
      }
    }
    
    return filtered;
  };

  const handleAddProject = () => {
    // For retailer site inspection, require key fields
    if (newProject.status === "site-inspection") {
      if (!newProject.customerName || !newProject.clientType || !newProject.systemType) {
        alert("Please fill in Customer Name, Client Type and System Type");
        return;
      }
    } else if (newProject.status === "retailer-new") {
      // For retailer-new, require customer name, job type, system type, and price
      if (!newProject.customerName || !newProject.jobType || !newProject.systemType || !newProject.priceAud) {
        alert("Please fill in Customer Name, Job Type, System Type, and Price (AUD)");
        return;
      }
      // Also require system-specific fields based on system type
      const hasPV = ["Only PV","PV+Battery","PV+Battery+EV Charger","PV+EV Charger"].includes(newProject.systemType);
      if (hasPV && !newProject.pvSystemSizeKw) {
        alert("Please fill in PV System Size (kW)");
        return;
      }
    } else if (!newProject.name || !newProject.systemSize || !newProject.cost) {
      alert("Please fill in all required fields (Name, System Size, Cost)");
      return;
    }

    // Map job type to status for retailer-new projects
    let projectStatus = newProject.status;
    if (newProject.status === "retailer-new" && newProject.jobType) {
      const jobTypeToStatus: Record<string, ProjectStatus> = {
        "Site Inspection": "site-inspection",
        "Stage One": "stage-one",
        "Stage Two": "stage-two",
        "Full System": "full-system"
      };
      projectStatus = jobTypeToStatus[newProject.jobType] || newProject.status;
      console.log('Job type mapping:', { jobType: newProject.jobType, mappedStatus: projectStatus });
    }

    // Determine if this is a retailer project
    const isRetailerProject = newProject.status === "retailer-new" || 
                               projectStatus === "site-inspection" || 
                               projectStatus === "stage-one" || 
                               projectStatus === "stage-two" || 
                               projectStatus === "full-system";
    
    const project: Project = {
      id: newProject.projectId || Date.now().toString(),
      name: isRetailerProject ? (newProject.customerName || newProject.name) : newProject.name,
      priority: newProject.priority,
      systemSize: isRetailerProject ? (newProject.pvSystemSizeKw || newProject.batterySizeKwh || "") : newProject.systemSize,
      type: newProject.type,
      cost: isRetailerProject ? newProject.priceAud : newProject.cost,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      assignee: newProject.assignee,
      status: projectStatus,
      // Map retailer extended fields into projectDetails
      projectDetails: (newProject.status === "site-inspection" || newProject.status === "retailer-new" || projectStatus === "site-inspection" || projectStatus === "stage-one" || projectStatus === "stage-two" || projectStatus === "full-system") ? {
        systemType: newProject.systemType,
      clientType: newProject.clientType,
        additionalInfo: {
          projectId: newProject.projectId,
          clientName: newProject.clientName,
      customerEmail: newProject.customerEmail,
      customerContact: newProject.customerContact,
      customerAddress: newProject.customerAddress,
          jobType: newProject.jobType || "Site Inspection",
          siteInspection: newProject.jobType === "Site Inspection" ? {
            date: newProject.siteInspectionDate,
            time: newProject.siteInspectionTime,
            status: newProject.siteInspectionStatus || "Pending",
          } : undefined,
          jobDate: ["Stage One", "Stage Two", "Full System"].includes(newProject.jobType) ? newProject.jobDate : undefined,
          priceAud: newProject.priceAud,
          location: newProject.location,
        },
        systemInfo: {
          systemSize: newProject.pvSystemSizeKw,
          inverterSize: newProject.inverterSizeKw,
          inverterBrand: newProject.inverterBrand,
          inverterType: newProject.inverterModel,
          panelBrand: newProject.panelBrand,
          panelModuleWatts: newProject.panelModuleWatts,
          batterySize: newProject.batterySizeKwh,
          batteryBrand: newProject.batteryBrand,
          batteryModel: newProject.batteryModel,
          evChargerBrand: newProject.evChargerBrand,
          evChargerModel: newProject.evChargerModel,
        },
        propertyInfo: {
          houseStorey: newProject.houseStorey === "Other" ? newProject.houseStoreyOther || "Other" : newProject.houseStorey,
          roofType: newProject.roofType === "Other" ? newProject.roofTypeOther || "Other" : newProject.roofType,
          meterPhase: newProject.meterPhase,
          accessSecondStorey: newProject.accessSecondStorey,
          accessToInverter: newProject.accessToInverter,
        },
        utilityInfo: newProject.status === "site-inspection" ? {
          energyRetailer: newProject.energyRetailer,
          distributor: newProject.energyDistributor,
          solarVictoriaEligible: newProject.solarVictoriaEligible,
          preApprovalNumber: newProject.preApprovalNumber,
          nmiNumber: newProject.nmiNumber,
          meterNumber: newProject.meterNumber,
        } : undefined,
      } : undefined,
    };

    const updatedProjects = [...projects, project];
    console.log('[handleAddProject] Creating project:', { 
      id: project.id, 
      name: project.name, 
      status: project.status, 
      jobType: newProject.jobType,
      customerName: newProject.customerName,
      isRetailerProject 
    });
    setProjects(updatedProjects);
    
    // Save to both localStorage and Firestore
    saveProjectsToStorage(updatedProjects).then(() => {
      console.log('[handleAddProject] Project saved successfully:', { id: project.id, name: project.name, status: project.status });
    });
    
    setNewProject({
      name: "",
      priority: "medium",
      systemSize: "",
      type: "Residential",
      cost: "",
      startDate: "",
      endDate: "",
      assignee: "",
      status: "new",
      projectId: "",
      customerName: "",
      customerEmail: "",
      customerContact: "",
      customerAddress: "",
      location: "",
      clientType: "",
      clientName: "",
      jobType: "",
      siteInspectionDate: "",
      siteInspectionTime: "",
      siteInspectionStatus: "",
      priceAud: "",
      systemType: "",
      pvSystemSizeKw: "",
      inverterSizeKw: "",
      inverterBrand: "",
      inverterModel: "",
      panelBrand: "",
      panelModuleWatts: "",
      batterySizeKwh: "",
      batteryBrand: "",
      batteryModel: "",
      evChargerBrand: "",
      evChargerModel: "",
      houseStorey: "",
      houseStoreyOther: "",
      roofType: "",
      roofTypeOther: "",
      meterPhase: "",
      accessSecondStorey: "",
      accessToInverter: "",
      energyRetailer: "",
      energyDistributor: "",
      solarVictoriaEligible: "",
      preApprovalNumber: "",
      nmiNumber: "",
      meterNumber: "",
    });
    setShowNewProjectDialog(false);
    alert("Project added successfully!");
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setSelectedAssignees(project.assignees || (project.assignee ? [project.assignee] : []));
    setNewComment("");
    
    // Load Installation Day data if project is completed
    if (project.status === "installation-completed" || project.status === "retailer-installation-completed") {
      try {
        const checklistKey = `xtr_installation_checklist_${project.id}`;
        const notesKey = `xtr_installation_notes_${project.id}`;
        const expensesKey = `xtr_installation_expenses_${project.id}`;
        const breaksKey = `xtr_installation_breaks_${project.id}`;
        const customerNotesKey = `xtr_installation_customer_notes_${project.id}`;
        const jobStatusKey = `xtr_installation_job_status_${project.id}`;
        const photosKey = `xtr_installation_photos_${project.id}`;
        
        const checklist = localStorage.getItem(checklistKey);
        const notes = localStorage.getItem(notesKey);
        const expenses = localStorage.getItem(expensesKey);
        const breaks = localStorage.getItem(breaksKey);
        const customerNotes = localStorage.getItem(customerNotesKey);
        const jobStatus = localStorage.getItem(jobStatusKey);
        const photos = localStorage.getItem(photosKey);
        
        setInstallationData({
          checklist: checklist ? JSON.parse(checklist) : [],
          checklistNotes: notes ? JSON.parse(notes) : {},
          expenses: expenses ? JSON.parse(expenses) : [],
          breaks: breaks ? JSON.parse(breaks) : [],
          customerNotes: customerNotes || "",
          jobStatus: jobStatus ? JSON.parse(jobStatus) : { jobStarted: false, jobPaused: false, jobStartTime: null, totalPausedDuration: 0 },
          photos: photos ? JSON.parse(photos) : []
        });
      } catch (error) {
        console.error('Error loading installation data:', error);
        setInstallationData(null);
      }
    } else {
      setInstallationData(null);
    }
    
    setShowProjectDetailsDialog(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
    setShowProjectDetailsDialog(false);
    setShowEditProjectDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingProject || !editingProject.name || !editingProject.systemSize || !editingProject.cost) {
      alert("Please fill in all required fields");
      return;
    }

    setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    setShowEditProjectDialog(false);
    setEditingProject(null);
    setSelectedProject(null);
    alert("Project updated successfully!");
  };

  // Handle adding comment
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedProject) return;
    
    const now = new Date();
    const date = now.toLocaleDateString('en-AU', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: userName || userEmail || 'Unknown',
      timestamp: now.toISOString(),
      date,
      time,
    };
    
    const updatedProject = {
      ...selectedProject,
      comments: [...(selectedProject.comments || []), comment],
    };
    
    const updatedProjects = projects.map(p => p.id === selectedProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);
    setNewComment("");
    
    // Save to both localStorage and Firestore
    saveProjectsToStorage(updatedProjects);
  };

  // Handle assignee change
  const handleAssigneeChange = (assignees: string[]) => {
    if (!selectedProject) return;
    
    const updatedProject = {
      ...selectedProject,
      assignees: assignees,
      assignee: assignees.length > 0 ? assignees[0] : '', // Keep single assignee for backward compatibility
    };
    
    const updatedProjects = projects.map(p => p.id === selectedProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);
    setSelectedAssignees(assignees);
    
    // Save to both localStorage and Firestore
    saveProjectsToStorage(updatedProjects);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    );
    setProjects(updatedProjects);
    
    // Save to both localStorage and Firestore
    saveProjectsToStorage(updatedProjects).then(() => {
      // Dispatch event for cross-page updates
      window.dispatchEvent(new Event('xtr-projects-updated'));
    });
    
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, status: newStatus });
    }
  };

  const handleExportSchedule = () => {
    // Create CSV content
    const headers = ["Name", "Priority", "System Size", "Type", "Cost", "Start Date", "End Date", "Assignee", "Status"];
    const rows = projects.map(p => [
      p.name,
      p.priority,
      p.systemSize,
      p.type,
      p.cost,
      p.startDate,
      p.endDate,
      p.assignee,
      p.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-schedule-${formatMonthYear(currentMonth).toLowerCase().replace(" ", "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert("Schedule exported successfully!");
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    const startStr = startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endStr = endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${startStr} - ${endStr}`;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      days.push(dayDate);
    }
    return days;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">Schedule and manage installations.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Local Only (Sync disabled)</span>
          </div>
          <Button variant="outline" onClick={handleExportSchedule}>
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex gap-2 border-b pb-4">
        <Button
          variant={currentView === "kanban" ? "default" : "ghost"}
          onClick={() => setCurrentView("kanban")}
          className={currentView === "kanban" ? "border-2" : ""}
        >
          In-House Projects
                  </Button>
        <Button
          variant={currentView === "retailer-projects" ? "default" : "ghost"}
          onClick={() => setCurrentView("retailer-projects")}
          className={currentView === "retailer-projects" ? "border-2" : ""}
        >
          Retailer Projects
                  </Button>
        <Button
          variant={currentView === "calendar" ? "default" : "ghost"}
          onClick={() => setCurrentView("calendar")}
          className={currentView === "calendar" ? "border-2" : ""}
        >
          Calendar View
                  </Button>
                </div>

      {/* In-House Projects Kanban Board */}
      {currentView === "kanban" && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {inHouseColumns.map((column) => {
              const columnProjects = getProjectsByStatus(column.id);
                    return (
                <div key={column.id} className="space-y-4 w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <Badge className="bg-green-100 text-green-800 border-green-200 rounded-full">
                      {columnProjects.length}
                    </Badge>
                      </div>
                  <p className="text-sm text-gray-600 mb-4">{column.description}</p>

                  {/* Project Cards */}
                  <div className="space-y-3">
                    {columnProjects.map((project) => (
                      <Card 
                        key={project.id} 
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleProjectClick(project)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-900">{project.name}</h4>
                            <Badge className={getPriorityColor(project.priority)}>
                              {project.priority}
                            </Badge>
                                  </div>
                          <p className="text-sm text-gray-700">{project.systemSize}</p>
                          <p className="text-sm text-gray-600">{project.type}</p>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm font-semibold text-gray-900">{project.cost}</span>
                            <span className="text-xs text-gray-500">
                              {project.startDate} - {project.endDate}
                            </span>
                  </div>
                <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Assigned to</span>
                            <Badge variant="outline" className="text-xs">
                              {project.assignee}
                            </Badge>
                  </div>
                  </div>
            </Card>
                    ))}
                  </div>

                    </div>
                  </div>
                    );
                  })}
              </div>
          </div>
      )}

      {/* Retailer Projects Kanban Board */}
      {currentView === "retailer-projects" && (
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Retailer Projects</h2>
                <div className="flex items-center gap-2">
              <p className="text-gray-600 mr-2">Manage and track retailer-specific projects</p>
                    <Button 
                type="button"
                variant="outline"
                className="h-8 px-2"
                onClick={() => {
                  const scroller = document.getElementById("retailer-scroll-container");
                  if (scroller) scroller.scrollBy({ left: -400, behavior: "smooth" });
                }}
                aria-label="Scroll left"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button 
                type="button"
                variant="outline"
                className="h-8 px-2"
                onClick={() => {
                  const scroller = document.getElementById("retailer-scroll-container");
                  if (scroller) scroller.scrollBy({ left: 400, behavior: "smooth" });
                }}
                aria-label="Scroll right"
                title="Scroll right"
              >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  </div>
                  </div>
          <div id="retailer-scroll-container" className="overflow-x-auto pb-4 w-full" style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-4 min-w-max whitespace-nowrap">
            {retailerColumns.map((column) => {
              const columnProjects = getProjectsByStatus(column.id);
              return (
                <div key={column.id} className="flex-shrink-0 w-80 space-y-4">
                  <div className="bg-white rounded-lg border p-4 h-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200 rounded-full">
                        {columnProjects.length}
                      </Badge>
                </div>
                    <p className="text-sm text-gray-600 mb-4">{column.description}</p>

                    {/* Project Cards */}
                    <div className="space-y-3">
                      {columnProjects.map((project) => {
                        // Check if this is a retailer project (stage-one, stage-two, full-system, site-inspection)
                        const isRetailerProject = ["stage-one", "stage-two", "full-system", "site-inspection"].includes(project.status);
                        const clientType = project.projectDetails?.clientType || project.projectDetails?.additionalInfo?.clientType;
                        const clientName = project.projectDetails?.additionalInfo?.clientName;
                        
                        return (
                          <Card 
                            key={project.id} 
                            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleProjectClick(project)}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                                <Badge className={getPriorityColor(project.priority)}>
                                  {project.priority}
                                </Badge>
                  </div>
                              {/* Show Client Type and Client Name for retailer projects */}
                              {isRetailerProject && (clientType || clientName) && (
                                <div className="space-y-1">
                                  {clientType && (
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">Client Type:</span> {clientType}
                                    </p>
                                  )}
                                  {clientName && (
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">Client Name:</span> {clientName}
                                    </p>
                                  )}
                  </div>
                              )}
                              <p className="text-sm text-gray-700">{project.systemSize}</p>
                              <p className="text-sm text-gray-600">{project.type}</p>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-sm font-semibold text-gray-900">{project.cost}</span>
                                <span className="text-xs text-gray-500">
                                  {project.startDate} - {project.endDate}
                                </span>
                </div>
                <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Assigned to</span>
                                <Badge variant="outline" className="text-xs">
                                  {project.assignee}
                                </Badge>
                  </div>
                  </div>
            </Card>
                        );
                      })}
                  </div>
                    {/* + Add Project only for New column */}
                    {column.id === "retailer-new" && (
                      <Button
                        variant="ghost"
                        className="w-full mt-4 border-2 border-dashed"
                        onClick={() => {
                          // Generate Project ID once when opening dialog
                          const generatedId = `PRJ-${new Date().toISOString().slice(0,10)}-${new Date().getTime().toString().slice(-4)}`;
                          setNewProject((prev) => ({ ...prev, status: column.id, projectId: generatedId }));
                          setShowNewProjectDialog(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
                </div>
              )}

      {/* Calendar View */}
      {currentView === "calendar" && (
        <div className="space-y-4">
          {/* View Toggle and Navigation */}
          <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Button 
                variant={calendarViewType === "month" ? "default" : "ghost"}
                onClick={() => setCalendarViewType("month")}
                className={calendarViewType === "month" ? "border-2" : ""}
              >
                Month
                    </Button>
                    <Button 
                variant={calendarViewType === "week" ? "default" : "ghost"}
                onClick={() => setCalendarViewType("week")}
                className={calendarViewType === "week" ? "border-2" : ""}
              >
                Week
                    </Button>
                  </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => calendarViewType === "month" ? navigateMonth("prev") : navigateWeek("prev")}>
                <ChevronLeft className="w-5 h-5" />
                  </Button>
              <h2 className="text-xl font-semibold">
                {calendarViewType === "month" ? formatMonthYear(currentMonth) : formatWeekRange(currentWeek)}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => calendarViewType === "month" ? navigateMonth("next") : navigateWeek("next")}>
                <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

          {/* Monthly View */}
          {calendarViewType === "month" && (
            <div className="bg-white rounded-lg border p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-700 py-2">
                      {day}
                    </div>
                  ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, index) => {
                  const day = index - 6; // Adjust for first week
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                  
                  // Filter projects with relevant statuses that match this date
                  // In-House Projects statuses
                  const inHouseStatuses = [
                    "scheduled", "to-be-rescheduled", "installation-in-progress", "installation-completed",
                    "ces-certificate-applied", "ces-certificate-received", "grid-connection-initiated",
                    "grid-connection-completed", "system-handover", "done"
                  ];
                  // Retailer Projects statuses
                  const retailerStatuses = [
                    "retailer-scheduled", "retailer-to-be-rescheduled", "retailer-installation-in-progress",
                    "retailer-installation-completed", "retailer-ces-certificate-applied", "retailer-ces-certificate-received",
                    "site-inspection", "stage-one", "stage-two", "full-system", "retailer-done"
                  ];
                  const allCalendarStatuses = [...inHouseStatuses, ...retailerStatuses];
                  
                  const dayProjects = projects.filter(p => {
                    if (!allCalendarStatuses.includes(p.status)) return false;
                    
                    // Check various date fields
                    const projectDate = p.startDate || 
                                      p.projectDetails?.additionalInfo?.jobDate ||
                                      p.projectDetails?.additionalInfo?.siteInspection?.date ||
                                      p.projectSnapshot?.startDate;
                    
                    if (!projectDate) return false;
                    
                    // Compare dates (handle both YYYY-MM-DD and other formats)
                    const projDateStr = typeof projectDate === 'string' 
                      ? projectDate.split('T')[0] 
                      : new Date(projectDate).toISOString().split('T')[0];
                    
                    return projDateStr === dateStr;
                  });
                  
                  // Separate in-house and retailer projects
                  const inHouseProjects = dayProjects.filter(p => inHouseStatuses.includes(p.status));
                  const retailerProjects = dayProjects.filter(p => retailerStatuses.includes(p.status));
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-24 border rounded p-2 ${
                        date.getMonth() !== currentMonth.getMonth() ? "bg-gray-50 text-gray-400" : "bg-white"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                      <div className="space-y-1">
                        {/* Show all projects with status-specific colors */}
                        {dayProjects.slice(0, 2).map((project) => {
                          const statusColor = getStatusColor(project.status);
                          // Determine if it's an In-House or Retailer project
                          const isRetailerProject = retailerStatuses.includes(project.status);
                          const isInHouseProject = inHouseStatuses.includes(project.status);
                          
                          return (
                            <div
                              key={project.id}
                              className={`text-xs p-1 ${statusColor.bg} ${statusColor.text} rounded cursor-pointer ${statusColor.hover} flex items-center gap-1.5 relative`}
                              onClick={() => handleProjectClick(project)}
                              style={{
                                borderLeft: isRetailerProject ? '3px solid #10b981' : isInHouseProject ? '3px solid #3b82f6' : '3px solid transparent'
                              }}
                            >
                              {/* Type indicator dot (smaller, on the left) */}
                              <span 
                                className="flex-shrink-0" 
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  backgroundColor: isRetailerProject ? '#10b981' : isInHouseProject ? '#3b82f6' : '#6b7280',
                                  borderRadius: '50%',
                                  display: 'inline-block'
                                }}
                                title={isRetailerProject ? 'Retailer' : isInHouseProject ? 'In-House' : 'Unknown'}
                              ></span>
                              {/* Status indicator dot */}
                              <span 
                                className="flex-shrink-0" 
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  backgroundColor: statusColor.dot,
                                  borderRadius: '50%',
                                  display: 'inline-block'
                                }}
                                title={`Status: ${project.status}`}
                              ></span>
                              <span>{project.name}</span>
                          </div>
                          );
                        })}
                        {dayProjects.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayProjects.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
                    </div>
                </div>
              )}

          {/* Legend */}
          <div className="bg-white rounded-lg border p-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Legend</h3>
            <div className="mb-4 pb-4 border-b">
              <p className="text-xs font-semibold text-gray-600 mb-2">Project Type Indicators:</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span 
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}
                    ></span>
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginLeft: '2px'
                      }}
                    ></span>
                      </div>
                  <span className="text-xs text-gray-700">In-House Project (Blue border + dots)</span>
                      </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span 
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}
                    ></span>
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginLeft: '2px'
                      }}
                    ></span>
                    </div>
                  <span className="text-xs text-gray-700">Retailer Project (Green border + dots)</span>
                    </div>
                  </div>
              <p className="text-xs text-gray-500 mt-2">The left border and first dot indicate project type. The second dot indicates status.</p>
              </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* In-House Projects Statuses */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 mb-1">In-House Projects</p>
                {[
                  { status: "scheduled" as ProjectStatus, label: "Scheduled" },
                  { status: "to-be-rescheduled" as ProjectStatus, label: "To Be Rescheduled" },
                  { status: "installation-in-progress" as ProjectStatus, label: "Installation In-Progress" },
                  { status: "installation-completed" as ProjectStatus, label: "Installation Completed" },
                  { status: "ces-certificate-applied" as ProjectStatus, label: "CES Applied" },
                  { status: "ces-certificate-received" as ProjectStatus, label: "CES Received" },
                  { status: "grid-connection-initiated" as ProjectStatus, label: "Grid Initiated" },
                  { status: "grid-connection-completed" as ProjectStatus, label: "Grid Completed" },
                  { status: "system-handover" as ProjectStatus, label: "System Handover" },
                  { status: "done" as ProjectStatus, label: "Done" },
                ].map(({ status, label }) => {
                  const statusColor = getStatusColor(status);
                  return (
                    <div key={status} className="flex items-center gap-2">
                      <span 
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: statusColor.dot,
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}
                      ></span>
                      <span className="text-xs text-gray-700">{label}</span>
                  </div>
                  );
                })}
                      </div>
              {/* Retailer Projects Statuses */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 mb-1">Retailer Projects</p>
                {[
                  { status: "site-inspection" as ProjectStatus, label: "Site Inspection" },
                  { status: "stage-one" as ProjectStatus, label: "Stage One" },
                  { status: "stage-two" as ProjectStatus, label: "Stage Two" },
                  { status: "full-system" as ProjectStatus, label: "Full System" },
                  { status: "retailer-scheduled" as ProjectStatus, label: "Scheduled" },
                  { status: "retailer-to-be-rescheduled" as ProjectStatus, label: "To Be Rescheduled" },
                  { status: "retailer-installation-in-progress" as ProjectStatus, label: "Installation In-Progress" },
                  { status: "retailer-installation-completed" as ProjectStatus, label: "Installation Completed" },
                  { status: "retailer-ces-certificate-applied" as ProjectStatus, label: "CES Applied" },
                  { status: "retailer-ces-certificate-received" as ProjectStatus, label: "CES Received" },
                  { status: "retailer-done" as ProjectStatus, label: "Done" },
                ].map(({ status, label }) => {
                  const statusColor = getStatusColor(status);
                  return (
                    <div key={status} className="flex items-center gap-2">
                      <span 
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: statusColor.dot,
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}
                      ></span>
                      <span className="text-xs text-gray-700">{label}</span>
              </div>
                  );
                })}
                </div>
                </div>
                </div>

          {/* Weekly View */}
          {calendarViewType === "week" && (
            <div className="bg-white rounded-lg border p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-700 py-2">
                    {day}
              </div>
                ))}
                      </div>
              <div className="grid grid-cols-7 gap-2">
                {getWeekDays(currentWeek).map((date, index) => {
                  const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                  
                  // Filter projects with relevant statuses that match this date
                  // In-House Projects statuses
                  const inHouseStatuses = [
                    "scheduled", "to-be-rescheduled", "installation-in-progress", "installation-completed",
                    "ces-certificate-applied", "ces-certificate-received", "grid-connection-initiated",
                    "grid-connection-completed", "system-handover", "done"
                  ];
                  // Retailer Projects statuses
                  const retailerStatuses = [
                    "retailer-scheduled", "retailer-to-be-rescheduled", "retailer-installation-in-progress",
                    "retailer-installation-completed", "retailer-ces-certificate-applied", "retailer-ces-certificate-received",
                    "site-inspection", "stage-one", "stage-two", "full-system", "retailer-done"
                  ];
                  const allCalendarStatuses = [...inHouseStatuses, ...retailerStatuses];
                  
                  const dayProjects = projects.filter(p => {
                    if (!allCalendarStatuses.includes(p.status)) return false;
                    
                    // Check various date fields
                    const projectDate = p.startDate || 
                                      p.projectDetails?.additionalInfo?.jobDate ||
                                      p.projectDetails?.additionalInfo?.siteInspection?.date ||
                                      p.projectSnapshot?.startDate;
                    
                    if (!projectDate) return false;
                    
                    // Compare dates (handle both YYYY-MM-DD and other formats)
                    const projDateStr = typeof projectDate === 'string' 
                      ? projectDate.split('T')[0] 
                      : new Date(projectDate).toISOString().split('T')[0];
                    
                    return projDateStr === dateStr;
                  });
                  
                  // Separate in-house and retailer projects
                  const inHouseProjects = dayProjects.filter(p => inHouseStatuses.includes(p.status));
                  const retailerProjects = dayProjects.filter(p => retailerStatuses.includes(p.status));
                  
                  return (
                    <div
                      key={index}
                      className="min-h-96 border rounded p-2 bg-white"
                    >
                      <div className="text-sm font-medium mb-2">
                        {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
                      <div className="space-y-1">
                        {/* Show all projects with status-specific colors */}
                        {dayProjects.map((project) => {
                          const statusColor = getStatusColor(project.status);
                          // Determine if it's an In-House or Retailer project
                          const isRetailerProject = retailerStatuses.includes(project.status);
                          const isInHouseProject = inHouseStatuses.includes(project.status);
                          
                          return (
                            <div
                              key={project.id}
                              className={`text-xs p-1 ${statusColor.bg} ${statusColor.text} rounded cursor-pointer ${statusColor.hover} flex items-center gap-1.5 relative`}
                              onClick={() => handleProjectClick(project)}
                              style={{
                                borderLeft: isRetailerProject ? '3px solid #10b981' : isInHouseProject ? '3px solid #3b82f6' : '3px solid transparent'
                              }}
                            >
                              {/* Type indicator dot (smaller, on the left) */}
                              <span 
                                className="flex-shrink-0" 
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  backgroundColor: isRetailerProject ? '#10b981' : isInHouseProject ? '#3b82f6' : '#6b7280',
                                  borderRadius: '50%',
                                  display: 'inline-block'
                                }}
                                title={isRetailerProject ? 'Retailer' : isInHouseProject ? 'In-House' : 'Unknown'}
                              ></span>
                              {/* Status indicator dot */}
                              <span 
                                className="flex-shrink-0" 
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  backgroundColor: statusColor.dot,
                                  borderRadius: '50%',
                                  display: 'inline-block'
                                }}
                                title={`Status: ${project.status}`}
                              ></span>
                              <span>{project.name}</span>
            </div>
                          );
                        })}
              </div>
            </div>
                  );
                })}
                </div>
                </div>
          )}
                </div>
      )}

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
            <DialogTitle>Schedule New Project</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            {/* Retailer New column specialized form */}
            {newProject.status === "retailer-new" && (
          <div className="space-y-6">
                {/* Auto Project ID */}
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Project ID</Label>
                  <Input 
                      value={newProject.projectId || ""}
                      onChange={(e) => setNewProject({ ...newProject, projectId: e.target.value })}
                      placeholder="Auto-generated"
                  />
                </div>
                <div className="space-y-2">
                    <Label>Job Type</Label>
                    <Select value={newProject.jobType} onValueChange={(v)=>setNewProject({ ...newProject, jobType: v, siteInspectionStatus: v === "Site Inspection" ? "Pending" : newProject.siteInspectionStatus })}>
                      <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Site Inspection">Site Inspection</SelectItem>
                        <SelectItem value="Stage One">Stage One</SelectItem>
                        <SelectItem value="Stage Two">Stage Two</SelectItem>
                        <SelectItem value="Full System">Full System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>

                {/* Customer */}
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input value={newProject.customerName} onChange={(e)=>setNewProject({ ...newProject, customerName: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>Customer Email</Label>
                    <Input type="email" value={newProject.customerEmail} onChange={(e)=>setNewProject({ ...newProject, customerEmail: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>Customer Contact</Label>
                    <Input value={newProject.customerContact} onChange={(e)=>setNewProject({ ...newProject, customerContact: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Address</Label>
                    <Input value={newProject.customerAddress} onChange={(e)=>setNewProject({ ...newProject, customerAddress: e.target.value })} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Location (Google Maps)</Label>
                    <Input placeholder="Paste Google Maps link or address" value={newProject.location} onChange={(e)=>setNewProject({ ...newProject, location: e.target.value })} />
                </div>
              </div>

                {/* Client info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Client Type</Label>
                    <Select value={newProject.clientType || undefined} onValueChange={(v)=>setNewProject({ ...newProject, clientType: v })}>
                      <SelectTrigger><SelectValue placeholder="Select client type" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Retailer">Retailer</SelectItem>
                        <SelectItem value="Builder">Builder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    <Input value={newProject.clientName} onChange={(e)=>setNewProject({ ...newProject, clientName: e.target.value })} />
                  </div>
                  </div>

                {/* Conditional date/time based on Job Type */}
                {newProject.jobType === "Site Inspection" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Site Inspection Date</Label>
                        <Input type="date" value={newProject.siteInspectionDate} onChange={(e)=>setNewProject({ ...newProject, siteInspectionDate: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Site Inspection Time</Label>
                        <Input type="time" value={newProject.siteInspectionTime} onChange={(e)=>setNewProject({ ...newProject, siteInspectionTime: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Site Inspection Status</Label>
                      <Input value={newProject.siteInspectionStatus || "Pending"} readOnly placeholder="Enter site inspection status" />
                    </div>
                  </>
                )}
                {["Stage One", "Stage Two", "Full System"].includes(newProject.jobType) && (
                  <div className="space-y-2">
                    <Label>{newProject.jobType} Date</Label>
                    <Input type="date" value={newProject.jobDate} onChange={(e)=>setNewProject({ ...newProject, jobDate: e.target.value })} />
                </div>
              )}

                {/* Price */}
                  <div className="space-y-2">
                  <Label>Price (AUD)</Label>
                  <Input value={newProject.priceAud} onChange={(e)=>setNewProject({ ...newProject, priceAud: e.target.value })} placeholder="e.g., 8500" />
                  </div>

                {/* System type + conditional fields */}
                <div className="space-y-2">
                  <Label>System Type</Label>
                  <Select value={newProject.systemType} onValueChange={(v)=>setNewProject({ ...newProject, systemType: v })}>
                    <SelectTrigger><SelectValue placeholder="Select system type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Only PV">Only PV</SelectItem>
                      <SelectItem value="PV+Battery">PV+Battery</SelectItem>
                      <SelectItem value="PV+Battery+EV Charger">PV+Battery+EV Charger</SelectItem>
                      <SelectItem value="Only Battery">Only Battery</SelectItem>
                      <SelectItem value="Only EV Charger">Only EV Charger</SelectItem>
                      <SelectItem value="PV+EV Charger">PV+EV Charger</SelectItem>
                      <SelectItem value="Battery+EV Charger">Battery+EV Charger</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

                {/* PV fields */}
                {["Only PV","PV+Battery","PV+Battery+EV Charger","PV+EV Charger"].includes(newProject.systemType) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>PV System Size (kW)</Label><Input value={newProject.pvSystemSizeKw} onChange={(e)=>setNewProject({ ...newProject, pvSystemSizeKw: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Inverter Size (kW)</Label><Input value={newProject.inverterSizeKw} onChange={(e)=>setNewProject({ ...newProject, inverterSizeKw: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Inverter Brand</Label><Input value={newProject.inverterBrand} onChange={(e)=>setNewProject({ ...newProject, inverterBrand: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Model Number</Label><Input value={newProject.inverterModel} onChange={(e)=>setNewProject({ ...newProject, inverterModel: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Panel Brand</Label><Input value={newProject.panelBrand} onChange={(e)=>setNewProject({ ...newProject, panelBrand: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Panel Module (watts)</Label><Input value={newProject.panelModuleWatts} onChange={(e)=>setNewProject({ ...newProject, panelModuleWatts: e.target.value })} /></div>
                </div>
              )}

                {/* Battery fields */}
                {["Only Battery","PV+Battery","PV+Battery+EV Charger","Battery+EV Charger"].includes(newProject.systemType) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Battery Size (kWh)</Label><Input value={newProject.batterySizeKwh} onChange={(e)=>setNewProject({ ...newProject, batterySizeKwh: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Battery Brand</Label><Input value={newProject.batteryBrand} onChange={(e)=>setNewProject({ ...newProject, batteryBrand: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Battery Model</Label><Input value={newProject.batteryModel} onChange={(e)=>setNewProject({ ...newProject, batteryModel: e.target.value })} /></div>
                  </div>
                )}

                {/* EV Charger fields */}
                {["Only EV Charger","PV+EV Charger","PV+Battery+EV Charger","Battery+EV Charger"].includes(newProject.systemType) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>EV Charger Brand</Label><Input value={newProject.evChargerBrand} onChange={(e)=>setNewProject({ ...newProject, evChargerBrand: e.target.value })} /></div>
                    <div className="space-y-2"><Label>EV Charger Model</Label><Input value={newProject.evChargerModel} onChange={(e)=>setNewProject({ ...newProject, evChargerModel: e.target.value })} /></div>
                </div>
              )}

                {/* Property Information */}
                  <div className="space-y-2">
                  <p className="font-medium">Property Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>House Storey</Label>
                      <Select value={newProject.houseStorey} onValueChange={(v)=>setNewProject({ ...newProject, houseStorey: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Triple">Triple</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                    {newProject.houseStorey === "Other" && (
                      <div className="space-y-2">
                        <Label>House Storey (Other)</Label>
                        <Textarea value={newProject.houseStoreyOther} onChange={(e)=>setNewProject({ ...newProject, houseStoreyOther: e.target.value })} />
                  </div>
                    )}
                    <div className="space-y-2">
                      <Label>Roof Type</Label>
                      <Select value={newProject.roofType} onValueChange={(v)=>setNewProject({ ...newProject, roofType: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tin (Colorbond)">Tin (Colorbond)</SelectItem>
                          <SelectItem value="Tin (Kliplock)">Tin (Kliplock)</SelectItem>
                          <SelectItem value="Tile (Concrete)">Tile (Concrete)</SelectItem>
                          <SelectItem value="Tile (Terracotta)">Tile (Terracotta)</SelectItem>
                          <SelectItem value="Flat">Flat</SelectItem>
                          <SelectItem value="NA">NA</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newProject.roofType === "Other" && (
                      <div className="space-y-2">
                        <Label>Roof Type (Other)</Label>
                        <Textarea value={newProject.roofTypeOther} onChange={(e)=>setNewProject({ ...newProject, roofTypeOther: e.target.value })} />
                </div>
              )}
                    <div className="space-y-2">
                      <Label>Meter Phase</Label>
                      <Select value={newProject.meterPhase} onValueChange={(v)=>setNewProject({ ...newProject, meterPhase: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Three">Three</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                    <div className="space-y-2">
                      <Label>Access to 2 Storey</Label>
                      <Select value={newProject.accessSecondStorey} onValueChange={(v)=>setNewProject({ ...newProject, accessSecondStorey: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="NA">NA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Access to Inverter</Label>
                      <Select value={newProject.accessToInverter} onValueChange={(v)=>setNewProject({ ...newProject, accessToInverter: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="No Access Required">No Access Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </div>
                  </div>
                </div>
              )}
            {/* Retailer Site Inspection specialized form */}
            {newProject.status === "site-inspection" && (
          <div className="space-y-6">
                {/* Auto Project ID */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project ID</Label>
                    <Input
                      value={newProject.projectId || `PRJ-${newProject.startDate || new Date().toISOString().slice(0,10)}-${(newProject.projectId || '').split('-').pop() || new Date().getTime().toString().slice(-4)}`}
                      onChange={(e) => setNewProject({ ...newProject, projectId: e.target.value })}
                      placeholder="Auto-generated"
                    />
                  </div>
                <div className="space-y-2">
                    <Label>Job Type</Label>
                    <Input value={newProject.jobType || "Site Inspection"} readOnly />
                  </div>
                </div>

                {/* Customer */}
                  <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input value={newProject.customerName} onChange={(e)=>setNewProject({ ...newProject, customerName: e.target.value })} />
                    </div>
                <div className="space-y-2">
                    <Label>Customer Email</Label>
                    <Input type="email" value={newProject.customerEmail} onChange={(e)=>setNewProject({ ...newProject, customerEmail: e.target.value })} />
                    </div>
                <div className="space-y-2">
                    <Label>Customer Contact</Label>
                    <Input value={newProject.customerContact} onChange={(e)=>setNewProject({ ...newProject, customerContact: e.target.value })} />
                  </div>
                <div className="space-y-2">
                    <Label>Customer Address</Label>
                    <Input value={newProject.customerAddress} onChange={(e)=>setNewProject({ ...newProject, customerAddress: e.target.value })} />
                </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Location (Google Maps)</Label>
                    <Input placeholder="Paste Google Maps link or address" value={newProject.location} onChange={(e)=>setNewProject({ ...newProject, location: e.target.value })} />
                </div>
            </div>

                {/* Client info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Client Type</Label>
                    <Select value={newProject.clientType || undefined} onValueChange={(v)=>setNewProject({ ...newProject, clientType: v })}>
                      <SelectTrigger><SelectValue placeholder="Select client type" /></SelectTrigger>
                <SelectContent>
                        <SelectItem value="Retailer">Retailer</SelectItem>
                        <SelectItem value="Builder">Builder</SelectItem>
                </SelectContent>
              </Select>
                    </div>
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    <Input value={newProject.clientName} onChange={(e)=>setNewProject({ ...newProject, clientName: e.target.value })} />
                  </div>
            </div>

                {/* Site inspection date/time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Site Inspection Date</Label>
                    <Input type="date" value={newProject.siteInspectionDate} onChange={(e)=>setNewProject({ ...newProject, siteInspectionDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>Site Inspection Time</Label>
                    <Input type="time" value={newProject.siteInspectionTime} onChange={(e)=>setNewProject({ ...newProject, siteInspectionTime: e.target.value })} />
                </div>
                </div>
                {/* Site Inspection Status */}
                <div className="space-y-2">
                  <Label>Site Inspection Status</Label>
                  <Input value={newProject.siteInspectionStatus || "Pending"} readOnly placeholder="Enter site inspection status" />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label>Price (AUD)</Label>
                  <Input value={newProject.priceAud} onChange={(e)=>setNewProject({ ...newProject, priceAud: e.target.value })} placeholder="e.g., 8500" />
                </div>

                {/* System type + conditional fields */}
                <div className="space-y-2">
                  <Label>System Type</Label>
                  <Select value={newProject.systemType} onValueChange={(v)=>setNewProject({ ...newProject, systemType: v })}>
                    <SelectTrigger><SelectValue placeholder="Select system type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Only PV">Only PV</SelectItem>
                      <SelectItem value="PV+Battery">PV+Battery</SelectItem>
                      <SelectItem value="PV+Battery+EV Charger">PV+Battery+EV Charger</SelectItem>
                      <SelectItem value="Only Battery">Only Battery</SelectItem>
                      <SelectItem value="Only EV Charger">Only EV Charger</SelectItem>
                      <SelectItem value="PV+EV Charger">PV+EV Charger</SelectItem>
                      <SelectItem value="Battery+EV Charger">Battery+EV Charger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* PV fields */}
                {["Only PV","PV+Battery","PV+Battery+EV Charger","PV+EV Charger"].includes(newProject.systemType) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>PV System Size (kW)</Label><Input value={newProject.pvSystemSizeKw} onChange={(e)=>setNewProject({ ...newProject, pvSystemSizeKw: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Inverter Size (kW)</Label><Input value={newProject.inverterSizeKw} onChange={(e)=>setNewProject({ ...newProject, inverterSizeKw: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Inverter Brand</Label><Input value={newProject.inverterBrand} onChange={(e)=>setNewProject({ ...newProject, inverterBrand: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Model Number</Label><Input value={newProject.inverterModel} onChange={(e)=>setNewProject({ ...newProject, inverterModel: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Panel Brand</Label><Input value={newProject.panelBrand} onChange={(e)=>setNewProject({ ...newProject, panelBrand: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Panel Module (watts)</Label><Input value={newProject.panelModuleWatts} onChange={(e)=>setNewProject({ ...newProject, panelModuleWatts: e.target.value })} /></div>
              </div>
              )}

                {/* Battery fields */}
                {["Only Battery","PV+Battery","PV+Battery+EV Charger","Battery+EV Charger"].includes(newProject.systemType) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Battery Size (kWh)</Label><Input value={newProject.batterySizeKwh} onChange={(e)=>setNewProject({ ...newProject, batterySizeKwh: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Battery Brand</Label><Input value={newProject.batteryBrand} onChange={(e)=>setNewProject({ ...newProject, batteryBrand: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Battery Model</Label><Input value={newProject.batteryModel} onChange={(e)=>setNewProject({ ...newProject, batteryModel: e.target.value })} /></div>
            </div>
              )}

                {/* EV Charger fields */}
                {["Only EV Charger","PV+EV Charger","PV+Battery+EV Charger","Battery+EV Charger"].includes(newProject.systemType) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>EV Charger Brand</Label><Input value={newProject.evChargerBrand} onChange={(e)=>setNewProject({ ...newProject, evChargerBrand: e.target.value })} /></div>
                    <div className="space-y-2"><Label>EV Charger Model</Label><Input value={newProject.evChargerModel} onChange={(e)=>setNewProject({ ...newProject, evChargerModel: e.target.value })} /></div>
                </div>
              )}

            {/* Property Information */}
                <div className="space-y-2">
                  <p className="font-medium">Property Information</p>
                  <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>House Storey</Label>
                      <Select value={newProject.houseStorey} onValueChange={(v)=>setNewProject({ ...newProject, houseStorey: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Triple">Triple</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                    {newProject.houseStorey === "Other" && (
                  <div className="space-y-2">
                        <Label>House Storey (Other)</Label>
                        <Textarea value={newProject.houseStoreyOther} onChange={(e)=>setNewProject({ ...newProject, houseStoreyOther: e.target.value })} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Roof Type</Label>
                      <Select value={newProject.roofType} onValueChange={(v)=>setNewProject({ ...newProject, roofType: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                          <SelectItem value="Tin (Colorbond)">Tin (Colorbond)</SelectItem>
                          <SelectItem value="Tin (Kliplock)">Tin (Kliplock)</SelectItem>
                          <SelectItem value="Tile (Concrete)">Tile (Concrete)</SelectItem>
                          <SelectItem value="Tile (Terracotta)">Tile (Terracotta)</SelectItem>
                          <SelectItem value="Flat">Flat</SelectItem>
                          <SelectItem value="NA">NA</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                    {newProject.roofType === "Other" && (
                  <div className="space-y-2">
                        <Label>Roof Type (Other)</Label>
                        <Textarea value={newProject.roofTypeOther} onChange={(e)=>setNewProject({ ...newProject, roofTypeOther: e.target.value })} />
                  </div>
                )}
                <div className="space-y-2">
                      <Label>Meter Phase</Label>
                      <Select value={newProject.meterPhase} onValueChange={(v)=>setNewProject({ ...newProject, meterPhase: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Three">Three</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  <div className="space-y-2">
                      <Label>Access to 2 Storey</Label>
                      <Select value={newProject.accessSecondStorey} onValueChange={(v)=>setNewProject({ ...newProject, accessSecondStorey: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="NA">NA</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                <div className="space-y-2">
                      <Label>Access to Inverter</Label>
                      <Select value={newProject.accessToInverter} onValueChange={(v)=>setNewProject({ ...newProject, accessToInverter: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="No Access Required">No Access Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  </div>
                </div>

                {/* Utility Information */}
                <div className="space-y-2">
                  <p className="font-medium">Utility Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Energy Retailer</Label><Input value={newProject.energyRetailer} onChange={(e)=>setNewProject({ ...newProject, energyRetailer: e.target.value })} /></div>
                    <div className="space-y-2">
                      <Label>Energy Distributor</Label>
                      <Select value={newProject.energyDistributor} onValueChange={(v)=>setNewProject({ ...newProject, energyDistributor: v })}>
                        <SelectTrigger><SelectValue placeholder="Select distributor" /></SelectTrigger>
                    <SelectContent>
                          <SelectItem value="AusNet">AusNet</SelectItem>
                          <SelectItem value="PowerCor">PowerCor</SelectItem>
                          <SelectItem value="CitiPower">CitiPower</SelectItem>
                          <SelectItem value="United Energy">Uniter Energy</SelectItem>
                          <SelectItem value="Jemena">Jemena</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                      <Label>Solar Victoria Eligibility</Label>
                      <Select value={newProject.solarVictoriaEligible} onValueChange={(v)=>setNewProject({ ...newProject, solarVictoriaEligible: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                    <div className="space-y-2"><Label>Pre-Approval Reference Number</Label><Input value={newProject.preApprovalNumber} onChange={(e)=>setNewProject({ ...newProject, preApprovalNumber: e.target.value })} /></div>
                    <div className="space-y-2"><Label>NMI Number</Label><Input value={newProject.nmiNumber} onChange={(e)=>setNewProject({ ...newProject, nmiNumber: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Meter Number</Label><Input value={newProject.meterNumber} onChange={(e)=>setNewProject({ ...newProject, meterNumber: e.target.value })} /></div>
                  </div>
              </div>
                      </div>
                    )}
            {newProject.status !== "site-inspection" && newProject.status !== "retailer-new" && (
              <>
                {/* Project Name */}
                      <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                        <Input 
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                  </div>
                  
                {/* Priority and System Size */}
                <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newProject.priority}
                      onValueChange={(value) => setNewProject({ ...newProject, priority: value as Priority })}
                    >
                          <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    
                      <div className="space-y-2">
                    <Label htmlFor="systemSize">System Size *</Label>
                    <Input
                      id="systemSize"
                      value={newProject.systemSize}
                      onChange={(e) => setNewProject({ ...newProject, systemSize: e.target.value })}
                      placeholder="e.g., 5kW System"
                    />
                      </div>
                </div>
                    
                {/* Type and Cost */}
                <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                    <Label htmlFor="type">Project Type</Label>
                    <Select
                      value={newProject.type}
                      onValueChange={(value) => setNewProject({ ...newProject, type: value as ProjectType })}
                    >
                          <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                    <Label htmlFor="cost">Cost *</Label>
                    <Input
                      id="cost"
                      value={newProject.cost}
                      onChange={(e) => setNewProject({ ...newProject, cost: e.target.value })}
                      placeholder="e.g., $8,500"
                    />
                      </div>
                  </div>

                {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                  <Input
                      id="startDate"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      placeholder="e.g., Nov 1"
                  />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                  <Input
                      id="endDate"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      placeholder="e.g., Nov 3"
                  />
              </div>
            </div>

                {/* Assignee */}
              <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newProject.assignee}
                    onChange={(e) => setNewProject({ ...newProject, assignee: e.target.value })}
                    placeholder="e.g., TA, TB"
                />
              </div>
              </>
            )}
            </div>

          <DialogFooter className="flex flex-row gap-2 px-6 py-4 border-t bg-white flex-shrink-0 justify-end w-full sticky bottom-0 z-10">
              <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                Cancel
              </Button>
            <Button 
              onClick={handleAddProject} 
              variant="outline"
              className="text-gray-900 border border-gray-300 bg-white hover:bg-teal-600 hover:text-white hover:border-teal-600 min-w-[140px] flex items-center justify-center"
            >
                <Plus className="w-4 h-4 mr-2" />
              {newProject.status === "site-inspection" || newProject.status === "retailer-new" ? "Create Project" : "Create Project"}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDetailsDialog} onOpenChange={setShowProjectDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span>Project Details</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProjectDetailsDialog(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
            <DialogDescription className="sr-only">
              View and edit project details, assignees, and comments
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6 px-6 py-4 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Project Name and Priority */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-gray-500 text-sm">Project Name</Label>
                      <Input 
                    value={selectedProject.name}
                    onChange={(e) => setSelectedProject({ ...selectedProject, name: e.target.value })}
                    className="text-xl font-bold mt-1"
                  />
                  <p className="text-gray-600 mt-1 text-sm">Project ID: {selectedProject.id}</p>
                    </div>
                <div className="space-y-1">
                  <Label className="text-gray-500 text-sm">Priority</Label>
                  <Select
                    value={selectedProject.priority}
                    onValueChange={(value) => setSelectedProject({ ...selectedProject, priority: value as Priority })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                </div>

              {/* Project Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">System Size</Label>
                  <Input
                    value={selectedProject.systemSize}
                    onChange={(e) => setSelectedProject({ ...selectedProject, systemSize: e.target.value })}
                    placeholder="e.g., 6.6kW"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Project Type</Label>
                  <Select
                    value={selectedProject.type}
                    onValueChange={(value) => setSelectedProject({ ...selectedProject, type: value as ProjectType })}
                  >
                        <SelectTrigger>
                      <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Cost</Label>
                      <Input
                    value={selectedProject.cost}
                    onChange={(e) => setSelectedProject({ ...selectedProject, cost: e.target.value })}
                    placeholder="e.g., $15,000"
                        />
                  </div>
                </div>

              {/* Project Details Section */}
              <div className="pt-4 border-t space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">Project Details</h4>
                
                {/* Customer Information for retailer projects */}
                {(() => {
                  const isRetailerProject = selectedProject.status === "retailer-new" || 
                                            ["site-inspection", "stage-one", "stage-two", "full-system", "canceled"].includes(selectedProject.status);
                  return isRetailerProject && selectedProject.projectDetails?.additionalInfo;
                })() && (
                    <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Customer Information</Label>
                    <div className="grid grid-cols-2 gap-4 pl-4">
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Customer Name</Label>
                      <Input 
                          value={selectedProject.name || ''}
                          onChange={(e) => setSelectedProject({ ...selectedProject, name: e.target.value })}
                          className="text-sm"
                      />
                    </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Customer Email</Label>
                      <Input 
                          type="email"
                          value={selectedProject.projectDetails?.additionalInfo?.customerEmail || ''}
                          onChange={(e) => {
                            const additionalInfo = { ...(selectedProject.projectDetails?.additionalInfo || {}), customerEmail: e.target.value };
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                            });
                          }}
                          className="text-sm"
                      />
                        </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Customer Contact</Label>
                      <Input 
                          value={selectedProject.projectDetails?.additionalInfo?.customerContact || ''}
                          onChange={(e) => {
                            const additionalInfo = { ...(selectedProject.projectDetails?.additionalInfo || {}), customerContact: e.target.value };
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                            });
                          }}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Customer Address</Label>
                      <Input 
                          value={selectedProject.projectDetails?.additionalInfo?.customerAddress || ''}
                          onChange={(e) => {
                            const additionalInfo = { ...(selectedProject.projectDetails?.additionalInfo || {}), customerAddress: e.target.value };
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                            });
                          }}
                          className="text-sm"
                      />
                    </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-gray-500 text-xs">Location (Google Maps)</Label>
                        <Input
                          value={selectedProject.projectDetails?.additionalInfo?.location || ''}
                          onChange={(e) => {
                            const additionalInfo = { ...(selectedProject.projectDetails?.additionalInfo || {}), location: e.target.value };
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                            });
                          }}
                          className="text-sm"
                        />
                  </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Client Type</Label>
                        <Select
                          value={selectedProject.projectDetails?.clientType || ''}
                          onValueChange={(v) => setSelectedProject({
                            ...selectedProject,
                            projectDetails: { ...(selectedProject.projectDetails || {}), clientType: v }
                          })}
                        >
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue placeholder="Select client type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Retailer">Retailer</SelectItem>
                            <SelectItem value="Builder">Builder</SelectItem>
                          </SelectContent>
                        </Select>
                </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Client Name</Label>
                        <Input 
                          value={selectedProject.projectDetails?.additionalInfo?.clientName || ''}
                          onChange={(e) => {
                            const additionalInfo = { ...(selectedProject.projectDetails?.additionalInfo || {}), clientName: e.target.value };
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                            });
                          }}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Job Type</Label>
                        <Select
                          value={selectedProject.projectDetails?.additionalInfo?.jobType || ''}
                          onValueChange={(v) => {
                            // Map job type to status
                            const jobTypeToStatus: Record<string, ProjectStatus> = {
                              "Site Inspection": "site-inspection",
                              "Stage One": "stage-one",
                              "Stage Two": "stage-two",
                              "Full System": "full-system"
                            };
                            const newStatus = jobTypeToStatus[v] || selectedProject.status;
                            
                            const additionalInfo = { ...(selectedProject.projectDetails?.additionalInfo || {}), jobType: v };
                            setSelectedProject({
                              ...selectedProject,
                              status: newStatus,
                              projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                            });
                          }}
                        >
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem value="Site Inspection">Site Inspection</SelectItem>
                            <SelectItem value="Stage One">Stage One</SelectItem>
                            <SelectItem value="Stage Two">Stage Two</SelectItem>
                            <SelectItem value="Full System">Full System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                      {selectedProject.projectDetails?.additionalInfo?.jobType === "Site Inspection" && (
                        <>
                          <div className="space-y-1">
                            <Label className="text-gray-500 text-xs">Site Inspection Date</Label>
                      <Input 
                              type="date"
                              value={selectedProject.projectDetails?.additionalInfo?.siteInspection?.date || ''}
                              onChange={(e) => {
                                const additionalInfo = {
                                  ...(selectedProject.projectDetails?.additionalInfo || {}),
                                  siteInspection: { ...(selectedProject.projectDetails?.additionalInfo?.siteInspection || {}), date: e.target.value }
                                };
                                setSelectedProject({
                                  ...selectedProject,
                                  projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                                });
                              }}
                              className="text-sm"
                      />
                    </div>
                          <div className="space-y-1">
                            <Label className="text-gray-500 text-xs">Site Inspection Time</Label>
                      <Input 
                              type="time"
                              value={selectedProject.projectDetails?.additionalInfo?.siteInspection?.time || ''}
                              onChange={(e) => {
                                const additionalInfo = {
                                  ...(selectedProject.projectDetails?.additionalInfo || {}),
                                  siteInspection: { ...(selectedProject.projectDetails?.additionalInfo?.siteInspection || {}), time: e.target.value }
                                };
                                setSelectedProject({
                                  ...selectedProject,
                                  projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                                });
                              }}
                              className="text-sm"
                      />
                    </div>
                          <div className="space-y-1">
                            <Label className="text-gray-500 text-xs">Site Inspection Status</Label>
                            <Input 
                              value={selectedProject.projectDetails?.additionalInfo?.siteInspection?.status || "Pending"}
                              readOnly
                              className="text-sm"
                            />
                          </div>
                        </>
                      )}
                      {["Stage One", "Stage Two", "Full System"].includes(selectedProject.projectDetails?.additionalInfo?.jobType) && (
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">{selectedProject.projectDetails?.additionalInfo?.jobType} Date</Label>
                      <Input 
                            type="date"
                            value={selectedProject.projectDetails?.additionalInfo?.jobDate || ''}
                            onChange={(e) => {
                              const additionalInfo = { ...(selectedProject.projectDetails?.additionalInfo || {}), jobDate: e.target.value };
                              setSelectedProject({
                                ...selectedProject,
                                projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                              });
                            }}
                            className="text-sm"
                      />
                    </div>
                      )}
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Price (AUD)</Label>
                      <Input 
                          value={selectedProject.cost || selectedProject.projectDetails?.additionalInfo?.priceAud || ''}
                          onChange={(e) => {
                            const additionalInfo = { ...(selectedProject.projectDetails?.additionalInfo || {}), priceAud: e.target.value };
                            setSelectedProject({
                              ...selectedProject,
                              cost: e.target.value,
                              projectDetails: { ...(selectedProject.projectDetails || {}), additionalInfo }
                            });
                          }}
                          className="text-sm"
                      />
                    </div>
                  </div>
                </div>
                )}

                {/* Detailed Project Information from projectSnapshot (only show if projectSnapshot exists) */}
                {selectedProject.projectSnapshot && (
                      <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Project Information</Label>
                    <div className="grid grid-cols-2 gap-4 pl-4">
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Title</Label>
                        <Input 
                          value={selectedProject.projectSnapshot?.title || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), title: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Project Code</Label>
                          <Input 
                          value={selectedProject.projectSnapshot?.projectCode || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), projectCode: e.target.value }
                          })}
                          className="text-sm"
                          />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Customer Name</Label>
                        <Input 
                          value={selectedProject.projectSnapshot?.customerName || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), customerName: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Customer Email</Label>
                        <Input
                          type="email"
                          value={selectedProject.projectSnapshot?.customerEmail || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), customerEmail: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Customer Contact</Label>
                        <Input 
                          value={selectedProject.projectSnapshot?.customerPhone || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), customerPhone: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-gray-500 text-xs">Customer Address</Label>
                        <Input 
                          value={selectedProject.projectSnapshot?.customerAddress || selectedProject.projectSnapshot?.location || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), customerAddress: e.target.value, location: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Client Type</Label>
                        <Input 
                          value={selectedProject.projectSnapshot?.clientType || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), clientType: e.target.value }
                          })}
                          className="text-sm"
                        />
                    </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Price (AUD)</Label>
                        <Input
                          value={selectedProject.projectSnapshot?.price || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), price: e.target.value }
                          })}
                          className="text-sm"
                      />
                    </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Start Date</Label>
                      <Input
                        type="date"
                          value={selectedProject.projectSnapshot?.startDate || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), startDate: e.target.value }
                          })}
                          className="text-sm"
                      />
                    </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">System Type</Label>
                        <Input 
                          value={selectedProject.projectSnapshot?.systemType || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), systemType: e.target.value }
                          })}
                          className="text-sm"
                        />
                  </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Lead ID</Label>
                        <Input
                          value={selectedProject.projectSnapshot?.leadId || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), leadId: e.target.value }
                          })}
                          className="text-sm"
                        />
                </div>
                      <div className="space-y-1">
                        <Label className="text-gray-500 text-xs">Project Status</Label>
                        <Input
                          value={selectedProject.projectSnapshot?.status || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), status: e.target.value }
                          })}
                          className="text-sm"
                        />
                            </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-gray-500 text-xs">Notes</Label>
                      <Textarea 
                          value={selectedProject.projectSnapshot?.notes || ''}
                          onChange={(e) => setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...(selectedProject.projectSnapshot || {}), notes: e.target.value }
                          })}
                          className="text-sm"
                        rows={3}
                      />
                          </div>
                    </div>
                  </div>
                )}

                {/* Retailer Site Visit Details - Show for site-inspection projects */}
                {selectedProject.status === "site-inspection" && (() => {
                  // Load retailer site visit assessments
                  let retailerSiteVisit: any = null;
                  try {
                    const assessmentsData = localStorage.getItem('xtr_retailer_site_visit_assessments');
                    if (assessmentsData) {
                      const assessments = JSON.parse(assessmentsData);
                      if (Array.isArray(assessments) && assessments.length > 0) {
                        // Find matching retailer site visit by customer name, email, or address
                        const projectName = (selectedProject.name || '').toLowerCase().trim();
                        const projectEmail = (selectedProject.projectDetails?.additionalInfo?.customerEmail || 
                                            selectedProject.projectSnapshot?.customerEmail || '').toLowerCase().trim();
                        const projectAddress = (selectedProject.projectDetails?.additionalInfo?.customerAddress || 
                                              selectedProject.projectSnapshot?.customerAddress || '').toLowerCase().trim();
                        
                        retailerSiteVisit = assessments.find((assessment: any) => {
                          const assessName = (assessment.customerName || '').toLowerCase().trim();
                          const assessEmail = (assessment.customerEmail || '').toLowerCase().trim();
                          const assessAddress = (assessment.propertyAddress || '').toLowerCase().trim();
                          
                          return (projectName && assessName && projectName === assessName) ||
                                 (projectEmail && assessEmail && projectEmail === assessEmail) ||
                                 (projectAddress && assessAddress && projectAddress === assessAddress);
                        });
                        
                        // If not found by name/email/address, try to find by project ID in context
                        if (!retailerSiteVisit) {
                          // Check if any assessment has a matching project context
                          for (const assessment of assessments) {
                            // Try to match by customer name from form data
                            if (assessment.customerName && projectName && 
                                assessment.customerName.toLowerCase().trim() === projectName) {
                              retailerSiteVisit = assessment;
                              break;
                            }
                          }
                        }
                      }
                    }
                  } catch (error) {
                    console.error('Error loading retailer site visit:', error);
                  }
                  
                  if (!retailerSiteVisit) {
                    return null;
                  }
                  
                  return (
                    <div className="space-y-2 pt-4 border-t">
                      <Label className="text-gray-700 font-medium">Retailer Site Visit Details</Label>
                      <div className="grid grid-cols-2 gap-4 pl-4">
                        {/* Visit Information */}
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Visit Date</Label>
                          <Input value={retailerSiteVisit.visitDate || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Visit Time</Label>
                          <Input value={retailerSiteVisit.visitTime || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Technician Name</Label>
                          <Input value={retailerSiteVisit.technicianName || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Weather Conditions</Label>
                          <Input value={retailerSiteVisit.weatherConditions || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        
                        {/* Safety Information */}
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Safety Hazards</Label>
                          <Input value={Array.isArray(retailerSiteVisit.safetyHazards) ? retailerSiteVisit.safetyHazards.join(', ') : (retailerSiteVisit.safetyHazards || '')} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Safety Notes</Label>
                          <Textarea value={retailerSiteVisit.safetyNotes || ''} readOnly className="text-sm bg-gray-50" rows={2} />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">PPE Required</Label>
                          <Input value={Array.isArray(retailerSiteVisit.ppeRequired) ? retailerSiteVisit.ppeRequired.join(', ') : (retailerSiteVisit.ppeRequired || '')} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Emergency Contacts</Label>
                          <Input value={retailerSiteVisit.emergencyContacts || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        
                        {/* Electrical Information */}
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Main Panel Location</Label>
                          <Input value={retailerSiteVisit.mainPanelLocation || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Panel Condition</Label>
                          <Input value={retailerSiteVisit.panelCondition || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Available Amperage</Label>
                          <Input value={retailerSiteVisit.availableAmperage || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Grounding System</Label>
                          <Input value={retailerSiteVisit.groundingSystem || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Electrical Hazards</Label>
                          <Input value={Array.isArray(retailerSiteVisit.electricalHazards) ? retailerSiteVisit.electricalHazards.join(', ') : (retailerSiteVisit.electricalHazards || '')} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Electrical Notes</Label>
                          <Textarea value={retailerSiteVisit.electricalNotes || ''} readOnly className="text-sm bg-gray-50" rows={2} />
                        </div>
                        
                        {/* Roof Information */}
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Roof Condition</Label>
                          <Input value={retailerSiteVisit.roofCondition || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Roof Access</Label>
                          <Input value={retailerSiteVisit.roofAccess || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Structural Integrity</Label>
                          <Input value={retailerSiteVisit.structuralIntegrity || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Panel Count</Label>
                          <Input value={retailerSiteVisit.panelCount || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Mounting Points</Label>
                          <Input value={Array.isArray(retailerSiteVisit.mountingPoints) ? retailerSiteVisit.mountingPoints.join(', ') : (retailerSiteVisit.mountingPoints || '')} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Roof Hazards</Label>
                          <Input value={Array.isArray(retailerSiteVisit.roofHazards) ? retailerSiteVisit.roofHazards.join(', ') : (retailerSiteVisit.roofHazards || '')} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Roof Notes</Label>
                          <Textarea value={retailerSiteVisit.roofNotes || ''} readOnly className="text-sm bg-gray-50" rows={2} />
                        </div>
                        
                        {/* Installation Information */}
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Inverter Location</Label>
                          <Input value={retailerSiteVisit.inverterLocation || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-500 text-xs">Conduit Path</Label>
                          <Input value={retailerSiteVisit.conduitPath || ''} readOnly className="text-sm bg-gray-50" />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Special Requirements</Label>
                          <Textarea value={retailerSiteVisit.specialRequirements || ''} readOnly className="text-sm bg-gray-50" rows={2} />
                        </div>
                        
                        {/* Checklist */}
                        {Array.isArray(retailerSiteVisit.checklist) && retailerSiteVisit.checklist.length > 0 && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500 text-xs">Checklist</Label>
                            <div className="space-y-1 bg-gray-50 p-2 rounded">
                              {retailerSiteVisit.checklist.map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <span className={item.checked ? 'text-green-600' : 'text-gray-400'}>
                                    {item.checked ? '✓' : '○'}
                                  </span>
                                  <span>{item.item || item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Notes and Recommendations */}
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">General Notes</Label>
                          <Textarea value={retailerSiteVisit.generalNotes || ''} readOnly className="text-sm bg-gray-50" rows={3} />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Recommendations</Label>
                          <Textarea value={retailerSiteVisit.recommendations || ''} readOnly className="text-sm bg-gray-50" rows={3} />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-gray-500 text-xs">Next Steps</Label>
                          <Textarea value={retailerSiteVisit.nextSteps || ''} readOnly className="text-sm bg-gray-50" rows={2} />
                        </div>
                        
                        {/* Photos */}
                        {Array.isArray(retailerSiteVisit.photos) && retailerSiteVisit.photos.length > 0 && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500 text-xs">Photos ({retailerSiteVisit.photos.length})</Label>
                            <div className="text-sm text-gray-600">
                              {retailerSiteVisit.photos.length} photo(s) attached
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* System Information */}
                      <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">System Information</Label>
                    <div className="grid grid-cols-2 gap-4 pl-4">
                      {(() => {
                        const systemInfo = selectedProject.projectSnapshot?.systemInfo || selectedProject.projectDetails?.systemInfo || {};
                        const systemType = selectedProject.projectDetails?.systemType || selectedProject.projectSnapshot?.systemType || '';
                        const hasPV = ["Only PV","PV+Battery","PV+Battery+EV Charger","PV+EV Charger"].includes(systemType);
                        const hasBattery = ["Only Battery","PV+Battery","PV+Battery+EV Charger","Battery+EV Charger"].includes(systemType);
                        const hasEVCharger = ["Only EV Charger","PV+EV Charger","PV+Battery+EV Charger","Battery+EV Charger"].includes(systemType);
                        
                        const updateSystemInfo = (field: string, value: string) => {
                          const newSystemInfo = { ...systemInfo, [field]: value };
                          if (selectedProject.projectSnapshot?.systemInfo) {
                            setSelectedProject({
                              ...selectedProject,
                              projectSnapshot: { ...selectedProject.projectSnapshot, systemInfo: newSystemInfo }
                            });
                          } else if (selectedProject.projectDetails?.systemInfo) {
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...selectedProject.projectDetails, systemInfo: newSystemInfo }
                            });
                          } else {
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...(selectedProject.projectDetails || {}), systemInfo: newSystemInfo }
                            });
                          }
                        };
                        return (
                          <>
                            {/* PV fields - only show if system type includes PV */}
                            {hasPV && (
                              <>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">System Size (kW)</Label>
                        <Input 
                                    value={systemInfo.systemSize || ''}
                                    onChange={(e) => updateSystemInfo('systemSize', e.target.value)}
                                    className="text-sm"
                        />
                      </div>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">Inverter Size (kW)</Label>
                          <Input 
                                    value={systemInfo.inverterSize || ''}
                                    onChange={(e) => updateSystemInfo('inverterSize', e.target.value)}
                                    className="text-sm"
                          />
                        </div>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">Inverter Brand</Label>
                          <Input 
                                    value={systemInfo.inverterBrand || ''}
                                    onChange={(e) => updateSystemInfo('inverterBrand', e.target.value)}
                                    className="text-sm"
                          />
                        </div>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">Inverter Type</Label>
                                  <Input
                                    value={systemInfo.inverterType || ''}
                                    onChange={(e) => updateSystemInfo('inverterType', e.target.value)}
                                    className="text-sm"
                                  />
                </div>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">Panel Brand</Label>
                                  <Input
                                    value={systemInfo.panelBrand || ''}
                                    onChange={(e) => updateSystemInfo('panelBrand', e.target.value)}
                                    className="text-sm"
                                  />
                </div>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">Panel Module (Watts)</Label>
                                  <Input
                                    value={systemInfo.panelModuleWatts || ''}
                                    onChange={(e) => updateSystemInfo('panelModuleWatts', e.target.value)}
                                    className="text-sm"
                                  />
            </div>
                              </>
                            )}
                            
                            {/* Battery fields - only show if system type includes Battery */}
                            {hasBattery && (
                              <>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">Battery Size (kWh)</Label>
                                  <Input
                                    value={systemInfo.batterySize || ''}
                                    onChange={(e) => updateSystemInfo('batterySize', e.target.value)}
                                    className="text-sm"
                                  />
                    </div>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">Battery Brand</Label>
                                  <Input
                                    value={systemInfo.batteryBrand || ''}
                                    onChange={(e) => updateSystemInfo('batteryBrand', e.target.value)}
                                    className="text-sm"
                                  />
                  </div>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">Battery Model</Label>
                                  <Input
                                    value={systemInfo.batteryModel || ''}
                                    onChange={(e) => updateSystemInfo('batteryModel', e.target.value)}
                                    className="text-sm"
                                  />
                    </div>
                              </>
                            )}
                            
                            {/* EV Charger fields - only show if system type includes EV Charger */}
                            {hasEVCharger && (
                              <>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">EV Charger Brand</Label>
                      <Input
                                    value={systemInfo.evChargerBrand || ''}
                                    onChange={(e) => updateSystemInfo('evChargerBrand', e.target.value)}
                                    className="text-sm"
                      />
                    </div>
                                <div className="space-y-1">
                                  <Label className="text-gray-500 text-xs">EV Charger Model</Label>
                      <Input
                                    value={systemInfo.evChargerModel || ''}
                                    onChange={(e) => updateSystemInfo('evChargerModel', e.target.value)}
                                    className="text-sm"
                      />
                    </div>
                              </>
                            )}
                          </>
                        );
                      })()}
                  </div>
                </div>

                  {/* Property Information */}
                    <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Property Information</Label>
                    <div className="grid grid-cols-2 gap-4 pl-4">
                      {(() => {
                        const propertyInfo = selectedProject.projectSnapshot?.propertyInfo || selectedProject.projectDetails?.propertyInfo || {};
                        const updatePropertyInfo = (field: string, value: string) => {
                          const newPropertyInfo = { ...propertyInfo, [field]: value };
                          if (selectedProject.projectSnapshot?.propertyInfo) {
                            setSelectedProject({
                              ...selectedProject,
                              projectSnapshot: { ...selectedProject.projectSnapshot, propertyInfo: newPropertyInfo }
                            });
                          } else if (selectedProject.projectDetails?.propertyInfo) {
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...selectedProject.projectDetails, propertyInfo: newPropertyInfo }
                            });
                          } else {
                            setSelectedProject({
                              ...selectedProject,
                              projectDetails: { ...(selectedProject.projectDetails || {}), propertyInfo: newPropertyInfo }
                            });
                          }
                        };
                        return (
                          <>
                            <div className="space-y-1">
                              <Label className="text-gray-500 text-xs">House Storey</Label>
                              <Input
                                value={propertyInfo.houseStorey || propertyInfo.houseStoreyOther || ''}
                                onChange={(e) => updatePropertyInfo('houseStorey', e.target.value)}
                                className="text-sm"
                      />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-gray-500 text-xs">Roof Type</Label>
                              <Input
                                value={propertyInfo.roofType || propertyInfo.roofTypeOther || ''}
                                onChange={(e) => updatePropertyInfo('roofType', e.target.value)}
                                className="text-sm"
                              />
                          </div>
                            <div className="space-y-1">
                              <Label className="text-gray-500 text-xs">Access to 2nd Storey</Label>
                              <Input
                                value={propertyInfo.accessTo2ndStorey || propertyInfo.accessSecondStorey || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updatePropertyInfo('accessTo2ndStorey', val);
                                  updatePropertyInfo('accessSecondStorey', val);
                                }}
                                className="text-sm"
                              />
                        </div>
                            <div className="space-y-1">
                              <Label className="text-gray-500 text-xs">Access to Inverter</Label>
                              <Input
                                value={propertyInfo.accessToInverter || propertyInfo.accessInverter || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updatePropertyInfo('accessToInverter', val);
                                  updatePropertyInfo('accessInverter', val);
                                }}
                                className="text-sm"
                              />
            </div>
                            <div className="space-y-1">
                              <Label className="text-gray-500 text-xs">Meter Phase</Label>
                              <Input
                                value={propertyInfo.meterPhase || ''}
                                onChange={(e) => updatePropertyInfo('meterPhase', e.target.value)}
                                className="text-sm"
                              />
                    </div>
                          </>
                        );
                      })()}
                  </div>
                  </div>

                  {/* Project Notes */}
                    <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Project Notes</Label>
                      <Textarea
                      value={selectedProject.projectDetails?.projectNotes || selectedProject.projectSnapshot?.notes || ''}
                      onChange={(e) => {
                        const notes = e.target.value;
                        if (selectedProject.projectSnapshot?.notes !== undefined) {
                          setSelectedProject({
                            ...selectedProject,
                            projectSnapshot: { ...selectedProject.projectSnapshot, notes }
                          });
                        } else if (selectedProject.projectDetails) {
                          setSelectedProject({
                            ...selectedProject,
                            projectDetails: { ...selectedProject.projectDetails, projectNotes: notes }
                          });
                        } else {
                          setSelectedProject({
                            ...selectedProject,
                            projectDetails: { projectNotes: notes }
                          });
                        }
                      }}
                      className="text-sm"
                      rows={4}
                      placeholder="Enter project notes..."
                  />
                  </div>
                </div>

                {/* Sales Site Visit Section */}
                {selectedProject.siteVisit && (
                    <div className="pt-4 border-t space-y-4">
                      <h4 className="font-semibold text-lg text-gray-900">Sales Site Visit Information</h4>
              <div className="grid grid-cols-2 gap-4">
                        {selectedProject.siteVisit.dateOfVisit && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Date of Visit</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.dateOfVisit}</p>
                </div>
                        )}
                        {selectedProject.siteVisit.salesPersonName && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Sales Person</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.salesPersonName}</p>
            </div>
          )}
                        {selectedProject.siteVisit.currentEnergyProvider && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Energy Retailer</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.currentEnergyProvider}</p>
                    </div>
                      )}
                        {selectedProject.siteVisit.averageMonthlyBill && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Average Monthly Bill</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.averageMonthlyBill}</p>
                    </div>
                        )}
                        {selectedProject.siteVisit.roofOrientation && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Roof Orientation</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.roofOrientation}</p>
                    </div>
                )}
                        {selectedProject.siteVisit.shadingAssessment && Array.isArray(selectedProject.siteVisit.shadingAssessment) && selectedProject.siteVisit.shadingAssessment.length > 0 && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Shading Assessment</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.siteVisit.shadingAssessment.map((item: string, idx: number) => (
                                <Badge key={idx} variant="outline">{item}</Badge>
                              ))}
                    </div>
                  </div>
                        )}
                        {selectedProject.siteVisit.existingSolarInstallations && (
                <div className="space-y-1">
                            <Label className="text-gray-500">Existing Solar Installations</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.existingSolarInstallations}</p>
                    </div>
                        )}
                        {selectedProject.siteVisit.primaryMotivation && Array.isArray(selectedProject.siteVisit.primaryMotivation) && selectedProject.siteVisit.primaryMotivation.length > 0 && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Primary Motivation</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.siteVisit.primaryMotivation.map((item: string, idx: number) => (
                                <Badge key={idx} variant="outline">{item}</Badge>
                              ))}
                    </div>
                    </div>
          )}
                        {selectedProject.siteVisit.interestLevel && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Interest Level</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.interestLevel}</p>
                    </div>
                        )}
                        {selectedProject.siteVisit.siteNotes && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Site Notes</Label>
                            <p className="text-sm text-gray-700">{selectedProject.siteVisit.siteNotes || '-'}</p>
                  </div>
                    )}
                        {selectedProject.siteVisit.specialRequirements && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Special Requirements</Label>
                            <p className="text-sm text-gray-700">{selectedProject.siteVisit.specialRequirements || '-'}</p>
            </div>
                        )}
                        {selectedProject.siteVisit.nextSteps && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Next Steps</Label>
                            <p className="text-sm text-gray-700">{selectedProject.siteVisit.nextSteps || '-'}</p>
                    </div>
                        )}
                        {selectedProject.siteVisit.electricianVisitDate && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Electrician Visit Date</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.electricianVisitDate}</p>
                  </div>
                        )}
                        {selectedProject.siteVisit.electricianVisitTime && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Electrician Visit Time</Label>
                            <p className="font-semibold">{selectedProject.siteVisit.electricianVisitTime}</p>
                    </div>
                        )}
                        {selectedProject.siteVisit.electricianNotes && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Notes for Electrician</Label>
                            <p className="text-sm text-gray-700">{selectedProject.siteVisit.electricianNotes || '-'}</p>
                  </div>
                        )}
                </div>
          </div>
                  )}

                {/* On-Field Assessment Section */}
                {selectedProject.onFieldAssessment && (
                    <div className="pt-4 border-t space-y-4">
                      <h4 className="font-semibold text-lg text-gray-900">On-Field Assessment</h4>
              <div className="grid grid-cols-2 gap-4">
                        {selectedProject.onFieldAssessment.visitDate && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Visit Date</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.visitDate}</p>
                </div>
                        )}
                        {selectedProject.onFieldAssessment.visitTime && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Visit Time</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.visitTime}</p>
                </div>
                        )}
                        {selectedProject.onFieldAssessment.technicianName && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Technician</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.technicianName}</p>
                </div>
                        )}
                        {selectedProject.onFieldAssessment.weatherConditions && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Weather</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.weatherConditions}</p>
                </div>
                        )}
                        {selectedProject.onFieldAssessment.electricalHazards && Array.isArray(selectedProject.onFieldAssessment.electricalHazards) && selectedProject.onFieldAssessment.electricalHazards.length > 0 && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Electrical Hazards</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.onFieldAssessment.electricalHazards.map((item: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="bg-red-50">{item}</Badge>
                              ))}
              </div>
                </div>
                        )}
                        {selectedProject.onFieldAssessment.panelCondition && (
                <div className="space-y-1">
                            <Label className="text-gray-500">Panel Condition</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.panelCondition}</p>
              </div>
                        )}
                        {selectedProject.onFieldAssessment.mainPanelLocation && (
                <div className="space-y-1">
                            <Label className="text-gray-500">Main Panel Location</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.mainPanelLocation}</p>
                </div>
          )}
                        {selectedProject.onFieldAssessment.availableAmperage && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Available Amperage</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.availableAmperage}</p>
              </div>
          )}
                        {selectedProject.onFieldAssessment.groundingSystem && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Grounding System</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.groundingSystem}</p>
            </div>
          )}
                        {selectedProject.onFieldAssessment.roofCondition && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Roof Condition</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.roofCondition || '-'}</p>
                  </div>
                        )}
                        {selectedProject.onFieldAssessment.structuralIntegrity && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Structural Integrity</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.structuralIntegrity || '-'}</p>
                  </div>
                        )}
                        {selectedProject.onFieldAssessment.roofHazards && Array.isArray(selectedProject.onFieldAssessment.roofHazards) && selectedProject.onFieldAssessment.roofHazards.length > 0 && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Roof Hazards</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.onFieldAssessment.roofHazards.map((item: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="bg-orange-50">{item}</Badge>
                              ))}
                </div>
              </div>
                        )}
                        {selectedProject.onFieldAssessment.panelCount && (
                <div className="space-y-1">
                            <Label className="text-gray-500">Panel Count</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.panelCount}</p>
                  </div>
                        )}
                        {selectedProject.onFieldAssessment.conduitPath && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Conduit Path</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.conduitPath}</p>
                  </div>
                        )}
                        {selectedProject.onFieldAssessment.electricalNotes && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Electrical Notes</Label>
                            <p className="text-sm text-gray-700">{selectedProject.onFieldAssessment.electricalNotes || '-'}</p>
                </div>
          )}
                        {selectedProject.onFieldAssessment.roofAccess && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Roof Access</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.roofAccess || '-'}</p>
              </div>
                        )}
                        {selectedProject.onFieldAssessment.mountingPoints && Array.isArray(selectedProject.onFieldAssessment.mountingPoints) && selectedProject.onFieldAssessment.mountingPoints.length > 0 && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Mounting Points</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.onFieldAssessment.mountingPoints.map((item: string, idx: number) => (
                                <Badge key={idx} variant="outline">{item}</Badge>
                              ))}
                  </div>
                  </div>
                        )}
                        {selectedProject.onFieldAssessment.roofNotes && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Roof Notes</Label>
                            <p className="text-sm text-gray-700">{selectedProject.onFieldAssessment.roofNotes || '-'}</p>
                </div>
                        )}
                        {selectedProject.onFieldAssessment.inverterLocation && (
                          <div className="space-y-1">
                            <Label className="text-gray-500">Inverter Location</Label>
                            <p className="font-semibold">{selectedProject.onFieldAssessment.inverterLocation}</p>
              </div>
                        )}
                        {selectedProject.onFieldAssessment.specialRequirements && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Special Requirements</Label>
                            <p className="text-sm text-gray-700">{selectedProject.onFieldAssessment.specialRequirements || '-'}</p>
                      </div>
                        )}
                        {selectedProject.onFieldAssessment.safetyHazards && Array.isArray(selectedProject.onFieldAssessment.safetyHazards) && selectedProject.onFieldAssessment.safetyHazards.length > 0 && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Safety Hazards</Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.onFieldAssessment.safetyHazards.map((item: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="bg-yellow-50">{item}</Badge>
                              ))}
                    </div>
                  </div>
                        )}
                        {selectedProject.onFieldAssessment.generalNotes && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">General Notes</Label>
                            <p className="text-sm text-gray-700">{selectedProject.onFieldAssessment.generalNotes}</p>
                </div>
                        )}
                        {selectedProject.onFieldAssessment.recommendations && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Recommendations</Label>
                            <p className="text-sm text-gray-700">{selectedProject.onFieldAssessment.recommendations}</p>
                      </div>
                        )}
                        {selectedProject.onFieldAssessment.nextSteps && (
                          <div className="space-y-1 col-span-2">
                            <Label className="text-gray-500">Next Steps</Label>
                            <p className="text-sm text-gray-700">{selectedProject.onFieldAssessment.nextSteps}</p>
                    </div>
                        )}
                      </div>
                    </div>
                  )}

              {/* Installation Day Details - Only show for completed installations */}
              {(selectedProject.status === "installation-completed" || selectedProject.status === "retailer-installation-completed") && installationData && (
                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900">Installation Day Details</h4>
                  
                  {/* Installation Checklist */}
                  {installationData.checklist && installationData.checklist.length > 0 && (
                <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Installation Checklist</Label>
                      <div className="space-y-2 pl-4">
                        {installationData.checklist.map((item) => (
                          <div key={item.id} className="flex items-start gap-2">
                            <span className={item.checked ? "text-green-600" : "text-gray-400"}>
                              {item.checked ? "✓" : "○"}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">{item.category}:</span> {item.item}
                              </p>
                              {installationData.checklistNotes[item.id] && (
                                <p className="text-xs text-gray-500 mt-1 pl-4 italic">
                                  Note: {installationData.checklistNotes[item.id]}
                                </p>
                              )}
                </div>
              </div>
                        ))}
              </div>
            </div>
          )}
                  
                  {/* Expenses */}
                  {installationData.expenses && installationData.expenses.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Expenses</Label>
                      <div className="space-y-2 pl-4">
                        {installationData.expenses.map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                              <p className="text-sm font-medium">{expense.item || expense.description}</p>
                              {expense.employeeName && (
                                <p className="text-xs text-gray-500">
                                  {expense.employeeName}
                                  {expense.employeeEmail && ` (${expense.employeeEmail})`}
                                </p>
                              )}
                </div>
                            <p className="text-sm font-semibold">${expense.amount.toFixed(2)}</p>
                </div>
                        ))}
                        <div className="pt-2 border-t">
                          <p className="text-sm font-semibold">
                            Total: ${installationData.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                          </p>
                </div>
                </div>
              </div>
                  )}
                  
                  {/* Breaks */}
                  {installationData.breaks && installationData.breaks.length > 0 && (
              <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Breaks</Label>
                      <div className="space-y-2 pl-4">
                        {installationData.breaks.map((breakItem) => (
                          <div key={breakItem.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <p className="text-sm font-medium">{breakItem.type}</p>
                            <p className="text-xs text-gray-600">
                              {breakItem.startTime} - {breakItem.endTime}
                            </p>
                </div>
                        ))}
              </div>
            </div>
          )}
                  
                  {/* Customer Notes */}
                  {installationData.customerNotes && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Customer Notes</Label>
                      <p className="text-sm text-gray-700 pl-4 whitespace-pre-wrap">{installationData.customerNotes}</p>
              </div>
                  )}
                  
                  {/* Job Status */}
                  {installationData.jobStatus && installationData.jobStatus.jobStarted && installationData.jobStatus.jobStartTime && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Job Time</Label>
                      <div className="pl-4 space-y-1">
                        <p className="text-sm text-gray-700">
                          Started: {new Date(installationData.jobStatus.jobStartTime).toLocaleString()}
                        </p>
                        {installationData.jobStatus.totalPausedDuration > 0 && (
                          <p className="text-sm text-gray-700">
                            Total Paused: {Math.floor(installationData.jobStatus.totalPausedDuration / 60000)} minutes
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Photo Documentation */}
                  {installationData.photos && installationData.photos.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Photo Documentation</Label>
                      <div className="grid grid-cols-2 gap-4 pl-4">
                        {installationData.photos.map((photo) => (
                          <div key={photo.id} className="space-y-2">
                            <div className="aspect-video bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden relative">
                              {photo.imageData ? (
                                <img 
                                  src={photo.imageData} 
                                  alt={photo.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                                  <span className="text-xs text-gray-400">No photo</span>
                      </div>
                              )}
                    </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">{photo.title}</p>
                              {photo.description && (
                                <p className="text-xs text-gray-600">{photo.description}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">{photo.timestamp}</p>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  photo.status === "Completed" 
                                    ? "bg-green-100 text-green-700" 
                                    : photo.status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {photo.status}
                                </span>
                      </div>
                    </div>
                  </div>
                        ))}
                </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status Change */}
              <div className="space-y-2 pt-4 border-t">
                <Label>Change Status</Label>
                <Select 
                  value={selectedProject.status}
                  onValueChange={(value) => handleStatusChange(selectedProject.id, value as ProjectStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      // Determine which columns to show based on project's current board
                      const isRetailerProject = selectedProject.status.startsWith("retailer-") || 
                                                ["site-inspection", "stage-one", "stage-two", "full-system", "canceled"].includes(selectedProject.status);
                      const columnsToShow = isRetailerProject ? retailerColumns : inHouseColumns;
                      
                      return columnsToShow.map((col) => (
                        <SelectItem key={col.id} value={col.id}>
                          {col.title}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
                      </div>

              {/* Assignees Section */}
              <div className="pt-4 border-t space-y-2">
                <Label className="text-gray-700 font-medium">Assignees</Label>
                <ResourceMultiSelect
                  label=""
                  value={selectedAssignees}
                  onChange={handleAssigneeChange}
                  placeholder="Select assignees..."
                  options={resources.map(r => r.name)}
                    />
                    </div>
                    
              {/* Comments Section */}
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <Label className="text-gray-700 font-medium text-lg">Comments</Label>
                    </div>
                    
                {/* Existing Comments */}
                {selectedProject.comments && selectedProject.comments.length > 0 && (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedProject.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                          <p className="text-xs text-gray-500">{comment.date} at {comment.time}</p>
                      </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Form */}
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="sm"
                    className="w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Always visible at bottom */}
          <DialogFooter className="flex flex-row gap-2 px-6 py-4 border-t bg-white flex-shrink-0 justify-end w-full sticky bottom-0 z-50">
            <Button
              variant="outline"
              onClick={() => {
                setShowProjectDetailsDialog(false);
                setSelectedProject(null);
                setSelectedAssignees([]);
                setNewComment("");
              }}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedProject) {
                  // Ensure assignees are saved
                  const updatedProject = {
                    ...selectedProject,
                    assignees: selectedAssignees.length > 0 ? selectedAssignees : selectedProject.assignees || [],
                    assignee: selectedAssignees.length > 0 ? selectedAssignees[0] : selectedProject.assignee || '',
                  };
                  
                  console.log('Saving project with status:', updatedProject.status, 'Job Type:', updatedProject.projectDetails?.additionalInfo?.jobType);
                  
                  // Update projects state
                  const projectsData = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
                  setProjects(projectsData);
                  
                  // Save to both localStorage and Firestore
                  saveProjectsToStorage(projectsData).then(() => {
                    console.log('Project saved with status:', updatedProject.status);
                  });
                  
                  // Close dialog and reset state
                  setShowProjectDetailsDialog(false);
                  setSelectedProject(null);
                  setSelectedAssignees([]);
                  setNewComment("");
                  alert("Project updated successfully!");
                }
              }}
              className="text-gray-900 border border-gray-300 bg-white hover:bg-teal-600 hover:text-white hover:border-teal-600 min-w-[140px] flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditProjectDialog} onOpenChange={setShowEditProjectDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          
          {editingProject && (
            <>
              <div className="space-y-4 py-4">
                {/* Project Name */}
                  <div className="space-y-2">
                  <Label htmlFor="edit-name">Project Name *</Label>
                    <Input 
                    id="edit-name"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    placeholder="Enter project name"
                    />
                  </div>

                {/* Priority and System Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={editingProject.priority}
                      onValueChange={(value) => setEditingProject({ ...editingProject, priority: value as Priority })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-systemSize">System Size *</Label>
                    <Input 
                      id="edit-systemSize"
                      value={editingProject.systemSize}
                      onChange={(e) => setEditingProject({ ...editingProject, systemSize: e.target.value })}
                      placeholder="e.g., 5kW System"
                    />
                  </div>
                </div>
                    
                {/* Type and Cost */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Project Type</Label>
                    <Select
                      value={editingProject.type}
                      onValueChange={(value) => setEditingProject({ ...editingProject, type: value as ProjectType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-cost">Cost *</Label>
                    <Input 
                      id="edit-cost"
                      value={editingProject.cost}
                      onChange={(e) => setEditingProject({ ...editingProject, cost: e.target.value })}
                      placeholder="e.g., $8,500"
                    />
                  </div>
              </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input 
                      id="edit-startDate"
                      value={editingProject.startDate}
                      onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                      placeholder="e.g., Nov 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input 
                      id="edit-endDate"
                      value={editingProject.endDate}
                      onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })}
                      placeholder="e.g., Nov 3"
                    />
                </div>
              </div>

                {/* Assignee and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-assignee">Assignee</Label>
                    <Input 
                      id="edit-assignee"
                      value={editingProject.assignee}
                      onChange={(e) => setEditingProject({ ...editingProject, assignee: e.target.value })}
                      placeholder="e.g., TA, TB"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={editingProject.status}
                      onValueChange={(value) => setEditingProject({ ...editingProject, status: value as ProjectStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...inHouseColumns, ...retailerColumns].map((col) => (
                          <SelectItem key={col.id} value={col.id}>
                            {col.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setShowEditProjectDialog(false);
                  setEditingProject(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-teal-600 hover:bg-teal-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

