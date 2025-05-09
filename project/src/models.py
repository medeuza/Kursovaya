from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from passlib.context import CryptContext

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, index=True)
    password = Column(String)
    email = Column(String, unique=True, index=True)

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")

    def set_password(self, password: str):
        self.password = password_context.hash(password)

    def check_password(self, password: str):
        return password_context.verify(password, self.password)


class Breed(Base):
    __tablename__ = "breeds"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    animals = relationship("Pet", back_populates="breed", cascade="all, delete-orphan")


class Pet(Base):
    __tablename__ = "pets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    # medical_history = Column(String)
    breed_id = Column(Integer, ForeignKey("breeds.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

    breed = relationship("Breed", back_populates="animals")
    owner = relationship("User", back_populates="pets")
    # appointments = relationship("Appointment", back_populates="appointment_pets", cascade="all, delete-orphan")


class VeterinaryClinic(Base):
    __tablename__ = "veterinary_clinics"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    phone = Column(String)

    appointments = relationship("Appointment", back_populates="clinic")


class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id"))
    scheduled_at = Column(DateTime)
    clinic_id = Column(Integer, ForeignKey("veterinary_clinics.id"))
    procedure_type_id = Column(Integer, ForeignKey("procedure_types.id"))
    status = Column(String)

    # pet = relationship("Pet", back_populates="appointments")
    clinic = relationship("VeterinaryClinic", back_populates="appointments")
    procedure_type = relationship("ProcedureType")
    medical_analyses = relationship("MedicalAnalysis", back_populates="appointment", cascade="all, delete-orphan")


class MedicalAnalysis(Base):
    __tablename__ = "medical_analyses"
    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"))
    results = Column(String)
    recommendations = Column(String)
    name = Column(String)

    appointment = relationship("Appointment", back_populates="medical_analyses")


class ProcedureType(Base):
    __tablename__ = "procedure_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)


class Vaccine(Base):
    __tablename__ = "vaccines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    period_days = Column(Integer)

    vaccinations = relationship("Vaccination", back_populates="vaccine", cascade="all, delete-orphan")


class Vaccination(Base):
    __tablename__ = "vaccinations"
    id = Column(Integer, primary_key=True, index=True)
    # appointment_id = Column(Integer, ForeignKey("appointments.id"))
    vaccine_id = Column(Integer, ForeignKey("vaccines.id"))
    pet_id = Column(Integer, ForeignKey("pets.id"))
    # appointment = relationship("Appoinment", uselist=False, back_populates="vacination")

    vaccine = relationship("Vaccine", back_populates="vaccinations")


class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    period_hours = Column(Integer)

    medicine_takes = relationship("MedicineTake", back_populates="medicine", cascade="all, delete-orphan")


class MedicineTake(Base):
    __tablename__ = "medicine_takes"
    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id"))
    medicine_id = Column(Integer, ForeignKey("medicines.id"))
    datetime = Column(DateTime)

    medicine = relationship("Medicine", back_populates="medicine_takes")