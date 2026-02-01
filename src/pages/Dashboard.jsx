import React from 'react';
import { useAppContext } from '../context/AppContext';
import MetricCard from '../components/MetricCard';
import { PieChartCard } from '../components/PieChartCard';
import { BarChartCard } from '../components/BarChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const { jobs, candidates, loading } = useAppContext();

  const openPositions = jobs.filter(j => j.status === 'Open').length;
  const totalCandidates = candidates.length;
  const interviews = candidates.filter(c => c.stage === 'Interview Scheduled').length;
  const offers = candidates.filter(c => c.stage === 'Offer Extended').length;

  // Candidates by Job Applied For
  const candidatesByJob = jobs.map((job) => ({
    name: job.title,
    candidates: candidates.filter((c) => c.appliedFor === job.title).length,
  })).filter((item) => item.candidates > 0);

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hiring Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of current hiring activities and metrics</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Open Positions" value={openPositions} color="blue" />
        <MetricCard label="Candidates in Pipeline" value={totalCandidates} color="green" />
        <MetricCard label="Interviews Scheduled" value={interviews} color="yellow" />
        <MetricCard label="Offers Extended" value={offers} color="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Candidate Status Distribution</h2>
            <p className="text-sm text-gray-600 mt-1">Distribution of candidates across different hiring stages</p>
          </div>
          <div className="p-6">
            <PieChartCard data={candidates} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Open Positions by Department</h2>
            <p className="text-sm text-gray-600 mt-1">Number of open positions across different departments</p>
          </div>
          <div className="p-6">
            <BarChartCard data={jobs} />
          </div>
        </div>
      </div>

      {candidatesByJob.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Candidates by Job Applied For</h2>
            <p className="text-sm text-gray-600 mt-1">Number of candidates per job position</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={candidatesByJob} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="candidates" fill="#3b82f6" name="Candidates" barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
