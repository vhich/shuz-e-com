import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import SideNav from "../components/SideNav";
import { FiPackage, FiTrendingUp, FiUsers, FiDollarSign } from "react-icons/fi";
import BottomSpace from "./../components/BottomSpace";
import { useEffect, useMemo } from "react";
import { useAppContext } from "../context/AppContent";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  Package,
  ShieldAlert,
  Info,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import Notification from "../components/Notification";

const AdminDashboard = () => {
  const { isLoggedIn } = useAppContext();

  const { orders, fetchOrders, notifications, userData } = useAppContext();

  const adminId = userData ? userData.id : null;

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="text-blue-500" size={20} />;
      case "auth":
        return <ShieldAlert className="text-red-500" size={20} />;
      default:
        return <Info className="text-slate-400" size={20} />;
    }
  };

  const yearlyData = useMemo(() => {
    const yearMap = {};

    orders.forEach((o) => {
      if (
        o.status?.toLowerCase() !== "cancelled" &&
        o.paymentStatus?.toLowerCase() === "paid" &&
        o.status?.toLowerCase() === "delivered"
      ) {
        const year = new Date(o.createdAt).getFullYear();
        yearMap[year] = (yearMap[year] || 0) + o.total;
      }
    });

    // Convert to array and sort by year (e.g., 2024, 2025, 2026)
    return Object.entries(yearMap)
      .map(([year, amount]) => ({ year, amount }))
      .sort((a, b) => a.year - b.year);
  }, [orders]);

  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize all months with 0 revenue
    const report = months.map((month) => ({ month, revenue: 0 }));

    orders.forEach((o) => {
      if (
        o.status?.toLowerCase() !== "cancelled" &&
        o.paymentStatus?.toLowerCase() === "paid" &&
        o.status?.toLowerCase() === "delivered"
      ) {
        const orderDate = new Date(o.createdAt);
        // Only count orders from the current year (2026)
        if (orderDate.getFullYear() === 2026) {
          const monthIndex = orderDate.getMonth(); // 0 = Jan, 1 = Feb...
          report[monthIndex].revenue += o.total;
        }
      }
    });

    return report;
  }, [orders]);

  const chartData = useMemo(() => {
    // 1. Group revenue by day (Last 7 days)
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString("en-US", { weekday: "short" });
      })
      .reverse();

    const revenueByDay = last7Days.map((day) => {
      const dailyTotal = orders
        .filter(
          (o) =>
            new Date(o.createdAt).toLocaleDateString("en-US", {
              weekday: "short",
            }) === day && o.status !== "Cancelled",
        )
        .reduce((sum, o) => sum + o.total, 0);
      return { name: day, revenue: dailyTotal };
    });

    // 2. Group by Category (for the Pie Chart)
    const nameCounts = {};
    orders.forEach((o) =>
      o.items.forEach((item) => {
        nameCounts[item.name] = (nameCounts[item.name] || 0) + 1;
      }),
    );

    const pieData = Object.entries(nameCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return { revenueByDay, pieData };
  }, [orders]);

  const topSellingProducts = useMemo(() => {
    const productData = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const name = item.name;
        if (!productData[name]) {
          productData[name] = {
            name: name,
            sales: 0,
            // Grab the image from the first time we see this product
            image:
              item.image || item.thumbnail || (item.images && item.images[0]),
          };
        }
        productData[name].sales += item.quantity || 1;
      });
    });

    return Object.values(productData)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 3);
  }, [orders]);

  const customerStats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { count: 0, list: [] };
    }

    const uniqueCustomers = {};

    orders.forEach((order) => {
      const email = order.customerDetails?.username?.toLowerCase().trim();
      if (email && !uniqueCustomers[email]) {
        // Store the first instance of this customer we find
        uniqueCustomers[email] = {
          name: `${order.customerDetails.firstName} ${order.customerDetails.lastName}`,
          email: email,
          telephone: order.customerDetails.telephone,
          // you can add more fields here if needed
        };
      }
    });

    const customerList = Object.values(uniqueCustomers);

    return {
      count: customerList.length,
      list: customerList,
    };
  }, [orders]);

  const statsInfo = useMemo(() => {
    // 1. Calculate Revenue (Only Paid and Not Cancelled)
    const confirmedRevenue = orders.reduce((sum, o) => {
      return o.paymentStatus?.toLowerCase() === "paid" &&
        o.status?.toLowerCase() === "delivered" &&
        o.status !== "Cancelled"
        ? sum + o.total
        : sum;
    }, 0);

    return {
      confirmedRevenue,
      totalOrders: orders.length,
    };
  }, [orders]);
  const stats = [
    {
      id: 1,
      label: "Total Revenue",
      value:
        statsInfo.confirmedRevenue > 0
          ? `$${statsInfo.confirmedRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "$0.00",
      icon: <FiDollarSign />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 2,
      label: "Orders",
      value: statsInfo.totalOrders,
      icon: <FiPackage />,
      color: "bg-green-50 text-green-600",
    },
    {
      id: 3,
      label: "Customers",
      value: customerStats.count,
      icon: <FiUsers />,
      color: "bg-teal-50 text-teal-600",
    },
    {
      id: 4,
      label: "Growth",
      value: "+12.5%",
      icon: <FiTrendingUp />,
      color: "bg-lime-50 text-lime-600",
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate, isLoggedIn]);

  useEffect(() => {
    document.title = "Admin Dashboard - Overview";
    document.body.style.overflowY = "hidden";
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <AdminNavbar />
      <main className="w-screen">
        <div className="grid lg:grid-cols-[15%_85%] sm:grid-cols-1">
          <SideNav />
          <section className="bg-green-50 h-lvh w-full overflow-y-auto py-12 px-2 md:px-10 lg:px-15">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h5 className="text-3xl font-black text-gray-900">
                  Store Overview
                </h5>
                <p className="text-gray-500">
                  Welcome back, Admin. Here's what's happening today.
                </p>
              </div>
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95">
                Download Report
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 my-4">
              {stats.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium! text-gray-400">
                      {item.label}
                    </p>
                    <p className="text-xl! font-medium! text-gray-900 text-wrap">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-10">
                <div className="flex flex-col mb-8">
                  <h6 className="font-black text-xl text-gray-900">
                    Annual Growth
                  </h6>
                  <p className="text-gray-500 text-sm">
                    Comparison of total revenue by year
                  </p>
                </div>

                <div className="h-87.5 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={yearlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#64748b",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        tickFormatter={(value) =>
                          `$${(value / 1000000).toLocaleString(undefined, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })}M`
                        } // Formats 1,000,000 as 1.0M
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [
                          `$${value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                          "Total Revenue",
                        ]}
                      />
                      <Bar
                        dataKey="amount"
                        radius={[10, 10, 0, 0]} // Makes the top of the bars rounded
                        barSize={60}
                      >
                        {yearlyData.map((entry, index) => (
                          // Highlights the current year (2026) in a different shade of emerald
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.year === "2026" ? "#047857" : "#10b981"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-10">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h6 className="font-black text-xl text-gray-900">
                      Monthly Performance
                    </h6>
                    <p className="text-gray-500 text-sm">
                      Revenue breakdown for the year 2026
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                      Current Year
                    </span>
                  </div>
                </div>

                <div className="h-87.5 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        tickFormatter={(val) =>
                          `$${
                            val >= 1000
                              ? (val / 1000).toLocaleString(undefined, {
                                  minimumFractionDigits: 1,
                                  maximumFractionDigits: 1,
                                }) + "k"
                              : val
                          }`
                        }
                      />
                      <Tooltip
                        cursor={{ fill: "#f1f5f9", radius: 10 }}
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [
                          `$${value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                          "Monthly Revenue",
                        ]}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#3b82f6"
                        radius={[6, 6, 6, 6]} // Fully rounded "capsule" look
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Lower Section: Recent Orders & Inventory Alert */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
              {/* Revenue Area Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h6 className="font-black text-xl text-gray-900">
                    Revenue Flow
                  </h6>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                    Last 7 Days
                  </span>
                </div>

                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.revenueByDay}>
                      <defs>
                        <linearGradient
                          id="colorRev"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [
                          `$${value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution (Pie Chart) */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center row-1">
                <h6 className="font-black text-xl text-gray-900 self-start mb-6">
                  Sales Category
                </h6>
                <div className="h-62.5 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {chartData.pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"][
                                index % 4
                              ]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                  {chartData.pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: [
                            "#10b981",
                            "#3b82f6",
                            "#f59e0b",
                            "#ef4444",
                          ][index % 4],
                        }}
                      ></div>
                      <span className="text-xs font-bold text-gray-500 truncate">
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent Activity Table */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h6 className="font-black text-xl text-gray-900">
                    Recent Transactions
                  </h6>
                  <button
                    onClick={() => navigate("/admin/orders")}
                    className="text-emerald-600 font-bold text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.slice(0, 5).map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 uppercase text-xs!">
                            #{order._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {order.customerDetails.firstName}{" "}
                            {order.customerDetails.lastName}
                          </td>
                          <td className="px-6 py-4 font-medium text-xs! text-gray-900">
                            $
                            {order.total.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs! font-medium ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Selling Products Card */}
              <div className="bg-emerald-900 rounded-3xl p-4 text-white flex flex-col justify-between shadow-xl">
                <div>
                  <h6 className="mb-2">Top Sellers</h6>
                  <p className="text-emerald-200 text-xs! leading-relaxed">
                    Your best performing sneakers based on recent order volume.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {topSellingProducts.length > 0 ? (
                    topSellingProducts.map((product, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-800/50 p-2.5 rounded-2xl flex gap-3 items-center justify-between border border-emerald-700/30"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 overflow-hidden rounded-full flex items-center justify-center bg-emerald-700 text-white font-bold ">
                            <img
                              src={product.image}
                              alt={product.name}
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/50")
                              }
                              className="object-contain"
                            />
                          </span>
                          <span className="text-sm! font-medium! truncate max-w-25">
                            {product.name}
                          </span>
                        </div>

                        <span className="bg-emerald-500 text-xs! px-1 py-1 rounded-lg">
                          {product.sales} Sold
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-emerald-400 text-xs italic">
                      No sales data yet.
                    </p>
                  )}

                  <button
                    onClick={() => navigate("/admin/products")}
                    className="w-full bg-white text-emerald-900 py-4 rounded-2xl text-sm! hover:bg-emerald-50 transition-all active:scale-95 mt-4"
                  >
                    Manage Inventory
                  </button>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-[60%_40%] gap-5 mt-10">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <header className="flex items-center justify-between mb-4">
                  <p className="text-2xl! font-medium! text-slate-700">
                    Customers
                  </p>
                  <NavLink
                    to="/admin/customers"
                    className="text-sm! text-blue-600 hover:text-blue-800 font-medium!"
                  >
                    View All
                  </NavLink>
                </header>
                <div className="overflow-auto">
                  <table className="w-full text-left bg-slate-50">
                    <thead className="bg-slate-100 text-gray-400 text-xs capitalize tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">email</th>
                        <th className="px-6 py-4">telephone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm!">
                      {customerStats.list.map((customer, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4">{customer.name}</td>
                          <td className="px-6 py-4">{customer.email}</td>
                          <td className="px-6 py-4">{customer.telephone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <header className="flex items-center justify-between">
                  <p className="text-2xl! font-medium! text-slate-700">
                    New Notifications
                  </p>
                  <NavLink
                    to="/admin/notifications"
                    className="text-sm! text-blue-600 hover:text-blue-800 font-medium!"
                  >
                    View All
                  </NavLink>
                </header>

                {notifications && notifications.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
                    <CheckCircle
                      className="mx-auto text-slate-300 mb-4"
                      size={40}
                    />
                    <p className="text-slate-400 font-bold">
                      All caught up! No new alerts.
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 3).map((notif) => {
                    const isRead = notif.readBy.some(
                      (r) => r.adminId === adminId,
                    );

                    return (
                      <Notification
                        key={notif._id}
                        isRead={isRead}
                        notif={notif}
                        getIcon={getIcon(notif.type)}
                      />
                    );
                  })
                )}
              </div>
            </div>
            {/* to create space under the dashboad section */}
            <BottomSpace />
          </section>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
