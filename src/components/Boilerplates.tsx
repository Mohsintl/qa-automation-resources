import { useState } from 'react';
import { Copy, Check, Code, Plus, ExternalLink } from 'lucide-react';
import { SubmitBoilerplate } from './SubmitBoilerplate';

interface BoilerplatesProps {
  searchQuery: string;
}

const boilerplates = [
  {
    id: 'selenium-java',
    title: 'Selenium Java TestNG Boilerplate',
    framework: 'Selenium',
    language: 'Java',
    description: 'Complete Selenium WebDriver project setup with TestNG, Page Object Model, and Maven',
    repoLink: 'https://github.com/selenium-examples/java-testng-boilerplate',
    code: `// pom.xml
<dependencies>
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>4.15.0</version>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>7.8.0</version>
    </dependency>
    <dependency>
        <groupId>io.github.bonigarcia</groupId>
        <artifactId>webdrivermanager</artifactId>
        <version>5.6.2</version>
    </dependency>
</dependencies>

// BaseTest.java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import io.github.bonigarcia.wdm.WebDriverManager;

public class BaseTest {
    protected WebDriver driver;

    @BeforeMethod
    public void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}

// BasePage.java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

public class BasePage {
    protected WebDriver driver;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }
}`
  },
  {
    id: 'playwright-typescript',
    title: 'Playwright TypeScript Boilerplate',
    framework: 'Playwright',
    language: 'TypeScript',
    description: 'Modern Playwright setup with TypeScript, fixtures, and best practices',
    repoLink: 'https://github.com/playwright-examples/typescript-boilerplate',
    code: `// package.json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "report": "playwright show-report"
  }
}

// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});

// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Expected Title/);
  });
});`
  },
  {
    id: 'cypress-js',
    title: 'Cypress JavaScript Boilerplate',
    framework: 'Cypress',
    language: 'JavaScript',
    description: 'Cypress E2E testing setup with custom commands and best practices',
    repoLink: 'https://github.com/cypress-examples/js-boilerplate',
    code: `// package.json
{
  "devDependencies": {
    "cypress": "^13.6.0"
  },
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:chrome": "cypress run --browser chrome"
  }
}

// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-test="email"]').type(email);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="submit"]').click();
});

// cypress/e2e/example.cy.js
describe('Example Test Suite', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display homepage', () => {
    cy.get('h1').should('be.visible');
  });
});`
  },
  {
    id: 'restassured-java',
    title: 'REST Assured Java Boilerplate',
    framework: 'REST Assured',
    language: 'Java',
    description: 'API testing framework with REST Assured, TestNG, and request/response specs',
    repoLink: 'https://github.com/api-testing/restassured-boilerplate',
    code: `// pom.xml
<dependencies>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>5.3.2</version>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>7.8.0</version>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.16.0</version>
    </dependency>
</dependencies>

// BaseAPITest.java
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import org.testng.annotations.BeforeClass;

public class BaseAPITest {
    protected RequestSpecification requestSpec;
    protected ResponseSpecification responseSpec;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example.com";
        
        requestSpec = new RequestSpecBuilder()
            .setContentType("application/json")
            .addHeader("Accept", "application/json")
            .build();
            
        responseSpec = new ResponseSpecBuilder()
            .expectContentType("application/json")
            .build();
    }
}

// UserAPITest.java
import io.restassured.response.Response;
import org.testng.annotations.Test;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class UserAPITest extends BaseAPITest {
    
    @Test
    public void testGetUsers() {
        given()
            .spec(requestSpec)
        .when()
            .get("/users")
        .then()
            .spec(responseSpec)
            .statusCode(200)
            .body("size()", greaterThan(0));
    }
}`
  },
  {
    id: 'pytest-selenium',
    title: 'Pytest Selenium Python Boilerplate',
    framework: 'Pytest + Selenium',
    language: 'Python',
    description: 'Python test automation with Pytest, Selenium, and fixtures',
    repoLink: 'https://github.com/pytest-examples/selenium-boilerplate',
    code: `# requirements.txt
pytest==7.4.3
selenium==4.15.2
pytest-html==4.1.1
webdriver-manager==4.0.1

# conftest.py
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture(scope="function")
def driver():
    """Setup and teardown for WebDriver"""
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.maximize_window()
    driver.implicitly_wait(10)
    
    yield driver
    
    driver.quit()

@pytest.fixture(scope="session")
def base_url():
    """Base URL for tests"""
    return "https://example.com"

# pytest.ini
[pytest]
markers =
    smoke: Smoke tests
    regression: Regression tests
    ui: UI tests
addopts = 
    --html=reports/report.html
    --self-contained-html
    -v

# tests/test_example.py
import pytest
from selenium.webdriver.common.by import By

class TestExample:
    
    def test_homepage_title(self, driver, base_url):
        driver.get(base_url)
        assert "Example" in driver.title
    
    @pytest.mark.smoke
    def test_login(self, driver, base_url):
        driver.get(f"{base_url}/login")
        driver.find_element(By.ID, "username").send_keys("testuser")
        driver.find_element(By.ID, "password").send_keys("password")
        driver.find_element(By.ID, "submit").click()
        
        assert driver.current_url == f"{base_url}/dashboard"`
  },
  {
    id: 'bug-repro',
    title: 'Bug Reproduction Template',
    framework: 'General',
    language: 'Markdown',
    description: 'Template for creating minimal bug reproduction examples',
    repoLink: '',
    code: `# Bug Reproduction Repository

## Issue Description
[Brief description of the bug]

## Steps to Reproduce
1. Clone this repository
2. Install dependencies: \`npm install\` or \`pip install -r requirements.txt\`
3. Run the application: \`npm start\` or \`python app.py\`
4. Navigate to [specific URL]
5. Perform [specific action]
6. Observe the bug

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- Browser: [e.g., Chrome 120]
- Framework Version: [e.g., React 18.2.0]
- Node Version: [e.g., v20.10.0]

## Screenshots/Videos
[Attach screenshots or videos]

## Minimal Code Example
\`\`\`javascript
// Minimal code that demonstrates the issue
function reproduceBug() {
    // Your code here
}
\`\`\`

## Additional Context
[Any other relevant information]

## Possible Solution
[If you have ideas on how to fix it]`
  },
  {
    id: 'docker-selenium',
    title: 'Docker Selenium Grid Setup',
    framework: 'Docker + Selenium',
    language: 'Docker',
    description: 'Docker compose setup for Selenium Grid with multiple browsers',
    repoLink: 'https://github.com/selenium-docker/grid-setup',
    code: `# docker-compose.yml
version: '3'
services:
  selenium-hub:
    image: selenium/hub:latest
    container_name: selenium-hub
    ports:
      - "4444:4444"
      - "4442:4442"
      - "4443:4443"

  chrome:
    image: selenium/node-chrome:latest
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=5

  firefox:
    image: selenium/node-firefox:latest
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=5

  edge:
    image: selenium/node-edge:latest
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=5

# Start: docker-compose up -d
# Stop: docker-compose down
# Grid UI: http://localhost:4444

# Example test configuration (Java)
ChromeOptions options = new ChromeOptions();
WebDriver driver = new RemoteWebDriver(
    new URL("http://localhost:4444"), 
    options
);`
  }
];

