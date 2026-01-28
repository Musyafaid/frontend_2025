import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function AddQuestion() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    {
      name: "",
      choiceType: "text",
      choices: [""],
      isRequired: false,
    },
  ]);

  const [loading, setLoading] = useState(false);

  function updateQuestion(index, field, value) {
    const copy = [...questions];
    copy[index][field] = value;
    setQuestions(copy);
  }

  function addQuestion() {
    setQuestions(prev => [
      ...prev,
      {
        name: "",
        choiceType: "text",
        choices: [""],
        isRequired: false,
      },
    ]);
  }

  function removeQuestion(index) {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  }

  function updateChoice(qIndex, cIndex, value) {
    const copy = [...questions];
    copy[qIndex].choices[cIndex] = value;
    setQuestions(copy);
  }

  function addChoice(qIndex) {
    const copy = [...questions];
    copy[qIndex].choices.push("");
    setQuestions(copy);
  }

  function removeChoice(qIndex, cIndex) {
    const copy = [...questions];
    copy[qIndex].choices = copy[qIndex].choices.filter((_, i) => i !== cIndex);
    setQuestions(copy);
  }

  function validate() {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.name.trim()) {
        alert(`Pertanyaan ${i + 1} wajib diisi`);
        return false;
      }

      if (q.choiceType !== "text") {
        const validChoices = q.choices.filter(c => c.trim());
        if (validChoices.length === 0) {
          alert(`Pertanyaan ${i + 1} minimal punya 1 pilihan`);
          return false;
        }
      }
    }
    return true;
  }

  async function submitAll() {
    if (!validate()) return;

    setLoading(true);
    try {
      for (const q of questions) {
        await apiFetch(`/forms/${slug}/questions`, {
          method: "POST",
          body: JSON.stringify({
            name: q.name,
            choice_type: q.choiceType,
            is_required: q.isRequired,
            choices:
              q.choiceType !== "text"
                ? q.choices.filter(c => c.trim())
                : undefined,
          }),
        });
      }

      alert("Semua pertanyaan berhasil disimpan");
      navigate("/dashboard");
    } catch {
      alert("Terjadi kesalahan saat menyimpan pertanyaan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-1">Tambah Pertanyaan</h2>
      <p className="text-gray-500 mb-6">
        Form: <b>{slug}</b>
      </p>

      {questions.map((q, i) => (
        <div
          key={i}
          className="bg-white border rounded-xl p-5 mb-5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-lg">
              Pertanyaan {i + 1}
            </h4>

            {questions.length > 1 && (
              <button
                onClick={() => removeQuestion(i)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Hapus
              </button>
            )}
          </div>

          <input
            placeholder="Tulis pertanyaan..."
            value={q.name}
            onChange={e => updateQuestion(i, "name", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={q.choiceType}
            onChange={e => updateQuestion(i, "choiceType", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          >
            <option value="text">Text</option>
            <option value="dropdown">Dropdown</option>
            <option value="checkbox">Checkbox</option>
          </select>

          {q.choiceType !== "text" && (
            <div className="mb-4">
              <p className="font-medium mb-2">Pilihan Jawaban</p>

              {q.choices.map((c, ci) => (
                <div key={ci} className="flex gap-2 mb-2">
                  <input
                    placeholder={`Pilihan ${ci + 1}`}
                    value={c}
                    onChange={e =>
                      updateChoice(i, ci, e.target.value)
                    }
                    className="flex-1 border rounded-lg px-3 py-2"
                  />

                  {q.choices.length > 1 && (
                    <button
                      onClick={() => removeChoice(i, ci)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => addChoice(i)}
                className="text-sm text-blue-600 hover:underline"
              >
                + Tambah pilihan
              </button>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={q.isRequired}
              onChange={e =>
                updateQuestion(i, "isRequired", e.target.checked)
              }
              className="w-4 h-4"
            />
            Required
          </label>

          {i === questions.length - 1 && (
            <button
              onClick={addQuestion}
              className="mt-4 text-white hover:underline text-sm"
            >
              ➕ Tambah pertanyaan
            </button>
          )}
        </div>
      ))}

      <button
        onClick={submitAll}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Selesai"}
      </button>
    </div>
  );
}
