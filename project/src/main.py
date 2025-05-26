from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from .models import Base, User, Pet, Breed, VeterinaryClinic, Appointment, Vaccine, AnalysisType
from .repository import (create_user, get_user_by_email, authenticate, create_breed, get_breeds, get_breed, create_pet, get_pet, create_analysis_type, get_analysis_types, create_analysis, get_analyses)
from .schemas import (UserGet, UserCreate, Token,BreedCreate, BreedGet, PetCreate, PetGet,AppointmentCreate, AppointmentGetBase, AnalysisTypeCreate, AnalysisTypeGet, AnalysisTypeCreate, AnalysisTypeGet)
from .database import engine, get_db
from typing import List
from .auth import create_access_token, get_current_user

from .schemas import (
    UserGet, UserCreate, Token, BreedCreate, BreedGet, PetCreate, PetGet,
    AppointmentCreate, AppointmentGet, AnalysisTypeCreate, AnalysisTypeGet,
    AnalysisCreate, AnalysisGet,
    ClinicCreate, ClinicGet,
    VaccineCreate, VaccineGet, MedicineCreate, MedicineGet, VaccinationCreate, VaccinationGet, MedicineTakeGet,MedicineTakeCreate
)

from .repository import (
    create_clinic, get_clinics, create_vaccine, get_vaccines, create_medicine, get_medicines, create_vaccination, get_vaccinations,
    create_medicine_take, get_medicine_takes,
    create_appointment, get_appointments
)

Base.metadata.create_all(bind=engine)
app = FastAPI()
origins = ["http://localhost:3000"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"], allow_credentials=True)

@app.post("/users/register", response_model=UserGet)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_data.email)
    if user:
        raise HTTPException(status_code=400, detail="email уже зарегистрирован")
    return create_user(db, user_data)

