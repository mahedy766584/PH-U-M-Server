import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.zodValidation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    studentController.getAllStudents
);
router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    studentController.getSingleStudent
);
router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        studentValidations.updateStudentValidationSchema
    ),
    studentController.updateStudent
);
router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    studentController.deleteStudent
);

export const StudentRoutes = router;
