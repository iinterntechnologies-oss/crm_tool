from datetime import date, datetime
from pydantic import BaseModel, EmailStr, field_validator


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    password: str

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
    status: str = "new"


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    business_name: str | None = None
    contact: str | None = None
    comment: str | None = None
    status: str | None = None


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


class ClientOut(ClientBase):
    id: str

    class Config:
        from_attributes = True


class CustomerBase(BaseModel):
    business_name: str
    completed_date: date
    total_paid: float = 0


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    business_name: str | None = None
    completed_date: date | None = None
    total_paid: float | None = None


class CustomerOut(CustomerBase):
    id: str

    class Config:
        from_attributes = True


class GoalBase(BaseModel):
    target_amount: float
    deadline: date
    date_started: date
    date_achieved: date | None = None
    is_achieved: bool = False


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
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
