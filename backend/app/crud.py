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


def get_client_by_id(db: Session, client_id: str):
    return db.query(models.Client).filter(models.Client.id == client_id).first()


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


# Activity CRUD
def list_activities(db: Session, limit: int = 50):
    return db.query(models.Activity).order_by(models.Activity.created_at.desc()).limit(limit).all()


def create_activity(db: Session, payload):
    activity = models.Activity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


def delete_activity(db: Session, activity: models.Activity):
    db.delete(activity)
    db.commit()


# Task CRUD
def list_tasks(db: Session):
    return db.query(models.Task).order_by(models.Task.created_at.desc()).all()


def get_task_by_id(db: Session, task_id: str):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def create_task(db: Session, payload):
    task_data = payload.model_dump()
    task = models.Task(**task_data)
    
    # Set appropriate ForeignKey based on related_to field
    if task.related_to == "client" and task.related_id:
        task.client_id = task.related_id
    elif task.related_to == "lead" and task.related_id:
        task.lead_id = task.related_id
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: models.Task, payload):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    
    # Update ForeignKey columns if related_to or related_id changed
    if "related_to" in payload.model_dump() or "related_id" in payload.model_dump():
        task.client_id = None
        task.lead_id = None
        if task.related_to == "client" and task.related_id:
            task.client_id = task.related_id
        elif task.related_to == "lead" and task.related_id:
            task.lead_id = task.related_id
    
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: models.Task):
    db.delete(task)
    db.commit()


# Note CRUD
def list_notes(db: Session, related_to: str, related_id: str | None = None):
    """List notes filtered by entity type. Requires related_to parameter for safety and performance.
    
    Args:
        db: Database session
        related_to: Entity type ('lead', 'client'). Required to prevent fetching all notes.
        related_id: Optional specific entity ID to filter by
    """
    query = db.query(models.Note).order_by(models.Note.is_pinned.desc(), models.Note.created_at.desc())
    query = query.filter(models.Note.related_to == related_to)
    if related_id:
        query = query.filter(models.Note.related_id == related_id)
    return query.all()


def get_note_by_id(db: Session, note_id: str):
    return db.query(models.Note).filter(models.Note.id == note_id).first()


def create_note(db: Session, payload):
    note_data = payload.model_dump()
    note = models.Note(**note_data)
    
    # Set appropriate ForeignKey based on related_to field
    if note.related_to == "client" and note.related_id:
        note.client_id = note.related_id
    elif note.related_to == "lead" and note.related_id:
        note.lead_id = note.related_id
    
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(db: Session, note: models.Note, payload):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(note, key, value)
    
    # Update ForeignKey columns if related_to or related_id changed
    if "related_to" in payload.model_dump() or "related_id" in payload.model_dump():
        note.client_id = None
        note.lead_id = None
        if note.related_to == "client" and note.related_id:
            note.client_id = note.related_id
        elif note.related_to == "lead" and note.related_id:
            note.lead_id = note.related_id
    
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note: models.Note):
    db.delete(note)
    db.commit()