export function Boilerplates({ searchQuery }: BoilerplatesProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedBoilerplate, setSelectedBoilerplate] = useState<string | null>(null);

  const filteredBoilerplates = boilerplates.filter(bp =>
    searchQuery === '' ||
    bp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bp.framework.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bp.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-slate-900">Boilerplates & Starter Templates</h2>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Submit Boilerplate
          </button>
        </div>
        <p className="text-slate-600">Framework boilerplates, starter projects, and bug reproduction templates</p>
      </div>

      {showSubmitForm && (
        <SubmitBoilerplate 
          onClose={() => setShowSubmitForm(false)}
          onSuccess={() => {
            setShowSubmitForm(false);
          }}
        />
      )}

      <p className="text-slate-600 mb-6">
        {filteredBoilerplates.length} boilerplate{filteredBoilerplates.length !== 1 ? 's' : ''} available
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBoilerplates.map(bp => (
          <div key={bp.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-900">{bp.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">{bp.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {bp.framework}
                    </span>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {bp.language}
                    </span>
                  </div>
                </div>
              </div>

              {bp.repoLink && (
                <a
                  href={bp.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm mb-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Repository
                </a>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedBoilerplate(selectedBoilerplate === bp.id ? null : bp.id)}
                  className="flex-1 py-2 px-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  {selectedBoilerplate === bp.id ? 'Hide Code' : 'View Code'}
                </button>
                <button
                  onClick={() => copyToClipboard(bp.code, bp.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  {copiedId === bp.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {selectedBoilerplate === bp.id && (
                <div className="mt-4 bg-slate-900 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
                  <pre className="text-sm text-slate-100 whitespace-pre">
                    <code>{bp.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBoilerplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No boilerplates found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}
