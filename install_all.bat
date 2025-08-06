@echo off
echo "Installing frontend dependencies..."
cd frontend
call npm install
echo "Installing backend dependencies..."
cd ..\backend
call npm install
cd ..
echo "All dependencies installed."