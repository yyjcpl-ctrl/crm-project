"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// 🔔 follow-up status helper
const getFollowStatus = (dateStr: string) => {
  if (!dateStr) return "none";

  const today = new Date();
  const fDate = new Date(dateStr);

  today.setHours(0, 0, 0, 0);
  fDate.setHours(0, 0, 0, 0);

  if (fDate.getTime() === today.getTime()) return "today";
  if (fDate.getTime() < today.getTime()) return "overdue";
  return "upcoming";
};

export default function DemandPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [demands, setDemands] = useState<any[]>([]);
  const [openDetail, setOpenDetail] = useState<number | null>(null);
  const [openMatch, setOpenMatch] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    reference: "",
    propertyFor: "",
    type: "",
    condition: "",
    bedroom: "",
    bath: "",
    facing: "",
    size: "",
    purpose: "",
    lead: "",
    minPrice: "",
    maxPrice: "",
    locality: "",
    followup: "",
  });

  const setVal = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const input =
    "w-full border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 p-2 rounded-lg text-sm outline-none transition";

  // load
  useEffect(() => {
    const p = localStorage.getItem("properties");
    const d = localStorage.getItem("demands");

    setProperties(p ? JSON.parse(p) : []);
    setDemands(d ? JSON.parse(d) : []);
  }, []);

  // add demand
  const addDemand = () => {
    if (!form.name) {
      alert("Enter client name");
      return;
    }

    const newDemand = {
      id: Date.now(),
      status: "Open",
      createdAt: new Date().toLocaleDateString(),
      ...form,
    };

    const updated = [newDemand, ...demands];
    setDemands(updated);
    localStorage.setItem("demands", JSON.stringify(updated));

    setForm({
      name: "",
      mobile: "",
      reference: "",
      propertyFor: "",
      type: "",
      condition: "",
      bedroom: "",
      bath: "",
      facing: "",
      size: "",
      purpose: "",
      lead: "",
      minPrice: "",
      maxPrice: "",
      locality: "",
      followup: "",
    });
  };

  // close demand
  const closeDemand = (id: number) => {
    const updated = demands.map((d) =>
      d.id === id ? { ...d, status: "Closed" } : d
    );
    setDemands(updated);
    localStorage.setItem("demands", JSON.stringify(updated));
  };

  // delete demand
  const deleteDemand = (id: number) => {
    const updated = demands.filter((d) => d.id !== id);
    setDemands(updated);
    localStorage.setItem("demands", JSON.stringify(updated));
  };

  // whatsapp
  const shareWhatsApp = (d: any) => {
    const text = `Client Requirement:
Name: ${d.name}
Mobile: ${d.mobile}
Budget: ₹${d.minPrice || 0} - ₹${d.maxPrice || 0}
Locality: ${d.locality || "-"}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // match logic
  const getMatches = (demand: any) => {
    return properties.filter((item) => {
      const price = Number(item.price || 0);

      return (
        (!demand.type ||
          item.type?.toLowerCase().includes(demand.type.toLowerCase())) &&
        (!demand.locality ||
          item.address?.toLowerCase().includes(
            demand.locality.toLowerCase()
          )) &&
        (!demand.minPrice || price >= Number(demand.minPrice)) &&
        (!demand.maxPrice || price <= Number(demand.maxPrice))
      );
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[length:400%_400%] bg-gradient-to-br from-indigo-200 via-white to-purple-200 animate-gradientMove" />

      <div className="p-6 pb-24 max-w-7xl mx-auto">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="relative z-50 inline-flex items-center gap-2 mb-4 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ← Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6">
          Client Demand Manager
        </h1>

        {/* FORM */}
        <div className="border rounded-2xl p-5 mb-8 bg-white/80 backdrop-blur shadow-xl">
          <h2 className="font-bold text-lg mb-4">Add Client Demand</h2>

          <div className="grid md:grid-cols-4 gap-3">
            <input className={input} placeholder="Client Name"
              value={form.name} onChange={(e) => setVal("name", e.target.value)} />

            <input className={input} placeholder="Mobile"
              value={form.mobile} onChange={(e) => setVal("mobile", e.target.value)} />

            <input className={input} placeholder="Reference By"
              value={form.reference} onChange={(e) => setVal("reference", e.target.value)} />

            <input list="propertyForList" className={input}
              placeholder="Property For"
              value={form.propertyFor}
              onChange={(e) => setVal("propertyFor", e.target.value)} />
            <datalist id="propertyForList">
              <option value="Buy" />
              <option value="Rent" />
              <option value="Lease" />
            </datalist>

            <input className={input} placeholder="Type"
              value={form.type} onChange={(e) => setVal("type", e.target.value)} />

            <input className={input} placeholder="New / Resale"
              value={form.condition} onChange={(e) => setVal("condition", e.target.value)} />

            <input className={input} placeholder="Bedroom"
              value={form.bedroom} onChange={(e) => setVal("bedroom", e.target.value)} />

            <input className={input} placeholder="Bath"
              value={form.bath} onChange={(e) => setVal("bath", e.target.value)} />

            <input className={input} placeholder="Facing"
              value={form.facing} onChange={(e) => setVal("facing", e.target.value)} />

            <input className={input} placeholder="Size"
              value={form.size} onChange={(e) => setVal("size", e.target.value)} />

            <input className={input} placeholder="Min Price"
              value={form.minPrice} onChange={(e) => setVal("minPrice", e.target.value)} />

            <input className={input} placeholder="Max Price"
              value={form.maxPrice} onChange={(e) => setVal("maxPrice", e.target.value)} />

            <input className={input} placeholder="Locality"
              value={form.locality} onChange={(e) => setVal("locality", e.target.value)} />

            <input type="date" className={input}
              value={form.followup} onChange={(e) => setVal("followup", e.target.value)} />
          </div>

          <button
            onClick={addDemand}
            className="mt-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-2 rounded-xl font-semibold shadow-lg"
          >
            Save Demand
          </button>
        </div>

        {/* DEMAND LIST */}
        <div className="space-y-4">
          {demands.map((d) => (
            <div key={d.id} className="rounded-2xl p-4 bg-white/80 backdrop-blur shadow-xl border">
              <h3 className="font-bold">
                {d.name} ({d.mobile})
              </h3>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientMove {
          animation: gradientMove 12s ease infinite;
        }
      `}</style>
    </div>
  );
}
