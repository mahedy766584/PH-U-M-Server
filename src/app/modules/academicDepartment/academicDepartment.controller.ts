import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Department is created successfully',
        data: result,
    });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Department is retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result = await AcademicDepartmentServices.getSingleAcademicDepartment(departmentId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Single Academic Department is retrieved successfully',
        data: result,
    });
});

const updateSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result = await AcademicDepartmentServices.updateSingleAcademicDepartment(departmentId, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Department is updated successfully',
        data: result,
    });
});

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateSingleAcademicDepartment,
};