import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Package,
  Eye,
  ExternalLink,
  Search,
  Filter,
  Download,
  DollarSign,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Loading from "../components/Loading";
import SideNav from "../components/SideNav";
import BottomSpace from "../components/BottomSpace";
import { useAppContext } from "../context/AppContent";
import AdminNavbar from "../components/AdminNavbar";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { loading, setLoading, backendUrl, isLoggedIn, fetchOrders, orders } =
    useAppContext();

  // --- KPI CALCULATIONS ---
  const stats = useMemo(() => {
    const confirmedRevenue = orders.reduce((sum, o) => {
      // Standardizing case to avoid 'Paid' vs 'paid' bugs
      const isPaid = o.paymentStatus?.toLowerCase() === "paid";
      const isDelivered = o.status?.toLowerCase() === "delivered";
      const isNotCancelled = o.status?.toLowerCase() !== "cancelled";

      // Strictly: Only money from successful, finished transactions
      return isPaid && isDelivered && isNotCancelled ? sum + o.total : sum;
    }, 0);

    // New Metric: Total Cash Handled (Money currently in your account, including pending deliveries)
    const cashInHand = orders.reduce((sum, o) => {
      return o.paymentStatus?.toLowerCase() === "paid" ? sum + o.total : sum;
    }, 0);

    return {
      confirmedRevenue, // Money from finished business
      cashInHand, // Total money received (may include items not yet shipped)
      pendingOrders: orders.filter((o) => o.status === "Pending").length,
      completedOrders: orders.filter((o) => o.status === "Delivered").length,
      totalOrders: orders.length,
    };
  }, [orders]);

  // --- FILTERED ORDERS ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDetails.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customerDetails.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter ||
        order.paymentStatus.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const updateStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/order/status`,
        {
          orderId,
          status: newStatus,
        },
        { withCredentials: true },
      );
      if (data.success) {
        fetchOrders();
        toast.success(`Order updated to ${newStatus}`);
      }
    } catch (err) {
      console.log(err);

      alert("Status update failed");
    }
  };
  const updatePayment = async (orderId, newPayment) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/order/payment-status`,
        {
          orderId,
          paymentStatus: newPayment,
        },
        { withCredentials: true },
      );
      if (data.success) {
        fetchOrders();
        toast.success(data.message);
      }
    } catch (err) {
      console.log(err);

      alert("Status update failed");
    }
  };

  useEffect(() => {
    fetchOrders();
    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    document.title = "Admin Dashboard - Orders";
    document.body.style.overflowY = "hidden";
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    !isLoggedIn && navigate("/");
  }, [isLoggedIn, navigate]);

  // Inside your component:
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    // Calculate starting position
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    // Calculate how far we've moved
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplier '2' determines scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <AdminNavbar />
      <main className="w-screen">
        <div className="grid lg:grid-cols-[15%_85%] sm:grid-cols-1">
          <SideNav />
          <section className="bg-green-50 h-screen w-full overflow-y-auto py-12 px-2 md:px-10 lg:px-15">
            <div className="bg-slate-50 font-sans">
              <div className="mx-auto">
                {/* --- 1. TOP NAV & STATS --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                  <div>
                    <h5 className="text-4xl font-black text-slate-900 tracking-tight">
                      Orders Hub
                    </h5>
                    <p className="text-slate-500 font-medium">
                      Real-time management of store transactions.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={fetchOrders}
                      className="bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      Refresh
                    </button>
                    <button className="bg-black text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-black/10">
                      <Download size={18} /> Export CSV
                    </button>
                  </div>
                </div>

                {/* --- 2. KPI TILES --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-10">
                  <StatCard
                    title="Confirmed Revenue"
                    value={`$${stats.confirmedRevenue.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}`}
                    icon={<DollarSign className="text-green-600" />}
                    color="bg-green-100"
                  />
                  <StatCard
                    title="Cash in Hand"
                    value={`$${stats.cashInHand.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                    icon={<DollarSign className="text-green-600" />}
                    color="bg-green-100"
                  />
                  <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<ShoppingBag className="text-blue-600" />}
                    color="bg-blue-100"
                  />
                  <StatCard
                    title="Pending"
                    value={stats.pendingOrders}
                    icon={<AlertCircle className="text-orange-600" />}
                    color="bg-orange-100"
                  />
                  <StatCard
                    title="Completed"
                    value={stats.completedOrders}
                    icon={<CheckCircle2 className="text-emerald-600" />}
                    color="bg-emerald-100"
                  />
                </div>

                <p className="text-gray-500 text-sm">
                  Showing {filteredOrders.length} of {orders.length} items
                </p>

                {/* --- 3. FILTER BAR --- */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search by ID, Name, or Email..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-black outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter size={20} className="text-slate-400" />
                    <select
                      className="bg-slate-50 border-none rounded-xl px-4 py-3 font-medium text-sm outline-none cursor-pointer"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>

                {/* --- 4. DATA TABLE --- */}
                <div className="bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden">
                  <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`overflow-x-auto select-none ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                  >
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 text-gray-200 text-[10px] uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-5">Order Ref</th>
                          <th className="px-8 py-5">Customer info</th>
                          <th className="px-8 py-5">Products</th>
                          <th className="px-8 py-5">Amount</th>
                          <th className="px-8 py-5">Status Tracking</th>
                          <th className="px-8 py-5 text-center whitespace-nowrap">
                            Payment Status
                          </th>
                          <th className="px-8 py-5 text-center">Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => (
                          <tr
                            key={order._id}
                            className="group hover:bg-slate-50/80 transition-all"
                          >
                            <td className="px-8 py-6">
                              <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-lg text-xs! block w-fit! mb-1 group-hover:bg-white transition-colors">
                                #{order.orderId}
                              </span>
                              <p className=" text-slate-500 mt-1.5 flex flex-col gap-1">
                                <span className="font-medium text-xs!">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                                <span className="text-xs!">
                                  {new Date(order.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="font-black text-slate-900 text-sm leading-none! mb-1">
                                {order.customerDetails.firstName}{" "}
                                {order.customerDetails.lastName}
                              </p>
                              <p className="text-xs text-slate-400 font-medium">
                                {order.customerDetails.email}
                              </p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex -space-x-3">
                                {order.items.map((item, i) => (
                                  <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm"
                                  >
                                    <img
                                      src={item.image}
                                      className="w-full h-full object-cover"
                                      title={item.name}
                                    />
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="font-black text-slate-900 tracking-tight">
                                $
                                {order.total.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">
                                {order.paymentMethod}
                              </p>
                            </td>
                            <td className="px-8 py-6">
                              {order.status.toLowerCase() !== "delivered" ? (
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    updateStatus(order.orderId, e.target.value)
                                  }
                                  className={`text-[11px] px-4 py-2 rounded-sm border-none outline-none cursor-pointer transition-all shadow-sm
                          ${order.status === "Pending" ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : ""}
                          ${order.status === "Shipped" ? "bg-blue-100 text-blue-600 hover:bg-blue-200" : ""}
                          ${order.status === "Delivered" ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" : ""}
                          ${order.status === "Cancelled" ? "bg-red-100 text-red-600 hover:bg-red-200" : ""}
                        `}
                                >
                                  {order.status !== "Cancelled" ? (
                                    <>
                                      <option
                                        disabled={
                                          order.status.toLowerCase() ==
                                            "shipped" ||
                                          order.status.toLowerCase() ===
                                            "processing"
                                        }
                                        value="Pending"
                                      >
                                        Pending
                                      </option>
                                      <option
                                        disabled={
                                          order.status.toLowerCase() ==
                                          "shipped"
                                        }
                                        value="Processing"
                                      >
                                        Processing
                                      </option>
                                      <option
                                        value="Shipped"
                                        disabled={
                                          order.paymentStatus.toLowerCase() !==
                                          "paid"
                                        }
                                      >
                                        Shipped
                                      </option>
                                      <option
                                        value="Delivered"
                                        disabled={
                                          order.paymentStatus.toLowerCase() !==
                                          "paid"
                                        }
                                      >
                                        Delivered
                                      </option>
                                      <option
                                        disabled={
                                          order.status.toLowerCase() ==
                                          "shipped"
                                        }
                                        value="Cancelled"
                                      >
                                        Cancel
                                      </option>
                                    </>
                                  ) : (
                                    <option disabled>Cancelled</option>
                                  )}
                                </select>
                              ) : (
                                <small className="text-green-500 text-center! px-4 py-2 ">
                                  Delivered
                                </small>
                              )}
                            </td>
                            <td className="px-8 py-6">
                              <div className=" text-center">
                                {order.paymentMethod !== "stripe" && (
                                  <select
                                    disabled={
                                      order.status.toLowerCase() === "cancelled"
                                    }
                                    value={order.paymentStatus}
                                    onChange={(e) =>
                                      updatePayment(
                                        order.orderId,
                                        e.target.value,
                                      )
                                    }
                                    className={`text-[12px] px-4 py-2 rounded-sm border-none outline-none cursor-pointer transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed
                          ${order.paymentStatus.toLowerCase() === "unpaid" && "text-red-600 hover:bg-red-200"}
                          ${order.paymentStatus.toLowerCase() === "paid" && "text-green-600 hover:bg-blue-200"}`}
                                  >
                                    {order.paymentStatus.toLowerCase() ===
                                    "unpaid" ? (
                                      <>
                                        <option value="unpaid">Unpaid</option>
                                        <option value="paid">Paid</option>
                                      </>
                                    ) : (
                                      <option disabled value="paid">
                                        Paid
                                      </option>
                                    )}
                                  </select>
                                )}
                                {order.paymentMethod === "stripe" && (
                                  <small
                                    className={`${order.paymentStatus.toLowerCase() === "unpaid" ? "text-red-500" : "text-green-500"}`}
                                  >
                                    {order.paymentStatus}
                                  </small>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center items-center gap-2">
                                <NavLink
                                  to={`/admin/order-details?id=${order.orderId}&email=${order.customerDetails.email}`}
                                  rel="noreferrer"
                                  className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-black hover:text-white transition-all shadow-sm"
                                >
                                  <ExternalLink size={16} />
                                </NavLink>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <BottomSpace />
          </section>
        </div>
      </main>
    </>
  );
}

// Sub-component for KPI cards
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
      <div className={`${color} p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </p>
        <p className="text-2xl font-black text-slate-900 leading-none mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}
