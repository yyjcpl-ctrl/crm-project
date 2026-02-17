"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AddPropertyPage() {
  const initialForm = {
    date: "",
    propertyFor: "",
    condition: "",
    type: "",
    bedroom: "",
    bath: "",
    size: "",
    facing: "",
    totalFloor: "",
    floorNo: "",
    road: "",
    furnished: "",
    parking: "",
    contact: "",
    referenceBy: "",
    projectName: "",
    address: "",
    additional: "",
    minPrice: "",
    maxPrice: "",
    file: null as File | null,
  };

  const [form, setForm] = useState<any>(initialForm);

  const setVal = (k: string, v: any) =>
    setForm((p: any) => ({ ...p, [k]: v }));

  const input =
    "w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition bg-white";

  // ✅ AUTO DATE (user change ko override nahi karega)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm((p: any) => ({ ...p, date: p.date || today }));
  }, []);

  // 🔥 file → base64
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
    });

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (!form.date) {
      alert("⚠️ Please fill the form first");
      return;
    }

    try {
      let payload: any = { ...form };

      if (form.file) {
        payload.fileBase64 = await toBase64(form.file);
        payload.fileType = form.file.type;
      }

      // ✅ Google Sheet
      await fetch("/api/save-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ Local storage
      const existing = localStorage.getItem("properties");
      const properties = existing ? JSON.parse(existing) : [];

      properties.unshift({
        id: Date.now(),
        price: form.maxPrice || form.minPrice || "",
        ...form,
      });

      localStorage.setItem("properties", JSON.stringify(properties));

      alert("✅ Property Saved Successfully!");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving property");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/dashboard"
          className="inline-block mb-4 bg-white/90 px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          ← Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            ➕ Add Property
          </h1>

          {/* ROW 1 */}
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="date"
              className={input}
              value={form.date || ""}
              onChange={(e) => setVal("date", e.target.value)}
            />

            <input
              list="propertyForList"
              placeholder="Property For"
              className={input}
              value={form.propertyFor || ""}
              onChange={(e) => setVal("propertyFor", e.target.value)}
            />
            <datalist id="propertyForList">
              <option value="Sale" />
              <option value="Rent" />
              <option value="Lease" />
            </datalist>

            <input
              list="typeList"
              placeholder="Type"
              className={input}
              value={form.type || ""}
              onChange={(e) => setVal("type", e.target.value)}
            />
            <datalist id="typeList">
              <option value="Flat" />
              <option value="Villa" />
              <option value="Plot" />
              <option value="G+2" />
              <option value="G+3" />
            </datalist>
          </div>

          {/* ROW 2 */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input list="conditionList" placeholder="New / Resale" className={input}
              value={form.condition || ""}
              onChange={(e) => setVal("condition", e.target.value)} />
            <datalist id="conditionList">
              <option value="New" />
              <option value="Resale" />
            </datalist>

            <input list="sizeList" placeholder="Size" className={input}
              value={form.size || ""}
              onChange={(e) => setVal("size", e.target.value)} />
            <datalist id="sizeList">
              <option value="50 Gaj" />
              <option value="100 Gaj" />
              <option value="150 Gaj" />
            </datalist>
          </div>

          {/* ROW 3 */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input list="bedroomList" placeholder="Bedroom" className={input}
              value={form.bedroom || ""}
              onChange={(e) => setVal("bedroom", e.target.value)} />
            <datalist id="bedroomList">
              <option value="1" />
              <option value="2" />
              <option value="3" />
              <option value="4" />
            </datalist>

            <input list="bathList" placeholder="Bathroom" className={input}
              value={form.bath || ""}
              onChange={(e) => setVal("bath", e.target.value)} />
            <datalist id="bathList">
              <option value="1" />
              <option value="2" />
              <option value="3" />
            </datalist>
          </div>

          {/* ROW 4 */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input list="floorNoList" placeholder="Floor No" className={input}
              value={form.floorNo || ""}
              onChange={(e) => setVal("floorNo", e.target.value)} />
            <datalist id="floorNoList">
              <option value="Ground" />
              <option value="1" />
              <option value="2" />
            </datalist>

            <input list="totalFloorList" placeholder="Total Floor" className={input}
              value={form.totalFloor || ""}
              onChange={(e) => setVal("totalFloor", e.target.value)} />
            <datalist id="totalFloorList">
              <option value="1" />
              <option value="2" />
              <option value="3" />
            </datalist>
          </div>

          {/* ROW 5 */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input list="facingList" placeholder="Facing" className={input}
              value={form.facing || ""}
              onChange={(e) => setVal("facing", e.target.value)} />
            <datalist id="facingList">
              <option value="North" />
              <option value="South" />
              <option value="East" />
              <option value="West" />
            </datalist>

            <input list="roadList" placeholder="Road" className={input}
              value={form.road || ""}
              onChange={(e) => setVal("road", e.target.value)} />
            <datalist id="roadList">
              <option value="20 ft" />
              <option value="30 ft" />
              <option value="40 ft" />
            </datalist>
          </div>

          {/* ROW 6 */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input list="furnishList" placeholder="Furnished" className={input}
              value={form.furnished || ""}
              onChange={(e) => setVal("furnished", e.target.value)} />
            <datalist id="furnishList">
              <option value="Full Furnished" />
              <option value="Semi Furnished" />
              <option value="Unfurnished" />
            </datalist>

            <input list="parkingList" placeholder="Parking" className={input}
              value={form.parking || ""}
              onChange={(e) => setVal("parking", e.target.value)} />
            <datalist id="parkingList">
              <option value="1" />
              <option value="2" />
              <option value="3" />
            </datalist>
          </div>

          {/* 💰 BUDGET */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input placeholder="Min Budget" className={input}
              value={form.minPrice || ""}
              onChange={(e) => setVal("minPrice", e.target.value)} />
            <input placeholder="Max Budget" className={input}
              value={form.maxPrice || ""}
              onChange={(e) => setVal("maxPrice", e.target.value)} />
          </div>

          {/* CONTACT */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input placeholder="Contact Person" className={input}
              value={form.contact || ""}
              onChange={(e) => setVal("contact", e.target.value)} />
            <input placeholder="Reference By" className={input}
              value={form.referenceBy || ""}
              onChange={(e) => setVal("referenceBy", e.target.value)} />
          </div>

          <input placeholder="Project Name" className={`${input} mt-4`}
            value={form.projectName || ""}
            onChange={(e) => setVal("projectName", e.target.value)} />

          <textarea placeholder="Address" className={`${input} mt-4`}
            value={form.address || ""}
            onChange={(e) => setVal("address", e.target.value)} />

          <textarea placeholder="Additional Details" className={`${input} mt-4`}
            value={form.additional || ""}
            onChange={(e) => setVal("additional", e.target.value)} />

          {/* FILE */}
          <div className="mt-4">
            <label className="font-semibold">Upload Photo/Video</label>
            <input type="file" className="w-full mt-2"
              onChange={(e) => setVal("file", e.target.files?.[0] || null)} />
          </div>

          {/* BUTTON */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-6 py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
            hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            🚀 Save Property
          </button>

        </div>
      </div>
    </div>
  );
}

