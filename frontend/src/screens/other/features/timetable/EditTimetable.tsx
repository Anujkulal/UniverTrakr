import { Button } from "@/components/ui/Button";
import H2 from "@/components/ui/H2";
import { Input } from "@/components/ui/Input";
import { baseUrl } from "@/lib/baseUrl";
import {
  clearTimetableState,
  updateTimetable,
} from "@/redux/slices/timetableSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import HotTable from "@handsontable/react";
import React, { useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

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

interface EditTimetableProps {
  timetable: any;
  role: string;
  onClose: (updated?: boolean) => void;
  fetchTimetable: () => void;
  setMessage: (msg: { type: "success" | "error"; text: string }) => void;
}

const EditTimetable: React.FC<EditTimetableProps> = ({
  fetchTimetable,
  timetable,
  onClose,
  role,
  setMessage,
}) => {
  const [initialTimetable, setInitialTimetable] = React.useState({
    ...timetable,
  });
  const [timingsInput, setTimingsInput] = useState(initialTimetable.timings); // For user input

  // console.log("Initial timings:", initialTimetable.timings);

  const [timings, setTimings] = useState([...timingsInput]);
  const [data, setData] = useState(initialTimetable.data);

  // const {error, success } = useSelector((state: RootState) => state.timetable);
  const dispatch = useDispatch<AppDispatch>();

  const columns = timings.map(() => ({
    editor: "text",
  }));

  const loadTimings = () => {
    if (
      !window.confirm(
        "This will reset the current timetable. Do you want to continue?"
      )
    ) {
      return;
    }
    // Reset data to empty strings for new timings
    const newTimings = timingsInput
      .split(",")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);
    setTimings(newTimings);
    setData(data);
  };

  const handleUpdate = async () => {
    dispatch(
      updateTimetable({
        branch: initialTimetable.branch,
        semester: initialTimetable.semester,
        timings,
        data,
        role,
      })
    )
      .unwrap()
      .then((response) => {
        console.log("Timetable saved successfully:", response);
        // if()
        setData(initialTimetable.data); // Reset data after save
        setTimings(timings); // Reset timings to initial state
        setTimingsInput(timings.join(", ")); // Reset input field
        dispatch(clearTimetableState()); // Clear state after submission
        fetchTimetable(); // Fetch updated timetable
        setMessage({ type: "success", text: "Timetable updated successfully" });
        onClose(true); // Close modal and indicate success
        // setBranch("");
        // setSemester("");
      })
      .catch((error) => {
        console.error("Error saving timetable:", error);
        alert(`Failed to save timetable. Please try again.", ${error}`);
      });
    // setBranch("");
    // setSemester("");
  };
  return (
    <div className="max-w-6xl mx-auto mt-10 p-10 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-2xl border border-blue-100">
      <Button type="button" onClick={() => onClose()} variant={"plain"} className="hover:text-red-500">
        <FaTimesCircle size={20} />
      </Button>
      
      <H2 className="text-3xl text-blue-700 drop-shadow-lg tracking-tight">
        Class Timetable
      </H2>
      <div className="flex flex-col gap-6 mb-10 justify-center">
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <Input
            type="text"
            placeholder="Branch (e.g. CSE)"
            value={`Branch: ${initialTimetable.branch}`}
            disabled
          />

          <Input
            type="text"
            placeholder="Semester"
            value={`Semester: ${initialTimetable.semester}`}
            disabled
          />
          <Input
            type="text"
            placeholder="Enter timings separated by commas"
            value={timingsInput}
            onChange={(e) => setTimingsInput(e.target.value)}
            className="w-96 text-lg"
          />
          <Button
            onClick={loadTimings}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
          >
            Load Timings
          </Button>

          <Button
            variant={"success"}
            onClick={handleUpdate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
          >
            Update Timetable
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-xl overflow-x-auto border border-blue-100">
        <HotTable
          data={data}
          colHeaders={timings}
          rowHeaders={days}
          columns={columns}
          manualColumnResize={true}
          manualRowResize={true}
          stretchH="all"
          width="100%"
          colWidths={150}
          rowHeaderWidth={120}
          height="auto"
          rowHeights={55}
          licenseKey="non-commercial-and-evaluation"
          afterChange={(
            changes: [any, any, any, any][] | null,
            source: string
          ) => {
            if (changes && source !== "loadData") {
              const newData = [...data];
              changes.forEach(([row, col, oldVal, newVal]) => {
                newData[row][col] = newVal;
              });
              setData(newData);
            }
          }}
          afterGetColHeader={(col: number, TH: HTMLTableCellElement) => {
            if (col >= 0) {
              TH.contentEditable = "true";
              TH.style.background = "#e3f2fd";
              TH.onblur = null;
              TH.onblur = (e) => {
                const target = e.target as HTMLTableCellElement;
                const newTimings = [...timings];
                newTimings[col] = target.innerText;
                setTimings(newTimings);
              };
              TH.onkeydown = (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // TH.blur();
                  (e.target as HTMLTableCellElement).blur();
                }
              };
            }
          }}
        />
      </div>
      <div className="text-center mt-8 text-gray-500">
        <small>
          <b>Tip:</b> Double-click a cell or header to edit. Press Enter to save
          header changes.
        </small>
      </div>
    </div>
  );
};

export default EditTimetable;
