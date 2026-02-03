import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Target, Loader2, AlertCircle, CheckCircle2, Play, RefreshCw } from 'lucide-react';
import Layout from '../components/Layout';
import { API_URL } from '../lib/config';
import { cn, formatDate as utilFormatDate } from '../lib/utils';
import Head from 'next/head';

interface Job {
  id: string;
  created_at: string;
  status: string;
  job_type: string;
  report_payload?: {
    agent: string;
    content: string;
    generated_at: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  charts_payload?: Record<string, any> | null;  // Charter stores charts with dynamic keys
  retirement_payload?: {
    agent: string;
    analysis: string;
    generated_at: string;
  };
  error_message?: string;
}

interface JobListItem {
  id: string;
  created_at: string;
  status: string;
  job_type: string;
}

type TabType = 'overview' | 'charts' | 'retirement';

// Color palette for charts
const COLORS = [
  '#209DD7', // primary
  '#753991', // AI accent
  '#FFB707', // accent
  '#062147', // dark
  '#60A5FA', // light blue
  '#A78BFA', // light purple
  '#FBBF24', // yellow
  '#34D399', // green
  '#F87171', // red
  '#94A3B8', // gray
];

export default function Analysis() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { job_id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [fetchingLatest, setFetchingLatest] = useState(false);

  useEffect(() => {
    const loadJob = async (jobId: string) => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const jobData = await response.json();
          setJob(jobData);
        } else {
          console.error('Failed to fetch job');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadLatestJob = async () => {
      setFetchingLatest(true);
      try {
        const token = await getToken();
        // First, get the list of jobs to find the latest completed one
        const response = await fetch(`${API_URL}/api/jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const jobs: JobListItem[] = data.jobs || [];
          // Find the latest completed job
          const latestCompletedJob = jobs
            .filter(j => j.status === 'completed')
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

          if (latestCompletedJob) {
            // Load the full job details
            await loadJob(latestCompletedJob.id);
            // Update the URL to include the job_id without causing a page reload
            router.replace(`/analysis?job_id=${latestCompletedJob.id}`, undefined, { shallow: true });
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching latest job:', error);
        setLoading(false);
      } finally {
        setFetchingLatest(false);
      }
    };

    if (job_id) {
      loadJob(job_id as string);
    } else if (router.isReady) {
      // Router is ready but no job_id provided - fetch the latest analysis
      loadLatestJob();
    }
  }, [job_id, router.isReady, getToken, router]);


  const formatDate = (dateString: string) => {
    return utilFormatDate(dateString);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-12 text-center"
            >
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Analysis</h2>
              <p className="text-gray-600">Please wait while we retrieve your results...</p>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-12 text-center"
            >
              {fetchingLatest ? (
                <>
                  <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Latest Analysis</h2>
                  <p className="text-gray-600">Please wait while we load your latest analysis.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Available</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    You haven&apos;t completed any analyses yet. Start a new analysis with our AI advisor team to see detailed insights here.
                  </p>
                  <button
                    onClick={() => router.push('/advisor-team')}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start New Analysis
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (job.status === 'running' || job.status === 'pending') {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
                <Loader2 className="w-10 h-10 text-secondary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis In Progress</h2>
              <p className="text-gray-600 mb-8">Your analysis is still being processed. This usually takes 1-2 minutes.</p>
              <div className="flex justify-center items-center space-x-2 mb-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-secondary to-primary rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary inline-flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Status
              </button>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (job.status === 'failed') {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200 px-8 py-12"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-red-600 mb-2">Analysis Failed</h2>
                  <p className="text-gray-600 mb-4">The analysis encountered an error and could not be completed.</p>
                  {job.error_message && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <p className="text-sm text-red-800 font-mono">{job.error_message}</p>
                    </div>
                  )}
                  <button
                    onClick={() => router.push('/advisor-team')}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Try Another Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }


  // Tab content renderers
  const renderOverview = () => {
    const report = job?.report_payload?.content;
    if (!report) {
      return (
        <div className="text-center py-12 text-gray-500">
          No portfolio report available.
        </div>
      );
    }

    return (
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            h1: ({children}) => <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b-2 border-primary/20 pb-3">{children}</h1>,
            h2: ({children}) => <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-8 flex items-center gap-2"><span className="w-1 h-6 bg-primary rounded"></span>{children}</h2>,
            h3: ({children}) => <h3 className="text-xl font-medium mb-3 text-gray-700 mt-6">{children}</h3>,
            ul: ({children}) => <ul className="list-disc ml-6 mb-6 space-y-2">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal ml-6 mb-6 space-y-2">{children}</ol>,
            li: ({children}) => <li className="text-gray-700 leading-relaxed">{children}</li>,
            p: ({children}) => <p className="mb-5 text-gray-700 leading-relaxed text-base">{children}</p>,
            table: ({children}) => (
              <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200">
                <table className="w-full border-collapse">{children}</table>
              </div>
            ),
            thead: ({children}) => <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">{children}</thead>,
            th: ({children}) => <th className="p-4 text-left font-semibold border-b-2 border-gray-300 text-gray-800">{children}</th>,
            td: ({children}) => <td className="p-4 border-b border-gray-200">{children}</td>,
            strong: ({children}) => <strong className="font-semibold text-gray-900 bg-yellow-50 px-1 rounded">{children}</strong>,
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-secondary pl-6 my-6 py-2 italic text-gray-700 bg-secondary/5 rounded-r-lg">
                {children}
              </blockquote>
            ),
          }}
        >
          {report}
        </ReactMarkdown>
      </div>
    );
  };

  const renderCharts = () => {
    const chartsPayload = job?.charts_payload;
    if (!chartsPayload || Object.keys(chartsPayload).length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No chart data available.
        </div>
      );
    }

    // Helper function to format chart title from key
    const formatTitle = (key: string): string => {
      return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Helper function to determine chart type based on data structure or chart metadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getChartType = (chartData: any): 'pie' | 'donut' | 'bar' | 'horizontalBar' | 'line' => {
      // If the charter agent specifies a type, use it directly if supported
      if (chartData.type) {
        const supportedTypes = ['pie', 'donut', 'bar', 'horizontalBar', 'line'];
        if (supportedTypes.includes(chartData.type)) {
          return chartData.type;
        }
        // Map variations to supported types
        const typeMap: Record<string, 'pie' | 'donut' | 'bar' | 'horizontalBar' | 'line'> = {
          'column': 'bar',
          'area': 'line'
        };
        if (typeMap[chartData.type]) {
          return typeMap[chartData.type];
        }
      }

      // Otherwise, make an intelligent guess based on the data
      // If data has dates/time series, use line chart
      if (chartData.data?.[0]?.date || chartData.data?.[0]?.year) return 'line';

      // If data represents parts of a whole (has percentages or small dataset), use pie
      if (chartData.data?.length <= 10 && chartData.data?.[0]?.value) return 'pie';

      // Default to bar chart for other cases
      return 'bar';
    };

    // Dynamically render all charts provided by the charter agent
    const chartEntries = Object.entries(chartsPayload);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {chartEntries.map(([key, chartData]: [string, any], index) => {
          // Skip if no data
          if (!chartData?.data || chartData.data.length === 0) return null;

          const chartType = getChartType(chartData);
          const title = chartData.title || formatTitle(key);

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {title}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'pie' || chartType === 'donut' ? (
                  <PieChart>
                    <Pie
                      data={chartData.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label
                      outerRadius={100}
                      innerRadius={chartType === 'donut' ? 60 : 0}  // Donut has inner radius
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {chartData.data.map((entry: any, idx: number) => (
                        <Cell key={`cell-${idx}`} fill={entry.color || COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('en-US')}`} />
                  </PieChart>
                ) : chartType === 'horizontalBar' ? (
                  // For horizontal bars, just use regular vertical bars with rotated labels
                  // Recharts horizontal layout can be problematic
                  <BarChart
                    data={chartData.data}
                    margin={{ left: 10, right: 30, top: 5, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={60}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('en-US')}`} />
                    <Bar dataKey="value">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {chartData.data?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={chartData.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('en-US')}`} />
                    <Bar dataKey="value" fill={chartData.color || COLORS[0]} />
                  </BarChart>
                ) : (
                  // Line chart for time series data
                  <LineChart data={chartData.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={chartData.xKey || "year"} />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString('en-US')}`} />
                    <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} />
                  </LineChart>
                )}
              </ResponsiveContainer>

              {/* Add legend for pie/donut charts with many items */}
              {(chartType === 'pie' || chartType === 'donut') && chartData.data.length > 6 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {chartData.data.map((entry: any, idx: number) => (
                    <div key={entry.name} className="flex items-center text-sm">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color || COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderRetirement = () => {
    const retirement = job?.retirement_payload;
    if (!retirement) {
      return (
        <div className="text-center py-12 text-gray-500">
          No retirement projection available.
        </div>
      );
    }

    // Backend provides 'analysis' as markdown text
    const retirementAnalysis = retirement.analysis;

    return (
      <div className="space-y-8">
        {/* Analysis Section */}
        {retirementAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/20 rounded-xl p-8 shadow-md"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Retirement Analysis</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h2: ({children}) => <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-6">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-medium mb-3 text-gray-700 mt-4">{children}</h3>,
                  p: ({children}) => <p className="text-gray-700 leading-relaxed mb-5">{children}</p>,
                  strong: ({children}) => <strong className="font-semibold text-gray-900 bg-yellow-50 px-1 rounded">{children}</strong>,
                  ul: ({children}) => <ul className="list-disc ml-6 mt-3 space-y-2">{children}</ul>,
                  li: ({children}) => <li className="text-gray-700 leading-relaxed">{children}</li>,
                }}
              >
                {retirementAnalysis}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Analysis - Alex AI Financial Advisor</title>
      </Head>
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl px-8 py-8 mb-8 text-white"
          >
            <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Analysis Complete
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Portfolio Analysis Results</h1>
                <p className="text-white/90 text-sm">
                  Generated on {formatDate(job.created_at)}
                </p>
              </div>
              <button
                onClick={() => router.push('/advisor-team')}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl hover:bg-white/90 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                New Analysis
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-8"
          >
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px p-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    "flex items-center gap-2 py-3 px-6 border-b-2 font-medium text-sm transition-all rounded-t-lg",
                    activeTab === 'overview'
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <FileText className="w-4 h-4" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={cn(
                    "flex items-center gap-2 py-3 px-6 border-b-2 font-medium text-sm transition-all rounded-t-lg",
                    activeTab === 'charts'
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <TrendingUp className="w-4 h-4" />
                  Charts
                </button>
                <button
                  onClick={() => setActiveTab('retirement')}
                  className={cn(
                    "flex items-center gap-2 py-3 px-6 border-b-2 font-medium text-sm transition-all rounded-t-lg",
                    activeTab === 'retirement'
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Target className="w-4 h-4" />
                  Retirement Projection
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-8"
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'charts' && renderCharts()}
            {activeTab === 'retirement' && renderRetirement()}
          </motion.div>
        </div>
      </div>
      </Layout>
    </>
  );
}