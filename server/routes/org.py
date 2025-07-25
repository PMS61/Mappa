from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from models import OrgReq, OrgRes, OrgByUIDRequest, OrgByUIDResponse, OrgInfo
from uuid import UUID

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/add-org/", response_model=OrgRes)
async def add_org(req: OrgReq):
    org_data = {}
    if req.admin:
        org_id = uuid.uuid4()
        org_data = {
            "org_id": str(org_id),
            "org_name": req.org_name,
            "uid": str(req.uid)
        }
    else:
        user_response = supabase.table("users").select("*").eq("username", req.username).execute()

        if not user_response.data:  # Check if user does not exist
            raise HTTPException(status_code=404, detail="User not found")

        user = user_response.data[0]
        uid = user["uid"]
        org_data = {
            "org_id": str(req.org_id),
            "org_name": req.org_name,
            "uid": str(uid)
        }
    response = supabase.table("organisations").insert(org_data).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to add organization")
    return {"org_id": str(org_data["org_id"]), "org_name": req.org_name, "error": False}

@router.post("/get-orgs-by-uid/", response_model=OrgByUIDResponse)
async def get_orgs_by_uid(req: OrgByUIDRequest):
    try:
        response = supabase.table("organisations").select("org_id, org_name").eq("uid", str(req.uid)).execute()
        if not response.data:
            # Return a custom response with error=True if no organizations are found
            return {"orgs": [], "error": True, "detail": "No organizations found for the given UID"}
        orgs = [OrgInfo(org_id=UUID(org["org_id"]), org_name=org["org_name"]) for org in response.data]
        return {"orgs": orgs, "error": False}
    except Exception as e:
        # Log the error and return a response with error: true
        return {"orgs": [], "error": True, "detail": str(e)}