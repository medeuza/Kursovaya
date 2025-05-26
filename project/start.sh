#!/bin/bash


source ./venv/bin/activate
set -o allexport

source src/.env set

python3 -m uvicorn src.main:app --reload
