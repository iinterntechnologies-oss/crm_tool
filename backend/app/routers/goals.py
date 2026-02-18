from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..deps import get_current_user
from .. import crud, models, schemas

router = APIRouter(prefix="/goals", tags=["goals"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[schemas.GoalOut])
def list_goals(db: Session = Depends(get_db)):
    return crud.list_goals(db)


@router.post("", response_model=schemas.GoalOut)
def create_goal(payload: schemas.GoalCreate, db: Session = Depends(get_db)):
    return crud.create_goal(db, payload)


@router.patch("/{goal_id}", response_model=schemas.GoalOut)
def update_goal(goal_id: str, payload: schemas.GoalUpdate, db: Session = Depends(get_db)):
    goal = db.get(models.Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return crud.update_goal(db, goal, payload)


@router.delete("/{goal_id}")
def delete_goal(goal_id: str, db: Session = Depends(get_db)):
    goal = db.get(models.Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    crud.delete_goal(db, goal)
    return {"ok": True}
