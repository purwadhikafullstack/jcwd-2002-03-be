const Service = require("../service");
const { User, ForgotPasswordToken, VerificationToken } = require("../../lib/sequelize");
const { Op } = require("sequelize");
const bcrypt = require('bcrypt')
const mustache = require("mustache")
const fs = require("fs");
const mailer = require("../../lib/mailer")
const nanoid = require('nanoid')


class authService extends Service {
    static register = async (req) => {
        try {
            const { username, email, password, full_name, phone } = req.body;

            const availableUser = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email }],
                },
            });

            if (availableUser) {
                return this.handleError({
                    message: "Usernama not available or email has been registered",
                    statusCode: 400,
                });
            }

            const hashedPassword = bcrypt.hashSync(password, 5);
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                full_name,
                phone
            });

            const verificationToken = nanoid(40)

            await VerificationToken.create({
                token: verificationToken,
                user_id: newUser.id,
                valid_until: moment().add(1, "hour"),
                is_valid: true,
            });

            const verificationLink = `${process.env.BASE_url}/${verificationToken}`;

            const template = fs
                .readFileSync(__dirname + "/../../templates/verify.html")
                .toString();

            const renderedTemplate = mustache.render(template, {
                username,
                verify_url: verificationLink,
            });

            await mailer({
                to: email,
                subject: "Verify your account!",
                html: renderedTemplate,
            });

            return this.handleSuccess({
                message: "your account was created successfully,please check email to verify email address",
                statusCode: 201,
                data: newUser,
            });
        } catch (err) {
            console.log(err);

            this.handleError({
                message: "Server Error",
                statusCode: 500,
            });
        }
    };
    static login = async (req) => {
        try {
            // const { username, password } = req.body;
            const { credential, password } = req.body;

            const findUser = await User.findOne({
                where: {
                    [Op.or]: [{ username: credential }, { email: credential }],
                },
            });

            if (!findUser) {
                return this.handleError({
                    message: "Wrong username or password",
                    statusCode: 400,
                });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);

            if (!isPasswordCorrect) {
                return this.handleError({
                    message: "wrong username or password",
                    statusCode: 400,
                });
            }

            delete findUser.dataValues.password;

            const token = generateToken({
                id: findUser.id,
                role: findUser.role,
            });

            return this.handleSuccess({
                message: "Logged in user",
                statusCode: 200,
                data: {
                    user: findUser,
                    token,
                },
            });
        } catch (err) {
            console.log(err);
            return this.handleError({
                message: "Server Error",
                statusCode: 500,
            });
        }
    };

}

module.exports = authService