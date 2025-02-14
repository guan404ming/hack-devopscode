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

const BASE_URL = "http://127.0.0.1:8000";

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

    generateDockerYaml: async (request: DockerYamlRequest): Promise<DockerYamlResponse> => {
        const response = await axios.post(`${BASE_URL}/deploy`, request);
        return response.data;
    }
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
    OptimizationSuggestion
};
