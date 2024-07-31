
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { DocsLink } from 'src/components'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSubject, deleteSubject, getAllMajor, getAllSubject, updateSubject } from "../../../redux/actions/adminAction";
import { ADD_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import '../mark/mark.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import './subject.css';

const Monhoc = () => {

    const dispatch = useDispatch();
    const [error, setError] = useState({});
    const Subjects = useSelector((state) => state.admin.allSubject) || [];
    const Major = useSelector((state) => state.admin.allMajor) || [];
    const [loading, setLoading] = useState(false);
    const store = useSelector((state) => state);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [checkedValue, setCheckedValue] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSubjectId, setCurrentSubjectId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [value, setValue] = useState({
      tenMonHoc: "",
      soTinChi: "",
      maChuyenNganh: "", 
    });
    const [search, setSearch] = useState(false);
  
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
  
    useEffect(() => {
      if (Object.keys(store.errors).length !== 0) {
        setError(store.errors);
        setValue({
            tenMonHoc: "",
            soTinChi: "",
            maChuyenNganh: "", 
        });
      }
    }, [store.errors]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError({});
      setLoading(true);
      
      if (!value.tenMonHoc || !value.soTinChi || !value.maChuyenNganh) {
        toast.error("Vui lòng điền đầy đủ thông tin.");
        setLoading(false);
        return;
      }

      const formData = {
        tenMonHoc: value.tenMonHoc,
        soTinChi: value.soTinChi,
        maChuyenNganh: value.maChuyenNganh,
      };
  
      console.log("Form Data:", formData); 
    
      try {
        if (isEditing) {
          // Đây là trường hợp chỉnh sửa
          await dispatch(updateSubject(currentSubjectId, formData));
          toast.success("Chỉnh sửa môn học thành công");
        } else {
          // Đây là trường hợp thêm mới
          await dispatch(addSubject(formData));
          toast.success("Thêm môn học thành công")
        }
        setIsEditing(false);
        setShowAddForm(false);
        setValue({ tenMonHoc: "", soTinChi: "", maChuyenNganh: ""});
        // Tải lại trang để cập nhật danh sách lớp
        dispatch(getAllSubject());
      } catch (error) {
        console.error("Error adding class:", error);
        setError({ backendError: "Error adding class" });
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (store.errors || store.admin.subjectAdd) {
        setLoading(false);
        if (store.admin.subjectAdd) {
          setValue({
            tenMonHoc: "",
            soTinChi: "",
            maChuyenNganh: "", 
          });
  
          dispatch({ type: SET_ERRORS, payload: {} });
          dispatch({ type: ADD_SUBJECT, payload: false });
        }
      } else {
        setLoading(true);
      }
    }, [store.errors, store.admin.subjectAdd]);
  
  
    useEffect(() => {
      setLoading(true);
      dispatch(getAllSubject());
      dispatch(getAllMajor());
    }, [dispatch]);
  
    useEffect(() => {
      if (Object.keys(store.errors).length !== 0) {
        setError(store.errors);
        setLoading(false);
      }
    }, [store.errors]);
  
  
    const handleInputChange = (e) => {
      const tempCheck = checkedValue;
      let index;
      if (e.target.checked) {
        tempCheck.push(e.target.value);
      } else {
        index = tempCheck.indexOf(e.target.value);
        tempCheck.splice(index, 1);
      }
      setCheckedValue(tempCheck);
    };
  
    useEffect(() => {
      dispatch({ type: SET_ERRORS, payload: {} });
    }, [dispatch]);
  
  
    const handleAddButtonClick = () => {
      setIsEditing(false);
      setValue({ tenMonHoc: "", soTinChi: "", maChuyenNganh: ""});
      setShowAddForm(true);
    };
  
    const handleEditButtonClick = (dep) => {
      setIsEditing(true);
      setCurrentSubjectId(dep.id);
      setValue({ tenMonHoc: dep.tenMonHoc, soTinChi: dep.soTinChi, maChuyenNganh: dep.maChuyenNganh});
    };
  
    const handleDeleteButtonClick = async (id) => {
      setLoading(true);
      try {
        await dispatch(deleteSubject(id));
        toast.success("Xóa Thành Công")
        dispatch(getAllSubject()); 
        dispatch(getAllMajor());
      } catch (error) {
        console.error("Error deleting class:", error);
        setLoading(false);
      }
    };

    const handlePageClick = (data) => {
      setCurrentPage(data.selected);
    };

    
    const getSubjectNameById = (ID) => {
      if (!Major || Major.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
      const major = Major.find((subject) => subject.id === ID);
      return major ? major.tenChuyenNganh : 'N/A';
    };
  
  
    const offset = currentPage * itemsPerPage;
    const filteredSubjects = Subjects.filter(subject => 
      subject.tenMonHoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSubjectNameById(subject.maChuyenNganh).toLowerCase().includes(searchQuery.toLowerCase())
    );
    const currentPageData = Array.isArray(filteredSubjects) ? filteredSubjects.slice(offset, offset + itemsPerPage) : [];
    const pageCount = Array.isArray(filteredSubjects) ? Math.ceil(filteredSubjects.length / itemsPerPage) : 0;
    const startIndex = currentPage * itemsPerPage + 1;
  
    const handdelete = (e) => {
      setShowAddForm(false);
    }
    
    const exportToExcel = async () => {
      // Tạo workbook và worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Môn Học');
  
      // Định nghĩa header và dữ liệu
      const headers = ['STT', 'Tên Môn Học', 'Số Tín Chỉ', 'Chuyên Ngành'];
      const dataToExport = Subjects.map((subject, index) => [
          index + 1,
          subject.tenMonHoc,
          subject.soTinChi,
          getSubjectNameById(subject.maChuyenNganh)
      ]);
  
      // Thêm header vào worksheet
      worksheet.addRow(headers);
  
      // Định dạng header
      headers.forEach((header, index) => {
          const cell = worksheet.getCell(1, index + 1);
          cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' }
          };
          cell.font = {
              bold: true
          };
          cell.alignment = {
              vertical: 'middle', 
              horizontal: 'center'
          };
          cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
          };
      });
  
      // Thêm dữ liệu vào worksheet
      dataToExport.forEach((row) => {
          worksheet.addRow(row);
      });
  
      // Kẻ bảng cho tất cả các ô
      worksheet.eachRow((row, rowNumber) => {
          row.eachCell((cell, colNumber) => {
              cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
              };
              cell.alignment = {
                  vertical: 'middle', 
                  horizontal: 'left' // Căn trái cho cột "Số Tín Chỉ", căn giữa cho các cột khác
              };
          });
      });
  
      // Tự động điều chỉnh độ rộng của cột
      worksheet.columns.forEach(column => {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, cell => {
              const columnLength = cell.value ? cell.value.toString().length : 10;
              if (columnLength > maxLength) {
                  maxLength = columnLength;
              }
          });
          column.width = maxLength + 2; // Thêm khoảng cách để không bị quá chật
      });
  
      // Ghi workbook vào buffer
      const buffer = await workbook.xlsx.writeBuffer();
  
      // Tạo Blob từ buffer và lưu tệp
      const dataBlob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(dataBlob, 'MonHoc.xlsx');
  };
    
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className='row'>
            <div className='col-lg-6'>
              Môn Học
            </div>
            <div className='col-lg-6 search-container'>
              <input type="text" id="myInput" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm..." className="search-input"/>
              <button onClick={exportToExcel}  className="btn add-new mr-2" type="button" data-toggle="tooltip" data-placement="top" title="In file"><i className="fas fa-download  mr-2 mt-1"></i>Xuất file</button>  
              <button onClick={handleAddButtonClick} className="nv btn add-newss" type="button" data-toggle="tooltip" data-placement="top"
                      title="Thêm Môn Học"><i className="fas fa-book-open mr-2 mt-1"></i>Nhập môn học</button>  
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
        <form >
          
                    <table className="table table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th className="text-center">STT</th>  
                          <th className="text-center">Môn học</th>
                          <th className="text-center">Số tín chỉ</th>
                          <th className="text-center">Chuyên ngành</th>
                          <th className="text-center">Chức năng</th>
                        </tr>
                      </thead>
                      <tbody>
                      {showAddForm && (
                          <tr>
                            <td></td>
                            {/* <td>
                              <input
                                onChange={handleInputChange}
                                className="custom-checkbox"
                                type="checkbox"
                              />
                            </td> */}
                            <td>
                              <input type="text" className="form-control" id="tenMonHoc" name="tenMonHoc" placeholder="Nhập tên môn học" value={value.tenMonHoc} onChange={(e) => setValue({ ...value, tenMonHoc: e.target.value })} />
                            </td>
                            <td>
                              <input type="text" className="form-control" id="soTinChi" name="soTinChi" placeholder="Nhập số tín chỉ" value={value.soTinChi} onChange={(e) => setValue({ ...value, soTinChi: e.target.value })} />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                value={value.maChuyenNganh}
                                onChange={(e) =>
                                  setValue({ ...value, maChuyenNganh: e.target.value })
                                }
                              >
                                <option value="">Chọn ngành</option>
                                {Major.map((major) => (
                                  <option key={major.id} value={major.id}>
                                    {major.tenChuyenNganh}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td  className="text-center">
                              <button onClick={handleSubmit} className="btn btn-success mr-3 cursor-pointer icon-button">Lưu</button>
                              <button onClick={handdelete} className="btn btn-danger cursor-pointer icon-button">Xóa</button>
                            </td>
                          </tr>
                        )}
                      {currentPageData && currentPageData.length > 0 ? (
                              currentPageData.map((dep, idx) => (
                                <tr key={idx}>
                                  <td className="text-center">{startIndex + idx}</td>
                                  <td className="text-left">{isEditing && currentSubjectId === dep.id ? (
                                  <input className="form-control" type="text" value={value.tenMonHoc} onChange={(e) => setValue({ ...value, tenMonHoc: e.target.value })} />
                                  ) : (
                                    dep.tenMonHoc
                                  )}</td>
                                  <td className="text-center">{isEditing && currentSubjectId === dep.id ? (
                                  <input className="form-control" type="text" value={value.soTinChi} onChange={(e) => setValue({ ...value, soTinChi: e.target.value })} />
                                  ) : (
                                    dep.soTinChi
                                  )}</td>
                                   <td className="text-left">{isEditing && currentSubjectId === dep.id ? (
                                  <select className="form-control" value={value.maChuyenNganh} onChange={(e) => setValue({ ...value, maChuyenNganh: e.target.value })}>
                                    <option value="">Chọn Chuyên Ngành</option>
                                    {Major.map((subject) => (
                                      <option key={subject.id} value={subject.id}>{subject.tenChuyenNganh}</option>
                                    ))}
                                  </select>
                                ) : (
                                    getSubjectNameById(dep.maChuyenNganh)
                                )}</td>
                                  <td className="text-center">
                                    {isEditing && currentSubjectId === dep.id ? (
                                      <button onClick={handleSubmit} className="btn btn-success mr-3 cursor-pointer icon-button">Lưu</button>
                                    ) : (
                                      <button className="btn btn-warning mr-3 cursor-pointer icon-button" onClick={() => handleEditButtonClick(dep)}>Sửa</button>
                                    )}
                                    <button className="btn btn-danger cursor-pointer icon-button" onClick={() => handleDeleteButtonClick(dep.id)}>Xóa</button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="text-center">Không có môn học.</td>
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

export default Monhoc
