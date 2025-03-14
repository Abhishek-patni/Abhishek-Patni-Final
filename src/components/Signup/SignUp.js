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
                .matches(/@/, 'Email must contain @')
                .required('Email is required')
                .email('Invalid email format'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                // Generate numeric ID using timestamp
                const numericId = Date.now().toString();
                
                await axios.post('http://localhost:4000/users', {
                    id: numericId,
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: 'employee'
                });

                // Reset 
                resetForm();

                history.push('/login');
            } catch (error) {
                console.error('Error signing up:', error);
            }
        }
    });

    return (
        <div>
            <h2>Sign Up</h2>
            <div style={{ display: '-ms-grid', flexDirection: 'column', gap: '10px' }}>
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

                <button type="button" onClick={formik.handleSubmit}>Sign Up</button>
            </div>
        </div>
    );
};

export default SignUp;
