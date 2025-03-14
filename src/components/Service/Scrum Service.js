// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:4000';

// export const fetchScrums = async () => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/scrums`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching scrums:', error);
//         return [];
//     }
// };

// export const fetchUsers = async () => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/users`);
//         return response.data.filter(user => user.role === 'employee');
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         return [];
//     }
// };

// export const fetchScrumDetails = async (scrumId) => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/scrums/${scrumId}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error :', error);
//         return null;
//     }
// };

// export const createScrumWithTask = async (values) => {
//     try {
//         const scrumId = Date.now().toString();
//         const newScrumResponse = await axios.post(`${API_BASE_URL}/scrums`, {
//             id: scrumId,
//             name: values.scrumName
//         });

//         const taskId = (Date.now() + 1).toString();
//         await axios.post(`${API_BASE_URL}/tasks`, {
//             id: taskId,
//             title: values.taskTitle,
//             description: values.taskDescription,
//             status: values.taskStatus,
//             scrumId: Number(scrumId),
//             assignedTo: Number(values.taskAssignedTo),
//             history: [
//                 {
//                     status: values.taskStatus,
//                     date: new Date().toISOString().split('T')[0],
//                 },
//             ],
//         });

//         return newScrumResponse.data;
//     } catch (error) {
//         console.error('Error creating scrum:', error);
//         return null;
//     }
// };
