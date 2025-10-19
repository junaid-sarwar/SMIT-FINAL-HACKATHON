"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, X } from "lucide-react";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [reportType, setReportType] = useState("");
  const [notes, setNotes] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/files/all", {
        withCredentials: true,
      });
      if (res.data.success) setFiles(res.data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    uploadFiles(droppedFiles);
  };

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    uploadFiles(selectedFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFiles = async (selectedFiles) => {
    if (selectedFiles.length === 0) return;
    setLoading(true);

    try {
      const uploadedFiles = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("reportType", reportType || "general");
        formData.append("notes", notes);

        const res = await axios.post(
          "http://localhost:8080/api/files/upload",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (res.data.success) uploadedFiles.push(res.data.file);
      }

      setFiles((prev) => [...uploadedFiles, ...prev]);
      setReportType("");
      setNotes("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to upload file. Check console for details.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await axios.delete(`http://localhost:8080/api/files/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setFiles((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const analyzeFile = async (fileId) => {
    try {
      alert("Analyzing report with AI... please wait ⏳");
      const res = await axios.post(
        `http://localhost:8080/api/files/analyze/${fileId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("✅ AI Analysis complete! Check your Insights page.");
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
      alert("❌ AI analysis failed. Try again later.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reports uploaded successfully!");
    setReportType("");
    setNotes("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Upload Medical Report
          </h1>
          <p className="text-muted-foreground mt-2">
            Add your medical reports for AI analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Zone */}
          <Card className="glass p-8">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30"
              }`}
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Drag and drop your files here
              </h3>
              <p className="text-muted-foreground mb-4">or</p>

              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Button
                type="button"
                onClick={handleBrowseClick}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Uploading..." : "Browse Files"}
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Supported formats: PDF, JPG, PNG, DOC, DOCX
              </p>
            </div>
          </Card>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Uploaded Files
              </h3>
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file._id || file.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {file.reportName || file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(file.createdAt).toLocaleDateString()} —{" "}
                          {file.fileType?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => analyzeFile(file._id)}
                      >
                        Analyze
                      </Button>
                      <button
                        type="button"
                        onClick={() => removeFile(file._id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Report Type */}
          <Card className="glass p-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Report Type
            </label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blood-test">Blood Test</SelectItem>
                <SelectItem value="imaging">Imaging (X-Ray, CT, MRI)</SelectItem>
                <SelectItem value="cardiac">Cardiac Report</SelectItem>
                <SelectItem value="pathology">Pathology Report</SelectItem>
                <SelectItem value="general">General Checkup</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Notes */}
          <Card className="glass p-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information about your report..."
              className="min-h-24"
            />
          </Card>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Submit Report
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
