
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
    GET_ALL_MARK_SINHVIEN,
    GET_ALL_MARK_SUBJECT,
    GET_MARK_DTB,
    ADD_MARK,
    UPDATE_MARK,
    DELETE_MARK,
    ADD_CLASS,
    ADD_DEPARTMENT,
    ADD_MAJOR,
    ADD_SUBJECT,
    ADD_STUDENT,
    ADD_ALL_STUDENT,
    UPDATE_CLASS,
    UPDATE_DEPARTMENT,
    UPDATE_MAJOR,
    UPDATE_SUBJECT,
    UPDATE_STUDENT,
    DELETE_DEPARTMENT,
    DELETE_MAJOR,
    DELETE_SUBJECT,
    DELETE_STUDENT,
    SET_ERRORS,
    DELETE_CLASS,
    CHANGEPASSWORD,
    BYSINHVIENLOGIN,
    RESETPASSWORD,
    GETALLDIEMBYSINHVIEN
} from "../actionTypes";

import * as api from "../Api";

export const loginadmin = (formData, navigate) => async (dispatch) => {
    try {
        const {data} = await api.login(formData);
        console.log(data);
        await dispatch({type: LOGIN, data});
        console.log("data");
        navigate("/thongke");
    } catch (error) {
        const errorMessage = error.response && error.response.data.message
      ? error.response.data.message
      : 'Đăng nhập thất bại';
        dispatch({ type: SET_ERRORS, payload: errorMessage });
        throw new Error(errorMessage);
    }
}

export const loginuser = (formData, navigate) => async (dispatch) => {
    try {
        const {data} = await api.login(formData);
        console.log(data);
        await dispatch({type: LOGIN, data});
        console.log("data");
        navigate("/sinhvien/Sinhvien");
    } catch (error) {
        const errorMessage = error.response && error.response.data.message
      ? error.response.data.message
      : 'Đăng nhập thất bại';
        throw new Error(errorMessage);
    }
}


export const register = (formData) => async (dispatch) => {
    try {
        const {data} = await api.register(formData);
        console.log(data);
        await dispatch({type: REGISTER, data});
    } catch (error) {
       console.log(data);
    }
}

export const changepassword = (formData) => async (dispatch) => {
    try {
        const {data} = await api.changepassword(formData);
        dispatch({type: CHANGEPASSWORD, data})
    } catch (error) {
        console.log("Lỗi" , error);
    }
}

export const resetpasswords = (formData) => async (dispatch) => {
    try {
        const {data} = await api.resetpassword(formData);
        dispatch({type: RESETPASSWORD,  data});
    } catch (error) {
        console.log("Lỗi" , error);
    }
}

export const bysinhvienlogins = () => async (dispatch) => {
    try {
        const {data} = await api.bysinhvienlogin();
        console.log(data);
        dispatch({type: BYSINHVIENLOGIN, payload: data});
    } catch (error) {
        console.log("Lỗi" , error);
    }
}

export const GetAllDiemBySinhVienLogins = () => async (dispatch) => {
    try{
        const {data} = await api.GetAllDiemBySinhVienLogin();
        console.log("Data from GetAllDiemBySinhVienLogin:", data); 
        dispatch({type: GETALLDIEMBYSINHVIEN, payload: data});
    }catch (error){
        console.log("hhhhhhhhhh", error);
    }  
}
  

export const getAllClass = () => async (dispatch) => {
    try{
        const {data} = await api.getAllClass();
        console.log("Data from class:", data); 
        dispatch({type: GET_ALL_CLASS, payload: data});
    }catch (error){
        console.log("hhhhhhhhhh", error);
    }  
}

export const getAllDepartment = () => async (dispatch) => {
    try {

      const { data } = await api.getAllDepartment();
      console.log("Data from getAllDepartment:", data); 
      dispatch({ type: GET_ALL_DEPARTMENT, payload: data });
    } catch (error) {
      console.log("Error in getAllDepartment action:", error);
      dispatch({ type: SET_ERRORS, payload: error.message });
    }
  };

