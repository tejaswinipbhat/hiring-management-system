import React from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center fixed md:relative top-0 left-0 right-0 z-30 md:z-auto">
      <div className="flex items-center ml-12 md:ml-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Hiring Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
          <span className="text-sm text-gray-600">Welcome back,</span>
          <span className="text-sm font-medium text-gray-900 ml-1">Admin</span>
        </div>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">A</span>
        </div>
      </div>
    </header>
  );
}
