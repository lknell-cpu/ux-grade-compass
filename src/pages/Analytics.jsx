import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { BarChart3, Users, Eye, Compass, Loader, TrendingUp } from 'lucide-react';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSignIns: 0,
    uniqueUsers: 0,
    totalVisits: 0,
    totalComparisons: 0,
    topComparisons: [],
    recentActivity: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get sign-ins
      const signInsSnapshot = await getDocs(collection(db, 'analytics_signins'));
      const signIns = signInsSnapshot.docs.map(doc => doc.data());
      const uniqueUsers = new Set(signIns.map(s => s.userId)).size;

      // Get visits
      const visitsSnapshot = await getDocs(collection(db, 'analytics_visits'));
      const totalVisits = visitsSnapshot.size;

      // Get comparisons
      const comparisonsSnapshot = await getDocs(collection(db, 'analytics_comparisons'));
      const comparisons = comparisonsSnapshot.docs.map(doc => doc.data());
      
      // Calculate top comparisons
      const comparisonCounts = {};
      comparisons.forEach(comp => {
        const key = comp.grades.join(',');
        comparisonCounts[key] = (comparisonCounts[key] || 0) + 1;
      });
      
      const topComparisons = Object.entries(comparisonCounts)
        .map(([grades, count]) => ({ grades: grades.split(','), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get recent activity
      const recentQuery = query(
        collection(db, 'analytics_comparisons'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const recentSnapshot = await getDocs(recentQuery);
      const recentActivity = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStats({
        totalSignIns: signIns.length,
        uniqueUsers,
        totalVisits,
        totalComparisons: comparisons.length,
        topComparisons,
        recentActivity,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-md">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium">UX Grade Compass Usage Statistics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sign-Ins */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Total Sign-Ins</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalSignIns}</p>
            <p className="text-xs text-slate-500 mt-1">All authentication events</p>
          </div>

          {/* Unique Users */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Unique Users</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.uniqueUsers}</p>
            <p className="text-xs text-slate-500 mt-1">Distinct user accounts</p>
          </div>

          {/* Total Visits */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Total Visits</h3>
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalVisits}</p>
            <p className="text-xs text-slate-500 mt-1">Page views</p>
          </div>

          {/* Total Comparisons */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Comparisons</h3>
              <Compass className="w-5 h-5 text-cyan-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalComparisons}</p>
            <p className="text-xs text-slate-500 mt-1">Grade selections made</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Comparisons */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Top Grade Comparisons</h2>
            </div>
            {stats.topComparisons.length > 0 ? (
              <div className="space-y-3">
                {stats.topComparisons.map((comp, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {comp.grades.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-blue-100 rounded-full w-24">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ 
                            width: `${(comp.count / stats.topComparisons[0].count) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 w-8 text-right">
                        {comp.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No comparison data yet</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
            </div>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                    <div>
                      <p className="font-medium text-slate-900">{activity.grades.join(', ')}</p>
                      <p className="text-xs text-slate-500">{activity.email}</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {activity.timestamp?.toDate?.().toLocaleDateString() || 'Recent'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No activity data yet</p>
            )}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This dashboard is only accessible to administrators. 
            All data is collected anonymously and used solely for improving the app experience.
          </p>
        </div>
      </main>
    </div>
  );
}

