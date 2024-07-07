'use client'

import { SyntheticEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema } from "@/schemas/auth.schema";

type Field = 'cpf' | 'password';

function LoginForm() {
    const [cpf, setCpf] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ cpf?: string; password?: string }>({});

    const router = useRouter();

    const validateField = (field: Field, value: string) => {
        const result = loginSchema.safeParse({ cpf, password, [field]: value });
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: result.success ? undefined : result.error?.flatten().fieldErrors[field]?.[0]
        }));
    };

    async function handleSubmit(event: SyntheticEvent) {
        event.preventDefault();

        const validation = loginSchema.safeParse({ cpf, password });
        if (validation.success) {
            const result = await signIn('credentials', {
                cpf,
                password,
                redirect: false
            });

            if (result?.error) {
                console.log(result);
                return;
            }

            router.push('/home');
        } else {
            setErrors({
                cpf: validation.error.flatten().fieldErrors.cpf?.[0],
                password: validation.error.flatten().fieldErrors.password?.[0]
            });
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(event) => {
                        setCpf(event.target.value);
                        validateField('cpf', event.target.value);
                    }}
                />
                {errors.cpf && <p>{errors.cpf}</p>}

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        validateField('password', event.target.value);
                    }}
                />
                {errors.password && <p>{errors.password}</p>}

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default LoginForm;
