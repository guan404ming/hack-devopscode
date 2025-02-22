from typing import Optional, Dict, Any
import os
import tempfile
import subprocess
import json
from langchain_openai import ChatOpenAI
import re

def chat(
    prompt: str,
    response_format: Optional[Dict[str, Any]] = None,
    temperature: float = 0,
    reties: int = 0,
) -> str:
    """
    與 llm 互動的函數

    Args:
        prompt (str): 要發送給 AI 的提示詞
        response_format (Optional[Dict[str, Any]]): 期望的回應格式
        temperature (float): 控制回應的創造性程度 (0-1)

    Returns:
        str: AI 的回應
    """

    try:
        client = ChatOpenAI(
            model_name="gemini-2.0-flash",
            temperature=temperature,
            response_format=response_format,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            api_key=os.getenv("GEMINI_API_KEY"),
        )

        response = client.invoke(
            prompt
            + "\nPlease provide response in valid JSON format following the OpenAPI schema.",
        )
        print("\nAPI Response:", response)

        try:
            if isinstance(response.content, str):
                content = json.loads(response.content)
            elif isinstance(response.content, dict):
                content = response.content
            else:
                content = {"response": str(response.content)}

            if "code" in content:
                res = wet_run(content["code"])
                print("\nExecution result:", res)
                if not res["success"] and (reties < 2):
                    return chat(
                        prompt=f"The code execution failed. Please provide a valid and runable code. {content['code']}, {res['message']}",
                        response_format=response_format,
                        temperature=temperature,
                        reties=reties + 1,
                    )

            return json.dumps(content)

        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            return json.dumps({"response": str(response.content)})

    except Exception as e:
        print(f"Error details: {str(e)}")
        raise Exception(f"與 Vertex AI API 互動時發生錯誤: {str(e)}")


def detect_code_language(code: str) -> str:
    """Use LLM to detect programming language"""
    schema = {
        "type": "object",
        "properties": {
            "language": {
                "type": "string",
                "enum": ["python", "java", "unknown"],
                "description": "The detected programming language",
            }
        },
        "required": ["language"],
    }

    prompt = f"""
    Analyze the following code and determine its programming language.
    Return only "python" or "java".
    If uncertain or if it's another language, return "unknown".
    
    Code:
    ```
    {code}
    ```
    """

    try:
        response = chat(
            prompt=prompt,
            response_format=schema,
            temperature=0,
        )

        result = json.loads(response)
        if isinstance(result, dict) and "language" in result:
            return result["language"]
        return "unknown"

    except Exception as e:
        print(f"語言檢測錯誤: {str(e)}")
        return "unknown"


def wet_run(code: str):
    """
    Args:
        code (str): 要執行的程式碼

    Returns:
        {
            "message": str,
            "success": bool,
            "detected_lang": str
        }
    """
    try:
        # 檢測程式碼語言
        detected_lang = detect_code_language(code)

        if detected_lang == "unknown":
            return {
                "message": "不支援的程式語言",
                "success": True,
                "detected_lang": detected_lang,
            }

        # 根據語言選擇執行方式
        if detected_lang == "python":
            with tempfile.TemporaryDirectory() as temp_dir:
                py_file = os.path.join(temp_dir, "script.py")
                with open(py_file, "w") as f:
                    f.write(code)
                try:
                    run_result = subprocess.run(
                        ["python3", py_file], 
                        capture_output=True, 
                        text=True,
                        timeout=2
                    )
                    success = run_result.returncode == 0
                    message = (
                        run_result.stdout if success else f"執行失敗:\n{run_result.stderr}"
                    )
                except subprocess.TimeoutExpired:
                    success = False
                    message = "Execution timed out: The program took more than 1 seconds to run"

        elif detected_lang == "java":
            with tempfile.TemporaryDirectory() as temp_dir:
                class_pattern = r"public\s+class\s+(\w+)"
                match = re.search(class_pattern, code)
                if not match:
                    return {
                        "message": "cant find class name",
                        "success": False,
                        "detected_lang": detected_lang,
                    }
                
                class_name = match.group(1)
                java_file = os.path.join(temp_dir, f"{class_name}.java")

                with open(java_file, "w") as f:
                    f.write(code)

                try:
                    compile_result = subprocess.run(
                        ["javac", java_file], 
                        capture_output=True, 
                        text=True,
                        timeout=3
                    )
                    if compile_result.returncode != 0:
                        print("\nCompile result: ", compile_result)
                        return {
                            "message": f"編譯失敗:\n{compile_result.stderr}",
                            "success": False,
                            "detected_lang": detected_lang,
                        }

                    run_result = subprocess.run(
                        ["java", "-cp", temp_dir, class_name], 
                        capture_output=True, 
                        text=True,
                        timeout=1
                    )
                    success = run_result.returncode == 0
                    message = (
                        run_result.stdout if success else f"執行失敗:\n{run_result.stderr}"
                    )
                except subprocess.TimeoutExpired:
                    success = False
                    message = "Execution timed out: The program took more than 1 seconds to run"

        return {"message": message, "success": success, "detected_lang": detected_lang}

    except Exception as e:
        return {
            "message": f"執行時發生錯誤: {str(e)}",
            "success": False,
            "detected_lang": "unknown",
        }
