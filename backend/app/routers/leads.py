from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..deps import get_current_user
from .. import crud, models, schemas

router = APIRouter(prefix="/leads", tags=["leads"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[schemas.LeadOut])
def list_leads(db: Session = Depends(get_db)):
    return crud.list_leads(db)


@router.post("", response_model=schemas.LeadOut)
def create_lead(payload: schemas.LeadCreate, db: Session = Depends(get_db)):
    return crud.create_lead(db, payload)


@router.patch("/{lead_id}", response_model=schemas.LeadOut)
def update_lead(lead_id: str, payload: schemas.LeadUpdate, db: Session = Depends(get_db)):
    lead = db.get(models.Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return crud.update_lead(db, lead, payload)


@router.delete("/{lead_id}")
def delete_lead(lead_id: str, db: Session = Depends(get_db)):
    lead = db.get(models.Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    crud.delete_lead(db, lead)
    return {"ok": True}
