# 🚀 **Devopscode**  
Welcome to the **devopscode**’s README! This project integrates backend and frontend services, a VS Code extension, and data processing to help developers streamline code optimization and conversion.

## 🚀 Running the Project
This project consists of four core components, each responsible for specific functionalities. It uses **Nx**, **uv**, and **Bun** for efficient dependency management.

Here’s an example of the basic commands to get the project running:
```bash
uv v
source .venv/bin/activate
bun install
bun dev
```

---

## 🚀 Project Structure



### 1. Backend (hack-llm-backend)
The backend is built using **FastAPI**, a modern web framework for building APIs in **Python**. It offers code optimization, conversion, language detection, and **Kubernetes** deployment functionalities. The backend efficiently handles requests and returns results in a structured format.

- **Key Features**:
  - Code optimization, analysis and erro detection using LLM
  - Deployment of user-provided code to Kubernetes
  - Integration with various LLM tools ex. Langchain, LangGraph and LandSmith

### 2. Web (hack-web-frontend, hack-web-backend)
The frontend is developed using **React** and **TypeScript**, providing a dynamic UI to interact with backend services. Users can input code, view optimization results, and manage deployments.

- **Key Features**:
  - User-friendly interface for code submission
  - Real-time display of code optimization results
  - Integration with **GitHub** to fetch code snippets

### 3. VS Code Extension (hack-vsc-extension)
This **VS Code** extension brings code conversion and optimization tools directly into the editor, allowing developers to stay within their development environment.

- **Key Features**:
  - Commands for code conversion and optimization
  - Seamless integration with the backend API

### 4. Data Processing (hack-data)
Handles data processing tasks, particularly the conversion of **TensorFlow** **TFRecord** files into **JSONL** format, ensuring the data is easy to work with.

- **Key Features**:
  - Efficient parsing of TFRecord files
  - Conversion to JSONL for easier integration

## 🚀 Conclusion
Together, these four core components provide a complete solution for code optimization and conversion, helping developers enhance code quality and performance. We hope you enjoy using **devopscode**, and we welcome any suggestions or feedback you may have!
