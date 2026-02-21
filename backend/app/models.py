import uuid
from datetime import date, datetime
from enum import Enum
from sqlalchemy import Boolean, Date, DateTime, Float, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base


class ProjectStage(str, Enum):
    """Enum for project stages in the development lifecycle"""
    DISCOVERY = "Discovery"
    DESIGN = "Design"
    DEVELOPMENT = "Development"
    UAT = "UAT"
    LAUNCHED = "Launched"


def _uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    business_name: Mapped[str] = mapped_column(String(255))
    contact: Mapped[str] = mapped_column(String(255))
    comment: Mapped[str] = mapped_column(String(500), default="")
    status: Mapped[str] = mapped_column(String(20), default="new")


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    business_name: Mapped[str] = mapped_column(String(255))
    business_type: Mapped[str] = mapped_column(String(255))
    contact: Mapped[str] = mapped_column(String(255))
    onboarding: Mapped[date] = mapped_column(Date)
    deadline: Mapped[date] = mapped_column(Date)
    delivery: Mapped[str] = mapped_column(String(255))
    payment_collected: Mapped[float] = mapped_column(Float, default=0)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Technical specifications
    domain_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hosting_provider: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cms_type: Mapped[str | None] = mapped_column(String(100), nullable=True)  # e.g., WordPress, Next.js, Headless
    project_stage: Mapped[ProjectStage] = mapped_column(SQLEnum(ProjectStage), default=ProjectStage.DISCOVERY)
    maintenance_plan: Mapped[bool] = mapped_column(Boolean, default=False)
    renewal_date: Mapped[date | None] = mapped_column(Date, nullable=True)


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    business_name: Mapped[str] = mapped_column(String(255))
    completed_date: Mapped[date] = mapped_column(Date)
    total_paid: Mapped[float] = mapped_column(Float, default=0)
    
    # Technical specifications
    domain_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hosting_provider: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cms_type: Mapped[str | None] = mapped_column(String(100), nullable=True)  # e.g., WordPress, Next.js, Headless
    maintenance_plan: Mapped[bool] = mapped_column(Boolean, default=False)
    renewal_date: Mapped[date | None] = mapped_column(Date, nullable=True)


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    title: Mapped[str] = mapped_column(String(255), default="")
    target_amount: Mapped[float] = mapped_column(Float)
    deadline: Mapped[date] = mapped_column(Date)
    date_started: Mapped[date] = mapped_column(Date)
    date_achieved: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_achieved: Mapped[bool] = mapped_column(Boolean, default=False)


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    activity_type: Mapped[str] = mapped_column(String(50))  # lead_created, client_added, customer_completed, goal_achieved, task_completed
    entity_type: Mapped[str] = mapped_column(String(50))  # lead, client, customer, goal, task
    entity_id: Mapped[str] = mapped_column(String(36))
    entity_name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(500))
    activity_metadata: Mapped[str] = mapped_column(String(1000), default="{}")  # JSON string for additional data
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(1000), default="")
    related_to: Mapped[str] = mapped_column(String(20))  # client, lead, general
    related_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    priority: Mapped[str] = mapped_column(String(20), default="medium")  # low, medium, high, urgent
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, in_progress, completed, cancelled
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    # Task Template Support
    task_template: Mapped[str | None] = mapped_column(String(50), nullable=True)  # e.g., 'onboarding', 'development_checklist'
    service_type: Mapped[str | None] = mapped_column(String(50), nullable=True)  # e.g., 'full_development', 'seo', 'maintenance'
    is_template: Mapped[bool] = mapped_column(Boolean, default=False)


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    content: Mapped[str] = mapped_column(String(2000))
    related_to: Mapped[str] = mapped_column(String(20))  # lead, client
    related_id: Mapped[str] = mapped_column(String(36))
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
