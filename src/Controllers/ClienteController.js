import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    async createCliente(req, res) {
        const { nome, cpf, rg } = req.body;
        const userId = req.userId;

        if (!nome || !cpf || !rg) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        try {
            const clienteExisting = await prisma.cliente.findFirst({
                where: { cpf, userId }
            });

            if (clienteExisting) {
                return res.status(400).json({ message: "Cliente com este CPF já existe para este usuário." });
            }

            const cliente = await prisma.cliente.create({
                data: { nome, cpf, rg, userId }
            });

            return res.status(201).json({
                error: false,
                message: "Cliente cadastrado com sucesso",
                cliente
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar gravar o cliente." });
        }
    },

    async findAllClientes(req, res) {
        const userId = req.userId;

        try {
            const clientes = await prisma.cliente.findMany({
                where: { userId }
            });

            return res.json({
                error: false,
                message: "Clientes encontrados",
                clientes
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar buscar os clientes." });
        }
    },

    async findClienteById(req, res) {
        const { id } = req.params;

        try {
            const clienteExisting = await prisma.cliente.findFirst({
                where: { id: Number(id), userId: req.userId }
            });

            if (!clienteExisting) {
                return res.status(404).json({ message: "Cliente não encontrado." });
            }

            return res.status(200).json({
                error: false,
                message: "Cliente encontrado",
                cliente: clienteExisting
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar buscar o cliente." });
        }
    },

    async updateCliente(req, res) {
        const { id } = req.params;
        const { nome, cpf, rg } = req.body;
        const userId = req.userId;

        if (!nome || !cpf || !rg) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        try {
            const clienteExisting = await prisma.cliente.findFirst({
                where: { id: Number(id), userId }
            });

            if (!clienteExisting) {
                return res.status(404).json({ message: "Cliente não encontrado." });
            }

            const cliente = await prisma.cliente.update({
                where: { id: Number(id) },
                data: { nome, cpf, rg }
            });

            return res.status(200).json({
                error: false,
                message: "Cliente atualizado com sucesso!",
                cliente
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar atualizar o cliente." });
        }
    },

    async deleteCliente(req, res) {
        const { id } = req.params;
        const userId = req.userId;

        try {
            const clienteExisting = await prisma.cliente.findFirst({
                where: { id: Number(id), userId }
            });

            if (!clienteExisting) {
                return res.status(404).json({ message: "Cliente não encontrado." });
            }

            await prisma.cliente.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({
                error: false,
                message: "Cliente excluído com sucesso!"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar excluir o cliente." });
        }
    }
};
