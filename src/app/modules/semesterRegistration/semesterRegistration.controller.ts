import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationService } from "./semesterRegistration.service";

const createSemesterRegistrationIntoDB = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationService.createSemesterRegistrationIntoDB(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Semester Registration is created successfully',
        data: result,
    });
});

const getSingleSemesterRegistrationFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.getSingleSemesterRegistrationFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Single Semester Registration is retrieved successfully',
        data: result,
    });
});

const getAllSemesterRegistrationFromDB = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationService.getAllSemesterRegistrationFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All Semester Registration is retrieved successfully',
        data: result,
    });
});
const updateSemesterRegistrationIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Updated Single Semester Registration is Updated successfully',
        data: result,
    });
});

const deleteSemesterRegistration = catchAsync( async (req, res) => {
        const { id } = req.params;
        const result =
            await SemesterRegistrationService.deleteSemesterRegistrationFromDB(id);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: 'Semester Registration is updated successfully',
            data: result,
        });
    },
);

export const SemesterRegistrationController = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistration
};