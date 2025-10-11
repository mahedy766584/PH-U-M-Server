import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidations } from "./faculty.validation";
import { FacultyController } from "./faculty.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty
    ),
    FacultyController.getAllFacultiesFromDB
);

router.get(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty
    ),
    FacultyController.getSingleFacultyFromDB,
);
router.patch(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
    ),
    validateRequest(
        facultyValidations.updateFacultyValidationSchema
    ),
    FacultyController.getSingleFacultyUpdatedFromDB
);

router.delete(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
    ),
    FacultyController.deleteFaculty
);

export const FacultyRoutes = router;