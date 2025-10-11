import status from "http-status";
import AppError from "../../errors/appError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./OfferedCourse.interface";
import { OfferedCourse } from "./OfferedCourse.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import { hasTimeConflict } from "./OfferedCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { Student } from "../student/student.models";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {

    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        faculty,
        section,
        days,
        startTime,
        endTime,
    } = payload;

    //check if the semester registration id is exists;
    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError(status.NOT_FOUND, 'Semester Registration not found')
    };

    const academicSemester = isSemesterRegistrationExists.academicSemester;

    //check if the academic faculty id is exists;
    const isAcademicFacultyExists = await AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError(status.NOT_FOUND, 'Academic Faculty not found')
    };
    //check if the academic department id is exists;
    const isAcademicDepartmentExists = await AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError(status.NOT_FOUND, 'Academic Department not found')
    };
    //check if the course id is exists;
    const isCourseExits = await Course.findById(course);
    if (!isCourseExits) {
        throw new AppError(status.NOT_FOUND, 'Course not found !');
    }
    //check if the faculty id is exists;
    const isFacultyExits = await Faculty.findById(faculty);
    if (!isFacultyExits) {
        throw new AppError(status.NOT_FOUND, 'Faculty not found !');
    }

    //check if the department is belong to the faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });

    if (!isDepartmentBelongToFaculty) {
        throw new AppError(status.BAD_REQUEST, `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}!`);
    };

    //check if the same course same section is same registered semester exists
    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
        await OfferedCourse.findOne({
            semesterRegistration,
            course,
            section,
        });

    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(status.BAD_REQUEST, `Offered course with same section is already exist!!`);
    };

    // get the schedules of the faculties
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(status.CONFLICT, `This faculty is not available at that time ! Choose other time or day!!`);
    };

    const result = await OfferedCourse.create({
        ...payload,
        academicSemester
    });
    return result;
};

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the faculty exists
     * Step 3: check if the semester registration status is upcoming
     * Step 4: check if the faculty is available at that time. If not then throw error
     * Step 5: update the offered course
     */
    const { faculty, days, startTime, endTime } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(status.NOT_FOUND, 'Offered course not found !');
    }

    const isFacultyExists = await Faculty.findById(faculty);

    if (!isFacultyExists) {
        throw new AppError(status.NOT_FOUND, 'Faculty not found !');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    // get the schedules of the faculties


    // Checking the status of the semester registration
    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration);

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            status.BAD_REQUEST,
            `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
        );
    }

    // check if the faculty is available at that time.
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            status.CONFLICT,
            `This faculty is not available at that time ! Choose other time or day`,
        );
    }

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the semester registration status is upcoming
     * Step 3: delete the offered course
     */
    const isOfferedCourseExists = await OfferedCourse.findById(id);

    if (!isOfferedCourseExists) {
        throw new AppError(status.NOT_FOUND, 'Offered Course not found');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;

    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration).select('status');

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(
            status.BAD_REQUEST,
            `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
        );
    }

    const result = await OfferedCourse.findByIdAndDelete(id);

    return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await offeredCourseQuery.countTotal();
    const result = await offeredCourseQuery.modelQuery;
    return {
        meta,
        result,
    };
};

const getMyOfferedCoursesFromDB = async (userId: string, query: Record<string, unknown>) => {

    // pagination setup;
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const student = await Student.findOne({ id: userId });
    if (!student) {
        throw new AppError(status.NOT_FOUND, 'User is not found')
    };

    //find current ongoing semester
    const currentOngoingRegistrationSemester = await SemesterRegistration.findOne({
        status: 'ONGOING'
    });

    if (!currentOngoingRegistrationSemester) {
        throw new AppError(status.NOT_FOUND, 'There is no ongoing semester registration!')
    };

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester?._id,
                academicFaculty: student?.academicFaculty,
                academicDepartment: student?.academicDepartment,
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course'
            }
        },
        {
            $unwind: '$course'
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingRegistrationSemester:
                        currentOngoingRegistrationSemester._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$currentOngoingRegistrationSemester',
                                        ],
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingRegistrationSemester: currentOngoingRegistrationSemester._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent']
                                    },
                                    {
                                        $eq: ['$isCompleted', true]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: 'completedCourses',
            }
        },
        {
            $addFields: {
                completedCoursesIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course'
                    }
                }
            }
        },
        {
            $addFields: {

                isPreRequisitesFulFilled: {
                    $or: [
                        { $eq: ['$course.preRequisiteCourses', []] },
                        { $setIsSubset: ['$course.preRequisiteCourses.course', '$completedCoursesIds'] }
                    ]
                },

                isAlreadyEnrolled: {
                    $in: ['$course._id', {
                        $map: {
                            input: '$enrolledCourses',
                            as: 'enroll',
                            in: '$$enroll.course',
                        }
                    }]
                }
            }
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulFilled: true,
            }
        },
    ];

    const paginationQuery = [
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ];

    const result = await OfferedCourse.aggregate([
        ...aggregationQuery, ...paginationQuery
    ]);

    const total = (await OfferedCourse.aggregate(aggregationQuery)).length;
    const totalPage = Math.ceil(result.length / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };
};



const getSingleOfferedCourseFromDB = async (id: string) => {
    const offeredCourse = await OfferedCourse.findById(id);

    if (!offeredCourse) {
        throw new AppError(404, 'Offered Course not found');
    }

    return offeredCourse;
};


export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
    getMyOfferedCoursesFromDB
};