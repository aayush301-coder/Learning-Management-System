const { z } = require("zod");
const { userRoles } = require("../../constants/user.constants");


const registerSchema = z.object({

    name: z.string()
        .min(3, "Name must contain at least 3 characters"),

    email: z.string()
        .email("Invalid email"),

    password: z.string()
        .min(8, "Password must contain minimum 8 characters"),

    confirmPassword: z.string()
        .min(8, "Password must contain minimum 8 characters"),

    role: z.enum(userRoles)
        .optional()
        .default("student"),

})
.superRefine((data, ctx)=>{

    if(data.password !== data.confirmPassword){

        ctx.addIssue({

            code:z.ZodIssueCode.custom,

            message:"Passwords do not match",

            path:["confirmPassword"]

        });

    }

});



const loginSchema = z.object({

    email:z.string()
        .email(),

    password:z.string()
        .min(1)

});



module.exports = {
    registerSchema,
    loginSchema
};