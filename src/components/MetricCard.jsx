import React from 'react';

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-500',
    text: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-500',
    text: 'text-green-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'bg-yellow-500',
    text: 'text-yellow-600'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-500',
    text: 'text-purple-600'
  }
};

export default function MetricCard({ label, value, color = 'blue' }) {
  const classes = colorClasses[color];
  
  return (
    <div className={`${classes.bg} ${classes.border} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className={`text-3xl font-bold ${classes.text}`}>{value}</p>
        </div>
        <div className={`${classes.icon} p-3 rounded-full`}>
          <div className="w-6 h-6 bg-white bg-opacity-30 rounded"></div>
        </div>
      </div>
    </div>
  );
}
