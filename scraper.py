import json
import requests
from bs4 import BeautifulSoup
import re
from html import unescape

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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

def get_menu(url):
    if not url.endswith('/order'):
        url += '/order'

    print(f"Scraping URL: {url}")  # Debug log

    response = requests.get(url, headers=headers, timeout=15)
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
    return []
