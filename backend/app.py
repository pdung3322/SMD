from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routers.auth import router as auth_router
from backend.api.routers.users import router as user_router
from backend.api.routers.permissions import router as permission_router
from backend.api.routers.user_permissions import router as user_permission_router
from backend.api.routers.syllabus_list import router as syllabus_list_router
from backend.api.routers.course_materials import router as course_materials_router
from backend.api.routers.academic import router as academic_router

app = FastAPI(
    title="SMD Backend API",
    version="1.0.0"
)

# ===== CORS =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Register routers =====
app.include_router(auth_router)
app.include_router(user_router, prefix="/api")
app.include_router(permission_router, prefix="/api")   # ✅ FIX
app.include_router(user_permission_router, prefix="/api")
app.include_router(syllabus_list_router)
app.include_router(course_materials_router)
app.include_router(academic_router)
