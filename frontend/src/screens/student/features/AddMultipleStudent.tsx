import React, { useState } from "react";
import Papa from 'papaparse';
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "@/lib/baseUrl";
import type { AppDispatch, RootState } from "@/redux/store";
import { FaDownload } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { addMultipleStudents, clearStudentState } from "@/redux/slices/studentSlice";
import MessageBar from "@/components/ui/MessageBar";
import H2 from "@/components/ui/H2";

const AddMultipleStudent = () => {
  const [file, setFile] = useState<File | null>(null);
  const { loading, success, error } = useSelector((state: RootState) => state.student);
  const dispatch = useDispatch<AppDispatch>();
  const auth = JSON.parse(localStorage.getItem("user") || "{}");

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!file) {
      return;
    }
    dispatch(addMultipleStudents({ file, role: auth.role.toLowerCase() }));
    setFile(null); // Clear file after upload
  };

  // Download CSV template with multiple sample rows
  const handleDownloadTemplate = () => {
    const headers = [
      "enrollmentNo",
      "firstName",
      "middleName",
      "lastName",
      "email",
      "phoneNumber",
      "semester",
      "branch",
      "gender"
    ];
    const sampleRows = [
      [
        "4MW2XCS001",
        "Anuj",
        "Kumar",
        "Sharma",
        "anuj.sharma@example.com",
        "9876543210",
        "5",
        "CSE",
        "male"
      ],
      [
        "4MW2XCS002",
        "Priya",
        "Rani",
        "Verma",
        "priya.verma@example.com",
        "9123456780",
        "6",
        "CSE",
        "female"
      ],
      [
        "4MW2XEC003",
        "Rahul",
        "Singh",
        "Patel",
        "rahul.patel@example.com",
        "9988776655",
        "4",
        "ECE",
        "male"
      ]
    ];
    const csvContent = [
      headers.join(","),
      ...sampleRows.map(row => row.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6">
      <MessageBar
        variant={error ? "error" : success ? "success" : "default"}
        message={error || success || ''}
        onClose={() => dispatch(clearStudentState())}
      />

      <H2>Add Multiple Students</H2>

      <div className="flex flex-col space-y-6">
        {/* Download Template Button */}
        <Button
          onClick={handleDownloadTemplate}
          variant="outline"
          aria-label="Download CSV Template"
        >
          <FaDownload className="inline-block mr-2" />
          Download CSV Template
        </Button>

        {/* File Upload Area */}
        <div className="w-full max-w-md mx-auto">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV file only</p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        </div>

        {/* Selected File Name */}
        {file && (
          <p className="text-sm text-blue-800 font-semibold text-center">
            Selected file: {file.name}
          </p>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleFileUpload}
          disabled={!file || loading}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Students Data"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddMultipleStudent;