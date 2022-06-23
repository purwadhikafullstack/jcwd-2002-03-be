const Service = require("../service");
const { User, ForgotPasswordToken, VerificationToken, Admin } = require("../../lib/sequelize");
const { generateToken } = require("../../lib/jwt")
const { Op } = require("sequelize");
const bcrypt = require('bcrypt')
const mustache = require("mustache")
const fs = require("fs");
const mailer = require("../../lib/mailer")
const { nanoid } = require('nanoid');
const moment = require("moment");
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.CLIENT_ID)

class authService extends Service {
    static register = async (req) => {
        try {
            const { name, email, password } = req.body;

            const checkEmailAdmin = await Admin.findOne({
                where: {
                    email
                }
            })

            if (checkEmailAdmin) {
                return this.handleError({
                    message: "email address not alowed to register, try another email address",
                    statusCode: 404
                })
            }

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
            });

            const verificationToken = nanoid(40)

            await VerificationToken.create({
                token: verificationToken,
                UserId: newUser.id,
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
                return this.handleError({
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

            return this.handleRedirect({
                message: "email address verified",
                statusCode: 201,
                link: `http://localhost:3000/verification`
            })
        } catch (err) {
            console.log(err);
            return this.handleError({})
        }
    }
    static adminRegister = async (req) => {
        try {
            const { name, email, password } = req.body;

            const checkEmailUser = await User.findOne({
                where: {
                    email
                }
            });

            if (checkEmailUser) {
                return this.handleError({
                    message: "This email has been registered as user account, email used by the user cannot be used by the admin",
                    statusCode: 400,
                });
            }

            const checkEmailAdmin = await Admin.findOne({
                where: {
                    email
                }
            });

            if (checkEmailAdmin) {
                return this.handleError({
                    message: "This email has been registered, if you forget your password, you can reset your password",
                    statusCode: 400,
                });
            }

            const hashedPassword = bcrypt.hashSync(password, 5);
            const newAdmin = await Admin.create({
                name,
                email,
                password: hashedPassword,
            });

            return this.handleSuccess({
                message: "your account was created successfully",
                statusCode: 201,
                data: newAdmin,
            });
        } catch (err) {
            console.log(err);

            return this.handleError({
                message: "Server Error",
                statusCode: 500,
            });
        }
    };
    static adminLogin = async (req) => {
        try {
            const { email, password } = req.body

            const findAdmin = await Admin.findOne({
                where: {
                    email
                }
            })

            if (!findAdmin) {
                return this.handleError({
                    message: "wrong email address",
                    statusCode: 400
                })
            }

            const isPasswordCorrect = bcrypt.compareSync(password, findAdmin.password);

            if (!isPasswordCorrect) {
                return this.handleError({
                    message: "Wrong Password",
                    statusCode: 400
                })
            }

            delete findAdmin.dataValues.password

            const token = generateToken({
                id: findAdmin.id
            });

            const user = { ...findAdmin.dataValues, role: "admin" }
            return this.handleSuccess({
                message: "login admin success",
                statusCode: 200,
                data: {
                    user,
                    token,
                },
            })

        } catch (err) {
            console.log(err)
            return this.handleError({})

        }
    }
}


module.exports = authService