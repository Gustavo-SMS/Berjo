const Joi = require('joi')

const userSchema = Joi.object({
    login: Joi.string().email().required(), 
    password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.ref("password")
})

const loginSchema = Joi.object({
    login: Joi.string().email().required(), 
    password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

const customerSchema = Joi.object({
    name: Joi.string().min(3).max(70).required(), 
    email: Joi.string().email().required(), 
    phone: Joi.number().required(), 
    street: Joi.string().required(), 
    house_number: Joi.number().integer(), 
    city: Joi.string().required(), 
    district: Joi.string().required(), 
    zip: Joi.number().integer().required()
})

const blindSchema = Joi.object({
    quantity: Joi.number().required(), 
    width: Joi.number().required(), 
    height: Joi.number().required(), 
    command_height: Joi.number().required(), 
    model: Joi.string().min(1).max(3).required(), 
    type: Joi.string().required(),
    observation: Joi.string().min(0).max(250),
})

const blindTypeSchema = Joi.object({
    type: Joi.string().required(), 
    collection: Joi.string().required(), 
    color: Joi.string().required(), 
    max_width: Joi.number(), 
    price: Joi.number().required()
})

module.exports = {
    userSchema,
    loginSchema,
    customerSchema,
    blindSchema,
    blindTypeSchema,
}