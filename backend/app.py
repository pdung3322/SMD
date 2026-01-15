from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routers.auth import router as auth_router
from backend.api.routers.users import router as user_router
from backend.api.routers.permissions import router as permission_router
from backend.api.routers.user_permissions import router as user_permission_router
from backend.api.routers import syllabus
from backend.api.routers import course_materials

app = FastAPI(
    title="SMD Backend API",
    version="1.0.0"
)

# ===== CORS =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Register routers =====
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(permission_router)
app.include_router(user_permission_router)
app.include_router(syllabus.router)
app.include_router(course_materials.router)
