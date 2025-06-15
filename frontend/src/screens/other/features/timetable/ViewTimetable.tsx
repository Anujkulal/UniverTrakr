import React, { useEffect, useState } from "react";
import { baseUrl } from "@/lib/baseUrl";
import axios from "axios";
import H2 from "@/components/ui/H2";
import MessageBar from "@/components/ui/MessageBar";
import HotTable from "@handsontable/react";

const backend_url = baseUrl();

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ViewTimetable = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [timings, setTimings] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);

  // You may want to get branch/semester from user context or props
  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const branch = auth?.branchCode || "";
  const semester = auth?.semester || "";

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const res = await axios.get(
          `${backend_url}/student/timetable/${branch}/${semester}`,
          { withCredentials: true }
        );
        if (res.data) {
          setTimings(res.data.timings || []);
          setData(res.data.data || []);
        } else {
          setMessage({ type: "error", text: "No timetable found for your branch and semester." });
        }
      } catch (err: any) {
        setMessage({ type: "error", text: err.response?.data?.message || "Failed to fetch timetable." });
      }
      setLoading(false);
    };
    if (branch && semester) fetchTimetable();
  }, [branch, semester]);

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl border border-blue-200">
      <H2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 drop-shadow-lg tracking-tight">
        Class Timetable
      </H2>
      {message && (
        <MessageBar
          variant={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      {loading ? (
        <div className="text-center py-16 text-xl text-blue-600 font-semibold animate-pulse">
          Loading timetable...
        </div>
      ) : data && data.length > 0 ? (
        <div className="bg-white rounded-3xl p-8 shadow-xl overflow-x-auto border border-blue-100">
          <HotTable
            data={data}
            colHeaders={timings}
            rowHeaders={days}
            columns={timings.map(() => ({ editor: false }))}
            manualColumnResize={true}
            manualRowResize={true}
            stretchH="all"
            width="100%"
            colWidths={170}
            rowHeaderWidth={130}
            height="auto"
            rowHeights={60}
            readOnly={true}
            className="rounded-xl content-center text-center font-semibold text-xl"
            licenseKey="non-commercial-and-evaluation"
          />
          <div className="text-center mt-8 text-gray-500">
            <small>
              <b>Note:</b> This timetable is{" "}
              <span className="text-blue-600 font-semibold">view-only</span>.
            </small>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12 text-lg">
          No timetable found for your branch and semester.
        </div>
      )}
    </div>
  );
};

export default ViewTimetable;