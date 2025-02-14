import yaml
import time
from kubernetes import client, config
from pathlib import Path
import random
import re
import os

def load_kube_config():
    """Load Kubernetes config."""
    try:
        config.load_kube_config()  # Use local kubeconfig
    except:
        config.load_incluster_config()  # Use in-cluster config if running inside GKE

def create_configmap_from_file(configmap_name: str, code_content, language: str):
    """
    Creates a Kubernetes ConfigMap from a given file.

    :param configmap_name: Name of the ConfigMap
    :param file_path: Path to the file to be stored in the ConfigMap
    :param language: Language of the file (default: "python")
    """
    load_kube_config()
    if language == "python3":
        filename = "user_code.py"
    elif language == "java21":
        class_pattern = r"public\s+class\s+(\w+)"
        match = re.search(class_pattern, code_content)
        class_name = match.group(1)
        filename = f"{class_name}.java"

    # Define the ConfigMap object
    configmap = client.V1ConfigMap(
        metadata=client.V1ObjectMeta(name=configmap_name),
        data={filename: code_content}  # Use filename as the key
    )

    # Connect to Kubernetes API
    v1 = client.CoreV1Api()

    try:
        v1.create_namespaced_config_map(namespace="default", body=configmap)
        print(f"ConfigMap '{configmap_name}' created successfully in namespace default.")
    except client.exceptions.ApiException as e:
        if e.status == 409:  # Conflict: ConfigMap already exists
            print(f"ConfigMap '{configmap_name}' already exists.")
        else:
            print(f"Error: {e}")
    
    return filename

def deploy_job(yaml_file, new_configmap_name, code_filename, language):
    load_kube_config()
    """Deploy a job from a YAML file to the GKE cluster and fetch logs."""
    with open(yaml_file, "r") as file:
        job_manifest = yaml.safe_load(file)

    api_instance = client.BatchV1Api()
    core_api = client.CoreV1Api()
    namespace = job_manifest["metadata"].get("namespace", "default")
    job_manifest["metadata"]["name"] = f"{job_manifest['metadata']['name']}-{random.randint(1, 1000000000)}"
    job_name = job_manifest["metadata"]["name"]
    job_manifest["spec"]["template"]["spec"]["volumes"][0]["configMap"]["name"] = new_configmap_name

    # set command based on language
    if language == "python3":
        job_manifest["spec"]["template"]["spec"]["containers"][0]["command"] = ["python3", f"/mnt/config/{code_filename}"]
    elif language == "java21":
        compiled_filename = code_filename.split(".")[0]
        job_manifest["spec"]["template"]["spec"]["containers"][0]["command"] = [
            "/bin/sh", "-c",
            f"cp /mnt/config/{code_filename} /tmp/ && cd /tmp/ && javac {code_filename} && java {compiled_filename}"
        ]

    # Create the job
    response = api_instance.create_namespaced_job(
        body=job_manifest, namespace=namespace
    )
    print(f"Job {job_name} created in namespace {namespace}")

    # Wait for the job to start and get pod name
    pod_name = None
    while not pod_name:
        time.sleep(2)
        pod_list = core_api.list_namespaced_pod(namespace, label_selector=f"job-name={job_name}")
        if pod_list.items:
            pod_name = pod_list.items[0].metadata.name
    
    print(f"Pod {pod_name} found for job {job_name}")

    # Wait for pod to complete
    while True:
        pod_status = core_api.read_namespaced_pod_status(pod_name, namespace)
        phase = pod_status.status.phase
        if phase in ["Succeeded", "Failed"]:
            break
        time.sleep(2)

    print(f"Pod {pod_name} finished with status: {phase}")

    # Fetch and print logs
    logs = core_api.read_namespaced_pod_log(name=pod_name, namespace=namespace)
    print(f"Logs from {pod_name}:\n{logs}")

    return logs, phase

def delete_configmap(configmap_name: str):
    """
    Deletes a ConfigMap from a Kubernetes cluster.

    :param configmap_name: Name of the ConfigMap to delete.
    :param namespace: Namespace where the ConfigMap exists (default: "default").
    """
    load_kube_config()
    # Connect to Kubernetes API
    v1 = client.CoreV1Api()

    try:
        v1.delete_namespaced_config_map(name=configmap_name, namespace="default")
        print(f"ConfigMap '{configmap_name}' deleted successfully from namespace default.")
    except client.exceptions.ApiException as e:
        if e.status == 404:  # ConfigMap not found
            print(f"ConfigMap '{configmap_name}' not found in namespace default.")
        else:
            print(f"Error deleting ConfigMap: {e}")

# Example Usage:
# delete_configmap("my-config")

if __name__ == "__main__":
    print("Running job.py")
    # load_kube_config()
    # Example for Python job
    # configmap_name_python = create_configmap_from_file("hello-1-job", code_content, language="python")
    # print(f"ConfigMap name: {configmap_name_python}")
    # deploy_job("python3-job.yaml", configmap_name_python, code_content, language="python")
    # delete_configmap(configmap_name_python)

    # # Example for Java job
    # java_code_filename = "hello.java"
    # configmap_name_java = create_configmap_from_file("hello-1-java-job", java_code_filename, language="java")
    # print(f"ConfigMap name: {configmap_name_java}")
    # deploy_job("java21-job.yaml", configmap_name_java, java_code_filename, language="java")
    # delete_configmap(configmap_name_java)