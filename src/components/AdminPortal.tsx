import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  ExternalLink,
  Phone,
  RefreshCw,
  LogOut,
  ChevronDown,
  Download,
  Eye,
  Check,
  Layers,
  IndianRupee,
  MapPin,
  Calendar,
  Sparkles,
  Smartphone,
  Trash2,
  Edit3,
} from 'lucide-react';
import {
  verifyAdminInFirebase,
  subscribeToAllOrders,
  updateOrderStatusInFirebase,
  deleteOrderInFirebase,
  saveOrderToFirebase,
  DEFAULT_ADMIN_ID,
  DEFAULT_ADMIN_PASS,
  type AdminProfile,
} from '../firebase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  // Authentication state
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(() => {
    const saved = sessionStorage.getItem('cartwala_admin_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [accountIdInput, setAccountIdInput] = useState('Anshu123');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Orders and tracking state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tradeFilter, setTradeFilter] = useState('all');

  // Order detail / edit modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editCourier, setEditCourier] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState(false);

  // Handle Admin Login with Firebase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await verifyAdminInFirebase(accountIdInput, passwordInput);
      if (res.success && res.admin) {
        setAdminUser(res.admin);
        sessionStorage.setItem('cartwala_admin_session', JSON.stringify(res.admin));
        setLoginError(null);
      } else {
        setLoginError(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem('cartwala_admin_session');
    setPasswordInput('');
  };

  // Subscribe to real-time Firebase order tracking
  useEffect(() => {
    if (!isOpen || !adminUser) return;

    setLoadingOrders(true);
    const unsubscribe = subscribeToAllOrders(
      (liveOrders) => {
        // Also check localStorage orders to make sure local guest tests show up
        const local = JSON.parse(localStorage.getItem('cartwala_orders') || '[]');
        const combinedMap = new Map();
        
        // Add local first
        local.forEach((o: any) => {
          if (o.orderId) combinedMap.set(o.orderId, o);
        });
        // Live firestore orders take precedence
        liveOrders.forEach((o: any) => {
          if (o.orderId) combinedMap.set(o.orderId, o);
        });

        const allCombined = Array.from(combinedMap.values());
        allCombined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        // If completely empty, seed initial sample orders for demonstration
        if (allCombined.length === 0) {
          seedInitialOrders();
        } else {
          setOrders(allCombined);
          setLoadingOrders(false);
        }
      },
      (err) => {
        console.warn('Orders real-time error:', err);
        const local = JSON.parse(localStorage.getItem('cartwala_orders') || '[]');
        setOrders(local);
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, adminUser]);

  // Seed sample initial orders to demonstrate complete workflow
  const seedInitialOrders = async () => {
    const sampleOrders = [
      {
        orderId: 'CW-782410',
        userId: 'vendor-ramesh-vns',
        vendorName: 'Rameshwar Yadav',
        phoneNumber: '9820144512',
        city: 'Varanasi',
        tradeType: 'juice_chai',
        planType: 'own',
        solarArray: 'Pro 400W + 1.2kWh',
        selectedModules: ['soundbox', 'led_canopy', 'cold_storage', 'digital_meter'],
        basePrice: 42999,
        subsidyAmount: 10000,
        finalPrice: 32999,
        depositPaid: 999,
        status: 'subsidy_verifying',
        courierDetails: 'SBI Varanasi Cantt Branch Loan Desk Reference #PM-VNS-9912',
        trackingNotes: 'Aadhaar e-KYC verified. Awaiting State Urban Development Agency clearance.',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        orderId: 'CW-891044',
        userId: 'vendor-sunita-ind',
        vendorName: 'Sunita Malviya',
        phoneNumber: '9893452109',
        city: 'Indore',
        tradeType: 'fruits_veg',
        planType: 'rent_to_own',
        solarArray: 'Pro 400W + 1.2kWh',
        selectedModules: ['led_canopy', 'fast_charger', 'cold_storage'],
        basePrice: 39999,
        subsidyAmount: 10000,
        finalPrice: 29999,
        depositPaid: 999,
        status: 'manufacturing',
        courierDetails: 'Pithampur Industrial Hub - Bay 4 Chassis Assembly',
        trackingNotes: 'Frame powder-coated Auspicious Vermilion Red. 400W monocrystalline panel mounted.',
        createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
      },
      {
        orderId: 'CW-920158',
        userId: 'vendor-rafiq-lko',
        vendorName: 'Mohammed Rafiq',
        phoneNumber: '9415089234',
        city: 'Lucknow',
        tradeType: 'chaat_snacks',
        planType: 'own',
        solarArray: 'Standard 250W + 800Wh',
        selectedModules: ['soundbox', 'led_canopy', 'cash_drawer'],
        basePrice: 36999,
        subsidyAmount: 10000,
        finalPrice: 26999,
        depositPaid: 999,
        status: 'dispatched',
        courierDetails: 'VRL Logistics Waybill #VRL-LKO-44021',
        trackingNotes: 'Dispatched via Lucknow transport container. Expected arrival Hazratganj delivery point in 2 days.',
        createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
      },
    ];

    for (const order of sampleOrders) {
      try {
        await saveOrderToFirebase(order);
      } catch (e) {
        console.warn('Seed order save notice:', e);
      }
    }
    setOrders(sampleOrders);
    setLoadingOrders(false);
  };

  // Open edit modal
  const handleOpenEdit = (order: any) => {
    setSelectedOrder(order);
    setEditStatus(order.status || 'reserved');
    setEditCourier(order.courierDetails || '');
    setEditNotes(order.trackingNotes || '');
    setUpdateSuccessMsg(false);
  };

  // Save order tracking update to Firebase
  const handleSaveOrderUpdate = async () => {
    if (!selectedOrder) return;
    setIsUpdatingOrder(true);
    setUpdateSuccessMsg(false);

    try {
      await updateOrderStatusInFirebase(
        selectedOrder.orderId,
        editStatus,
        editNotes,
        editCourier
      );

      // Also update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === selectedOrder.orderId
            ? {
                ...o,
                status: editStatus,
                trackingNotes: editNotes,
                courierDetails: editCourier,
                updatedAt: new Date().toISOString(),
              }
            : o
        )
      );

      setUpdateSuccessMsg(true);
      setTimeout(() => {
        setUpdateSuccessMsg(false);
        setSelectedOrder(null);
      }, 1000);
    } catch (err: any) {
      alert(`Update failed: ${err?.message}`);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Quick status update direct from table
  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatusInFirebase(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.warn('Status update notice:', err);
    }
  };

  // Delete / cancel order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete or archive Order #${orderId}?`)) {
      return;
    }
    try {
      await deleteOrderInFirebase(orderId);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    } catch (err: any) {
      alert(`Delete error: ${err?.message}`);
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = [
      'Order ID',
      'Date',
      'Vendor Name',
      'Phone Number',
      'City',
      'Trade Type',
      'Solar Array',
      'Plan Type',
      'Final Price (INR)',
      'Status',
      'Tracking & Notes',
    ];

    const rows = orders.map((o) => [
      o.orderId || '',
      o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
      `"${o.vendorName || ''}"`,
      o.phoneNumber || '',
      o.city || '',
      o.tradeType || '',
      o.solarArray || '',
      o.planType || '',
      o.finalPrice || '',
      o.status || '',
      `"${(o.trackingNotes || o.courierDetails || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cartwala_orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculations
  const totalOrdersCount = orders.length;
  const totalDepositCollected = orders.reduce((acc, curr) => acc + (curr.depositPaid || 999), 0);
  const totalPipelineRevenue = orders.reduce((acc, curr) => acc + (curr.finalPrice || 0), 0);
  const pendingSubsidies = orders.filter((o) => o.status === 'subsidy_verifying' || o.status === 'reserved').length;
  const inManufacturing = orders.filter((o) => o.status === 'manufacturing').length;
  const dispatchedOrDelivered = orders.filter((o) => o.status === 'dispatched' || o.status === 'delivered').length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.vendorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.phoneNumber || '').includes(searchQuery) ||
      (order.city || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTrade = tradeFilter === 'all' || order.tradeType === tradeFilter;

    return matchesSearch && matchesStatus && matchesTrade;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reserved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1 inline-flex">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Reserved (Token Paid)</span>
          </span>
        );
      case 'subsidy_verifying':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1 inline-flex">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            <span>PM SVANidhi Verification</span>
          </span>
        );
      case 'manufacturing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center space-x-1 inline-flex">
            <Package className="w-3 h-3 text-purple-600" />
            <span>Factory Production</span>
          </span>
        );
      case 'dispatched':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center space-x-1 inline-flex">
            <Truck className="w-3 h-3 text-indigo-600" />
            <span>Dispatched / In Transit</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1 inline-flex">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Delivered & Active</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800">
            {status}
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-6xl shadow-2xl border border-[#F2EAE0] overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in duration-200">
        
        {/* ========================================================= */}
        {/* TOP ADMINISTRATIVE HEADER BAR                             */}
        {/* ========================================================= */}
        <div className="bg-[#121826] text-white px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-[#1E1E24] flex items-center justify-center font-black shadow-md">
              CW
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wide">
                  Cartwala Operations & Order Tracking
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#E63946] text-white text-[10px] font-black tracking-wider uppercase">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Live Firebase Synchronization • PM SVANidhi Subsidy & Production Line
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {adminUser && (
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-zinc-300">Live Firebase DB:</span>
                <span className="font-bold text-[#FFB800]">{adminUser.username}</span>
              </div>
            )}
            {adminUser && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-zinc-200 flex items-center space-x-1.5 transition-colors"
                title="Log Out Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close portal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: ADMIN LOGIN SCREEN (IF NOT LOGGED IN)             */}
        {/* ========================================================= */}
        {!adminUser ? (
          <div className="p-6 sm:p-12 max-w-md mx-auto w-full my-auto flex flex-col justify-center">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#F2EAE0] space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#FFB800] flex items-center justify-center mx-auto shadow-xs">
                  <ShieldCheck className="w-8 h-8 text-[#1E1E24]" />
                </div>
                <h3 className="font-heading font-black text-2xl text-[#1E1E24]">
                  Admin Sign In
                </h3>
                <p className="text-xs text-[#837560]">
                  Enter administrative credentials to access nationwide thela reservation tracking
                </p>
              </div>

              {/* Pre-fill Helper Box */}
              <div className="bg-amber-50/80 rounded-2xl p-3 border border-[#FFB800]/50 text-xs text-[#7c5800] flex items-start justify-between">
                <div>
                  <div className="font-bold">Authorized Credentials:</div>
                  <div className="font-mono text-[11px] mt-0.5">
                    Account ID: <span className="font-bold text-[#1E1E24]">Anshu123</span>
                    <br />
                    Password: <span className="font-bold text-[#1E1E24]">admin6767</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAccountIdInput('Anshu123');
                    setPasswordInput('admin6767');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FFB800] text-[#1E1E24] text-[11px] font-black hover:bg-[#ffa000] shadow-xs shrink-0 self-center"
                >
                  Auto-Fill
                </button>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1E24] mb-1">
                    Account ID (Admin ID)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={accountIdInput}
                      onChange={(e) => setAccountIdInput(e.target.value)}
                      placeholder="Anshu123"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2EAE0] bg-[#FAF7F2] text-sm font-semibold text-[#1E1E24] focus:outline-hidden focus:ring-2 focus:ring-[#FFB800] focus:bg-white"
                    />
                    <UserCheck className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1E24] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2EAE0] bg-[#FAF7F2] text-sm font-semibold text-[#1E1E24] focus:outline-hidden focus:ring-2 focus:ring-[#FFB800] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-neutral-500 hover:text-neutral-800 font-bold absolute right-3.5 top-3"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-[#1E1E24] hover:bg-neutral-800 text-white font-black text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center space-x-2"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#FFB800]" />
                      <span>Verifying with Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#FFB800]" />
                      <span>Authenticate as Admin</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: AUTHENTICATED ADMIN ORDER TRACKING DASHBOARD      */
          /* ========================================================= */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#F2EAE0] shadow-xs">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
                  <span>Total Reservations</span>
                  <Package className="w-4 h-4 text-[#FFB800]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#1E1E24] mt-2">
                  {totalOrdersCount}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  All active orders tracked
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F2EAE0] shadow-xs">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
                  <span>Deposits Collected</span>
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#1E1E24] mt-2">
                  ₹{totalDepositCollected.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-neutral-500 font-semibold mt-1">
                  ₹999 refundable tokens
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F2EAE0] shadow-xs">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
                  <span>PM SVANidhi In Progress</span>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-2">
                  {pendingSubsidies}
                </div>
                <div className="text-[11px] text-blue-600 font-semibold mt-1">
                  Awaiting branch clearance
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F2EAE0] shadow-xs">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
                  <span>Dispatched / Active</span>
                  <Truck className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-700 mt-2">
                  {dispatchedOrDelivered}
                </div>
                <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                  On street or in transit
                </div>
              </div>
            </div>

            {/* Filter & Action Controls Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#F2EAE0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-2 w-full">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Order ID, Vendor, Phone, City..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#F2EAE0] bg-[#FAF7F2] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#FFB800] focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-[#F2EAE0] bg-[#FAF7F2] text-xs font-bold text-[#1E1E24] focus:outline-hidden focus:ring-2 focus:ring-[#FFB800]"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="reserved">Reserved (Token Paid)</option>
                  <option value="subsidy_verifying">PM SVANidhi Verifying</option>
                  <option value="manufacturing">In Factory Assembly</option>
                  <option value="dispatched">Dispatched / Transit</option>
                  <option value="delivered">Delivered</option>
                </select>

                {/* Trade Filter */}
                <select
                  value={tradeFilter}
                  onChange={(e) => setTradeFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-[#F2EAE0] bg-[#FAF7F2] text-xs font-bold text-[#1E1E24] focus:outline-hidden focus:ring-2 focus:ring-[#FFB800]"
                >
                  <option value="all">All Trade Categories</option>
                  <option value="juice_chai">Juice, Shakes & Chai</option>
                  <option value="chaat_snacks">Chaat, Snacks & Wok</option>
                  <option value="fruits_veg">Fruits & Vegetables</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <a
                  href="/api/download/dist"
                  download="dist.zip"
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                  title="Download compiled dist.zip to drag & drop on app.netlify.com/drop"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download dist.zip (Netlify)</span>
                </a>
                <a
                  href="/api/download/source"
                  download="cartwala-source-code.zip"
                  className="px-3 py-2 rounded-xl border border-[#F2EAE0] hover:bg-[#FAF7F2] text-xs font-bold text-[#1E1E24] flex items-center space-x-1.5 transition-colors"
                  title="Download full project source code as .zip"
                >
                  <Download className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Full Code (.zip)</span>
                </a>
                <button
                  onClick={seedInitialOrders}
                  className="px-3 py-2 rounded-xl border border-[#F2EAE0] hover:bg-[#FAF7F2] text-xs font-bold text-[#514532] flex items-center space-x-1.5 transition-colors"
                  title="Reseed sample reservations"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Seed Test Orders</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-xl bg-[#1E1E24] hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-[#F2EAE0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#F2EAE0] text-[11px] font-black uppercase tracking-wider text-[#837560]">
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Vendor & Contact</th>
                      <th className="py-3 px-4">Configuration</th>
                      <th className="py-3 px-4">Pricing & Subsidy</th>
                      <th className="py-3 px-4">Tracking Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EAE0] text-xs">
                    {loadingOrders ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FFB800]" />
                          Syncing live orders with Firebase...
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          No orders found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-amber-50/30 transition-colors">
                          {/* Order Ref & Date */}
                          <td className="py-3.5 px-4 font-mono font-bold text-[#1E1E24]">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[#E63946]">#{order.orderId}</span>
                            </div>
                            <div className="text-[10px] text-neutral-400 font-sans mt-0.5">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'Recent'}
                            </div>
                          </td>

                          {/* Vendor & Contact */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#1E1E24]">
                              {order.vendorName || 'Guest Vendor'}
                            </div>
                            <div className="flex items-center space-x-2 mt-1 text-[11px] text-neutral-500">
                              <a
                                href={`tel:+91${order.phoneNumber}`}
                                className="flex items-center space-x-1 text-neutral-600 hover:text-[#1E1E24]"
                              >
                                <Phone className="w-3 h-3 text-[#FFB800]" />
                                <span>+91 {order.phoneNumber}</span>
                              </a>
                              <a
                                href={`https://wa.me/91${order.phoneNumber}?text=Hello%20${encodeURIComponent(
                                  order.vendorName || 'Partner'
                                )},%20this%20is%20Anshu%20from%20Cartwala%20HQ%20regarding%20your%20Order%20${
                                  order.orderId
                                }`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-0.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white"
                                title="Chat on WhatsApp"
                              >
                                <Smartphone className="w-3 h-3" />
                              </a>
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center space-x-1">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{order.city || 'India'}</span>
                            </div>
                          </td>

                          {/* Configuration */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#1E1E24]">
                              {order.tradeType === 'juice_chai'
                                ? 'Juice & Chai Thela'
                                : order.tradeType === 'chaat_snacks'
                                ? 'Chaat & Snacks Thela'
                                : 'Fruits & Veg Thela'}
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-0.5">
                              {order.solarArray || '400W Solar + 1.2kWh'}
                            </div>
                            {order.selectedModules && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {order.selectedModules.slice(0, 2).map((m: string) => (
                                  <span
                                    key={m}
                                    className="px-1.5 py-0.5 rounded-sm bg-neutral-100 text-[9px] font-bold text-neutral-600"
                                  >
                                    {m.replace('_', ' ')}
                                  </span>
                                ))}
                                {order.selectedModules.length > 2 && (
                                  <span className="text-[9px] text-neutral-400 font-bold self-center">
                                    +{order.selectedModules.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Pricing & Subsidy */}
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-[#1E1E24]">
                              ₹{Number(order.finalPrice || 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                              -₹{Number(order.subsidyAmount || 10000).toLocaleString('en-IN')} PM SVANidhi
                            </div>
                            <div className="text-[10px] text-[#837560]">
                              Token: ₹{order.depositPaid || 999} Paid
                            </div>
                          </td>

                          {/* Status & Quick Advance */}
                          <td className="py-3.5 px-4">
                            <div className="mb-1.5">{getStatusBadge(order.status || 'reserved')}</div>
                            <select
                              value={order.status || 'reserved'}
                              onChange={(e) => handleQuickStatusChange(order.orderId, e.target.value)}
                              className="text-[11px] font-bold bg-[#FAF7F2] border border-[#F2EAE0] rounded-lg px-2 py-1 text-neutral-700 hover:border-[#FFB800] focus:outline-hidden"
                            >
                              <option value="reserved">1. Reserved</option>
                              <option value="subsidy_verifying">2. Subsidy Verifying</option>
                              <option value="manufacturing">3. In Manufacturing</option>
                              <option value="dispatched">4. Dispatched</option>
                              <option value="delivered">5. Delivered</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleOpenEdit(order)}
                                className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-[#FFB800] hover:text-[#1E1E24] text-neutral-700 font-bold text-xs flex items-center space-x-1 transition-colors"
                                title="Edit tracking & notes"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Track</span>
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.orderId)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: ORDER DETAILS & LOGISTICS TRACKING EDIT             */}
        {/* ========================================================= */}
        {selectedOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#F2EAE0] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#837560]">
                    Order Tracking Control
                  </div>
                  <h4 className="font-heading font-black text-xl text-[#1E1E24]">
                    Fulfillment for #{selectedOrder.orderId}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {updateSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tracking information saved to Firebase!</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                {/* Status Selector */}
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2EAE0] bg-[#FAF7F2] font-bold text-sm text-[#1E1E24] focus:ring-2 focus:ring-[#FFB800] focus:outline-hidden"
                  >
                    <option value="reserved">1. Reserved / ₹999 Deposit Received</option>
                    <option value="subsidy_verifying">2. PM SVANidhi Subsidy Verifying (Govt Desk)</option>
                    <option value="manufacturing">3. In Factory Chassis & Solar Assembly</option>
                    <option value="dispatched">4. Dispatched / In Transit</option>
                    <option value="delivered">5. Delivered & Operational</option>
                  </select>
                </div>

                {/* Courier / Dispatch Info */}
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Courier / Waybill / Bank Ref ID
                  </label>
                  <input
                    type="text"
                    value={editCourier}
                    onChange={(e) => setEditCourier(e.target.value)}
                    placeholder="e.g. VRL Logistics Waybill #49021 or SBI Branch Ref"
                    className="w-full px-3 py-2 rounded-xl border border-[#F2EAE0] bg-[#FAF7F2] font-semibold text-neutral-800 focus:bg-white focus:ring-2 focus:ring-[#FFB800] focus:outline-hidden"
                  />
                </div>

                {/* Tracking Notes */}
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Factory & Logistics Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="e.g. Soundbox pre-programmed with vendor audio. Unit loaded in Lucknow transport hub."
                    className="w-full px-3 py-2 rounded-xl border border-[#F2EAE0] bg-[#FAF7F2] font-semibold text-neutral-800 focus:bg-white focus:ring-2 focus:ring-[#FFB800] focus:outline-hidden"
                  />
                </div>

                {/* Vendor Summary */}
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#F2EAE0] space-y-1 text-[11px] text-neutral-600">
                  <div className="flex justify-between">
                    <span className="font-semibold">Customer Name:</span>
                    <span className="font-bold text-[#1E1E24]">{selectedOrder.vendorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Phone:</span>
                    <span className="font-bold text-[#1E1E24]">+91 {selectedOrder.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Destination City:</span>
                    <span className="font-bold text-[#1E1E24]">{selectedOrder.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Selected Plan:</span>
                    <span className="font-bold text-[#E63946]">{selectedOrder.planType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl border border-[#F2EAE0] text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrderUpdate}
                  disabled={isUpdatingOrder}
                  className="px-5 py-2 rounded-xl bg-[#1E1E24] hover:bg-neutral-800 text-white text-xs font-black flex items-center space-x-1.5 shadow-md"
                >
                  {isUpdatingOrder ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFB800]" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Update Tracking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
