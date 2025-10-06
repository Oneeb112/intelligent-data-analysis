import { useState } from "react";
import { Download, RefreshCw, FileText, Database, Network, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResults } from "@/pages/Index";

interface ResultsDashboardProps {
  results: AnalysisResults;
  onReset: () => void;
}

export const ResultsDashboard = ({ results, onReset }: ResultsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("summary");

  const downloadFile = (base64Data: string, filename: string, mimeType: string) => {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64Data}`;
    link.download = filename;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analysis Results</h2>
          <p className="text-muted-foreground">Your data has been processed and analyzed</p>
        </div>
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="schema">SQL Schema</TabsTrigger>
          <TabsTrigger value="erd">ERD</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Analysis Report
              </CardTitle>
              <CardDescription>Key findings and actions taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                  {results.report_text || "No report available"}
                </pre>
              </div>
            </CardContent>
          </Card>

          {results.analysis_json && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Issues Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {results.analysis_json.issues_found || "None"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions Taken</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {results.analysis_json.actions_taken || "None"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                SQL Schema
              </CardTitle>
              <CardDescription>Generated database schema from your data</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{results.sql_schema || "No schema available"}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erd">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Entity Relationship Diagram
              </CardTitle>
              <CardDescription>Visual representation of data relationships</CardDescription>
            </CardHeader>
            <CardContent>
              {results.erd_svg_base64 ? (
                <div className="flex justify-center bg-muted p-8 rounded-lg">
                  <img 
                    src={`data:image/svg+xml;base64,${results.erd_svg_base64}`}
                    alt="Entity Relationship Diagram"
                    className="max-w-full h-auto"
                  />
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No ERD available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.cleaned_csv_base64 && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => downloadFile(results.cleaned_csv_base64!, 'cleaned_data.csv', 'text/csv')}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Cleaned Dataset
                  </CardTitle>
                  <CardDescription>Download processed CSV file</CardDescription>
                </CardHeader>
              </Card>
            )}

            {results.sql_schema && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => downloadFile(btoa(results.sql_schema!), 'schema.sql', 'text/plain')}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    SQL Schema
                  </CardTitle>
                  <CardDescription>Download SQL schema file</CardDescription>
                </CardHeader>
              </Card>
            )}

            {results.dashboard_code_zip_base64 && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => downloadFile(results.dashboard_code_zip_base64!, 'dashboard.zip', 'application/zip')}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Dashboard Code
                  </CardTitle>
                  <CardDescription>Download interactive dashboard</CardDescription>
                </CardHeader>
              </Card>
            )}

            {results.erd_svg_base64 && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => downloadFile(results.erd_svg_base64!, 'erd_diagram.svg', 'image/svg+xml')}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    ERD Diagram
                  </CardTitle>
                  <CardDescription>Download ERD as SVG</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
