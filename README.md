# RoomSewa
RoomSewa - Nepal Room Rental Platform. Full-stack MERN app with JWT auth, Cloudinary uploads, booking system &amp; admin panel. Features: property search/filter, role-based access (renter/owner/admin), galaxy-themed UI with neon effects. Ready for deployment! 🏠🚀

# 🏠 RoomSewa - Nepal Room Rental Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application for room and property rentals in Nepal. Features include real-time chat, admin panel, booking system, and modern glassmorphism UI.

![RoomSewa Banner](https://via.placeholder.com/1200x400/0a0e27/00f5ff?text=RoomSewa+-+Find+Your+Perfect+Room)

---

## ✨ Features

### For Renters
- 🔍 Advanced property search with filters (location, price, type)
- 💬 Real-time chat with property owners (Socket.io)
- 📋 Book properties and track booking status
- ⭐ Save favorite properties
- 📱 Responsive design for mobile devices

### For Property Owners
- ➕ Add and manage property listings
- 📸 Image upload for properties
- 🔔 Receive and manage booking requests
- 💰 Set pricing and availability

### Admin Panel
- 👥 User management (view, delete, change roles)
- 🏠 Property management (view, delete)
- 📊 Dashboard with statistics
- 📋 Booking oversight

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) - UI Library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Socket.io-client** - Real-time messaging
- **Axios** - HTTP requests
- **React Toastify** - Notifications

### Backend
- **Node.js** & **Express** - Server
- **MongoDB** & **Mongoose** - Database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

---

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- Git

### Clone Repository
```bash
git clone https://github.com/Alok-Jha-creator/RoomSewa.git
cd RoomSewa
```

### Backend Setup
```bash
# Install dependencies
npm install

# Create .env file in root
PORT=5000
MONGO_URI=mongodb://localhost:27017/roomsewa
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Start backend
npm run dev
```

### Frontend Setup
```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start frontend
npm run dev
```

---

## 🚀 Usage

1. **Start MongoDB** (MongoDB Compass or Terminal)
2. **Run Backend**: `npm run dev` (Port 5000)
3. **Run Frontend**: `cd client && npm run dev` (Port 5173)
4. **Open Browser**: http://localhost:5173

### Default Accounts
- **Renter**: Register a new account
- **Owner**: Register and switch role to "Owner" in profile
- **Admin**: Manually set `role: 'admin'` in MongoDB

---

## 📸 Screenshots

### Home Page
![Home](https://via.placeholder.com/800x400/0a0e27/00f5ff?text=Home+Page)

### Property Listings
![Properties](https://via.placeholder.com/800x400/0a0e27/00f5ff?text=Property+Listings)

### Real-time Chat
![Chat](https://via.placeholder.com/800x400/0a0e27/00f5ff?text=Real-time+Chat)

### Admin Dashboard
![Admin](https://via.placeholder.com/800x400/0a0e27/00f5ff?text=Admin+Dashboard)

---

## 📁 Project Structure
```
RoomSewa/
├── api/                    # Backend
│   ├── controllers/       # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   └── index.js           # Server entry
├── client/                 # Frontend
│   ├── src/
│   │   ├── api/           # API services
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Root component
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

---

## 🔑 Environment Variables

### Root `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/roomsewa
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user

### Properties
- `GET /api/listing` - Get all properties
- `GET /api/listing/:id` - Get single property
- `POST /api/listing/create` - Create property
- `PUT /api/listing/update/:id` - Update property
- `DELETE /api/listing/delete/:id` - Delete property

### Bookings
- `POST /api/booking` - Create booking
- `GET /api/booking/my` - Get user bookings
- `PATCH /api/booking/:id/status` - Update booking status

### Messages
- `POST /api/message/send` - Send message
- `GET /api/message/:receiverId/:propertyId` - Get messages
- `GET /api/message/conversations` - Get all conversations

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/properties` - Get all properties
- `GET /api/admin/bookings` - Get all bookings

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Alok Jha**

- GitHub: [@Alok-Jha-creator](https://github.com/Alok-Jha-creator)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Inspired by modern rental platforms
- Built as a college project showcasing MERN stack skills
- Special thanks to the open-source community

---

## 🐛 Known Issues

- File uploads stored locally (consider Cloudinary for production)
- Real-time chat requires both users online
- Admin role must be set manually in database

---

## 🔮 Future Enhancements

- [ ] Payment integration (eSewa/Khalti)
- [ ] Email notifications
- [ ] Reviews & ratings system
- [ ] Google Maps integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

**⭐ If you like this project, please give it a star on GitHub! ⭐**
