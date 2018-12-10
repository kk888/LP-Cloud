const swipl = require('swipl');
const parsedArg = require('minimist')(process.argv.slice(2));

if (parsedArg._.length < 2) {
    console.error("Usage: " + process.argv[1] + " basePlFile query [-n maxNumberOfAnswer | -a | -r]");
    console.error("Option a to assert goal. Query must contain only one fact");
    console.error("Option r to retract goal. Query must contain only one fact");
    process.exit(1);
}

try {
    swipl.call('eval:consult(' + parsedArg._[0] + ')');
} catch (error) {
    console.error(error.message);
    process.exit(2);
}

let result = "";

if (parsedArg.a !== undefined) {
    try {
        swipl.call('eval:assert(' + parsedArg._[1] + ')');
    } catch (error) {
        console.error(error.message);
        process.exit(2);
    }
} else if (parsedArg.r !== undefined) {
    try {
        swipl.call('eval:retract(' + parsedArg._[1] + ')');
    } catch (error) {
        console.error(error.message);
        process.exit(2);
    }
} else {
    if (parsedArg.n !== undefined && (typeof parsedArg.n === 'boolean' || isNaN(parsedArg.n) || parsedArg.n === 0)) {
        console.error("Option n must be a positive number")
        process.exit(1);
    }
    let getNFunc = undefined;
    if (parsedArg.n) {
        var solveN = Number(parsedArg.n);
        getNFunc = () => solveN-- !== 0;
    }
    result = solve(parsedArg._[1], getNFunc);
    result = JSON.stringify(result);
}

swipl.call('tell(\'output.pl\'), eval:listing, told.');

process.stdout.write(result);

function solve(querySrc, procFn = () => true) {
    try {
        debugger;
        let result = [];
        const query = new swipl.Query('eval:' + querySrc);
        let ret = null;
        while ((ret = query.next()) && procFn()) {
            result.push(ret);
        }
        query.close();
        return result;
    } catch (error) {
        console.error(error.message);
        process.exit(3);
    }
}