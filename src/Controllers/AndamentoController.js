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

            // Função para validar e parsear a data
            const parseData = (data) => {
                if (!data) return new Date(); // Se não houver data, pega a atual

                const parsedDate = Date.parse(data);
                if (!isNaN(parsedDate)) {
                    return new Date(parsedDate); // Retorna a data válida
                }

                console.warn("Data inválida recebida:", data);
                return new Date(); // Se for inválida, usa a atual para evitar erro
            };

            // Criar o novo andamento
            const andamento = await prisma.andamento.create({
                data: {
                    observacoes,
                    faseProcessoId,
                    processoId,
                    userId,
                    data: parseData(data),
                },
            });

            // Atualizar o processo com o novo andamento
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

    
        // READ - Buscar todos os andamentos
        async findAll(req, res) {
            const userId = req.userId;
    
            try {
                const andamentos = await prisma.andamento.findMany({
                    where: { userId },
                    include: {
                        faseProcesso: true, // Inclui os dados da fase associada
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
            try {
                const { id } = req.params;  // ID do andamento a ser atualizado
                const { faseProcessoId, ...dadosAtualizados } = req.body;  // ID da nova fase do processo e outros dados
        
                // Verificar se o andamento existe
                const andamentoExistente = await prisma.andamento.findUnique({
                    where: { id: Number(id) }
                });
        
                if (!andamentoExistente) {
                    return res.status(404).json({ message: "Andamento não encontrado." });
                }
        
                // Verificar se a nova fase do processo existe
                if (faseProcessoId) {
                    const faseProcesso = await prisma.faseProcesso.findUnique({
                        where: { id: faseProcessoId }
                    });
        
                    if (!faseProcesso) {
                        return res.status(404).json({ message: "Fase do processo não encontrada." });
                    }
                }
        
                // Atualizar o andamento
                const andamento = await prisma.andamento.update({
                    where: { id: Number(id) },
                    data: { faseProcessoId, ...dadosAtualizados }
                });
        
                // Buscar o processo associado ao andamento
                const processo = await prisma.processo.findUnique({
                    where: { id: andamento.processoId }
                });
        
                if (!processo) {
                    return res.status(404).json({ message: "Processo não encontrado." });
                }
        
                // Atualizar o nome da fase no processo
                const faseProcesso = await prisma.faseProcesso.findUnique({
                    where: { id: andamento.faseProcessoId }
                });
        
                const processoAtualizado = await prisma.processo.update({
                    where: { id: processo.id },
                    data: { faseNome: faseProcesso ? faseProcesso.nome : null }  // Se a fase existir, atualiza o nome
                });
        
                return res.json({ andamento, processoAtualizado });  // Retorna os dados atualizados
        
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Erro ao atualizar andamento." });
            }
        },
    
        // DELETE - Excluir um andamento
        async deleteAndamento(req, res) {
            const { id } = req.params;
            const userId = req.userId;
    
            try {
                // Buscar o andamento a ser deletado
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
    
                // Buscar outros andamentos do mesmo processo, ordenados por data (mais recentes primeiro)
                const andamentosRestantes = await prisma.andamento.findMany({
                    where: { processoId: andamento.processoId },
                    orderBy: { data: 'desc' } // Pegamos os mais recentes primeiro
                });
    
                if (andamentosRestantes.length > 0) {
                    // Se houver um andamento anterior, ele se torna o atual
                    const ultimoAndamento = andamentosRestantes[0]; // O primeiro da lista ordenada é o mais recente
    
                    // Atualizar o processo para apontar para a fase do último andamento
                    await prisma.processo.update({
                        where: { id: andamento.processoId },
                        data: { faseProcessoId: ultimoAndamento.faseProcessoId },
                    });
                }
    
                return res.status(200).json({
                    error: false,
                    message: "Andamento deletado com sucesso e fase do processo atualizada se necessário.",
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
                        faseProcesso: true, // Inclui nome da fase
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
