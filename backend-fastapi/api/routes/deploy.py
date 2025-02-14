from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.chat import chat
import json

router = APIRouter()


class DockerYamlRequest(BaseModel):
    code: str
    prompt: str = "Generate a Docker YAML configuration for this code."


class DockerYamlResponse(BaseModel):
    yaml: str
    description: str


@router.post("/deploy", response_model=DockerYamlResponse)
async def generate_docker_yaml(request: DockerYamlRequest):
    try:
        full_prompt = f"""
        Please analyze the following code and generate an appropriate Docker YAML configuration:

        ---
        ### **📌 Code to Containerize**
        ```
        {request.code}
        ```

        ---
        ### **🔍 Additional Requirements**
        {request.prompt}

        Generate a Docker YAML configuration that:
        1. Uses appropriate base images
        2. Includes all necessary dependencies
        3. Follows Docker best practices
        4. Is production-ready and secure
        
        Return the result in JSON format with a single "yaml" field containing the configuration.
        """

        response = chat(
            prompt=full_prompt,
            temperature=0.3,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "DockerYamlResponse",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "yaml": {
                                "type": "string",
                                "description": "Docker YAML configuration",
                            },
                            "description": {
                                "type": "string",
                                "description": "Docker YAML configuration",
                            },
                        },
                        "required": ["yaml"],
                    },
                },
            },
        )

        result = json.loads(response)
        return DockerYamlResponse(yaml=result["yaml"], description=result["description"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Docker YAML 生成失敗: {str(e)}")
