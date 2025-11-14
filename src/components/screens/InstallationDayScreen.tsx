import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CheckSquare, Camera, DollarSign, FileText, Clock, MapPin, User, Phone, Calendar, Users, CheckCircle, AlertCircle, Eye, Download, Upload, Plus, Edit, Trash2, XCircle } from "lucide-react";

interface ChecklistItem {
  id: number;
  category: string;
  item: string;
  checked: boolean;
}

interface Expense {
  id: number;
  item: string;
  amount: number;
  receipt: boolean;
  description: string;
  date: string;
  category: string;
  employeeName?: string;
  employeeEmail?: string;
  employeeRole?: string;
}

interface Resource {
  id?: number;
  name: string;
  email?: string;
  role: string;
  [key: string]: any;
}

interface Project {
  id: string;
  name: string;
  status: string;
  startDate?: string;
  assignees?: string[];
  assignee?: string;
  projectDetails?: {
    additionalInfo?: {
      jobDate?: string;
      siteInspection?: {
        date?: string;
      };
      customerAddress?: string;
      customerEmail?: string;
      customerContact?: string;
      customerName?: string;
    };
  };
  projectSnapshot?: {
    startDate?: string;
    customerAddress?: string;
  };
  [key: string]: any;
}

export function InstallationDayScreen() {
  const [scheduledProjects, setScheduledProjects] = useState<Project[]>([]);
  const [inHouseScheduledProjects, setInHouseScheduledProjects] = useState<Project[]>([]);
  const [retailerScheduledProjects, setRetailerScheduledProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"in-house" | "retailer">("in-house");
  const detailsRef = useRef<HTMLDivElement>(null);
  const [showJobDetailsDialog, setShowJobDetailsDialog] = useState(false);
  const [showChecklistItemDialog, setShowChecklistItemDialog] = useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<ChecklistItem | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: number;
    title: string;
    description: string;
    timestamp: string;
    status: string;
    imageData?: string;
    fileName?: string;
  } | null>(null);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showHandoverDialog, setShowHandoverDialog] = useState(false);
  const [showTimeTrackingDialog, setShowTimeTrackingDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showEditExpenseDialog, setShowEditExpenseDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showAddBreakDialog, setShowAddBreakDialog] = useState(false);
  const [newBreak, setNewBreak] = useState({ type: "", startTime: "", endTime: "" });
  const [jobStarted, setJobStarted] = useState(false);
  const [jobPaused, setJobPaused] = useState(false);
  const [jobStartTime, setJobStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);
  const [totalPausedDuration, setTotalPausedDuration] = useState(0); // in milliseconds
  const [breaks, setBreaks] = useState<Array<{ id: number; type: string; startTime: string; endTime: string }>>([]);
  const [showPhotoCaptureDialog, setShowPhotoCaptureDialog] = useState(false);
  const [showHandoverPreviewDialog, setShowHandoverPreviewDialog] = useState(false);
  const defaultChecklist = [
    { id: 1, category: "Pre-Installation", item: "Safety briefing completed", checked: true },
    { id: 2, category: "Pre-Installation", item: "Site inspection done", checked: true },
    { id: 3, category: "Pre-Installation", item: "Tools and equipment ready", checked: true },
    { id: 4, category: "Installation", item: "Panel mounting rails installed", checked: true },
    { id: 5, category: "Installation", item: "Solar panels mounted", checked: false },
    { id: 6, category: "Installation", item: "Inverter installed and wired", checked: false },
    { id: 7, category: "Installation", item: "AC/DC isolators installed", checked: false },
    { id: 8, category: "Electrical", item: "Main switchboard connection", checked: false },
    { id: 9, category: "Electrical", item: "System testing and commissioning", checked: false },
    { id: 10, category: "Handover", item: "Customer walkthrough completed", checked: false },
    { id: 11, category: "Handover", item: "Documentation provided", checked: false },
    { id: 12, category: "Handover", item: "System operation explained", checked: false },
  ];

  const defaultExpenses: Array<{
    id: number;
    item: string;
    amount: number;
    receipt: boolean;
    description: string;
    date: string;
    category: string;
    employeeName?: string;
    employeeEmail?: string;
  }> = [
    { id: 1, item: "Additional cable run", amount: 85, receipt: true, description: "Extra 10m cable needed for inverter connection", date: "2024-01-15", category: "Materials" },
    { id: 2, item: "Parking permit", amount: 15, receipt: true, description: "Daily parking permit for installation vehicle", date: "2024-01-15", category: "Permits" },
  ];

  const [checklistNotes, setChecklistNotes] = useState<Record<number, string>>({});
  const [currentNotes, setCurrentNotes] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [customerNotes, setCustomerNotes] = useState("");
  const [photos, setPhotos] = useState<Array<{
    id: number;
    title: string;
    description: string;
    timestamp: string;
    status: string;
    imageData?: string; // base64 data URL
    fileName?: string;
  }>>([]);

  const handleJobDetailsClick = () => {
    setShowJobDetailsDialog(true);
  };

  const handleChecklistItemClick = (item: ChecklistItem) => {
    setSelectedChecklistItem(item);
    setCurrentNotes(checklistNotes[item.id] || "");
    setShowChecklistItemDialog(true);
  };

  const handleCheckboxToggle = (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChecklist(prev => {
      const updated = prev.map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      // Save to localStorage
      if (selectedProject) {
        try {
          const key = `xtr_installation_checklist_${selectedProject.id}`;
          localStorage.setItem(key, JSON.stringify(updated));
        } catch (error) {
          console.error('Error saving checklist:', error);
        }
      }
      return updated;
    });
  };

  const handleSaveChecklistItem = () => {
    if (selectedChecklistItem) {
      const updatedNotes = { ...checklistNotes, [selectedChecklistItem.id]: currentNotes };
      setChecklistNotes(updatedNotes);
      // Save to localStorage
      if (selectedProject) {
        try {
          const key = `xtr_installation_notes_${selectedProject.id}`;
          localStorage.setItem(key, JSON.stringify(updatedNotes));
        } catch (error) {
          console.error('Error saving notes:', error);
        }
      }
      setShowChecklistItemDialog(false);
    }
  };

  const handlePhotoClick = (photo: { id: number; title: string; description: string; timestamp: string; status: string; imageData?: string; fileName?: string }) => {
    setSelectedPhoto(photo);
    setShowPhotoDialog(true);
  };

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowExpenseDialog(true);
  };

  const handleHandoverClick = () => {
    setShowHandoverDialog(true);
  };

  const handleTimeTrackingClick = () => {
    setShowTimeTrackingDialog(true);
  };

  const handleAttachReceipt = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        alert(`Receipt attached: ${file.name}`);
        // Here you would typically upload the file or store it
      }
    };
    input.click();
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      // Get user info directly from session to ensure we have the latest data
      let currentUserName = userName;
      let currentUserEmail = userEmail;
      let currentUserRole = '';
      
      try {
        const sessionData = localStorage.getItem('xtr_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          // Session structure has userEmail directly, not session.user.email
          if (session.userEmail) {
            currentUserEmail = session.userEmail;
            if (!currentUserName) {
              // Extract name from email if name not available
              const emailName = session.userEmail.split('@')[0];
              // Convert "ashley" to "Ashley"
              currentUserName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            }
          }
          // Also check for session.user.name if it exists (for backward compatibility)
          if (session.user?.name) {
            currentUserName = session.user.name;
          }
          
          // Get user role from Resource Management by email or name
          try {
            const resourcesData = localStorage.getItem('xtr_resources');
            if (resourcesData) {
              const resources: Resource[] = JSON.parse(resourcesData);
              if (Array.isArray(resources) && resources.length > 0) {
                let resource: Resource | undefined = undefined;
                
                // First, try to find by email (case-insensitive)
                if (currentUserEmail) {
                  resource = resources.find((r: Resource) => 
                    r.email && r.email.toLowerCase().trim() === currentUserEmail.toLowerCase().trim()
                  );
                }
                
                // If not found by email, try to find by name (case-insensitive, partial match)
                if (!resource && currentUserName) {
                  resource = resources.find((r: Resource) => 
                    r.name && r.name.toLowerCase().trim() === currentUserName.toLowerCase().trim()
                  );
                }
                
                if (resource && resource.role) {
                  currentUserRole = resource.role;
                  console.log('Found role from Resource Management:', {
                    email: currentUserEmail,
                    name: currentUserName,
                    role: resource.role,
                    resourceEmail: resource.email,
                    resourceName: resource.name
                  });
                } else {
                  console.log('Resource not found in Resource Management:', {
                    email: currentUserEmail,
                    name: currentUserName,
                    totalResources: resources.length,
                    resourceEmails: resources.map((r: any) => r.email),
                    resourceNames: resources.map((r: any) => r.name)
                  });
                }
              }
            } else {
              console.log('No resources data found in localStorage');
            }
          } catch (error) {
            console.error('Error getting role from Resource Management:', error);
          }
          
          // Fallback to session role if not found in Resource Management
          if (!currentUserRole) {
            if (session.retailerTeam) {
              // Convert retailerTeam to display name
              const teamMap: Record<string, string> = {
                'on-field': 'On-Field',
                'sales': 'Sales',
                'project-management': 'Project Management',
                'operations': 'Operations'
              };
              currentUserRole = teamMap[session.retailerTeam] || session.retailerTeam;
            } else if (session.userRole) {
              // For non-retailer roles
              const roleMap: Record<string, string> = {
                'subcontractor': 'Subcontractor',
                'inspector': 'Inspector'
              };
              currentUserRole = roleMap[session.userRole] || session.userRole;
            }
          }
        }
      } catch (error) {
        console.error('Error getting user info from session:', error);
      }
      
      // Add the new expense to the expenses array
      const expense = {
        id: expenses.length + 1,
        item: newExpense.description,
        amount: parseFloat(newExpense.amount),
        receipt: false,
        description: newExpense.description,
        date: new Date().toISOString().split('T')[0],
        category: "Other",
        employeeName: currentUserName || 'Unknown User',
        employeeEmail: currentUserEmail || ''
      };
      
      setExpenses(prev => {
        const updated = [...prev, expense];
        // Save to localStorage
        if (selectedProject) {
          try {
            const key = `xtr_installation_expenses_${selectedProject.id}`;
            localStorage.setItem(key, JSON.stringify(updated));
          } catch (error) {
            console.error('Error saving expenses:', error);
          }
        }
        return updated;
      });

      // Create reimbursement request for approval
      try {
        const existingReimbursements = localStorage.getItem('xtr_reimbursement_requests');
        const reimbursements = existingReimbursements ? JSON.parse(existingReimbursements) : [];
        
        const reimbursementRequest = {
          id: Date.now(), // Use timestamp as unique ID
          employeeName: expense.employeeName,
          employeeEmail: expense.employeeEmail,
          employeeRole: currentUserRole || '',
          category: expense.category || "Other",
          amount: expense.amount,
          description: expense.description,
          receiptAttached: expense.receipt || false,
          submittedOn: new Date().toISOString(),
          status: "pending" as const,
          projectId: selectedProject?.id || '',
          projectName: selectedProject?.name || ''
        };

        reimbursements.push(reimbursementRequest);
        localStorage.setItem('xtr_reimbursement_requests', JSON.stringify(reimbursements));
        
        // Dispatch event to notify approvals page
        window.dispatchEvent(new Event('xtr-approvals-updated'));
      } catch (error) {
        console.error('Error creating reimbursement request:', error);
      }
      
      // Reset the form
      setNewExpense({ description: "", amount: "" });
    } else {
      alert("Please fill in both description and amount");
    }
  };

  const handleRemoveExpense = (expenseId: number) => {
    setExpenses(prev => {
      const updated = prev.filter(e => e.id !== expenseId);
      // Save to localStorage
      if (selectedProject) {
        try {
          const key = `xtr_installation_expenses_${selectedProject.id}`;
          localStorage.setItem(key, JSON.stringify(updated));
        } catch (error) {
          console.error('Error saving expenses:', error);
        }
      }
      return updated;
    });
  };

  const handleExpenseInputChange = (field, value) => {
    setNewExpense(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewReceipt = () => {
    setShowReceiptDialog(true);
  };

  const handleEditExpense = () => {
    if (selectedExpense) {
    setEditingExpense({ ...selectedExpense });
    setShowEditExpenseDialog(true);
    }
  };

  const handleUpdateExpense = () => {
    if (editingExpense) {
      // In a real app, you would update the expenses array
      alert(`Expense updated: ${editingExpense.item} - $${editingExpense.amount}`);
      setShowEditExpenseDialog(false);
      setEditingExpense(null);
    }
  };

  const handleTakePhoto = (photoId?: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          const now = new Date();
          const timestamp = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
          
          if (photoId) {
            // Update existing photo
            setPhotos(prevPhotos => {
              const updated = prevPhotos.map(photo => 
                photo.id === photoId 
                  ? { ...photo, imageData, fileName: file.name, timestamp, status: "Completed" }
                  : photo
              );
              // Save to localStorage
              if (selectedProject) {
                const photosKey = `xtr_installation_photos_${selectedProject.id}`;
                localStorage.setItem(photosKey, JSON.stringify(updated));
              }
              return updated;
            });
            alert(`Photo uploaded: ${file.name}`);
            setShowPhotoDialog(false);
          } else {
            // Create new photo
            const newPhoto = {
              id: Date.now(),
              title: `Photo ${photos.length + 1}`,
              description: "",
              timestamp,
              status: "Completed",
              imageData,
              fileName: file.name
            };
            setPhotos(prevPhotos => {
              const updated = [...prevPhotos, newPhoto];
              // Save to localStorage
              if (selectedProject) {
                const photosKey = `xtr_installation_photos_${selectedProject.id}`;
                localStorage.setItem(photosKey, JSON.stringify(updated));
              }
              return updated;
            });
        setShowPhotoCaptureDialog(true);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePreviewPack = () => {
    setShowHandoverPreviewDialog(true);
  };

  const handleDownloadPdf = () => {
    alert("Downloading Customer Handover Pack as PDF...");
  };

  const handleAddBreak = () => {
    if (newBreak.type && newBreak.startTime && newBreak.endTime) {
      const breakEntry = {
        id: Date.now(), // Use timestamp for unique ID
        type: newBreak.type,
        startTime: newBreak.startTime,
        endTime: newBreak.endTime
      };
      const updatedBreaks = [...breaks, breakEntry];
      setBreaks(updatedBreaks);
      
      // Save breaks to localStorage
      if (selectedProject) {
        try {
          const key = `xtr_installation_breaks_${selectedProject.id}`;
          localStorage.setItem(key, JSON.stringify(updatedBreaks));
        } catch (error) {
          console.error('Error saving breaks:', error);
        }
      }
      
      setNewBreak({ type: "", startTime: "", endTime: "" });
      setShowAddBreakDialog(false);
    } else {
      alert("Please fill in all break details");
    }
  };

  const handleStartJob = () => {
    if (!jobStarted) {
    setJobStarted(true);
      setJobPaused(false);
      const startTime = new Date();
      setJobStartTime(startTime);
      setElapsedTime(0);
      setTotalPausedDuration(0);
      setPauseStartTime(null);
      
      // Update project status from "scheduled" to "installation-in-progress"
      if (selectedProject) {
        try {
          // Save job status to localStorage
          const key = `xtr_installation_job_status_${selectedProject.id}`;
          localStorage.setItem(key, JSON.stringify({
            jobStarted: true,
            jobPaused: false,
            jobStartTime: startTime.toISOString(),
            totalPausedDuration: 0
          }));
          
          // Update project status in projects list
          const projectsData = localStorage.getItem('xtr_projects');
          if (projectsData) {
            const allProjects: Project[] = JSON.parse(projectsData);
            const projectIndex = allProjects.findIndex(p => p.id === selectedProject.id);
            
            if (projectIndex !== -1) {
              // Determine the new status based on current status
              const currentStatus = allProjects[projectIndex].status;
              let newStatus: string;
              
              if (currentStatus === "scheduled") {
                newStatus = "installation-in-progress";
              } else if (currentStatus === "retailer-scheduled") {
                newStatus = "retailer-installation-in-progress";
              } else {
                newStatus = currentStatus; // Keep current status if not scheduled
              }
              
              // Update the project status
              allProjects[projectIndex] = {
                ...allProjects[projectIndex],
                status: newStatus
              };
              
              // Save updated projects
              localStorage.setItem('xtr_projects', JSON.stringify(allProjects));
              
              // Update selectedProject state to reflect the new status
              setSelectedProject({
                ...selectedProject,
                status: newStatus
              });
              
              // Dispatch event to notify other pages
              window.dispatchEvent(new Event('xtr-projects-updated'));
            }
          }
        } catch (error) {
          console.error('Error saving job status or updating project:', error);
        }
      }
    alert("Job started!");
    } else if (jobPaused) {
      // Resume from pause - calculate and add the paused duration
      if (pauseStartTime) {
        const now = new Date();
        const pausedTime = now.getTime() - pauseStartTime.getTime();
        setTotalPausedDuration(prev => prev + pausedTime);
        
        // Save job status to localStorage
        if (selectedProject) {
          try {
            const key = `xtr_installation_job_status_${selectedProject.id}`;
            const existing = localStorage.getItem(key);
            const status = existing ? JSON.parse(existing) : {};
            status.jobPaused = false;
            status.totalPausedDuration = totalPausedDuration + pausedTime;
            status.pauseStartTime = null;
            localStorage.setItem(key, JSON.stringify(status));
          } catch (error) {
            console.error('Error saving job status:', error);
          }
        }
      }
      setJobPaused(false);
      setPauseStartTime(null);
      alert("Job resumed!");
    }
  };

  const handlePauseJob = () => {
    if (jobStarted && !jobPaused && jobStartTime) {
      const now = new Date();
      const pauseTime = now;
      setPauseStartTime(pauseTime);
      
      // Calculate and freeze the elapsed time at the moment of pause
      const currentElapsed = now.getTime() - jobStartTime.getTime() - totalPausedDuration;
      setElapsedTime(Math.max(0, currentElapsed));
      
      setJobPaused(true);
      
      // Save job status to localStorage
      if (selectedProject) {
        try {
          const key = `xtr_installation_job_status_${selectedProject.id}`;
          const existing = localStorage.getItem(key);
          const status = existing ? JSON.parse(existing) : {};
          status.jobPaused = true;
          status.pauseStartTime = pauseTime.toISOString();
          localStorage.setItem(key, JSON.stringify(status));
        } catch (error) {
          console.error('Error saving job status:', error);
        }
      }
      alert("Job paused!");
    }
  };

  const handleEndJob = () => {
    if (!selectedProject) {
      alert("No project selected!");
      return;
    }
    
    // Use current elapsedTime state value (which is already calculated and up-to-date)
    const finalElapsedTime = elapsedTime > 0 ? elapsedTime : 0;
    
    // Calculate total hours from elapsed time
    const totalHours = finalElapsedTime > 0 ? (finalElapsedTime / (1000 * 60 * 60)).toFixed(2) : "0.00";
    
    try {
      // Save total hours to localStorage
      const hoursKey = `xtr_installation_total_hours_${selectedProject.id}`;
      localStorage.setItem(hoursKey, totalHours);
      console.log(`Saved total hours for project ${selectedProject.id}: ${totalHours} hours (${finalElapsedTime}ms)`);
      
      // Clear job status from localStorage
      const key = `xtr_installation_job_status_${selectedProject.id}`;
      localStorage.removeItem(key);
      
      // Update project status in projects list
      const projectsData = localStorage.getItem('xtr_projects');
      if (projectsData) {
        const allProjects: Project[] = JSON.parse(projectsData);
        const projectIndex = allProjects.findIndex(p => p.id === selectedProject.id);
        
        if (projectIndex !== -1) {
          // Determine the new status based on current status
          const currentStatus = allProjects[projectIndex].status;
          let newStatus: string;
          
          if (currentStatus === "installation-in-progress") {
            newStatus = "installation-completed";
          } else if (currentStatus === "retailer-installation-in-progress") {
            newStatus = "retailer-installation-completed";
          } else if (currentStatus === "scheduled") {
            newStatus = "installation-completed";
          } else if (currentStatus === "retailer-scheduled") {
            newStatus = "retailer-installation-completed";
          } else {
            newStatus = currentStatus; // Keep current status if not recognized
          }
          
          // Update the project status
          allProjects[projectIndex] = {
            ...allProjects[projectIndex],
            status: newStatus
          };
          
          // Save updated projects
          localStorage.setItem('xtr_projects', JSON.stringify(allProjects));
          console.log(`Updated project ${selectedProject.id} status to: ${newStatus}`);
          
          // Update selectedProject state to reflect the new status
          setSelectedProject({
            ...selectedProject,
            status: newStatus
          });
          
          // Dispatch event to notify other pages and reload projects
          window.dispatchEvent(new Event('xtr-projects-updated'));
          
          // Reload scheduled projects to reflect the status change
          setTimeout(() => {
            const updatedProjectsData = localStorage.getItem('xtr_projects');
            if (updatedProjectsData) {
              const updatedProjects: Project[] = JSON.parse(updatedProjectsData);
              const inHouseScheduled = updatedProjects.filter(p => 
                (p.status === "scheduled" || 
                 p.status === "installation-in-progress" || 
                 p.status === "installation-completed") && 
                !p.status.startsWith("retailer-")
              );
              setInHouseScheduledProjects(inHouseScheduled);
              
              const retailerScheduled = updatedProjects.filter(p => {
                return p.status === "retailer-scheduled" || 
                       p.status === "retailer-installation-in-progress" || 
                       p.status === "retailer-installation-completed";
              });
              setRetailerScheduledProjects(retailerScheduled);
            }
          }, 100);
        }
      }
      
      // Reset job state
    setJobStarted(false);
      setJobPaused(false);
    setJobStartTime(null);
      setElapsedTime(0);
      setTotalPausedDuration(0);
      setPauseStartTime(null);
      
      alert(`Job ended! Total time recorded: ${parseFloat(totalHours) >= 1 ? `${totalHours} hours` : `${(parseFloat(totalHours) * 60).toFixed(0)} minutes`}`);
    } catch (error) {
      console.error('Error ending job:', error);
      alert("Error ending job. Please try again.");
    }
  };

  const handleSaveProgress = () => {
    // Save all installation data to localStorage
    if (selectedProject) {
      try {
        // Save checklist
        const checklistKey = `xtr_installation_checklist_${selectedProject.id}`;
        localStorage.setItem(checklistKey, JSON.stringify(checklist));
        
        // Save checklist notes
        const notesKey = `xtr_installation_notes_${selectedProject.id}`;
        localStorage.setItem(notesKey, JSON.stringify(checklistNotes));
        
        // Save expenses
        const expensesKey = `xtr_installation_expenses_${selectedProject.id}`;
        localStorage.setItem(expensesKey, JSON.stringify(expenses));
        
        // Save job status
        const jobStatusKey = `xtr_installation_job_status_${selectedProject.id}`;
        localStorage.setItem(jobStatusKey, JSON.stringify({
          jobStarted,
          jobPaused,
          jobStartTime: jobStartTime?.toISOString() || null,
          totalPausedDuration: totalPausedDuration,
          pauseStartTime: pauseStartTime?.toISOString() || null
        }));
        
        // Save breaks
        const breaksKey = `xtr_installation_breaks_${selectedProject.id}`;
        localStorage.setItem(breaksKey, JSON.stringify(breaks));
        
        // Save customer notes
        const customerNotesKey = `xtr_installation_customer_notes_${selectedProject.id}`;
        localStorage.setItem(customerNotesKey, customerNotes);
        
        // Save photos
        const photosKey = `xtr_installation_photos_${selectedProject.id}`;
        localStorage.setItem(photosKey, JSON.stringify(photos));
        
    alert("Progress saved successfully!");
      } catch (error) {
        console.error('Error saving progress:', error);
        alert("Error saving progress. Please try again.");
      }
    } else {
      alert("Please select a project first.");
    }
  };

  const handleBreakInputChange = (field: string, value: any) => {
    setNewBreak(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditExpenseInputChange = (field: string, value: any) => {
    setEditingExpense(prev => {
      if (!prev) return null;
      return {
      ...prev,
      [field]: value
      };
    });
  };

  // Load installation data (checklist, notes, expenses, job status) for selected project
  useEffect(() => {
    if (selectedProject) {
      try {
        // Load checklist
        const checklistKey = `xtr_installation_checklist_${selectedProject.id}`;
        const savedChecklist = localStorage.getItem(checklistKey);
        if (savedChecklist) {
          setChecklist(JSON.parse(savedChecklist) as ChecklistItem[]);
        } else {
          setChecklist(defaultChecklist);
        }

        // Load checklist notes
        const notesKey = `xtr_installation_notes_${selectedProject.id}`;
        const savedNotes = localStorage.getItem(notesKey);
        if (savedNotes) {
          setChecklistNotes(JSON.parse(savedNotes) as Record<number, string>);
        } else {
          setChecklistNotes({});
        }

        // Load expenses
        const expensesKey = `xtr_installation_expenses_${selectedProject.id}`;
        const savedExpenses = localStorage.getItem(expensesKey);
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses) as Expense[]);
        } else {
          setExpenses(defaultExpenses);
        }

        // Load photos
        const photosKey = `xtr_installation_photos_${selectedProject.id}`;
        const savedPhotos = localStorage.getItem(photosKey);
        if (savedPhotos) {
          setPhotos(JSON.parse(savedPhotos) as Array<{ id: number; title: string; description: string; timestamp: string; status: string; imageData?: string; fileName?: string }>);
        } else {
          // Initialize with default photo templates if no photos exist
          setPhotos([
            { id: 1, title: "Roof - Before", description: "Initial roof condition before installation", timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }), status: "Pending" },
            { id: 2, title: "Panel Install", description: "Solar panels being mounted on rails", timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }), status: "Pending" },
            { id: 3, title: "Inverter", description: "Inverter installation and wiring", timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }), status: "Pending" },
            { id: 4, title: "Roof - After", description: "Final roof condition after installation", timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }), status: "Pending" },
          ]);
        }

        // Load job status
        const jobStatusKey = `xtr_installation_job_status_${selectedProject.id}`;
        const savedJobStatus = localStorage.getItem(jobStatusKey);
        if (savedJobStatus) {
          const jobStatus = JSON.parse(savedJobStatus);
          setJobStarted(jobStatus.jobStarted || false);
          setJobPaused(jobStatus.jobPaused || false);
          if (jobStatus.jobStartTime) {
            const startTime = new Date(jobStatus.jobStartTime);
            setJobStartTime(startTime);
            setTotalPausedDuration(jobStatus.totalPausedDuration || 0);
            
            // If job is paused, set pause start time
            if (jobStatus.jobPaused && jobStatus.pauseStartTime) {
              setPauseStartTime(new Date(jobStatus.pauseStartTime));
            } else {
              setPauseStartTime(null);
            }
            
            // Calculate initial elapsed time
            if (jobStatus.jobStarted && !jobStatus.jobPaused) {
              const now = new Date();
              const elapsed = now.getTime() - startTime.getTime() - (jobStatus.totalPausedDuration || 0);
              setElapsedTime(Math.max(0, elapsed));
            } else {
              setElapsedTime(0);
            }
          }
        } else {
          setJobStarted(false);
          setJobPaused(false);
          setJobStartTime(null);
          setElapsedTime(0);
          setTotalPausedDuration(0);
          setPauseStartTime(null);
        }

        // Load breaks
        const breaksKey = `xtr_installation_breaks_${selectedProject.id}`;
        const savedBreaks = localStorage.getItem(breaksKey);
        if (savedBreaks) {
          setBreaks(JSON.parse(savedBreaks));
        } else {
          setBreaks([]);
        }

        // Load customer notes
        const customerNotesKey = `xtr_installation_customer_notes_${selectedProject.id}`;
        const savedCustomerNotes = localStorage.getItem(customerNotesKey);
        if (savedCustomerNotes) {
          setCustomerNotes(savedCustomerNotes);
        } else {
          setCustomerNotes("");
        }
      } catch (error) {
        console.error('Error loading installation data:', error);
      }
    } else {
      // Reset to defaults when no project is selected
      setChecklist(defaultChecklist);
      setChecklistNotes({});
      setExpenses(defaultExpenses);
      setJobStarted(false);
      setJobPaused(false);
      setJobStartTime(null);
      setElapsedTime(0);
      setTotalPausedDuration(0);
      setPauseStartTime(null);
      setBreaks([]);
      setCustomerNotes("");
    }
  }, [selectedProject]);

  // Timer effect to update elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (jobStarted && !jobPaused && jobStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        // Calculate elapsed time: current time - start time - total paused duration
        const elapsed = now.getTime() - jobStartTime.getTime() - totalPausedDuration;
        setElapsedTime(Math.max(0, elapsed));
      }, 1000); // Update every second
    }
    // When paused, elapsed time is frozen (no interval needed)

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [jobStarted, jobPaused, jobStartTime, totalPausedDuration]);

  // Note: Pause duration is calculated when resuming, not while paused

  // Format elapsed time helper function
  const formatElapsedTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

    // Load scheduled projects from localStorage
    useEffect(() => {
      const loadScheduledProjects = () => {
        try {
          const projectsData = localStorage.getItem('xtr_projects');
          if (projectsData) {
            const allProjects: Project[] = JSON.parse(projectsData);
            // Filter projects with status "scheduled", "installation-in-progress", or "installation-completed"
            const scheduled = allProjects.filter(p => 
              p.status === "scheduled" || 
              p.status === "installation-in-progress" || 
              p.status === "installation-completed"
            );
            setScheduledProjects(scheduled);
            
            // Filter projects from In-House Projects board with status "scheduled", "installation-in-progress", or "installation-completed"
            // In-House Projects board uses statuses: "new", "scheduled", "to-be-rescheduled", etc. (not "retailer-*")
            const inHouseScheduled = allProjects.filter(p => 
              (p.status === "scheduled" || 
               p.status === "installation-in-progress" || 
               p.status === "installation-completed") && 
              !p.status.startsWith("retailer-")
            );
            setInHouseScheduledProjects(inHouseScheduled);
            
            // Filter projects from Retailer Projects board with status "retailer-scheduled", "retailer-installation-in-progress", or "retailer-installation-completed"
            // This includes all projects from the Retailer Projects board that are scheduled, in progress, or completed
            const retailerScheduled = allProjects.filter(p => {
              // Check if status is "retailer-scheduled", "retailer-installation-in-progress", or "retailer-installation-completed"
              return p.status === "retailer-scheduled" || 
                     p.status === "retailer-installation-in-progress" || 
                     p.status === "retailer-installation-completed";
            });
            setRetailerScheduledProjects(retailerScheduled);
            
            // Debug log to verify filtering
            console.log('Retailer scheduled projects:', retailerScheduled.length, retailerScheduled);
            
            // Don't auto-select - user must click a card to see details
          }
        } catch (error) {
          console.error('Error loading scheduled projects:', error);
        }
      };

    // Load user name and email from session
    try {
      const sessionData = localStorage.getItem('xtr_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        // Session structure has userEmail directly, not session.user.email
        if (session.userEmail) {
          setUserEmail(session.userEmail);
          // Extract name from email
          const emailName = session.userEmail.split('@')[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
        // Also check for session.user.name if it exists (for backward compatibility)
        if (session.user?.name) {
          setUserName(session.user.name);
        }
      }
    } catch (error) {
      console.error('Error loading user name or email:', error);
    }

    loadScheduledProjects();

    // Also listen for custom events from Project Management page
    const handleProjectsUpdated = () => {
      loadScheduledProjects();
    };

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'xtr_projects') {
        loadScheduledProjects();
      } else if (e.key && e.key.startsWith('xtr_installation_')) {
        // Reload installation data when it changes
        if (selectedProject) {
          try {
            const checklistKey = `xtr_installation_checklist_${selectedProject.id}`;
            const notesKey = `xtr_installation_notes_${selectedProject.id}`;
            const expensesKey = `xtr_installation_expenses_${selectedProject.id}`;
            const jobStatusKey = `xtr_installation_job_status_${selectedProject.id}`;
            const breaksKey = `xtr_installation_breaks_${selectedProject.id}`;
            const customerNotesKey = `xtr_installation_customer_notes_${selectedProject.id}`;
            const photosKey = `xtr_installation_photos_${selectedProject.id}`;
            
            if (e.key === checklistKey) {
              const savedChecklist = localStorage.getItem(checklistKey);
              if (savedChecklist) setChecklist(JSON.parse(savedChecklist) as ChecklistItem[]);
            } else if (e.key === notesKey) {
              const savedNotes = localStorage.getItem(notesKey);
              if (savedNotes) setChecklistNotes(JSON.parse(savedNotes) as Record<number, string>);
            } else if (e.key === expensesKey) {
              const savedExpenses = localStorage.getItem(expensesKey);
              if (savedExpenses) setExpenses(JSON.parse(savedExpenses) as Expense[]);
            } else if (e.key === jobStatusKey) {
              const savedJobStatus = localStorage.getItem(jobStatusKey);
              if (savedJobStatus) {
                const jobStatus = JSON.parse(savedJobStatus);
                setJobStarted(jobStatus.jobStarted || false);
                setJobPaused(jobStatus.jobPaused || false);
                if (jobStatus.jobStartTime) {
                  setJobStartTime(new Date(jobStatus.jobStartTime));
                }
              }
            } else if (e.key === breaksKey) {
              const savedBreaks = localStorage.getItem(breaksKey);
              if (savedBreaks) setBreaks(JSON.parse(savedBreaks));
            } else if (e.key === customerNotesKey) {
              const savedCustomerNotes = localStorage.getItem(customerNotesKey);
              if (savedCustomerNotes !== null) setCustomerNotes(savedCustomerNotes);
            } else if (e.key === photosKey) {
              const savedPhotos = localStorage.getItem(photosKey);
              if (savedPhotos) setPhotos(JSON.parse(savedPhotos) as Array<{ id: number; title: string; description: string; timestamp: string; status: string; imageData?: string; fileName?: string }>);
            }
          } catch (error) {
            console.error('Error reloading installation data:', error);
          }
        }
      }
    };

    // Listen for custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('xtr-projects-updated', handleProjectsUpdated);
    
    // Also poll for changes periodically (as a fallback)
    const pollInterval = setInterval(() => {
      loadScheduledProjects();
    }, 2000); // Check every 2 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('xtr-projects-updated', handleProjectsUpdated);
      clearInterval(pollInterval);
    };
  }, [selectedProject]);

  // Get projects based on active tab
  const displayProjects = 
    activeTab === "in-house" ? inHouseScheduledProjects :
    retailerScheduledProjects;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Installation Day</h2>
            <p className="text-muted-foreground">Scheduled Installations</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab("in-house");
              setSelectedProject(null); // Clear selection when switching tabs
            }}
            className={`${activeTab === "in-house" ? "border-b-2 border-teal-600 rounded-b-none bg-teal-50 text-teal-700 font-semibold" : "text-gray-600"} rounded-t-lg`}
          >
            In-House Projects
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab("retailer");
              setSelectedProject(null); // Clear selection when switching tabs
            }}
            className={`${activeTab === "retailer" ? "border-b-2 border-teal-600 rounded-b-none bg-teal-50 text-teal-700 font-semibold" : "text-gray-600"} rounded-t-lg`}
          >
            Retailer Projects
          </Button>
        </div>

        {/* Scheduled Projects as Cards */}
        {displayProjects.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayProjects.map((project) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    selectedProject?.id === project.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => {
                    setSelectedProject(project);
                    // Scroll to details section after a brief delay to allow state update
                    setTimeout(() => {
                      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                >
          <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={
                        project.status === "installation-in-progress" || project.status === "retailer-installation-in-progress"
                          ? "bg-warning text-warning-foreground"
                          : project.status === "installation-completed" || project.status === "retailer-installation-completed"
                          ? "bg-success text-success-foreground"
                          : "bg-success text-success-foreground"
                      }>
                        {project.status === "installation-in-progress" || project.status === "retailer-installation-in-progress"
                          ? "Installation In-Progress"
                          : project.status === "installation-completed" || project.status === "retailer-installation-completed"
                          ? "Installation Completed"
                          : "Scheduled"}
                      </Badge>
            </div>
          </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {project.startDate || 
                         project.projectDetails?.additionalInfo?.jobDate ||
                         project.projectDetails?.additionalInfo?.siteInspection?.date ||
                         project.projectSnapshot?.startDate ||
                         'No date'}
                      </span>
            </div>
                    {project.projectDetails?.additionalInfo?.customerAddress && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{project.projectDetails.additionalInfo.customerAddress}</span>
            </div>
                    )}
                    {(project.assignees && project.assignees.length > 0) || project.assignee ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{project.assignees?.join(', ') || project.assignee}</span>
                      </div>
                    ) : null}
                    {(project.status === "installation-completed" || project.status === "retailer-installation-completed") && (() => {
                      try {
                        const hoursKey = `xtr_installation_total_hours_${project.id}`;
                        const savedHours = localStorage.getItem(hoursKey);
                        if (savedHours) {
                          const hours = parseFloat(savedHours);
                          const hoursDisplay = hours >= 1 
                            ? `${hours.toFixed(2)} hours`
                            : `${(hours * 60).toFixed(0)} minutes`;
                          return (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">Total Time: {hoursDisplay}</span>
                            </div>
                          );
                        }
                      } catch (error) {
                        console.error('Error loading total hours:', error);
                      }
                      return null;
                    })()}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Project Details - Shown when a project is selected */}
            {selectedProject && (
              <div ref={detailsRef} className="space-y-6 mt-8">
                {/* Installation Details Header */}
                <Card className="border-2 border-teal-600">
                  <CardHeader>
            <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Installation Details</h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" className="bg-teal-600 text-white hover:bg-teal-700">
                          <Download className="w-4 h-4 mr-2" />
                          Export
              </Button>
                        <div className="text-sm font-medium">{userName || 'User'}</div>
            </div>
            </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input value={selectedProject.name} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Installation Date</Label>
                        <Input 
                          value={
                            selectedProject.startDate || 
                            selectedProject.projectDetails?.additionalInfo?.jobDate ||
                            selectedProject.projectDetails?.additionalInfo?.siteInspection?.date ||
                            selectedProject.projectSnapshot?.startDate ||
                            ''
                          }
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Team</Label>
                        <Input 
                          value={
                            selectedProject.assignees && selectedProject.assignees.length > 0
                              ? selectedProject.assignees.join(', ')
                              : selectedProject.assignee || ''
                          }
                          readOnly
                        />
              </div>
            </div>
          </CardContent>
        </Card>

                {/* Installation Checklist */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              <CardTitle>Installation Checklist</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Pre-Installation", "Installation", "Electrical", "Handover"].map((category) => (
                <div key={category}>
                          <h4 className="mb-3 font-medium text-sm text-gray-600">{category}</h4>
                  <div className="space-y-2">
                    {checklist
                      .filter((item) => item.category === category)
                      .map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleChecklistItemClick(item)}>
                                  <Checkbox 
                                    id={`check-${item.id}`} 
                                    checked={item.checked} 
                                    onCheckedChange={() => {
                                      setChecklist(prev => {
                                        const updated = prev.map(i => 
                                          i.id === item.id ? { ...i, checked: !i.checked } : i
                                        );
                                        // Save to localStorage
                                        if (selectedProject) {
                                          try {
                                            const key = `xtr_installation_checklist_${selectedProject.id}`;
                                            localStorage.setItem(key, JSON.stringify(updated));
                                          } catch (error) {
                                            console.error('Error saving checklist:', error);
                                          }
                                        }
                                        return updated;
                                      });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <label htmlFor={`check-${item.id}`} className="flex-1 cursor-pointer text-sm">
                            {item.item}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

                    {/* Progress Section */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{Math.round((checklist.filter(item => item.checked).length / checklist.length) * 100)}% Complete</span>
              </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-800 rounded-full transition-all" 
                          style={{ width: `${(checklist.filter(item => item.checked).length / checklist.length) * 100}%` }}
                        />
              </div>
            </div>
          </CardContent>
        </Card>

                {/* Photo Documentation */}
        <Card>
          <CardHeader>
                    <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <CardTitle>Photo Documentation</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleTakePhoto}>
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
            </div>
          </CardHeader>
          <CardContent>
                    <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                        <div key={photo.id} className="aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden" onClick={() => handlePhotoClick(photo)}>
                          {photo.imageData ? (
                            <>
                              <img src={photo.imageData} alt={photo.title} className="w-full h-full object-cover" />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                                <span className="text-sm font-medium">{photo.title}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">{photo.title}</span>
                            </>
                          )}
              </div>
              ))}
            </div>
          </CardContent>
        </Card>

                {/* Expenses & Reimbursements */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <CardTitle>Expenses & Reimbursements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
                    <div className="space-y-2">
              {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                            <p className="text-sm font-medium">{expense.item}</p>
                            <p className="text-sm text-gray-600">${expense.amount}</p>
                            {(expense.employeeName || expense.employeeEmail) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {expense.employeeName || 'Unknown User'}
                                {expense.employeeEmail && ` (${expense.employeeEmail})`}
                              </p>
                            )}
                  </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveExpense(expense.id)}>
                            Remove
                          </Button>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="space-y-2">
                        <Label className="text-sm font-medium">Expense Description</Label>
                <Input 
                          placeholder="e.g., Additional Cables" 
                  value={newExpense.description}
                  onChange={(e) => handleExpenseInputChange("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                        <Label className="text-sm font-medium">Amount (AUD)</Label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  value={newExpense.amount}
                  onChange={(e) => handleExpenseInputChange("amount", e.target.value)}
                />
              </div>
                      <Button 
                        variant="outline"
                        className="w-full bg-white border border-black text-black font-semibold py-2" 
                        onClick={handleAddExpense}
                        type="button"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Expense
              </Button>
            </div>

                    <div className="pt-4 border-t-2 border-teal-600">
              <div className="flex items-center justify-between">
                        <span className="font-medium">Total Expenses</span>
                        <span className="font-bold">${expenses.reduce((sum, e) => sum + e.amount, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

                {/* Customer Handover Pack */}
                <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Customer Handover Pack</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-3 text-sm font-medium">Handover Pack Includes:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                <li>• System operation manual</li>
                <li>• Product warranties</li>
                <li>• Electrical compliance certificate</li>
                <li>• System monitoring app guide</li>
                <li>• Maintenance recommendations</li>
                <li>• Contact information for support</li>
              </ul>
            </div>

            <div className="space-y-2">
                      <Label className="text-sm">Customer Notes</Label>
                      <Textarea 
                        placeholder="Any special instructions or notes for the customer..." 
                        rows={4}
                        value={customerNotes}
                        onChange={(e) => {
                          setCustomerNotes(e.target.value);
                          // Auto-save to localStorage
                          if (selectedProject) {
                            try {
                              const key = `xtr_installation_customer_notes_${selectedProject.id}`;
                              localStorage.setItem(key, e.target.value);
                            } catch (error) {
                              console.error('Error saving customer notes:', error);
                            }
                          }
                        }}
                      />
            </div>
          </CardContent>
        </Card>

                {/* Time Tracking */}
                <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Time Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
              <div>
                        <p className="text-sm font-medium">Job Status</p>
                        <p className="text-sm text-gray-600">
                          {selectedProject && (selectedProject.status === "installation-completed" || selectedProject.status === "retailer-installation-completed")
                            ? "Completed"
                            : !jobStarted 
                            ? "Not Started" 
                            : jobPaused 
                            ? "Paused" 
                            : "In Progress"}
                        </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Elapsed Time</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{formatElapsedTime(elapsedTime)}</span>
              <Button 
                variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (!jobStarted || jobPaused) {
                              handleStartJob();
                            } else {
                              handlePauseJob();
                            }
                          }}
                        >
                          {!jobStarted ? "Start" : jobPaused ? "Resume" : "Pause"}
              </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" className="flex-1" onClick={() => {
                        if (!jobStarted || jobPaused) {
                          handleStartJob();
                        } else {
                          handlePauseJob();
                        }
                      }}>
                        <Clock className="w-4 h-4 mr-2" />
                        {!jobStarted ? "Start Job" : jobPaused ? "Resume Job" : "Pause Job"}
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={handleEndJob}>
                        <XCircle className="w-4 h-4 mr-2" />
                        End Job
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setShowAddBreakDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Break
            </Button>
            </div>

                    {/* Breaks List */}
                    {breaks.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm font-medium">Breaks Recorded:</Label>
                        <div className="space-y-2">
                          {breaks.map((breakItem) => (
                            <div key={breakItem.id} className="flex items-center justify-between p-2 bg-gray-50 border rounded-lg">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{breakItem.type}</p>
                                <p className="text-xs text-gray-600">
                                  {breakItem.startTime} - {breakItem.endTime}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedBreaks = breaks.filter(b => b.id !== breakItem.id);
                                  setBreaks(updatedBreaks);
                                  if (selectedProject) {
                                    try {
                                      const key = `xtr_installation_breaks_${selectedProject.id}`;
                                      localStorage.setItem(key, JSON.stringify(updatedBreaks));
                                    } catch (error) {
                                      console.error('Error saving breaks:', error);
                                    }
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                      Complete all checklists and get items to end job
            </p>
          </CardContent>
        </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-gray-100" onClick={handleSaveProgress}>Save Progress</Button>
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" disabled>
            Complete Installation
          </Button>
        </div>

        {/* Job Details Dialog */}
        <Dialog open={showJobDetailsDialog} onOpenChange={setShowJobDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Job Details - Smith Residence
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Job ID</Label>
                  <p className="text-lg">#INST-2024-001</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className="bg-success text-success-foreground">In Progress</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p>123 Solar Street, Brisbane QLD 4000</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                  <p>John Smith</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+61 412 345 678</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p>john.smith@email.com</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Start Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>8:00 AM</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Expected Duration</Label>
                  <p>6-8 hours</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Installation Team</Label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>John Davis (Lead), Mike Chen (Technician)</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">System Specifications</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <ul className="space-y-1 text-sm">
                    <li>• 6.6kW Solar System</li>
                    <li>• 20 x 330W Monocrystalline Panels</li>
                    <li>• 5kW Inverter</li>
                    <li>• 6.6kW Battery Storage</li>
                    <li>• 25-year Panel Warranty</li>
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Checklist Item Dialog */}
        <Dialog open={showChecklistItemDialog} onOpenChange={setShowChecklistItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                {selectedChecklistItem?.item}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Status:</Label>
                <Badge className={selectedChecklistItem?.checked ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                  {selectedChecklistItem?.checked ? "Completed" : "Pending"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category:</Label>
                <p>{selectedChecklistItem?.category}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description:</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedChecklistItem?.category === "Pre-Installation" && "Complete all pre-installation safety and preparation tasks before beginning work."}
                  {selectedChecklistItem?.category === "Installation" && "Install solar panels, mounting systems, and electrical components according to specifications."}
                  {selectedChecklistItem?.category === "Electrical" && "Complete all electrical connections, testing, and commissioning procedures."}
                  {selectedChecklistItem?.category === "Handover" && "Provide customer with system documentation, training, and handover materials."}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Estimated Time:</Label>
                <p>15-30 minutes</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Notes:</Label>
                <Textarea 
                  placeholder="Add any notes or observations..." 
                  rows={3}
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowChecklistItemDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChecklistItem}>
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Photo Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                {selectedPhoto?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center overflow-hidden">
                {selectedPhoto?.imageData ? (
                  <img src={selectedPhoto.imageData} alt={selectedPhoto.title} className="w-full h-full object-cover" />
                ) : (
                  <>
                <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Photo placeholder</p>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description:</Label>
                <p>{selectedPhoto?.description || "No description provided"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status:</Label>
                <Badge className={selectedPhoto?.status === "Completed" ? "bg-success text-success-foreground" : selectedPhoto?.status === "In Progress" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"}>
                  {selectedPhoto?.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Timestamp:</Label>
                <p>{selectedPhoto?.timestamp}</p>
              </div>
              {selectedPhoto?.fileName && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">File Name:</Label>
                  <p className="text-sm text-muted-foreground">{selectedPhoto.fileName}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleTakePhoto(selectedPhoto?.id)}>
                  <Camera className="w-4 h-4 mr-2" />
                  {selectedPhoto?.imageData ? "Replace Photo" : "Take Photo"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleTakePhoto(selectedPhoto?.id)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Expense Dialog */}
        <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {selectedExpense?.item}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount:</Label>
                <p className="text-2xl font-bold">${selectedExpense?.amount}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description:</Label>
                <p>{selectedExpense?.description}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category:</Label>
                <Badge variant="outline">{selectedExpense?.category}</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date:</Label>
                <p>{selectedExpense?.date}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Receipt Status:</Label>
                <div className="flex items-center gap-2">
                  {selectedExpense?.receipt ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Receipt attached</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-600">Receipt required</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleViewReceipt}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Receipt
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleEditExpense}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Handover Pack Dialog */}
        <Dialog open={showHandoverDialog} onOpenChange={setShowHandoverDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Customer Handover Pack
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-4 font-medium">Handover Pack Contents:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">System operation manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Product warranties</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Electrical compliance certificate</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">System monitoring app guide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Maintenance recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Contact information for support</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer Notes:</Label>
                  <Textarea 
                    placeholder="Any special instructions or notes for the customer..." 
                    rows={4}
                    value={customerNotes}
                    onChange={(e) => {
                      setCustomerNotes(e.target.value);
                      // Auto-save to localStorage
                      if (selectedProject) {
                        try {
                          const key = `xtr_installation_customer_notes_${selectedProject.id}`;
                          localStorage.setItem(key, e.target.value);
                        } catch (error) {
                          console.error('Error saving customer notes:', error);
                        }
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handlePreviewPack}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Pack
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleDownloadPdf}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Time Tracking Dialog */}
        <Dialog open={showTimeTrackingDialog} onOpenChange={setShowTimeTrackingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time Tracking Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-success/10 border border-success rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Job Started</p>
                    <p className="text-muted-foreground">8:00 AM</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">Active</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Elapsed Time:</span>
                  <span className="text-2xl font-bold">{formatElapsedTime(elapsedTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expected Duration:</span>
                  <span>6-8 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Completion:</span>
                  <span>2:00 PM</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Break Times:</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Morning Break</span>
                    <span className="text-sm">10:00 AM - 10:15 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Lunch Break</span>
                    <span className="text-sm">12:00 PM - 12:30 PM</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={jobStarted ? handleEndJob : handleStartJob}>
                  <Clock className="w-4 h-4 mr-2" />
                  {jobStarted ? "End Job" : "Start Job"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddBreakDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Break
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Receipt Dialog */}
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                View Receipt
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Receipt Image</p>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Receipt for {selectedExpense?.item} - ${selectedExpense?.amount}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Expense Dialog */}
        <Dialog open={showEditExpenseDialog} onOpenChange={setShowEditExpenseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Expense
              </DialogTitle>
            </DialogHeader>
            {editingExpense && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={editingExpense.item}
                    onChange={(e) => handleEditExpenseInputChange("item", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input 
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) => handleEditExpenseInputChange("amount", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input 
                    value={editingExpense.category}
                    onChange={(e) => handleEditExpenseInputChange("category", e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditExpenseDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleUpdateExpense}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Break Dialog */}
        <Dialog open={showAddBreakDialog} onOpenChange={setShowAddBreakDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Break
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Break Type</Label>
                <Input 
                  placeholder="e.g., Lunch, Coffee, Personal"
                  value={newBreak.type}
                  onChange={(e) => handleBreakInputChange("type", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time"
                  value={newBreak.startTime}
                  onChange={(e) => handleBreakInputChange("startTime", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time"
                  value={newBreak.endTime}
                  onChange={(e) => handleBreakInputChange("endTime", e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddBreakDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddBreak}>
                  Add Break
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Photo Capture Dialog */}
        <Dialog open={showPhotoCaptureDialog} onOpenChange={setShowPhotoCaptureDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photo Captured
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center overflow-hidden">
                {photos.length > 0 && photos[photos.length - 1]?.imageData ? (
                  <img src={photos[photos.length - 1].imageData} alt="Captured photo" className="w-full h-full object-cover" />
                ) : (
                  <>
                <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Photo captured successfully!</p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPhotoCaptureDialog(false)}>
                  Close
                </Button>
                <Button className="flex-1" onClick={() => {
                  setShowPhotoCaptureDialog(false);
                }}>
                  <Upload className="w-4 h-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Handover Pack Preview Dialog */}
        <Dialog open={showHandoverPreviewDialog} onOpenChange={setShowHandoverPreviewDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Handover Pack Preview
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-4 font-medium">Preview of Customer Handover Pack:</h4>
                <div className="space-y-2">
                  <p className="text-sm">📋 System operation manual</p>
                  <p className="text-sm">📄 Product warranties</p>
                  <p className="text-sm">⚡ Electrical compliance certificate</p>
                  <p className="text-sm">📱 System monitoring app guide</p>
                  <p className="text-sm">🔧 Maintenance recommendations</p>
                  <p className="text-sm">📞 Contact information for support</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This is a preview of the handover pack that will be provided to the customer.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowHandoverPreviewDialog(false)}>
                  Close
                </Button>
                <Button className="flex-1" onClick={handleDownloadPdf}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {activeTab === "in-house" 
                  ? "No scheduled installations from In-House Projects found." 
                  : "No scheduled installations from Retailer Projects found."}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {activeTab === "in-house"
                  ? "Projects from In-House Projects board with status 'Scheduled' will appear here."
                  : "Projects from Retailer Projects board with status 'Scheduled' will appear here."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
