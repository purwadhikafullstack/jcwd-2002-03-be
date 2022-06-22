class Service {
    static handleError = ({ message = "Server error", statusCode = 500 }) => {
        return {
            success: false,
            message,
            statusCode,
        };
    };

    static handleSuccess = ({
        data = undefined,
        message = "Request success",
        statusCode = 200,
    }) => {
        return {
            success: true,
            data,
            message,
            statusCode,
        };
    }

    static handleRedirect = ({
        message = "",
        statusCode = 200,
        link,
        success = true }) => {
        return {
            success,
            message,
            link,
            statusCode
        }
    }
}

module.exports = Service