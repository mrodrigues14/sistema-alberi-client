import {z} from 'zod';

// export const cadastroSchema = z.object({
//
// });

export const loginSchema = z.object({
    cpf: z.string()
        .min(11, { message: "O CPF deve ter 11 caracteres" })
        .max(11, { message: "O CPF deve ter 11 caracteres" }),
    password: z.string()
        .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export type LoginInput = z.infer<typeof loginSchema>;