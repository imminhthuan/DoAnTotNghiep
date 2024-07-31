import { CModal, CCard, CCardHeader, CCardBody, CModalBody, CModalHeader, CModalFooter, CButton } from '@coreui/react';
import { DocsLink } from 'src/components';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllDiemBySinhVienLogins, getAllSubject } from "../../../redux/actions/adminAction";
import { ADD_MARK, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";
import './marks.css';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Marks = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState({});
    const store = useSelector((state) => state);
    const diem = useSelector((state) => state.admin.getAllDiemBySinhVienLoginss) || [];
    const Subjects = useSelector((state) => state.admin.allSubject) || [];

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;


    useEffect(() => {
        dispatch(GetAllDiemBySinhVienLogins());
        dispatch(getAllSubject());
    }, [dispatch]);

    useEffect(() => {
        if (Object.keys(store.errors).length !== 0) {
            setError(store.errors);
        }
    }, [store.errors]);

    const getSubjectNameById = (ID) => {
        if (!Subjects || Subjects.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const Subject = Subjects.find((monHoc) => monHoc.id === ID);
        return Subject ? Subject.tenMonHoc : 'N/A';
    };

    useEffect(() => {
        dispatch({ type: SET_ERRORS, payload: {} });
    }, [dispatch]);

    const navigate = useNavigate();


    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = useMemo(() => {
      if (Array.isArray(diem)) {
        return diem.slice(offset, offset + itemsPerPage);
      } else {
        return []; // or handle appropriately when Studentsss is not an array
      }
    }, [diem, offset]);
    
    const pageCount = useMemo(() => {
      if (Array.isArray(diem)) {
        return Math.ceil(diem.length / itemsPerPage);
      } else {
        return 0; // or handle appropriately when Studentsss is not an array
      }
    }, [diem, itemsPerPage]);
    
    const startIndex = currentPage * itemsPerPage + 1;
    
    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    Điểm
                </CCardHeader>
                <CCardBody>
                <form >
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="text-center">STT</th>
                                    <th className="text-center">Môn học</th>
                                    <th className="text-center">Điểm chuyên cần</th>
                                    <th className="text-center">Điểm giữa kỳ</th>
                                    <th className="text-center">Điểm thi</th>
                                    <th className="text-center">Điểm trung bình</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData && currentPageData.length > 0 ? (
                                    currentPageData.map((dep, idx) => (
                                        <tr key={idx}>
                                            <td className="text-center">{startIndex + idx}</td>
                                            <td className="text-left">{getSubjectNameById(dep.maMonHoc)}</td>
                                            <td className="text-center">{dep.diemChuyenCan}</td>
                                            <td className="text-center">{dep.diemKiemTraGiuaKi}</td>
                                            <td className="text-center">{dep.diemThi}</td>
                                            <td className="text-center">{dep.diemTongKet}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">Không tìm thấy điểm sinh viên.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </form>
                </CCardBody>
            </CCard>
            <ReactPaginate
                previousLabel={'<<'}
                nextLabel={'>>'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
            />
            <ToastContainer />
        </>
    )
}

export default Marks;
