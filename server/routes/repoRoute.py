from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from models import RepoRequestModel, RepoResponseModel
from models import FileRequestModel, FileResponseModel

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/create-repo", response_model=RepoResponseModel)
async def create_repo(req: RepoRequestModel):
    repo_id = str(uuid.uuid4())
    response = supabase.table("repo").insert({
        "repo_id": repo_id,
        "uid": req.userid,
        "repo_name": req.repository_name
    }).execute()
    if not response.data:  # Check if data was not inserted
        raise HTTPException(status_code=500, detail=f"Failed to create repository: {response}")
    return {"error": False, "repo_id": repo_id}

@router.post("/create-file", response_model=FileResponseModel)
async def create_file(req: FileRequestModel):
    file_id = str(uuid.uuid4())
    response = supabase.table("filesys").insert({
        "file_id": file_id,
        "repo_id": req.repo_id,
        "path": req.path,
        "content": req.content,
        "version": req.version
    }).execute()
    if not response.data:  # Check if data was not inserted
        raise HTTPException(status_code=500, detail=f"Failed to create file: {response}")
    return {"error": False, "file_id": file_id}
