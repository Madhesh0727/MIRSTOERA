import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NotificationOutboxEntity } from '@momera/shared';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { RefreshCw, RotateCcw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const AdminNotificationsPage: React.FC = () => {
  const [items, setItems] = useState<NotificationOutboxEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<number | null>(null);

  const fetchNotifications = async () => {
    try {
      const data = await api.adminGetNotifications();
      setItems(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRetry = async (id: number) => {
    setRetryingId(id);
    try {
      await api.adminRetryNotification(id);
      await fetchNotifications();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setRetryingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-sm">
            <CheckCircle size={11} /> SENT
          </span>
        );
      case 'PENDING':
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-sm">
            <Clock size={11} /> {status}
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-800 bg-red-100 border border-red-300 px-2 py-0.5 rounded-sm">
            <AlertTriangle size={11} /> FAILED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold text-gray-800 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-sm">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E3D8C4] pb-4">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-[#9B7833] block">
            Transactional Delivery Log
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16283D]">
            Notification Outbox ({items.length})
          </h1>
          <p className="text-xs text-[#292623]/70 mt-1">
            Review outgoing WhatsApp dispatch events, retry attempts, and provider delivery statuses.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#FCF9F2] border border-[#E3D8C4] rounded-sm text-xs font-semibold text-[#16283D] hover:border-[#C8A45D] transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-[#FCF9F2] border border-[#E3D8C4] rounded-sm overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <RoyalCrown size={24} color="#C8A45D" className="animate-spin mx-auto" />
            <p className="text-xs text-[#292623]/70">Loading notification outbox records...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#292623]/60 italic">
            No notification records in outbox yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16283D] text-[#F7F1E5] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Enquiry</th>
                  <th className="p-3">Channel / Recipient</th>
                  <th className="p-3">Template</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Attempts</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3D8C4]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-black/5 transition-colors">
                    <td className="p-3 font-mono text-[#292623]/70">#{item.id}</td>
                    <td className="p-3">
                      {item.enquiry_id ? (
                        <span className="font-semibold text-[#16283D]">Enquiry #{item.enquiry_id}</span>
                      ) : (
                        <span className="text-[#292623]/50">General</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-[#16283D] block uppercase text-[10px]">
                        {item.channel}
                      </span>
                      <span className="font-mono text-[11px] text-[#292623]/80">+{item.recipient}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#292623]/80">{item.template_key}</td>
                    <td className="p-3">{getStatusBadge(item.status)}</td>
                    <td className="p-3 font-mono">{item.attempt_count}</td>
                    <td className="p-3 text-[11px] text-[#292623]/60">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-right">
                      {item.status !== 'SENT' && (
                        <button
                          onClick={() => handleRetry(item.id)}
                          disabled={retryingId === item.id}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#16283D] text-[#F7F1E5] rounded-sm hover:bg-[#253D5B] text-[11px] font-medium disabled:opacity-50"
                        >
                          <RotateCcw size={11} className={retryingId === item.id ? 'animate-spin' : ''} />
                          <span>Retry</span>
                        </button>
                      )}
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
