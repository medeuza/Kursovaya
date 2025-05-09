#!/bin/bash

cd "$(dirname "$0")"

source src/venv/bin/activate

uvicorn src.main:app --reload
