from bs4 import BeautifulSoup
import requests

html = requests.get("http://127.0.0.1:8080/index.php/Main_Page?action=render").text
soup = BeautifulSoup(html, "html.parser")

for div in soup.find_all(True):
    if div.get("id"):
        print(div.name, div["id"])
