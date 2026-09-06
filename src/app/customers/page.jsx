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
      <div className="min-h-screen bg-surface text-ink-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const escapeCSV = (value) => {
    const str = value == null ? "" : String(value);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExportCSV = () => {
    const rows = filteredCustomers.length > 0 ? filteredCustomers : customers;
    if (rows.length === 0) return;

    const headers = [
      "Name", "Email", "Phone", "City",
      "Total Orders", "Total Spent (BDT)", "Last Order Date",
    ];

    const csvRows = rows.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.city,
      c.totalOrders,
      c.totalSpent,
      new Date(c.lastOrderDate).toLocaleDateString(),
    ].map(escapeCSV).join(","));

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-surface text-ink p-4 sm:p-12 font-sans border-t border-line">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">Customers Dashboard</h1>
            <p className="text-ink-2 text-sm mt-1">
              Manage and view all registered customers and guests who placed orders.
            </p>
          </div>
          
          {/* Stats Summary */}
          <div className="flex gap-4">
            <div className="bg-surface-2 border border-cyan-500/30 px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.1)]">
              <span className="block text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">TOTAL CUSTOMERS</span>
              <span className="text-2xl font-black text-ink">{loading ? "..." : customers.length}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-surface-2 border border-line rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-ink-3 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-3 border border-cyan-500/30 text-ink rounded-xl text-sm focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors placeholder-ink-3"
            />
          </div>
          <button onClick={handleExportCSV} disabled={loading || customers.length === 0} className="px-4 py-2.5 bg-surface-3 hover:bg-surface-4 disabled:opacity-50 border border-line-strong text-ink text-sm font-bold rounded-xl transition-all cursor-pointer">
            📥 Export CSV
          </button>
          <button onClick={fetchCustomers} className="px-4 py-2.5 bg-surface-3 hover:bg-surface-4 border border-line-strong text-ink text-sm font-bold rounded-xl transition-all cursor-pointer">
            🔄 Refresh List
          </button>
        </div>

        {/* Customers Table */}
        <div className="bg-surface-2 border border-line rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-2">
              <thead className="bg-surface-4 border-b border-line text-xs uppercase font-black tracking-wider text-ink-3">
                <tr>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Total Orders</th>
                  <th className="px-6 py-4 text-right">Total Spent</th>
                  <th className="px-6 py-4 text-right">Last Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-ink-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4" />
                      Loading customers data...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-ink-3 font-medium">
                      No customers found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.email} className="hover:bg-surface-4 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 font-bold text-ink shadow-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-ink">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <a href={`mailto:${customer.email}`} className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline transition-colors">{customer.email}</a>
                          <span className="text-xs text-ink-3 mt-0.5">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-ink-2">
                        {customer.city}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          {customer.totalOrders} {customer.totalOrders === 1 ? 'Order' : 'Orders'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-pink-600 dark:text-pink-400">
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-ink-2">
                        {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredCustomers.length > 0 && (
            <div className="px-6 py-4 border-t border-line bg-surface-4 text-xs text-ink-3 flex justify-between items-center">
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
