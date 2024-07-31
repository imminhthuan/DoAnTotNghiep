import { CModal, CCard, CCardHeader, CCardBody, CModalBody, CModalHeader, CModalFooter, CButton } from '@coreui/react';
import { DocsLink } from 'src/components';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMarkStudent, getAllMarkSubject, deleteMark, updateMarks, addMajor, getAllStudent, getAllClass, getAllSubject, addMark } from "../../../redux/actions/adminAction";
import { ADD_MARK, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";
import './mark.css';
import './modal.css';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Mark = () => {
    const dispatch = useDispatch();
    const [checkedValue, setCheckedValue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const Students = useSelector((state) => state.admin.allStudent) || [];
    const Class = useSelector((state) => state.admin.allClasss) || [];
    const Subjects = useSelector((state) => state.admin.allSubject) || [];
    const Majors = useSelector((state) => state.admin.allMajor) || [];
    const MarkSinhvien = useSelector((state) => state.admin.allMarkStudent) || [];
    const store = useSelector((state) => state);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [search, setSearch] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSua, setShowModalssss] = useState(false);
    const [showModalss, setShowModalss] = useState(false);
    const [showModals, setShowModals] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMarkId, setCurrentMarkId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudentss, setFilteredStudentss] = useState([]);
    const [studentMarks, setStudentMarks] = useState([]);
    const [marks, setMarks] = useState([]); // State để lưu điểm của các sinh viên
    const [currentStudentMarks, setCurrentStudentMarks] = useState([]); // State để lưu điểm hiện tại của sinh viên trong modal
    const [majorName, setMajorName] = useState("");

    const [value, setValue] = useState({
        diemChuyenCan: '',
        diemKiemTraGiuaKi: '',
        diemThi: '',
    });

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        if (Object.keys(store.errors).length !== 0) {
            setError(store.errors);
            setValue({
                diemChuyenCan: '',
                diemKiemTraGiuaKi: '',
                diemThi: '',
            });
        }
    }, [store.errors]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});

        try {
            const selectedMonHocId = studentMarks.length > 0 ? studentMarks[0].monHocId : '';
            const formData = {
                monHocId: selectedMonHocId,
                studentScores: studentMarks.map(studentMark => ({
                    sinhVienId: studentMark.sinhVienId,
                    diem: {
                        diemChuyenCan: studentMark.diemChuyenCan || 0,
                        diemKiemTraGiuaKi: studentMark.diemKiemTraGiuaKi || 0,
                        diemThi: studentMark.diemThi || 0,
                    }
                }))
            };

            console.log("Data to be sent:", formData);

            await dispatch(addMark(formData));
            toast.success("Thêm điểm thành công!");


            setIsEditing(false);
            setShowAddForm(false);
            setStudentMarks([]);
            setShowModals(false);
        } catch (error) {
            console.error("Error adding marks:", error);
            setError({ backendError: error.message });
        }
    };

    const handleSubmitssss = async (e, sinhVienId) => {
        e.preventDefault();
        setError({});

        const formData = {
            diemChuyenCan: value.diemChuyenCan,
            diemKiemTraGiuaKi: value.diemKiemTraGiuaKi,
            diemThi: value.diemThi
        };

        try {


            console.log("Data to be sent:", formData);

            if (isEditing) {
                await dispatch(updateMarks(currentMarkId, formData));
                toast.success("Chỉnh sửa điểm thành công!");
                console.log("Data to be sent:", formData);
            }
            setIsEditing(false);
            setShowAddForm(false);
            setShowModal(false);
            dispatch(getAllMarkStudent(sinhVienId));
        } catch (error) {
            console.error("Error adding marks:", error);
            setError({ backendError: error.message });
        }
    };



    useEffect(() => {
        if (store.errors || store.admin.markAdd) {
            if (store.admin.markAdd) {
                setValue({
                    selectedMonHocId: selectedMonHocIds,
                    formData: initialFormDatas
                });

                dispatch({ type: SET_ERRORS, payload: {} });
                dispatch({ type: ADD_MARK, payload: false });
            }
        } else {

        }
    }, [store.errors, store.admin.markAdd]);

    useEffect(() => {
        dispatch(getAllStudent());
        dispatch(getAllClass());
        dispatch(getAllMarkStudent());
        dispatch(getAllMarkSubject());
        dispatch(getAllSubject());
    }, [dispatch]);

    useEffect(() => {
        if (Object.keys(store.errors).length !== 0) {
            setError(store.errors);
        }
    }, [store.errors]);



    useEffect(() => {
        dispatch({ type: SET_ERRORS, payload: {} });
    }, [dispatch]);

    const navigate = useNavigate();



    const handleDeleteButtonClick = async (sinhVienId, monHocId) => {
        try {
            await dispatch(deleteMark(sinhVienId, monHocId));
            toast.success("Xóa điểm thành công!");
            dispatch(getAllMarkStudent(sinhVienId));
            dispatch(getAllSubject());
            dispatch(getAllStudent());
        } catch (error) {
            console.error("Error deleting class:", error);
            toast.error("Xóa điểm không thành công!");
        }
    };

    const handleInputChanges = (e, field, index) => {
        const updatedStudentMarks = [...studentMarks];
        if (!updatedStudentMarks[index].diem) {
            updatedStudentMarks[index].diem = {}; // Khởi tạo diem nếu chưa có
        }
        if (field === 'monHocId') {
            updatedStudentMarks[index][field] = e.target.value; // Cập nhật monHocId
        } else {
            updatedStudentMarks[index].diem[field] = e.target.value;
        }
        setStudentMarks(updatedStudentMarks);
    };


    const handdelete = (e) => {
        setShowAddForm(false);
    }

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const getStudentNameById = (ID) => {
        if (!Class || Class.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const classs = Class.find((classs) => classs.id === ID);
        return classs ? classs.tenLop : 'N/A';
    };

    const getStudentNameByIds = (ID) => {
        if (!Students || Students.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const student = Students.find((student) => student.id === ID);
        return student ? student.hoTen : 'N/A';
    };

    const getStudentBirthplace = (ID) => {
        if (!Students || Students.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const student = Students.find((student) => student.id === ID);
        return student ? student.diaChi : 'N/A';
    };

    const getStudentNameByIdss = (ID) => {
        if (!Students || Students.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const student = Students.find((student) => student.id === ID);
        return student ? student.ngaySinh : 'N/A';
    };
    const getStudentgiotinh = (ID) => {
        if (!Students || Students.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const student = Students.find((student) => student.id === ID);
        return student ? student.gioiTinh : 'N/A';
    };
    const getStudentnienkhoa = (ID) => {
        if (!Students || Students.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const student = Students.find((student) => student.id === ID);
        return student ? student.nienKhoa : 'N/A';
    };
    const getStudenttrinhdo = (ID) => {
        if (!Students || Students.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const student = Students.find((student) => student.id === ID);
        return student ? student.trinhDo : 'N/A';
    };

    const getSubjectNameById = (ID) => {
        if (!Subjects || Subjects.length === 0) return 'N/A'; // Handle case where majors is undefined or empty
        const Subject = Subjects.find((monHoc) => monHoc.id === ID);
        return Subject ? Subject.tenMonHoc : 'N/A';
    };


    const offset = currentPage * itemsPerPage;
    const currentPageData = Students.filter(student => student.maLop === selectedClassId).slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(Students.filter(student => student.maLop === selectedClassId).length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage + 1;




    // Function để đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleCloseModals = () => {
        setShowModals(false);
    };

    const handleCloseModalss = () => {
        setShowModalss(false);
    };


    const handleClassChange = (e) => {
        dispatch(getAllClass());
        const selectedClassId = e.target.value;
        setSelectedClassId(selectedClassId);
    };

    const filteredStudents = useMemo(() => {
        if (!searchTerm) {
            return currentPageData.filter(student => student.maLop === selectedClassId);
        }
        return currentPageData.filter(student =>
            student.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) && student.maLop === selectedClassId
        );
    }, [currentPageData, searchTerm, selectedClassId]);


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };



    const handleShowModals = () => {
        const classStudents = Students.filter(student => student.maLop === selectedClassId);
        const initialStudentMarks = classStudents.map(student => ({
            sinhVienId: student.id,
            hoTen: student.hoTen,
            diemChuyenCan: 0,
            diemBaiTap: 0,
            diemThucHanh: 0,
            diemKiemTraGiuaKi: 0,
            diemThi: 0,
            monHocId: ""
        }));
        setStudentMarks(initialStudentMarks);
        setShowModals(true);
    };


    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const updatedMarks = [...studentMarks];
        updatedMarks[index][name] = parseInt(value, 10);
        setStudentMarks(updatedMarks);
    };

    const handleShowModalss = (sinhVienId) => {
        setCurrentStudentMarks(sinhVienId);
        dispatch(getAllMarkStudent(sinhVienId));
        setShowModalss(true);
    };


    const handleShowModalssss = () => {
        setShowModalssss(true);
    };

    const handleCloseModalsssss = () => {
        setShowModalssss(false);
    };



    const handleShowModal = (sinhVienId) => {
        setCurrentStudentMarks(sinhVienId);
        dispatch(getAllMarkStudent(sinhVienId)); // Gọi action để lấy danh sách điểm của sinh viên
        dispatch(getAllStudent());
        setShowModal(true);
    };

    useEffect(() => {
        if (selectedClassId) {
            dispatch(getAllMarkStudent(selectedClassId));
        }
    }, [selectedClassId, dispatch])

    useEffect(() => {
        if (selectedClassId) {
          const selectedClass = Class.find((classs) => classs.id === selectedClassId);
          if (selectedClass) {
            const selectedMajor = Majors.find((major) => major.id === selectedClass.maChuyenNganh);
            setMajorName(selectedMajor ? selectedMajor.tenChuyenNganh : "");
          }
        }
      }, [selectedClassId, Class, Majors]);


    const dataToExport = MarkSinhvien.map((diem, index) => [
        index + 1,
        getSubjectNameById(diem.maMonHoc),
        diem.diemChuyenCan,
        diem.diemKiemTraGiuaKi,
        diem.diemThi,
        Number.isInteger(diem.diemTongKet) ? diem.diemTongKet : diem.diemTongKet.toFixed(1)
    ]);

    const getStudentInfo = () => {
        if (MarkSinhvien.length > 0) {
            const firstStudent = MarkSinhvien[0];
            const studentName = getStudentNameByIds(firstStudent.maSinhVien);
            const birthDate = formatBirthDate(getStudentNameByIdss(firstStudent.maSinhVien));
            const major = majorName; 
            const className = getStudentNameById(selectedClassId); 
        }
        return;
    };

    const formatBirthDate = (date) => {
        if (!date) return 'Chưa xác định'; // Nếu không có ngày sinh thì trả về thông báo mặc định
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const getStudentInfos = () => {
        if (MarkSinhvien.length > 0) {
            const firstStudents = MarkSinhvien[0];
            const stusdentSet = getStudentgiotinh(firstStudents.maSinhVien); 
            const studentBirthplace = getStudentBirthplace(firstStudents.maSinhVien);
            const studentDegree = getStudentnienkhoa(firstStudents.maSinhVien);
            const studentAcademicYear = getStudenttrinhdo(firstStudents.maSinhVien);
        }
        return;
    };
    

    const getStudent = () => {
        if (MarkSinhvien.length > 0) {
            const firstStudent = MarkSinhvien[0];
            const studentName = getStudentNameByIds(firstStudent.maSinhVien);
            return `${studentName}`;
        }
        return;
    };

    const calculateAverageMark = () => {
        if (MarkSinhvien.length === 0) return 0;

        const totalMarks = MarkSinhvien.reduce((total, diem) => total + diem.diemTongKet, 0);
        const averageMark = totalMarks / MarkSinhvien.length;
        return averageMark.toFixed(1); // Làm tròn đến 2 chữ số thập phân
    };

    // Xác định xếp loại tốt nghiệp
    //const getGraduationClassification = (averageMark) => {
    //if (averageMark < 5) return 'Rớt tốt nghiệp';
    //if (averageMark < 6) return 'Yếu';
    //if (averageMark < 7) return 'Trung bình';
    //if (averageMark < 8) return 'Khá';
    //return 'Giỏi';
    //};

    const generatePDF = () => {
        const studentInfo = getStudentInfo();
        const studentInfos = getStudentInfos(); 
        const student = getStudent();
        const averageMark = calculateAverageMark();
        //const graduationClassification = getGraduationClassification(averageMark);

        const dataToExport = MarkSinhvien.map((diem, index) => [
            index + 1,
            getSubjectNameById(diem.maMonHoc),
            diem.diemChuyenCan,
            diem.diemKiemTraGiuaKi,
            diem.diemThi,
            Number.isInteger(diem.diemTongKet) ? diem.diemTongKet : diem.diemTongKet.toFixed(1)
        ]);

        const formatBirthDate = (date) => {
            if (!date) return 'Chưa xác định'; // Nếu không có ngày sinh thì trả về thông báo mặc định
            const dateObj = new Date(date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
            const year = dateObj.getFullYear();
            return `${day}-${month}-${year}`;
        };
    
        // Tính điểm trung bình của tất cả các môn học
        const totalAverageMark = (dataToExport.reduce((sum, row) => sum + parseFloat(row[5]), 0) / dataToExport.length).toFixed(1);

        const docDefinition = {
            content: [
                {
                    columns: [
                        {
                            text: 'BỘ LAO ĐỘNG THƯƠNG BINH VÀ XÃ HỘI\nTRƯỜNG CAO ĐẲNG AN NINH MẠNG iSPACE',
                            alignment: 'center',
                            fontSize: 9.5,
                            margin: [0, 0, 20, 10], // left, top, right, bottom

                        },
                        {
                            text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc',
                            alignment: 'center',
                            fontSize: 9.5,
                            margin: [20, 0, 0, 10] // left, top, right, bottom
                        }
                    ]
                },
                {
                    text: 'BẢNG TỔNG HỢP KẾT QUẢ HỌC TẬP',
                    style: 'title',
                    alignment: 'center',
                    margin: [0, 10, 0, 20] // left, top, right, bottom
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: [
                                { text: 'Họ và tên', bold: true, margin: [0, 0, 0, 2] }, // Điều chỉnh margin để căn lề trái
                                { text: ` : ${getStudentNameByIds(MarkSinhvien[0].maSinhVien)}\n`, margin: [10, 0, 0, 2] }, // Điều chỉnh margin để căn lề trái
                                { text: 'Ngày sinh', bold: true, margin: [0, 0, 0, 2] }, // Điều chỉnh margin để căn lề trái
                                { text: ` : ${formatBirthDate(getStudentBirthDate(MarkSinhvien[0].maSinhVien))}\n`, margin: [10, 0, 0, 2] }, // Điều chỉnh margin để căn lề trái
                                { text: 'Chuyên ngành', bold: true, margin: [0, 0, 0, 2] }, // Điều chỉnh margin để căn lề trái
                                { text: ` : Phát triển phần mềm\n`, margin: [10, 0, 0, 2] }, // Điều chỉnh margin để căn lề trái
                                { text: 'Lớp học', bold: true, margin: [0, 0, 0, 2] }, // Điều chỉnh margin để căn lề trái
                                { text: ` : ${getStudentNameById(selectedClassId)}\n`, margin: [10, 0, 0, 2] } // Điều chỉnh margin để căn lề trái
                            ],
                            alignment: 'left',
                            fontSize: 10.6,
                            margin: [50, 0, 0, 10] // left, top, right, bottom
                        },
                        {
                            width: '50%',
                            text: [
                                { text: 'Giới tính', bold: true, margin: [0, 0, 0, 4] },
                                { text: ` : ${getStudentgiotinh(MarkSinhvien[0].maSinhVien)}\n`, margin: [0, 0, 0, 4] },
                                { text: 'Địa chỉ', bold: true, margin: [0, 0, 0, 4] },
                                { text: ` : ${getStudentBirthplace(MarkSinhvien[0].maSinhVien)}\n`, margin: [0, 0, 0, 4] },
                                { text: 'Trình độ', bold: true, margin: [0, 0, 0, 4] },
                                { text: ` : ${getStudentnienkhoa(MarkSinhvien[0].maSinhVien)}\n`, margin: [0, 0, 0, 4] },
                                { text: 'Niên khóa', bold: true, margin: [0, 0, 0, 4] },
                                { text: ` : ${getStudenttrinhdo(MarkSinhvien[0].maSinhVien)}\n`, margin: [0, 0, 0, 4] }
                            ],
                            alignment: 'left',
                            fontSize: 10.6,
                            margin: [100, 0, 0, 10] // left, top, right, bottom
                        },
                      
                    ]
                },
                {
                    columns: [
                        {
                            width: '50%',
                            text: [
                                  studentInfo,
                            ],
                            alignment: 'left',
                            fontSize: 10.6,
                            margin: [10, 0, 0, 10] // left, top, right, bottom
                        },
                        {
                            width: '50%',
                            text: [
                                studentInfos
                            ],
                            alignment: 'right',
                            fontSize: 10.6,
                            margin: [10, 0, 0, 10] // left, top, right, bottom
                        },
                    ]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            // Dòng tiêu đề của bảng
                            [
                                { text: 'STT', style: 'tableHeader' },
                                { text: 'Môn học', style: 'tableHeader' },
                                { text: 'Điểm chuyên cần', style: 'tableHeader' },
                                { text: 'Điểm giữa kì', style: 'tableHeader' },
                                { text: 'Điểm thi', style: 'tableHeader' },
                                { text: 'Điểm trung bình', style: 'tableHeader' }
                            ],
                            // Dữ liệu của bảng
                            ...dataToExport.map(row => [
                                { text: row[0], style: 'tableCell', alignment: 'center' }, // STT
                                { text: row[1], style: 'tableCell' }, // Môn học
                                { text: row[2], style: 'tableCell', alignment: 'center' }, // Điểm chuyên cần
                                { text: row[3], style: 'tableCell', alignment: 'center' }, // Điểm giữa kì
                                { text: row[4], style: 'tableCell', alignment: 'center' }, // Điểm thi
                                { text: row[5], style: 'tableCell', alignment: 'center' }  // Điểm trung bình
                            ])
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 1 : 0.5; // Độ dày của đường ngang
                        },
                        vLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 1 : 0.5; // Độ dày của đường dọc
                        },
                        hLineColor: function (i, node) {
                            return '#000'; // Màu đường ngang là đen
                        },
                        vLineColor: function (i, node) {
                            return '#000'; // Màu đường dọc là đen
                        }
                    }
                },
                {
                    columns: [
                        {
                            text: 'THI TỐT NGHIỆP',
                            alignment: 'center',
                            fontSize: 9.5,
                            margin: [0, 6, 20, 0], // left, top, right, bottom

                        },
                        {
                            text: 'XẾP LOẠI TỐT NGHIỆP',
                            alignment: 'center',
                            fontSize: 9.5,
                            margin: [0, 6, 20, 0] // left, top, right, bottom
                        }
                    ]
                },
                {
                    text: `- Điểm trung bình chung toàn khóa     ${totalAverageMark}`,
                    alignment: 'right',
                    fontSize: 9.5,
                    margin: [0, 10, 45, 0] // left, top, right, bottom
                },
                {
                    text: '- Điểm đánh giá xếp loại tốt nghiệp',
                    alignment: 'right',
                    fontSize: 9.5,
                    margin: [0, 0, 70, 0] // left, top, right, bottom
                },
                {
                    text: `- Xếp loại tốt nghiệp`,
                    alignment: 'right',
                    fontSize: 9.5,
                    margin: [10, 0, 132, 0] // left, top, right, bottom
                }

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    marginBottom: 10
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9.5,
                    color: 'black'
                },
                tableCell: {
                    fontSize: 8.5,
                },
                title: {
                    fontSize: 19.6,
                    bold: true,
                    color: 'red', // Màu đỏ cho tiêu đề
                    marginBottom: 10
                }
            },
            defaultStyle: {
                font: 'Roboto' // Roboto là font mặc định của pdfMake, hỗ trợ Unicode tốt
            }
        };

        pdfMake.createPdf(docDefinition).download(`${student}.pdf`);
    };


    const handleEditButtonClick = (dep) => {
        setIsEditing(true);
        setCurrentMarkId(dep.id);
        setValue({ diemChuyenCan: dep.diemChuyenCan, diemKiemTraGiuaKi: dep.diemKiemTraGiuaKi, diemThi: dep.diemThi });
    };

    const student = getStudent();

        // Hàm lọc và hiển thị danh sách môn học của lớp và chuyên ngành được chọn
        const renderSubjectsOptions = () => {
            // Tìm lớp học được chọn
            const selectedClass = Class.find(cls => cls.id === selectedClassId);
    
            if (!selectedClass) return null;
    
            // Lọc các môn học thuộc chuyên ngành của lớp đã chọn
            const filteredSubjects = Subjects.filter(subject =>
                subject.maChuyenNganh === selectedClass.maChuyenNganh
            );
    
            // Hiển thị danh sách các option cho select
            return filteredSubjects.map(monHoc => (
                <option key={monHoc.id} value={monHoc.id}>
                    {monHoc.tenMonHoc}
                </option>
            ));
        };


    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    <div className='row'>
                        <div className='col-lg-6'>
                            Điểm
                        </div>
                        <div className="search-container col-lg-6">
                            <input type="text" value={searchTerm} onChange={handleSearchChange} id="myInput" placeholder="Tìm kiếm..." className="search-input" />
                            <select className="search-combobox" onChange={handleClassChange}>
                                <option value="">Chọn lớp</option>
                                {Class && Class.map((classs) => (
                                    <option key={classs.id} value={classs.id}>{classs.maLop}</option>
                                ))}
                            </select>
                            <button onClick={handleShowModals} className="btn add-newssss" type="button" data-toggle="tooltip" data-placement="top" title="Thêm Điểm"><i className="fas fa-plus mr-2 mt-1"></i>Nhập điểm</button>
                        </div>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <form >
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="text-center">STT</th>
                                    <th className="text-center">MSSV</th>
                                    <th className="text-center">Họ và tên</th>
                                    <th className="text-center">Ngày sinh</th>
                                    <th className="text-center">Số điện thoại</th>
                                    <th className="text-center">Lớp học</th>
                                    {/* <th className="text-center"></th> */}
                                    <th className="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents && filteredStudents.length > 0 ? (
                                    filteredStudents.map((dep, idx) => (
                                        <tr key={idx}>
                                            <td className="text-center">{startIndex + idx}</td>
                                            <td className="text-left">{dep.maSinhVien}</td>
                                            <td className="text-left">{dep.hoTen}</td>
                                            <td className="text-left">
                                                {new Date(dep.ngaySinh).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            {/* <td className="text-center">{dep.email}</td> */}
                                            <td className="text-left">{dep.soDienThoai}</td>
                                            <td className="text-left">
                                                {getStudentNameById(dep.maLop)}
                                            </td>
                                            <td className="text-center">
                                                <button className='btn btn-info' onClick={() => handleShowModal(dep.id)}>Xem điểm</button>
                                            </td>
                                            {/* <td className="text-center">
                                        <button onClick={handleShowModalssss}>Sửa điểm</button>
                                    </td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">Không có dữ liệu sinh viên.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </form>

                    <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className='row'>
                                        <div className='col-lg-6'>
                                            <h5 className="modal-title">Tên sinh viên: {student}</h5>
                                        </div>
                                        <div className='col-lg-6'>
                                            <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className='col-lg-12'>
                                            <h5 className="modal-title">Lớp: {getStudentNameById(selectedClassId)}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th className="text-center">Môn Học</th>
                                                <th className="text-center">Điểm Chuyên Cần</th>
                                                <th className="text-center">Điểm Giữa Kỳ</th>
                                                <th className="text-center">Điểm Thi</th>
                                                <th className="text-center">Điểm TB</th>
                                                <th className="text-center">Chức năng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MarkSinhvien && MarkSinhvien.length > 0 ? (
                                                  MarkSinhvien.map((dep, idx) => (
                                                    <tr key={idx}>
                                                        <td>{getSubjectNameById(dep.maMonHoc)}</td>
                                                        <td className="text-center">{isEditing && currentMarkId === dep.id ? (
                                                            <input className="form-control" type="text" value={value.diemChuyenCan} onChange={(e) => setValue({ ...value, diemChuyenCan: e.target.value })} />
                                                        ) : (
                                                            (dep.diemChuyenCan % 1 === 0 ? dep.diemChuyenCan.toFixed(1) : dep.diemChuyenCan)
                                                        )}</td>
                                                        <td className="text-center">{isEditing && currentMarkId === dep.id ? (
                                                            <input className="form-control" type="text" value={value.diemKiemTraGiuaKi} onChange={(e) => setValue({ ...value, diemKiemTraGiuaKi: e.target.value })} />
                                                        ) : (
                                                            (dep.diemKiemTraGiuaKi % 1 === 0 ? dep.diemKiemTraGiuaKi.toFixed(1) : dep.diemKiemTraGiuaKi)
                                                        )}</td>
                                                        <td className="text-center">{isEditing && currentMarkId === dep.id ? (
                                                            <input className="form-control" type="text" value={value.diemThi} onChange={(e) => setValue({ ...value, diemThi: e.target.value })} />
                                                        ) : (
                                                            (dep.diemThi % 1 === 0 ? dep.diemThi.toFixed(1) : dep.diemThi)
                                                        )}</td>
                                                        <td className="text-center">{Number.isInteger(dep.diemTongKet) ? dep.diemTongKet : dep.diemTongKet.toFixed(1)}</td>
                                                        <td className="text-center">
                                                            {isEditing && currentMarkId === dep.id ? (
                                                                <button onClick={handleSubmitssss} className="btn btn-success mr-3 cursor-pointer icon-button">Lưu</button>
                                                            ) : (
                                                                <button className="btn btn-warning mr-3 cursor-pointer icon-button" onClick={() => handleEditButtonClick(dep)}>Sửa</button>
                                                            )}
                                                            <button className="btn btn-danger cursor-pointer icon-button" onClick={() => handleDeleteButtonClick(dep.maSinhVien, dep.maMonHoc)}>Xóa</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                              <tr>
                                                <td colSpan="9" className="text-center">Không có dữ liệu sinh viên.</td>
                                              </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button onClick={generatePDF} className="btn add-new mr-2" type="button" data-toggle="tooltip" data-placement="top" title="In file">Xuất file</button>
                                    <CButton color="secondary" onClick={handleCloseModal}>Đóng</CButton>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={`modal-backdrop fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}></div>




                    <div className={`modal ${showModals ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModals ? 'block' : 'none' }}>
                        <div className='modalthem'>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <div className='row'>
                                            <h5 className="modal-title">Nhập điểm sinh viên lớp: {getStudentNameById(selectedClassId)}</h5>
                                            <div className='col-lg-12'>
                                                <div className="mt-2">
                                                    <label htmlFor="monHocId">Môn học:</label>
                                                    <select
                                                        id="monHocId"
                                                        className="form-select"
                                                        value={studentMarks.length > 0 ? studentMarks[0].monHocId : ''}
                                                        onChange={(e) => handleInputChanges(e, 'monHocId', 0)}
                                                    >
                                                        <option value="">Chọn môn học</option>
                                                        {renderSubjectsOptions()}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="button" className="close" onClick={handleCloseModals} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className='diem'>
                                            <div className='w-table-container'>
                                                <table className="table table-bordered w-table">
                                                    <thead className="thead-dark ">
                                                        <tr>
                                                            <th className="small-cells">STT</th>
                                                            <th className="small-cellss">Họ và tên</th>
                                                            <th className="small-cellsss">Điểm cc</th>
                                                            <th className="small-cellsss">Điểm gk</th>
                                                            <th className="small-cellsss">Điểm thi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {studentMarks.map((mark, index) => (
                                                            <tr key={mark.sinhVienId || index}>
                                                                <td className="small-cells">{index + 1}</td>
                                                                <td className="small-cellss">{mark.hoTen}</td>
                                                                <td className="small-cellsss">
                                                                    <input
                                                                        type="number"
                                                                        name="diemChuyenCan"
                                                                        value={mark.diemChuyenCan}
                                                                        onChange={(e) => handleChange(index, e)}
                                                                        placeholder="Điểm Chuyên Cần"
                                                                        className="small-input"
                                                                    />
                                                                </td>
                                                                <td className="small-cellsss">
                                                                    <input
                                                                        type="number"
                                                                        name="diemKiemTraGiuaKi"
                                                                        value={mark.diemKiemTraGiuaKi}
                                                                        onChange={(e) => handleChange(index, e)}
                                                                        placeholder="Điểm Kiểm Tra Giữa Kỳ"
                                                                        className="small-input"
                                                                    />
                                                                </td>
                                                                <td className="small-cellsss">
                                                                    <input
                                                                        type="number"
                                                                        name="diemThi"
                                                                        value={mark.diemThi}
                                                                        onChange={(e) => handleChange(index, e)}
                                                                        placeholder="Điểm Thi"
                                                                        className="small-input"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
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
                                        <CButton color="secondary" onClick={handleCloseModals}>Đóng</CButton>
                                        <CButton color="success" onClick={handleSubmit}>Lưu</CButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`modal-backdrop fade ${showModals ? 'show' : ''}`} style={{ display: showModals ? 'block' : 'none' }}></div>


                    <div className={`modal ${showModalss ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModalss ? 'block' : 'none' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Thông Tin Điểm Sinh Viên</h5>
                                    <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th className="text-center">STT</th>
                                                <th className="text-center">Mã số</th>
                                                <th className="text-center">Họ và tên</th>
                                                <th className="text-center">Ngày sinh</th>
                                                {MarkSinhvien.map((subjectName, index) => (
                                                    <React.Fragment key={index}>
                                                        <th className="text-center">{getSubjectNameById(subjectName.maMonHoc)}</th>
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.maSinhVien}</td>
                                                    <td>{student.hoTen}</td>
                                                    <td>{student.ngaySinh}</td>
                                                    {/*\\ {MarkSinhvien.map((subjectName, idx) => (
                                                <React.Fragment key={idx}>
                                                    <td>
                                                        {calculateAverage(student, idx)} 
                                                    </td>
                                                </React.Fragment>
                                            ))} */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
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
                                    <button className="btn add-new mr-2" type="button" data-toggle="tooltip" data-placement="top" title="In file">Xuất file</button>
                                    <CButton color="secondary" onClick={handleCloseModalss}>Đóng</CButton>
                                    <CButton color="success" >In file</CButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`modal-backdrop fade ${showModalss ? 'show' : ''}`} style={{ display: showModalss ? 'block' : 'none' }}></div>


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

export default Mark;
