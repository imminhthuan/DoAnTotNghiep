import {
    LOGIN,
    REGISTER,
    GET_ALL_CLASS,
    GET_ALL_DEPARTMENT,
    GET_DEPARTMENT,
    GET_ALL_MAJOR,
    GET_MAJOR,
    GET_ALL_SUBJECT,
    GET_ALL_STUDENT,
    ADD_MARK,
    ADD_CLASS,
    ADD_DEPARTMENT,
    ADD_MAJOR,
    ADD_SUBJECT,
    ADD_STUDENT,
    ADD_ALL_STUDENT,
    UPDATE_MARK,
    UPDATE_CLASS,
    UPDATE_DEPARTMENT,
    UPDATE_MAJOR,
    UPDATE_SUBJECT,
    UPDATE_STUDENT,
    DELETE_MARK,
    DELETE_CLASS,
    DELETE_DEPARTMENT,
    DELETE_MAJOR,
    DELETE_SUBJECT,
    DELETE_STUDENT,
    GET_ALL_MARK_SINHVIEN,
    GET_ALL_MARK_SUBJECT,
    GET_MARK_DTB,
    CHANGEPASSWORD,
    RESETPASSWORD,
    BYSINHVIENLOGIN,
    GETALLDIEMBYSINHVIEN,
    SET_ERRORS
} from "../actionTypes";

const initialState = {
    authData: null,
    getAllDiemBySinhVienLoginss: [],
    changePasswords: {},
    resetPasswords: false,
    bySinhVienLogins: [],
    registerData: {},
    updateClasss: false,
    updateDepartments: false,
    updateMajors: false,
    updateStudents: false,
    updateSubjects: false, 
    updateMarks: false,
    markAdd: false,
    classAdd: false,
    departmentAdd: false,
    majorAdd: false,
    studentAdd: false,
    subjectAdd: false,
    allMark: [],
    allClasss: [],
    allSubject: [],
    allStudent: [],
    allDepartment: [],
    AddAllStudent: false,
    department: [],
    allMajor: [],
    allMarkStudent: [],
    allMarkSubject: [],
    markDTB: [],
    major: [], 
    markDelete: false,
    classDelete: false,
    departmentDeleted: false,
    majorDeleted: false,
    studentDeleted: false,
    subjectDeleted: false,
};


const adminReduces = (state = initialState, action) => {
    switch(action.type){
        case LOGIN:
            console.log(action);
            localStorage.setItem("user", JSON.stringify({ ...action?.data }));
            return { ...state, authData: action?.data };
        case REGISTER: 
            return {
                ...state,
                registerData: action.payload,
            }
        case CHANGEPASSWORD: 
            return {
                ...state,
                changePasswords: action.payload,
            }
        case GETALLDIEMBYSINHVIEN: 
            return {
                ...state,
                getAllDiemBySinhVienLoginss: action.payload.$values,
            }
              
        case RESETPASSWORD: 
            return {
                ...state,
                resetPasswords: action.payload,
            }
        case BYSINHVIENLOGIN: 
            return {
                ...state,
                bySinhVienLogins: action.payload,
            }
        case GET_ALL_CLASS:
            return {
                ...state,
                allClasss: action.payload.$values,
            };
        case GET_ALL_DEPARTMENT:
            return {
                ...state,
                allDepartment: action.payload.$values,
            };
        case GET_DEPARTMENT:
            return {
                ...state,
                department: action.payload.$values,
            }
        case GET_ALL_MAJOR:
            return {
                ...state,
                allMajor: action.payload.$values,
            };
        case GET_MAJOR:
            return {
                ...state,
                major: action.payload.$values,
            };
        case GET_ALL_STUDENT:
            return {
                ...state,
                allStudent: action.payload.$values,
            };
        case GET_ALL_SUBJECT:
            return {
                ...state,
                allSubject: action.payload.$values,
            };
        case GET_ALL_MARK_SINHVIEN:
            return {
                ...state,
                allMarkStudent: action.payload.$values,
            };

        case GET_ALL_MARK_SUBJECT:
                return {
                    ...state,
                    allMarkSubject: action.payload.$values,
                };
        case GET_MARK_DTB:
                return {
                    ...state,
                    markDTB: action.payload.$values,
                };
                
        case ADD_CLASS:
            return {
                ...state,
                classAdd: action.payload.$values,
            };
        case ADD_DEPARTMENT:
            return {
                ...state,
                departmentAdd: action.payload.$values,
            };
        case ADD_MAJOR:
            return {
                ...state,
                majorAdd: action.payload.$values,
            }
        case ADD_STUDENT:
            return {
                ...state,
                studentAdd: action.payload.$values,
            };
        case ADD_ALL_STUDENT: 
            return {
                ...state,
                AddAllStudent: action.payload.$values,
            }
        case ADD_SUBJECT:
            return {
                ...state,
                subjectAdd: action.payload.$values,
            };
            case ADD_MARK:
                return {
                    ...state,
                    markAdd: action.payload.$values,
                };
        case UPDATE_CLASS:
            return {
                ...state,
                updateClasss: action.payload.$values,
            };
        case UPDATE_DEPARTMENT:
            return {
                ...state,
                updateDepartments: action.payload.$values,
            };
        case UPDATE_MAJOR:
            return {
                ...state,
                updateMajors: action.payload.$values,
            };
        case UPDATE_STUDENT:
            return {
                ...state,
                updateStudents: action.payload.$values,
            };
        case UPDATE_SUBJECT:
            return {
                ...state,
                updateSubjects: action.payload.$values,
            };
            case UPDATE_MARK:
                return {
                    ...state,
                    updateMarks: action.payload.$values,
                };
            case DELETE_CLASS:
                return {
                    classDelete: action.payload.$values,
                }
        case DELETE_DEPARTMENT:
            return {
                departmentDeleted: action.payload.$values,
            };
        case DELETE_MAJOR:
            return {
                majorDeleted: action.payload.$values,
            };
        case DELETE_STUDENT:
            return {
                studentDeleted: action.payload.$values,
            }
        case DELETE_SUBJECT:
            return {
                subjectDeleted: action.payload.$values,
            };
            case DELETE_MARK:
                return {
                    markDelete: action.payload.$values,
                };
            default:
                return state;
    }
}

export default adminReduces;