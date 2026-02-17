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
Property For: ${d.propertyFor || "-"}
Type: ${d.type || "-"}
Bedroom: ${d.bedroom || "-"}
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

      <div className="relative z-10 p-6 pb-24 max-w-7xl mx-auto">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="relative z-50 inline-flex items-center gap-2 mb-4 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ← Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-6">
          Client Demand Manager
        </h1>

        {/* ✅ FULL FORM RESTORED */}
        <div className="relative z-20 w-full border rounded-2xl p-5 mb-8 bg-white/90 backdrop-blur shadow-xl">
          <h2 className="font-bold text-lg mb-4">Add Client Demand</h2>

          <div className="grid md:grid-cols-4 gap-3">
            <input className={input} placeholder="Client Name" value={form.name} onChange={(e)=>setVal("name",e.target.value)} />
            <input className={input} placeholder="Mobile" value={form.mobile} onChange={(e)=>setVal("mobile",e.target.value)} />
            <input className={input} placeholder="Reference By" value={form.reference} onChange={(e)=>setVal("reference",e.target.value)} />

            <input list="propertyForList" className={input} placeholder="Property For"
              value={form.propertyFor} onChange={(e)=>setVal("propertyFor",e.target.value)} />
            <datalist id="propertyForList">
              <option value="Buy" />
              <option value="Rent" />
              <option value="Lease" />
            </datalist>

            <input className={input} placeholder="Type" value={form.type} onChange={(e)=>setVal("type",e.target.value)} />
            <input className={input} placeholder="New / Resale" value={form.condition} onChange={(e)=>setVal("condition",e.target.value)} />
            <input className={input} placeholder="Bedroom" value={form.bedroom} onChange={(e)=>setVal("bedroom",e.target.value)} />
            <input className={input} placeholder="Bath" value={form.bath} onChange={(e)=>setVal("bath",e.target.value)} />
            <input className={input} placeholder="Facing" value={form.facing} onChange={(e)=>setVal("facing",e.target.value)} />
            <input className={input} placeholder="Size" value={form.size} onChange={(e)=>setVal("size",e.target.value)} />
            <input className={input} placeholder="Min Price" value={form.minPrice} onChange={(e)=>setVal("minPrice",e.target.value)} />
            <input className={input} placeholder="Max Price" value={form.maxPrice} onChange={(e)=>setVal("maxPrice",e.target.value)} />
            <input className={input} placeholder="Locality" value={form.locality} onChange={(e)=>setVal("locality",e.target.value)} />
            <input type="date" className={input} value={form.followup} onChange={(e)=>setVal("followup",e.target.value)} />
          </div>

          <button onClick={addDemand}
            className="mt-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-2 rounded-xl font-semibold shadow-lg">
            Save Demand
          </button>
        </div>

        {/* 🔥 DEMAND LIST FULL DETAILS */}
        <div className="space-y-4">
          {demands.map((d) => {
            const matches = getMatches(d);

            return (
              <div key={d.id} className="rounded-2xl p-4 bg-white/80 backdrop-blur shadow-xl border">
                <div className="flex justify-between flex-wrap gap-2">
                  <h3 className="font-bold">{d.name} ({d.mobile})</h3>

                  <div className="flex gap-2 flex-wrap">
                    <button onClick={()=>setOpenDetail(openDetail===d.id?null:d.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs">
                      See Details
                    </button>

                    <button onClick={()=>shareWhatsApp(d)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs">
                      WhatsApp
                    </button>

                    {d.status!=="Closed" ? (
                      <button onClick={()=>closeDemand(d.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs">
                        Close
                      </button>
                    ):(
                      <button onClick={()=>deleteDemand(d.id)}
                        className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs">
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {openDetail===d.id && (
                  <div className="mt-3 grid md:grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-xl">
                    <div><b>Client Name:</b> {d.name||"-"}</div>
                    <div><b>Mobile:</b> {d.mobile||"-"}</div>
                    <div><b>Reference:</b> {d.reference||"-"}</div>
                    <div><b>Property For:</b> {d.propertyFor||"-"}</div>
                    <div><b>Type:</b> {d.type||"-"}</div>
                    <div><b>Condition:</b> {d.condition||"-"}</div>
                    <div><b>Bedroom:</b> {d.bedroom||"-"}</div>
                    <div><b>Bath:</b> {d.bath||"-"}</div>
                    <div><b>Facing:</b> {d.facing||"-"}</div>
                    <div><b>Size:</b> {d.size||"-"}</div>
                    <div><b>Budget:</b> ₹{d.minPrice||0} - ₹{d.maxPrice||0}</div>
                    <div><b>Locality:</b> {d.locality||"-"}</div>

                    <div className="md:col-span-2">
                      <button
                        onClick={()=>setOpenMatch(openMatch===d.id?null:d.id)}
                        className="text-purple-700 font-semibold underline">
                        Matching Properties ({matches.length})
                      </button>
                    </div>

                    {openMatch===d.id && (
                      <div className="md:col-span-2 space-y-2">
                        {matches.map((m:any)=>(
                          <div key={m.id} className="border rounded-lg p-2 bg-white">
                            <div><b>Type:</b> {m.type}</div>
                            <div><b>Price:</b> ₹{m.price}</div>
                            <div><b>Location:</b> {m.address}</div>
                            <Link href={`/property/${m.id}`}
                              className="text-blue-600 underline text-xs">
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
    </div>
  );
}