export const getDepartment = () => async (dispatch) => {
    try {
        const {data} = await api.getDepartmentByName();
        dispatch({type: GET_DEPARTMENT, payload: data});
    } catch (error) {
        console.log("", error)
    }
}

export const getMajor = () => async (dispatch) => {
    try {
        const {data} = await api.getMajor();
        console.log("Data from getMajor:", data); 
        dispatch({type: GET_MAJOR, payload: data});
    } catch (error) {
        console.log("", error);
    }
}

export const getAllMajor = () => async (dispatch) => {
    try {
        const {data} = await api.getAllMajor();
        console.log("Data from getMajor:", data); 
        dispatch({type: GET_ALL_MAJOR, payload: data});
    } catch (error) {
        console.log("", error);
    }
}

export const getAllStudent = () => async (dispatch) => {
    try {
        const {data} = await api.getAllStudent();
        console.log("Data from getAllStudent:", data); 
        dispatch({type: GET_ALL_STUDENT, payload: data});
    } catch (error) {
        console.log("", error);
    }
}

export const getAllSubject = () => async (dispatch) => {
    try {
        const {data} = await api.getAllSubject();
        console.log("Data from getAllSubject:", data); 
        dispatch({type: GET_ALL_SUBJECT, payload: data});
    } catch (error) {
        console.log("" , error);
    }
}


export const getAllMarkStudent = (sinhVienId) => async (dispatch) => {
    try {
        if (sinhVienId) {
            const { data } = await api.getAllMarkStudent(sinhVienId);
            console.log("kkkkkkkkkkkkk", data)
            dispatch({ type: GET_ALL_MARK_SINHVIEN, payload: data });
        } else {
            console.log('Không có sinhVienId được cung cấp.');
            // Hoặc xử lý tương ứng khi không có ID
        }
    } catch (error) {
        console.log("" , error);

    }
}

export const getAllMarkSubject = (monHocId) => async (dispatch) => {
    try {
        const {data} = await api.getAllMarkSubject(monHocId);
        console.log("Data from getAllMarkSubject:", data); 
        dispatch({type: GET_ALL_MARK_SUBJECT, payload: data});
    } catch (error) {
        console.log("" , error);

    }
}


export const getTinhDiemTB = () => async (dispatch) => {
    try {
        const {data} = await api.getMajorDTB();
        dispatch({type: GET_MARK_DTB, payload: data});
    } catch (error) {
        console.log("" , error);

    }
}

export const addClass = (formData) => async (dispatch) => {
    try {
        const {data} = await api.addClass(formData);
        dispatch({type: ADD_CLASS, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data});
    }
}
export const addDepartment = (formData) => async (dispatch) => {
    try {
        const {data} = await api.addDepartment(formData);
        dispatch({type: ADD_DEPARTMENT, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.pesponse.data});
    }
}

export const addMajor = (formData) => async (dispatch) => {
    try {
        const {data} = await api.addMajor(formData);
        dispatch({type: ADD_MAJOR, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.pesponse.data});
    }
}

export const addStudent = (formData) => async (dispatch) => {
    try {
        const {data} = await api.addStudent(formData);
        dispatch({type: ADD_STUDENT, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.pesponse.data})
    }
}

