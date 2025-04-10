import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    async createTipoDeVeiculo(req, res) {
        const { marca, modelo, placa, ano, } = req.body;
        const userId = req.userId;

        if (!ano || !placa || !marca || !modelo) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        try {
            // Verifica se já existe um tipo de veículo com o mesmo nome
            let tipoDeVeiculo = await prisma.tipoDeVeiculo.findFirst({
                where: { placa }
            });

            if (tipoDeVeiculo) {
                // Se já existe, apenas retorna os dados
                return res.status(200).json({
                    error: false,
                    message: "Tipo de veículo já cadastrado.",
                    tipoDeVeiculo
                });
            }

            // Caso contrário, cria um novo registro
            tipoDeVeiculo = await prisma.tipoDeVeiculo.create({
                data: { placa, marca, modelo,ano, userId }
            });

            return res.status(201).json({
                error: false,
                message: "Tipo de veículo cadastrado com sucesso.",
                tipoDeVeiculo
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao tentar cadastrar o tipo de veículo." });
        }
    },

    async findAllTipoVeiculos(req, res) {
        try {
            const userId = req.userId
            const tipoVeiculos = await prisma.tipoDeVeiculo.findMany({
                where:{
                    userId:userId
                }
            });
          
            return res.status(200).json({ error: false, tipoVeiculos });
        } catch (error) {
            console.error("Erro ao buscar tipos de veículos:", error);
            res.status(500).json({ message: "Erro ao buscar os tipos de veículos." });
        }
    },

    async findTipoDeVeiculoById(req, res) {
        const { id } = req.params;

        try {
            const tipoDeVeiculo = await prisma.tipoDeVeiculo.findUnique({
                where: { id: Number(id) }
            });

            if (!tipoDeVeiculo) {
                return res.status(404).json({ message: "Tipo de veículo não encontrado." });
            }

            return res.status(200).json({ error: false, tipoDeVeiculo });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao buscar o tipo de veículo." });
        }
    },

    async updateTipoDeVeiculo(req, res) {
        const { id } = req.params;
        const { ano, placa, marca, modelo } = req.body;

        try {
            const tipoDeVeiculoExistente = await prisma.tipoDeVeiculo.findUnique({
                where: { id: Number(id) }
            });

            if (!tipoDeVeiculoExistente) {
                return res.status(404).json({ message: "Tipo de veículo não encontrado." });
            }

            // Criando objeto de atualização dinâmico
            const dataToUpdate = {};
            if (ano !== undefined) dataToUpdate.ano = ano;
            if (placa !== undefined) dataToUpdate.placa = placa;
            if (marca !== undefined) dataToUpdate.marca = marca;
            if (modelo !== undefined) dataToUpdate.modelo = modelo;

            const tipoDeVeiculoAtualizado = await prisma.tipoDeVeiculo.update({
                where: { id: Number(id) },
                data: dataToUpdate
            });

            return res.status(200).json({
                error: false,
                message: "Tipo de veículo atualizado com sucesso.",
                tipoDeVeiculo: tipoDeVeiculoAtualizado
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao atualizar o tipo de veículo." });
        }
    },

    async deleteTipoDeVeiculo(req, res) {
        const { id } = req.params;

        try {
            const tipoDeVeiculoExistente = await prisma.tipoDeVeiculo.findUnique({
                where: { id: Number(id) }
            });

            if (!tipoDeVeiculoExistente) {
                return res.status(404).json({ message: "Tipo de veículo não encontrado." });
            }
           // Verifica se o TipoDeVeiculo está vinculado a algum Sinistro
                const sinistroAssociado = await prisma.sinistro.findFirst({
                where: { tipoDeVeiculoId: tipoDeVeiculoExistente.id }
            });

            if (sinistroAssociado) {
                return res.status(400).json({ 
                    message: "Este tipo de veículo está associado a um sinistro e não pode ser excluído." 
                });
            }

            await prisma.tipoDeVeiculo.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({
                error: false,
                message: "Tipo de veículo excluído com sucesso."
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao excluir o tipo de veículo." });
        }
    }
};
