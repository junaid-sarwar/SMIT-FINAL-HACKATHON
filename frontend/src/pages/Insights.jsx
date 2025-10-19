"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Brain, FileText, Stethoscope } from "lucide-react";

export default function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/insights", {
          withCredentials: true,
        });

        if (res.data.success && Array.isArray(res.data.insights)) {
          const cleaned = res.data.insights.map((item) => {
            let insight = { ...item };

            // 🧹 Clean markdown JSON block (from Gemini or GPT responses)
            if (
              typeof insight.englishSummary === "string" &&
              insight.englishSummary.includes("```json")
            ) {
              try {
                const clean = insight.englishSummary
                  .replace(/```json\n?/, "")
                  .replace(/```$/, "")
                  .trim();
                const parsed = JSON.parse(clean);
                insight = { ...insight, ...parsed };
              } catch {
                // ignore parsing errors silently
              }
            }
            return insight;
          });

          setInsights(cleaned);
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
        Fetching your AI insights...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
            HealthMate AI Insights 🧠
          </h1>
          <p className="text-muted-foreground">
            Deep analysis and personalized recommendations from your uploaded health reports.
          </p>
        </div>

        {/* No Data State */}
        {insights.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No AI insights yet. Upload a health report to get analyzed.
          </p>
        ) : (
          insights.map((insight) => (
            <Card
              key={insight._id}
              className="p-6 mb-8 rounded-2xl shadow-sm bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-indigo-100 dark:border-slate-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  {insight.file?.reportName || "Health Report"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(insight.file?.date || insight.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* --- English Summary --- */}
              <div className="mb-4">
                <h3 className="font-semibold text-indigo-600 flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4" /> AI Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.englishSummary || "No summary available."}
                </p>
              </div>

              {/* --- Urdu Summary --- */}
              {insight.urduSummary && (
                <div className="mb-4" dir="rtl">
                  <h3 className="font-semibold text-pink-600 mb-1">اردو خلاصہ</h3>
                  <p className="text-sm text-muted-foreground">{insight.urduSummary}</p>
                </div>
              )}

              {/* --- Doctor Questions --- */}
              {insight.doctorQuestions?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-600 flex items-center gap-2 mb-1">
                    <Stethoscope className="w-4 h-4" /> Suggested Doctor Questions
                  </h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {insight.doctorQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* --- Food Suggestions --- */}
              {insight.foodSuggestions?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-green-600 mb-1">🥗 Recommended Foods</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {insight.foodSuggestions.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* --- Home Remedies --- */}
              {insight.homeRemedies?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-amber-600 mb-1">🏡 Home Remedies</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {insight.homeRemedies.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* --- Disclaimer --- */}
              <p className="text-xs text-muted-foreground italic mt-2">
                {insight.disclaimer ||
                  "Note: This AI-generated insight is for informational purposes only and not a substitute for professional medical advice."}
              </p>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
