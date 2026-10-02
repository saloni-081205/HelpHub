const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[0-9+\-\s()]{7,15}$/,
        'Please provide a valid phone number',
      ],
    },

    role: {
      type: String,
      enum: {
        values: ['requester', 'volunteer', 'admin'],
        message: 'Role must be requester, volunteer, or admin',
      },
      default: 'requester',
    },

    profileImage: {
      type: String,
      default: '',
    },

    bio: {
      type: String,
      default: '',
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },
    location: {
      city: { type: String, default: '', trim: true },
      area: { type: String, default: '', trim: true },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Hash password before saving
|--------------------------------------------------------------------------
*/
userSchema.pre('save', async function () {
  // If password has not been changed, don't hash it again
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

/*
|--------------------------------------------------------------------------
| Compare password
|--------------------------------------------------------------------------
*/
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/*
|--------------------------------------------------------------------------
| Virtual full name
|--------------------------------------------------------------------------
*/
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});


// Resolve profileImage into a full URL when serialized
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject({ virtuals: true });
  if (obj.profileImage && obj.profileImage.startsWith('/uploads/')) {
    const base = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    obj.profileImage = `${base}${obj.profileImage}`;
  }
  return obj;
};

/*Include virtual fields in JSON*/
userSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('User', userSchema);