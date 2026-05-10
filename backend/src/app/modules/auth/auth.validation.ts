import  { email, z } from "zod";
import BaseDto from "../../common/validation/baseDto.js";

export class userRegisterDto extends BaseDto{
    static baseSchema = z.object({
        firstName: z.string().trim().max(200),
        lastName: z.string().trim().max(200),
        email: z.email().trim().max(322),
        password: z.string().min(8).max(66)
    })
}

export class userLoginDto extends BaseDto{
    static baseSchema = z.object({
        email: z.email().trim().max(322),
        password: z.string().min(8).max(66)
    })
}

export class forgotPassDto extends BaseDto{
    static baseSchema = z.object({
        email: z.email().trim().max(322),
    })
}

export class resetPassDto extends BaseDto{
    static baseSchema = z.object({
        email: z.email().trim().max(322),
        token: z.string().trim().length(6),
        newPassword: z.string().min(8).max(66)
    })
}

export class resetTokenDto extends BaseDto{
    static baseSchema = z.object({
        
    })
}