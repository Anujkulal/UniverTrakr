import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import MessageBar from "@/components/ui/MessageBar";
import H2 from "@/components/ui/H2";
import { Button } from "@/components/ui/Button";
import { MdDeleteForever } from "react-icons/md";

interface Notice {
  _id: string;
  title: string;
  description: string;
  link: string;
  branch: string;
  role: string;
  createdAt: string;
}

const backend_url = baseUrl();

const ViewNotice = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backend_url}/${role}/notice`, { withCredentials: true });
        console.log("Notices fetched: ", res.data.notices);
        setNotices(res.data.notices || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch notices");
      }
      setLoading(false);
    };
    fetchNotices();
  }, [role]);

  const handleDeleteNotice = async (noticeId: string) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${backend_url}/admin/notice/${noticeId}`, { withCredentials: true });
      setNotices((prev) => prev.filter((notice) => notice._id !== noticeId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete notice");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
      <H2 className="text-blue-700">Notices</H2>
      {error && (
        <MessageBar variant="error" message={error} onClose={() => setError(null)} />
      )}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : notices.length === 0 ? (
        <div className="text-center text-gray-500">No notices found.</div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto pr-2">
          <ul className="space-y-6">
            {notices.map((notice) => (
              <div key={notice._id}>
              {
                role !== "student" && (
                  <li
                    key={notice._id}
                    className="border-b flex justify-between border-gray-300 pb-4 bg-gray-100 p-4 rounded-2xl hover:shadow transition"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-semibold text-blue-800">{notice.title}</span>
                      <span className="text-gray-700">{notice.description}</span>
                      {notice.branch && (
                        <span className="text-sm text-gray-500">Branch: {notice.branch}</span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(notice.createdAt).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Sent to: {notice.role}
                      </span>
                      {notice.link && (
                        <a
                          href={notice.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Link
                        </a>
                      )}
                    </div>
                    {role !== "student" && (
                      <Button
                        variant={"destructive"}
                        onClick={() => handleDeleteNotice(notice._id)}
                        className="self-start"
                      >
                        <MdDeleteForever size={20} />
                      </Button>
                    )}
                  </li>

                )
              }
              {
                (role === "student" && notice.branch === branchCode || (role === "student" && notice.role === "All")) && (
                  <li
                    key={notice._id}
                    className="border-b flex justify-between border-gray-300 pb-4 bg-gray-100 p-4 rounded-2xl hover:shadow transition"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-semibold text-blue-800">{notice.title}</span>
                      <span className="text-gray-700">{notice.description}</span>
                      {notice.branch && (
                        <span className="text-sm text-gray-500">Branch: {notice.branch}</span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(notice.createdAt).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Sent to: {notice.role}
                      </span>
                      {notice.link && (
                        <a
                          href={notice.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Link
                        </a>
                      )}
                    </div>
                  </li>
                )
              }
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewNotice;