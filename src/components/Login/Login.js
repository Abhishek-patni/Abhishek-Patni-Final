import React, { useContext } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useFormik } from 'formik';

const Login = () => {
    const history = useHistory();
    const { login } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.get(`http://localhost:4000/users`, {
                    params: {
                        email: values.email,
                        password: values.password
                    }
                });

                if (response.data.length > 0) {
                    const user = response.data[0];
                    login(user);

                    // Reset 
                    resetForm();


                    history.push(user.role === 'admin' ? '/' : '/profiles');
                } else {
                    alert('Invalid email or password');
                    resetForm(); 
                }
            } catch (error) {
                console.error('Error logging in:', error);
                resetForm();
            }
        }
    });

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit} style={{ display: '-ms-grid', flexDirection: 'column', gap: '10px' }}>
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

                <button type="submit">Login</button>
            </form>

            <div style={{ marginTop: '10px' }}>
                <button onClick={() => history.push('/signup')}>Sign Up</button>
            </div>
        </div>
    );
};

export default Login;
