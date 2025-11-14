import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Calendar } from "lucide-react";
import { db, firebaseEnabled } from "../../lib/firebase";
import { onSnapshot, collection } from "firebase/firestore";

export function SubcontractorSiteVisitScreen() {
  const [form, setForm] = useState({
    subcontractorName: "",
    subcontractorEmail: "",
    subcontractorPhone: "",
    jobAddress: "",
    dateOfVisit: "",
    visitTime: "",
    scopeOfWork: "",
    notes: "",
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);
  const [pmProjectsFs, setPmProjectsFs] = useState<any[]>([]);

  React.useEffect(() => {
    let unsub: (() => void) | undefined;
    if (firebaseEnabled && db) {
      try {
        unsub = onSnapshot(collection(db, 'pm_projects'), (snap: any) => {
          const arr = snap?.docs?.map((d: any) => d?.data && typeof d.data === 'function' ? d.data() : d?.data()) || [];
          if (Array.isArray(arr)) setPmProjectsFs(arr as any);
        });
      } catch {}
    }
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  React.useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("xtr_projects");
        const arr = raw ? JSON.parse(raw) : [];
        const base = (Array.isArray(arr) ? arr : []);
        const merged = Array.isArray(pmProjectsFs) && pmProjectsFs.length > 0 ? [...base, ...pmProjectsFs] : base;
        const list = merged.filter((p: any) => p.jobType === "site-inspection" || p.status === "site-inspection" || p.inspectionBooked);
        // sort by inspection date ascending
        list.sort((a: any, b: any) => {
          const da = a.inspectionDate ? new Date(a.inspectionDate).getTime() : 0;
          const db = b.inspectionDate ? new Date(b.inspectionDate).getTime() : 0;
          return da - db;
        });
        setProjects(list);
        if (list.length > 0) setSelectedProjectId(list[0].id);
      } catch {}
    };
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === "xtr_projects") load(); };
    const onBroadcast = () => load();
    window.addEventListener("storage", onStorage);
    window.addEventListener("xtr-projects-updated", onBroadcast as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("xtr-projects-updated", onBroadcast as any);
    };
  }, [pmProjectsFs]);

  const selectedProject = React.useMemo(() => projects.find((p) => String(p.id) === String(selectedProjectId)), [projects, selectedProjectId]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { id: `SCV-${Date.now()}`, createdAt: new Date().toISOString(), projectId: selectedProject?.id, projectTitle: selectedProject?.title, ...form };
      const prev = JSON.parse(localStorage.getItem("xtr_subcontractor_site_visits") || "[]");
      const next = Array.isArray(prev) ? [payload, ...prev] : [payload];
      localStorage.setItem("xtr_subcontractor_site_visits", JSON.stringify(next));
      alert("Subcontractor Site Visit saved.");
      setForm({
        subcontractorName: "",
        subcontractorEmail: "",
        subcontractorPhone: "",
        jobAddress: "",
        dateOfVisit: "",
        visitTime: "",
        scopeOfWork: "",
        notes: "",
      });
    } catch {
      alert("Could not save. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Retailer Site Visit</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Project selector and snapshot from Project Management (Site Inspection) */}
            <div className="space-y-2">
              <Label>Project (Site Inspection)</Label>
              <select
                className="border rounded-md px-3 py-2 w-full bg-background"
                value={selectedProjectId ?? ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.length === 0 && <option value="">No site inspections found</option>}
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.customerAddress || p.customerName || ""} {p.inspectionDate ? `(${new Date(p.inspectionDate).toLocaleDateString()} ${p.inspectionTime || ""})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedProject && (
              <div className="space-y-6 p-4 border rounded-md bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Project Name</Label>
                    <Input value={selectedProject.title || ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>Phone</Label>
                    <Input value={selectedProject.value || ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>Priority</Label>
                    <Input value={selectedProject.priority || ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>Client Type</Label>
                    <Input value={selectedProject.clientType || ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>Client Name</Label>
                    <Input value={selectedProject.clientName || ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>Job Type</Label>
                    <Input value={selectedProject.jobType || ""} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Inspection Date</Label>
                    <Input value={selectedProject.inspectionDate ? new Date(selectedProject.inspectionDate).toLocaleDateString() : ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>Inspection Time</Label>
                    <Input value={selectedProject.inspectionTime || ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>Customer Address</Label>
                    <Input value={selectedProject.customerAddress || ""} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>System Type</Label>
                    <Input value={selectedProject.systemType || ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>System Size (kW)</Label>
                    <Input value={selectedProject.systemSize || ""} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label>Energy Retailer</Label>
                    <Input value={selectedProject.energyRetailer || ""} readOnly />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subcontractor Name</Label>
                <Input value={form.subcontractorName} onChange={(e) => handleChange("subcontractorName", e.target.value)} placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <Label>Subcontractor Email</Label>
                <Input value={form.subcontractorEmail} onChange={(e) => handleChange("subcontractorEmail", e.target.value)} placeholder="name@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Subcontractor Phone</Label>
                <Input value={form.subcontractorPhone} onChange={(e) => handleChange("subcontractorPhone", e.target.value)} placeholder="+61 4XX XXX XXX" />
              </div>
              <div className="space-y-2">
                <Label>Job Address</Label>
                <Input value={form.jobAddress} onChange={(e) => handleChange("jobAddress", e.target.value)} placeholder="Enter address" />
              </div>
              <div className="space-y-2">
                <Label>Date of Visit</Label>
                <div className="flex items-center gap-2">
                  <Input type="date" value={form.dateOfVisit} onChange={(e) => handleChange("dateOfVisit", e.target.value)} />
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Visit Time</Label>
                <Input type="time" value={form.visitTime} onChange={(e) => handleChange("visitTime", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Scope of Work</Label>
              <Textarea rows={3} value={form.scopeOfWork} onChange={(e) => handleChange("scopeOfWork", e.target.value)} placeholder="Brief scope of the work to be performed" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea rows={3} value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Any important notes" />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Visit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


