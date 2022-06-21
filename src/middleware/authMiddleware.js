const { verifyToken } = require("../lib/jwt")

const authorizedToken = (req, res, next) => {
    try {
        const token = req.headers.authorization

        const verifiedToken = verifyToken(token)
        req.token = verifiedToken

        next()
    } catch (err) {
        if (err.message === "jwt expired") {
            return res.status(419).json({
                message: "token expired"
            })
        }

        return res.status(401).json({
            message: err.message
        })
    }
}

module.exports = { authorizedToken }