import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { MomeraLogo } from '../common/MomeraLogo';
import { RoyalCrown } from '../common/RoyalCrown';
import { api } from '../../services/api';
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  Settings,
  Bell,
  ScrollText,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { AdminUserEntity } from '@momera/shared';

export const AdminLayout: React.FC = () => {
  const [user, setUser] = useState<AdminUserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    api
      .adminGetSession()
      .then((res) => {
        if (mounted) {
          setUser(res.user);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          navigate('/admin/login', { replace: true });
        }
      });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.adminLogout();
    } catch {
      // Ignore
    } finally {
      navigate('/admin/login', { replace: true });
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
    { label: 'Services', href: '/admin/services', icon: Sparkles },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F1E5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <MomeraLogo variant="emblem" size={48} className="animate-pulse mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#16283D] font-semibold">
            Verifying Royal Credentials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F1E5] flex flex-col md:flex-row text-left">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-[#16283D] text-[#F7F1E5] border-r border-[#C8A45D]/40 shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand Seal */}
          <div className="p-6 border-b border-[#F7F1E5]/10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#16283D] border border-[#C8A45D] flex items-center justify-center shadow-sm p-1.5">
              <MomeraLogo variant="emblem" size={26} alt="MIRSTOERA Emblem" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-widest text-[#F7F1E5] block leading-none">
                MIRSTOERA
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#C8A45D] font-mono">
                Staff Portal
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-sm text-xs font-medium tracking-wide transition-colors ${
                    active
                      ? 'bg-[#C8A45D] text-[#16283D] font-semibold shadow-sm'
                      : 'text-[#F7F1E5]/80 hover:bg-white/5 hover:text-[#C8A45D]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-[#F7F1E5]/10 space-y-3">
          <div className="text-xs text-[#F7F1E5]/70 truncate">
            <span className="block font-semibold text-[#F7F1E5]">{user?.full_name}</span>
            <span className="font-mono text-[10px]">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F7F1E5]/10 text-xs">
            <Link
              to="/"
              target="_blank"
              className="text-[#C8A45D] hover:underline flex items-center gap-1 text-[11px]"
            >
              Public Site <ExternalLink size={12} />
            </Link>
            <button
              onClick={handleLogout}
              className="text-[#F7F1E5]/60 hover:text-[#692D40] flex items-center gap-1 transition-colors text-[11px]"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};
