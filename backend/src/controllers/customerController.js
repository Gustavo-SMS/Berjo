const { prismaClient } = require('../database/prismaClient')

const getAll = async (req, res) => {
    const customers = await prismaClient.customer.findMany({
        include: {
            address: true
        }
    })

    return res.json(customers)
}

const getOne = async (req, res) => {
    const id = req.params.id

    const customer = await prismaClient.customer.findUnique({
        where: {
            id
        }
    })

    return res.json(customer)
}

const getCustomerByName = async (req, res) => {
    const name = req.params.name

    const customer = await prismaClient.customer.findMany({
        where: {
            name
        }
    })

    return res.json(customer)
}

const createCustomer = async (req, res) => {
    const { name, email, phone, street, house_number, city, district, zip  } = req.body
    
    const customer = await prismaClient.customer.create({
        data: {
            name,
            email,
            phone: parseInt(phone),
            address: {
                create: {
                    street,
                    house_number: parseInt(house_number),
                    city,
                    district,
                    zip: parseInt(zip)
                }
            }
        }
    })

    return res.json(customer)
}

const updateCustomer = async (req, res) => {
    const { id, name, email, phone, street, house_number, city, district, zip  } = req.body
    
    const customer = prismaClient.customer.update({
        where: {
            id
        },
        data: {
            name: name || undefined,
            email: email || undefined,
            phone: phone || undefined
        }
    })

    const address = prismaClient.address.update({
        where: {
            customer_id: id
        },
        data: {
            street: street || undefined,
            house_number: house_number || undefined,
            city: city || undefined,
            district: district || undefined,
            zip: zip || undefined
        }
    })

    const transaction = await prismaClient.$transaction([customer, address])

    return res.json(transaction)
}

const deleteCustomer = async (req, res) => {
    const id = req.params.id

    const deleteAdress = prismaClient.address.delete({
        where: {
          customer_id: id
        },
      })

    const deleteOrders = prismaClient.order.deleteMany({
        where: {
          customer_id: id
        },
      })

    const deleteCustomer = prismaClient.customer.delete({
        where: {
            id
        }
    })

    const transaction = await prismaClient.$transaction([deleteAdress, deleteOrders, deleteCustomer])

    return res.json(transaction)
}


module.exports = {
    getAll,
    getOne,
    getCustomerByName,
    createCustomer,
    updateCustomer,
    deleteCustomer,
}