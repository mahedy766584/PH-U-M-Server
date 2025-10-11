import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";
import mongoose from "mongoose";

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic semester is created successfully',
        data: result,
    });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Semester are retrieved successfully',
        meta: result.meta,
        data: result.result,
    })
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(semesterId)) {
        return sendResponse(res, {
            statusCode: status.BAD_REQUEST,
            success: false,
            message: 'Invalid MongoDB ObjectId',
            data: '',
        });
    }

    const result = await AcademicSemesterServices.getSingleAcademicSemester(semesterId);

    if (!result) {
        return sendResponse(res, {
            statusCode: status.NOT_FOUND,
            success: false,
            message: 'Academic Semester not found',
            data: ''
        });
    }
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Semester are retrieved successfully',
        data: result,
    })
});

const updateSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const updatedData = req.body;

    const result = await AcademicSemesterServices.updateSingleAcademicSemester(semesterId, updatedData);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic semester updated successfully',
        data: result,
    })
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateSingleAcademicSemester,
};