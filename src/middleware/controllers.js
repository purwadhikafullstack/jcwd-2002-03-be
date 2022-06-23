
const controllers = ((services) => {
    return async (req, res) => {
        try {
            const serviceControllers = await services(req)

            if (!serviceControllers.success) throw serviceControllers;

            if (serviceControllers.link) {
                return res.status(serviceControllers.statusCode || 200).json({
                    message: serviceControllers.message,
                    result: serviceControllers.data
                }).redirect(serviceControllers.link)
            } else {
                return res.status(serviceControllers.statusCode || 200).json({
                    message: serviceControllers.message,
                    result: serviceControllers.data
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(err.statusCode).json({
                message: err.message
            })
        }
    }
})


module.exports = controllers