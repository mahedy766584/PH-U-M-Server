import status from "http-status";
import AppError from "../errors/appError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization;
        //if the token is sent from the client
        if (!token) {
            throw new AppError(status.UNAUTHORIZED, 'Your not authorize!!');
        };

        // invalid token - synchronous
        // check if the token is valid
        const decoded = jwt.verify(token,
            config.jwt_access_secret as string,) as JwtPayload;

        const { role, userId, iat } = decoded;



        // checking if the user is exist
        const user = await User.isUserExistsByCustomId(userId);

        if (!user) {
            throw new AppError(status.NOT_FOUND, 'This user is not found !');
        }
        // checking if the user is already deleted

        const isDeleted = user?.isDeleted;

        if (isDeleted) {
            throw new AppError(status.FORBIDDEN, 'This user is deleted !');
        }

        // checking if the user is blocked

        const userStatus = user?.status;

        if (userStatus === 'blocked') {
            throw new AppError(status.FORBIDDEN, 'This user is blocked ! !');
        }


        if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(
            user.passwordChangedAt,
            iat as number,
        )) {
            throw new AppError(status.UNAUTHORIZED, 'Your not authorize!!');
        };


        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(status.UNAUTHORIZED, 'Your not authorize!!');
        };

        req.user = decoded as JwtPayload;
        next();



        // invalid token
        //first practice
        // jwt.verify(
        //     token,
        //     config.jwt_access_secret as string,
        //     function (err, decoded) {
        //         if (err) {
        //             throw new AppError(status.UNAUTHORIZED, 'Your not authorize!!');
        //         };

        //         const role = (decoded as JwtPayload).role;

        //         if (requiredRoles && !requiredRoles.includes(role)) {
        //             throw new AppError(status.UNAUTHORIZED, 'Your not authorize!!');
        //         };

        //         req.user = decoded as JwtPayload;
        //         next();
        //     },
        // );

        
    })
};

export default auth;