import { Button } from '@/components/ui/Button';
import H2 from '@/components/ui/H2';
import { Input } from '@/components/ui/Input'
import MessageBar from '@/components/ui/MessageBar';
import { baseUrl } from '@/lib/baseUrl';
import { addBranch, removeBranch, resetBranchState } from '@/redux/slices/branchSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MdDeleteForever } from 'react-icons/md';
import { MdOutlineAddCircle } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const backend_url = baseUrl();

interface BranchProps {
    name: string;
    code: string;
}

const BranchScreen = () => {
    const [branchName, setBranchName] = useState<string>("");
    const [branchCode, setBranchCode] = useState<string>("");
    const [branches, setBranches] = useState<BranchProps[]>([])
    const dispatch = useDispatch<AppDispatch>();
    const {loading, error, success} = useSelector((state: RootState) => state.branch);

    const auth = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchBranch = async () => {
        try {
            const response = await axios.get(`${backend_url}/${auth.role.toLowerCase()}/branch`, { withCredentials: true})
            setBranches(response.data.branch || [])
        } catch (err) {
            console.error('Failed to fetch branch:', err)
        }
    }

    useEffect(() => {
        if(auth && auth.role) 
            fetchBranch(); 
    }, [])

    const handleAddBranch = () => {
        if( !branchName.trim() || !branchCode.trim()) {
            alert("Please enter a branch fields");
            return;
        }
        dispatch(addBranch({name: branchName, code: branchCode, role: auth.role.toLowerCase()}))
        .unwrap()
        .then(() => {
          fetchBranch(); // Refresh the branch list
          setBranchName(""); // Clear input field after adding branch
          setBranchCode(""); // Clear input field after adding branch
        })
    }

    const handleRemoveBranch = (code: string) => {
      dispatch(removeBranch({code, role: auth.role.toLowerCase()}))
      .unwrap()
      .then(() => {
        fetchBranch(); // Refresh the branch list after removal
      })
    }

    return (
      <div className='flex flex-1 flex-col items-center justify-start py-8'>
        <MessageBar variant={error ? "error" : "success"} message={error || success || ""} onClose={() => dispatch(resetBranchState())}/>
        <div className='bg-white rounded-2xl shadow-lg p-8 mt-10 w-full max-w-4xl flex flex-col items-center'>
          <H2 className='text-blue-700 mb-6'>Add Branch</H2>
          {/* {loading && <p className='text-blue-500'>Adding branch...</p>} */}
          <div className='flex justify-center items-center gap-4'>
            <Input 
              placeholder='Name (ex: Computer Science)'
              value={branchName}
              onChange={e => setBranchName(e.target.value)}
            />
            <Input 
              placeholder='Code (ex: CSE)'
              value={branchCode}
              onChange={e => setBranchCode(e.target.value)}
            />
            <Button onClick={handleAddBranch}>
              {loading ? <HiDotsHorizontal size={25} /> : <MdOutlineAddCircle size={25} /> }
            </Button>
          </div>

          <div className="w-full max-w-xl mx-auto mt-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="px-4 py-3">Branch Name</th>
                    <th className="px-4 py-3">Branch Code</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {branches.map((branch) => (
                      <motion.tr
                        key={branch.code}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                        className="border-b border-gray-300 hover:bg-blue-100 transition"
                      >
                        <td className="px-4 py-3 font-medium">{branch.name}</td>
                        <td className="px-4 py-3">{branch.code}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveBranch(branch.code)}
                            className="flex items-center gap-1"
                          >
                            <MdDeleteForever size={25} className="text-lg" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {branches.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">
                        No branches found.
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

export default BranchScreen