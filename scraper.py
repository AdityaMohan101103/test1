import json
import requests
from bs4 import BeautifulSoup
import re
from html import unescape
import time

# More realistic headers to mimic a real browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/114.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Referer": "https://www.zomato.com/",
    "Connection": "keep-alive",
    "DNT": "1"
}

def extract_needed_data(json_data):
    if isinstance(json_data, str):
        json_data = json.loads(json_data)

    resId = str(json_data.get("pages", {}).get('current', {}).get("resId"))
    menus = json_data.get("pages", {}).get('restaurant', {}).get(resId, {}).get("order", {}).get("menuList", {}).get("menus", [])
    name = json_data.get("pages", {}).get('restaurant', {}).get(resId, {}).get("sections", {}).get("SECTION_BASIC_INFO", {}).get('name', 'Restaurant')

    filtered_data = []
    for menu in menus:
        category_name = menu.get("menu", {}).get("name", "")
        for category in menu.get("menu", {}).get("categories", []):
            sub_category_name = category.get("category", {}).get("name", "")
            for item in category.get("category", {}).get("items", []):
                item_data = item["item"]
                filtered_data.append({
                    "restaurant": name,
                    "category": category_name,
                    "sub_category": sub_category_name,
                    "dietary_slugs": ','.join(item_data.get("dietary_slugs", [])),
                    "item_name": item_data.get("name", ""),
                    "price": item_data.get("display_price", ""),
                    "desc": item_data.get("desc", "")
                })

    return filtered_data

def get_menu(url, max_retries=5):
    if not url.endswith('/order'):
        url += '/order'

    attempt = 0
    backoff = 1  # seconds

    while attempt < max_retries:
        try:
            response = requests.get(url, headers=headers, timeout=15)
            if response.status_code == 403:
                print(f"Received 403 Forbidden on attempt {attempt + 1}. Retrying after {backoff}s...")
                time.sleep(backoff)
                backoff *= 2  # exponential backoff
                attempt += 1
                continue
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            scripts = soup.find_all('script')

            for script in scripts:
                if 'window.__PRELOADED_STATE__' in script.text:
                    match = re.search(r'window\.__PRELOADED_STATE__ = JSON\.parse\((.+?)\);', script.text)
                    if match:
                        escaped_json = match.group(1)
                        decoded_json_str = unescape(escaped_json)
                        parsed_json = json.loads(decoded_json_str)
                        preloaded_state = json.loads(parsed_json)
                        return extract_needed_data(preloaded_state)
            print("No embedded menu data found on this page.")
            return []
        except requests.RequestException as e:
            print(f"Request error on attempt {attempt + 1}: {e}")
            time.sleep(backoff)
            backoff *= 2
            attempt += 1

    print("Max retries reached. Failed to fetch menu.")
    return []
