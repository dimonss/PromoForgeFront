import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { promoAPI } from '../services/api';
import { 
  QrCode, 
  Plus, 
  Search, 
  History, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalActivations: 0,
    todayActivations: 0,
    recentActivations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await promoAPI.getActivations(1, 10);
      const activations = response.data.activations;
      
      // Calculate stats
      const totalActivations = response.data.pagination.total;
      const today = new Date().toDateString();
      const todayActivations = activations.filter(activation => 
        new Date(activation.activated_at).toDateString() === today
      ).length;

      setStats({
        totalActivations,
        todayActivations,
        recentActivations: activations.slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Activate Promo Code',
      description: 'Scan or enter a promo code to activate',
      icon: QrCode,
      color: 'bg-green-500',
      href: '/activate'
    },
    {
      title: 'Generate Promo Code',
      description: 'Create a new promo code',
      icon: Plus,
      color: 'bg-blue-500',
      href: '/generate'
    },
    {
      title: 'Check Status',
      description: 'Verify promo code status',
      icon: Search,
      color: 'bg-purple-500',
      href: '/status'
    },
    {
      title: 'View History',
      description: 'Browse activation history',
      icon: History,
      color: 'bg-orange-500',
      href: '/history'
    }
  ];

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '400px' }}>
        <div className="loading">
          <div className="spinner"></div>
          Загрузка панели управления...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to PromoForge - Your promo code management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Всего активаций
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalActivations}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Today's Activations
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.todayActivations}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Недавняя активность
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.recentActivations.length} recent
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.href)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-left group"
              >
                <div className="flex items-center">
                  <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activations */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Недавние активации</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentActivations.length > 0 ? (
            stats.recentActivations.map((activation) => (
              <div key={activation.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activation.promo_code}
                    </p>
                    <p className="text-sm text-gray-500">
                      Activated by {activation.activated_by_name}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {new Date(activation.activated_at).toLocaleString()}
                  </div>
                </div>
                {activation.customer_info && (
                  <p className="text-xs text-gray-400 mt-1">
                    Customer: {activation.customer_info}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activations</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by activating your first promo code.
              </p>
            </div>
          )}
        </div>
        {stats.recentActivations.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              View all activations →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
