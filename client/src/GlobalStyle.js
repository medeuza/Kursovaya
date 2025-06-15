import { createGlobalStyle } from "styled-components";
import "@fontsource/comfortaa";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f8f0f0;
    font-family: "Comfortaa", cursive;
    color: #5a3e32;
  }

  .container {
    background-color: #fffaf2;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }

  .btn-primary,
  .btn-edit {
    background-color: #fff3bd !important;
    color: #5a3e32 !important;
    border: 1px solid #d1a375 !important;
    font-weight: bold;
    border-radius: 12px;
    padding: 0.5rem 1.25rem;
    transition: background-color 0.2s ease;
  }

  .btn-primary:hover,
  .btn-edit:hover {
    background-color: #fce69b !important;
  }

  .btn-delete {
    background-color: #d1a375 !important;
    color: white !important;
    border: 1px solid #5a3e32 !important;
    font-weight: bold;
    border-radius: 12px;
    padding: 0.5rem 1.25rem;
    transition: background-color 0.2s ease;
  }

  .btn-delete:hover {
    background-color: #a3744c !important;
  }

  input.form-control,
  select.form-select {
    background-color: #fffaf2 !important;
    border: 1px solid #e7d5c0 !important;
    color: #5a3e32 !important;
    font-family: "Comfortaa", cursive;
    border-radius: 8px;
    padding: 0.5rem;
    appearance: none;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  select.form-select {
    background-image: url("data:image/svg+xml;utf8,<svg fill='%235a3e32' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
  }

  input.form-control:focus,
  select.form-select:focus {
    background-color: #fff7ec !important;
    border-color: #dabd9f !important;
    box-shadow: 0 0 0 0.1rem rgba(198, 156, 109, 0.3);
    outline: none;
  }

  .custom-table {
    background-color: #fffaf2 !important;
    border-radius: 12px;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border: none !important;
  }

  .custom-table th,
  .custom-table td {
    background-color: #fffaf2 !important;
    color: #5a3e32 !important;
    border: 1px solid #e7d5c0 !important;
    vertical-align: middle;
    text-align: center;
    padding: 0.75rem;
  }

  .custom-table thead th {
    font-weight: bold;
    font-size: 1rem;
  }

  .custom-table tbody tr:hover {
    background-color: #fffaf2 !important;
  }

  .table-striped tbody tr:nth-of-type(odd),
  .table-striped tbody tr:nth-of-type(even) {
    background-color: #fffaf2 !important;
  }

  .nav-tabs .nav-link {
    color: #a67c52;
  }

  .nav-tabs .nav-link.active {
    background-color: transparent !important;
    border-color: transparent !important;
    color: #5a3e2b !important;
    font-weight: 500;
    border-bottom: 2px solid #e3c8b1 !important;
    border-radius: 0 !important;
  }

  h2 {
    font-weight: bold;
    margin-bottom: 1rem;
    color: #5a3e32;
  }

  label {
    font-weight: 500;
    color: #5a3e32;
  }

  .react-datepicker__input-container input {
    background-color: #fdf2e9;
    border: 1px solid #e3c8b1;
    border-radius: 0.375rem;
    padding: 0.5rem;
    font-size: 1rem;
    font-family: 'Comfortaa', sans-serif;
    color: #5e4232;
  }

  .custom-datepicker {
    font-family: "Comfortaa", sans-serif;
    background-color: #fdf2e9;
    border: 1px solid #e3c8b1;
    color: #5e4232;
  }

  .react-datepicker__header {
    background-color: #fdf2e9;
    border-bottom: 1px solid #e3c8b1;
  }

  .react-datepicker__day {
    background-color: #fdf2e9;
    color: #5e4232;
    padding: 0.5rem;
    margin: 0.2rem;
    border-radius: 0;
  }

  .react-datepicker__day:hover {
    background-color: #e3c8b1;
    color: white;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #e3c8b1 !important;
    color: white !important;
  }

  .react-datepicker__day--today {
    border: 1px solid #e3c8b1;
  }

  .react-datepicker__time-container {
    border-left: 1px solid #e3c8b1;
  }

  .react-datepicker__time {
    background-color: #fdf2e9;
  }

  .react-datepicker__time-list-item--selected {
    background-color: #e3c8b1;
    color: white;
  }
  .procedure-card {
  background-color: #fff3e6;
  border: 1px solid #e3c8b1;
  border-radius: 1.25rem;
  padding: 2rem;
  text-align: center;
  font-family: "Comfortaa", cursive;
  color: #5a3e32;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, background-color 0.2s ease;
  cursor: pointer;
}

.procedure-card:hover {
  background-color: #fce6c9;
  transform: translateY(-4px);
}

.procedure-card h4 {
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.procedure-card p {
  font-size: 0.95rem;
  line-height: 1.4;
}

  
`;

export default GlobalStyle;