#!/bin/bash

echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Installing backend dependencies..."
cd ../backend
npm install

cd ..

echo "All dependencies installed."