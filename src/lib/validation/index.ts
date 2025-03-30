import { z } from "zod"
export const SignupValidation = z.object({
    name: z.string().min(2,{ message: 'Too short'}),
    username: z.string().min(2, { message: 'Too short'}),
    email: z.string().min(2),
    password: z.string().min(8, { message: 'Password must contains atleast 8 letters'})
  })


  export const SigninValidation = z.object({
    // name: z.string().min(2,{ message: 'Too short'}),
    // username: z.string().min(2, { message: 'Too short'}),
    email: z.string().min(2),
    password: z.string().min(8, { message: 'Password must contains atleast 8 letters'})
  })