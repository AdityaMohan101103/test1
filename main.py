from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from scraper import get_menu

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"]
)

@app.get("/scrape")
def scrape(url: str = Query(...)):
    try:
        data = get_menu(url)
        return {"status": "success", "items": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
