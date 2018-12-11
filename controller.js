const helper = require("./helper");
const child_process = require('child_process');
const fs = require("fs");
const path = require('path');

var controllerFn = {
    getPl: (req, res) =>
        req.cookies.prologBase === undefined ?
            helper.sendErrorMsg("Prolog Base not created.", res, 400)
            :
            res.status(200).json({ prologBase: helper.fromB64(req.cookies.prologBase) }),
    replacePl: (req, res) => {
        return new Promise((resolve, reject) => {
            if (req.body.prologBase !== undefined) {
                fs.writeFile("./input.pl", helper.fromB64(req.body.prologBase), err => {
                    if (err) {
                        return sendErrorMsg(err, res);
                    }
                    try {
                        let output = child_process.execSync('swipl -s input.pl -g "write(\'\')." 2>&1 -t halt.').toString();
                        if (!output) {
                            res.cookie('prologBase', req.body.prologBase);
                            req.cookies.prologBase = req.body.prologBase;
                            return resolve({ req, res });
                        } else {
                            return reject("Execution Error: " + output);
                        }
                    } catch (error) {
                        return reject(error.message);
                    }
                });
            } else {
                return resolve(true);
            }
        });
    },
    addPl: (req, res) =>
        controllerFn.replacePl(req, res).then(
            r => controllerFn.arPl(r.req, r.res, "-a")
        ).catch(err => {
            res.status(400).json({ message: err });
        })
    ,
    arPl: (req, res, type) => {
        let cookiepl = '';
        if (req.cookies.prologBase === undefined) {
            controllerFn.createCookie(req, res);
        } else {
            cookiepl = helper.fromB64(req.cookies.prologBase);
        }
        if (!req.body.goal) {
            console.log("arPl: No Goal");
            res.cookie('prologBase', helper.toB64(cookiepl));
            return res.status(200).json({ message: "OK" });
        }
        return fs.writeFile("./input.pl", cookiepl, err => {
            if (err) {
                return sendErrorMsg(err, res);
            }
            try {
                let output = child_process.execSync("node lpexec.js input \'" + req.body.goal.replace(/\.$/, "").replace(/(?=[ ])/g, '\\') + "\' " + type).toString();
                let newBase = fs.readFileSync(path.join(__dirname, "./output.pl"));
                res.cookie('prologBase', helper.toB64(newBase.toString()));
                return res.status(200).json({ message: "OK" });
            }
            catch (error) {
                if (error.status === 1) {
                    return helper.sendErrorMsg(error.stderr.toString(), res);
                } else {
                    return helper.sendErrorMsg(error.stderr.toString(), res, 400);
                }
            }
        });
    },
    createCookie: (req, res) => res.cookie('prologBase', ''),
    solvePl: (req, res) =>
        req.cookies.prologBase === undefined ?
            helper.sendErrorMsg("Prolog Base not created.", res, 400)
            :
            controllerFn.solvePlCore(req, res),
    solvePlCore: (req, res) => {
        let limit = req.params.count ? "-n " + req.params.count : "";
        let cookiepl = helper.fromB64(req.cookies.prologBase);
        if (!req.body.goal) {
            console.error("solvePlCore: No Goal");
            return helper.sendErrorMsg("No goal specified", res, 400);
        }
        return fs.writeFile("./input.pl", cookiepl, err => {
            if (err) {
                return sendErrorMsg(err, res);
            }
            try {
                let output = child_process.execSync("node lpexec.js input \'" + req.body.goal + "\' " + limit).toString();
                let newBase = fs.readFileSync(path.join(__dirname, "./output.pl"));
                res.cookie('prologBase', helper.toB64(newBase.toString()));
                return res.status(200).json({ output: JSON.parse(output) });
            }
            catch (error) {
                if (error.status === 1) {
                    return helper.sendErrorMsg(error.stderr.toString(), res);
                } else {
                    return helper.sendErrorMsg(error.stderr.toString(), res, 400);
                }
            }
        });
    },
};

module.exports = controllerFn;
