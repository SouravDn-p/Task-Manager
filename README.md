# Task Management Application

A simple and interactive task management application with authentication, task categorization, real-time updates, and drag-and-drop functionality.

## 🚀 Live Demo
[Live Site](#) ([Replace with actual deployed link](https://task-manager-13e7e.web.app))

## 📌 Features
- User Authentication (Login, Registration, Logout)
- Drag and Drop Task Management
- Theme Toggle (Light/Dark Mode)
- Real-Time Updates
- Persistent Theme Selection (Stored in LocalStorage)
- Responsive UI for all devices

## 🛠 Technologies Used
- **Frontend:** Vite.js + React, Tailwind CSS, React DnD, Lottie
- **Backend:** Express.js, MongoDB
- **Authentication:** Firebase Authentication
- **State Management:** React Context API

## 📦 Dependencies
```
react
react-dom
react-router-dom
firebase
axios
react-dnd
react-dnd-html5-backend
lottie-react
react-simple-typewriter
```

## ⚡ Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo.git
   cd task-manager-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project and enable authentication.
   - Get Firebase config and add it to `firebase.init.js`.

4. Run the development server:
   ```sh
   npm run dev
   ```

5. Start the backend (Express.js & MongoDB):
   ```sh
   cd backend
   npm install
   node server.js
   ```

## 🤝 Contributing
Feel free to contribute by submitting a pull request.

## 📜 License
This project is licensed under the MIT License.
