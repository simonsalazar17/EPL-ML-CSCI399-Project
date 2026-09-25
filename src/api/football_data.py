import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("FOOTBALL_DATA_API_KEY")

BASE_URL = "https://api.football-data.org/v4/"

headers = {
    "X-Auth-Token": API_KEY
}

url = f"{BASE_URL}competitions/PL"

response = requests.get(url, headers=headers)

print("Status Code:", response.status_code)

if response.status_code == 200:
    data = response.json()

    print("Competition: ", data.get("name"))
    print("Country: ", data["area"]["name"])
    print("Current Season: ", data["currentSeason"]["startDate"])

else:
    print("La cagaste mi bro")
    print(response.text)