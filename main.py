from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from scraper import get_menu

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/scrape")
def scrape(url: str = Query(...)):
    try:
        data = get_menu(url)
        return {"status": "success", "items": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
