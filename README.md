
# DeepSight - Modern System Monitor

**DeepSight** is a modern, real-time system monitoring dashboard that provides detailed insights into your computer's health and performance. It combines a sleek, responsive frontend with a powerful backend to visualize critical metrics like CPU load per core, memory usage, network traffic, and storage health.

Running on **Node.js** and **React**, it uses **Socket.IO** for live updates and features a beautiful glassmorphism UI designed to be both informative and visually stunning.

![Deep Sight Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3) 
*(Note: Screenshot placeholder. Run the project to see it in action!)*

## ✨ Key Features

*   **Real-Time Monitoring**: Watch your system's heartbeat with live updates via WebSocket.
*   **Detailed CPU Analysis**: Visualize load distribution across *every single CPU core* individually, plus monitor temperatures.
*   **Process Manager**: Identify the top 5 resource-hungry applications slowing down your machine.
*   **Storage Breakdown**: Get a clear view of disk space usage across all partitions.
*   **Network Stats**: Monitor real-time upload/download speeds and interface status.
*   **System Health**: Alerts for high resource usage, temperature warnings, and battery status (for laptops).
*   **Responsive Design**: A fluid UI that adapts perfectly from ultra-wide monitors to mobile screens.

## 🚀 Tech Stack

### Frontend (Client)
*   **React (Vite)**: Fast, modern UI development.
*   **Framer Motion**: Smooth, professional animations.
*   **Recharts**: Interactive data visualization.
*   **Lucide Icons**: Clean, consistent iconography.
*   **Vanilla CSS**: Lightweight styling with custom properties and glassmorphism effects.

### Backend (Server)
*   **Node.js & Express**: robust server environment.
*   **Socket.IO**: Real-time, bidirectional communication.
*   **SystemInformation**: Powerful library for retrieving detailed system metrics.

## 🛠️ Getting Started

Follow these steps to get Deep Sight running on your local machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   npm (comes with Node.js)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/DeepSight.git
    cd DeepSight
    ```

2.  **Setup Backend**
    Open a terminal and run:
    ```bash
    cd backend
    npm install
    npm run dev
    # Server will start on http://localhost:3001
    ```

3.  **Setup Frontend**
    Open a *new* terminal window/tab and run:
    ```bash
    cd frontend
    npm install
    npm run dev
    # Dashboard will launch at http://localhost:5173
    ```

## 📸 Project Structure

*   **/backend**: server logic, API endpoints, and system monitoring (Socket.IO).
*   **/frontend**: React application, components, hooks, and styles.

## 🤝 Contributing

Contributions are welcome! Whether it's adding GPU temperature monitoring, Docker container stats, or just fixing a typo, feel free to fork the repo and submit a Pull Request.

---
*Built by Lehlohonolo.*
