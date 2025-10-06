import { Loader2, Database, FileSearch, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ProcessingStage } from "@/pages/Index";

interface ProcessingStatusProps {
  stage: ProcessingStage;
  progress: number;
}

export const ProcessingStatus = ({ stage, progress }: ProcessingStatusProps) => {
  const stages = [
    { id: "uploading", label: "Uploading File", icon: FileSearch },
    { id: "processing", label: "Processing Data", icon: Database },
    { id: "analyzing", label: "Generating Insights", icon: BarChart3 },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl p-8 border border-border" style={{ boxShadow: 'var(--shadow-medium)' }}>
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
            <Loader2 className="relative w-16 h-16 text-accent animate-spin" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-center text-foreground mb-2">
          {stage === "uploading" ? "Uploading your file..." : "Analyzing your data..."}
        </h3>
        <p className="text-center text-muted-foreground mb-8">
          Please wait while we process your dataset
        </p>
        
        <Progress value={progress} className="mb-8" />
        
        <div className="space-y-4">
          {stages.map((s, index) => {
            const Icon = s.icon;
            const isActive = s.id === stage;
            const isComplete = index < stages.findIndex(st => st.id === stage);
            
            return (
              <div
                key={s.id}
                className={`
                  flex items-center gap-4 p-4 rounded-lg border transition-all
                  ${isActive ? 'bg-accent/10 border-accent' : 'bg-muted/50 border-border'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isComplete ? 'bg-accent text-white' : isActive ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
                {isActive && (
                  <Loader2 className="w-4 h-4 ml-auto text-accent animate-spin" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
