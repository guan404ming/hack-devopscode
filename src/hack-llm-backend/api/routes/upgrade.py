from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.chat import chat
import json

router = APIRouter()


class CodeUpgradeRequest(BaseModel):
    code: str
    prompt: str = "Upgrade the code to the latest version."


class CodeUpgradeResponse(BaseModel):
    code: str
    improvements: list[str]
    potential_issues: list[str]


@router.post("/upgrade", response_model=CodeUpgradeResponse)
async def upgrade_code_endpoint(request: CodeUpgradeRequest):
    try:
        full_prompt = f"""
            Please analyze the following code and provide version upgrade recommendations:

            ---
            ### **📌 Original Code**
            {request.code}

            ---
            ### **🔍 Specified Version Description**
            {request.prompt}

            **Ensure the response meets the following requirements:**
            1️⃣ Detect the programming language used and apply "best practices" for that language at that version.  
            2️⃣ If no version upgrade is specified, return the original code without modifications.

            ---
            ### **🔹 Output Requirements**
            Return the result in **JSON format**, ensuring consistency and detailed content:
            ```json
            {{
                "code": "The improved code with clear formatting",
                "improvements": "List of all improvements made",
                "potential_issues": "List of potential issues found in the original code"
            }}
            ```
        """

        response = chat(
            prompt=full_prompt,
            temperature=0.3,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "CodeUpgradeResponse",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string",
                                "description": "improved_code",
                            },
                            "improvements": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": " list_of_improvements",
                            },
                            "potential_issues": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "list_of_potential_issues",
                            },
                        },
                        "required": [
                            "code",
                            "improvements",
                            "potential_issues",
                        ],
                    },
                },
            },
        )

        result = json.loads(response)

        return CodeUpgradeResponse(
            code=result["code"],
            improvements=result["improvements"],
            potential_issues=result["potential_issues"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"程式碼升級失敗: {str(e)}")
