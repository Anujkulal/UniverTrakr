import React, { useState } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import H2 from "@/components/ui/H2";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const initialTimings = [
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 1:00",
  "1:00 - 2:00",
  "2:00 - 3:00",
];

const CreateTimetable = () => {
  const [timings, setTimings] = useState([...initialTimings]);
  const [data, setData] = useState(
    days.map(() => Array(initialTimings.length).fill(""))
  );
  // console.log("Initial Data:", data);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [timingsInput, setTimingsInput] = useState(timings.join(", ")); // For user input

  const columns = timings.map(() => ({
    editor: "text",
  }));

  const handleSave = async () => {
    await fetch("http://localhost:3000/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch, semester, timings, data }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("Timetable saved successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to save timetable.");
      });
  };

  const fetchTimetable = async () => {
    const response = await fetch(
      `http://localhost:3000/timetable`
    );
    if (response.ok) {
      const timetable = await response.json();
      setTimings(timetable[0].timings);
      setData(timetable[0].data);
    } else {
      alert("Timetable not found");
    }
  };

  const loadTimings = () => {
    if(!window.confirm("This will reset the current timetable. Do you want to continue?")) {
      return;
    }
      // Reset data to empty strings for new timings
    const newTimings = timingsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);
    setTimings(newTimings);
    setData(days.map(() => Array(newTimings.length).fill("")));
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-10 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-2xl border border-blue-100">
      <H2 className="text-3xl text-blue-700 drop-shadow-lg tracking-tight">Class Timetable</H2>
      <div className="flex flex-col gap-6 mb-10 justify-center">
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <Input
            type="text"
            placeholder="Branch (e.g. CSE)"
            value={branch}
            onChange={e => setBranch(e.target.value)}
            className="w-56 text-lg"
            required
          />
          <Input
            type="number"
            placeholder="Semester"
            value={semester}
            onChange={e => setSemester(e.target.value)}
            min={1}
            className="w-40 text-lg"
            required
          />
          <Input
            type="text"
            placeholder="Enter timings separated by commas"
            value={timingsInput}
            onChange={e => setTimingsInput(e.target.value)}
            className="w-96 text-lg"
          />
          <Button
            onClick={loadTimings}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
          >
            Load Timings
          </Button>
          <Button
            onClick={fetchTimetable}
            variant={"success"}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
          >
            Fetch Timetable
          </Button>
          <Button
          variant={"success"}
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
          >
            Save Timetable
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
          afterChange={(changes, source) => {
            if (changes && source !== "loadData") {
              const newData = [...data];
              changes.forEach(([row, col, oldVal, newVal]) => {
                newData[row][col] = newVal;
              });
              setData(newData);
            }
          }}
          afterGetColHeader={(col, TH) => {
            if (col >= 0) {
              TH.contentEditable = true;
              TH.style.background = "#e3f2fd";
              TH.onblur = null;
              TH.onblur = (e) => {
                const newTimings = [...timings];
                newTimings[col] = e.target.innerText;
                setTimings(newTimings);
              };
              TH.onkeydown = (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  TH.blur();
                }
              };
            }
          }}
        />
      </div>
      <div className="text-center mt-8 text-gray-500">
        <small>
          <b>Tip:</b> Double-click a cell or header to edit. Press Enter to save header changes.
        </small>
      </div>
    </div>
  );
};

export default CreateTimetable;