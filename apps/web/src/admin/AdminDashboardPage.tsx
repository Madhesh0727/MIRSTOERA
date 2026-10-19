import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardMetrics, EnquiryEntity } from '@momera/shared';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { RefreshCw, ArrowRight } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const data = await api.adminGetDashboard();
      setMetrics(data.metrics);
      setRecentEnquiries(data.recent_enquiries);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboard();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'CONTACTED':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'QUOTED':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'COMPLETED':
        return 'bg-[#16283D] text-[#C8A45D] border-[#C8A45D]';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RoyalCrown size={28} color="#C8A45D" className="animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-wider text-[#16283D] font-semibold">
          Loading Live Concierge Metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E3D8C4] pb-4">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-[#9B7833] block">
            Executive Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16283D]">
            Concierge Operations Dashboard
          </h1>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-[#FCF9F2] border border-[#E3D8C4] hover:border-[#C8A45D] rounded-sm text-xs font-semibold text-[#16283D] shadow-sm transition-colors"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total */}
        <div className="bg-[#16283D] text-[#F7F1E5] p-4 rounded-sm border border-[#C8A45D] shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#C8A45D] block">
            Total Requests
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold block mt-1">
            {metrics?.total ?? 0}
          </span>
        </div>

        {/* New */}
        <div className="bg-[#FCF9F2] p-4 rounded-sm border border-blue-300 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-blue-800 font-semibold block">
            New Enquiries
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-blue-950 block mt-1">
            {metrics?.new ?? 0}
          </span>
        </div>

        {/* Contacted */}
        <div className="bg-[#FCF9F2] p-4 rounded-sm border border-amber-300 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold block">
            Contacted
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 block mt-1">
            {metrics?.contacted ?? 0}
          </span>
        </div>

        {/* Quoted */}
        <div className="bg-[#FCF9F2] p-4 rounded-sm border border-purple-300 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-purple-800 font-semibold block">
            Quoted
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-purple-950 block mt-1">
            {metrics?.quoted ?? 0}
          </span>
        </div>

        {/* Confirmed */}
        <div className="bg-[#FCF9F2] p-4 rounded-sm border border-emerald-300 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-semibold block">
            Confirmed
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950 block mt-1">
            {metrics?.confirmed ?? 0}
          </span>
        </div>

        {/* Completed */}
        <div className="bg-[#FCF9F2] p-4 rounded-sm border border-[#E3D8C4] shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#16283D]/70 font-semibold block">
            Completed
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#16283D] block mt-1">
            {metrics?.completed ?? 0}
          </span>
        </div>
      </div>

      {/* Recent Enquiries Section */}
      <div className="bg-[#FCF9F2] border border-[#E3D8C4] rounded-sm p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E3D8C4] pb-3">
          <h2 className="font-serif text-lg font-bold text-[#16283D]">
            Recent Customer Requests
          </h2>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-[#9B7833] hover:underline flex items-center gap-1"
          >
            View All Enquiries <ArrowRight size={13} />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-xs text-[#292623]/60 py-6 text-center italic">
            No customer requests submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16283D]/5 text-[#16283D] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Event Date</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3D8C4]">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-black/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#16283D]">
                      {enq.reference_code}
                    </td>
                    <td className="p-3 font-medium text-[#292623]">
                      {enq.customer_name}
                      <span className="block text-[10px] text-[#292623]/60">
                        +{enq.customer_phone}
                      </span>
                    </td>
                    <td className="p-3 text-[#16283D]">{enq.service_title || 'Royal Experience'}</td>
                    <td className="p-3 text-[#292623]/80">{enq.event_date}</td>
                    <td className="p-3 text-[#292623]/80">{enq.event_area}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase border ${getStatusColor(
                          enq.status
                        )}`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/enquiries/${enq.id}`}
                        className="px-2.5 py-1 bg-[#16283D] text-[#F7F1E5] text-[11px] rounded-sm hover:bg-[#253D5B] font-medium transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
