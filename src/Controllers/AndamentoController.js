import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    
    
    
        // CREATE - Criar um novo andamento
        async create(req, res) {
            const { observacoes, faseId, processoId } = req.body;
            const userId = req.userId;
    
            if (!faseId || !processoId) {
                return res.status(400).json({ message: "Fase e Processo são obrigatórios." });
            }
    
            try {
                // Verificar se a fase existe
                const fase = await prisma.faseProcesso.findUnique({ where: { id: faseId } });
                if (!fase) {
                    return res.status(404).json({ message: "Fase não encontrada." });
                }
    
                // Criar o andamento
                const andamento = await prisma.andamento.create({
                    data: {
                        observacoes,
                        faseId,
                        processoId,
                        userId,
                    },
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
    
        // READ - Buscar todos os andamentos
        async findAll(req, res) {
            const userId = req.userId;
    
            try {
                const andamentos = await prisma.andamento.findMany({
                    where: { userId },
                    include: {
                        fase: true, // Inclui os dados da fase associada
                        processo: true, // Inclui os dados do processo associado
                    },
                });
    
                return res.status(200).json({
                    error: false,
                    message: "Andamentos encontrados com sucesso!",
                    andamentos,
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Erro interno no servidor." });
            }
        },
    
        // UPDATE - Atualizar um andamento
        async updateAndamento(req, res) {
            const { id } = req.params;
            const { observacoes, faseId } = req.body;
            const userId = req.userId;
    
            if (!faseId || !observacoes) {
                return res.status(400).json({ message: "Fase e Observações são obrigatórias." });
            }
    
            try {
                // Verificar se o andamento existe
                const andamento = await prisma.andamento.findUnique({
                    where: { id: Number(id) },
                });
    
                if (!andamento || andamento.userId !== userId) {
                    return res.status(404).json({ message: "Andamento não encontrado ou você não tem permissão." });
                }
    
                // Atualizar o andamento
                const andamentoAtualizado = await prisma.andamento.update({
                    where: { id: Number(id) },
                    data: {
                        observacoes,
                        faseId,
                    },
                });
    
                return res.status(200).json({
                    error: false,
                    message: "Andamento atualizado com sucesso!",
                    andamento: andamentoAtualizado,
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Erro interno no servidor." });
            }
        },
    
        // DELETE - Excluir um andamento
        async deleteAndamento(req, res) {
            const { id } = req.params;
            const userId = req.userId;
    
            try {
                // Verificar se o andamento existe
                const andamento = await prisma.andamento.findUnique({
                    where: { id: Number(id) },
                });
    
                if (!andamento || andamento.userId !== userId) {
                    return res.status(404).json({ message: "Andamento não encontrado ou você não tem permissão." });
                }
    
                // Excluir o andamento
                await prisma.andamento.delete({
                    where: { id: Number(id) },
                });
    
                return res.status(200).json({
                    error: false,
                    message: "Andamento deletado com sucesso!",
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Erro interno no servidor." });
            }
        }, 
async findByProcessoId(req, res) {
    const { processoId } = req.params;

    try {
        const andamentos = await prisma.andamento.findMany({
            where: { processoId: Number(processoId) },
            include: {
                fase: true, // Inclui dados da fase
                user: true, // Inclui dados do usuário
            },
        });

        if (!andamentos.length) {
            return res.status(404).json({ message: "Nenhum andamento encontrado para este processo." });
        }

        return res.status(200).json({
            error: false,
            message: "Andamentos encontrados com sucesso!",
            andamentos,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
}
}
