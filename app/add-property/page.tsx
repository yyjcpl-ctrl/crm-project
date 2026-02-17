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

  // ✅ AUTO DATE
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

  // ✅ SUBMIT (GOOGLE SHEET)
  const handleSubmit = async () => {
    if (!form.date) {
      alert("⚠️ Please fill the form first");
      return;
    }

    try {
      let payload: any = { ...form };

      // file convert
      if (form.file) {
        payload.fileBase64 = await toBase64(form.file);
        payload.fileType = form.file.type;
      }

      // ✅ Google Sheet API
      await fetch("/api/save-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ Local backup
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

          {/* FILE */}
          <div className="mt-4">
            <label className="font-semibold">Upload Photo/Video</label>
            <input
              type="file"
              className="w-full mt-2"
              onChange={(e) => setVal("file", e.target.files?.[0] || null)}
            />
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



