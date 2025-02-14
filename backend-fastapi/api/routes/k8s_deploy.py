from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
import json
from utils.k8s.job import create_configmap_from_file, deploy_job, delete_configmap, load_kube_config
import random
import os

router = APIRouter()


class K8sRequest(BaseModel):
    filename: str # ex. hello.py, hello.java
    code: str
    language: Literal["python3", "java21"]


class K8sResponse(BaseModel):
    status: str
    log: str
    description: str

@router.post("/run", response_model=K8sResponse)
def run_code(request: K8sRequest):
    """Runs user-provided code in a Kubernetes job and fetches logs."""
    load_kube_config()
    filename = request.filename
    configmap_name = f"configmap-{random.randint(1, 1000000000)}"
    
    # Write code to local file
    file_path = f"/tmp/{filename}"
    with open(file_path, "w") as file:
        file.write(request.code)
    
    try:
        create_configmap_from_file(configmap_name, file_path)


        base_dir = os.path.dirname(os.path.abspath(__file__))  # Get current file's directory
        yaml_file = os.path.join(base_dir, "../../utils/k8s", 
                         "python3-job.yaml" if request.language == "python3" else "java21-job.yaml")

        logs, status = deploy_job(yaml_file, configmap_name, filename, request.language)
    finally:
        delete_configmap(configmap_name)
    
    return K8sResponse(status=status, log=logs, description=f"Job executed with status: {status}")
