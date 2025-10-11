import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { FacultyServices } from "./faculty.service";
import catchAsync from "../../utils/catchAsync";

const getAllFacultiesFromDB = catchAsync(async (req, res) => {
    // console.log('test', req.user)
    // console.log(req.cookies)
    const result = await FacultyServices.getAllFacultiesFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculties is retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});
const getSingleFacultyFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.getSingleFacultyFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Single Faculty is retrieved successfully',
        data: result,
    });
});
const getSingleFacultyUpdatedFromDB = catchAsync(async (req, res) => {
    const { faculty } = req.body;
    const { id } = req.params;
    const result = await FacultyServices.updateFacultyIntoDB(
        id,
        faculty
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Single Faculty is Updated successfully',
        data: result,
    });
});

const deleteFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.deleteFacultyFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculty is deleted successfully',
        data: result,
    });
});

export const FacultyController = {
    getAllFacultiesFromDB,
    getSingleFacultyFromDB,
    getSingleFacultyUpdatedFromDB,
    deleteFaculty
};