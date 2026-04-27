"use client"

import { PageLayout } from "@/components/page-layout"
import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, Loader2, CheckCircle, AlertCircle, Download, FileJson } from "lucide-react"

export default function RecommendationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [fullData, setFullData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleRunOCR = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await fetch("/api/predict", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Check Groq Key 1 or Model Name");

      // scanned_items is already a string[] — no JSON.parse needed
      const scannedItems: string[] = Array.isArray(data.scanned_items) ? data.scanned_items : [];
      setItems(scannedItems);
      setFullData({ ...data });
    } catch (err: any) {
      setError(err.message);
    } finally {
    setIsAnalyzing(false);
    }
  };

  const downloadJson = () => {
    if (!fullData) return;
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ocr-test-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout>
      {() => (
        <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              <FileJson className="text-primary" /> OCR Testing Lab
            </h1>
            <p className="text-sm text-muted-foreground">Accuracy testing via GROQ_API_KEY_1</p>
          </div>

          <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors h-48">
            {preview ? (
              <Image src={preview} alt="Test Image" width={150} height={150} className="rounded-lg object-contain h-full" />
            ) : (
              <div className="text-center">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Select Menu Photo</p>
              </div>
            )}
            <input type="file" ref={fileRef} hidden onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setItems([]); }
            }} />
          </div>

          <button onClick={handleRunOCR} disabled={!file || isAnalyzing} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50">
            {isAnalyzing ? <Loader2 className="animate-spin mx-auto" /> : "RUN OCR EXTRACTION"}
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-xs font-mono overflow-auto max-h-32 border border-red-200">
              <AlertCircle className="w-4 h-4 inline mr-2" /> {error}
            </div>
          )}

          {items.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Detected ({items.length})</h3>
                <button onClick={downloadJson} className="text-xs flex items-center gap-1 bg-accent px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                  <Download className="w-3.5 h-3.5" /> Download JSON
                </button>
              </div>
              <div className="bg-card border rounded-xl divide-y text-sm">
                {items.map((item, i) => (
                  <div key={i} className="p-3 flex items-center gap-3">
                    <span className="text-primary font-mono text-xs">{i+1}</span> {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  )
}