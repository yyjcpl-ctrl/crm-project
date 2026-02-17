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

  const shareWhatsApp = (d: any) => {
    const text = `Client Requirement:
Name: ${d.name}
Mobile: ${d.mobile}
Property For: ${d.propertyFor || "-"}
Type: ${d.type || "-"}
Bedroom: ${d.bedroom || "-"}
Budget: ₹${d.minPrice || 0} - ₹${d.maxPrice || 0}
Locality: ${d.locality || "-"}`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const input =
    "w-full border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 p-2 rounded-lg text-sm outline-none transition";

  // ✅ load
  useEffect(() => {
    const p = localStorage.getItem("properties");
    const d = localStorage.getItem("demands");

    setProperties(p ? JSON.parse(p) : []);
    setDemands(d ? JSON.parse(d) : []);
  }, []);

  // 🗑 delete demand
  const deleteDemand = (id: number) => {
    const updated = demands.filter((d) => d.id !== id);
    setDemands(updated);
    localStorage.setItem("demands", JSON.stringify(updated));
  };

  // ✅ close demand
  const closeDemand = (id: number) => {
    const updated = demands.map((d) =>
      d.id === id ? { ...d, status: "Closed" } : d
    );
    setDemands(updated);
    localStorage.setItem("demands", JSON.stringify(updated));
  };

  // 🎯 match logic
  const getMatches = (demand: any) => {
    return properties.filter((item) => {
      const price = Number(item.price || 0);

      return (
        (!demand.type ||
          item.type?.toLowerCase().includes(demand.type.toLowerCase())) &&
        (!demand.condition ||
          item.condition?.toLowerCase().includes(
            demand.condition.toLowerCase()
          )) &&
        (!demand.bedroom || item.bedroom?.includes(demand.bedroom)) &&
        (!demand.bath || item.bath?.includes(demand.bath)) &&
        (!demand.facing ||
          item.facing?.toLowerCase().includes(
            demand.facing.toLowerCase()
          )) &&
        (!demand.size ||
          item.size?.toLowerCase().includes(demand.size.toLowerCase())) &&
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

        <div className="space-y-4">
          {demands.map((d) => {
            const matches = getMatches(d);

            return (
              <div
                key={d.id}
                className="rounded-2xl p-4 bg-white/80 backdrop-blur shadow-xl border"
              >
                <div className="flex justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold">
                      {d.name} ({d.mobile})
                    </h3>
                  </div>

                  <div className="flex gap-2 items-center flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        d.status === "Closed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {d.status}
                    </span>

                    <button
                      onClick={() =>
                        setOpenDetail(openDetail === d.id ? null : d.id)
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                    >
                      See Details
                    </button>

                    {/* ✅ WhatsApp */}
                    <button
                      onClick={() => shareWhatsApp(d)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                    >
                      WhatsApp
                    </button>

                    {d.status !== "Closed" && (
                      <button
                        onClick={() => closeDemand(d.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Close
                      </button>
                    )}

                    {d.status === "Closed" && (
                      <button
                        onClick={() => deleteDemand(d.id)}
                        className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* DETAILS */}
                {openDetail === d.id && (
                  <div className="mt-3 border rounded-xl p-3 text-sm bg-gray-50 space-y-1">
                    <div><b>Client:</b> {d.name}</div>
                    <div><b>Mobile:</b> {d.mobile}</div>
                    <div><b>Type:</b> {d.type || "-"}</div>
                    <div><b>Bedroom:</b> {d.bedroom || "-"}</div>
                    <div><b>Budget:</b> ₹{d.minPrice || 0} - ₹{d.maxPrice || 0}</div>
                    <div><b>Locality:</b> {d.locality || "-"}</div>

                    <button
                      onClick={() =>
                        setOpenMatch(openMatch === d.id ? null : d.id)
                      }
                      className="mt-3 text-purple-700 font-semibold underline"
                    >
                      Matching Properties ({matches.length})
                    </button>

                    {openMatch === d.id && (
                      <div className="mt-2 space-y-2">
                        {matches.length === 0 && (
                          <div className="text-gray-500">
                            No matching property
                          </div>
                        )}

                        {matches.map((m: any) => (
                          <div
                            key={m.id}
                            className="border rounded-lg p-2 bg-white"
                          >
                            <div><b>Type:</b> {m.type}</div>
                            <div><b>Price:</b> ₹{m.price}</div>
                            <div><b>Area:</b> {m.size}</div>
                            <div><b>Location:</b> {m.address}</div>

                            {/* ⭐ PROPERTY OPEN LINK */}
                            <Link
                              href={`/property/${m.id}`}
                              className="inline-block mt-1 text-blue-600 underline text-xs"
                            >
                              Open Property →
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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


