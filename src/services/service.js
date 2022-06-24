class Service {
    static handleError = ({ message = "Server error", statusCode = 500, redirect = "" }) => {
        return {
            success: false,
            message,
            statusCode,
            redirect
        };
    };

    static handleSuccess = ({
        data = undefined,
        message = "Request success",
        statusCode = 200,
        redirect = ""
    }) => {
        return {
            success: true,
            data,
            message,
            statusCode,
            redirect
        };
    }
}

module.exports = Service