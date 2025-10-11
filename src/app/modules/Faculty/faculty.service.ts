/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { TFaculty } from "./faculty.interface";
import { Faculty } from "./faculty.model";
import AppError from "../../errors/appError";
import status from "http-status";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { FacultySearchableFields } from "./faculty.constant";

// const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {

//     const queryObj = { ...query };

//     const facultySearchableField = ['email', 'name.firstName', 'presentAddress'];

//     let searchTerm = '';
//     if (query.searchTerm) {
//         searchTerm = query?.searchTerm as string;
//     };

//     const searchQuery = Faculty.find({
//         $or: facultySearchableField.map((field) => ({
//             [field]: { $regex: searchTerm, $options: 'i' }
//         }))
//     });

//     //filtering
//     const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
//     excludeFields.forEach((el) => delete queryObj[el]);

//     const filterQuery = searchQuery.find(queryObj)
//         .populate('academicDepartment')

//     let sort = '-createdAt';
//     if (query.sort) {
//         sort = query.sort as string;
//     };

//     const sortQuery = filterQuery.sort(sort)

//     let page = 1;
//     let limit = 1;
//     let skip = 0;

//     if (query.limit) {
//         limit = Number(query.limit) as number;
//     };

//     if (query.page) {
//         page = Number(query.page);
//         skip = (page - 1) * limit;
//     };

//     const paginateQuery = sortQuery.skip(skip);

//     const limitQuery = paginateQuery.limit(limit)

//     //field limiting
//     let fields = '-__v';

//     if (query.fields) {
//         fields = (query.fields as string).split(',').join(' ');
//         // console.log(fields)
//     }

//     const fieldQuery = await limitQuery.select(fields);

//     return fieldQuery;

// };

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
    const facultyQuery = new QueryBuilder(
        Faculty.find().populate('academicDepartment academicFaculty'),
        query,
    )
        .search(FacultySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await facultyQuery.modelQuery;
    const meta = await facultyQuery.countTotal();
    return {
        result,
        meta,
    };
};

const getSingleFacultyFromDB = async (id: string) => {
    const result = await Faculty.findById(id).populate('academicDepartment');
    return result;
};

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
    const { name, ...remainingFacultyData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingFacultyData,
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    const result = await Faculty.findOneAndUpdate(
        {
            $or: [
                { _id: isValidObjectId ? id : undefined },
                { id: id }
            ]
        },
        modifiedUpdatedData,
        {
            new: true,
            runValidators: true,
        }
    );
    return result;
};

const deleteFacultyFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedFaculty = await Faculty.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedFaculty) {
            throw new AppError(status.BAD_REQUEST, 'Failed to delete faculty');
        }

        // get user _id from deletedFaculty
        const userId = deletedFaculty.user;

        const deletedUser = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedUser) {
            throw new AppError(status.BAD_REQUEST, 'Failed to delete user');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

export const FacultyServices = {
    getAllFacultiesFromDB,
    getSingleFacultyFromDB,
    updateFacultyIntoDB,
    deleteFacultyFromDB,
};