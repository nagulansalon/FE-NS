import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  History,
  CreditCard,
  Scissors,
  Package,
  Armchair,
  Users,
  UserCheck,
  ShieldAlert,
  UserSquare2,
  BarChart3,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, visible: true },
    { label: 'Billing / POS', path: '/billing', icon: Receipt, visible: true },
    { label: 'Sales History', path: '/sales', icon: History, visible: true },
    { label: 'Payments', path: '/payments', icon: CreditCard, visible: true },
    { label: 'Services & Menu', path: '/services', icon: Scissors, visible: true },
    { label: 'Products & Stock', path: '/products', icon: Package, visible: true },
    { label: 'Chairs & Stations', path: '/chairs', icon: Armchair, visible: true },
    { label: 'Attendants', path: '/attendants', icon: Users, visible: true },
    { label: 'Staff Management', path: '/staff', icon: UserCheck, visible: isAdmin },
    { label: 'Admin Management', path: '/admins', icon: ShieldAlert, visible: isSuperAdmin },
    { label: 'Customers', path: '/customers', icon: UserSquare2, visible: true },
    { label: 'Reports & Analytics', path: '/reports', icon: BarChart3, visible: isAdmin },
    { label: 'Activity Logs', path: '/activity-logs', icon: FileSpreadsheet, visible: isSuperAdmin },
    { label: 'Salon Settings', path: '/settings', icon: Settings, visible: true },
  ];

  const filteredItems = navItems.filter((item) => item.visible);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-charcoal-900 text-gray-200 border-r border-charcoal-800 transition-all duration-300 flex flex-col ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-charcoal-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-black border border-gold-500 flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5 text-gold-500 transform -rotate-45" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="truncate">
                <span className="font-serif font-bold text-lg text-white tracking-wider block leading-tight">
                  NAGULAN
                </span>
                <span className="text-[10px] tracking-widest text-gold-400 uppercase font-semibold">
                  UNISEX SALON
                </span>
              </div>
            )}
          </div>

          {/* Close for Mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-charcoal-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Role Badge */}
        {(!isCollapsed || mobileOpen) && (
          <div className="px-4 py-3 border-b border-charcoal-800/60 bg-charcoal-950/40">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 truncate">{user?.fullName}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isSuperAdmin
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : isAdmin
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/40 font-semibold'
                    : 'text-gray-300 hover:bg-charcoal-800 hover:text-white'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {(!isCollapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Action */}
        <div className="p-3 border-t border-charcoal-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>Secure Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
