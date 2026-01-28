import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function Responses() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResponses();
  }, [slug]);

  async function loadResponses() {
    try {
      const res = await apiFetch(`/forms/${slug}/responses`);
      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setResponses(data.responses || []);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil jawaban");
    } finally {
      setLoading(false);
    }
  }

  function renderValue(value) {
    // kalau array (checkbox)s
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      );
    }

    
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return (
          <ul>
            {parsed.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        );
      }
    } catch {}

    return <p>{value}</p>;
  }

  if (loading) return <p>Loading responses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h2>Jawaban Form</h2>

      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← Kembali
      </button>

      {responses.length === 0 && <p>Belum ada jawaban.</p>}

      {responses.map((res, index) => (
        <div
          key={res.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            borderRadius: 6,
            marginBottom: 20,
            background: "#fff",
          }}
        >
          <h4>Respon #{index + 1}</h4>

          {res.user && (
            <p style={{ fontSize: 14, color: "#555" }}>
              Oleh: {res.user.name} ({res.user.email})
            </p>
          )}

          <hr />

          {res.answers.map((ans, i) => (
            <div key={ans.id} style={{ marginBottom: 12 }}>
              <b>
                {i + 1}. {ans.question?.name}
              </b>

              <div style={{ marginTop: 4 }}>
                {renderValue(ans.value)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
