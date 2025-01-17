require 'capybara/rspec'
require 'selenium-webdriver'
require 'capybara/chromedriver/logger'
require 'webdrivers/chromedriver'

Capybara.register_driver :selenium_chrome_headless_no_sandbox do |app|
  browser_options = ::Selenium::WebDriver::Chrome::Options.new
  browser_options.args << '--headless'
  browser_options.args << '--disable-gpu'
  # Required for chrome to work in container based Travis environment
  # (see https://docs.travis-ci.com/user/chrome)
  browser_options.args << '--no-sandbox'

  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    # see https://github.com/SeleniumHQ/selenium/issues/3738
    'goog:loggingPrefs': {browser: 'ALL'}
  )

  Capybara::Selenium::Driver.new(app,
                                 browser: :chrome,
                                 capabilities: [browser_options, capabilities])
end

Capybara.javascript_driver = :selenium_chrome_headless_no_sandbox

Capybara::Chromedriver::Logger.raise_js_errors = true
Capybara::Chromedriver::Logger.filters = [
  # Bandwidth probe files are not available in tests
  /bandwidth_probe.*Failed to load resource/i,

  # Logged by Pageflow after legacy bandwidth detection
  /Detected bandwidth/,

  # Not helpful in specs
  /Download the React DevTools/,

  # Caused by sign in form
  /Input elements should have autocomplete attributes/,

  # React does not like the server rendered "back to top" link inside
  # page sections.
  /Target node has markup rendered by React/i,

  # Ignore failure of debounced request to save order of storylines
  %r{storylines/order - Failed to load resource: the server responded with a status of 401},

  # Ignore failure of debounced request to refresh partials while db
  # has already been cleaned
  /partials - Failed to load resource: the server responded with a status of 401/
]

RSpec.configure do |config|
  config.after :each, js: true do
    Capybara::Chromedriver::Logger::TestHooks.after_example!
  end
end
