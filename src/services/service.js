class Service {
    static handleError = ({
        message = "server Errorr",
        statusCode = 500
    }) => {
        return {
            success: false,
            message,
            statusCode
        }
    }

    static handleSucces = ({
        message = "request Success",
        statusCode = 200,
        data = undefined,
    }) => {
        return {
            success: true,
            message,
            statusCode,
            data
        }
    }
}

module.exports = Service