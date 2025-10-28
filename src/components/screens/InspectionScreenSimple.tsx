import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function InspectionScreenSimple() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inspection & Grid Connection</h1>
          <p className="text-gray-600">Manage inspections and grid connections</p>
        </div>
        <Button>Submit Grid Connection</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project: Smith Residence</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a test to see if the basic structure works.</p>
        </CardContent>
      </Card>
    </div>
  );
}