@app.post("/users/login", response_model=Token)
def login(user_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate(db, user_data.username, user_data.password)
    if user is None:
        raise HTTPException(status_code=401, detail="неправильное имя пользователя или пароль")

    token = create_access_token(data={"email": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/breeds/", response_model=BreedGet)
def add_breed(breed_data: BreedCreate, db: Session = Depends(get_db)):
    return create_breed(db, breed_data)

@app.get("/breeds/", response_model=List[BreedGet])
def get_all_breeds(db: Session = Depends(get_db)):
    return get_breeds(db)

@app.put("/breeds/{item_id}", response_model=BreedGet)
def update_breed(item_id: int, updated_data: BreedCreate, db: Session = Depends(get_db)):
    db_item = db.query(Breed).filter(Breed.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Breed not found")
    for key, value in updated_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/breeds/{item_id}")
def delete_breed(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Breed).filter(Breed.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Breed not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "Breed deleted"}


@app.post("/pets/", response_model=PetGet)
def add_pet(pet_data: PetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_pet(db, pet_data, owner_id=current_user.id)

from sqlalchemy.orm import joinedload

@app.get("/pets/", response_model=list[PetGet])
def get_my_pets(
    db: Session = Depends(get_db),
    current_user: User = Security(get_current_user)
):
    return db.query(Pet)\
        .options(joinedload(Pet.breed))\
        .filter(Pet.owner_id == current_user.id)\
        .all()

@app.put("/pets/{item_id}", response_model=PetGet)
def update_pet(item_id: int, updated_data: PetCreate, db: Session = Depends(get_db)):
    db_item = db.query(Pet).filter(Pet.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Pet not found")
    for key, value in updated_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/pets/{item_id}")
def delete_pet(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Pet).filter(Pet.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Pet not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "Pet deleted"}


@app.post("/clinics/", response_model=ClinicGet)
def add_clinic(clinic_data: ClinicCreate, db: Session = Depends(get_db)):
    return create_clinic(db, clinic_data)

@app.get("/clinics/", response_model=List[ClinicGet])
def get_all_clinics(db: Session = Depends(get_db)):
    return db.query(VeterinaryClinic).all()

@app.put("/clinics/{item_id}", response_model=ClinicGet)
def update_veterinaryclinic(item_id: int, updated_data: ClinicCreate, db: Session = Depends(get_db)):
    db_item = db.query(VeterinaryClinic).filter(VeterinaryClinic.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="VeterinaryClinic not found")
    for key, value in updated_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.delete("/clinics/{item_id}")
def delete_veterinaryclinic(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(VeterinaryClinic).filter(VeterinaryClinic.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="VeterinaryClinic not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "VeterinaryClinic deleted"}

@app.post("/vaccines/", response_model=VaccineGet)
def add_vaccine(data: VaccineCreate, db: Session = Depends(get_db)):
    return create_vaccine(db, data)

@app.get("/vaccines/", response_model=list[VaccineGet])
def list_vaccines(db: Session = Depends(get_db)):
    return get_vaccines(db)

@app.put("/vaccines/{item_id}", response_model=VaccineGet)
def update_vaccine(item_id: int, updated_data: VaccineCreate, db: Session = Depends(get_db)):
    db_item = db.query(Vaccine).filter(Vaccine.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Vaccine not found")
    for key, value in updated_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/vaccines/{item_id}")
def delete_vaccine(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Vaccine).filter(Vaccine.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Vaccine not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "Vaccine deleted"}

@app.post("/medicines/", response_model=MedicineGet)
def add_medicine(data: MedicineCreate, db: Session = Depends(get_db)):
    return create_medicine(db, data)

@app.get("/medicines/", response_model=list[MedicineGet])
def list_medicines(db: Session = Depends(get_db)):
    return get_medicines(db)

@app.put("/medicines/{item_id}", response_model=MedicineGet)
def update_medicine(item_id: int, updated_data: MedicineCreate, db: Session = Depends(get_db)):
    db_item = db.query(Medicine).filter(Medicine.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    for key, value in updated_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/medicines/{item_id}")
def delete_medicine(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Medicine).filter(Medicine.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "Medicine deleted"}

@app.post("/vaccinations/", response_model=VaccinationGet)
def add_vaccination(data: VaccinationCreate, db: Session = Depends(get_db)):
    return create_vaccination(db, data)

@app.get("/vaccinations/", response_model=list[VaccinationGet])
def list_vaccinations(db: Session = Depends(get_db)):
    return get_vaccinations(db)

@app.put("/vaccinations/{item_id}", response_model=VaccinationGet)
def update_vaccination(item_id: int, updated_data: VaccinationCreate, db: Session = Depends(get_db)):
    db_item = db.query(Vaccination).filter(Vaccination.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Vaccination not found")
    for key, value in updated_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/vaccinations/{item_id}")
def delete_vaccination(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Vaccination).filter(Vaccination.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Vaccination not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "Vaccination deleted"}

@app.post("/medicine-takes/", response_model=MedicineTakeGet)
def add_medicine_take(data: MedicineTakeCreate, db: Session = Depends(get_db)):
    return create_medicine_take(db, data)

@app.get("/medicine-takes/", response_model=list[MedicineTakeGet])
def list_medicine_takes(db: Session = Depends(get_db)):
    return get_medicine_takes(db)

@app.put("/medicine-takes/{item_id}", response_model=MedicineTakeGet)
def update_medicinetake(item_id: int, updated_data: MedicineTakeCreate, db: Session = Depends(get_db)):
    db_item = db.query(MedicineTake).filter(MedicineTake.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="MedicineTake not found")
    for key, value in updated_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/medicine-takes/{item_id}")
def delete_medicinetake(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(MedicineTake).filter(MedicineTake.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="MedicineTake not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "MedicineTake deleted"}


@app.post("/appointments/", response_model=AppointmentGetBase)
def add_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    if isinstance(data.scheduled_at, str):
        try:
            data.scheduled_at = datetime.fromisoformat(data.scheduled_at.replace("Z", "+00:00"))
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid datetime format for scheduled_at")
    record = create_appointment(db, data)
    return record

@app.get("/appointments/", response_model=List[AppointmentGet])
def list_appointments(db: Session = Depends(get_db)):
    return get_appointments(db)  # возвращает словари с полем "procedure"



@app.put("/appointments/{item_id}", response_model=AppointmentGet)
def update_appointment_by_id(item_id: int, updated_data: AppointmentCreate, db: Session = Depends(get_db)):
    db_item = db.query(Appointment).filter(Appointment.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if isinstance(updated_data.scheduled_at, str):
        updated_data.scheduled_at = datetime.fromisoformat(
            updated_data.scheduled_at.replace("Z", "+00:00")
        )
    for key, value in updated_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/appointments/{item_id}", operation_id="delete_appointment_by_id")
def delete_appointment_by_id(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Appointment).filter(Appointment.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(db_item)
    db.commit()
    return {"detail": "Appointment deleted"}

@app.post("/analysis-types/", response_model=AnalysisTypeGet)
def add_analysis_type(data: AnalysisTypeCreate, db: Session = Depends(get_db)):
    return create_analysis_type(db, data)

@app.get("/analysis-types/", response_model=List[AnalysisTypeGet])
def list_analysis_types(db: Session = Depends(get_db)):
    return get_analysis_types(db)


@app.put("/analysis-types/{item_id}", response_model=AnalysisTypeGet)
def update_analysis_type(item_id: int, updated_data: AnalysisTypeCreate, db: Session = Depends(get_db)):
    return update_entity(db, AnalysisType, item_id, updated_data)

@app.delete("/analysis-types/{item_id}")
def delete_analysis_type(item_id: int, db: Session = Depends(get_db)):
    return delete_entity(db, AnalysisType, item_id)
@app.post("/analyses/", response_model=AnalysisGet)
def add_analysis(data: AnalysisCreate, db: Session = Depends(get_db)):
    return create_analysis(db, data)

@app.get("/analyses/", response_model=List[AnalysisGet])
def list_analyses(db: Session = Depends(get_db)):
    return get_analyses(db)
