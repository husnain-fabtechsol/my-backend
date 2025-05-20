import { asyncHandler } from '../utils/asyncHandler.js';
import usermodel from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {uploadOnCloudinary} from '../utils/Cloudnary.js';
// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
console.log(username, email, password)
    // Validate required fields
    if ([username, email, password].some((field) => !field?.trim())) {
       throw new ApiError(400, "Invalid credentials", ["Email and password are required"]);
    }
    

    // Check if user already exists
    const existedUser = await usermodel.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, 'User with email or username already exists');
    }

    // Create new user

   const avatarLoctalPath = req.files?.avatar?.[0]?.path || null;
   const coverimageLoctalPath = req.files?.coverimage?.[0]?.path || null;
   if(!avatarLoctalPath){
       throw new ApiError(400, 'Avatar is required');
   } 


    const avatarUrl = await uploadOnCloudinary(avatarLoctalPath)

    const coverImage = await uploadOnCloudinary(coverimageLoctalPath)
    if(!avatarUrl){
        throw new ApiError(400, 'avatar is required');
    }
    const user = await usermodel.create({
        username,
        email,
        password,
        avatar: avatarUrl?.url||"",
        coverimage: coverImage?.url||"",
    });
    // Fetch created user without sensitive fields
    const createdUser = await usermodel
        .findById(user._id)
        .select('-password');

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, 'User created successfully')
        );
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    // Validate input
    if (!(email || username)) {
        throw new ApiError(400, 'Username or email is required');
    }
    if (!password) {
        throw new ApiError(400, 'Password is required');
    }

    // Find user
    const user = await usermodel.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) {
        throw new ApiError(404, 'User does not exist');
    }

    // Validate password using model's matchPassword method
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Generate tokens using model's methods
    const accessToken = user.generateAssignToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Fetch user without sensitive fields
    const loggedInUser = await usermodel
        .findById(user._id)
        .select('-password');

    // Set cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                'User logged in successfully',
                { user: loggedInUser, accessToken, refreshToken },
            )
        );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    // Assuming user is attached to req from auth middleware
    await usermodel.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, 'Current user fetched successfully')
        );
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email, avatar, coverimage } = req.body;

    if (!fullName && !email && !avatar && !coverimage) {
        throw new ApiError(400, 'At least one field is required to update');
    }

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email.toLowerCase();
    if (avatar) updateFields.avatar = avatar;
    if (coverimage) updateFields.coverimage = coverimage;

    const user = await usermodel
        .findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true }
        )
        .select('-password');

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, 'Profile updated successfully')
        );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
};