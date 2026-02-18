from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..deps import get_current_user
from ..crud import build_stats
from ..schemas import StatsOut

router = APIRouter(prefix="/stats", tags=["stats"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    return build_stats(db)
