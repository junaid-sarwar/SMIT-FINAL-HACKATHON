import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Brain,
  Heart,
  Loader2,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [latestFile, setLatestFile] = useState(null);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalInsights: 0,
    lastVitalsEntry: null,
  });
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🧭 Fetch user info
        const userRes = await axios.get("http://localhost:8080/api/user/me", {
          withCredentials: true,
        });
        setUserName(userRes.data.user?.fullName || "User");

        // ⚡ Parallel fetch for files, insights & vitals
        const [filesRes, insightsRes, vitalsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/files/all", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8080/api/insights", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8080/api/vitals/latest", {
            withCredentials: true,
          }),
        ]);

        const files = filesRes.data.files || [];
        const insights = insightsRes.data.insights || [];
        const vitals = vitalsRes.data.vitals || null;

        // 📊 Dashboard stats
        setStats({
          totalFiles: files.length,
          totalInsights: insights.length,
          lastVitalsEntry: vitals
            ? `${vitals.bp || "N/A"} BP • ${vitals.sugar || "N/A"} sugar`
            : "No data",
        });

        // 🗂️ Latest file
        if (files.length > 0) {
          const latest = files[0];
          setLatestFile({
            id: latest._id,
            name: latest.reportName || "Untitled Report",
            type: latest.fileType === "pdf" ? "PDF Report" : "Image Report",
            uploadedAt: new Date(latest.date).toLocaleDateString(),
          });
        }

        // 🕒 Recent files (limit 3)
        setRecentFiles(
          files.slice(0, 3).map((f) => ({
            id: f._id,
            name: f.reportName || "Untitled Report",
            type: f.fileType === "pdf" ? "PDF" : "Image",
            date: new Date(f.date).toLocaleDateString(),
            status: f.status || "processed",
          }))
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here’s your health overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-3xl font-bold text-primary mt-2">
                  {stats.totalFiles}
                </p>
              </div>
              <FileText className="w-12 h-12 text-primary/20" />
            </div>
          </Card>

          <Card className="glass p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Insights</p>
                <p className="text-3xl font-bold text-secondary mt-2">
                  {stats.totalInsights}
                </p>
              </div>
              <Brain className="w-12 h-12 text-secondary/20" />
            </div>
          </Card>

          <Card className="glass p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Vitals</p>
                <p className="text-lg font-semibold text-accent mt-2">
                  {stats.lastVitalsEntry}
                </p>
              </div>
              <Heart className="w-12 h-12 text-accent/20" />
            </div>
          </Card>
        </div>

        {/* Latest File */}
        {loading ? (
          <Card className="glass p-8 flex items-center justify-center mb-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </Card>
        ) : latestFile ? (
          <Card className="glass p-6 mb-8 transition-all hover:shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Latest Upload
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{latestFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {latestFile.type} • {latestFile.uploadedAt}
                </p>
              </div>
              <Link to="/insights">
                <Button className="bg-primary hover:bg-primary/90">
                  View Analysis
                </Button>
              </Link>
            </div>
          </Card>
        ) : null}

        {/* Recent Files */}
        <Card className="glass p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Files
            </h2>
            <Link to="/upload">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {recentFiles.length > 0 ? (
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {file.date}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        file.status
                      )}`}
                    >
                      {file.status.charAt(0).toUpperCase() +
                        file.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No files uploaded yet
            </p>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="glass p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Upload New Report
                </h2>
                <p className="text-muted-foreground">
                  Add your medical reports for AI analysis
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary/40" />
            </div>
            <Link to="/upload" className="mt-4 inline-block">
              <Button className="bg-primary hover:bg-primary/90">
                Upload Report
              </Button>
            </Link>
          </Card>

          <Card className="glass p-8 bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/20 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Track Your Vitals
                </h2>
                <p className="text-muted-foreground">
                  Monitor your health metrics over time
                </p>
              </div>
              <Heart className="w-8 h-8 text-accent/40" />
            </div>
            <Link to="/vitals" className="mt-4 inline-block">
              <Button className="bg-accent hover:bg-accent/90">
                View Vitals
              </Button>
            </Link>
          </Card>
        </div>

        {/* Insights Summary */}
        <Card className="glass p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-secondary" />
              <h2 className="text-lg font-semibold text-foreground">
                AI Insights Summary
              </h2>
            </div>
            <Link to="/insights">
              <Button variant="outline" size="sm">
                View All Insights
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <p className="font-medium text-foreground">Health Trend</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Your health metrics are improving steadily.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-secondary" />
                <p className="font-medium text-foreground">Next Checkup</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Recommended in 30 days.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