export const AddAllStudents = (formData) => async (dispatch) => {
    try {
        console.log("ddadadadadad", formData);

        const response = await api.addAllStudent(formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('AddAllStudents response:', response.data); // Log the entire response for debugging
        dispatch({ type: ADD_ALL_STUDENT, payload: response.data });
    } catch (error) {
        // Check if error.response exists before accessing its data
        const errorMessage = error.response ? error.response.data : 'Unknown error occurred';
        dispatch({ type: SET_ERRORS, payload: errorMessage });
    }
};

export const addSubject = (formData) => async (dispatch) => {
    try {
        const {data} = await api.addSubject(formData);
        dispatch({type: ADD_SUBJECT, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.pesponse.data});
    }
}


export const addMark = (formData) => async (dispatch) => {
    const { monHocId, studentScores } = formData;

    try {
        // Call API to add mark with formData
        const response = await api.addMark({
            monHocId,
            studentScores
        });

        console.log('Response from server:', response.data);
        
        // Check if the response indicates success
        if (response.data.status === 'Success') {
            dispatch({ type: ADD_MARK, payload: true }); // Dispatch success action
        } else {
            // Handle other types of responses (e.g., specific error messages)
            console.error('Error adding mark:', response.data.message);
            // Dispatch failure action with error message
            dispatch({ type: ADD_MARK, payload: { error: response.data.message } });
        }
    } catch (error) {
        console.error('Error adding mark:', error.response.data); // Log error response from API
        dispatch({ type: ADD_MARK, payload: error.response.data }); // Dispatch failure action
    }
};

export const updateClass = (id, formData) => async (dispatch) => {
    try {
        const {data} = await api.updateClass(id , formData);
        console.log("Data from updateclass:", data); 
        dispatch({type: UPDATE_CLASS, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data})
    }
}

export const updateDepartment = (id, formData) => async (dispatch) => {
    try {
        console.log("Updating department with ID:", id);
        console.log("Form data:", formData);

        const { data } = await api.updateDepartment(id, formData);
        dispatch({ type: UPDATE_DEPARTMENT, payload: true });
    } catch (error) {
        console.error("Error updating department:", error.response?.data || error.message);
        dispatch({ type: SET_ERRORS, payload: error.response?.data || error.message });
    }
}

export const updateMajor = (id, formData) => async (dispatch) => {
    try {
        const {data} =  await api.updateMajor(id, formData);
        dispatch({type: UPDATE_MAJOR, payload: true})
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data})
    }
} 

export const updateStudent = (formData) => async (dispatch) => {
    try {
        const {data} =  await api.updateStudent(formData);
        console.log("update student", data);
        dispatch({type: UPDATE_STUDENT, payload: true})
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data})
    }
} 

export const updateSubject = (id, formData) => async (dispatch) => {
    try {
        const {data} =  await api.updateSubject(id, formData);
        dispatch({type: UPDATE_SUBJECT, payload: true})
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data})
    }
} 


export const updateMarks = (id, formData) => async (dispatch) => {
    try {
        const {data} =  await api.updateMarks(id, formData);
        dispatch({type: UPDATE_MARK, payload: true})
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data})
    }
} 

export const deleteClass = (id) => async (dispatch) => {
    try {
      const response = await api.deleteClass(id);
      console.log(response.data);
      console.log('Deleted class successfully:', response.data);
      dispatch({ type: DELETE_CLASS, payload: true });
    } catch (error) {
        console.error('Error deleting class:', error);
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const deleteDepartment = (formData) => async (dispatch) => {
    try {
        const {data} = await api.deleteDepartment(formData);
        dispatch({type: DELETE_DEPARTMENT, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data})
    }
}

export const deleteMajor = (formData) => async (dispatch) => {
    try {
        const {data} = await api.deleteMajor(formData);
        dispatch({type: DELETE_MAJOR, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data});
    }
}

export const deleteStudent = (formData) => async (dispatch) => {
    try {
        const {data} = await api.deleteStudent(formData);
        dispatch({type: DELETE_STUDENT, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data});
    }
}

export const deleteSubject = (formData) => async (dispatch) => {
    try {
        const {data} = await api.deleteSubject(formData);
        dispatch({type: DELETE_SUBJECT, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data});
    }
}

export const deleteMark = (sinhVienId, monHocId) => async (dispatch) => {
    try {
        const {data} = await api.deleteMark(sinhVienId, monHocId);
        dispatch({type: DELETE_MARK, payload: true});
    } catch (error) {
        dispatch({type: SET_ERRORS, payload: error.response.data});
    }
}





