import { z } from 'zod';

// Name schema
const userNameValidationSchema = z.object({
    firstName: z
        .string({ required_error: 'First name is required.' })
        .trim()
        .min(4, 'First name must be at least 4 characters.')
        .max(25, 'First name must be at most 25 characters.')
        .refine((value) => /^[A-Z]/.test(value), {
            message: 'First Name must start with a capital letter',
        }),
    middleName: z.string({ required_error: 'Middle name is required.' }),
    lastName: z.string({ required_error: 'Last name is required.' }),
});

// Guardian schema
const guardianValidationSchema = z.object({
    fatherName: z.string({ required_error: "Father's name is required." }),
    fatherOccupation: z.string({ required_error: "Father's occupation is required." }),
    fatherContactNo: z.string({ required_error: "Father's contact number is required." }),
    motherName: z.string({ required_error: "Mother's name is required." }),
    motherOccupation: z.string({ required_error: "Mother's occupation is required." }),
    motherContactNo: z.string({ required_error: "Mother's contact number is required." }),
});

// Local Guardian schema
const localGuardianValidationSchema = z.object({
    name: z.string({ required_error: "Local guardian's name is required." }),
    occupation: z.string({ required_error: "Local guardian's occupation is required." }),
    contactNo: z.string({ required_error: "Local guardian's contact number is required." }),
    address: z.string({ required_error: "Local guardian's address is required." }),
});

// Main Student schema
export const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string({ required_error: 'Student ID is required.' }),
        student: z.object({
            name: userNameValidationSchema,
            gender: z.enum(['Male', 'Female'], {
                required_error: 'Gender is required.',
                invalid_type_error: 'Gender must be either Male or Female.',
            }),
            dateOfBirth: z.string({ required_error: 'Date of birth is required.' }).optional(),
            contactNo: z.string({ required_error: 'Contact number is required.' }),
            emergencyContactNo: z.string({ required_error: 'Emergency contact number is required.' }),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            email: z
                .string({ required_error: 'Email address is required.' })
                .email('Invalid email address.'),
            presentAddress: z.string({ required_error: 'Present address is required.' }),
            permanentAddress: z.string({ required_error: 'Permanent address is required.' }),
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            profileImage: z.string({ required_error: 'Profile image URL is required.' }).optional(),
            admissionSemester: z.string(),
            academicDepartment: z.string(),
        })
    })
});

// Optional Name schema
const updateUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(4, 'First name must be at least 4 characters.')
        .max(25, 'First name must be at most 25 characters.')
        .refine((value) => /^[A-Z]/.test(value), {
            message: 'First Name must start with a capital letter',
        })
        .optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
}).optional();

// Optional Guardian schema
const updateGuardianValidationSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherContactNo: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherContactNo: z.string().optional(),
}).optional();

// Optional Local Guardian schema
const updateLocalGuardianValidationSchema = z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
}).optional();

// Main Update Student schema
export const updateStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(15).optional(),
        student: z.object({
            name: updateUserNameValidationSchema,
            gender: z.enum(['Male', 'Female']).optional(),
            dateOfBirth: z.string().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            email: z.string().email('Invalid email address.').optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            guardian: updateGuardianValidationSchema,
            localGuardian: updateLocalGuardianValidationSchema,
            // profileImage: z.string().optional(),
            admissionSemester: z.string().optional(),
            academicDepartment: z.string().optional(),
        }).optional(),
    }),
});


export const studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
};