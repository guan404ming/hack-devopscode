import yaml
from kubernetes import client, config

def load_kube_config():
    """Load Kubernetes config and use GKE auth plugin."""
    try:
        # Use the GKE authentication plugin
        import os
        os.environ["USE_GKE_GCLOUD_AUTH_PLUGIN"] = "True"

        config.load_kube_config()
        print("Kube config loaded successfully.")
    except Exception as e:
        print(f"Failed to load kube config: {e}")
        config.load_incluster_config()

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
    deploy_job("job.yaml")  # Replace with your YAML file path
