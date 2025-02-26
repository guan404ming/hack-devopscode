import json
import os

PREFIXES = ['train', 'valid']

# 檔案處理函數
def process_files(prefix):
    java_file = f"../CoTran/AVATAR-TC/{prefix}.java-python.java"
    python_file = f"../CoTran/AVATAR-TC/{prefix}.java-python.python"
    output_file = f"./output/{prefix}.jsonl"
    
    def replace_special_tokens(code):
        return code.replace("NEW_LINE", "\n").replace("INDENT", "    ").replace("DEDENT", "")

    # 讀取檔案
    with open(java_file, "r", encoding="utf-8") as f_java, open(python_file, "r", encoding="utf-8") as f_python:
        java_lines = f_java.readlines()
        python_lines = f_python.readlines()

    # 確保行數一致
    assert len(java_lines) == len(python_lines), f"Error: {java_file} 和 {python_file} 的行數不一致"

    # 生成 jsonl 格式
    with open(output_file, "w", encoding="utf-8") as f_out:
        for java_code, python_code in zip(java_lines, python_lines):
            java_code = java_code.strip()
            python_code = replace_special_tokens(python_code.strip())
            
            system_instruction = {
                "role": "user",
                "parts": [{
                    "text": "You are an expert software engineer fluent in both Java and Python. Your task is to precisely translate and optimize code between these languages while ensuring clarity and efficiency. Follow best practices and consider performance implications.\n"
                            "Conversion Requirements:\n"
                            "1️⃣ Maintain the same functionality and logic\n"
                            "2️⃣ Use idiomatic patterns and best practices of the target language\n"
                            "3️⃣ Ensure the converted code is executable\n"
                            "4️⃣ Provide any language-specific considerations\n"
                            "5️⃣ Note potential compatibility issues"
                }]
            }
            
            # 第一組 (Java -> Python)
            java_prompt = "Translate the following Java code to Python:\n" + java_code
            json.dump({
                'systemInstruction': system_instruction,
                "contents": [
                    {"role": "user", "parts": [{"text": java_prompt}]},
                    {"role": "model", "parts": [{"text": python_code}]}
                ]
            }, f_out, ensure_ascii=False)
            f_out.write("\n")
            
            # 第二組 (Python -> Java)
            python_prompt = "Translate the following Python code to Java:\n" + python_code
            json.dump({
                'systemInstruction': system_instruction,
                "contents": [
                    {"role": "user", "parts": [{"text": python_prompt}]},
                    {"role": "model", "parts": [{"text": java_code}]}
                ]
            }, f_out, ensure_ascii=False)
            f_out.write("\n")
    
    print(f"合併完成，輸出檔案: {output_file}")

# 依次處理所有 PREFIXES
for prefix in PREFIXES:
    process_files(prefix)

