import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Brain, TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ Use absolute backend URL
    const baseURL = "http://localhost:8080";
    const url = showLogin
      ? `${baseURL}/api/user/login`
      : `${baseURL}/api/user/register`;

    const body = showLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Request Error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Heart, title: "Health Monitoring", description: "Track your vital signs and health metrics in real-time with our advanced monitoring system." },
    { icon: Brain, title: "AI-Powered Insights", description: "Get personalized health recommendations powered by advanced AI." },
    { icon: TrendingUp, title: "Progress Tracking", description: "Monitor your health journey with detailed analytics and trend visualization." },
    { icon: Shield, title: "Secure & Private", description: "Your health data is encrypted and protected with enterprise-grade security." },
    { icon: Zap, title: "Instant Analysis", description: "Upload medical reports and get instant AI analysis within seconds." },
    { icon: BarChart3, title: "Detailed Reports", description: "Generate comprehensive health reports for your healthcare provider." },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "50M+", label: "Data Points Analyzed" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HealthMate AI</span>
          </div>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white"
              onClick={() => setShowLogin(true)}
            >
              Login
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              onClick={() => setShowLogin(false)}
            >
              Signup
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Personal
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {" "}Health AI
            </span>
            <br />
            Assistant
          </h1>

          {/* Login / Signup Form */}
          <div className="max-w-md mx-auto bg-slate-800/50 p-8 rounded-xl border border-purple-500/30 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">{showLogin ? "Login" : "Signup"}</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!showLogin && (
                <>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="p-3 rounded-lg bg-slate-900 border border-purple-500 text-white"
                    required
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="p-3 rounded-lg bg-slate-900 border border-purple-500 text-white"
                    required
                  />
                </>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 rounded-lg bg-slate-900 border border-purple-500 text-white"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="p-3 rounded-lg bg-slate-900 border border-purple-500 text-white"
                required
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3"
                disabled={loading}
              >
                {loading ? "Please wait..." : showLogin ? "Login" : "Signup"}
              </Button>
            </form>
            <p className="mt-4 text-gray-400 text-sm">
              {showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-purple-400 cursor-pointer"
                onClick={() => setShowLogin(!showLogin)}
              >
                {showLogin ? "Signup" : "Login"}
              </span>
            </p>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 p-8 group hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
