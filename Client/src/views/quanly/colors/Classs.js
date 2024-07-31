import React, { useEffect, useState, createRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CButton } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import { useDispatch, useSelector } from "react-redux";
import { addClass, updateClass, getAllClass, deleteClass, getAllMajor, getAllStudent } from '../../../redux/actions/adminAction';
import { ADD_CLASS, SET_ERRORS, UPDATE_CLASS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import '../mark/mark.css';
import './class.css';



import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';




const ThemeView = () => {
  const [color, setColor] = useState('rgb(255, 255, 255)')
  const ref = createRef()

  useEffect(() => {
    const el = ref.current.parentNode.firstChild
    const varColor = window.getComputedStyle(el).getPropertyValue('background-color')
    setColor(varColor)
  }, [ref])

  return (
    <table className="table w-100" ref={ref}>
      <tbody>
        <tr>
          <td className="text-body-secondary">HEX:</td>
          <td className="font-weight-bold">{rgbToHex(color)}</td>
        </tr>
        <tr>
          <td className="text-body-secondary">RGB:</td>
          <td className="font-weight-bold">{color}</td>
        </tr>
      </tbody>
    </table>
  )
}

const ThemeColor = ({ className, children }) => {
  const classes = classNames(className, 'theme-color w-75 rounded mb-3')
  return (
    <CCol xs={12} sm={6} md={4} xl={2} className="mb-4">
      <div className={classes} style={{ paddingTop: '75%' }}></div>
      {children}
      <ThemeView />
    </CCol>
  )
}

ThemeColor.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

const Classs = () => {

  const dispatch = useDispatch();
  const [checkedValue, setCheckedValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const Class = useSelector((state) => state.admin.allClasss) || [];
  const store = useSelector((state) => state);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [search, setSearch] = useState(false);
  const Majors = useSelector((state) => state.admin.allMajor) || [];
  const Students = useSelector((state) => state.admin.allStudent) || [];
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClassId, setCurrentClassId] = useState(null); 
  const [currentMajorId, setCurrentMajorId] = useState(null); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState({
    maLop: "",
    tenLop: "",
    maChuyenNganh: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;



  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue({
        maLop: "",
        tenLop: "",
        maChuyenNganh: "",
      });
    }
  }, [store.errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    if (!value.tenLop || !value.maChuyenNganh) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    const existingclass = Class.find((classs) => classs.tenLop == value.tenLop);
    if(existingclass){
      toast.error("Lớp này đã có chuyên ngành");
      return;
    }

    
    const formData = {
      maLop: value.maLop,
      tenLop: value.tenLop,
      maChuyenNganh: value.maChuyenNganh,
    };

    console.log("Form class:", formData); 
  
    try {
      if (isEditing) {
        await dispatch(updateClass(currentClassId, formData));
        toast.success("Chỉnh sửa lớp học thành công!");
      } else {
        await dispatch(addClass(formData));
        toast.success("Thêm lớp học mới thành công!");
      }
      setIsEditing(false);
      setShowAddForm(false);
      setValue({maLop: "", tenLop: "", maChuyenNganh: "" });
      dispatch(getAllClass());         
    } catch (error) {
      console.error("Error adding class:", error);
      setError({ backendError: "Error adding class" });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store.errors || store.admin.classAdd) {
      setLoading(false);
      if (store.admin.classAdd) {
        setValue({
          maLop: "",
          tenLop: "",
          maChuyenNganh: "",
        });

        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_CLASS, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.classAdd]);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllClass());
    dispatch(getAllMajor());
    dispatch(getAllStudent());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    if (Class?.length !== 0) {
      setLoading(false);
    }
  }, [Class, currentPage]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  const navigate = useNavigate();

  const handleAddButtonClick = () => {
    setIsEditing(false);
    setValue({maLop: "", tenLop: "", maChuyenNganh: "" });
    setShowAddForm(true);
  };

  const handleEditButtonClick = (dep) => {
    setIsEditing(true);
    setCurrentClassId(dep.id);
    setValue({maLop: dep.maLop, tenLop: dep.tenLop, maChuyenNganh: dep.maChuyenNganh});
  };

  const handleDeleteButtonClick = async (id) => {
    try {
      // Kiểm tra xem lớp học có học sinh hay không
      const students = Students.filter(student => student.maLop === id);
      if (students.length > 0) {
        toast.error('Không thể xóa lớp học đã có học sinh!');
        return; // Dừng hàm nếu có học sinh trong lớp
      }

      const confirmed = await confirm('Bạn có chắc chắn muốn xóa lớp học này?');
      if (confirmed) {
        await dispatch(deleteClass(id));
        toast.success('Xóa lớp học thành công!');
        dispatch(getAllClass());
        dispatch(getAllMajor());
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Xóa lớp học không thành công!');
    }
  };

  const handleInputChange = (e) => {
    const tempCheck = checkedValue;
    let index;
    if (e.target.checked) {
      tempCheck.push(e.target.value);
    } else {
      index = tempCheck.indexOf(e.target.value);
      tempCheck.splice(index, 1);
    }
    setCheckedValue([...tempCheck]);
  };

  const handdelete = (e) => {
    setShowAddForm(false);
    setIsEditing(false);
  }



  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


  const getMajorNameById = (ID) => {
    if (!Majors || Majors.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
    const major = Majors.find((major) => major.id === ID);
    return major ? major.tenChuyenNganh : 'N/A';
  };


  const filteredClasses = useMemo(() => {
    const uniqueFilteredClasses = [];
    const addedLop = {};
    
    Class.forEach((dep) => {
      const matchQuery = dep.tenLop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dep.maLop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getMajorNameById(dep.maChuyenNganh).toLowerCase().includes(searchQuery.toLowerCase());
      
      if (matchQuery && !addedLop[dep.id]) {
        uniqueFilteredClasses.push(dep);
        addedLop[dep.id] = true;
      }
    });
  
    return uniqueFilteredClasses;
  }, [Class, searchQuery]);
  
  const offset = currentPage * itemsPerPage;
  const currentPageData = useMemo(() => filteredClasses.slice(offset, offset + itemsPerPage), [filteredClasses, offset]);
  const pageCount = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage + 1;

  const handleShowModal = (classID) => {
    setCurrentClassId(classID);
    setShowModal(true);

     // Tìm thông tin lớp học dựa trên currentClassId và cập nhật currentMajorId
    const currentClass = Class.find((dep) => dep.id === classID);
    if (currentClass) {
      setCurrentMajorId(currentClass.maChuyenNganh);
    } else {
      setCurrentMajorId(null); // Xử lý trường hợp không tìm thấy thông tin lớp học
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getStudentNameById = (ID) => {
    if (!Class || Class.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
    const classs = Class.find((classs) => classs.id === ID);
    return classs ? classs.tenLop : 'N/A';
  };



  const filteredStudents = Students.filter(student => student.maLop === currentClassId);

  const exportToExcel = async () => {
    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách sinh viên');

    // Tên lớp và chuyên ngành cần hiển thị
    const className = getStudentNameById(currentClassId);
    const majorName = getMajorNameById(currentMajorId);

    // Thêm thông tin lớp và chuyên ngành vào worksheet
    worksheet.addRow(['Lớp:', className]);
    worksheet.addRow(['Chuyên ngành:', majorName]);
    worksheet.addRow([]); // Dòng trống để phân cách

    // Định nghĩa header và dữ liệu
    const headers = ['STT', 'MSSV', 'Họ và tên', 'Email', 'Số điện thoại'];
    const dataToExport = filteredStudents.map((student, index) => [
        index + 1,
        student.maSinhVien,
        student.hoTen,
        student.email,
        student.soDienThoai,
    ]);

    const headerRow = worksheet.addRow(headers);
        
    // Tô màu vàng cho dòng headers
    headerRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' }, // Màu vàng
            bgColor: { argb: 'FFFF00' } // Màu vàng
        };
    });

    // Thêm dữ liệu sinh viên vào worksheet
    dataToExport.forEach(row => {
        worksheet.addRow(row);
    });

    // Định dạng cho các ô trong worksheet
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
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
    saveAs(dataBlob, 'Danh sách sinh viên.xlsx');
};

const exportLop = async () => {
  // Tạo workbook và worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Chuyên ngành');

  // Định nghĩa header và dữ liệu
  const headers = ['STT', 'Mã lớp', 'lớp', 'Chuyên ngành'];
  const dataToExport = Class.map((classs, index) => [
      index + 1,
      classs.maLop,
      classs.tenLop,
      getMajorNameById(classs.maChuyenNganh)
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
  saveAs(dataBlob, 'Danh Sách Lớp.xlsx');
};





  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className='row'>
            <div className='col-lg-7'>
              Lớp Học
            </div>
            <div className='col-lg-5 search-container'>
              <input type="text" id="myInput" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm..." className="search-input"/>
              <button onClick={exportLop}  className="btn add-new mr-2" type="button" data-toggle="tooltip" data-placement="top" title="In file"><i className="fas fa-download  mr-2 mt-1"></i>Xuất file</button>  
              <button onClick={handleAddButtonClick} className="btn btn-success btn add-news" type="button" data-toggle="tooltip" data-placement="top" title="Thêm Lớp"><i className="fas fa-plus-circle mr-2 mt-1"></i>Nhập Lớp</button>  
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: 'auto' }}>
          <CRow>
          <form>
  <table className="table table-bordered">
    <thead className="thead-dark">
      <tr>
        <th className="text-center">STT</th>
        <th className="text-center">Mã lớp</th>
        <th className="text-center">Tên lớp</th>
        <th className="text-center">Chuyên ngành</th>
        <th className="text-center">Danh sách SV</th>
        <th className="text-center">Chức năng</th>
      </tr>
    </thead>
    <tbody>
    {showAddForm && (
                          <tr>
                            <td></td>
                            <td>
                            <input type="text"  className="form-control custom-input"  id="maLop" name="maLop" placeholder="Nhập mã lớp...." value={value.maLop} onChange={(e) => setValue({ ...value, maLop: e.target.value })} />
                            </td>
                            <td>
                              <input type="text"  className="form-control custom-input"  id="tenLop" name="tenLop" placeholder="Nhập tên lớp...." value={value.tenLop} onChange={(e) => setValue({ ...value, tenLop: e.target.value })} />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                value={value.maChuyenNganh}
                                onChange={(e) =>
                                  setValue({ ...value, maChuyenNganh: e.target.value })
                                }
                              >
                                <option value="">Chọn ngành...</option>
                                {Majors.map((major) => (
                                  <option key={major.id} value={major.id}>
                                    {major.tenChuyenNganh}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td></td>
                            <td className="text-center">
                              <button 
                                onClick={handleSubmit} 
                                className="btn btn-success mr-3"
                              >
                                Lưu
                              </button>
                              <button 
                                onClick={handdelete} 
                                className="btn btn-danger"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        )}
      {currentPageData && currentPageData.length > 0 ? (
        currentPageData.map((dep, idx) => (
          <tr key={dep.id}>
            <td className="text-center">{startIndex + idx}</td>
            <td className="text-left">{isEditing && currentClassId === dep.id ? (
                                  <input className="form-control" type="text" value={value.maLop} onChange={(e) => setValue({ ...value, maLop: e.target.value })} />
                                ) : (
                                  dep.maLop
                                )}</td>
            <td className="text-left">{isEditing && currentClassId === dep.id ? (
                                  <input className="form-control" type="text" value={value.tenLop} onChange={(e) => setValue({ ...value, tenLop: e.target.value })} />
                                ) : (
                                  dep.tenLop
                                )}</td>
                               <td className="text-left">{isEditing && currentClassId === dep.id ? (
                                <select className="form-control" value={value.maChuyenNganh} onChange={(e) => setValue({ ...value, maChuyenNganh: e.target.value })}>
                                  <option value="">Chọn ngành</option>
                                  {Majors.map((major) => (
                                    <option key={major.id} value={major.id}>{major.tenChuyenNganh}</option>
                                  ))}
                                </select>
                              ) : (
                                getMajorNameById(dep.maChuyenNganh)
                              )}</td>
                              <td className="text-center">
                                <button className='btn btn-info' onClick={() => handleShowModal(dep.id)}>DS Sinh Viên</button>
                              </td>
                                <td className="text-center">
                                  {isEditing && currentClassId === dep.id ? (
                                    <button onClick={handleSubmit} className="btn btn-success mr-3 cursor-pointer">Lưu</button>
                                  ) : (
                                    <button className="btn btn-warning mr-3 cursor-pointer" onClick={() => handleEditButtonClick(dep)}>Sửa</button>
                                  )}
                                  <button className="btn btn-danger cursor-pointer " onClick={() => handleDeleteButtonClick(dep.id)}>Xóa</button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center">Không tìm thấy lớp.</td>
                            </tr>
                          )}
                </tbody>
              </table>
            </form>
          </CRow>

          <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
              <div className="modal-dialog" role="document">
              <div className='class'>
                <div className="modal-content">
                      <div className="modal-header">
                          <div className='row'>
                            <div className='col-lg-12'>
                              <h5 className="modal-title">Danh sách sinh viên lớp : {getStudentNameById(currentClassId)}</h5>
                            </div>
                            <div className='col-lg-12'>
                              <h6 className='modal-title'>Chuyên ngành : {getMajorNameById(currentMajorId)}</h6>
                            </div>
                          </div>
                        <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div className="modal-body">
                        <div className='tables'>
                        <table className="">
                            <thead className="">
                            <tr>
                              <th className="text-left">STT</th>  
                              <th className="text-left">MSSV</th>  
                              <th className="text-left">Họ và tên</th>
                              <th className="text-left">Ngày sinh</th>
                              <th className="text-left">Số điện thoại</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                  <tr key={student.id}>
                                    <td >{index + 1}</td>
                                    <td>{student.maSinhVien}</td>
                                    <td>{student.hoTen}</td>
                                    <td> 
                                      {new Date(student.ngaySinh).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}</td>
                                    <td>{student.soDienThoai}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center">
                                    Không có dữ liệu
                                  </td>
                                </tr>
                              )}
                            </tbody>
                        </table>
                        </div>
                        </div>
                        <div className="modal-footer">
                          <div className="pagination-container">
                          <ReactPaginate
                            previousLabel={'<<'}
                            nextLabel={'>>'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={10} // Điều chỉnh để hiển thị 10 mục trên mỗi trang
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                          />
                        </div>
                        <CButton onClick={exportToExcel} size="sm" color="primary" className="same-size-button ml-2">
                          Xuất file
                        </CButton>
                        <CButton color="secondary" onClick={handleCloseModal} size="sm" className="same-size-button">
                          Đóng
                        </CButton>
                          </div>
                        </div>
                </div>
              </div>
            </div>
            <div className={`modal-backdrop fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}></div>
           
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

export default Classs
