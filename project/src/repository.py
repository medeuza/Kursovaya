from sqlalchemy.orm import Session
from .models import User, Breed, Pet
from .schemas import  UserCreate, BreedCreate, BreedGet, PetGet, PetCreate
from .database import get_db
from .models import (
    VeterinaryClinic, Vaccine, Medicine, ProcedureType,
    Vaccination, MedicineTake, MedicalAnalysis, Appointment
)
from .schemas import (
    ClinicCreate, VaccineCreate, MedicineCreate, ProcedureTypeCreate,
    VaccinationCreate, MedicineTakeCreate, MedicalAnalysisCreate, AppointmentCreate
)

def create_user(db: Session, user_data:UserCreate):
    db_user = User(user_name=user_data.user_name, email=user_data.email)
    db_user.set_password(user_data.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if user is None or not user.check_password(password):
        return None
    return user

def get_user_by_email(db, email):
    user = db.query(User).filter(User.email == email).first()
    return user

def create_breed(db: Session, data: BreedCreate):
    breed = Breed(name=data.name)
    db.add(breed)
    db.commit()
    db.refresh(breed)
    return breed

def get_breed(db: Session, breed_id: int):
    breed = db.query(Breed).filter(id=breed_id).first()
    return breed

def create_pet(db: Session, data: PetCreate, owner_id: int):
    pet = Pet(name=data.name, age=data.age, breed_id=data.breed_id, owner_id=owner_id)
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet

def get_pet(db: Session, pet_id: int):
    return db.query(Pet).filter(Pet.id == pet_id).first()

def create_clinic(db, data: ClinicCreate):
    clinic = VeterinaryClinic(**data.dict())
    db.add(clinic)
    db.commit()
    db.refresh(clinic)
    return clinic

def get_clinics(db):
    return db.query(VeterinaryClinic).all()

def create_vaccine(db, data: VaccineCreate):
    vaccine = Vaccine(**data.dict())
    db.add(vaccine)
    db.commit()
    db.refresh(vaccine)
    return vaccine

def get_vaccines(db):
    return db.query(Vaccine).all()

def create_medicine(db, data: MedicineCreate):
    med = Medicine(**data.dict())
    db.add(med)
    db.commit()
    db.refresh(med)
    return med

def get_medicines(db):
    return db.query(Medicine).all()

def create_procedure_type(db, data: ProcedureTypeCreate):
    p = ProcedureType(**data.dict())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

def get_procedure_types(db):
    return db.query(ProcedureType).all()

def create_vaccination(db, data: VaccinationCreate):
    record = Vaccination(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_vaccinations(db):
    return db.query(Vaccination).all()

def create_medicine_take(db, data: MedicineTakeCreate):
    record = MedicineTake(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_medicine_takes(db):
    return db.query(MedicineTake).all()

def create_medical_analysis(db, data: MedicalAnalysisCreate):
    record = MedicalAnalysis(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_medical_analyses(db):
    return db.query(MedicalAnalysis).all()

def create_appointment(db, data: AppointmentCreate):
    record = Appointment(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_appointments(db):
    return db.query(Appointment).all()

