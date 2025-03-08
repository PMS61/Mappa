from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import logging
from models.scheduleModel import ScheduleRequestModel, ScheduleResponseModel, GetScheduleRequestModel

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logging.basicConfig(level=logging.INFO)

@router.post("/set_schedule", response_model=ScheduleResponseModel)
async def set_schedule(req: ScheduleRequestModel):
    logging.info(f"Setting schedule for repo_id: {req.repo_id}, name: {req.name}, date: {req.date}, time: {req.time}")
    try:
        response = supabase.table("scheduler").insert({
            "repo_id": req.repo_id,
            "name": req.name,
            "date": req.date,
            "time": req.time
        }).execute()
        logging.info(f"Supabase response: {response}")
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to set schedule")
        return {
            "error": False,
            "message": "Schedule set successfully",
            "name": req.name,
            "date": req.date,
            "time": req.time
        }
    except Exception as e:
        logging.error(f"Error setting schedule: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/get_schedule", response_model=list[ScheduleResponseModel])
async def get_schedule(req: GetScheduleRequestModel):
    logging.info(f"Getting schedule for repo_id: {req.repo_id}")
    try:
        response = supabase.table("scheduler").select("name, date, time").eq("repo_id", req.repo_id).execute()
        logging.info(f"Supabase response: {response}")
        if not response.data:
            raise HTTPException(status_code=404, detail="No schedules found for the given repo_id")
        schedules = response.data
        return [
            {
                "error": False,
                "message": "Schedule retrieved successfully",
                "name": schedule["name"],
                "date": schedule["date"],
                "time": schedule["time"]
            }
            for schedule in schedules
        ]
    except Exception as e:
        logging.error(f"Error getting schedule: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
