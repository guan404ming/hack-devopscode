from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.chat import chat
import json
from enum import Enum
from typing import Dict, Any, TypedDict
from langgraph.graph import StateGraph

router = APIRouter()


class ProgrammingLanguage(str, Enum):
    # Web Development
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    PHP = "php"
    HTML = "html"
    CSS = "css"

    # Backend Development
    PYTHON = "python"
    JAVA = "java"
    CSHARP = "csharp"
    GO = "go"
    RUST = "rust"
    RUBY = "ruby"
    NODE = "nodejs"

    # Mobile Development
    KOTLIN = "kotlin"
    SWIFT = "swift"
    DART = "dart"
    FLUTTER = "flutter"
    REACT_NATIVE = "react_native"

    # System Programming
    CPP = "cpp"
    C = "c"
    ASSEMBLY = "assembly"

    # Database
    SQL = "sql"
    PLSQL = "plsql"
    MONGODB = "mongodb"

    # Shell Scripting
    BASH = "bash"
    POWERSHELL = "powershell"

    # Functional Programming
    SCALA = "scala"
    HASKELL = "haskell"
    ELIXIR = "elixir"

    # Data Science & ML
    R = "r"
    JULIA = "julia"
    MATLAB = "matlab"

    # Cloud & DevOps
    TERRAFORM = "terraform"
    KUBERNETES = "kubernetes"
    DOCKER = "docker"

    # Other Popular
    LUA = "lua"
    PERL = "perl"
    GROOVY = "groovy"
    COBOL = "cobol"
    FORTRAN = "fortran"


class CodeConvertRequest(BaseModel):
    code: str = "print('string')"
    prompt: str = "Convert the code to Java."


class CodeConvertResponse(BaseModel):
    code: str
    target_language: str


class ConversionState(TypedDict):
    code: str
    prompt: str
    source_language: str
    target_language: str
    result: Dict[str, Any]


def extract_languages(state: ConversionState) -> ConversionState:
    """Extract source and target languages from the prompt"""
    prompt = f"""
    Analyze the following prompt and identify the source and target programming languages.
    Return only a JSON object with 'source_language' and 'target_language'.
    Use lowercase language names from this list: python, javascript, typescript, java, csharp, go, rust, cpp, swift, kotlin.
    If languages are not explicitly mentioned, try to infer from context or code.
    
    Prompt: {state["prompt"]}
    
    Code sample for reference:
    ```
    {state["code"]}
    ```
    """

    response = chat(
        prompt=prompt,
        temperature=0,
        response_format={
            "type": "object",
            "properties": {
                "source_language": {
                    "type": "string",
                    "enum": [lang.value for lang in ProgrammingLanguage],
                },
                "target_language": {
                    "type": "string",
                    "enum": [lang.value for lang in ProgrammingLanguage],
                },
            },
            "required": ["source_language", "target_language"],
        },
    )

    languages = json.loads(response)
    state["source_language"] = languages["source_language"]
    state["target_language"] = languages["target_language"]
    return state


def convert_code(state: ConversionState) -> ConversionState:
    """Convert the code using the extracted languages"""
    full_prompt = f"""
    {"if java code then need 'public static void main' make it a runable class." if state["source_language"] == "java" else ""}
    Please convert the following code from {state["source_language"]} to {state["target_language"]}:

    ---
    ### **📌 Original Code ({state["source_language"]})**
    ```{state["source_language"]}
    {state["code"]}
    ```

    **Conversion Requirements:**
    1️⃣ Maintain the same functionality and logic
    2️⃣ Use idiomatic patterns and best practices of the target language
    3️⃣ Ensure the converted code is executable
    4️⃣ Provide any language-specific considerations or modifications
    """

    response = chat(
        prompt=full_prompt,
        temperature=0.3,
        response_format={
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "description": "The converted code",
                },
            },
            "required": [
                "code",
            ],
        },
    )

    state["result"] = json.loads(response)
    return state


def build_chain():
    # Create the conversion workflow
    workflow = StateGraph(ConversionState)

    # Add nodes
    workflow.add_node("extract_languages", extract_languages)
    workflow.add_node("convert_code", convert_code)

    # Add edges
    workflow.add_edge("extract_languages", "convert_code")
    workflow.set_entry_point("extract_languages")
    workflow.set_finish_point("convert_code")

    # Compile the graph
    chain = workflow.compile()

    return chain


@router.post("/convert", response_model=CodeConvertResponse)
async def convert_code_endpoint(request: CodeConvertRequest):
    """
    Convert code from one programming language to another based on the prompt
    """
    try:
        # Initialize the state
        initial_state = ConversionState(
            code=request.code,
            prompt=request.prompt,
            source_language="",
            target_language="",
            result={},
        )

        chain = build_chain()

        # Execute the chain
        final_state = chain.invoke(initial_state)

        # Return the result
        return CodeConvertResponse(
            code=final_state["result"]["code"],
            target_language=final_state["target_language"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code conversion failed: {str(e)}")
