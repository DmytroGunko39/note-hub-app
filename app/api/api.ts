import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://notehub-backend-nke3.onrender.com',
  withCredentials: true,
});

// Testing:

// Not run (manual testing recommended once backend endpoints exist).
// Next steps:

// Implement secure token generation, storage, email sending, and session invalidation on the API service these routes proxy to. 2. Consider rate limiting and CAPTCHA on the forgot-password endpoint to prevent abuse.

// OldGoIT API = https://notehub-api.goit.study;
// baseURL: 'https://notehub-backend-nke3.onrender.com',
