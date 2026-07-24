from fastapi import FastAPI 
from app.routes import (
    auth, 
    profile, 
    document,
    chat,
    analytics
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Powered Knowledge Assistant")

#CORS Confurigation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(document.router)
app.include_router(chat.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "message":"API connected successfully!"
    }