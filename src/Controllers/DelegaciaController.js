import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    // Criar uma delegacia
    async createDelegacia(req, res) {
        try {
            const { delegacia, uf, cidade, dataBo, numeroBo, processoId } = req.body;
            const userId = req.userId;
            if (!delegacia || !uf || !cidade || !numeroBo || !processoId) {
                return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
            }

            const novaDelegacia = await prisma.delegacia.create({
                data: {
                    delegacia,
                    uf,
                    cidade,
                    dataBo: dataBo ? new Date(dataBo) : undefined,
                    numeroBo,
                    processoId,
                    userId
                }
            });

            return res.status(201).json({
                error: false,
                message: "Delegacia cadastrada com sucesso!",
                delegacia: novaDelegacia
            });

        } catch (error) {
            console.error("Erro ao criar delegacia:", error);
            return res.status(500).json({ error: true, message: "Erro interno do servidor." });
        }
    },

    // Buscar todas as delegacias
    async getAllDelegacias(req, res) {
        try {
            const delegacias = await prisma.delegacia.findMany();
            return res.status(200).json(delegacias);

        } catch (error) {
            console.error("Erro ao buscar delegacias:", error);
            return res.status(500).json({ error: true, message: "Erro interno do servidor." });
        }
    },

    // Buscar uma delegacia por ID
    async getDelegaciaById(req, res) {
        try {
            const { id } = req.params;

            const delegacia = await prisma.delegacia.findUnique({
                where: { id }
            });

            if (!delegacia) {
                return res.status(404).json({ message: "Delegacia não encontrada." });
            }

            return res.status(200).json(delegacia);

        } catch (error) {
            console.error("Erro ao buscar delegacia:", error);
            return res.status(500).json({ error: true, message: "Erro interno do servidor." });
        }
    },

    // Atualizar uma delegacia
    async updateDelegacia(req, res) {
        try {
            const { id } = req.params;
            const { delegacia, uf, cidade, dataBo, numeroBo } = req.body;

            // Verifica se a delegacia existe
            const delegaciaExistente = await prisma.delegacia.findUnique({ where: { id } });

            if (!delegaciaExistente) {
                return res.status(404).json({ message: "Delegacia não encontrada." });
            }

            // Criar objeto de atualização dinâmico
            let dataToUpdate = {};
            if (delegacia !== undefined) dataToUpdate.delegacia = delegacia;
            if (uf !== undefined) dataToUpdate.uf = uf;
            if (cidade !== undefined) dataToUpdate.cidade = cidade;
            if (dataBo !== undefined) dataToUpdate.dataBo = new Date(dataBo);
            if (numeroBo !== undefined) dataToUpdate.numeroBo = numeroBo;

            // Se nenhum dado foi enviado, retorna erro
            if (Object.keys(dataToUpdate).length === 0) {
                return res.status(400).json({ message: "Nenhuma informação para atualizar." });
            }

            // Atualiza a delegacia
            const delegaciaAtualizada = await prisma.delegacia.update({
                where: { id },
                data: dataToUpdate
            });

            return res.status(200).json({
                error: false,
                message: "Delegacia atualizada com sucesso!",
                delegacia: delegaciaAtualizada
            });

        } catch (error) {
            console.error("Erro ao atualizar delegacia:", error);
            return res.status(500).json({ error: true, message: "Erro interno do servidor." });
        }
    },

    // Excluir uma delegacia
    async deleteDelegacia(req, res) {
        try {
            const { id } = req.params;

            // Verifica se a delegacia existe
            const delegaciaExistente = await prisma.delegacia.findUnique({ where: { id } });

            if (!delegaciaExistente) {
                return res.status(404).json({ message: "Delegacia não encontrada." });
            }

            const processosVinculados = await prisma.processo.findMany({
                where: { delegaciaId: id }
            });
            
            if (processosVinculados.length > 0) {
                return res.status(400).json({ message: "Esta delegacia está vinculada a um processo e não pode ser excluída." });
            }
            // Excluir delegacia
            await prisma.delegacia.delete({ where: { id } });

            return res.status(200).json({ message: "Delegacia excluída com sucesso!" });

        } catch (error) {
            console.error("Erro ao excluir delegacia:", error);
            return res.status(500).json({ error: true, message: "Erro interno do servidor." });
        }
    }
};
