import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone = ({ onFileSelect }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    return validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center
          transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-accent bg-accent/10 scale-105' 
            : 'border-border bg-card hover:border-accent/50 hover:bg-accent/5'
          }
        `}
        style={{ boxShadow: 'var(--shadow-medium)' }}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept=".csv,.xlsx,.xls"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              {isDragging ? (
                <FileSpreadsheet className="w-12 h-12 text-white animate-bounce" />
              ) : (
                <Upload className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {isDragging ? 'Drop your file here' : 'Upload Your Dataset'}
            </h3>
            <p className="text-muted-foreground">
              Drag & drop or click to browse • Supports CSV, Excel (.xlsx, .xls)
            </p>
          </div>
          
          <div className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all">
            Choose File
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-1">Auto Detection</h4>
          <p className="text-sm text-muted-foreground">Encoding, delimiters, and data types</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-1">Smart Cleaning</h4>
          <p className="text-sm text-muted-foreground">Handles missing values and duplicates</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-1">Instant Insights</h4>
          <p className="text-sm text-muted-foreground">EDA, ERD, and dashboard generation</p>
        </div>
      </div>
    </div>
  );
};
