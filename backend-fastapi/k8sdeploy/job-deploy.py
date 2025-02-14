import yaml
from kubernetes import client, config

def load_kube_config():
    """Load Kubernetes config."""
    try:
        config.load_kube_config()  # Use local kubeconfig
    except:
        config.load_incluster_config()  # Use in-cluster config if running inside GKE

def deploy_job(yaml_file):
    """Deploy a job from a YAML file to the GKE cluster."""
    with open(yaml_file, "r") as file:
        job_manifest = yaml.safe_load(file)

    api_instance = client.BatchV1Api()
    namespace = job_manifest["metadata"].get("namespace", "default")

    response = api_instance.create_namespaced_job(
        body=job_manifest, namespace=namespace
    )
    print(f"Job {job_manifest['metadata']['name']} created in namespace {namespace}")

if __name__ == "__main__":
    load_kube_config()
    deploy_job("python3-job.yaml")  # Replace with your YAML file path
