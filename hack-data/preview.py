import textwrap

import tensorflow as tf

# 🔹 Set the paths to the TFRecord files
JAVA_TFRECORD_FILE = "./data/java_programs_train.tfrecord"
PYTHON_TFRECORD_FILE = "./data/python_programs_train.tfrecord"

# 🔹 Function to parse a TFRecord example
def parse_tfrecord_fn(example_proto):
    """Parses a single TFRecord example and returns a dictionary."""
    feature_description = {
        "code": tf.io.FixedLenFeature([], tf.string),      # Source code
        "language": tf.io.FixedLenFeature([], tf.string)   # Programming language
    }
    parsed_example = tf.io.parse_single_example(example_proto, feature_description)

    return {
        "code": parsed_example["code"].numpy().decode("utf-8"),
        "language": parsed_example["language"].numpy().decode("utf-8")
    }

# 🔹 Load both TFRecord datasets
java_dataset = tf.data.TFRecordDataset(JAVA_TFRECORD_FILE)
python_dataset = tf.data.TFRecordDataset(PYTHON_TFRECORD_FILE)

# 🔹 Pretty print function
def pretty_print(java_code, python_code, index):
    """Formats Java and Python code for side-by-side display."""
    java_lines = textwrap.wrap(java_code, width=50) or [""]
    python_lines = textwrap.wrap(python_code, width=50) or [""]

    max_lines = max(len(java_lines), len(python_lines))

    print(f"\n🔹 Record {index + 1}:")
    print("=" * 110)
    for i in range(max_lines):
        py_line = python_lines[i] if i < len(python_lines) else ""
        java_line = java_lines[i] if i < len(java_lines) else ""
        print(f"{py_line:<50} | {java_line}")

# 🔹 Print the first 10 records side by side
print("\n🔍 First 10 records from both Java & Python TFRecord files:\n")

TAKE = 1000

for i, (java_record, python_record) in enumerate(zip(java_dataset.take(TAKE), python_dataset.take(TAKE))):
    java_data = parse_tfrecord_fn(java_record)
    python_data = parse_tfrecord_fn(python_record)
    pretty_print(java_data["code"], python_data["code"], i)

print("\n✅ Done! Check the output above to verify the data format.")
