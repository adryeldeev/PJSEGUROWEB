import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
    // Criar um novo processo
    async createProcesso(req, res) {
        try {
            const { vitimaId, tipoProcessoId, faseProcessoId, prioridadeId } = req.body;
            const userId = req.userId;

            // Verifica se a vítima existe
            const vitima = await prisma.vitima.findUnique({
                where: { id: vitimaId },
            });

            if (!vitima) {
                return res.status(404).json({ message: "Vítima não encontrada." });
            }

            // Cria o processo
            const novoProcesso = await prisma.processo.create({
                data: {
                    tipoProcessoId: parseInt(tipoProcessoId),
                    faseProcessoId: parseInt(faseProcessoId),
                    vitimaId,
                    prioridadeId: parseInt(prioridadeId),
                    userId,
                },
            });

            return res.status(201).json({
                message: "Processo criado com sucesso.",
                processo: novoProcesso,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao criar o processo.", error });
        }
    },

    // Buscar todos os processos
    async findAll(req, res) {
        try {
            const processos = await prisma.processo.findMany({
                include: {
                    vitima: true, // Inclui informações da vítima
                    tipoProcesso: true,
                    faseProcesso: true,
                    prioridade: true,
                    user: true,
                },
            });

            return res.status(200).json(processos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar os processos.", error });
        }
    },

    // Buscar um processo pelo ID
    async findById(req, res) {
        try {
            const { id } = req.params;

            const processo = await prisma.processo.findUnique({
                where: { id: parseInt(id) },
                include: {
                    vitima: true,
                    tipoProcesso: true,
                    faseProcesso: true,
                    prioridade: true,
                    user: true,
                },
            });

            if (!processo) {
                return res.status(404).json({ message: "Processo não encontrado." });
            }

            return res.status(200).json(processo);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar o processo.", error });
        }
    },

    // Atualizar um processo
    async updateProcesso(req, res) {
        try {
            const { id } = req.params;
            const { tipoProcessoId, faseProcessoId, prioridadeId } = req.body;

            const processoAtualizado = await prisma.processo.update({
                where: { id: parseInt(id) },
                data: {
                    tipoProcessoId: tipoProcessoId ? parseInt(tipoProcessoId) : undefined,
                    faseProcessoId: faseProcessoId ? parseInt(faseProcessoId) : undefined,
                    prioridadeId: prioridadeId ? parseInt(prioridadeId) : undefined,
                },
            });

            return res.status(200).json({
                message: "Processo atualizado com sucesso.",
                processo: processoAtualizado,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao atualizar o processo.", error });
        }
    },

    // Excluir um processo
    async deleteProcesso(req, res) {
        try {
            const { id } = req.params;

            await prisma.processo.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json({ message: "Processo excluído com sucesso." });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao excluir o processo.", error });
        }
    },
};
