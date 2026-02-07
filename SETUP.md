1. Prerequisites
Python 3.8 or higher installed.

A modern web browser (Chrome/Edge/Firefox).

A webcam (optional, for live demos).

2. Install Backend Dependencies
Open your terminal/command prompt and run:

Bash
pip install fastapi uvicorn opencv-python numpy python-multipart

3. Run the Backend (The Brain)
Navigate to the Drift_Monitor folder and start the server:

Bash
cd DriftSentinel-AI-main

Bash
cd Drift_Monitor
python main.py or uvicorn main:app --reload
You should see: Uvicorn running on http://127.0.0.1:8000

4. Run the Frontend (The Dashboard)
You can simply double-click index.html in the Sentinel_Frontend_Final folder to open it in your browser.

Optional (for better performance): Run a local HTTP server:

Bash
cd Sentinel_Frontend_Final
python -m http.server 3000
Then open http://localhost:3000 in your browser.
