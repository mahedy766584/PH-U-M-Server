import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudents(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.getSingleStudent(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
  });
});
const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await studentServices.deleteStudentFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Students are deleted successfully',
    data: result,
  });
});
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateSingleStudent(id, student);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Students is updated successfully',
    data: result,
  });
});

export const studentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
