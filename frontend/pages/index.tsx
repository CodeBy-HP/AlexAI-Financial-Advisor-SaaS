import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  PieChart, 
  LineChart, 
  Target,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Alex AI Financial Advisor - Intelligent Portfolio Management</title>
        <meta name="description" content="Experience the power of autonomous AI agents working together to analyze your portfolio, plan your retirement, and optimize your investments." />
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src="/logo.png" 
                alt="Alex AI Logo" 
                className="w-10 h-10 transform group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-xl font-bold text-gray-900">Alex</span>
                <span className="text-xl font-bold text-primary ml-1">AI</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-secondary to-secondary-light text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                    Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-gray-700">Powered by Multi-Agent AI</span>
            </motion.div>
            
            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI-Powered
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Experience the power of autonomous AI agents working together to analyze your portfolio, 
              plan your retirement, and optimize your investments.
            </p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="group px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                    Start Your Analysis
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="group px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                    Open Dashboard
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </SignedIn>
              <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-primary hover:text-primary transition-all">
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { icon: Zap, label: "5 AI Agents", value: "Working in Parallel" },
              { icon: Shield, label: "Bank-Level", value: "Security" },
              { icon: TrendingUp, label: "Real-Time", value: "Analysis" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - AI Advisory Team */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Meet Your AI Advisory Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Five specialized AI agents collaborate in real-time to deliver comprehensive financial insights
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Target, 
                name: "Financial Planner", 
                role: "Orchestrator",
                description: "Coordinates your complete financial analysis with intelligent orchestration",
                color: "from-secondary to-secondary-light",
                iconColor: "text-secondary"
              },
              { 
                icon: PieChart, 
                name: "Portfolio Analyst", 
                role: "Reporter",
                description: "Deep analysis of holdings, performance metrics, and risk assessment",
                color: "from-primary to-primary-light",
                iconColor: "text-primary"
              },
              { 
                icon: LineChart, 
                name: "Chart Specialist", 
                role: "Visualizer",
                description: "Creates interactive visualizations of your portfolio composition",
                color: "from-success to-green-500",
                iconColor: "text-success"
              },
              { 
                icon: TrendingUp, 
                name: "Retirement Planner", 
                role: "Projector",
                description: "Projects your retirement readiness with Monte Carlo simulations",
                color: "from-accent to-accent-light",
                iconColor: "text-accent"
              }
            ].map((agent, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                  <div className={`text-sm font-semibold ${agent.iconColor} mb-3`}>{agent.role}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{agent.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Enterprise-Grade AI Advisory
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional-level financial insights powered by cutting-edge AI technology
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Real-Time Analysis",
                description: "Watch AI agents collaborate in parallel to analyze your complete financial picture in minutes",
                gradient: "from-primary to-primary-light"
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your data is protected with enterprise security, encryption, and row-level access controls",
                gradient: "from-secondary to-secondary-light"
              },
              {
                icon: LineChart,
                title: "Comprehensive Reports",
                description: "Detailed markdown reports with interactive charts, projections, and actionable insights",
                gradient: "from-success to-green-500"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-primary via-primary-light to-secondary text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl sm:text-2xl mb-10 opacity-95 leading-relaxed">
              Join thousands of investors using AI to optimize their portfolios and plan for retirement
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignUpButton mode="modal">
                <button className="group px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                  Get Started Free
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignUpButton>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-primary transition-all">
                Schedule Demo
              </button>
            </div>
            
            {/* Feature highlights */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
              {[
                "No credit card required",
                "5-minute setup",
                "Enterprise-grade security"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src="/logo.png" 
                alt="Alex AI Logo" 
                className="w-8 h-8"
              />
              <span className="text-lg font-bold text-white">Alex AI</span>
            </div>
            <p className="text-sm">© 2025 Alex AI Financial Advisor. All rights reserved.</p>
            <p className="text-xs max-w-2xl mx-auto leading-relaxed">
              This AI-generated advice has not been vetted by a qualified financial advisor and should not be used for trading decisions. 
              For informational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}