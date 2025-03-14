import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values) => {
            try {
                await axios.post('http://localhost:4000/users', {
                    ...values,
                    role: 'employee'
                });
                history.push('/login');
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                </label>
                {formik.errors.name && <span style={{ color: 'red' }}>{formik.errors.name}</span>}

                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                </label>
                {formik.errors.email && <span style={{ color: 'red' }}>{formik.errors.email}</span>}

                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                </label>
                {formik.errors.password && <span style={{ color: 'red' }}>{formik.errors.password}</span>}

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
