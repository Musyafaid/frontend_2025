import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";

export default function PublicForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 🔐 VALIDASI LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 📥 LOAD FORM
  useEffect(() => {
    async function loadForm() {
      try {
        const res = await apiFetch(`/forms/${slug}`);

        // ❌ token invalid / expired
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Form not found");
        }

        const data = await res.json();
        const fetchedForm = data.form;

        if (!fetchedForm) {
          setError("Form tidak ditemukan");
          return;
        }

        setForm(fetchedForm);

        const initAnswers = {};
        fetchedForm.questions.forEach((q) => {
          initAnswers[q.id] = q.choice_type === "checkbox" ? [] : "";
        });

        setAnswers(initAnswers);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat form");
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [slug, navigate]);

  async function submit() {
    if (!form) return;

    setSubmitting(true);

    try {
      const payload = {
        answers: Object.entries(answers).map(([question_id, value]) => ({
          question_id: Number(question_id),
          value,
        })),
      };

      const res = await apiFetch(`/forms/${slug}/responses`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Submit gagal");
        return;
      }

      alert("Jawaban berhasil dikirim");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!form) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-2">{form.name}</h2>

        {form.description && (
          <p className="text-gray-600 mb-4">{form.description}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="space-y-6"
        >
          {form.questions.map((q, i) => (
            <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
              <p className="font-medium mb-2">
                {i + 1}. {q.name}
                {q.is_required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </p>

              {q.choice_type === "text" && (
                <input
                  type="text"
                  required={q.is_required}
                  value={answers[q.id]}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              )}

              {q.choice_type === "dropdown" && (
                <select
                  required={q.is_required}
                  value={answers[q.id]}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded bg-white"
                >
                  <option value="">-- pilih --</option>
                  {q.choices.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}

              {q.choice_type === "checkbox" && (
                <div className="space-y-2">
                  {q.choices.map((c) => (
                    <label key={c} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={answers[q.id].includes(c)}
                        onChange={(e) => {
                          const prev = answers[q.id];
                          const next = e.target.checked
                            ? [...prev, c]
                            : prev.filter((v) => v !== c);
                          setAnswers({ ...answers, [q.id]: next });
                        }}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Mengirim..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
