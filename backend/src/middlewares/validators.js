const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
const idConfig = Joi.string().alphanum().length(24).hex();
const userNameConfig = Joi.string().min(2).max(30).messages({
  'string.min': 'Минимальная длина поля "name" - 2',
  'string.max': 'Максимальная длина поля "name" - 30',
});

const userAboutConfig = Joi.string().min(2).max(30)
  .messages({
    'string.min': 'Минимальная длина поля "about" - 2',
    'string.max': 'Максимальная длина поля "about" - 30',
  });

const avatarConfig = Joi.string()
  .pattern(urlRegex)
  .message('Поле "avatar" должно быть валидным url-адресом');

const emailConfig = Joi.string().required().email()
  .message('Поле "email" должно быть валидным email-адресом')
  .messages({ 'string.empty': 'Поле "email" должно быть заполнено' });

const passwordConfig = Joi.string().required()
  .messages({ 'string.empty': 'Поле "password" должно быть заполнено' });

const cardNameConfig = Joi.string().required().min(2).max(30);
const urlConfig = Joi.string().required().regex(urlRegex);

const validateId = (req, res, next, err) => {
  celebrate({
    params: Joi.object().keys({
      id: idConfig,
    }),
  });
  next(err);
};

const validateUserCredentials = celebrate({
  body: Joi.object().keys({
    name: userNameConfig,
    about: userAboutConfig,
    avatar: avatarConfig,
    email: emailConfig,
    password: passwordConfig,
  }),
});

const validateUserInfo = (req, res, next, err) => {
  celebrate({
    body: Joi.object().keys({
      name: userNameConfig,
      about: userAboutConfig,
    }),
  });
  next(err);
};

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: avatarConfig,
  }),
});

const validateCardData = celebrate({
  body: Joi.object().keys({
    name: cardNameConfig,
    link: urlConfig,
  }),
});

module.exports = {
  validateId,
  validateUserCredentials,
  validateUserInfo,
  validateUserAvatar,
  validateCardData,
};
