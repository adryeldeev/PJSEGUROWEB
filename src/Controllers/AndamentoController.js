import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    async createAndamento(req, res) {
        const { observacoes, faseProcessoId, processoId, data } = req.body;
        const userId = req.userId;

        if (!faseProcessoId || !processoId) {
            return res.status(400).json({ message: "Fase e Processo são obrigatórios." });
        }

        try {
            // Verificar se a fase existe
            const fase = await prisma.faseProcesso.findUnique({ where: { id: faseProcessoId } });
            if (!fase) {
                return res.status(404).json({ message: "Fase não encontrada." });
            }

            const andamento = await prisma.andamento.create({
                data: {
                    observacoes,
                    faseProcessoId,
                    processoId,
                    userId,
                    data: data ? new Date(data) : new Date(),
                },
            });

            // Atualizar a fase do processo
            await prisma.processo.update({
                where: { id: processoId },
                data: { faseProcessoId },
            });

            return res.status(201).json({
                error: false,
                message: "Andamento criado com sucesso!",
                andamento,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
    },

    async updateAndamento(req, res) {
        const { id } = req.params;
        const { observacoes, faseProcessoId, data } = req.body;
        const userId = req.userId;

        try {
            const andamentoExistente = await prisma.andamento.findUnique({ where: { id: parseInt(id) } });
            if (!andamentoExistente) {
                return res.status(404).json({ message: "Andamento não encontrado." });
            }

            // Atualizar andamento
            const andamento = await prisma.andamento.update({
                where: { id: parseInt(id) },
                data: {
                    observacoes,
                    faseProcessoId,
                    userId,
                    data: data ? new Date(data) : new Date(),
                },
            });

            // Atualizar a fase do processo se a fase mudou
            if (faseProcessoId) {
                await prisma.processo.update({
                    where: { id: andamentoExistente.processoId },
                    data: { faseProcessoId },
                });
            }

            return res.status(200).json({
                error: false,
                message: "Andamento atualizado com sucesso!",
                andamento,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
    },

    async findAll(req, res) {
        const userId = req.userId;
        const { processoId } = req.query; // Obter o processoId da query string
    
        try {
            const andamentos = await prisma.andamento.findMany({
                where: {
                    userId,
                    processoId: Number(processoId), // Filtrar pelos andamentos do processo específico
                },
                include: {
                    faseProcesso: true,
                    user: true,
                    processo: true,
                },
            });
            return res.status(200).json({ andamentos });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar andamentos." });
        }
    },

    async getById(req, res) {
        const { id } = req.params;
        try {
            const andamento = await prisma.andamento.findUnique({
                where: { id: parseInt(id) },
                include: {
                    faseProcesso: true,
                    user: true,
                    processo: true,
                },
            });
            if (!andamento) {
                return res.status(404).json({ message: "Andamento não encontrado." });
            }
            return res.status(200).json(andamento);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar andamento." });
        }
    },

    async deleteAndamento(req, res) {
        const { id } = req.params;
    
        try {
            // 🔹 Buscar o andamento que será excluído
            const andamentoExcluido = await prisma.andamento.findUnique({
                where: { id: parseInt(id) },
                select: { processoId: true, faseProcessoId: true, data: true }
            });
    
            if (!andamentoExcluido) {
                return res.status(404).json({ message: "Andamento não encontrado." });
            }
    
            const { processoId, createdAt } = andamentoExcluido;
    
            // 🔹 Buscar o andamento anterior (último andamento antes do excluído)
            const ultimoAndamento = await prisma.andamento.findFirst({
                where: {
                    processoId: processoId,
                    data: { lt: andamentoExcluido.data } // ✅ Correto
    },
            orderBy: { data: "desc" } // Ordena para pegar o mais recente antes do excluído
            });
    
            // 🔹 Excluir o andamento
            await prisma.andamento.delete({ where: { id: parseInt(id) } });
    
            // 🔹 Se existir um andamento anterior, atualizar a fase do processo
            if (ultimoAndamento) {
                await prisma.processo.update({
                    where: { id: processoId },
                    data: { faseProcessoId: ultimoAndamento.faseProcessoId }
                });
            }
    
            return res.status(200).json({ message: "Andamento excluído com sucesso." });
    
        } catch (error) {
            console.error("Erro ao excluir andamento:", error);
            return res.status(500).json({ message: "Erro ao excluir andamento." });
        }
    }
};
