import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
from os import getenv, makedirs
from selenium.webdriver.remote.webdriver import WebDriver
from pathlib import Path
from shutil import rmtree

root_directory = Path(__file__).parent.parent

sys.path.append(str(root_directory))

from lib.ansible_utils import load_vars

reports_directory = root_directory / "reports"
rmtree(reports_directory, ignore_errors=True)
makedirs(reports_directory, exist_ok=True)
data = load_vars(root_directory / '.ansible/vault_key', root_directory / 'vars/vault.yaml')
public_domainname = data['public_domainname']
username = data['username']
password = data['password']
subdomain = getenv("SUBDOMAIN") if getenv("SUBDOMAIN") is not None else "kubetools"
hostname = f'{subdomain}.{public_domainname}'

def take_screenshot(browser: WebDriver, test_name: str):
    browser.save_screenshot(reports_directory / f'{test_name}.png')


def get_browser():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    driver = webdriver.Chrome(options=options)
    driver.delete_all_cookies()
    authenticate(driver)
    return driver


def wait_for_text(browser: WebDriver, text: str):
    WebDriverWait(browser, 5).until(
        expected_conditions.presence_of_element_located(
            (By.XPATH, f'//*[contains(text(), "{text}")]')))


def find_element_by_text(browser: WebDriver, text: str):
    return browser.find_element(By.XPATH, f'//*[contains(text(), "{text}")]')


def find_all_elements_by_text(browser: WebDriver, text):
    return browser.find_elements(By.XPATH, f'//*[contains(text(), "{text}")]')

def get_hostname():
    return hostname

def authenticate(browser: WebDriver):
    browser.get(f'https://auth.{get_hostname()}')
    wait_for_text(browser, 'Powered by Authelia')

    browser.find_element(By.ID, 'username-textfield').send_keys(username)
    browser.find_element(By.ID, 'password-textfield').send_keys(password)
    browser.find_element(By.ID, 'sign-in-button').click()

    wait_for_text(browser, 'Authenticated')
