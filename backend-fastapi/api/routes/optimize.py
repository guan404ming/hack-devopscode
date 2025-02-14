from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.chat import chat
import json
from typing import Dict, Any, TypedDict, List
from langgraph.graph import StateGraph


router = APIRouter()


class CodeOptimizeRequest(BaseModel):
    code: str
    prompt: str = "Optimize the code for better performance."


class Complexity(BaseModel):
    time: str
    space: str

class CodeOptimizeResponse(BaseModel):
    code: str
    original_complexity: Complexity
    optimized_complexity: Complexity
    improvements: List[str]
    potential_tradeoffs: List[str]


class OptimizationState(TypedDict):
    code: str
    prompt: str
    result: Dict[str, Any]
    complexity_analysis: Dict[str, Any]


def analyze_complexity(state: OptimizationState) -> OptimizationState:
    """Analyze the time and space complexity of the code"""
    prompt = f"""
    Analyze the following code and determine its time and space complexity:

    ```
    {state["code"]}
    ```

    Return a JSON object with the following information:
    1. Current time complexity
    2. Current space complexity
    3. Detailed explanation of the complexity analysis
    """

    response = chat(
        prompt=prompt,
        temperature=0,
        response_format={
            "type": "object",
            "properties": {
                "time_complexity": {
                    "type": "string",
                    "description": "Big O notation of time complexity",
                },
                "space_complexity": {
                    "type": "string",
                    "description": "Big O notation of space complexity",
                },
            },
            "required": [
                "time_complexity",
                "space_complexity",
            ],
        },
    )

    state["complexity_analysis"] = json.loads(response)
    return state


def optimize_code(state: OptimizationState) -> OptimizationState:
    """Optimize the code based on the analysis and requirements"""
    full_prompt = f"""
    Please optimize the following code focusing on "time" and "memory" space optimization:

    ---
    ### **📌 Original Code**
    ```
    {state["code"]}
    ```

    ### **🎯 Current Analysis**
    - Time Complexity: {state["complexity_analysis"]["time_complexity"]}
    - Space Complexity: {state["complexity_analysis"]["space_complexity"]}

    ### **🔍 Optimization Requirements**
    1️⃣ Focus on time and space optimization
    2️⃣ Achieve high level of improvement
    3️⃣ Maintain code readability and maintainability
    4️⃣ Consider practical implementation details
    5️⃣ Document any tradeoffs made

    {state["prompt"]}

    Return a JSON object containing:
    1. The optimized code
    2. New complexity analysis
    3. List of improvements made
    4. Detailed optimization suggestions
    5. Potential tradeoffs
    """

    response = chat(
        prompt=full_prompt,
        temperature=0.3,
        response_format={
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "description": "The optimized code",
                },
                "new_complexity": {
                    "type": "object",
                    "properties": {
                        "time": {"type": "string"},
                        "space": {"type": "string"},
                    },
                },
                "improvements": {"type": "array", "items": {"type": "string"}},
                "tradeoffs": {"type": "array", "items": {"type": "string"}},
            },
            "required": [
                "code",
                "new_complexity",
                "improvements",
                "tradeoffs",
            ],
        },
    )

    state["result"] = json.loads(response)
    return state


def build_chain():
    # Create the optimization workflow
    workflow = StateGraph(OptimizationState)

    # Add nodes
    workflow.add_node("analyze_complexity", analyze_complexity)
    workflow.add_node("optimize_code", optimize_code)

    # Add edges
    workflow.add_edge("analyze_complexity", "optimize_code")
    workflow.set_entry_point("analyze_complexity")
    workflow.set_finish_point("optimize_code")

    return workflow.compile()


@router.post("/optimize", response_model=CodeOptimizeResponse)
async def optimize_code_endpoint(request: CodeOptimizeRequest):
    """
    優化程式碼的效能，考慮時間和空間複雜度
    """
    try:
        # Initialize the state
        initial_state = OptimizationState(
            code=request.code, prompt=request.prompt, result={}
        )

        # Execute the optimization chain
        chain = build_chain()
        final_state = chain.invoke(initial_state)

        # Return the optimization results
        return CodeOptimizeResponse(
            code=final_state["result"]["code"],
            original_complexity=Complexity(
                time=final_state["complexity_analysis"]["time_complexity"],
                space=final_state["complexity_analysis"]["space_complexity"],
            ),
            optimized_complexity=Complexity(
                time=final_state["result"]["new_complexity"]["time"],
                space=final_state["result"]["new_complexity"]["space"],
            ),
            improvements=final_state["result"]["improvements"],
            potential_tradeoffs=final_state["result"]["tradeoffs"],
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Code optimization failed: {str(e)}"
        )
