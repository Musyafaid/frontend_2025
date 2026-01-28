import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function ManageForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===============================
  // LOAD FORM (AUTH REQUIRED)
  // ===============================
  useEffect(() => {
    apiFetch(`/forms/${slug}`, { auth: true })
      .then((res) => {
        if (!res.ok) throw new Error("Form not found");
        return res.json();
      })
      .then((data) => {
        setForm(data.form);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load form");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // ===============================
  // DELETE QUESTION
  // ===============================
  async function deleteQuestion(id) {
    if (!window.confirm("Yakin hapus pertanyaan ini?")) return;

    try {
      const res = await apiFetch(`/forms/${slug}/questions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Gagal menghapus pertanyaan");
        return;
      }

      setForm((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== id),
      }));
    } catch (err) {
      console.error(err);
      alert("Error saat menghapus pertanyaan");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!form) return null;

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <div className="flex justify-center mb-4">
        <h2 className="text-4xl center">Manage Form</h2>
      </div>
      <h3>{form.name}</h3>
      <p>{form.description}</p>

      <button
        style={{ marginBottom: 12 }}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={() => navigate(`/forms/${slug}/questions/add`)}
      >
        ➕ Tambah Pertanyaan
      </button>

      {form.questions.length === 0 && <p>Belum ada pertanyaan</p>}

      {form.questions.map((q, i) => (
        <div
          key={q.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b>
              {i + 1}. {q.name}
            </b>

            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => deleteQuestion(q.id)}
            >
              Hapus
            </button>
          </div>

          <small>
            Type: {q.choice_type}
            {q.is_required ? " • Required" : ""}
          </small>

          {q.choice_type !== "text" && (
            <ul>
              {q.choices.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
