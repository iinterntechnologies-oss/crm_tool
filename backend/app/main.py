from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .settings import settings
from .db import Base, engine
from .routers import auth, clients, customers, goals, leads, stats

app = FastAPI(title="Pulse CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"] ,
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(clients.router)
app.include_router(customers.router)
app.include_router(goals.router)
app.include_router(stats.router)


@app.get("/health")
def health():
    return {"ok": True}
