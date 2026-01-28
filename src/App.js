import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import AddQuestion from "./pages/AddQuestion";
import PublicForm from "./pages/PublicForm";
import ManageForm from "./pages/ManageForm";
import Register from "./pages/Register";
import Responses from "./pages/Responses";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms/create" element={<CreateForm />} />
        <Route path="/forms/create" element={<CreateForm />} />
        <Route path="/forms/:slug/questions/add" element={<AddQuestion />} />
        <Route path="/forms/public/:slug" element={<PublicForm />} />
        <Route path="/forms/manage/:slug" element={<ManageForm />} />
        <Route path="/forms/view/:slug/responses" element={<Responses />} />
      </Routes>
    </BrowserRouter>
  );
}
