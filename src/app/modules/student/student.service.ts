/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import { Student } from './student.models'
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import status from 'http-status';
import { TStudent } from './student.interface';
import { studentSearchableFields } from './student.constant';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllStudents = async (query: Record<string, unknown>) => {

  // const queryObj = { ...query };

  // // {email: {$regex: query.searchTerm, $options: i}}
  // // {presentAddress: {$regex: query.searchTerm, $options: i}}
  // // {'name.firstName': {$regex: query.searchTerm, $options: i}}

  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress']

  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // };

  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' }
  //   }))
  // });

  // //filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // // console.log({query}, {queryObj});

  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester').populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty'
  //     }
  //   });

  // let sort = '-createdAt'
  // if (query.sort) {
  //   sort = query.sort as string;
  // };

  // const sortQuery = filterQuery.sort(sort);

  // let page = 1;
  // let limit = 1;
  // let skip = 0;

  // if (query.limit) {
  //   limit = Number(query.limit) as number;
  // };

  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) *limit;
  // };

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit)

  // //field limiting
  // let fields = '-__v';

  // if(query.fields){
  //   fields = (query.fields as string).split(',').join(' ');
  //   // console.log(fields)
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;

  //uses for Class method;
  const studentQuery = new QueryBuilder(Student.find()
    .populate('admissionSemester')
    .populate('user')
    .populate('academicDepartment academicFaculty'),
    // .populate({
    //   path: 'academicDepartment',
    //   populate: {
    //     path: 'academicFaculty'
    //   }
    // }), 
    query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentQuery.modelQuery;
  const meta = await  studentQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getSingleStudent = async (id: string) => {
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty'
      }
    });

  // const isUserExists = await Student.aggregate([
  //   { $match: { id: id } }
  // ]);

  if (!result) {
    throw new AppError(status.BAD_REQUEST, 'User not found')
  };

  return result;
};


const updateSingleStudent = async (id: string, payload: Partial<TStudent>) => {

  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData
  };

  /**
   * guardian: {
   * fatherOccupation: "Teacher"
   * }
   * guardian.fatherOccupation = Teacher;
   */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }


  const result = await Student.findByIdAndUpdate(
    id,
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!result) {
    throw new AppError(status.BAD_REQUEST, 'User not found')
  };

  return result;
};



const deleteStudentFromDB = async (id: string) => {

  const isUserExists = await Student.findOne({ id });

  if (!isUserExists) {
    throw new AppError(status.BAD_REQUEST, 'User dose not exist')
  };

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedStudent) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete student')
    };

    const userId = deletedStudent.user;

    const deleteUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    )

    if (!deleteUser) {
      throw new AppError(status.BAD_REQUEST, 'Failed to delete user')
    };

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student')
  };

};



export const studentServices = {
  getAllStudents,
  getSingleStudent,
  deleteStudentFromDB,
  updateSingleStudent,
}
