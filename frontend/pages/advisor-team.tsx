import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import Layout from '../components/Layout';
import { API_URL } from '../lib/config';
import { emitAnalysisCompleted, emitAnalysisFailed, emitAnalysisStarted } from '../lib/events';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Target, PieChart, LineChart, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface Agent {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  role: string;
  description: string;
  gradient: string;
  lightBg: string;
}

interface Job {
  id: string;
  created_at: string;
  status: string;
  job_type: string;
}

interface AnalysisProgress {
  stage: 'idle' | 'starting' | 'planner' | 'parallel' | 'completing' | 'complete' | 'error';
  message: string;
  activeAgents: string[];
  error?: string;
}

const agents: Agent[] = [
  {
    icon: Target,
    name: 'Financial Planner',
    role: 'Orchestrator',
    description: 'Coordinates your financial analysis with intelligent orchestration across all agents',
    gradient: 'from-secondary to-secondary-light',
    lightBg: 'bg-secondary/10'
  },
  {
    icon: PieChart,
    name: 'Portfolio Analyst',
    role: 'Reporter',
    description: 'Analyzes your holdings, performance metrics, and provides comprehensive insights',
    gradient: 'from-primary to-primary-light',
    lightBg: 'bg-primary/10'
  },
  {
    icon: LineChart,
    name: 'Chart Specialist',
    role: 'Charter',
    description: 'Creates interactive visualizations of your portfolio composition and trends',
    gradient: 'from-success to-green-500',
    lightBg: 'bg-success/10'
  },
  {
    icon: TrendingUp,
    name: 'Retirement Planner',
    role: 'Retirement',
    description: 'Projects your retirement readiness with Monte Carlo simulations and forecasts',
    gradient: 'from-accent to-accent-light',
    lightBg: 'bg-accent/10'
  }
];

export default function AdvisorTeam() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    stage: 'idle',
    message: '',
    activeAgents: []
  });
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkJobStatusLocal = async (jobId: string) => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const job = await response.json();

          if (job.status === 'completed') {
            setProgress({
              stage: 'complete',
              message: 'Analysis complete!',
              activeAgents: []
            });

            if (pollInterval) {
              clearInterval(pollInterval);
              setPollInterval(null);
            }

            // Emit completion event so other components can refresh
            emitAnalysisCompleted(jobId);

            // Also refresh our own jobs list
            fetchJobs();

            setTimeout(() => {
              router.push(`/analysis?job_id=${jobId}`);
            }, 1500);
          } else if (job.status === 'failed') {
            setProgress({
              stage: 'error',
              message: 'Analysis failed',
              activeAgents: [],
              error: job.error || 'Analysis encountered an error'
            });

            if (pollInterval) {
              clearInterval(pollInterval);
              setPollInterval(null);
            }

            // Emit failure event
            emitAnalysisFailed(jobId, job.error);

            setIsAnalyzing(false);
            setCurrentJobId(null);
          }
        }
      } catch (error) {
        console.error('Error checking job status:', error);
      }
    };

    if (currentJobId && !pollInterval) {
      const interval = setInterval(() => {
        checkJobStatusLocal(currentJobId);
      }, 2000);
      setPollInterval(interval);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJobId, pollInterval, router]);

  const fetchJobs = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress({
      stage: 'starting',
      message: 'Initializing analysis...',
      activeAgents: []
    });

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          analysis_type: 'portfolio',
          options: {}
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentJobId(data.job_id);

        // Emit start event
        emitAnalysisStarted(data.job_id);

        setProgress({
          stage: 'planner',
          message: 'Financial Planner coordinating analysis...',
          activeAgents: ['Financial Planner']
        });

        setTimeout(() => {
          setProgress({
            stage: 'parallel',
            message: 'Agents working in parallel...',
            activeAgents: ['Portfolio Analyst', 'Chart Specialist', 'Retirement Planner']
          });
        }, 5000);
      } else {
        throw new Error('Failed to start analysis');
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      setProgress({
        stage: 'error',
        message: 'Failed to start analysis',
        activeAgents: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setIsAnalyzing(false);
      setCurrentJobId(null);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-500';
      case 'running':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  const isAgentActive = (agentName: string) => {
    return progress.activeAgents.includes(agentName);
  };

  return (
    <>
      <Head>
        <title>Advisor Team - Alex AI Financial Advisor</title>
      </Head>
      <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-8 py-6 mb-8">
            <h1 className="text-3xl font-bold text-dark mb-2">Your AI Advisory Team</h1>
            <p className="text-gray-600">
              Meet your team of specialized AI agents that work together to provide comprehensive financial analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {agents.map((agent, index) => {
              const isActive = isAgentActive(agent.name);
              const Icon = agent.icon;
              
              return (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative overflow-hidden bg-white rounded-2xl shadow-lg p-6 transition-all duration-300",
                    isActive && "ring-2 ring-secondary shadow-2xl animate-glow-pulse"
                  )}
                >
                  {isActive && (
                    <motion.div
                      className={cn("absolute inset-0 bg-gradient-to-br", agent.gradient, "opacity-10")}
                      animate={{ opacity: [0.05, 0.15, 0.05] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <div className="relative">
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                      agent.gradient
                    )}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1 text-gray-900">
                      {agent.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mb-3">{agent.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{agent.description}</p>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r",
                          agent.gradient
                        )}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          ●
                        </motion.span>
                        Active
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg px-8 py-8 border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Center</h2>
              <p className="text-gray-600">Start a comprehensive portfolio analysis</p>
            </div>
            <button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all",
                isAnalyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-secondary to-secondary-light hover:shadow-2xl hover:scale-105'
              )}
            >
              <Play className="w-5 h-5" />
              {isAnalyzing ? 'Analysis in Progress...' : 'Start New Analysis'}
            </button>
          </div>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-8 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl border-2 border-secondary/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Analysis in Progress</h3>
                  {progress.stage !== 'error' && progress.stage !== 'complete' && (
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i}
                          className="w-3 h-3 bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse-soft" 
                          style={{ animationDelay: `${i * 0.3}s` }} 
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className={cn(
                  "text-lg mb-6 font-medium",
                  progress.stage === 'error' ? 'text-red-600' : 'text-gray-700'
                )}>
                  {progress.message}
                </p>

                {progress.stage === 'error' && progress.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{progress.error}</p>
                    <button
                      onClick={() => {
                        setIsAnalyzing(false);
                        setCurrentJobId(null);
                        setProgress({ stage: 'idle', message: '', activeAgents: [] });
                      }}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {progress.stage !== 'idle' && progress.stage !== 'error' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-ai-accent h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: progress.stage === 'starting' ? '10%' :
                               progress.stage === 'planner' ? '30%' :
                               progress.stage === 'parallel' ? '70%' :
                               progress.stage === 'completing' ? '90%' :
                               '100%'
                      }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

            <div>
              <h3 className="text-lg font-semibold text-dark mb-4">Previous Analyses</h3>
              {jobs.length === 0 ? (
                <p className="text-gray-500 italic">No previous analyses found. Start your first analysis above!</p>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Analysis #{job.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(job.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        {job.status === 'completed' && (
                          <button
                            onClick={() => router.push(`/analysis?job_id=${job.id}`)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </motion.div>
        </div>
      </div>
      </Layout>
    </>
  );
}