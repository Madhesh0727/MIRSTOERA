import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { EnquiryEntity, ENQUIRY_STATUSES, OFFICIAL_SERVICES } from '@momera/shared';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { Search, RefreshCw, Eye } from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetEnquiries({
        status: statusFilter || undefined,
        service_slug: serviceFilter || undefined,
        search: search || undefined,
        page,
        limit: 15,
      });
      setEnquiries(res.items);
      setTotalPages(res.pagination.total_pages);
      setTotalCount(res.pagination.total);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, statusFilter, serviceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEnquiries();
  };

  const getStatusBadge = (status: string) => {
    const base = 'inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase border';
    switch (status) {
      case 'NEW':
        return `${base} bg-blue-100 text-blue-900 border-blue-300`;
      case 'CONTACTED':
        return `${base} bg-amber-100 text-amber-900 border-amber-300`;
      case 'QUOTED':
        return `${base} bg-purple-100 text-purple-900 border-purple-300`;
      case 'CONFIRMED':
        return `${base} bg-emerald-100 text-emerald-900 border-emerald-300`;
      case 'COMPLETED':
        return `${base} bg-[#16283D] text-[#C8A45D] border-[#C8A45D]`;
      case 'CANCELLED':
        return `${base} bg-gray-100 text-gray-700 border-gray-300`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E3D8C4] pb-4">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-[#9B7833] block">
            Customer Requests ({totalCount})
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16283D]">
            All Royal Enquiries
          </h1>
        </div>

        <button
          onClick={fetchEnquiries}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#FCF9F2] border border-[#E3D8C4] rounded-sm text-xs font-semibold text-[#16283D] hover:border-[#C8A45D] transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FCF9F2] p-4 border border-[#E3D8C4] rounded-sm shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <input
              type="text"
              placeholder="Search by code, customer name, phone, area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3D8C4] rounded-sm text-xs focus:outline-none focus:border-[#C8A45D]"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#292623]/40" />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm text-xs focus:outline-none focus:border-[#C8A45D]"
            >
              <option value="">All Statuses</option>
              {ENQUIRY_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm text-xs focus:outline-none focus:border-[#C8A45D]"
            >
              <option value="">All Experiences</option>
              {Object.values(OFFICIAL_SERVICES).map((srv) => (
                <option key={srv.slug} value={srv.slug}>
                  {srv.title}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-[#FCF9F2] border border-[#E3D8C4] rounded-sm overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <RoyalCrown size={24} color="#C8A45D" className="animate-spin mx-auto" />
            <p className="text-xs text-[#292623]/70">Retrieving customer enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#292623]/60 italic">
            No matching enquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16283D] text-[#F7F1E5] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Reference Code</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Event Date & Time</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Received</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3D8C4]">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-black/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#16283D]">
                      {enq.reference_code}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-[#16283D] block">{enq.customer_name}</span>
                      <span className="font-mono text-[11px] text-[#292623]/70">+{enq.customer_phone}</span>
                    </td>
                    <td className="p-3 text-[#16283D]">{enq.service_title || 'Experience'}</td>
                    <td className="p-3 text-[#292623]/80">
                      <span>{enq.event_date}</span>
                      <span className="block text-[10px] text-[#292623]/60">{enq.event_time}</span>
                    </td>
                    <td className="p-3 text-[#292623]/80">{enq.event_area}</td>
                    <td className="p-3">
                      <span className={getStatusBadge(enq.status)}>{enq.status}</span>
                    </td>
                    <td className="p-3 text-[11px] text-[#292623]/60">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/enquiries/${enq.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#16283D] text-[#F7F1E5] rounded-sm hover:bg-[#253D5B] font-medium text-xs transition-colors"
                      >
                        <Eye size={12} />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-[#E3D8C4] flex items-center justify-between text-xs text-[#292623]/80">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-white border border-[#E3D8C4] rounded-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-white border border-[#E3D8C4] rounded-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
