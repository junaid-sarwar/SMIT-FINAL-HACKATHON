"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, AlertCircle, Share2, Download } from "lucide-react";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("insights");
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/insights", {
          withCredentials: true,
        });

        if (res.data.success && Array.isArray(res.data.insights)) {
          // 🧠 Clean each insight
          const cleanedInsights = res.data.insights.map((insight) => {
            let cleaned = { ...insight };

            // --- 🧹 CLEAN JSON BLOCK IF PRESENT ---
            if (typeof cleaned.englishSummary === "string" && cleaned.englishSummary.includes("```json")) {
              try {
                const clean = cleaned.englishSummary
                  .replace(/```json\n?/, "")
                  .replace(/```$/, "")
                  .trim();

                const parsed = JSON.parse(clean);
                cleaned = { ...cleaned, ...parsed }; // merge parsed fields (englishSummary, urduSummary, etc.)
              } catch (err) {
                console.warn("Failed to parse englishSummary JSON:", err);
              }
            }

            return cleaned;
          });

          setInsights(cleanedInsights);
        } else {
          setInsights([]);
        }
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading AI Insights...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">AI Health Insights</h1>
        <p className="text-muted-foreground mb-8">
          Personalized summaries generated from your uploaded reports.
        </p>

        {insights.length === 0 ? (
          <p className="text-muted-foreground">No insights available yet. Upload a report to analyze!</p>
        ) : (
          insights.map((insight) => (
            <Card key={insight._id} className="glass p-6 mb-6 space-y-3">
              <h2 className="text-xl font-semibold text-foreground mb-2">{insight.reportName}</h2>

              {/* 🧠 English Summary */}
              <p className="text-sm text-muted-foreground mb-2">
                {insight.englishSummary || "No summary available"}
              </p>

              {/* 🧠 Urdu Summary */}
              {insight.urduSummary && (
                <p className="text-sm text-muted-foreground mb-2" dir="rtl">
                  {insight.urduSummary}
                </p>
              )}

              <div className="mt-4 space-y-2">
                {insight.abnormalValues?.length > 0 && (
                  <>
                    <h3 className="font-semibold text-red-500">⚠️ Abnormal Values</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {insight.abnormalValues.map((val, i) => (
                        <li key={i}>{val}</li>
                      ))}
                    </ul>
                  </>
                )}

                {insight.recommendedFoods?.length > 0 && (
                  <>
                    <h3 className="font-semibold text-green-600">🥗 Recommended Foods</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {insight.recommendedFoods.map((food, i) => (
                        <li key={i}>{food}</li>
                      ))}
                    </ul>
                  </>
                )}

                {insight.foodsToAvoid?.length > 0 && (
                  <>
                    <h3 className="font-semibold text-orange-600">🚫 Foods to Avoid</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {insight.foodsToAvoid.map((food, i) => (
                        <li key={i}>{food}</li>
                      ))}
                    </ul>
                  </>
                )}

                {insight.homeRemedies?.length > 0 && (
                  <>
                    <h3 className="font-semibold text-blue-600">🏡 Home Remedies</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {insight.homeRemedies.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}

                <p className="text-xs text-muted-foreground italic mt-3">
                  {insight.disclaimer}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
