import axios from 'axios';

// Types
interface Complexity {
    time: string;
    space: string;
    description: string;
}

interface OptimizationSuggestion {
    category: string;
    suggestion: string;
    impact: string;
    effort: string;
}

// Request Types
interface CodeUpgradeRequest {
    code: string;
    prompt?: string;
}

interface CodeConvertRequest {
    code: string;
    prompt?: string;
}

interface CodeOptimizeRequest {
    code: string;
    prompt?: string;
}

interface DockerYamlRequest {
    code: string;
    prompt?: string;
}

interface CodeDetectRequest {
    code: string;
    prompt?: string;
}

// Response Types
interface CodeUpgradeResponse {
    code: string;
    improvements: string[];
    potential_issues: string[];
}

interface CodeConvertResponse {
    code: string;
    language_specific_notes: string[];
    potential_compatibility_issues: string[];
}

interface CodeOptimizeResponse {
    code: string;
    original_complexity: Complexity;
    optimized_complexity: Complexity;
    improvements: string[];
    optimization_suggestions: OptimizationSuggestion[];
    potential_tradeoffs: string[];
}

interface DockerYamlResponse {
    yaml: string;
    description: string;
}

interface DeployRequest {
    code: string;
    language?: string;
}

interface DeployResponse {
    status: string;
    log: string;
    description: string;
}
interface CodeIssue {
    start_line: number;
    end_line: number;
    message: string;
    description: string;
}

interface CodeDetectResponse {
    issues: CodeIssue[];
}

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? "http://35.209.96.156/fastapi" 
  : "http://35.209.96.156/fastapi"; 

export const codeService = {
    upgradeCode: async (request: CodeUpgradeRequest): Promise<CodeUpgradeResponse> => {
        const response = await axios.post(`${BASE_URL}/upgrade`, request);
        return response.data;
    },

    convertCode: async (request: CodeConvertRequest): Promise<CodeConvertResponse> => {
        const response = await axios.post(`${BASE_URL}/convert`, request);
        return response.data;
    },

    optimizeCode: async (request: CodeOptimizeRequest): Promise<CodeOptimizeResponse> => {
        const response = await axios.post(`${BASE_URL}/optimize`, request);
        return response.data;
    },

    detectCode: async (request: CodeDetectRequest): Promise<CodeDetectResponse> => {
        const response = await axios.post(`${BASE_URL}/detect`, request);
        return response.data;
    },

    correctCode: async (request: CodeUpgradeRequest): Promise<CodeUpgradeResponse> => {
        const response = await axios.post(`${BASE_URL}/correct`, request);
        return response.data;
    },
    
    deployCode: async (request: DeployRequest): Promise<DeployResponse> => {
        const response = await axios.post(`${BASE_URL}/k8s`, request);
        return response.data;
    },
};

export type {
    CodeUpgradeRequest,
    CodeUpgradeResponse,
    CodeConvertRequest,
    CodeConvertResponse,
    CodeOptimizeRequest,
    CodeOptimizeResponse,
    DockerYamlRequest,
    DockerYamlResponse,
    Complexity,
    OptimizationSuggestion,
    DeployRequest,
    DeployResponse,
    CodeDetectRequest,
    CodeDetectResponse
};
