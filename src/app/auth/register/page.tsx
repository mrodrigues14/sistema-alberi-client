'use client';

import React, { useState, FormEvent } from 'react';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        password: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log(process.env.REACT_APP_BACKEND_URL);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, formData);
            console.log('Registro bem-sucedido:', response.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Erro ao registrar:', error.response.data);
            } else {
                console.error('Erro desconhecido durante o registro');
            }
        }
    };

    return (
        <div>
            <h1>Registrar</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    required
                />
                <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="CPF"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Senha"
                    required
                />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
}
