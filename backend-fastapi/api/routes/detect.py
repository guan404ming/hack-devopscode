from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.chat import chat
import json
from typing import List, Literal

router = APIRouter()


class CodeDetectRequest(BaseModel):
    code: str
    prompt: str = "Detect any errors or potential optimizations in the code."


class CodeIssue(BaseModel):
    start_line: int
    end_line: int
    tag: Literal["error", "optimize"]
    description: str


class CodeDetectResponse(BaseModel):
    issues: List[CodeIssue]


@router.post("/detect", response_model=CodeDetectResponse)
async def detect(request: CodeDetectRequest):
    """
    Detect code issues and optimization opportunities
    """
    try:
        prompt = f"""
        Analyze the following code and identify lines that need improvement or contain errors:
        ```
        {request.code}        ```

        {request.prompt}

        Check for:
        1. Syntax errors
        2. Compilation errors
        3. Runtime errors
        4. Logical errors
        5. Performance optimization opportunities

        Return a JSON array containing:
        [
            {{
                "start_line": <starting line number>,
                "end_line": <ending line number>,
                "tag": "error" or "optimize",
                "description": "Issue description"
            }}
        ]

        Be specific about line numbers and provide clear descriptions.
        For each issue, indicate whether it's an error or optimization opportunity.
        """

        response = chat(
            prompt=prompt,
            temperature=0,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "CodeDetectResponse",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "issues": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "start_line": {"type": "integer"},
                                        "end_line": {"type": "integer"},
                                        "tag": {
                                            "type": "string",
                                            "enum": ["error", "optimize"],
                                        },
                                        "description": {"type": "string"},
                                    },
                                    "required": [
                                        "start_line",
                                        "end_line",
                                        "tag",
                                        "description",
                                    ],
                                },
                            }
                        },
                    },
                },
            },
        )

        result = json.loads(response)
        print(result["issues"])
        return CodeDetectResponse(issues=result["issues"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code detection failed: {str(e)}")
