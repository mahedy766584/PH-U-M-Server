import { model, Schema } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemester.const";
import AppError from "../../errors/appError";
import status from "http-status";

const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        required: true,
        enum: AcademicSemesterName,
    },
    year: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        enum: AcademicSemesterCode,
    },
    startMonth: {
        type: String,
        enum: Months,
        required: true
    },
    endMonth: {
        type: String,
        enum: Months,
        required: true
    },
}, {
    timestamps: true,
});

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        year: this.year,
        name: this.name,
    })
    if (isSemesterExists) {
        throw new AppError(status.NOT_FOUND, 'Semester is already exists')
    };
    next();
});

export const AcademicSemester = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema)