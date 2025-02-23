## Project Structure

This project consists of four main components, each serving a specific purpose:

### 1. Backend (hack-llm-backend)
The backend is built using FastAPI, a modern web framework for building APIs with Python. It provides endpoints for code optimization, conversion, language detection, and Kubernetes deployment. The backend is designed to handle requests efficiently and return results in a structured format.

- **Key Features**:
  - Code optimization and analysis
  - Language detection using LLM
  - Deployment of user-provided code in Kubernetes
  - Integration with various programming languages

- **Setup**:
  To set up the backend, navigate to the `src/hack-llm-backend` directory and install the required dependencies:
  ```bash
  cd src/hack-llm-backend
  pip install -r requirements.txt
  ```

### 2. Web (hack-web)
The frontend is developed using React and TypeScript, providing a dynamic user interface for interacting with the backend services. It allows users to input code, view optimization results, and manage deployments.

- **Key Features**:
  - User-friendly interface for code submission
  - Real-time feedback on code optimization
  - Integration with GitHub for fetching code snippets

- **Setup**:
  To set up the frontend, navigate to the `src/hack-web/frontend` directory and install the required dependencies:
  ```bash
  cd src/hack-web/
  bun install
  ```

### 3. VS Code Extension (hack-vsc-extension)
The VS Code extension enhances the development experience by providing tools for code conversion and optimization directly within the editor. It allows developers to streamline their workflow without leaving their coding environment.

- **Key Features**:
  - Code conversion and optimization commands
  - Integration with the backend API for seamless functionality

- **Setup**:
  To set up the VS Code extension, follow the instructions in the `src/hack-vsc-extension` directory.

### 4. Data Processing (hack-data)
This component is responsible for processing data, particularly converting TensorFlow TFRecord files into JSONL format. It ensures that the data is in a usable format for the application.

- **Key Features**:
  - Efficient parsing of TFRecord files
  - Conversion to JSONL for easier handling

### Running the Project
```bash
  bun dev
```

## Conclusion
These four components work together to create a comprehensive solution for code optimization and conversion, making it easier for developers to enhance their code quality and performance.