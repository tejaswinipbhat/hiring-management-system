import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export function BarChartCard({ data }) {
  const departmentCounts = data
    .filter(job => job.status === 'Open')
    .reduce((acc, job) => {
      acc[job.department] = (acc[job.department] || 0) + 1;
      return acc;
    }, {});

  const chartData = Object.entries(departmentCounts).map(([dept, count]) => ({
    department: dept,
    count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        <p>No open positions data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="department" 
          tick={{ fontSize: 12 }} 
          angle={-45} 
          textAnchor="end" 
          height={80}
        />
        <YAxis 
          allowDecimals={false} 
          tick={{ fontSize: 12 }}
          label={{ value: 'Open Positions', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          formatter={(value, name) => [value, 'Open Positions']}
          labelFormatter={(label) => `Department: ${label}`}
          contentStyle={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '6px' 
          }}
        />
        <Bar 
          dataKey="count" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
