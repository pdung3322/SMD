from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routers.auth import router as auth_router
from backend.api.routers.users import router as user_router


app = FastAPI(
    title="SMD Backend API",
    version="1.0.0"
)

# ===== CORS =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Register routers =====
app.include_router(auth_router)
app.include_router(user_router)

# Principal routes (from backend package)
from backend import router as principal_router
app.include_router(principal_router)