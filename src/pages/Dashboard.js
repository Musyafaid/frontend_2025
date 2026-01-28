import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const loadForms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/forms");

      if (!res.ok) {
        logout();
        return;
      }

      const json = await res.json();
      const formsData = Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.forms)
          ? json.forms
          : [];

      setForms(formsData);
    } catch (err) {
      console.error(err);
      setError("Failed to load forms");
      setForms([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  return (
    <div className="container  max-w-5xl p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => navigate("/forms/create")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        + Create Form
      </button>

      <h3 className="max-h-14 text-3xl">List Form</h3>

      {loading && <p>Loading forms...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && forms.length === 0 && <p>No forms found</p>}

      <ul className="space-y-3">
        {forms.map((f) => (
          <li
            key={f.id}
            className="flex justify-between items-center p-4 border rounded-lg bg-white hover:bg-gray-50"
          >
            <div>
              <p className="font-semibold">{f.name}</p>
            </div>

            {f.slug ? (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/forms/manage/${f.slug}`)}
                  className="px-1 max-h-14  text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Manage
                </button>

                <button
                  onClick={() => navigate(`/forms/view/${f.slug}/responses`) }
                  className="px-1 max-h-14 text-sm bg-yellow-500 rounded-md hover:bg-yellow-300"
                >
                  View Respon
                </button>

                <button
                  onClick={() => {
                    const url = `${window.location.origin}/forms/public/${f.slug}`;
                    navigator.clipboard.writeText(url);
                    alert("Link form berhasil disalin");
                  }}
                  className="px-1 max-h-14 text-sm bg-blue-500 rounded-md hover:bg-blue-400"
                >
                  Salin Link
                </button>
              </div>
            ) : (
              <span className="text-gray-400 text-sm">No slug</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
