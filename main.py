from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from scraper import get_menu

app = FastAPI()

# CORS for frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"]
)

# ✅ Root URL for health check
@app.get("/")
def root():
    return {"message": "Backend is running"}

# ✅ Scrape endpoint
@app.get("/scrape")
def scrape(url: str = Query(...)):
    try:
        data = get_menu(url)
        return {"status": "success", "items": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
