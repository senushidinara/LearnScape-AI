'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AnalyticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        progress: {
          overall: 78,
          mathematics: 85,
          science: 72,
          language: 81,
          history: 69
        },
        engagement: {
          daily: [
            { day: 'Mon', minutes: 45, quests: 3 },
            { day: 'Tue', minutes: 62, quests: 5 },
            { day: 'Wed', minutes: 38, quests: 2 },
            { day: 'Thu', minutes: 71, quests: 6 },
            { day: 'Fri', minutes: 55, quests: 4 },
            { day: 'Sat', minutes: 89, quests: 7 },
            { day: 'Sun', minutes: 94, quests: 8 }
          ],
          weekly: [
            { week: 'W1', minutes: 280, quests: 18 },
            { week: 'W2', minutes: 345, quests: 24 },
            { week: 'W3', minutes: 412, quests: 31 },
            { week: 'W4', minutes: 389, quests: 28 }
          ]
        },
        performance: {
          accuracy: 87,
          speed: 92,
          consistency: 78,
          improvement: 15
        },
        achievements: [
          { name: 'First Steps', date: '2024-11-01', icon: '🎯' },
          { name: 'Quick Learner', date: '2024-11-05', icon: '⚡' },
          { name: 'Math Master', date: '2024-11-08', icon: '🧮' },
          { name: 'Week Warrior', date: '2024-11-12', icon: '🏆' },
          { name: 'Science Explorer', date: '2024-11-14', icon: '🔬' }
        ],
        learningStyle: {
          visual: 45,
          auditory: 25,
          kinesthetic: 30
        }
      })
    }, 1000)
  }, [])

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  if (!analyticsData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Learning Analytics</h1>
        <div className="flex gap-4">
          {['day', 'week', 'month'].map((timeframe) => (
            <button
              key={timeframe}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTimeframe === timeframe
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Overall Progress',
            value: `${analyticsData.progress.overall}%`,
            change: '+5%',
            color: 'from-blue-500 to-blue-600'
          },
          {
            label: 'Accuracy Rate',
            value: `${analyticsData.performance.accuracy}%`,
            change: '+3%',
            color: 'from-green-500 to-green-600'
          },
          {
            label: 'Learning Speed',
            value: `${analyticsData.performance.speed}%`,
            change: '+8%',
            color: 'from-purple-500 to-purple-600'
          },
          {
            label: 'Improvement',
            value: `+${analyticsData.performance.improvement}%`,
            change: '+2%',
            color: 'from-orange-500 to-orange-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-green-400 text-sm">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Daily Engagement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData.engagement.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="minutes" 
                stroke="#4f46e5" 
                strokeWidth={3}
                dot={{ fill: '#4f46e5', r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="quests" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Learning Style Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Learning Style Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={Object.entries(analyticsData.learningStyle).map(([key, value]) => ({
                  name: key.charAt(0).toUpperCase() + key.slice(1),
                  value
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(analyticsData.learningStyle).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Subject Progress & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Subject Progress</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.progress).map(([subject, progress]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium capitalize">{subject}</span>
                  <span className="text-gray-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full ${
                      subject === 'overall' ? 'bg-gradient-to-r from-primary-500 to-primary-600' :
                      subject === 'mathematics' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      subject === 'science' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                      subject === 'language' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                      'bg-gradient-to-r from-pink-500 to-pink-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {analyticsData.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{achievement.name}</p>
                  <p className="text-gray-400 text-sm">{achievement.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}