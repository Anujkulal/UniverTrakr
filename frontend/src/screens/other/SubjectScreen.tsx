import { Button } from "@/components/ui/Button";
import H2 from "@/components/ui/H2";
import { Input } from "@/components/ui/Input";
import MessageBar from "@/components/ui/MessageBar";
import { baseUrl } from "@/lib/baseUrl";
import { addSubject, removeSubject, resetSubjectState } from "@/redux/slices/subjectSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdDeleteForever, MdOutlineAddCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const backend_url = baseUrl();

interface SubjectProps {
    name: string;
    code: string;
}

const SubjectScreen = () => {
    const [subjectName, setSubjectName] = useState<string>("");
    const [subjectCode, setSubjectCode] = useState<string>("");
    const [subjects, setSubjects] = useState<SubjectProps[]>([])
    const dispatch = useDispatch<AppDispatch>();
    const {loading, error, success} = useSelector((state: RootState) => state.subject);

    const auth = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchSubject = async () => {
        try {
            const response = await axios.get(`${backend_url}/${auth.role.toLowerCase()}/subject`, { withCredentials: true})
            setSubjects(response.data.subject || [])
        } catch (err) {
            console.error('Failed to fetch subject:', err)
        }
    }

    useEffect(() => {
            if(auth && auth.role) 
                fetchSubject(); 
        }, [])

    const handleAddSubject = () => {
            if( !subjectName.trim() || !subjectCode.trim()) {
                alert("Please enter a subject fields");
                return;
            }
            dispatch(addSubject({name: subjectName, code: subjectCode, role: auth.role.toLowerCase()}))
            .unwrap()
            .then(() => {
              fetchSubject(); // Refresh the subject list
              setSubjectName(""); 
              setSubjectCode(""); 
            })
        }

        const handleRemoveSubject = (code: string) => {
              dispatch(removeSubject({code, role: auth.role.toLowerCase()}))
              .unwrap()
              .then(() => {
                fetchSubject(); // Refresh the subject list after removal
              })
            }
  return (
    <div className='flex flex-1 flex-col items-center justify-start py-8'>
        <MessageBar variant={error ? "error" : "success"} message={error || success || ""} onClose={() => dispatch(resetSubjectState())}/>
        <div className='bg-white rounded-2xl shadow-lg p-8 mt-10 w-full max-w-4xl flex flex-col items-center'>
          <H2 className='text-blue-700 mb-6'>Add Subject</H2>
          <div className='flex justify-center items-center gap-4'>
            <Input
              placeholder='Name (ex: Cloud Computing)'
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
            />
            <Input 
              placeholder='Code (ex: BCS601)'
              value={subjectCode}
              onChange={e => setSubjectCode(e.target.value)}
            />
            <Button onClick={handleAddSubject}>
              {loading ? <HiDotsHorizontal size={25} /> : <MdOutlineAddCircle size={25} /> }
            </Button>
          </div>

          <div className="w-full max-w-xl mx-auto mt-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3">Subject Code</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {subjects.map((subject) => (
                      <motion.tr
                        key={subject.code}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                        className="border-b border-gray-300 hover:bg-blue-100 transition"
                      >
                        <td className="px-4 py-3 font-medium">{subject.name}</td>
                        <td className="px-4 py-3">{subject.code}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveSubject(subject.code)}
                            className="flex items-center gap-1"
                          >
                            <MdDeleteForever size={25} className="text-lg" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {subjects.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">
                        No subjects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}

export default SubjectScreen;