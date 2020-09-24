
/**
 * CASE1:
 * Single browser instance : start one browser instance at a time.
 */
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    capabilities: {
        'browserName': 'chrome'
    },
    specs: ['spec1.feature', 'spec2.feature']
};
//sequential --> [chrome] --> spec1.feature --> spec2.feature


/**
 * CASE2:
 * Different browser instance will launch in parallel and all the specs 
 * which is mentioned in the spec:[] tag will execute in each browser's instance separately.
 */
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    multiCapabilities: [
        { browserName: 'chrome' },
        { browserName: 'firefox' },
    ],
    specs: ['spec1.feature', 'spec2.feature', 'spec3.feature']
};

/**
--> [chrome]  ---|--> spec1.feature --> spec2.feature --> spec3.feature
       |
    parallel
       |
--> [firefox] ---|--> spec1.feature --> spec2.feature --> spec3.feature

 */




/**
 * CASE3
 * Execute different set of specs in different browser instances.
 */
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    multiCapabilities: [
        {
            browserName: 'chrome',
            specs: ['spec1.feature']
        },
        {
            browserName: 'firefox',
            specs: ['spec2.feature']
        },
    ]
};

/*

--> [chrome]  ---|--> spec1.feature
       |                
    parallel           
       |
--> [firefox] ---|--> spec2.feature

*/






/**
 * CASE4    [NOTE: We are using this approach]
 * Execute different spec files in parallel with same browser
*/
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    capabilities: {
        browserName: 'chrome',
        specs: [
            'spec1.feature', 'spec2.feature', 'spec3.feature', 'spec4.feature', 'spec5.feature'
        ],
        maxInstances: 5,
        shardTestFiles: true
    }
};
/*
                    |-- [instance 1] --|--> spec1.feature
                    |-- [instance 2] --|--> spec2.feature
 --> [chrome]  ---  |-- [instance 3] --|--> spec3.feature
                    |-- [instance 4] --|--> spec4.feature
                    |-- [instance 5] --|--> spec5.feature
*/




