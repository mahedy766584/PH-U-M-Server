import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { semesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();


router.post(
    '/create-semester-registration',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin
    ),
    validateRequest(
        semesterRegistrationValidations
            .createSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationController.createSemesterRegistrationIntoDB
);

router.get(
    '/',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.faculty,
        USER_ROLE.student
    ),
    SemesterRegistrationController.getAllSemesterRegistrationFromDB
);
router.get(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.faculty,
        USER_ROLE.student
    ),
    SemesterRegistrationController.getSingleSemesterRegistrationFromDB
)
router.patch(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin
    ),
    validateRequest(
        semesterRegistrationValidations
            .updateSemesterRegistrationValidationSchema
    ),
    SemesterRegistrationController.updateSemesterRegistrationIntoDB
);

router.delete(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin
    ),
    SemesterRegistrationController.deleteSemesterRegistration,
);

export const SemesterRegistrationRoutes = router; 