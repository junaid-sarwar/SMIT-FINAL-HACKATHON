"use client"

import { useState, useEffect } from "react"
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
  const [latestVitals, setLatestVitals] = useState({})
  const [vitalHistory, setVitalHistory] = useState([])
  const [chartData, setChartData] = useState([])

  const token = localStorage.getItem("token")

  // Fetch latest vitals for summary
  const fetchLatestVitals = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/vitals/latest", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setLatestVitals(data.vitals || {})
    } catch (err) {
      console.error("Failed to fetch latest vitals:", err)
    }
  }

  // Fetch vitals history
  const fetchVitalsHistory = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/vitals/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setVitalHistory(data.history || [])

        // Prepare chart data (last 7 records)
        const chart = data.history
          .slice(0, 7)
          .map((v) => ({
            date: new Date(v.createdAt).toLocaleDateString("en-US", { weekday: "short" }),
            heartRate: v.notes?.match(/HeartRate: (\d+)/)?.[1] || 0,
            systolic: v.bp?.split("/")[0] || 0,
            diastolic: v.bp?.split("/")[1] || 0,
            weight: v.weight || 0,
          }))
          .reverse()
        setChartData(chart)
      }
    } catch (err) {
      console.error("Failed to fetch vitals history:", err)
    }
  }

  useEffect(() => {
    fetchLatestVitals()
    fetchVitalsHistory()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setVitals({ ...vitals, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Construct payload to match backend schema
    const payload = {
      bp: vitals.bloodPressureSys && vitals.bloodPressureDia
        ? `${vitals.bloodPressureSys}/${vitals.bloodPressureDia}`
        : "",
      weight: vitals.weight || "",
      notes: `HeartRate: ${vitals.heartRate || "--"}, Temp: ${vitals.temperature || "--"}`,
      sugar: "", // optional
    }

    try {

      // Get token from cookie
const token = document.cookie
  .split("; ")
  .find(row => row.startsWith("token="))
  ?.split("=")[1];


      const res = await fetch("http://localhost:8080/api/vitals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        alert("Vitals logged successfully!")
        setVitals({ heartRate: "", bloodPressureSys: "", bloodPressureDia: "", temperature: "", weight: "" })
        fetchLatestVitals()
        fetchVitalsHistory()
      } else {
        alert(data.message || "Failed to log vitals")
      }
    } catch (err) {
      console.error("Error submitting vitals:", err)
      alert("Error submitting vitals")
    }
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
                <p className="text-3xl font-bold text-primary mt-2">{latestVitals.notes?.match(/HeartRate: (\d+)/)?.[1] || "--"}</p>
                <p className="text-xs text-muted-foreground mt-1">bpm</p>
              </div>
              <Heart className="w-10 h-10 text-primary/20" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Pressure</p>
                <p className="text-3xl font-bold text-black mt-2">{latestVitals.bp || "--/--"}</p>
                <p className="text-xs text-muted-foreground mt-1">mmHg</p>
              </div>
              <Droplet className="w-10 h-10 text-secondary/20" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-3xl font-bold text-black mt-2">{latestVitals.notes?.match(/Temp: ([\d.]+)/)?.[1] || "--"}</p>
                <p className="text-xs text-muted-foreground mt-1">°F</p>
              </div>
              <Thermometer className="w-10 h-10 text-accent/20" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-3xl font-bold text-primary mt-2">{latestVitals.weight || "--"}</p>
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
                  <Input type="number" name="heartRate" value={vitals.heartRate} onChange={handleInputChange} placeholder="e.g., 72" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Systolic (mmHg)</label>
                    <Input type="number" name="bloodPressureSys" value={vitals.bloodPressureSys} onChange={handleInputChange} placeholder="e.g., 120" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Diastolic (mmHg)</label>
                    <Input type="number" name="bloodPressureDia" value={vitals.bloodPressureDia} onChange={handleInputChange} placeholder="e.g., 80" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Temperature (°F)</label>
                  <Input type="number" step="0.1" name="temperature" value={vitals.temperature} onChange={handleInputChange} placeholder="e.g., 98.6" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                  <Input type="number" step="0.1" name="weight" value={vitals.weight} onChange={handleInputChange} placeholder="e.g., 75" />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Log Vitals</Button>
              </form>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="space-y-3">
                {vitalHistory.map((entry) => (
                  <div key={entry._id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{new Date(entry.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{new Date(entry.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Heart Rate</p>
                        <p className="font-medium text-foreground">{entry.notes?.match(/HeartRate: (\d+)/)?.[1] || "--"} bpm</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Blood Pressure</p>
                        <p className="font-medium text-foreground">{entry.bp || "--/--"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Temperature</p>
                        <p className="font-medium text-foreground">{entry.notes?.match(/Temp: ([\d.]+)/)?.[1] || "--"}°F</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium text-foreground">{entry.weight || "--"} kg</p>
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
