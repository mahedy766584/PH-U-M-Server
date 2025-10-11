import { Router } from "express";
import { StudentRoutes } from "../modules/student/student.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.routes";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.routes";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.routes";
import { FacultyRoutes } from "../modules/Faculty/faculty.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { SemesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import { OfferedCourseRoutes } from "../modules/OfferedCourse/OfferedCourse.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { EnrolledCourseRoutes } from "../modules/EnrolledCourse/enrolledCourse.routes";

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/students',
        route: StudentRoutes,
    },
    {
        path: '/faculties',
        route: FacultyRoutes,
    },
    {
        path: '/admins',
        route: AdminRoutes,
    },
    {
        path: '/academic-semesters',
        route: AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculties',
        route: AcademicFacultyRoutes,
    },
    {
        path: '/academic-departments',
        route: AcademicDepartmentRoutes,
    },
    {
        path: '/courses',
        route: CourseRoutes,
    },
    {
        path: '/semester-registration',
        route: SemesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: OfferedCourseRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/enrolled-course',
        route: EnrolledCourseRoutes,
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;