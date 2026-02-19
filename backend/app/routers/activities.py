from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, models
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("", response_model=list[schemas.ActivityOut])
def list_activities(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.list_activities(db, limit=limit)


@router.post("", response_model=schemas.ActivityOut)
def create_activity(
    payload: schemas.ActivityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_activity(db, payload)


@router.delete("/{activity_id}")
def delete_activity(
    activity_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    crud.delete_activity(db, activity)
    return {"ok": True}
