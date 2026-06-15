"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

const CustomersPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Route protection
  useEffect(() => {
    if (!authLoading && (!user || user.email !== "admin@techmarket.com")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const orders = await res.json();

      // Group orders by customer email
      const customerMap = {};
      
      orders.forEach((order) => {
        const email = order.contact?.email;
        if (!email) return;

        if (!customerMap[email]) {
          customerMap[email] = {
            name: order.contact?.name || "Unknown",
            email: email,
            phone: order.contact?.phone || "N/A",
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt,
            city: order.shipping?.city || "N/A"
          };
        }

        // Update totals
        customerMap[email].totalOrders += 1;
        customerMap[email].totalSpent += order.total || 0;
        
        // Update last order date if this order is more recent
        if (new Date(order.createdAt) > new Date(customerMap[email].lastOrderDate)) {
          customerMap[email].lastOrderDate = order.createdAt;
          // Also update name/phone/city to most recent
          customerMap[email].name = order.contact?.name || customerMap[email].name;
          customerMap[email].phone = order.contact?.phone || customerMap[email].phone;
          customerMap[email].city = order.shipping?.city || customerMap[email].city;
        }
      });

      const customerList = Object.values(customerMap).sort((a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate));
      setCustomers(customerList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.email === "admin@techmarket.com") {
      fetchCustomers();
    }
  }, [user]);

  if (authLoading || !user || user.email !== "admin@techmarket.com") {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-zinc-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-12 font-sans border-t border-zinc-900">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white neon-text-purple">Customers Dashboard</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage and view all registered customers and guests who placed orders.
            </p>
          </div>
          
          {/* Stats Summary */}
          <div className="flex gap-4">
            <div className="bg-[#0a0a0a] border border-cyan-500/30 px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.1)]">
              <span className="block text-[10px] font-bold text-cyan-500 uppercase tracking-widest">TOTAL CUSTOMERS</span>
              <span className="text-2xl font-black text-white neon-text-cyan">{loading ? "..." : customers.length}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#020202] border border-zinc-800 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-colors placeholder-zinc-600"
            />
          </div>
          <button onClick={fetchCustomers} className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-bold rounded-xl transition-all cursor-pointer">
            🔄 Refresh List
          </button>
        </div>

        {/* Customers Table */}
        <div className="bg-[#020202] border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-[#0a0a0a] border-b border-zinc-800 text-xs uppercase font-black tracking-wider text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Total Orders</th>
                  <th className="px-6 py-4 text-right">Total Spent</th>
                  <th className="px-6 py-4 text-right">Last Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 bg-[#050505]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4" />
                      Loading customers data...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-zinc-500 font-medium">
                      No customers found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.email} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 font-bold text-white shadow-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-white">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <a href={`mailto:${customer.email}`} className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">{customer.email}</a>
                          <span className="text-xs text-zinc-500 mt-0.5">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-300">
                        {customer.city}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          {customer.totalOrders} {customer.totalOrders === 1 ? 'Order' : 'Orders'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-pink-400">
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-zinc-400">
                        {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredCustomers.length > 0 && (
            <div className="px-6 py-4 border-t border-zinc-800 bg-[#0a0a0a] text-xs text-zinc-500 flex justify-between items-center">
              <span>Showing {filteredCustomers.length} customers</span>
              <span>Derived dynamically from order history.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomersPage;
