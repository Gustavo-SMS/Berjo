const Joi = require('joi')

const userSchema = {
    login: Joi.string().alphanum().min(3).max(30).required(), 
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.ref('password').required()
}

const loginSchema = {
    login: Joi.string().alphanum().min(3).max(30).required(), 
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
}

const customerSchema = {
    name: Joi.string().max(70).required(), 
    email: Joi.string().email().required(), 
    phone: Joi.number().required(), 
    street: Joi.string().required(), 
    house_number: Joi.number().integer(), 
    city: Joi.string().required(), 
    district: Joi.string().required(), 
    zip: Joi.number().integer().required()
}

// const orderSchema = {
//     customer, 
//     blinds
// }

const blindSchema = {
    quantity: Joi.number().required(), 
    width: Joi.number().required(), 
    height: Joi.number().required(), 
    command_height: Joi.number().required(), 
    model: Joi.string().min(1).max(3).required(), 
    observation: Joi.string().max(250), 
    // blindTypeId: 
    // orderId: 
}

const blindTypeSchema = {
    type: Joi.string().required(), 
    collection: Joi.string().required(), 
    color: Joi.string().required(), 
    max_width: Joi.number(), 
    price: Joi.number().required()
}

module.exports = {
    userSchema,
    loginSchema,
    customerSchema,
    blindSchema,
    blindTypeSchema,
}