import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminAuditLogEntity } from '@momera/shared';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { RefreshCw } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLogEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const data = await api.adminGetAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E3D8C4] pb-4">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-[#9B7833] block">
            Tamper-Evident Trail
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16283D]">
            Administrative Audit Logs ({logs.length})
          </h1>
          <p className="text-xs text-[#292623]/70 mt-1">
            Immutable log of staff logins, status changes, notes, and service edits.
          </p>
        </div>

        <button
          onClick={fetchLogs}
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
            <p className="text-xs text-[#292623]/70">Loading audit trail...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#292623]/60 italic">
            No audit logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16283D] text-[#F7F1E5] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">Entity ID</th>
                  <th className="p-3">Admin Email</th>
                  <th className="p-3">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3D8C4]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-black/5 transition-colors">
                    <td className="p-3 font-mono text-[11px] text-[#292623]/70">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-[#16283D] font-mono">
                      {log.action}
                    </td>
                    <td className="p-3 text-[11px] uppercase tracking-wider text-[#9B7833]">
                      {log.entity_type}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#292623]/80">
                      {log.entity_id || '—'}
                    </td>
                    <td className="p-3 text-[#16283D]">
                      {log.admin_email || 'System / Bootstrap'}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-[#292623]/70 max-w-xs truncate">
                      {log.metadata_json || '—'}
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
