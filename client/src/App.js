import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {YMaps} from "@pbe/react-yandex-maps";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import PetPage from "./pages/pets";
import AppointmentPage from "./pages/appointments";
import MedicinesPage from "./pages/medicines";
import ClinicsPage from "./pages/clinics";
import ProcedureTypePage from "./pages/ProcedureTypePage";
import ServicePanel from "./pages/ServicePanel";

import VaccinationsPage from "./pages/vaccinations";
import AnalysisPage from "./pages/analysis";

import VaccinationForm from "./pages/VaccinationForm";
import AnalysisForm from "./pages/AnalysisForm";

import AddDataPage from "./pages/AddDataPage";

import SelectClinic from "./pages/SelectClinic";
import Mars from "./pages/mars";
import Mars2 from "./pages/mars2";




function App() {
  return (
    <YMaps query={{apikey: "d47a1fd6-4f22-4cd2-9e04-4b94003f3663", load: "package.full"}}>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/pets" element={<PetPage />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/clinics" element={<ClinicsPage />} />

        <Route path="/vaccinations" element={<VaccinationsPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />

        <Route path="/procedure-type" element={<ProcedureTypePage />} />
        <Route path="/vaccination-form" element={<VaccinationForm />} />
        <Route path="/analysis-form" element={<AnalysisForm />} />

        <Route path="/add-missing-data" element={<AddDataPage />} />

        <Route path="/service-panel" element={<ServicePanel />} />
        <Route path="/select-clinic" element={<SelectClinic />} />
        <Route path="/services" element={<ServicePanel />} />
        <Route path="/mars" element={<Mars />} />
        <Route path="/mars2" element={<Mars2 />} />

      </Routes>
    </Router>
    </YMaps>
  );
}

export default App;

