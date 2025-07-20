🗺️ Mappa Collaborative Workspace

<div align="center">

🚀 The All-in-One Platform for Real-Time Team Collaboration 🚀

</div>
🎯 What is Mappa?

Mappa is a comprehensive, real-time collaborative workspace designed to unify communication, project management, and content creation for modern teams. Whether you're a corporate team brainstorming the next big product, an educator conducting a virtual class, or a government organization coordinating a complex project, Mappa provides the integrated tools you need to succeed.

Our platform eliminates the need to juggle multiple applications by bringing essential functionalities like collaborative document editing, video conferencing, and automated task management into a single, intuitive environment.
✨ Key Features

Mappa is built with a rich set of features to streamline every aspect of your workflow:

📝 Real-Time Editing
	

📹 Integrated Video Conferencing
	

✅ Task Management
	

🔐 Secure & Scalable

Collaborative Docs & Whiteboards
	

High-quality Video & Audio Calls
	

Automated Workflows
	

Role-Based Access Control

Live Cursors & Presence
	

Screen Sharing & Annotation
	

Kanban Boards & Timelines
	

End-to-End Encryption

Version History & Rollback
	

Session Recording & Playback
	

Progress Tracking & Analytics
	

Scalable Supabase Backend

Conflict-Free Syncing
	

Breakout Rooms & Polling
	

Deadline & Dependency Setting
	

Secure User Authentication
🛠️ Technology Stack

We use a modern, robust, and scalable technology stack to deliver a seamless user experience.
Frontend

    Framework: Next.js

    Language: TypeScript

    Styling: Tailwind CSS

    Real-Time Communication: Socket.IO Client / Ably

    State Management: React Context / Zustand

Backend

    Framework: FastAPI

    Language: Python

    Database & Auth: Supabase (PostgreSQL)

    Real-Time Communication: WebSockets (via FastAPI)

    Video Streaming: WebRTC

🚀 Getting Started

Follow these instructions to get a local copy of Mappa up and running for development and testing purposes.
Prerequisites

    Node.js (v18.x or later)

    Python (v3.8 or later)

    A Supabase account for your database and authentication keys.

Installation & Setup

    Clone the repository:

    git clone https://github.com/Amal-Verma/Collaborative-IDE.git
    cd Collaborative-IDE

    Setup Frontend:

    # Navigate to the frontend directory
    cd frontend

    # Install dependencies
    npm install

    # Create a .env.local file and add your Supabase credentials
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

    # Run the frontend development server
    npm run dev

    Setup Backend:

    # Navigate to the backend directory from the root
    cd backend

    # Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`

    # Install dependencies
    pip install -r requirements.txt

    # Create a .env file and add your Supabase credentials
    SUPABASE_URL=YOUR_SUPABASE_URL
    SUPABASE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY # Use the service_role key for backend

    # Run the backend server
    uvicorn main:app --reload

    Access the application:
    Open your browser and navigate to http://localhost:3000. The Next.js frontend will connect to the FastAPI backend running on http://localhost:8000.

🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

    Fork the Project

    Create your Feature Branch (git checkout -b feature/AmazingFeature)

    Commit your Changes (git commit -m 'Add some AmazingFeature')

    Push to the Branch (git push origin feature/AmazingFeature)

    Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.
