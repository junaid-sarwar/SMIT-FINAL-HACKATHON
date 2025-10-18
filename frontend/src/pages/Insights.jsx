"use client"

import { useState } from "react"
import { Navbar } from "@/components/shared/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, AlertCircle, Share2, Download } from "lucide-react"

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("insights")

  const insights = [
    {
      id: 1,
      title: "Elevated Blood Pressure",
      description: "Your recent readings show elevated blood pressure levels",
      priority: "high",
      icon: AlertCircle,
    },
    {
      id: 2,
      title: "Cholesterol Levels",
      description: "LDL cholesterol is slightly above normal range",
      priority: "medium",
      icon: TrendingUp,
    },
    {
      id: 3,
      title: "Positive Health Trend",
      description: "Overall health metrics show improvement over the past month",
      priority: "low",
      icon: TrendingUp,
    },
  ]

  const recommendations = [
    {
      id: 1,
      title: "Increase Physical Activity",
      priority: "high",
      description: "Aim for 30 minutes of moderate exercise daily",
    },
    { id: 2, title: "Dietary Changes", priority: "high", description: "Reduce sodium and saturated fat intake" },
    { id: 3, title: "Regular Monitoring", priority: "medium", description: "Check blood pressure weekly" },
    { id: 4, title: "Stress Management", priority: "medium", description: "Practice meditation or yoga" },
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">AI Health Insights</h1>
          <p className="text-muted-foreground mt-2">Personalized analysis of your medical reports</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Insights</p>
                <p className="text-3xl font-bold text-primary mt-2">{insights.length}</p>
              </div>
              <Brain className="w-12 h-12 text-primary/20" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold text-red-500 mt-2">
                  {insights.filter((i) => i.priority === "high").length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-500/20" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recommendations</p>
                <p className="text-3xl font-bold text-secondary mt-2">{recommendations.length}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-secondary/20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="glass p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-4 mt-6">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{insight.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                          {insight.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4 mt-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{rec.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4 mt-6">
              <div className="p-6 rounded-lg bg-muted/50">
                <h3 className="font-semibold text-foreground mb-4">Health Metrics Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Blood Pressure</span>
                    <span className="font-medium text-foreground">140/90 mmHg (Elevated)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cholesterol</span>
                    <span className="font-medium text-foreground">220 mg/dL (High)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Blood Sugar</span>
                    <span className="font-medium text-foreground">105 mg/dL (Normal)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">BMI</span>
                    <span className="font-medium text-foreground">26.5 (Overweight)</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
