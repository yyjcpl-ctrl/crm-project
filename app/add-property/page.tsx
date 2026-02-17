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
    files: [] as File[],
  };

  const [form, setForm] = useState<any>(initialForm);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const setVal = (k: string, v: any) =>
    setForm((p: any) => ({ ...p, [k]: v }));

  const input =
    "w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl outline-none transition bg-white";

  // ✅ AUTO DATE
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm((p: any) => ({ ...p, date: p.date || today }));
  }, []);

  // 🔥 number formatter
  const formatPrice = (val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 🔥 multi file preview
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm((p: any) => ({ ...p, files: arr }));

    const urls = arr.map((f) => URL.createObjectURL(f));
    setPreview(urls);
  };

  // 🔥 file → base64
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
    });

  // ✅ VALIDATION
  const validate = () => {
    if (!form.propertyFor) return "Select Property For";
    if (!form.type) return "Select Property Type";
    if (!form.contact) return "Enter Contact Number";
    return null;
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    const errMsg = validate();
    if (errMsg) {
      alert("⚠️ " + errMsg);
      return;
    }

    try {
      setLoading(true);
      let payload: any = { ...form };

      if (form.files?.length) {
        payload.filesBase64 = await Promise.all(
          form.files.map((f: File) => toBase64(f))
        );
      }

      await fetch("/api/save-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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
      setPreview([]);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-block mb-4 bg-white/90 px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          ← Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            ➕ Add Property (Pro)
          </h1>

          {/* ROW 1 */}
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="date"
              className={input}
              value={form.date || ""}
              onChange={(e) => setVal("date", e.target.value)}
            />

            <select
              className={input}
              value={form.propertyFor}
              onChange={(e) => setVal("propertyFor", e.target.value)}
            >
              <option value="">Property For</option>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
              <option value="Lease">Lease</option>
            </select>

            <select
              className={input}
              value={form.type}
              onChange={(e) => setVal("type", e.target.value)}
            >
              <option value="">Type</option>
              <option value="Flat">Flat</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="G+2">G+2</option>
              <option value="G+3">G+3</option>
            </select>
          </div>

          {/* ROW 2 */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <input
              placeholder="Condition"
              className={input}
              value={form.condition}
              onChange={(e) => setVal("condition", e.target.value)}
            />
            <input
              placeholder="Bedroom"
              className={input}
              value={form.bedroom}
              onChange={(e) => setVal("bedroom", e.target.value)}
            />
            <input
              placeholder="Bath"
              className={input}
              value={form.bath}
              onChange={(e) => setVal("bath", e.target.value)}
            />
          </div>

          {/* ROW 3 */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <input
              placeholder="Size (sqft)"
              className={input}
              value={form.size}
              onChange={(e) => setVal("size", e.target.value)}
            />
            <input
              placeholder="Facing"
              className={input}
              value={form.facing}
              onChange={(e) => setVal("facing", e.target.value)}
            />
            <input
              placeholder="Total Floor"
              className={input}
              value={form.totalFloor}
              onChange={(e) => setVal("totalFloor", e.target.value)}
            />
          </div>

          {/* ROW 4 */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <input
              placeholder="Floor No"
              className={input}
              value={form.floorNo}
              onChange={(e) => setVal("floorNo", e.target.value)}
            />
            <input
              placeholder="Road"
              className={input}
              value={form.road}
              onChange={(e) => setVal("road", e.target.value)}
            />
            <input
              placeholder="Furnished"
              className={input}
              value={form.furnished}
              onChange={(e) => setVal("furnished", e.target.value)}
            />
          </div>

          {/* ROW 5 */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <input
              placeholder="Parking"
              className={input}
              value={form.parking}
              onChange={(e) => setVal("parking", e.target.value)}
            />
            <input
              placeholder="Contact Number"
              className={input}
              value={form.contact}
              onChange={(e) => setVal("contact", e.target.value)}
            />
            <input
              placeholder="Reference By"
              className={input}
              value={form.referenceBy}
              onChange={(e) => setVal("referenceBy", e.target.value)}
            />
          </div>

          {/* ROW 6 */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              placeholder="Project Name"
              className={input}
              value={form.projectName}
              onChange={(e) => setVal("projectName", e.target.value)}
            />
            <input
              placeholder="Address"
              className={input}
              value={form.address}
              onChange={(e) => setVal("address", e.target.value)}
            />
          </div>

          {/* PRICE */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              placeholder="Min Price ₹"
              className={input}
              value={form.minPrice}
              onChange={(e) =>
                setVal("minPrice", formatPrice(e.target.value))
              }
            />
            <input
              placeholder="Max Price ₹"
              className={input}
              value={form.maxPrice}
              onChange={(e) =>
                setVal("maxPrice", formatPrice(e.target.value))
              }
            />
          </div>

          {/* ADDITIONAL */}
          <div className="mt-4">
            <textarea
              placeholder="Additional Details"
              className={input}
              value={form.additional}
              onChange={(e) => setVal("additional", e.target.value)}
            />
          </div>

          {/* FILE */}
          <div className="mt-4">
            <label className="font-semibold">Upload Photos</label>
            <input
              type="file"
              multiple
              className="w-full mt-2"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {preview.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {preview.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full mt-6 py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
            hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Saving..." : "🚀 Save Property"}
          </button>
        </div>
      </div>
    </div>
  );
}




