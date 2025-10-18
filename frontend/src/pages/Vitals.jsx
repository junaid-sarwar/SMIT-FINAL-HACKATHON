"use client"

import { useState } from "react"
import { Navbar } from "../components/shared/Navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Heart, Thermometer, Droplet, Weight } from "lucide-react"

export default function VitalsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [vitals, setVitals] = useState({
    heartRate: "",
    bloodPressureSys: "",
    bloodPressureDia: "",
    temperature: "",
    weight: "",
  })

  const chartData = [
    { date: "Mon", heartRate: 72, systolic: 120, diastolic: 80, weight: 75 },
    { date: "Tue", heartRate: 75, systolic: 122, diastolic: 82, weight: 75.2 },
    { date: "Wed", heartRate: 70, systolic: 118, diastolic: 78, weight: 75 },
    { date: "Thu", heartRate: 78, systolic: 125, diastolic: 85, weight: 75.5 },
    { date: "Fri", heartRate: 72, systolic: 120, diastolic: 80, weight: 75.3 },
    { date: "Sat", heartRate: 68, systolic: 115, diastolic: 75, weight: 75.1 },
    { date: "Sun", heartRate: 70, systolic: 118, diastolic: 78, weight: 75 },
  ]

  const vitalHistory = [
    { id: 1, date: "Today", time: "10:30 AM", heartRate: 70, bp: "118/78", temp: "98.6°F", weight: "75 kg" },
    { id: 2, date: "Yesterday", time: "09:15 AM", heartRate: 68, bp: "115/75", temp: "98.4°F", weight: "75.1 kg" },
    { id: 3, date: "2 days ago", time: "08:45 AM", heartRate: 72, bp: "120/80", temp: "98.7°F", weight: "75.3 kg" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setVitals({ ...vitals, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Vitals submitted:", vitals)
    alert("Vitals logged successfully!")
    setVitals({
      heartRate: "",
      bloodPressureSys: "",
      bloodPressureDia: "",
      temperature: "",
      weight: "",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Health Vitals</h1>
          <p className="text-muted-foreground mt-2">Track and monitor your vital signs</p>
        </div>

        {/* Latest Vitals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
                <p className="text-3xl font-bold text-primary mt-2">70</p>
                <p className="text-xs text-muted-foreground mt-1">bpm</p>
              </div>
              <Heart className="w-10 h-10 text-primary/20" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Pressure</p>
                <p className="text-3xl font-bold text-secondary mt-2">118/78</p>
                <p className="text-xs text-muted-foreground mt-1">mmHg</p>
              </div>
              <Droplet className="w-10 h-10 text-secondary/20" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-3xl font-bold text-accent mt-2">98.6</p>
                <p className="text-xs text-muted-foreground mt-1">°F</p>
              </div>
              <Thermometer className="w-10 h-10 text-accent/20" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-3xl font-bold text-primary mt-2">75</p>
                <p className="text-xs text-muted-foreground mt-1">kg</p>
              </div>
              <Weight className="w-10 h-10 text-primary/20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="glass p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Trends</TabsTrigger>
              <TabsTrigger value="log">Log Entry</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Heart Rate Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="heartRate" stroke="#8b5cf6" name="Heart Rate (bpm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Blood Pressure Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="systolic" stroke="#3b82f6" name="Systolic (mmHg)" />
                      <Line type="monotone" dataKey="diastolic" stroke="#06b6d4" name="Diastolic (mmHg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="log" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Heart Rate (bpm)</label>
                  <Input
                    type="number"
                    name="heartRate"
                    value={vitals.heartRate}
                    onChange={handleInputChange}
                    placeholder="e.g., 72"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Systolic (mmHg)</label>
                    <Input
                      type="number"
                      name="bloodPressureSys"
                      value={vitals.bloodPressureSys}
                      onChange={handleInputChange}
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Diastolic (mmHg)</label>
                    <Input
                      type="number"
                      name="bloodPressureDia"
                      value={vitals.bloodPressureDia}
                      onChange={handleInputChange}
                      placeholder="e.g., 80"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Temperature (°F)</label>
                  <Input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={vitals.temperature}
                    onChange={handleInputChange}
                    placeholder="e.g., 98.6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={vitals.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 75"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Log Vitals
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="space-y-3">
                {vitalHistory.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{entry.date}</p>
                        <p className="text-sm text-muted-foreground">{entry.time}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Heart Rate</p>
                        <p className="font-medium text-foreground">{entry.heartRate} bpm</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Blood Pressure</p>
                        <p className="font-medium text-foreground">{entry.bp}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Temperature</p>
                        <p className="font-medium text-foreground">{entry.temp}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium text-foreground">{entry.weight}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}
