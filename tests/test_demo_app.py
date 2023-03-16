from utils import get_hostname, wait_for_text

def test_demo_app(browser):
    browser.get(f'https://demo.{get_hostname()}')
    wait_for_text(browser, 'Hello from Ansible Roles Spring Demo!')
