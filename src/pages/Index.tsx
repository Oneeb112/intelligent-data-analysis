import { useState } from "react";
import { Hero } from "@/components/Hero";
import { UploadZone } from "@/components/UploadZone";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type ProcessingStage = "idle" | "uploading" | "processing" | "complete" | "error";

export interface AnalysisResults {
  cleaned_csv_base64?: string;
  sql_schema?: string;
  erd_svg_base64?: string;
  dashboard_code_zip_base64?: string;
  report_text?: string;
  analysis_json?: {
    issues_found?: string;
    actions_taken?: string;
    missing_value_summary?: string;
    suspected_primary_keys?: string[];
    suspected_foreign_keys?: string[];
    recommended_charts?: string[];
  };
}

const Index = () => {
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    setStage("uploading");
    setProgress(10);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
      });

      const base64Data = (reader.result as string).split(',')[1];
      
      setStage("processing");
      setProgress(30);

      // Call edge function to process file
      const { data, error } = await supabase.functions.invoke('analyze-data', {
        body: {
          file_data: base64Data,
          file_name: file.name,
          file_type: file.type
        }
      });

      if (error) throw error;

      setProgress(100);
      setResults(data);
      setStage("complete");
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Upload error:", error);
      setStage("error");
      toast.error("Failed to process file. Please try again.");
    }
  };

  const handleReset = () => {
    setStage("idle");
    setResults(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        {stage === "idle" && (
          <UploadZone onFileSelect={handleFileUpload} />
        )}
        
        {(stage === "uploading" || stage === "processing") && (
          <ProcessingStatus stage={stage} progress={progress} />
        )}
        
        {stage === "complete" && results && (
          <ResultsDashboard results={results} onReset={handleReset} />
        )}
        
        {stage === "error" && (
          <div className="text-center">
            <p className="text-destructive mb-4">An error occurred during processing</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
