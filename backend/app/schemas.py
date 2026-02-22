from datetime import date, datetime
from pydantic import BaseModel, EmailStr, field_validator
from .models import ProjectStage, LeadStatus


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: str  # Changed from EmailStr to str for flexibility with .local domains
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        # Simple email validation that accepts .local domains
        if "@" not in value or not value.count("@") == 1:
            raise ValueError("Invalid email format")
        local, domain = value.split("@")
        if not local or not domain or "." not in domain:
            raise ValueError("Invalid email format: domain must have at least one dot")
        return value

    @field_validator("password")
    @classmethod
    def password_max_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be 72 bytes or fewer")
        return value


class UserOut(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class LeadBase(BaseModel):
    business_name: str
    contact: str
    comment: str = ""
    status: LeadStatus = LeadStatus.NEW


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    business_name: str | None = None
    contact: str | None = None
    comment: str | None = None
    status: LeadStatus | None = None


class LeadOut(LeadBase):
    id: str

    class Config:
        from_attributes = True


class ClientBase(BaseModel):
    business_name: str
    business_type: str
    contact: str
    onboarding: date
    deadline: date
    delivery: str
    payment_collected: float = 0
    is_completed: bool = False
    # Technical specifications
    domain_name: str | None = None
    hosting_provider: str | None = None
    cms_type: str | None = None
    project_stage: ProjectStage = ProjectStage.DISCOVERY
    maintenance_plan: bool = False
    renewal_date: date | None = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    business_name: str | None = None
    business_type: str | None = None
    contact: str | None = None
    onboarding: date | None = None
    deadline: date | None = None
    delivery: str | None = None
    payment_collected: float | None = None
    is_completed: bool | None = None
    # Technical specifications
    domain_name: str | None = None
    hosting_provider: str | None = None
    cms_type: str | None = None
    project_stage: ProjectStage | None = None
    maintenance_plan: bool | None = None
    renewal_date: date | None = None


class ClientOut(ClientBase):
    id: str

    class Config:
        from_attributes = True


class CustomerBase(BaseModel):
    business_name: str
    completed_date: date
    total_paid: float = 0
    # Technical specifications
    domain_name: str | None = None
    hosting_provider: str | None = None
    cms_type: str | None = None
    maintenance_plan: bool = False
    renewal_date: date | None = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    business_name: str | None = None
    completed_date: date | None = None
    total_paid: float | None = None
    # Technical specifications
    domain_name: str | None = None
    hosting_provider: str | None = None
    cms_type: str | None = None
    maintenance_plan: bool | None = None
    renewal_date: date | None = None


class CustomerOut(CustomerBase):
    id: str

    class Config:
        from_attributes = True


class GoalBase(BaseModel):
    title: str = "Revenue Goal"
    target_amount: float
    deadline: date
    date_started: date
    date_achieved: date | None = None
    is_achieved: bool = False


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: str | None = None
    target_amount: float | None = None
    deadline: date | None = None
    date_started: date | None = None
    date_achieved: date | None = None
    is_achieved: bool | None = None


class GoalOut(GoalBase):
    id: str

    class Config:
        from_attributes = True


class StatsOut(BaseModel):
    total_leads: int
    active_projects: int
    revenue: float
    deadlines: int


class ActivityBase(BaseModel):
    activity_type: str
    entity_type: str
    entity_id: str
    entity_name: str
    description: str
    activity_metadata: str = "{}"


class ActivityCreate(ActivityBase):
    pass


class ActivityOut(ActivityBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    title: str
    description: str = ""
    related_to: str
    related_id: str | None = None
    priority: str = "medium"
    status: str = "pending"
    due_date: date | None = None
    task_template: str | None = None
    service_type: str | None = None
    is_template: bool = False


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    related_to: str | None = None
    related_id: str | None = None
    priority: str | None = None
    status: str | None = None
    due_date: date | None = None
    completed_at: datetime | None = None
    task_template: str | None = None
    service_type: str | None = None
    is_template: bool | None = None


class TaskOut(TaskBase):
    id: str
    completed_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


class NoteBase(BaseModel):
    content: str
    related_to: str
    related_id: str
    is_pinned: bool = False


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    content: str | None = None
    is_pinned: bool | None = None


class NoteOut(NoteBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
