
const controllers = ((services) => {
    return async (req, res) => {
        try {
            const serviceControllers = await services(req)

            if (!serviceControllers.success) throw serviceControllers;
            return res.status(serviceControllers.statusCode || 200).json({
                message: serviceControllers.message,
                result: serviceControllers.data
            }).redirect(serviceControllers.redirect)
        } catch (err) {
            console.log(err)
            return res.status(err.statusCode).json({
                message: err.message
            })
        }
    }
})


module.exports = controllers