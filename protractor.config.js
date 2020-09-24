const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const frameworkPath = require.resolve('protractor-cucumber-framework');
const cucumberHtmlReporter = require('cucumber-html-reporter');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const cucumberReportDirectory = 'e2e/protractor-report';
const jsonReportFile = `${cucumberReportDirectory}/cucumber_json_report.json`;
const htmlReportFile = `${cucumberReportDirectory}/cucumber_web_report.html`;

const TestRailHelper = require('@monotype/cucumber-testrail-helper');
const testRailHelper = new TestRailHelper();

const fs = require('fs')
const filePath = './results.json';

const protractorConfig = {
  allScriptsTimeout: 90000,
  seleniumAddress: 'http://localhost:4444/wd/hub',
  params: {
    cucumberDefaultTimeout: 90,
    wait: {
      short: 5000,
      medium: 10000,
      long: 15000,
    }
  },
  capabilities: {
    'browserName': 'chrome',
    maxInstances: 4,
    shardTestFiles: true,
  },
  resultJsonOutputFile: 'report.json',
  framework: 'custom',
  frameworkPath,
  // How long to wait for a page to load.
  getPageTimeout: 55000,

  beforeLaunch: async () => {
    const fd = fs.openSync(filePath, 'w');
    fs.writeFileSync(filePath, '[');
    fs.closeSync(fd);
    await testRailHelper.initializeTestRun();
  },

  onPrepare: async () => {
    // Clean the report folder
    rimraf.sync(cucumberReportDirectory);
    mkdirp.sync(cucumberReportDirectory);
    chai.use(chaiAsPromised);
    browser.ignoreSynchronization = true;
  },
  specs: ['./e2e/features/*.feature'],
  cucumberOpts: {
    require: './e2e/step_definitions/*.js',
    keepAlive: false,
    format: ['progress', `json:./${jsonReportFile}`],
  },
  /**
   *----- The cleanup step -----
   * A callback function called once the tests have finished running and
   * the webdriver instance has been shut down. It is passed the exit code
   * (0 if the tests passed or 1 if not).
   */
  onCleanUp: async () => {
    const reportOptions = {
      theme: 'bootstrap',
      jsonDir: cucumberReportDirectory,
      output: htmlReportFile,
      reportSuiteAsScenarios: true,
      ignoreBadJsonFile: true,
      launchReport: false,
      columnLayout: 1,
      storeScreenshots: true,
    };
    cucumberHtmlReporter.generate(reportOptions);
  },
  afterLaunch: async () => {
    let results = [];
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.substring(0, content.length - 1);
      content += ']';
      fs.writeFileSync(filePath, content, 'utf8');
      results = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    await testRailHelper.processScenarioResults(results);
    fs.unlinkSync(filePath);
  },
  /**
   * If set, Protractor will ignore uncaught exceptions instead of exiting
   * without an error code. The exceptions will still be logged as warnings.
   */
  ignoreUncaughtExceptions: true,
};

module.exports = {
  config: protractorConfig,
};
