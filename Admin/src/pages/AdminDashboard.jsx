import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import SideNav from "../components/SideNav";
import { FiPackage, FiTrendingUp, FiUsers, FiDollarSign } from "react-icons/fi";
import BottomSpace from "./../components/BottomSpace";
import { useEffect } from "react";
import { useAppContext } from "../context/AppContent";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { isLoggedIn } = useAppContext();
  // Dummy stats for now - we'll connect these to the DB later
  const stats = [
    {
      id: 1,
      label: "Total Revenue",
      value: "₦1,250,000",
      icon: <FiDollarSign />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 2,
      label: "Orders",
      value: "142",
      icon: <FiPackage />,
      color: "bg-green-50 text-green-600",
    },
    {
      id: 3,
      label: "Customers",
      value: "892",
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

  return (
    <>
      <AdminNavbar />
      <main className="w-screen">
        <div className="grid lg:grid-cols-[15%_85%] sm:grid-cols-1">
          <SideNav />
          <section className="bg-gray-50 h-lvh w-full overflow-y-auto py-12 px-2 md:px-10 lg:px-15">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
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
                    <p className="text-2xl! font-medium! text-gray-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lower Section: Recent Orders & Inventory Alert */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity Table */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h6 className="font-black text-xl text-gray-900">
                    Recent Transactions
                  </h6>
                  <button className="text-emerald-600 font-bold text-sm hover:underline">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[1, 2, 3].map((row) => (
                        <tr
                          key={row}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            #SH-992{row}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            Air Force 1 '07
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            ₦65,000
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock Alert Card */}
              <div className="bg-emerald-900 rounded-3xl p-8 text-white flex flex-col justify-between">
                <div>
                  <h6 className="text-2xl font-bold mb-2">Inventory Alert</h6>
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    Some items in your "Running Shoes" category are running low
                    on stock. Check the sizes soon.
                  </p>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="bg-emerald-800/50 p-4 rounded-2xl flex justify-between items-center">
                    <span className="text-sm">Vomero 17</span>
                    <span className="bg-red-500 text-[10px] px-2 py-1 rounded-lg font-bold">
                      2 LEFT
                    </span>
                  </div>
                  <button className="w-full bg-white text-emerald-900 py-4 rounded-2xl font-black hover:bg-emerald-50 transition-colors">
                    Restock Now
                  </button>
                </div>
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
