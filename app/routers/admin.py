from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Path, status
from ..models import Todos, Users
from ..database import SessionLocal
from .auth import get_current_user

router = APIRouter(prefix='/admin', tags=['admin'])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

def check_if_admin(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication Failed')
    if user.get('user_role') != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='You must be an admin to visit this page')

@router.get("/todo", status_code=status.HTTP_200_OK)
def read_all_todos(user: user_dependency, db: db_dependency):
    check_if_admin(user)
    return db.query(Todos).all()

@router.delete("/todo/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(user: user_dependency, db: db_dependency, todo_id: int = Path(gt=0)):
    check_if_admin(user)
    todo_model = db.get(Todos, todo_id)
    if todo_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Todo not found.')
    db.delete(todo_model)
    db.commit()

@router.get("/users", status_code=status.HTTP_200_OK)
def read_all_users(user: user_dependency, db: db_dependency):
    check_if_admin(user)
    return db.query(Users).all()

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user: user_dependency, db: db_dependency, user_id: int = Path(gt=0)):
    check_if_admin(user)
    user_model = db.get(Users, user_id)
    if user_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found.')

    db.query(Todos).filter(Todos.owner_id == user_id).delete()
    db.delete(user_model)
    db.commit()
