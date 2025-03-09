import os
import subprocess
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.roomRoute import router as room_router
from routes.accessRoute import router as access_router
from routes.authRoute import router as auth_router
from routes.repoRoute import router as repo_router
from routes.allRepos import router as arepo_router
from routes.addCollab import router as addCollab_router
from routes.versionRoute import router as version_router
from routes.org import router as org
from routes.chatRoute import router as chat_router
from routes.scheduleRoute import router as schedule_router

load_dotenv()  # Ensure this is called to load environment variables

app = FastAPI()

allowed_origin = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(repo_router, prefix="/repo")
app.include_router(arepo_router, prefix="/repo")
app.include_router(room_router, prefix="/room")
app.include_router(access_router, prefix="/access")
app.include_router(addCollab_router, prefix="/repo")
app.include_router(version_router, prefix="/version")
app.include_router(schedule_router, prefix="/schedule")
app.include_router(org, prefix="/org")
app.include_router(chat_router, prefix="/api")

@app.post("/run-script")
async def run_script(request: Request):
    data = await request.json()
    script_content = data.get("script", "")
    language = data.get("language", "python")

    command = {
        "python": ["python3", "-c", script_content],
        "javascript": ["node", "-e", script_content],
        "bash": ["bash", "-c", script_content]
    }.get(language, ["python3", "-c", script_content])

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        return {"output": result.stdout}
    except subprocess.CalledProcessError as e:
        return {"output": e.stderr}

@app.post("/run-beta-script")
async def run_beta_script(request: Request):
    beta_script = request.cookies.get("beta", "")
    language = request.cookies.get("language", "python")

    command = {
        "python": ["python3", "-c", beta_script],
        "javascript": ["node", "-e", beta_script],
        "bash": ["bash", "-c", beta_script]
    }.get(language, ["python3", "-c", beta_script])

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        return {"output": result.stdout}
    except subprocess.CalledProcessError as e:
        return {"output": e.stderr}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
