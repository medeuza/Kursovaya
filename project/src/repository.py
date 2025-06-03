from sqlalchemy.orm import Session, joinedload
from .models import User, Breed, Pet
from .schemas import  UserCreate, BreedCreate, BreedGet, PetGet, PetCreate
from .database import get_db
from .models import (
    VeterinaryClinic, Vaccine, Medicine, ProcedureType,
    Vaccination, MedicineTake, AnalysisType, Analysis, Appointment
)
from .schemas import (
    ClinicCreate, VaccineCreate, MedicineCreate,
    VaccinationCreate, MedicineTakeCreate, AnalysisTypeCreate, AnalysisCreate , AppointmentCreate
)

def create_user(db: Session, user_data: UserCreate):
    db_user = User(
        user_name=user_data.user_name,
        email=user_data.email,
        role=user_data.role  # ← вот это было пропущено
    )
    db_user.set_password(user_data.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if user is None or not user.check_password(password):
        return None
    return user

def get_user_by_email(db, email):
    user = db.query(User).filter(User.email == email).first()
    return user

def get_user_by_username(db:Session, username : str):
    user = db.query(User).filter(User.user_name == username).first()
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

def get_breeds(db: Session):
    breeds = db.query(Breed).all()
    return breeds

def create_pet(db: Session, data: PetCreate, owner_id: int):
    pet = Pet(name=data.name, age=data.age, breed_id=data.breed_id, owner_id=owner_id)
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet

def get_pet(db: Session, pet_id: int):
    return db.query(Pet).filter(Pet.id == pet_id).first()

def upptade_pet_recomendations(db: Session, pet: Pet, recommendations: str):
    db.query(Pet).filter(Pet.id == pet.id).update({Pet.recommendations: recommendations})
    db.commit()
    db.refresh(pet)
    return pet

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

def create_vaccination(db, data: VaccinationCreate):
    record = Vaccination(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_vaccinations(db):
    return db.query(Vaccination).options(joinedload(Vaccination.vaccine)).all()

def create_medicine_take(db, data: MedicineTakeCreate):
    record = MedicineTake(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_medicine_takes(db):
    return db.query(MedicineTake).all()

def create_appointment(db, data: AppointmentCreate):
    record = Appointment(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_appointments(db):
    appointments = db.query(Appointment).options(
        joinedload(Appointment.pet),  # загружаем pet.name
        joinedload(Appointment.vaccinations).joinedload(Vaccination.vaccine),
        joinedload(Appointment.analyses).joinedload(Analysis.analysis_type)
    ).all()

    result = []
    for appt in appointments:
        procedure = None
        if appt.vaccinations:
            procedure = {
                "type": "Vaccination",
                "name": appt.vaccinations[0].vaccine.name
            }
        elif appt.analyses:
            procedure = {
                "type": "Analysis",
                "name": appt.analyses[0].analysis_type.name
            }

        result.append({
            "id": appt.id,
            "pet_id": appt.pet_id,
            "pet_name": appt.pet.name if appt.pet else "Unknown",
            "scheduled_at": appt.scheduled_at,
            "clinic_id": appt.clinic_id,
            "status": appt.status,
            "procedure": procedure,
            "conclusion_status": appt.conclusion_status
        })
    return result



def update_entity(db: Session, model, item_id: int, update_data):
    db_item = db.query(model).filter(model.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    for key, value in update_data.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_entity(db: Session, model, item_id: int):
    db_item = db.query(model).filter(model.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    db.delete(db_item)
    db.commit()
    return {"detail": f"{model.__name__} deleted"}

def create_analysis_type(db: Session, data: AnalysisTypeCreate):
    record = AnalysisType(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_analysis_types(db: Session):
    return db.query(AnalysisType).all()

def create_analysis(db: Session, data: AnalysisCreate):
    record = Analysis(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_analyses(db: Session):
    return db.query(Analysis).all()
