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

        // Criar o andamento
        const andamento = await prisma.andamento.create({
            data: {
                observacoes,
                faseProcessoId,  // Aqui é onde a mudança ocorre
                processoId,
                userId,
                data: data ? new Date(data) : new Date(), 
            },
        });

        // Atualizar a fase do processo com a última fase registrada
        await prisma.processo.update({
            where: { id: processoId },
            data: { faseProcessoId },
        });

        return res.status(201).json({
            error: false,
            message: "Andamento criado e fase do processo atualizada!",
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
            const { observacoes, faseProcessoId, data } = req.body;
            const userId = req.userId;
        
            if (!faseProcessoId || !observacoes) {
                return res.status(400).json({ message: "Fase e Observações são obrigatórias." });
            }
        
            try {
                const andamento = await prisma.andamento.findUnique({
                    where: { id: Number(id) },
                });
        
                if (!andamento || andamento.userId !== userId) {
                    return res.status(404).json({ message: "Andamento não encontrado ou você não tem permissão." });
                }
        
                const andamentoAtualizado = await prisma.andamento.update({
                    where: { id: Number(id) },
                    data: {
                        observacoes,
                        faseProcessoId,
                        data: data ? new Date(data) : andamento.data, // Se a data for enviada, atualiza; senão, mantém a existente
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
                fase: true, // Inclui nome da fase
                user: true, // Inclui informações do usuário que cadastrou
            },
            orderBy: {
                data: "desc", // Ordena da mais recente para a mais antiga
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
}
}
