import { model, Schema } from 'mongoose';
import { StudentModel, TGuardian, TLocalGuardian, TStudent, TUserName } from './student.interface';
// import validator from 'validator';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
    maxlength: 25,
    minlength: 4,
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    //     return firstNameStr === value;
    //   },
    //   message: '{VALUE} is not in capitalize formate'
    // },
  },
  middleName: {
    type: String,
    required: [true, 'Middle name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    // validate: {
    //   validator: function (value: string) {
    //     return validator.isAlpha(value, 'en-US', {ignore: ' '});
    //   },
    //   message: '{VALUE} is not a valid name. The name must contain only English alphabetic characters (A–Z, a–z), without any numbers or special characters.'
    // },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father\'s name is required.'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father\'s occupation is required.'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father\'s contact number is required.'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother\'s name is required.'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother\'s occupation is required.'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother\'s contact number is required.'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local guardian\'s name is required.'],
  },
  occupation: {
    type: String,
    required: [true, 'Local guardian\'s occupation is required.'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian\'s contact number is required.'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian\'s address is required.'],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: {
    type: String,
    required: [true, 'Student ID is required.'],
    unique: [true, 'Student ID must be unique.'],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User id is required'],
    unique: true,
    ref: 'User'
  },
  name: {
    type: userNameSchema,
    required: [true, 'Student name is required.'],
  },
  gender: {
    type: String,
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Gender must be either Male, Female, or Other.',
    },
    required: [true, 'Gender is required.'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required.'],
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required.'],
    unique: [true, 'Contact number must be unique.'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required.'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: 'Invalid blood group.',
    },
  },
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: [true, 'Email address must be unique.'],
    // validate: {
    //   validator: (value: string) =>{
    //     return validator.isEmail(value);
    //   },
    //   message: '{VALUE} is not a valid email type',
    // }
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required.'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required.'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian information is required.'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local guardian information is required.'],
  },
  profileImage: {
    type: String,
    default: ""
  },
  admissionSemester: {
    type: Schema.ObjectId,
    ref: 'AcademicSemester',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
  },
}, {
  toJSON: {
    virtuals: true,
  }
});

//virtual;
studentSchema.virtual('fullName').get(function () {
  return (
    `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
  );
});



//Query middleware;
studentSchema.pre('find', function (next) {
  // console.log(this)

  this.find({ isDeleted: { $ne: true } })

  next();
})
//Query middleware;
studentSchema.pre('findOne', function (next) {
  // console.log(this)

  this.find({ isDeleted: { $ne: true } })

  next();
})
//Query middleware;
studentSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline())

  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })

  // this.find({isDeleted: {$ne: true}})

  next();
}) 

//creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};


// studentSchema.methods.isUserExits = async function(id: string){
//   const exitingUser = await Student.findOne({id})

//   return exitingUser;
// }

//creating customs instance method
// studentSchema.methods.isUserExists = async function () {
//   const existingUser = await Student.findOne({ id: this.id });
//   return existingUser;
// };



// export const Student = model<TStudent, StudentsModel>('Student', studentSchema)
export const Student = model<TStudent, StudentModel>('Student', studentSchema)
