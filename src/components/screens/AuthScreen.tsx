import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Mail, Lock } from "lucide-react";
import companyLogo from "figma:asset/283027b090530df720ee88d43a780fd9aee6b0ad.png";

export type RetailerTeam = "sales" | "on-field" | "project-management" | "operations";

interface AuthScreenProps {
  onLogin?: (userType: "retailer" | "subcontractor" | "inspector", team?: RetailerTeam, email?: string) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [userType, setUserType] = useState<"retailer" | "subcontractor" | "inspector">("retailer");
  const [retailerTeam, setRetailerTeam] = useState<RetailerTeam>("sales");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-4 mb-4">
            <img src={companyLogo} alt="xTechs Renewables" className="w-24 h-24" />
            <h1 className="text-white">xTechs Renewables</h1>
          </div>
          <p className="text-white/80">Multi-tenant Solar Management Platform</p>
        </div>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={userType === "retailer" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserType("retailer")}
                className="flex-1"
              >
                Retailer
              </Button>
              <Button
                variant={userType === "subcontractor" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserType("subcontractor")}
                className="flex-1"
              >
                Subcontractor
              </Button>
              <Button
                variant={userType === "inspector" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserType("inspector")}
                className="flex-1"
              >
                Inspector
              </Button>
            </div>
            <div>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form
                  autoComplete="off"
                  onSubmit={(e)=>{
                    e.preventDefault();
                    const em = (email || "").toLowerCase().trim();
                    if (userType === 'retailer') {
                      if (em === 'neil@xtechsrenewables.com.au' && retailerTeam !== 'project-management') {
                        alert('Access denied: This account is restricted to Project Management team. Please select Project Management to continue.');
                        return;
                      }
                      if (em === 'james@xtechsrenewables.com.au' && retailerTeam !== 'sales') {
                        alert('Access denied: This account is restricted to Sales team. Please select Sales Team to continue.');
                        return;
                      }
                      if (em === 'paperwork@xtechsrenewables.com.au' && retailerTeam !== 'operations') {
                        alert('Access denied: This account is restricted to Operations team. Please select Operations to continue.');
                        return;
                      }
                      if (em === 'ashely@xtechsrenewables.com.au' && retailerTeam !== 'on-field') {
                        alert('Access denied: This account is restricted to On-Field team. Please select On-Field to continue.');
                        return;
                      }
                      if (em === 'liam@xtechsrenewables.com.au' && retailerTeam !== 'on-field') {
                        alert('Access denied: This account is restricted to On-Field team. Please select On-Field to continue.');
                        return;
                      }
                    }
                    onLogin?.(userType, userType === "retailer" ? retailerTeam : undefined, email);
                  }}
                >
                  {/* Hidden trap inputs to prevent browser autofill */}
                  <input type="text" style={{display:'none'}} autoComplete="username" />
                  <input type="password" style={{display:'none'}} autoComplete="current-password" />

                {userType === "retailer" && (
                  <div className="space-y-2">
                    <Label htmlFor="team">Select Team</Label>
                    <Select value={retailerTeam} onValueChange={(value) => setRetailerTeam(value as RetailerTeam)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Team</SelectItem>
                        <SelectItem value="on-field">On-Field Team</SelectItem>
                        <SelectItem value="project-management">Project Management Team</SelectItem>
                        <SelectItem value="operations">Operations Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@company.com" 
                      className="pl-10"
                      autoComplete="off"
                      name="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      autoComplete="new-password"
                      name="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Remember me</span>
                  </label>
                  <Button variant="link" size="sm">
                    Forgot password?
                  </Button>
                </div>
                <Button className="w-full" type="submit">Sign In</Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" placeholder="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-company">Company Name</Label>
                  <Input id="signup-company" placeholder="Your Company" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="you@company.com" autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" autoComplete="new-password" />
                </div>
                <Button className="w-full">Create Account</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-white/60">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
