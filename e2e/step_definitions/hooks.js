const { After } = require('cucumber');
const fs = require('fs')
const filePath = `${process.cwd()}/results.json`;

/**
 * Collect results after each scenario completes
 */
After(async scenario => {
    console.log(scenario);
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, JSON.stringify(scenario) + ',');
    }
});

