# Ackerman

## Description

Ackerman is a self-hosted AI assistant designed to integrate seamlessly with various applications, helping users manage their day-to-day tasks. Ackerman can take notes during meetings, create alarms and reminders, control IoT devices, and more. The project aims to provide privacy, extensibility, and powerful automation for personal and professional productivity.

Ackerman leverages Ollama as its AI model, a Node.js backend built with NestJS for robust APIs, and a modern frontend using Tauri, React.js, and Vite for a fast, cross-platform desktop experience.

## Requirement Analysis

### Functional Requirements

- AI Assistant: Natural language interface for interacting with the assistant.
- Note Taking: Automatically transcribe and summarize meetings.
- Reminders & Alarms: Set, manage, and trigger reminders and alarms.
- IoT Integration: Control and monitor IoT devices (e.g., lights, thermostats).
- Application Integration: Connect with calendars, email, and other productivity tools.
- Extensibility: Support for plugins or modules to add new integrations and features.
- Privacy: All data and AI processing are self-hosted, ensuring user privacy.

### Non-Functional Requirements

- Simplicity: User-friendly interface and setup.
- Low Latency: Fast response times for all interactions.
- Performance: Efficient resource usage for desktop and server environments.
- Security: Secure storage and communication of user data.
- Language: Node.js (NestJS), TypeScript, React.js, Tauri, Vite.
- Logging: Structured, machine-consumable logs (e.g., JSON).

### Scale Requirements

- Designed for individual or small team use.
- Support for multiple concurrent integrations and tasks.
- Efficient handling of real-time events and background jobs.

### Hardware Requirements

- Minimum: 2 CPUs, 4 GB RAM (recommended for smooth AI inference and multitasking).

## How to run this project

1. Clone the repository and install dependencies for both backend and frontend.
2. Set up the `.env` files for backend and frontend as needed.
3. Ensure Ollama is installed and running locally for AI model inference.
4. Start the backend API (NestJS).
5. Start the frontend (Tauri + React + Vite).
6. Access the desktop application or web interface.

Detailed setup instructions will be provided in the respective `backend/` and `frontend/` README files.

## Solution Details

### Architecture

```mermaid
architecture-beta
  service user(internet)[User]

  group app(cloud)[Ackerman App]
  service ai(model)[Ollama AI Model] in app
  service api(server)[NestJS API] in app
  service frontend(client)[Tauri + React] in app
  service iot(iot)[IoT Devices] in app
  service integrations(plugins)[Integrations] in app

  user:R -- L:frontend
  frontend:R -- L:api
  api:R -- L:ai
  api:R -- L:integrations
  api:R -- L:iot
```

### AI Assistant

Ackerman uses Ollama for natural language understanding and generation. All AI inference is performed locally, ensuring privacy and control.

### Integrations

Ackerman supports integration with various applications and IoT devices through a modular plugin system. Users can enable or disable integrations as needed.

### Data Storage

User data, notes, reminders, and settings are stored locally or in a self-hosted database, depending on configuration.

### Security & Privacy

All processing and data storage are self-hosted. No user data is sent to third-party servers.

## TO-DO

- [x] Basic authentication with JWT.
- [x] Session management with refresh and session tokens.
- [ ] E-mail templates for account confirmation and recovery.
- [ ] AI Assistant: Implement core natural language interface.
- [ ] Note Taking: Integrate meeting transcription and summarization.
- [ ] Reminders & Alarms: Add scheduling and notification system.
- [ ] IoT Integration: Support for common IoT protocols/devices.
- [ ] Application Integrations: Calendar, email, and productivity tools.
- [ ] Extensibility: Plugin/module system for new features.
- [ ] Logging: Add structured logging with OpenTelemetry.
- [x] Desktop App: Package with Tauri for cross-platform support.
- [x] Frontend logic for sign in and sign up flows.
- [ ] Frontend logic for the application inbuilt chat.

## References

- [Ollama](https://ollama.com/)
- [NestJS](https://nestjs.com/)
- [Tauri](https://tauri.app/)
- [React.js](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [OpenTelemetry](https://opentelemetry.io/)
