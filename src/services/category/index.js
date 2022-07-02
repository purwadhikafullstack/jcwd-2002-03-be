const Service = require("../service")
const { Category } = require("../../lib/sequelize")

class categorySevice extends Service {
    static addNewCategory = async (req) => {
        try {
            const { category_name } = req.body

            const duplicate = await Category.findOne({
                where: {
                    category_name
                }
            })

            if (duplicate) {
                return this.handleError({
                    message: "data duplicate please try another category_name",
                    statusCode: 400
                })
            }

            const newCategory = await Category.create({ category_name })

            return this.handleSuccess({
                message: "new category added successfuly",
                statusCode: 201,
                data: newCategory
            })
        } catch (err) {
            console.log(err)
            return this.handleError({})
        }
    }

    static findAllCategory = async (req) => {
        try {
            const allCategory = await Category.findAll()

            return this.handleSuccess({
                message: "success get all category",
                statusCode: 201,
                data: allCategory
            })
        } catch (err) {
            console.log(err)
            return this.handleError({})
        }
    }
}

module.exports = categorySevice