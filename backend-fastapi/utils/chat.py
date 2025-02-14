from typing import Optional, Dict, Any
import os
from langchain_openai import ChatOpenAI
import tempfile
import subprocess
import json


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
        model_kwargs = {"response_format": response_format}

        client = ChatOpenAI(
            api_key=os.getenv("GEMINI_API_KEY"),
            base_url="https://generativelanguage.googleapis.com/v1beta/",
            model="gemini-2.0-flash",
            temperature=temperature,
            model_kwargs=model_kwargs,
            max_completion_tokens=8100,
        )

        response = client.invoke(
            prompt + "\nif return code make sure it is executable\n"
        )
        content = json.loads(response.content)

        if "code" in content.keys():
            res = wet_run(content["code"])
            print(res)
            if not res["success"] and (reties < 2):
                chat(
                    prompt=res["message"] + prompt,
                    response_format=response_format,
                    temperature=temperature,
                    reties=reties + 1,
                )

        return json.dumps(content)

    except Exception as e:
        raise Exception(f"與 OpenAI API 互動時發生錯誤: {str(e)}")


def detect_code_language(code: str) -> str:
    """Use LLM to detect programming language"""
    prompt = f"""
    Analyze the following code and determine its programming language.
    Return only "python" or "java".
    If uncertain or if it's another language, return "unknown".
    
    Code:    ```
    {code}    ```
    """

    response = chat(
        prompt=prompt,
        temperature=0,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "LanguageDetectionResponse",
                "schema": {
                    "type": "object",
                    "properties": {
                        "language": {
                            "type": "string",
                            "enum": ["python", "java", "unknown"],
                        },
                    },
                    "required": ["language"],
                },
            },
        },
    )

    result = json.loads(response)
    return result["language"]


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
                "success": False,
                "detected_lang": detected_lang,
            }

        # 根據語言選擇執行方式
        if detected_lang == "python":
            with tempfile.TemporaryDirectory() as temp_dir:
                py_file = os.path.join(temp_dir, "script.py")
                with open(py_file, "w") as f:
                    f.write(code)
                run_result = subprocess.run(
                    ["python3", py_file], capture_output=True, text=True
                )
                success = run_result.returncode == 0
                message = (
                    run_result.stdout if success else f"執行失敗:\n{run_result.stderr}"
                )

        elif detected_lang == "java":
            with tempfile.TemporaryDirectory() as temp_dir:
                java_file = os.path.join(temp_dir, "Main.java")
                with open(java_file, "w") as f:
                    f.write(code)

                compile_result = subprocess.run(
                    ["javac", java_file], capture_output=True, text=True
                )
                if compile_result.returncode != 0:
                    return {
                        "message": f"編譯失敗:\n{compile_result.stderr}",
                        "success": False,
                        "detected_lang": detected_lang,
                    }

                run_result = subprocess.run(
                    ["java", "-cp", temp_dir, "Main"], capture_output=True, text=True
                )
                success = run_result.returncode == 0
                message = (
                    run_result.stdout if success else f"執行失敗:\n{run_result.stderr}"
                )

        return {"message": message, "success": success, "detected_lang": detected_lang}

    except Exception as e:
        return {
            "message": f"執行時發生錯誤: {str(e)}",
            "success": False,
            "detected_lang": "unknown",
        }
