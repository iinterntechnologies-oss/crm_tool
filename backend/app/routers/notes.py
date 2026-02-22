from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .. import crud, schemas, models
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("", response_model=list[schemas.NoteOut])
def list_notes(
    related_to: str = Query(..., description="Entity type: 'lead' or 'client'"),
    related_id: str | None = Query(None, description="Optional: specific entity ID to filter by"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.list_notes(db, related_to=related_to, related_id=related_id)


@router.post("", response_model=schemas.NoteOut)
def create_note(
    payload: schemas.NoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_note(db, payload)


@router.patch("/{note_id}", response_model=schemas.NoteOut)
def update_note(
    note_id: str,
    payload: schemas.NoteUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    note = crud.get_note_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return crud.update_note(db, note, payload)


@router.delete("/{note_id}")
def delete_note(
    note_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    note = crud.get_note_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    crud.delete_note(db, note)
    return {"ok": True}
