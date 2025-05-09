from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .models import Base, User, Pet
from .repository import (create_user, get_user_by_email, authenticate, create_breed, get_breed, create_pet, get_pet)
from .schemas import (UserGet, UserCreate, Token,BreedCreate, BreedGet, PetCreate, PetGet)
from .database import engine, get_db
from .auth import create_access_token, get_current_user
from .schemas import (
    ClinicCreate, ClinicGet, VaccineCreate, VaccineGet, MedicineCreate, MedicineGet,
    ProcedureTypeCreate, ProcedureTypeGet, VaccinationCreate, VaccinationGet,
    MedicineTakeCreate, MedicineTakeGet, MedicalAnalysisCreate, MedicalAnalysisGet,
    AppointmentCreate, AppointmentGet
)
from .repository import (
    create_clinic, get_clinics, create_vaccine, get_vaccines, create_medicine, get_medicines,
    create_procedure_type, get_procedure_types, create_vaccination, get_vaccinations,
    create_medicine_take, get_medicine_takes, create_medical_analysis, get_medical_analyses,
    create_appointment, get_appointments
)

Base.metadata.create_all(bind=engine)
app = FastAPI()


@app.post("/users/register", response_model=UserGet)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_data.email)
    if user:
        raise HTTPException(status_code=400, detail="email уже зарегистрирован")
    return create_user(db, user_data)


@app.post("/users/login", response_model=Token)
def login(user_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user: User = authenticate(db, user_data.username, user_data.password)
    if user is None:
        raise HTTPException(status_code=401, detail="неправильное имя пользователя или пароль")
    token = create_access_token(data={"email": user.email})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/breeds/", response_model=BreedGet)
def add_breed(breed_data: BreedCreate, db: Session = Depends(get_db)):
    return create_breed(db, breed_data)


@app.post("/pets/", response_model=PetGet)
def add_pet(pet_data: PetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_pet(db, pet_data, owner_id=current_user.id)


@app.get("/pets/", response_model=list[PetGet])
def get_my_pets(db: Session = Depends(get_db), current_user: User = Security(get_current_user)):
    return db.query(Pet).filter(Pet.owner_id == current_user.id).all()

@app.post("/clinics/", response_model=ClinicGet)
def add_clinic(clinic_data: ClinicCreate, db: Session = Depends(get_db)):
    return create_clinic(db, clinic_data)

@app.get("/clinics/", response_model=list[ClinicGet])
def list_clinics(db: Session = Depends(get_db)):
    return get_clinics(db)

@app.post("/vaccines/", response_model=VaccineGet)
def add_vaccine(data: VaccineCreate, db: Session = Depends(get_db)):
    return create_vaccine(db, data)

@app.get("/vaccines/", response_model=list[VaccineGet])
def list_vaccines(db: Session = Depends(get_db)):
    return get_vaccines(db)

@app.post("/medicines/", response_model=MedicineGet)
def add_medicine(data: MedicineCreate, db: Session = Depends(get_db)):
    return create_medicine(db, data)

@app.get("/medicines/", response_model=list[MedicineGet])
def list_medicines(db: Session = Depends(get_db)):
    return get_medicines(db)

@app.post("/procedure-types/", response_model=ProcedureTypeGet)
def add_procedure_type(data: ProcedureTypeCreate, db: Session = Depends(get_db)):
    return create_procedure_type(db, data)

@app.get("/procedure-types/", response_model=list[ProcedureTypeGet])
def list_procedure_types(db: Session = Depends(get_db)):
    return get_procedure_types(db)

@app.post("/vaccinations/", response_model=VaccinationGet)
def add_vaccination(data: VaccinationCreate, db: Session = Depends(get_db)):
    return create_vaccination(db, data)

@app.get("/vaccinations/", response_model=list[VaccinationGet])
def list_vaccinations(db: Session = Depends(get_db)):
    return get_vaccinations(db)

@app.post("/medicine-takes/", response_model=MedicineTakeGet)
def add_medicine_take(data: MedicineTakeCreate, db: Session = Depends(get_db)):
    return create_medicine_take(db, data)

@app.get("/medicine-takes/", response_model=list[MedicineTakeGet])
def list_medicine_takes(db: Session = Depends(get_db)):
    return get_medicine_takes(db)

@app.post("/medical-analyses/", response_model=MedicalAnalysisGet)
def add_medical_analysis(data: MedicalAnalysisCreate, db: Session = Depends(get_db)):
    return create_medical_analysis(db, data)

@app.get("/medical-analyses/", response_model=list[MedicalAnalysisGet])
def list_medical_analyses(db: Session = Depends(get_db)):
    return get_medical_analyses(db)

@app.post("/appointments/", response_model=AppointmentGet)
def add_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    return create_appointment(db, data)

@app.get("/appointments/", response_model=list[AppointmentGet])
def list_appointments(db: Session = Depends(get_db)):
    return get_appointments(db)