import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import MessageBar from "@/components/ui/MessageBar";
import H2 from "@/components/ui/H2";

const backend_url = baseUrl();
const base_url = backend_url.replace("/api", "");

interface Material {
  _id: string;
  title: string;
  subject: string;
  file: string;
  createdAt: string;
}

const ViewMaterial = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backend_url}/${role}/material/${branchCode}`, { withCredentials: true });
        setMaterials(res.data.materials || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch materials");
      }
      setLoading(false);
    };
    fetchMaterials();
  }, []);

  return (
    <div className="w-full max-w-[700px] mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
      <H2 className="text-blue-700">Study Materials</H2>
      {error && (
        <MessageBar variant="error" message={error} onClose={() => setError(null)} />
      )}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : materials.length === 0 ? (
        <div className="text-center text-gray-500">No materials found.</div>
      ) : (
        <ul className="space-y-6">
          {materials.map((material) => (
            <li key={material._id} className="border-b border-gray-300 pb-4 flex flex-col gap-1">
              <span className="text-lg font-semibold text-blue-800">{material.title}</span>
              <span className="text-gray-700">Subject: {material.subject}</span>
              <span className="text-xs text-gray-400">
                Uploaded: {new Date(material.createdAt).toLocaleString()}
              </span>
              <a
                href={`${base_url}/media/material/${material.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline text-sm"
              >
                View PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewMaterial;