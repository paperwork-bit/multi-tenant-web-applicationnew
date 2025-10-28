import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Mail, Lock, Building2, Users, Shield, Eye, EyeOff, Zap, Sun } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    onLogin?.(userType, userType === "retailer" ? retailerTeam : undefined, email);
    setIsLoading(false);
  };

  const getDemoCredentials = () => {
    if (userType === "retailer") {
      return { email: "retailer@xtechs.com", password: "demo123" };
    } else if (userType === "subcontractor") {
      return { email: "subcontractor@xtechs.com", password: "demo123" };
    } else {
      return { email: "inspector@xtechs.com", password: "demo123" };
    }
  };

  const fillDemoCredentials = () => {
    const demo = getDemoCredentials();
    setEmail(demo.email);
    setPassword(demo.password);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md text-center space-y-8">
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sun className="w-12 h-12 text-yellow-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                xTechs Renewables
              </h1>
              <p className="text-xl text-blue-100">
                Multi-tenant Solar Management Platform
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-100">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Complete project lifecycle management</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <Users className="w-5 h-5 text-green-400" />
                <span>Multi-tenant architecture</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>Enterprise-grade security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center">
              <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <Sun className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">xTechs Renewables</h1>
              <p className="text-blue-200">Solar Management Platform</p>
            </div>

            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="space-y-6 pb-4">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Select User Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={userType === "retailer" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUserType("retailer")}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="text-xs">Retailer</span>
                    </Button>
                    <Button
                      variant={userType === "subcontractor" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUserType("subcontractor")}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Subcontractor</span>
                    </Button>
                    <Button
                      variant={userType === "inspector" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUserType("inspector")}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-xs">Inspector</span>
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Sign in to your account to continue
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Demo Credentials Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Demo Credentials</p>
                      <div className="text-xs text-blue-700 space-y-0.5">
                        <p><strong>Email:</strong> {getDemoCredentials().email}</p>
                        <p><strong>Password:</strong> {getDemoCredentials().password}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fillDemoCredentials}
                      className="text-blue-700 border-blue-300 hover:bg-blue-50"
                    >
                      Auto Fill
                    </Button>
                  </div>
                </div>

                {/* Team Selection for Retailers */}
                {userType === "retailer" && (
                  <div className="space-y-2">
                    <Label htmlFor="team" className="text-sm font-medium text-gray-700">Select Team</Label>
                    <Select value={retailerTeam} onValueChange={(value) => setRetailerTeam(value as RetailerTeam)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Sales</Badge>
                            <span>Sales Team</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="on-field">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">Field</Badge>
                            <span>On-Field Team</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="project-management">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">PM</Badge>
                            <span>Project Management</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="operations">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">Ops</Badge>
                            <span>Operations Team</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Login Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password" 
                        className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span>Remember me</span>
                    </label>
                    <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-800 p-0 h-auto">
                      Forgot password?
                    </Button>
                  </div>

                  <Button 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                    onClick={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access Buttons */}
            <div className="space-y-3">
              <p className="text-center text-sm text-white/80">Quick Demo Access:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUserType("retailer");
                    setRetailerTeam("sales");
                    fillDemoCredentials();
                    handleLogin();
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Sales Team →
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUserType("retailer");
                    setRetailerTeam("on-field");
                    fillDemoCredentials();
                    handleLogin();
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  On-Field →
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUserType("retailer");
                    setRetailerTeam("project-management");
                    fillDemoCredentials();
                    handleLogin();
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  PM Team →
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUserType("subcontractor");
                    fillDemoCredentials();
                    handleLogin();
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Subcontractor →
                </Button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-white/60">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
