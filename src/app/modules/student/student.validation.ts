import Joi from "joi";

//creating a schema validation using Joi
export const studentValidationSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'Student ID is required.',
    }),

    name: Joi.object({
        firstName: Joi.string().min(4).max(25).trim().required().messages({
            'any.required': 'First name is required.',
        }),
        middleName: Joi.string().required().messages({
            'any.required': 'Middle name is required.',
        }),
        lastName: Joi.string().required().messages({
            'any.required': 'Last name is required.',
        }),
    }).required().messages({
        'any.required': 'Student name is required.',
    }),

    gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
        'any.required': 'Gender is required.',
        'any.only': 'Gender must be either Male, Female, or Other.',
    }),

    dateOfBirth: Joi.string().required().messages({
        'any.required': 'Date of birth is required.',
    }),

    contactNo: Joi.string().required().messages({
        'any.required': 'Contact number is required.',
    }),

    emergencyContactNo: Joi.string().required().messages({
        'any.required': 'Emergency contact number is required.',
    }),

    bloodGroup: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .optional(),

    email: Joi.string().email().required().messages({
        'any.required': 'Email address is required.',
        'string.email': 'Invalid email format.',
    }),

    presentAddress: Joi.string().required().messages({
        'any.required': 'Present address is required.',
    }),

    permanentAddress: Joi.string().required().messages({
        'any.required': 'Permanent address is required.',
    }),

    guardian: Joi.object({
        fatherName: Joi.string().required().messages({
            'any.required': "Father's name is required.",
        }),
        fatherOccupation: Joi.string().required().messages({
            'any.required': "Father's occupation is required.",
        }),
        fatherContactNo: Joi.string().required().messages({
            'any.required': "Father's contact number is required.",
        }),
        motherName: Joi.string().required().messages({
            'any.required': "Mother's name is required.",
        }),
        motherOccupation: Joi.string().required().messages({
            'any.required': "Mother's occupation is required.",
        }),
        motherContactNo: Joi.string().required().messages({
            'any.required': "Mother's contact number is required.",
        }),
    }).required().messages({
        'any.required': 'Guardian information is required.',
    }),

    localGuardian: Joi.object({
        name: Joi.string().required().messages({
            'any.required': "Local guardian's name is required.",
        }),
        occupation: Joi.string().required().messages({
            'any.required': "Local guardian's occupation is required.",
        }),
        contactNo: Joi.string().required().messages({
            'any.required': "Local guardian's contact number is required.",
        }),
        address: Joi.string().required().messages({
            'any.required': "Local guardian's address is required.",
        }),
    }).required().messages({
        'any.required': 'Local guardian information is required.',
    }),

    profileImage: Joi.string().uri().required().messages({
        'any.required': 'Profile image URL is required.',
        'string.uri': 'Profile image must be a valid URL.',
    }),

    isActive: Joi.string().valid('active', 'blocked').required().messages({
        'any.required': 'Status is required.',
        'any.only': 'Status must be either "active" or "blocked".',
    }),
});


