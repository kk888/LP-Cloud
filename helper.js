
var helper = {
    toB64: raw => Buffer.from(raw).toString('base64'),
    fromB64: b64 => Buffer.from(b64, 'base64').toString('utf8'),
    sendErrorMsg: (errorMsg, res, code = 500) => {
        console.error(errorMsg);
        return res.status(code).json({ message: errorMsg });
    }
};

module.exports = helper;
