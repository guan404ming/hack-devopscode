import json
import os

import tensorflow as tf

# 🔹 Set input and output directory
DATA_DIR = "./data"  # Directory containing .tfrecord files

# 🔹 Define a function to parse TFRecord examples
def parse_tfrecord_fn(example_proto):
    """Parses a single TFRecord example and extracts 'code' and 'language'."""
    feature_description = {
        "code": tf.io.FixedLenFeature([], tf.string),      # Source code
        "language": tf.io.FixedLenFeature([], tf.string)   # Programming language
    }
    parsed_example = tf.io.parse_single_example(example_proto, feature_description)

    # Convert bytes to string
    return {
        "code": parsed_example["code"].numpy().decode("utf-8"),
        "language": parsed_example["language"].numpy().decode("utf-8")
    }

# 🔹 Process all .tfrecord files in the ./data directory
for file_name in os.listdir(DATA_DIR):
    if file_name.endswith(".tfrecord"):
        tfrecord_path = os.path.join(DATA_DIR, file_name)
        jsonl_path = os.path.join(DATA_DIR, file_name.replace(".tfrecord", ".jsonl"))

        print(f"🔄 Processing: {tfrecord_path} → {jsonl_path}")

        # Read the TFRecord file
        dataset = tf.data.TFRecordDataset(tfrecord_path)

        # Convert and save as JSONL
        with open(jsonl_path, "w", encoding="utf-8") as jsonl_file:
            for raw_record in dataset:
                parsed_data = parse_tfrecord_fn(raw_record)
                jsonl_file.write(json.dumps(parsed_data, ensure_ascii=False) + "\n")

        print(f"✅ Conversion completed: {jsonl_path}")

print("🎉 All .tfrecord files have been converted to .jsonl successfully!")
