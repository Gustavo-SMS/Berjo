const { prismaClient } = require('../database/prismaClient')

const getAll = async (req, res) => {
    try {
        const customers = await prismaClient.customer.findMany({
            include: {
                address: true
            }
        })

        if(customers.length === 0) {
            return res.status(404).json({ error: 'Nenhum cliente foi encontrado' })
        }

        return res.status(200).json(customers)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getOne = async (req, res) => {
    const id = req.params.id

    try {
        const customer = await prismaClient.customer.findUnique({
            where: {
                id
            }
        })

        if(!customer) {
            return res.status(404).json({ error: 'Cliente não foi encontrado' })
        }

        return res.status(200).json(customer)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getCustomerByName = async (req, res) => {
    const name = req.params.name

    try {
        const customers = await prismaClient.customer.findMany({
            where: {
                name
            }
        })

        if(customers.length === 0) {
            return res.status(404).json({ error: 'Cliente não foi encontrado' })
        }

        return res.status(200).json(customers)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const createCustomer = async (req, res) => {
    const { name, email, phone, street, house_number, city, district, zip  } = req.body
    
    try {
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

        if(!customer) {
            return res.status(404).json({ error: 'Não foi possível cadastrar o cliente' })
        }

        return res.status(201).json(customer)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateCustomer = async (req, res) => {
    const { id, name, email, phone, street, house_number, city, district, zip  } = req.body
    
    try {
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

        if(!transaction) {
            return res.status(404).json({ error: 'Não foi possível atualizar o cliente' })
        }
    
        return res.status(201).json(transaction)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteCustomer = async (req, res) => {
    const id = req.params.id

    try {
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

        if(!transaction) {
            return res.status(404).json({ error: 'Não foi possível deletar o cliente' })
        }

        return res.status(200).json(transaction)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAll,
    getOne,
    getCustomerByName,
    createCustomer,
    updateCustomer,
    deleteCustomer,
}