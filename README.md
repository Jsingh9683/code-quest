# Code Quest

Code Quest is an educational application designed for kids. It includes four interactive games to enhance their knowledge and learning. The games are focused on general knowledge, math, and animal identification, making learning fun and engaging. Parents can monitor their children's performance through a comprehensive dashboard.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js and npm**: Download and install Node.js, which includes npm, from [nodejs.org](https://nodejs.org).
- **MongoDB Atlas Account**: Sign up for a free MongoDB Atlas account and create a new cluster. You will need the connection string for the database setup.

## Quick Start

Follow these steps to get the Code Quest application up and running quickly:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/Jsingh9683/code-quest.git
    cd code-quest
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**

    Create a `.env` file in the root directory with the following content:

    ```makefile
    MONGO_URI=your_mongodb_online_cluster_uri
    ```

4. **Start the Application:**

    ```bash
    npm start
    ```

5. **Access the Application:**

    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Deployment Instructions

### How to Create the Database

1. **Create MongoDB Cluster:**
    - Go to MongoDB Atlas.
    - Create a new cluster.
    - Get the connection string and update the `MONGO_URI` in the `.env` file.

### How to Install and Configure The Application

1. **Set Up Node.js on Server:**
    - Install Node.js on your server by downloading it from [nodejs.org](https://nodejs.org).

2. **Deploy to Server:**

    Clone the repository to your server:

    ```bash
    git clone https://github.com/your-repo/code-quest.git
    cd code-quest
    ```

    Install dependencies:

    ```bash
    npm install
    ```

    Start the application:

    ```bash
    npm start
    ```

### How to Access the Application

- **Local Development:**
    - Run `npm start` and navigate to [http://localhost:3000](http://localhost:3000).

- **Production Environment:**
    - Ensure your server is running the application and accessible over the internet.
    - Navigate to your server's IP address or domain name to access the application.
