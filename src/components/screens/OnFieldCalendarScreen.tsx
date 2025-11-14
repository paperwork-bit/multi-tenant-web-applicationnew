import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

// Types
type ProjectStatus = 
  | "scheduled" 
  | "to-be-rescheduled" 
  | "site-inspection"
  | "stage-one"
  | "stage-two"
  | "full-system"
  | "retailer-scheduled"
  | "retailer-to-be-rescheduled";

interface Project {
  id: string;
  name: string;
  status: string;
  startDate?: string;
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
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    [key: string]: any;
  };
  siteVisit?: {
    electricianVisitDate?: string;
    electricianVisitTime?: string;
    electricianNotes?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    propertyAddress?: string;
    [key: string]: any;
  };
  linkedLeadId?: string;
  [key: string]: any;
}

interface SiteVisit {
  id: string;
  electricianVisitDate?: string;
  electricianVisitTime?: string;
  electricianNotes?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  propertyAddress?: string;
  salesPersonName?: string;
  createdAt?: string;
  [key: string]: any;
}

// Status color mapping for calendar display
const getCalendarItemStyle = (item: Project | SiteVisit): { 
  borderColor: string; 
  dotColor: string; 
  bgColor: string; 
  textColor: string; 
  hoverColor: string;
  label: string;
} => {
  // Check if it's a site visit
  const isSiteVisit = 'electricianVisitDate' in item && !('status' in item);
  
  if (isSiteVisit) {
    // Site visits - Indigo
    return {
      borderColor: '#6366f1',
      dotColor: '#6366f1',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      hoverColor: 'hover:bg-indigo-100',
      label: 'Electrician Site Visit'
    };
  }
  
  // Projects - color by status
  const project = item as Project;
  const status = (project.status || '').toLowerCase().trim();
  
  // In-house projects
  if (status === 'scheduled') {
    return {
      borderColor: '#3b82f6',
      dotColor: '#3b82f6',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-100',
      label: 'In-House: Scheduled'
    };
  }
  if (status === 'to-be-rescheduled') {
    return {
      borderColor: '#f59e0b',
      dotColor: '#f59e0b',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      hoverColor: 'hover:bg-amber-100',
      label: 'In-House: To Be Rescheduled'
    };
  }
  
  // Retailer projects
  if (status === 'site-inspection') {
    return {
      borderColor: '#8b5cf6',
      dotColor: '#8b5cf6',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      hoverColor: 'hover:bg-purple-100',
      label: 'Retailer: Site Inspection'
    };
  }
  if (status === 'stage-one') {
    return {
      borderColor: '#ec4899',
      dotColor: '#ec4899',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      hoverColor: 'hover:bg-pink-100',
      label: 'Retailer: Stage One'
    };
  }
  if (status === 'stage-two') {
    return {
      borderColor: '#f97316',
      dotColor: '#f97316',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      hoverColor: 'hover:bg-orange-100',
      label: 'Retailer: Stage Two'
    };
  }
  if (status === 'full-system') {
    return {
      borderColor: '#14b8a6',
      dotColor: '#14b8a6',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      hoverColor: 'hover:bg-teal-100',
      label: 'Retailer: Full System'
    };
  }
  if (status === 'retailer-scheduled') {
    return {
      borderColor: '#3b82f6',
      dotColor: '#3b82f6',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-100',
      label: 'Retailer: Scheduled'
    };
  }
  if (status === 'retailer-to-be-rescheduled') {
    return {
      borderColor: '#f59e0b',
      dotColor: '#f59e0b',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      hoverColor: 'hover:bg-amber-100',
      label: 'Retailer: To Be Rescheduled'
    };
  }
  
  // Default - gray
  return {
    borderColor: '#6b7280',
    dotColor: '#6b7280',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    hoverColor: 'hover:bg-gray-100',
    label: 'Other'
  };
};

