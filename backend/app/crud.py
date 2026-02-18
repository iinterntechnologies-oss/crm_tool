from datetime import date, timedelta
from sqlalchemy.orm import Session
from . import models
from .auth import get_password_hash


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, email: str, password: str):
    user = models.User(email=email, password_hash=get_password_hash(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def list_leads(db: Session):
    return db.query(models.Lead).all()


def create_lead(db: Session, payload):
    lead = models.Lead(**payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


def update_lead(db: Session, lead: models.Lead, payload):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(lead, key, value)
    db.commit()
    db.refresh(lead)
    return lead


def delete_lead(db: Session, lead: models.Lead):
    db.delete(lead)
    db.commit()


def list_clients(db: Session):
    return db.query(models.Client).all()


def create_client(db: Session, payload):
    client = models.Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def update_client(db: Session, client: models.Client, payload):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client


def delete_client(db: Session, client: models.Client):
    db.delete(client)
    db.commit()


def list_customers(db: Session):
    return db.query(models.Customer).all()


def create_customer(db: Session, payload):
    customer = models.Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def update_customer(db: Session, customer: models.Customer, payload):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(customer, key, value)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer: models.Customer):
    db.delete(customer)
    db.commit()


def list_goals(db: Session):
    return db.query(models.Goal).order_by(models.Goal.date_started.desc()).all()


def create_goal(db: Session, payload):
    goal = models.Goal(**payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


def update_goal(db: Session, goal: models.Goal, payload):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(goal, key, value)
    db.commit()
    db.refresh(goal)
    return goal


def delete_goal(db: Session, goal: models.Goal):
    db.delete(goal)
    db.commit()


def build_stats(db: Session):
    total_leads = db.query(models.Lead).count()
    active_projects = db.query(models.Client).count()
    revenue = sum(c.payment_collected for c in db.query(models.Client).all()) + sum(
        c.total_paid for c in db.query(models.Customer).all()
    )
    upcoming = date.today() + timedelta(days=7)
    deadlines = db.query(models.Client).filter(models.Client.deadline < upcoming).count()
    return {
        "total_leads": total_leads,
        "active_projects": active_projects,
        "revenue": revenue,
        "deadlines": deadlines,
    }
