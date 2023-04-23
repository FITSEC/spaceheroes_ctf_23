import sys
import pickle
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--allow-insecure-localhost")
browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=options)


browser.get("http://the-truth.hackers.best:31337/invalid_request")
browser.add_cookie({"name":"session","value":f'{sys.argv[1]}'})
browser.add_cookie({"name":"flag","value":"shctf{w3_a11_l1v3_und3r_th3_DOMe}"})
browser.get("http://the-truth.hackers.best:31337/")

browser.quit()
