import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import MessageBar from "@/components/ui/MessageBar";
import H2 from "@/components/ui/H2";

const backend_url = baseUrl();

interface SubjectProps {
  name: string;
  code: string;
}

const AddMaterial = () => {
  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";
  const [form, setForm] = useState({
    faculty: auth?.userId || "",
    branch: branchCode || "",
    subject: "",
    title: "",
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [subjects, setSubjects] = useState<SubjectProps[]>([]);  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "file") {
        const file = e.target.files ? e.target.files[0] : null;
        if(file && file.type !== "application/pdf") {
          setMessage({
            type: "error",
            text: "Only PDF files are allowed.",
          });
          e.target.value = ""; // Clear the input
          setForm({ ...form, file: null });
          return;
        }
      setForm({ ...form, file });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
        formData.append("faculty", form.faculty);
        formData.append("branch", form.branch);
      formData.append("title", form.title);
      formData.append("subject", form.subject);
      if (form.file) formData.append("material", form.file);

      const res = await axios.post(
        `${backend_url}/faculty/material`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage({
        type: "success",
        text: res.data.message || "Material uploaded successfully!",
      });
      setForm({
        faculty: auth?.userId || "",
        branch: branchCode || "",
        title: "",
        subject: "",
        file: null,
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to upload material",
      });
    }
    setLoading(false);
  };

  // Fetch subjects for the faculty's branch
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `${backend_url}/${auth.role.toLowerCase()}/subject`,
        { withCredentials: true }
      );
      setSubjects(response.data.subject || []);
      // console.log("Fetched subjects:", response.data.subject);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  useEffect(() => {
    if (auth && auth.role) fetchSubjects();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      {message && (
        <MessageBar
          variant={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      <H2 className="text-2xl font-bold mb-6 text-blue-700">
        Add Study Material
      </H2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="title"
          placeholder="Material Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <select
          name="subject"
          id="subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.code} value={subject.code}>
              {subject.name} ({subject.code})
            </option>
          ))}
        </select>
        <input
          type="file"
          name="file"
          accept=".pdf"
          onChange={handleChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Uploading..." : "Add Material"}
        </Button>
      </form>
    </div>
  );
};

export default AddMaterial;
