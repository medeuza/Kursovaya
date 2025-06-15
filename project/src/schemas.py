from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class BaseUser(BaseModel):
    user_name: str
    email: EmailStr

class UserGet(BaseUser):
    id: int
    role: str
    class Config:
        orm_mode=True

class UserCreate(BaseUser):
    password: str
    role: str

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
        from_attributes = True


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
    breed: Optional[BreedGet]
    recommendations: Optional[str]
    #
    # class Config:
    #     from_attributes = True


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
    type: str
    manufacturer: str

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


class VaccinationCreate(BaseModel):
    vaccine_id: int
    pet_id: int
    appointment_id: int

class VaccinationGet(VaccinationCreate):
    id: int
    appointment_id: Optional[int]
    vaccine: Optional[VaccineGet]

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


class ProcedureSummary(BaseModel):
    type: str
    name: str

class AnalysisTypeBase(BaseModel):
    name: str
    description: str
    instructions: str

class AnalysisTypeCreate(AnalysisTypeBase):
    pass

class AnalysisTypeGet(AnalysisTypeBase):
    id: int

    class Config:
        orm_mode = True
class AnalysisCreate(BaseModel):
    appointment_id: int
    analysis_type_id: int

class AnalysisGet(AnalysisCreate):
    id: int
    analysis_type: Optional[AnalysisTypeGet]

    class Config:
        orm_mode = True

class AppointmentGetBase(BaseModel):
    id: int
    pet_id: int
    scheduled_at: datetime
    clinic_id: int
    status: str

    class Config:
        orm_mode = True

class AppointmentPatch(BaseModel):
    status: Optional[str] = None
    conclusion: Optional[str] = None


class AppointmentGet(BaseModel):
    id: int
    pet_id: int
    scheduled_at: datetime
    clinic_id: Optional[int]
    status: str
    procedure: Optional[ProcedureSummary] = None
    conclusion_status: str
    conclusion: Optional[str] = None

    class Config:
        orm_mode = True

class AppointmentCreate(BaseModel):
    pet_id: int
    scheduled_at: str
    clinic_id: int
    status: str
    conclusion_status: str
    conclusion: Optional[str] = None

class RecommendationRequest(BaseModel):
    age: int
    breed_id: int

class RecommendationResponse(BaseModel):
    recommendations: str

