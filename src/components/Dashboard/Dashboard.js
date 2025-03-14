import React, { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';

import axios from 'axios';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                const employeeUsers = response.data.filter(user => user.role === 'employee');
                setUsers(employeeUsers);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            scrumName: '',
            taskTitle: '',
            taskDescription: '',
            taskStatus: 'To Do',
            taskAssignedTo: ''
        },
        validationSchema: Yup.object({
            scrumName: Yup.string().required('Name is required'),
            taskTitle: Yup.string().required('Title is required'),
            taskDescription: Yup.string().required('Description is required'),
            taskAssignedTo: Yup.string().required('User is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const scrumId = Date.now().toString();
                
                const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                    id: scrumId,
                    name: values.scrumName
                });
                
                const newScrum = newScrumResponse.data;
                
                const taskId = (Date.now() + 1).toString();
                
                await axios.post('http://localhost:4000/tasks', {
                    id: taskId,
                    title: values.taskTitle,
                    description: values.taskDescription,
                    status: values.taskStatus,
                    scrumId: Number(scrumId),  
                    assignedTo: Number(values.taskAssignedTo),  
                    history: [
                        {
                            status: values.taskStatus,
                            date: new Date().toISOString().split('T')[0],
                        },
                    ],
                });
                
                setScrums([...scrums, newScrum]);
                setShowForm(false);
                resetForm();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    return (
        <div>
            <style>
                {`.error { color: red;}`}
            </style>
            <h2>Scrum Teams</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>
                    {showForm && (
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                                <label>Scrum Name:</label>
                                <input
                                    type="text"
                                    name="scrumName"
                                    value={formik.values.scrumName}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.scrumName && <div className="error">{formik.errors.scrumName}</div>}
                            </div>
                            <div>
                                <label>Task Title:</label>
                                <input
                                    type="text"
                                    name="taskTitle"
                                    value={formik.values.taskTitle}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.taskTitle && <div className="error">{formik.errors.taskTitle}</div>}
                            </div>
                            <div>
                                <label>Task Description:</label>
                                <input
                                    type="text"
                                    name="taskDescription"
                                    value={formik.values.taskDescription}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.taskDescription && <div className="error">{formik.errors.taskDescription}</div>}
                            </div>
                            <div>
                                <label>Task Status:</label>
                                <select
                                    name="taskStatus"
                                    value={formik.values.taskStatus}
                                    onChange={formik.handleChange}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label>Assign To:</label>
                                <select
                                    name="taskAssignedTo"
                                    value={formik.values.taskAssignedTo}
                                    onChange={formik.handleChange}
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {formik.errors.taskAssignedTo && <div className="error">{formik.errors.taskAssignedTo}</div>}
                            </div>
                            <button type="submit">Create Scrum</button>
                        </form>
                    )}
                </div>
            )}
            <ul>
                {scrums.map((scrum) => (
                    <li key={scrum.id}>
                        {scrum.name}
                        <button onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                    </li>
                ))}
            </ul>
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;