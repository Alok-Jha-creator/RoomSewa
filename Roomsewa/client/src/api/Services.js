import API from './Axios';

// ============ AUTH SERVICES ============
export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.get('/auth/logout');
  return response.data;
};

// ============ USER SERVICES ============
export const getUserProfile = async () => {
  const response = await API.get('/user/profile');
  return response.data;
};

export const updateUserProfile = async (id, userData) => {
  const response = await API.put(`/user/update/${id}`, userData);
  return response.data;
};

export const deleteUserAccount = async (id) => {
  const response = await API.delete(`/user/delete/${id}`);
  return response.data;
};

export const getMyProperties = async (id) => {
  const response = await API.get(`/user/listings/${id}`);
  return response.data;
};

// ============ PROPERTY SERVICES ============
export const getAllProperties = async (params) => {
  const response = await API.get('/listing', { params });
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await API.get(`/listing/${id}`);
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await API.post('/listing/create', propertyData);
  return response.data;
};

export const updateProperty = async (id, propertyData) => {
  const response = await API.put(`/listing/update/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await API.delete(`/listing/delete/${id}`);
  return response.data;
};

export const togglePropertyAvailability = async (id) => {
  const response = await API.put(`/listing/toggle/${id}`);
  return response.data;
};

// ============ BOOKING SERVICES ============
export const createBooking = async (bookingData) => {
  const response = await API.post('/booking', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await API.get('/booking/my');
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await API.patch(`/booking/${id}/status`, { status });
  return response.data;
};

// ============ ADMIN SERVICES ============
export const getAdminStats = async () => {
  const response = await API.get('/admin/stats');
  return response.data;
};

export const getAllUsersAdmin = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

export const deleteUserAdmin = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

export const updateUserRoleAdmin = async (id, role) => {
  const response = await API.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const getAllPropertiesAdmin = async () => {
  const response = await API.get('/admin/properties');
  return response.data;
};

export const deletePropertyAdmin = async (id) => {
  const response = await API.delete(`/admin/properties/${id}`);
  return response.data;
};

export const getAllBookingsAdmin = async () => {
  const response = await API.get('/admin/bookings');
  return response.data;
};

// ============ MESSAGE SERVICES ============ ← NEW
export const sendMessage = async (messageData) => {
  const response = await API.post('/message/send', messageData);
  return response.data;
};

export const getMessages = async (receiverId, propertyId) => {
  const response = await API.get(`/message/${receiverId}/${propertyId}`);
  return response.data;
};

export const getConversations = async () => {
  const response = await API.get('/message/conversations');
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await API.delete(`/message/${id}`);
  return response.data;
};