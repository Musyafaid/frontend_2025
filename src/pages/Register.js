import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "../App.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function register() {
    setErrors({});

    if (!name || !email || !password) {
      setErrors({
        general: "Semua field wajib diisi",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        },
        false 
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setErrors({ general: data.message });
        } else {
          setErrors({ general: "Registrasi gagal" });
        }
        return;
      }

      alert("Registrasi berhasil, silakan login");
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrors({ general: "Server error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>

      {errors.general && (
        <p className="error-text">{errors.general}</p>
      )}

      <input
        type="text"
        placeholder="Nama Lengkap"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <small className="error-text">{errors.name[0]}</small>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <small className="error-text">{errors.email[0]}</small>}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && (
        <small className="error-text">{errors.password[0]}</small>
      )}

      <button onClick={register} disabled={loading}>
        {loading ? "Loading..." : "Register"}
      </button>

      <p style={{ marginTop: 10 }}>
        Sudah punya akun?{" "}
        <span
          style={{ color: "#2563eb", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
