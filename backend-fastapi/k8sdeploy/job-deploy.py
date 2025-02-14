from google.oauth2 import service_account
from google.cloud import container_v1
from kubernetes import client, config
import base64

# Load credentials from file
credentials = service_account.Credentials.from_service_account_file(
    "client_secret.json",
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)

# Get project ID from credentials
project_id = credentials.project_id

# Define Cluster Parameters
cluster_name = "careerhack-cluster-tsid"
zone = "us-central1-a"  # Example: "us-central1-a"

# Initialize Cluster Client
cluster_client = container_v1.ClusterManagerClient(credentials=credentials)

# Fetch Cluster Information
cluster_info = cluster_client.get_cluster(name=f"projects/{project_id}/locations/{zone}/clusters/{cluster_name}")

# Extract Cluster Authentication Data
endpoint = f"https://{cluster_info.endpoint}"
ca_cert = base64.b64decode(cluster_info.master_auth.cluster_ca_certificate).decode("utf-8")

# Manually generate access token
request = credentials.before_request
credentials.refresh(request)
token = credentials.token

# Configure Kubernetes Client
k8s_config = client.Configuration()
k8s_config.host = endpoint
k8s_config.verify_ssl = True
k8s_config.ssl_ca_cert = ca_cert
k8s_config.api_key = {"authorization": f"Bearer {token}"}

# Apply configuration
client.Configuration.set_default(k8s_config)

# Test Kubernetes API
v1 = client.CoreV1Api()
print(v1.list_node())  # List Kubernetes nodes
