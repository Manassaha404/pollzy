import {z} from 'zod';

export const UserLoginSchema = z.object({
    email: z.string().email({
        message:"Please enter a valid email"
    }),
    password: z.string().min(8, {
        message: "Password must contain 8 characters"
    })
});

export const UserRegisterSchema = z.object({
    email: z.string().email({
        message:"Please enter a valid email"
    }),
    password: z.string().min(8, {
        message: "Password must contain 8 characters"
    }),
    firstName: z.string().min(1, {
        message: "First name is required"
    }),
    lastName: z.string().min(1, {
        message: "Last name is required"
    })
});

export type UserLoginType = z.infer<typeof UserLoginSchema>;
export type UserRegisterType = z.infer<typeof UserRegisterSchema>;