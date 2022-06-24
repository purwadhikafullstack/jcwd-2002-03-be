const Service = require("../service");
const { User, ForgotPasswordToken, VerificationToken, Admin } = require("../../lib/sequelize");
const { generateToken } = require("../../lib/jwt")
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const mustache = require("mustache");
const fs = require("fs");
const mailer = require("../../lib/mailer");
const { nanoid } = require("nanoid");
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
          message:
            "This email has been registered with another account, if you forget your password, you can reset your password",
          statusCode: 400,
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const verificationToken = nanoid(40);

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
        message:
          "your account was created successfully,please check email to verify email address",
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
        role: "admin"
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

      console.log(findAdmin.dataValues)
      return this.handleSuccess({
        message: "login admin success",
        statusCode: 200,
        data: {
          user: findAdmin,
          token,
        },
      })

    } catch (err) {
      console.log(err)
      return this.handleError({})

    }
  }

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
          statusCode: "404",
        });
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
        statusCode: 201,
        redirect: `http://localhost:3000/verification`,
      });
    } catch (err) {
      console.log(err);
      this.handleError({});
    }
  };
  static login = async (req) => {
    try {
      // const { name, password } = req.body;
      const { credential, password } = req.body;

      const findUser = await User.findOne({
        where: {
          email: credential,
        },
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
  static keepLogin = async (req) => {
    try {
      const { token } = req;

      const renewedToken = generateToken({ id: token.id });

      const findUser = await User.findByPk(token.id);

      delete findUser.dataValues.password;

      return this.handleSuccess({
        message: "Renewed user token",
        data: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log;
      return this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
  static forgotPassword = async (req) => {
    try {
      const { credential } = req.body;

      const findUser = await User.findOne({
        where: {
          email: credential,
        },
      });

      const passwordToken = nanoid(40);

      await ForgotPasswordToken.update(
        { is_valid: false },
        {
          where: {
            UserId: findUser.id,
            is_valid: true,
          },
        }
      );

      await ForgotPasswordToken.create({
        token: passwordToken,
        valid_until: moment().add(1, "hour"),
        is_valid: true,
        UserId: findUser.id,
      });

      const forgotPasswordLink = `http://localhost:3000/change-forgot-password/${passwordToken}`;

      const template = fs
        .readFileSync(__dirname + "/../../templates/forgot-template.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        name: findUser.name,
        forgot_password_url: forgotPasswordLink,
      });

      await mailer({
        to: findUser.email,
        subject: "Forgot password!",
        html: renderedTemplate,
      });

      return this.handleSuccess({
        message: "Your forgot password request was sent",
        statusCode: 201,
      });
    } catch (err) {
      console.log(err);

      this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
  static changePassword = async (req) => {
    try {
      const { password } = req.body;
      const { token } = req.params;

      const findToken = await ForgotPasswordToken.findOne({
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
          message: "Invalid token",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      await User.update(
        { password: hashedPassword },
        {
          where: {
            id: findToken.UserId,
          },
        }
      );

      return this.handleSuccess({
        message: "Change password success",
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
}
module.exports = authService;
