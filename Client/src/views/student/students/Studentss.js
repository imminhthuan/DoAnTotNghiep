
import { CCard, CCardHeader, CCardBody, CButton } from '@coreui/react'
import { DocsLink } from 'src/components'
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { bysinhvienlogins, getAllClass } from "../../../redux/actions/adminAction";
import { ADD_STUDENT, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";
import './studentss.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const Studentss = () => {
    const dispatch = useDispatch();
    const Studentss = useSelector((state) => state.admin.bySinhVienLogins) || {};
    const Class = useSelector((state) => state.admin.allClasss) || [];
    const [loading, setLoading] = useState(false);
    const store = useSelector((state) => state);
    console.log("testsssssssssssssssss", Studentss);
   
    useEffect(() => {
      setLoading(true);
      dispatch(bysinhvienlogins());
      dispatch(getAllClass());
    }, [dispatch]);
  
    useEffect(() => {
      if (Object.keys(store.errors).length !== 0) {
        setError(store.errors);
        setLoading(false);
      }
    }, [store.errors]);
  
    const getStudentNameById = (ID) => {
      if (!Class || Class.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
      const classs = Class.find((classs) => classs.id === ID);
      return classs ? classs.tenLop : 'N/A';
    };
      const getStudentNameByIds = (ID) => {
        if (!Class || Class.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const classs = Class.find((classs) => classs.id === ID);
        return classs ? classs.maLop : 'N/A';
    };
  
    useEffect(() => {
      dispatch({ type: SET_ERRORS, payload: {} });
    }, [dispatch]);



    return (
      <>
        <CCard className="mb-4">
          <CCardHeader>
            Thông tin sinh viên
          </CCardHeader>
          <CCardBody>
            <form>
              <div className='student-info'>
                <div className="row">
                  <div className="col-md-6">
                    <div className='student-info'>
                      <div className="info-item">
                        <p><strong>MSSV:</strong> {Studentss.maSinhVien}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Họ và tên:</strong> {Studentss.hoTen}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Ngày sinh:</strong> {new Date(Studentss.ngaySinh).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })} </p>
                      </div>
                      <div className="info-item">
                        <p><strong>Giới tính:</strong> {Studentss.gioiTinh}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Số điện thoại:</strong> {Studentss.soDienThoai}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Địa chỉ:</strong> {Studentss.diaChi}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className='student-info'>
                      <div className="info-item">
                        <p><strong>Email:</strong> {Studentss.email}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Trình độ:</strong> {Studentss.trinhDo}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Niên khóa:</strong> {Studentss.nienKhoa}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Tên lớp:</strong> {getStudentNameById(Studentss.maLop)}</p>
                      </div>
                      <div className="info-item">
                        <p><strong>Mã lớp:</strong> {getStudentNameByIds(Studentss.maLop)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CCardBody>
        </CCard>
        <ToastContainer />
      </>
    )
}

export default Studentss
