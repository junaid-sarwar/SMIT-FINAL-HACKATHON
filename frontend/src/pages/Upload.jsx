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
  const [familyMemberName, setFamilyMemberName] = useState("Self");
  const [reportDate, setReportDate] = useState("");
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
      console.error("❌ Error fetching files:", err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
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

  const uploadFiles = async (selectedFiles) => {
    if (selectedFiles.length === 0) return;
    setLoading(true);

    try {
      const uploadedFiles = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("familyMemberName", familyMemberName || "Self");
        formData.append("reportDate", reportDate || new Date().toISOString());

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
      setFamilyMemberName("Self");
      setReportDate("");
    } catch (err) {
      console.error("❌ Upload error:", err);
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
      if (res.data.success)
        setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const analyzeFile = async (fileId) => {
    try {
      alert("🤖 Analyzing report with AI... please wait");
      const res = await axios.post(
        `http://localhost:8080/api/files/analyze/${fileId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("✅ AI Analysis complete! Check your Insights page.");
      }
    } catch (err) {
      console.error("❌ AI Analysis error:", err);
      alert("AI analysis failed. Try again later.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Upload Medical Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Add your reports for AI-powered analysis and health tracking
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="glass p-8 mb-8">
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
              Drag and drop your reports here
            </h3>
            <p className="text-muted-foreground mb-4">or</p>

            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Uploading..." : "Browse Files"}
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, JPG, PNG
            </p>
          </div>
        </Card>

        {/* Form: Family Member & Date */}
        <Card className="glass p-6 space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Family Member
            </label>
            <Select
              value={familyMemberName}
              onValueChange={setFamilyMemberName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Family Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Self">Self</SelectItem>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Mother">Mother</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Report Date
            </label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full p-2 rounded-md border border-muted-foreground/30 bg-background text-foreground"
            />
          </div>
        </Card>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Uploaded Reports
            </h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {file.reportName}
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
      </div>
    </main>
  );
}
