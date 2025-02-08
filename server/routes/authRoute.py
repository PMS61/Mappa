from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
from auth import hashed_pass, verify_hash_pass, jwt_encode
import uuid
from models import userReqMod,userResMod

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/login", response_model=userResMod)
async def login(req: userReqMod):
    response = supabase.table("login").select("uid, password").eq("email", req.email).single().execute()
    if response.data:
        user = response.data
        if verify_hash_pass(req.password, user["password"]):
            token = jwt_encode(user["uid"])
            return {"error": False, "token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/register", response_model=userResMod)
async def register(req: userReqMod):
    response = supabase.table("login").select("uid").eq("email", req.email).execute()
    if response.data:
        raise HTTPException(status_code=400, detail="User already exists")
    hash_pass = hashed_pass(req.password)
    response = supabase.table("login").insert({
        "uid": str(uuid.uuid4()),
        "email": req.email,
        "password": hash_pass
    }).execute()
    user_id = response.data[0]["uid"]
    token = jwt_encode(user_id)
    return {"error": False, "token": token}
