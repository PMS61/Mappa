from fastapi import APIRouter, HTTPException, Request
from supabase import create_client, Client
import os
import uuid
from models import PostVersionModel, GetVersionModel, GetVersionResponseModel, ReadVersionModel, ReadVersionResponseModel
from auth import jwt_decode
import logging

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logger = logging.getLogger(__name__)

@router.post("/post-version")
async def post_version(req: PostVersionModel, request: Request):
    try:
        # Log the incoming request data
        logger.info(f"Received request: {await request.json()}")

        # Get the latest version
        latest_version = supabase.table("versions").select("version") \
            .eq("repo_id", req.repo_id).order("version", desc=True).limit(1).execute()
        
        new_version = (latest_version.data[0]["version"] + 1) if latest_version.data else 1

        # Insert new version entry
        response = supabase.table("versions").insert({
            "id": str(uuid.uuid4()),  # Generate a unique ID
            "repo_id": req.repo_id,
            "version": new_version,
            "uid": req.uid,
            "commit": req.commit
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create version")

        # Insert files for the new version
        file_entries = [{"repo_id": req.repo_id, "version": new_version, "path": file.path, "content": file.content} for file in req.files]

        if file_entries:
            supabase.table("files").insert(file_entries).execute()

        return {"error": False}
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        raise HTTPException(status_code=400, detail="Bad Request")

@router.post("/get-version", response_model=GetVersionResponseModel)
async def get_version(req: GetVersionModel):
    print(req.repo_id)
    response = supabase.table("versions").select("version", "uid", "commit").eq("repo_id", req.repo_id).order("version").execute()

    print(response.data)
    if not response.data:
        return {"error": True, "versions": []}

    return {"error": False, "versions": response.data}

@router.post("/read-version", response_model=ReadVersionResponseModel)
async def read_version(req: ReadVersionModel):
    response = supabase.table("files").select("path", "content").eq("repo_id", req.repo_id).eq("version", req.version).execute()

    if not response.data:
        return {"error": True, "files": []}

    return {"error": False, "files": response.data}
