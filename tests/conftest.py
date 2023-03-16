from pytest import fixture, hookimpl
from utils import take_screenshot, get_browser

@fixture(scope='session', autouse=True)
def browser():
    driver = get_browser()

    yield driver

    driver.quit()

@hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        setattr(item, "failure_report", report)

@fixture(scope="function", autouse=True)
def test_failed_check(request):
    yield
    if hasattr(request.node, 'failure_report'):
        driver = request.node.funcargs['browser']
        take_screenshot(driver, f'{request.path.stem}.{request.node.name}')