export function OnFieldCalendarScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarViewType, setCalendarViewType] = useState<"month" | "week">("month");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSiteVisit, setSelectedSiteVisit] = useState<SiteVisit | null>(null);

  // Load projects from localStorage
  useEffect(() => {
    const loadProjects = () => {
      try {
        const projectsData = localStorage.getItem('xtr_projects');
        if (projectsData) {
          const parsed = JSON.parse(projectsData);
          if (Array.isArray(parsed)) {
            // Filter projects: must match allowed statuses (electrician visit date optional)
            const projectsWithElectricianVisit = parsed.filter((p: Project) => {
              // Get status and normalize it
              const statusRaw = p.status || '';
              const status = statusRaw.toLowerCase().trim();
              
              // In-house projects: only "scheduled" and "to-be-rescheduled"
              const isInHouse = status === "scheduled" || status === "to-be-rescheduled";
              
              // Retailer projects: only "site-inspection", "stage-one", "stage-two", "full-system", "retailer-scheduled", "retailer-to-be-rescheduled"
              const isRetailer = status === "site-inspection" || 
                                status === "stage-one" || 
                                status === "stage-two" || 
                                status === "full-system" || 
                                status === "retailer-scheduled" || 
                                status === "retailer-to-be-rescheduled";
              
              const shouldShow = isInHouse || isRetailer;
              
              // Debug logging (can be removed later)
              if (!shouldShow) {
                console.log('Calendar: Filtered out project due to status:', { 
                  name: p.name, 
                  status: statusRaw, 
                  normalizedStatus: status 
                });
              }
              
              return shouldShow;
            });
            
            setProjects(projectsWithElectricianVisit);
          }
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'xtr_projects' || e.key === 'xtr_leads_state_columns') {
        loadProjects();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load site visits from localStorage
  useEffect(() => {
    const loadSiteVisits = () => {
      try {
        const visitsData = localStorage.getItem('xtr_site_visits');
        if (visitsData) {
          const parsed = JSON.parse(visitsData);
          if (Array.isArray(parsed)) {
            // Filter site visits that have electrician visit date scheduled
            const scheduledVisits = parsed.filter((v: SiteVisit) => 
              v.electricianVisitDate && v.electricianVisitDate.trim() !== ''
            );
            
            setSiteVisits(scheduledVisits);
          }
        }
      } catch (error) {
        console.error('Error loading site visits:', error);
      }
    };

    loadSiteVisits();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'xtr_site_visits') {
        loadSiteVisits();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for site visit updates via custom event
  useEffect(() => {
    const handleSiteVisitUpdate = () => {
      const visitsData = localStorage.getItem('xtr_site_visits');
      if (visitsData) {
        try {
          const parsed = JSON.parse(visitsData);
          if (Array.isArray(parsed)) {
            const scheduledVisits = parsed.filter((v: SiteVisit) => 
              v.electricianVisitDate && v.electricianVisitDate.trim() !== ''
            );
            setSiteVisits(scheduledVisits);
          }
        } catch (error) {
          console.error('Error loading site visits:', error);
        }
      }
    };

    window.addEventListener('xtr-site-visits-updated', handleSiteVisitUpdate);
    return () => window.removeEventListener('xtr-site-visits-updated', handleSiteVisitUpdate);
  }, []);

  // Listen for project updates via custom event
  useEffect(() => {
    const handleProjectUpdate = () => {
      const projectsData = localStorage.getItem('xtr_projects');
      if (projectsData) {
        try {
          const parsed = JSON.parse(projectsData);
          if (Array.isArray(parsed)) {
            // Filter projects: must match allowed statuses (electrician visit date optional)
            const projectsWithElectricianVisit = parsed.filter((p: Project) => {
              // Get status and normalize it
              const statusRaw = p.status || '';
              const status = statusRaw.toLowerCase().trim();
              
              // In-house projects: only "scheduled" and "to-be-rescheduled"
              const isInHouse = status === "scheduled" || status === "to-be-rescheduled";
              
              // Retailer projects: only "site-inspection", "stage-one", "stage-two", "full-system", "retailer-scheduled", "retailer-to-be-rescheduled"
              const isRetailer = status === "site-inspection" || 
                                status === "stage-one" || 
                                status === "stage-two" || 
                                status === "full-system" || 
                                status === "retailer-scheduled" || 
                                status === "retailer-to-be-rescheduled";
              
              const shouldShow = isInHouse || isRetailer;
              
              // Debug logging (can be removed later)
              if (!shouldShow) {
                console.log('Calendar: Filtered out project due to status:', { 
                  name: p.name, 
                  status: statusRaw, 
                  normalizedStatus: status 
                });
              }
              
              return shouldShow;
            });
            
            setProjects(projectsWithElectricianVisit);
          }
        } catch (error) {
          console.error('Error loading projects:', error);
        }
      }
    };

    window.addEventListener('xtr-projects-updated', handleProjectUpdate);
    return () => window.removeEventListener('xtr-projects-updated', handleProjectUpdate);
  }, []);

  // Helper functions
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getWeekDays = (weekStart: Date): Date[] => {
    const days: Date[] = [];
    const start = new Date(weekStart);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatWeekRange = (weekStart: Date) => {
    const weekDays = getWeekDays(weekStart);
    const start = weekDays[0];
    const end = weekDays[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  // Get first day of month and number of days
  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay();
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Helper to get the display date for a project (electrician visit date, start date, or job date)
  const getProjectDate = (p: Project): string | null => {
    // Priority 1: Electrician visit date
    if (p.siteVisit?.electricianVisitDate && p.siteVisit.electricianVisitDate.trim() !== '') {
      const date = typeof p.siteVisit.electricianVisitDate === 'string' 
        ? p.siteVisit.electricianVisitDate 
        : new Date(p.siteVisit.electricianVisitDate).toISOString();
      return date.split('T')[0];
    }
    
    // Priority 2: Start date from projectSnapshot
    if (p.projectSnapshot?.startDate && p.projectSnapshot.startDate.trim() !== '') {
      const date = typeof p.projectSnapshot.startDate === 'string' 
        ? p.projectSnapshot.startDate 
        : new Date(p.projectSnapshot.startDate).toISOString();
      return date.split('T')[0];
    }
    
    // Priority 3: Start date from project
    if (p.startDate && p.startDate.trim() !== '') {
      const date = typeof p.startDate === 'string' 
        ? p.startDate 
        : new Date(p.startDate).toISOString();
      return date.split('T')[0];
    }
    
    // Priority 4: Job date
    if (p.projectDetails?.additionalInfo?.jobDate && p.projectDetails.additionalInfo.jobDate.trim() !== '') {
      const date = typeof p.projectDetails.additionalInfo.jobDate === 'string' 
        ? p.projectDetails.additionalInfo.jobDate 
        : new Date(p.projectDetails.additionalInfo.jobDate).toISOString();
      return date.split('T')[0];
    }
    
    // Priority 5: Site inspection date
    if (p.projectDetails?.additionalInfo?.siteInspection?.date && p.projectDetails.additionalInfo.siteInspection.date.trim() !== '') {
      const date = typeof p.projectDetails.additionalInfo.siteInspection.date === 'string' 
        ? p.projectDetails.additionalInfo.siteInspection.date 
        : new Date(p.projectDetails.additionalInfo.siteInspection.date).toISOString();
      return date.split('T')[0];
    }
    
    return null;
  };

  // Filter projects for a specific date (projects with allowed statuses)
  const getProjectsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    return projects.filter(p => {
      // Additional status check (projects should already be filtered, but double-check)
      const statusRaw = p.status || '';
      const status = statusRaw.toLowerCase().trim();
      const isInHouse = status === "scheduled" || status === "to-be-rescheduled";
      const isRetailer = status === "site-inspection" || 
                        status === "stage-one" || 
                        status === "stage-two" || 
                        status === "full-system" || 
                        status === "retailer-scheduled" || 
                        status === "retailer-to-be-rescheduled";
      if (!isInHouse && !isRetailer) {
        return false;
      }
      
      // Get the project's display date (electrician visit date, start date, job date, etc.)
      const projectDateStr = getProjectDate(p);
      if (!projectDateStr) {
        return false; // No date available, skip
      }
      
      return projectDateStr === dateStr;
    });
  };

  // Filter site visits for a specific date
  const getSiteVisitsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    return siteVisits.filter(v => {
      if (!v.electricianVisitDate) return false;
      
      const visitDateStr = typeof v.electricianVisitDate === 'string' 
        ? v.electricianVisitDate.split('T')[0] 
        : new Date(v.electricianVisitDate).toISOString().split('T')[0];
      
      return visitDateStr === dateStr;
    });
  };

  const handleProjectClick = (project: Project) => {
    // Check if this project matches allowed statuses for on-field inspection
    const statusRaw = project.status || '';
    const status = statusRaw.toLowerCase().trim();
    
    // In-house projects: only "scheduled" and "to-be-rescheduled"
    const isInHouse = status === "scheduled" || status === "to-be-rescheduled";
    
    // Retailer projects: only "site-inspection", "stage-one", "stage-two", "full-system", "retailer-scheduled", "retailer-to-be-rescheduled"
    const isRetailer = status === "site-inspection" || 
                      status === "stage-one" || 
                      status === "stage-two" || 
                      status === "full-system" || 
                      status === "retailer-scheduled" || 
                      status === "retailer-to-be-rescheduled";
    
    if (isInHouse || isRetailer) {
      try {
        // First, try to find the actual site visit record from sales person
        let salesSiteVisit: any = null;
        try {
          const siteVisitsData = localStorage.getItem('xtr_site_visits');
          if (siteVisitsData) {
            const siteVisits = JSON.parse(siteVisitsData);
            if (Array.isArray(siteVisits)) {
              // Match by customer name, email, or address
              const pName = (project.projectSnapshot?.customerName || project.name || '').toLowerCase().trim();
              const pEmail = (project.projectSnapshot?.customerEmail || project.projectDetails?.additionalInfo?.customerEmail || '').toLowerCase().trim();
              const pAddress = (project.projectSnapshot?.customerAddress || project.projectDetails?.additionalInfo?.customerAddress || '').toLowerCase().trim();
              
              salesSiteVisit = siteVisits.find((sv: any) => {
                const svName = (sv.customerName || '').toLowerCase().trim();
                const svEmail = (sv.customerEmail || '').toLowerCase().trim();
                const svAddress = (sv.propertyAddress || '').toLowerCase().trim();
                
                return (pName && svName && pName === svName) ||
                       (pEmail && svEmail && pEmail === svEmail) ||
                       (pAddress && svAddress && pAddress === svAddress);
              });
            }
          }
        } catch (err) {
          console.error('Error finding site visit:', err);
        }
        
        // Also try to find matching lead
        let matchingLead: any = null;
        const leadsData = localStorage.getItem('xtr_leads_state_columns');
        if (leadsData) {
          const leadsBoard = JSON.parse(leadsData);
          const columns = Array.isArray(leadsBoard?.columns) ? leadsBoard.columns : Array.isArray(leadsBoard) ? leadsBoard : [];
          
          // Search all columns for matching lead
          columns.forEach((col: any) => {
            (col.leads || []).forEach((lead: any) => {
              const pName = (project.projectSnapshot?.customerName || project.name || '').toLowerCase().trim();
              const pEmail = (project.projectSnapshot?.customerEmail || project.projectDetails?.additionalInfo?.customerEmail || '').toLowerCase().trim();
              const pAddress = (project.projectSnapshot?.customerAddress || project.projectDetails?.additionalInfo?.customerAddress || '').toLowerCase().trim();
              
              const lName = (lead.title || lead.projectSnapshot?.customerName || '').toLowerCase().trim();
              const lEmail = (lead.tags?.[0] || lead.projectSnapshot?.customerEmail || '').toLowerCase().trim();
              const lAddress = (lead.company || lead.projectSnapshot?.customerAddress || '').toLowerCase().trim();
              
              if ((pName && lName && pName === lName) ||
                  (pEmail && lEmail && pEmail === lEmail) ||
                  (pAddress && lAddress && pAddress === lAddress)) {
                matchingLead = lead;
              }
            });
          });
        }
        
        // Prepare prefill data - prioritize sales site visit data, then project data, then lead data
        const snap = project.projectSnapshot || {};
        const sv = project.siteVisit || {};
        const leadSnap = matchingLead?.projectSnapshot || {};
        
        // Combine all sales notes
        const salesNotesParts: string[] = [];
        if (salesSiteVisit?.siteNotes) salesNotesParts.push(salesSiteVisit.siteNotes);
        if (salesSiteVisit?.specialRequirements) salesNotesParts.push(`Special Requirements: ${salesSiteVisit.specialRequirements}`);
        if (salesSiteVisit?.nextSteps) salesNotesParts.push(`Next Steps: ${salesSiteVisit.nextSteps}`);
        if (sv.siteNotes) salesNotesParts.push(sv.siteNotes);
        if (sv.specialRequirements) salesNotesParts.push(sv.specialRequirements);
        if (matchingLead?.description) salesNotesParts.push(matchingLead.description);
        
        const prefill = {
          customerName: salesSiteVisit?.customerName || sv.customerName || snap.customerName || matchingLead?.title || project.name || '',
          customerEmail: salesSiteVisit?.customerEmail || sv.customerEmail || snap.customerEmail || matchingLead?.tags?.[0] || '',
          customerPhone: salesSiteVisit?.customerPhone || sv.customerPhone || snap.customerPhone || matchingLead?.value || '',
          propertyAddress: salesSiteVisit?.propertyAddress || sv.propertyAddress || snap.customerAddress || project.projectDetails?.additionalInfo?.customerAddress || matchingLead?.company || '',
          propertyType: salesSiteVisit?.propertyType || snap.propertyType || leadSnap.clientType || matchingLead?.projectSnapshot?.propertyType || '',
          currentEnergyProvider: salesSiteVisit?.currentEnergyProvider || sv.currentEnergyProvider || snap.currentEnergyProvider || leadSnap.utilityInfo?.energyRetailer || '',
          energyDistributor: salesSiteVisit?.energyDistributor || sv.energyDistributor || snap.energyDistributor || leadSnap.utilityInfo?.distributor || matchingLead?.projectSnapshot?.energyDistributor || '',
          averageMonthlyBill: salesSiteVisit?.averageMonthlyBill || sv.averageMonthlyBill || snap.averageMonthlyBill || '',
          roofOrientation: salesSiteVisit?.roofOrientation || sv.roofOrientation || snap.roofOrientation || '',
          roofType: salesSiteVisit?.roofType || sv.roofType || snap.roofType || leadSnap.propertyInfo?.roofType || matchingLead?.projectSnapshot?.roofType || '',
          meterPhase: salesSiteVisit?.meterPhase || sv.meterPhase || snap.meterPhase || leadSnap.propertyInfo?.meterPhase || matchingLead?.projectSnapshot?.meterPhase || '',
          numberOfStory: salesSiteVisit?.numberOfStory || sv.numberOfStory || snap.numberOfStory || leadSnap.propertyInfo?.houseStorey || matchingLead?.projectSnapshot?.houseStorey || '',
          shadingAssessment: Array.isArray(salesSiteVisit?.shadingAssessment) ? salesSiteVisit.shadingAssessment : 
                            (Array.isArray(sv.shadingAssessment) ? sv.shadingAssessment : 
                            (Array.isArray(leadSnap.siteVisitInfo?.shadingAssessment) ? leadSnap.siteVisitInfo.shadingAssessment : [])),
          primaryMotivation: Array.isArray(salesSiteVisit?.primaryMotivation) ? salesSiteVisit.primaryMotivation : 
                           (Array.isArray(sv.primaryMotivation) ? sv.primaryMotivation : 
                           (Array.isArray(leadSnap.siteVisitInfo?.primaryMotivation) ? leadSnap.siteVisitInfo.primaryMotivation : [])),
          existingSolarInstallations: salesSiteVisit?.existingSolarInstallations || sv.existingSolarInstallations || snap.existingSolarInstallations || leadSnap.siteVisitInfo?.existingSolarInstallations || '',
          interestLevel: salesSiteVisit?.interestLevel || sv.interestLevel || snap.interestLevel || leadSnap.siteVisitInfo?.interestLevel || '',
          salesNotes: salesNotesParts.join('\n\n') || '',
        };
        
        // Set prefill and context
        localStorage.setItem('xtr_onfield_prefill', JSON.stringify(prefill));
        if (matchingLead?.id) {
          localStorage.setItem('xtr_onfield_context', JSON.stringify({ leadId: matchingLead.id }));
        } else {
          localStorage.setItem('xtr_onfield_context', JSON.stringify({ projectId: project.id }));
        }
        
        // Navigate to site-visit page (which will show OnFieldSiteVisitScreen for on-field team)
        window.dispatchEvent(new CustomEvent('xtr-nav', { detail: 'site-visit' }));
        return;
      } catch (error) {
        console.error('Error handling project click:', error);
      }
    }
    
    // Default behavior: show project details
    setSelectedProject(project);
    setSelectedSiteVisit(null);
  };

  const handleSiteVisitClick = (visit: SiteVisit) => {
    // Redirect to site visit page with prefill data when clicking on a site visit from calendar
    try {
      // The visit object should already contain all the sales data
      const salesNotesParts: string[] = [];
      if (visit.electricianNotes) salesNotesParts.push(`Electrician Notes: ${visit.electricianNotes}`);
      
      const prefill = {
        customerName: visit.customerName || '',
        customerEmail: visit.customerEmail || '',
        customerPhone: visit.customerPhone || '',
        propertyAddress: visit.propertyAddress || '',
        propertyType: '',
        currentEnergyProvider: '',
        energyDistributor: '',
        averageMonthlyBill: '',
        roofOrientation: '',
        roofType: '',
        meterPhase: '',
        numberOfStory: '',
        shadingAssessment: Array.isArray(visit.shadingAssessment) ? visit.shadingAssessment : [],
        primaryMotivation: Array.isArray(visit.primaryMotivation) ? visit.primaryMotivation : [],
        existingSolarInstallations: '',
        interestLevel: '',
        salesNotes: salesNotesParts.join('\n\n') || '',
      };
      
      // Try to find the full site visit record from xtr_site_visits
      try {
        const siteVisitsData = localStorage.getItem('xtr_site_visits');
        if (siteVisitsData) {
          const siteVisits = JSON.parse(siteVisitsData);
          if (Array.isArray(siteVisits)) {
            const fullSiteVisit = siteVisits.find((sv: any) => {
              return sv.id === visit.id || 
                     (sv.customerName === visit.customerName && sv.propertyAddress === visit.propertyAddress);
            });
            
            if (fullSiteVisit) {
              // Merge with full site visit data
              prefill.customerName = fullSiteVisit.customerName || prefill.customerName;
              prefill.customerEmail = fullSiteVisit.customerEmail || prefill.customerEmail;
              prefill.customerPhone = fullSiteVisit.customerPhone || prefill.customerPhone;
              prefill.propertyAddress = fullSiteVisit.propertyAddress || prefill.propertyAddress;
              prefill.propertyType = fullSiteVisit.propertyType || prefill.propertyType;
              prefill.currentEnergyProvider = fullSiteVisit.currentEnergyProvider || prefill.currentEnergyProvider;
              prefill.energyDistributor = fullSiteVisit.energyDistributor || prefill.energyDistributor;
              prefill.averageMonthlyBill = fullSiteVisit.averageMonthlyBill || prefill.averageMonthlyBill;
              prefill.roofOrientation = fullSiteVisit.roofOrientation || prefill.roofOrientation;
              prefill.roofType = fullSiteVisit.roofType || prefill.roofType;
              prefill.meterPhase = fullSiteVisit.meterPhase || prefill.meterPhase;
              prefill.numberOfStory = fullSiteVisit.numberOfStory || prefill.numberOfStory;
              prefill.shadingAssessment = Array.isArray(fullSiteVisit.shadingAssessment) ? fullSiteVisit.shadingAssessment : prefill.shadingAssessment;
              prefill.primaryMotivation = Array.isArray(fullSiteVisit.primaryMotivation) ? fullSiteVisit.primaryMotivation : prefill.primaryMotivation;
              prefill.existingSolarInstallations = fullSiteVisit.existingSolarInstallations || prefill.existingSolarInstallations;
              prefill.interestLevel = fullSiteVisit.interestLevel || prefill.interestLevel;
              
              if (fullSiteVisit.siteNotes) salesNotesParts.push(fullSiteVisit.siteNotes);
              if (fullSiteVisit.specialRequirements) salesNotesParts.push(`Special Requirements: ${fullSiteVisit.specialRequirements}`);
              if (fullSiteVisit.nextSteps) salesNotesParts.push(`Next Steps: ${fullSiteVisit.nextSteps}`);
              prefill.salesNotes = salesNotesParts.join('\n\n') || '';
            }
          }
        }
      } catch (err) {
        console.error('Error finding full site visit:', err);
      }
      
      // Set prefill and context
      localStorage.setItem('xtr_onfield_prefill', JSON.stringify(prefill));
      if (visit.id) {
        localStorage.setItem('xtr_onfield_context', JSON.stringify({ siteVisitId: visit.id }));
      }
      
      // Navigate to site-visit page
      window.dispatchEvent(new CustomEvent('xtr-nav', { detail: 'site-visit' }));
      return;
    } catch (error) {
      console.error('Error handling site visit click:', error);
      // Fallback to showing dialog
      setSelectedSiteVisit(visit);
      setSelectedProject(null);
    }
  };

  // Determine project type
  const isRetailerProject = (status: string) => {
    return ["site-inspection", "stage-one", "stage-two", "full-system", "retailer-scheduled", "retailer-to-be-rescheduled"].includes(status);
  };

  const isInHouseProject = (status: string) => {
    return ["scheduled", "to-be-rescheduled"].includes(status);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View scheduled projects</p>
        </div>
      </div>

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
            {Array.from({ length: 42 }).map((_, index) => {
              const firstDay = getFirstDayOfMonth(currentMonth);
              const daysInMonth = getDaysInMonth(currentMonth);
              const day = index - firstDay + 1;
              
              if (day < 1 || day > daysInMonth) {
                return (
                  <div key={index} className="min-h-24 border rounded p-2 bg-gray-50 text-gray-400"></div>
                );
              }
              
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const dayProjects = getProjectsForDate(date);
              const daySiteVisits = getSiteVisitsForDate(date);
              const totalItems = dayProjects.length + daySiteVisits.length;
              
              return (
                <div
                  key={index}
                  className="min-h-24 border rounded p-2 bg-white"
                >
                  <div className="text-sm font-medium mb-1">{day}</div>
                  <div className="space-y-1">
                    {/* Show all items with electrician visits scheduled (site visits and projects) */}
                    {[...daySiteVisits, ...dayProjects].slice(0, 2).map((item) => {
                      // Check if it's a site visit or project
                      const isSiteVisit = 'electricianVisitDate' in item && !('status' in item);
                      const displayName = isSiteVisit 
                        ? (item as SiteVisit).customerName || 'Site Visit'
                        : (item as Project).name;
                      
                      const style = getCalendarItemStyle(item);
                      
                      return (
                        <div
                          key={isSiteVisit ? `visit-${(item as SiteVisit).id}` : `project-${(item as Project).id}`}
                          className={`text-xs p-1 ${style.bgColor} ${style.textColor} rounded cursor-pointer ${style.hoverColor} flex items-center gap-1.5 relative`}
                          onClick={() => isSiteVisit ? handleSiteVisitClick(item as SiteVisit) : handleProjectClick(item as Project)}
                          style={{
                            borderLeft: `3px solid ${style.borderColor}`
                          }}
                          title={style.label}
                        >
                          <span 
                            className="flex-shrink-0" 
                            style={{
                              width: '6px',
                              height: '6px',
                              backgroundColor: style.dotColor,
                              borderRadius: '50%',
                              display: 'inline-block'
                            }}
                            title={style.label}
                          ></span>
                          <span 
                            className="flex-shrink-0" 
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: style.dotColor,
                              borderRadius: '50%',
                              display: 'inline-block'
                            }}
                            title={style.label}
                          ></span>
                          <span className="truncate">⚡ {displayName}</span>
                        </div>
                      );
                    })}
                    {totalItems > 2 && (
                      <div className="text-xs text-gray-500">+{totalItems - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              const dayProjects = getProjectsForDate(date);
              const daySiteVisits = getSiteVisitsForDate(date);
              
              return (
                <div
                  key={index}
                  className="min-h-96 border rounded p-2 bg-white"
                >
                  <div className="text-sm font-medium mb-2">{date.getDate()}</div>
                  <div className="space-y-1">
                    {/* Show all items with electrician visits scheduled (site visits and projects) */}
                    {[...daySiteVisits, ...dayProjects].map((item) => {
                      // Check if it's a site visit or project
                      const isSiteVisit = 'electricianVisitDate' in item && !('status' in item);
                      const displayName = isSiteVisit 
                        ? (item as SiteVisit).customerName || 'Site Visit'
                        : (item as Project).name;
                      
                      const style = getCalendarItemStyle(item);
                      
                      return (
                        <div
                          key={isSiteVisit ? `visit-${(item as SiteVisit).id}` : `project-${(item as Project).id}`}
                          className={`text-xs p-1.5 ${style.bgColor} ${style.textColor} rounded cursor-pointer ${style.hoverColor} flex items-center gap-1.5 relative mb-1`}
                          onClick={() => isSiteVisit ? handleSiteVisitClick(item as SiteVisit) : handleProjectClick(item as Project)}
                          style={{
                            borderLeft: `3px solid ${style.borderColor}`
                          }}
                          title={style.label}
                        >
                          <span 
                            className="flex-shrink-0" 
                            style={{
                              width: '6px',
                              height: '6px',
                              backgroundColor: style.dotColor,
                              borderRadius: '50%',
                              display: 'inline-block'
                            }}
                            title={style.label}
                          ></span>
                          <span 
                            className="flex-shrink-0" 
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: style.dotColor,
                              borderRadius: '50%',
                              display: 'inline-block'
                            }}
                            title={style.label}
                          ></span>
                          <span className="truncate">⚡ {displayName}</span>
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

      {/* Legend */}
      <div className="bg-white rounded-lg border p-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Legend</h3>
        <div className="space-y-3">
          {/* Site Visits */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Site Visits:</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1">
                <span style={{ width: '6px', height: '6px', backgroundColor: '#6366f1', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#6366f1', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
              </div>
              <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #6366f1', paddingLeft: '8px', backgroundColor: '#eef2ff', padding: '4px 8px', borderRadius: '4px' }}>⚡ Electrician Site Visit (Indigo)</span>
            </div>
          </div>

          {/* In-House Projects */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">In-House Projects:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
                </div>
                <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '8px', backgroundColor: '#eff6ff', padding: '4px 8px', borderRadius: '4px' }}>⚡ Scheduled (Blue)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
                </div>
                <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '8px', backgroundColor: '#fffbeb', padding: '4px 8px', borderRadius: '4px' }}>⚡ To Be Rescheduled (Amber)</span>
              </div>
            </div>
          </div>

          {/* Retailer Projects */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Retailer Projects:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#8b5cf6', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#8b5cf6', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
                </div>
                <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '8px', backgroundColor: '#faf5ff', padding: '4px 8px', borderRadius: '4px' }}>⚡ Site Inspection (Purple)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#ec4899', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#ec4899', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
                </div>
                <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #ec4899', paddingLeft: '8px', backgroundColor: '#fdf2f8', padding: '4px 8px', borderRadius: '4px' }}>⚡ Stage One (Pink)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#f97316', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#f97316', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
                </div>
                <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #f97316', paddingLeft: '8px', backgroundColor: '#fff7ed', padding: '4px 8px', borderRadius: '4px' }}>⚡ Stage Two (Orange)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#14b8a6', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#14b8a6', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
                </div>
                <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #14b8a6', paddingLeft: '8px', backgroundColor: '#f0fdfa', padding: '4px 8px', borderRadius: '4px' }}>⚡ Full System (Teal)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
                </div>
                <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '8px', backgroundColor: '#eff6ff', padding: '4px 8px', borderRadius: '4px' }}>⚡ Retailer Scheduled (Blue)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'inline-block', marginLeft: '2px' }}></span>
                </div>
                <span className="text-xs text-gray-700" style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '8px', backgroundColor: '#fffbeb', padding: '4px 8px', borderRadius: '4px' }}>⚡ Retailer To Be Rescheduled (Amber)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 pt-3 border-t">Click on any item to view details or open the On-Field Site Visit form.</p>
        </div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
            <DialogDescription>Project Details</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold">{selectedProject.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">
                    {selectedProject.startDate || 
                     selectedProject.projectDetails?.additionalInfo?.jobDate ||
                     selectedProject.projectDetails?.additionalInfo?.siteInspection?.date ||
                     selectedProject.projectSnapshot?.startDate ||
                     'Not set'}
                  </p>
                </div>
              </div>
              {selectedProject.projectDetails?.additionalInfo?.customerName && (
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-semibold">{selectedProject.projectDetails.additionalInfo.customerName}</p>
                </div>
              )}
              {selectedProject.projectDetails?.additionalInfo?.customerEmail && (
                <div>
                  <p className="text-sm text-gray-500">Customer Email</p>
                  <p className="font-semibold">{selectedProject.projectDetails.additionalInfo.customerEmail}</p>
                </div>
              )}
              {selectedProject.projectDetails?.additionalInfo?.customerContact && (
                <div>
                  <p className="text-sm text-gray-500">Customer Contact</p>
                  <p className="font-semibold">{selectedProject.projectDetails.additionalInfo.customerContact}</p>
                </div>
              )}
              {selectedProject.projectDetails?.additionalInfo?.customerAddress && (
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold">{selectedProject.projectDetails.additionalInfo.customerAddress}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Site Visit Details Dialog */}
      <Dialog open={!!selectedSiteVisit} onOpenChange={() => setSelectedSiteVisit(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>⚡ Electrician Site Visit</span>
            </DialogTitle>
            <DialogDescription>Site Visit Booking Details</DialogDescription>
          </DialogHeader>
          {selectedSiteVisit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Visit Date</p>
                  <p className="font-semibold">{selectedSiteVisit.electricianVisitDate || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visit Time</p>
                  <p className="font-semibold">{selectedSiteVisit.electricianVisitTime || 'Not set'}</p>
                </div>
              </div>
              {selectedSiteVisit.customerName && (
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-semibold">{selectedSiteVisit.customerName}</p>
                </div>
              )}
              {selectedSiteVisit.customerEmail && (
                <div>
                  <p className="text-sm text-gray-500">Customer Email</p>
                  <p className="font-semibold">{selectedSiteVisit.customerEmail}</p>
                </div>
              )}
              {selectedSiteVisit.customerPhone && (
                <div>
                  <p className="text-sm text-gray-500">Customer Phone</p>
                  <p className="font-semibold">{selectedSiteVisit.customerPhone}</p>
                </div>
              )}
              {selectedSiteVisit.propertyAddress && (
                <div>
                  <p className="text-sm text-gray-500">Property Address</p>
                  <p className="font-semibold">{selectedSiteVisit.propertyAddress}</p>
                </div>
              )}
              {selectedSiteVisit.salesPersonName && (
                <div>
                  <p className="text-sm text-gray-500">Scheduled By</p>
                  <p className="font-semibold">{selectedSiteVisit.salesPersonName}</p>
                </div>
              )}
              {selectedSiteVisit.electricianNotes && (
                <div>
                  <p className="text-sm text-gray-500">Notes for Electrician</p>
                  <p className="font-semibold whitespace-pre-wrap">{selectedSiteVisit.electricianNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

