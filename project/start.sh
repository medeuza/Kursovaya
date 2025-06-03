#!/bin/bash


source ./venv/bin/activate
set -o allexport

source .env set

python3 -m uvicorn src.main:app --reload
