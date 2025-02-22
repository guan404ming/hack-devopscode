import json
import os

# 🔹 Set the data directory
DATA_DIR = "./data"

# 🔹 Define file groups to process
FILE_SUFFIXES = ["train", "valid", "test"]  # Process *_train.jsonl, *_valid.jsonl, *_test.jsonl
LANGUAGES = ["python", "java"]  # Supported languages

# 🔹 Function to merge language pairs
def merge_language_pairs(file_suffix):
    """
    Merges the Python and Java dataset into a bilingual translation dataset.
    Generates both Python -> Java and Java -> Python examples.
    """
    python_file = os.path.join(DATA_DIR, f"python_programs_{file_suffix}.jsonl")
    java_file = os.path.join(DATA_DIR, f"java_programs_{file_suffix}.jsonl")
    output_file = os.path.join(DATA_DIR, f"{file_suffix}.jsonl")

    if not os.path.exists(python_file) or not os.path.exists(java_file):
        print(f"❌ Skipping {file_suffix}: Missing one of the files.")
        return

    print(f"🔄 Processing: {python_file} + {java_file} → {output_file}")

    # Read Python & Java files
    with open(python_file, "r", encoding="utf-8") as py_f, open(java_file, "r", encoding="utf-8") as java_f:
        python_data = [json.loads(line) for line in py_f]
        java_data = [json.loads(line) for line in java_f]

    # Ensure both files have the same number of examples
    assert len(python_data) == len(java_data), "Mismatch in dataset sizes!"

    # Create new bilingual dataset
    merged_data = []

    for py_entry, java_entry in zip(python_data, java_data):
        merged_data.append({"input_text": py_entry["code"], "output_text": java_entry["code"]})  # Python → Java
        merged_data.append({"input_text": java_entry["code"], "output_text": py_entry["code"]})  # Java → Python

    # Save the merged dataset
    with open(output_file, "w", encoding="utf-8") as out_f:
        for entry in merged_data:
            out_f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    print(f"✅ Merged dataset saved: {output_file}")

# 🔹 Process train, valid, and test sets
for suffix in FILE_SUFFIXES:
    merge_language_pairs(suffix)

print("🎉 All datasets merged successfully!")
