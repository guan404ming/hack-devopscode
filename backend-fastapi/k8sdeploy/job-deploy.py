import yaml
import time
from kubernetes import client, config

def load_kube_config():
    """Load Kubernetes config."""
    try:
        config.load_kube_config()  # Use local kubeconfig
    except:
        config.load_incluster_config()  # Use in-cluster config if running inside GKE

def deploy_job(yaml_file):
    """Deploy a job from a YAML file to the GKE cluster and fetch logs."""
    with open(yaml_file, "r") as file:
        job_manifest = yaml.safe_load(file)

    api_instance = client.BatchV1Api()
    core_api = client.CoreV1Api()
    namespace = job_manifest["metadata"].get("namespace", "default")
    job_name = job_manifest["metadata"]["name"]

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

if __name__ == "__main__":
    load_kube_config()
    deploy_job("python3-job.yaml")  # Replace with your YAML file path