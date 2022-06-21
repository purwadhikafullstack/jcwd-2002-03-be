const Service = require("../service");
const { User, ForgotPasswordToken, VerificationToken } = require("../../lib/sequelize");
const { Op } = require("sequelize");
const bcrypt = require('bcrypt')
const mustache = require("mustache")
const fs = require("fs");
const mailer = require("../../lib/mailer")
const { nanoid } = require('nanoid');
const moment = require("moment");
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.CLIENT_ID)
const { generateToken } = require("../../lib/jwt")

class authService extends Service {
    static register = async (req) => {
        try {
            const { name, email, password, phone } = req.body;

            const availableEmail = await User.findOne({
                where: {
                    email
                }
            });

            if (availableEmail) {
                return this.handleError({
                    message: "This email has been registered with another account, if you forget your password, you can reset your password",
                    statusCode: 400,
                });
            }

            const hashedPassword = bcrypt.hashSync(password, 5);
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                phone
            });

            const verificationToken = nanoid(40)

            await VerificationToken.create({
                token: verificationToken,
                user_id: newUser.id,
                valid_until: moment().add(1, "hour"),
                is_valid: true,
            });

            const verificationLink = `${process.env.BASE_url}/auth/verify/${verificationToken}`;

            const template = fs
                .readFileSync(__dirname + "/../../templates/verify-template.html")
                .toString();

            const renderedTemplate = mustache.render(template, {
                name,
                verify_url: verificationLink,
            });

            const sentEmail = await mailer({
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
            // const { name, password } = req.body;
            const { credential, password } = req.body;

            const findUser = await User.findOne({
                where: {
                    email: credential
                }
            });

            if (!findUser) {
                return this.handleError({
                    message: "Wrong email address or password",
                    statusCode: 400,
                });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);

            if (!isPasswordCorrect) {
                return this.handleError({
                    message: "wrong name or password",
                    statusCode: 400,
                });
            }

            delete findUser.dataValues.password;

            const token = generateToken({
                id: findUser.id,
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
    static verifyEmail = async (req) => {
        try {
            const { token } = req.params;

            const findToken = await VerificationToken.findOne({
                where: {
                    token,
                    is_valid: true,
                    valid_until: {
                        [Op.gt]: moment().utc(),
                    },
                },
            });

            if (!findToken) {
                this.handleError({
                    message: "your token is invalid",
                    statusCode: "404"
                })
            }

            await User.update(
                { is_verified: true },
                {
                    where: {
                        id: findToken.UserId,
                    },
                }
            );

            findToken.is_valid = false;
            findToken.save();

            return this.handleSuccess({
                message: "email address verified",
                statusCode: 201
            })

            // return res.redirect(`http://localhost:3000/verification`);
        } catch (err) {
            console.log(err);
            this.handleError({})
        }
    }
}


module.exports = authService