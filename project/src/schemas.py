from pydantic import BaseModel, EmailStr
from typing import Optional

class BaseUser(BaseModel):
    user_name: str
    email: EmailStr

class UserGet(BaseUser):
    id: int
    class Config:
        orm_mode=True

class UserCreate(BaseUser):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class BreedCreate(BaseModel):
    name: str

class BreedGet(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class PetCreate(BaseModel):
    name: str
    age: int
    breed_id: int

class PetGet(BaseModel):
    id: int
    name: str
    age: int
    breed_id: int
    owner_id: int
    class Config:
        orm_mode = True

class ClinicCreate(BaseModel):
    name: str
    address: str
    phone: str

class ClinicGet(ClinicCreate):
    id: int
    class Config:
        orm_mode = True

class VaccineCreate(BaseModel):
    name: str
    description: str
    period_days: int

class VaccineGet(VaccineCreate):
    id: int
    class Config:
        orm_mode = True

class MedicineCreate(BaseModel):
    name: str
    period_hours: int

class MedicineGet(MedicineCreate):
    id: int
    class Config:
        orm_mode = True

class ProcedureTypeCreate(BaseModel):
    name: str

class ProcedureTypeGet(ProcedureTypeCreate):
    id: int
    class Config:
        orm_mode = True

class VaccinationCreate(BaseModel):
    vaccine_id: int
    pet_id: int

class VaccinationGet(VaccinationCreate):
    id: int
    class Config:
        orm_mode = True

class MedicineTakeCreate(BaseModel):
    pet_id: int
    medicine_id: int
    datetime: str

class MedicineTakeGet(MedicineTakeCreate):
    id: int
    class Config:
        orm_mode = True

class MedicalAnalysisCreate(BaseModel):
    appointment_id: int
    results: str
    recommendations: str
    name: str

class MedicalAnalysisGet(MedicalAnalysisCreate):
    id: int
    class Config:
        orm_mode = True

class AppointmentCreate(BaseModel):
    pet_id: int
    scheduled_at: str
    clinic_id: int
    procedure_type_id: int
    status: str

class AppointmentGet(AppointmentCreate):
    id: int
    class Config:
        orm_mode = True
