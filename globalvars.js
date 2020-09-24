const globalVars = module.exports = {
    results: [],
    pushToResults: function (result) {
        globalVars.results.push(result);
    }
}