from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
import json
from utils.k8s.job import create_configmap_from_file, deploy_job, delete_configmap, load_kube_config
import random
import os
from utils.chat import detect_code_language

router = APIRouter()


class K8sRequest(BaseModel):
    code: str
    language: Literal["python3", "java21"] = None

class K8sResponse(BaseModel):
    status: str
    log: str
    description: str

@router.post("/k8s", response_model=K8sResponse)
def run_code(request: K8sRequest):
    """Runs user-provided code in a Kubernetes job and fetches logs."""

    if not request.language:
        detected_language = detect_code_language(request.code)
        if detected_language.startswith("python"):
            request.language = "python3"
        elif detected_language.startswith("java"):
            request.language = "java21"
        else:
            raise HTTPException(status_code=400, detail="Language not supported")

    load_kube_config()
    configmap_name = f"configmap-{random.randint(1, 1000000000)}"
    
    try:
        filename = create_configmap_from_file(configmap_name, request.code, request.language)


        base_dir = os.path.dirname(os.path.abspath(__file__))  # Get current file's directory
        yaml_file = os.path.join(base_dir, "../../utils/k8s", 
                         "python3-job.yaml" if request.language == "python3" else "java21-job.yaml")

        logs, status = deploy_job(yaml_file, configmap_name, filename, request.language) 
    finally:
        delete_configmap(configmap_name)
    
    return K8sResponse(status=status, log=logs, description=f"Job executed with status: {status}")
