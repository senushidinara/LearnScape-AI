# Technical Documentation

## LearnScape-AI

### Architecture Overview

The LearnScape-AI application is a TypeScript-based project that leverages React for the frontend, and it utilizes various AI services for generating personalized learning worlds. The architecture can be broken down into the following components:

1. **Frontend**:
   - **React**: Used for building the user interface.
   - **Tailwind CSS**: For styling the application.
   - **Vite**: A build tool that optimizes the development experience.

2. **Backend**:
   - **Google GenAI**: Used for AI-powered content processing and generating learning worlds.
   - **PDF.js**: For parsing PDF files and extracting text content.

3. **State Management**:
   - **React Context API**: Used for managing global state such as player state, world data, and user analytics.

4. **Configuration**:
   - **Environment Variables**: Managed using Vite's `define` and `loadEnv` functions to load API keys and other configuration settings.

### Setup & Installation

To set up and install the LearnScape-AI project, follow these steps:

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/senushidinara/LearnScape-AI.git
   cd learnscape-ai
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory and add your API keys:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Run the Development Server**:
   ```sh
   npm run dev
   ```

### API Documentation

The LearnScape-AI application does not have a traditional REST API. Instead, it relies on AI services for generating learning worlds and processing content. The primary API used is the Google GenAI service, which is configured via environment variables.

### Configuration

The configuration for the LearnScape-AI application is managed through environment variables and Vite's configuration file (`vite.config.ts`).

- **Environment Variables**:
  - `GEMINI_API_KEY`: API key for the Google GenAI service.

- **Vite Configuration**:
  - `vite.config.ts`: Configures the development server, plugins, and environment variables.

### Development Guidelines

- **Code Style**: Follow the Airbnb JavaScript Style Guide for consistent code formatting.
- **Testing**: Write unit tests for components and services using a testing framework like Jest.
- **Linting**: Use ESLint to enforce code quality and catch potential issues early.
- **Version Control**: Use Git for version control and follow a branching strategy (e.g., GitFlow).

### Deployment Instructions

To deploy the LearnScape-AI application, follow these steps:

1. **Build the Application**:
   ```sh
   npm run build
   ```

2. **Serve the Application**:
   - You can use a static file server like `serve` to serve the built application:
     ```sh
     npx serve -s dist
     ```

3. **Deploy to a Hosting Service**:
   - Deploy the built application to a hosting service like Vercel, Netlify, or AWS Amplify.

### Additional Resources

- **GitHub Repository**: [LearnScape-AI](https://github.com/senushidinara/LearnScape-AI)
- **Documentation**: [LearnScape AI Documentation](https://github.com/senushidinara/LearnScape-AI/blob/main/README.md)

---

This documentation provides a comprehensive overview of the LearnScape-AI project, including its architecture, setup instructions, API documentation, configuration, development guidelines, and deployment instructions. This should help developers understand and contribute to the project effectively.
