from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.chat import chat
import json

router = APIRouter()


class CodeCorrectRequest(BaseModel):
    code: str
    prompt: str = "Fix any syntax, compilation, or runtime errors in the code."


class CodeCorrectResponse(BaseModel):
    code: str
    fixed_issues: list[str]
    error_type: str


@router.post("/correct", response_model=CodeCorrectResponse)
async def correct_code_endpoint(request: CodeCorrectRequest):
    try:
        full_prompt = f"""
        Please analyze and fix any errors in the following code:

        ---
        ### **📌 Original Code with Errors**
        ```
        {request.code}
        ```

        ---
        ### **🔍 Error Fixing Requirements**
        {request.prompt}

        Analyze and fix the following types of errors:
        1. Syntax errors (e.g., missing brackets, incorrect indentation)
        2. Compilation errors (e.g., type mismatches, undefined variables)
        3. Runtime errors (e.g., division by zero, null pointer)
        4. Logical errors (e.g., infinite loops, incorrect conditions)
        5. Best practice violations

        Return the result in JSON format with the following structure:
        {{
            "code": "The corrected code",
            "fixed_issues": ["List of specific issues that were fixed"],
            "error_type": "Type of the main error (syntax/compilation/runtime/logical)"
        }}
        """

        response = chat(
            prompt=full_prompt,
            temperature=0.1,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "CodeCorrectResponse",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string",
                                "description": "The corrected code",
                            },
                            "fixed_issues": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "List of fixed issues",
                            },
                            "error_type": {
                                "type": "string",
                                "enum": [
                                    "syntax",
                                    "compilation",
                                    "runtime",
                                    "logical",
                                    "best_practice",
                                ],
                                "description": "Main type of error that was fixed",
                            },
                        },
                        "required": ["code", "fixed_issues", "error_type"],
                    },
                },
            },
        )

        result = json.loads(response)

        return CodeCorrectResponse(
            code=result["code"],
            fixed_issues=result["fixed_issues"],
            error_type=result["error_type"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"代碼修正失敗: {str(e)}")
