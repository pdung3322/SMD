from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import backend.infrastructure.models
from backend.api.routers.auth import router as auth_router
from backend.api.routers.users import router as user_router
from backend.api.routers.permissions import router as permission_router
from backend.api.routers.user_permissions import router as user_permission_router
from backend.api.routers.academic import router as academic_router
from backend.api.routers.training_programs import router as training_programs_router
from backend.api.routers.course_relations import router as course_relations_router
from backend.api.routers.courses import router as courses_router
from fastapi.staticfiles import StaticFiles

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
app.include_router(academic_router)
app.include_router(training_programs_router)
app.include_router(courses_router, prefix="/api")
app.include_router(course_relations_router, prefix="/api")
app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")
