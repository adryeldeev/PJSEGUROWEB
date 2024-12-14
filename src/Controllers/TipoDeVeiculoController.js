import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


export default {
    async createTipoDeVeiculo(req,res){
        const {placa, marca, modelo, rcf } = req.body;
        const userId = req.userId;
        
        if (!placa || !marca || !modelo || rcf === undefined) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        try {
            const tipoDeVeiculoExisting = await prisma.tipoDeVeiculo.findFirst({
                where: { placa, userId }
            })
            
            if (tipoDeVeiculoExisting) {
                return res.status(400).json({ message: "Tipo de veículo já cadastrado." });
            }
            
            const tipoDeVeiculo = await prisma.tipoDeVeiculo.create({
                data: { placa, marca, modelo, rcf, userId }
            });
            
            return res.status(201).json({
                error: false,
                message: "Tipo de veículo cadastrado com sucesso.",
                tipoDeVeiculo
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar gravar o tipo de veículo." });
            
        }
    },
    
    async findAllTipoVeiculos(req, res) {
        const userId = req.userId;
        try {
            const tipoVeiculos = await prisma.tipoDeVeiculo.findMany({
                where: { userId }
            });
            
            return res.json({
                error: false,
                tipoVeiculos
            });
            
        } catch (error) {
            return res.status(500).json({
                message:'Erro ao buscar o TipoDeVeiculo'
            })
        }
    
    },
    
    async findTipoDeVeiculoById(req, res) {
        const { id } = req.params;
        
        try {
            const tipoDeVeiculo = await prisma.tipoDeVeiculo.findFirst({
                where: { id: Number(id),userId: req.userId }
            });
            
            if (!tipoDeVeiculo) {
                return res.status(404).json({ message: "Tipo de veículo não encontrado." });
            }
            
            return res.status(200).json({
                error: false,
                message: "Tipo de veículo encontrado",
                tipoDeVeiculo
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar buscar o tipo de veículo." });
        }

    },
    
    async updateTipoDeVeiculo(req, res) {
        const { id } = req.params;
        const { placa, marca, modelo, rcf } = req.body;
        
        if (!placa ||!marca ||!modelo || rcf === undefined) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }
        try {
            const tipoDeVeiculoExisting = await prisma.tipoDeVeiculo.findFirst({
                where: { id: Number(id) }
            });
            
            if (!tipoDeVeiculoExisting) {
                return res.status(404).json({ message: "Tipo de veículo não encontrado." });
            }
            
            const tipoDeVeiculo = await prisma.tipoDeVeiculo.update({
                where: { id: Number(id) },
                data: { placa, marca, modelo, rcf }
            });
            
            return res.status(200).json({
                error: false,
                message: "Tipo de veículo atualizado com sucesso.",
                tipoDeVeiculo
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar atualizar o tipo de veículo." });
            
        }
    },
    
    async deleteTipoDeVeiculo(req, res) {
        const { id } = req.params;
        
        try {
            const tipoDeVeiculoExisting = await prisma.tipoDeVeiculo.findFirst({
                where: { id: Number(id) }
            });
            
            if (!tipoDeVeiculoExisting) {
                return res.status(404).json({ message: "Tipo de veículo não encontrado." });
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
            res.status(500).json({ message: "Ocorreu um erro ao tentar excluir o tipo de veículo." });
        }
    }
}