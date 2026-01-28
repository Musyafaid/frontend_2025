import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

/* ======================
   Utils
====================== */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function generateUniqueSlug(title) {
  const baseSlug = slugify(title);
  const unique = Date.now().toString(36);
  return `${baseSlug}-${unique}`;
}

/* ======================
   Component
====================== */
export default function CreateForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [limitOne, setLimitOne] = useState(false);

  async function submit() {
    if (!name.trim()) {
      alert("Judul form wajib diisi");
      return;
    }

    const slug = generateUniqueSlug(name);

    try {
      const res = await apiFetch("/forms", {
        method: "POST",
        body: JSON.stringify({
          name,
          slug,
          description,
          limit_one_response: limitOne,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal menyimpan form");
        return;
      }

      const formSlug = data.slug || data.data?.slug || slug;
      navigate(`/forms/${formSlug}/questions/add`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-1">Create Form</h2>
        <p className="text-sm text-gray-500 mb-6">
          Buat form baru dan tambahkan pertanyaan
        </p>

        {/* Form Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Form Name
          </label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Form Kepuasan Siswa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Deskripsi singkat form"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Limit One */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="limit"
            checked={limitOne}
            onChange={(e) => setLimitOne(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="limit" className="text-sm">
            Batasi satu respon per pengguna
          </label>
        </div>

        {/* Action */}
        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Save & Add Question
        </button>
      </div>
    </div>
  );
}
