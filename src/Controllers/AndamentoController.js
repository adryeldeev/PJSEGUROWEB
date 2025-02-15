import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
        async createAndamento(req, res) {
     const { observacoes, faseProcessoId, processoId, data } = req.body;
     console.log("Data recebida no req.body:", data);
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

        const parseData = (data) => {
            if (!data) return new Date(); // Se não houver data, pega a atual
        
            const parsedDate = Date.parse(data);
            if (!isNaN(parsedDate)) {
                return new Date(parsedDate); // Retorna a data válida
            }
        
            console.warn("Data inválida recebida:", data);
            return new Date(); // Se for inválida, usa a atual para evitar erro
        };
        // Criar o andamento
        const andamento = await prisma.andamento.create({
            data: {
                observacoes,
                faseProcessoId,
                processoId,
                userId,
                data: parseData(data),
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
                const { faseProcessoId } = req.body;  // ID da nova fase do processo
                
                // Atualizar o andamento (presumindo que 'id' é o identificador do andamento)
                const andamento = await prisma.andamento.update({
                    where: { id: Number(id) },
                    data: req.body
                });
          
                // Buscar a fase com o ID fornecido
                const faseProcesso = await prisma.faseProcesso.findUnique({
                    where: { id: faseProcessoId }
                });
          
                if (!faseProcesso) {
                    return res.status(404).json({ message: "Fase não encontrada." });
                }
          
                // Buscar o processo associado ao andamento
                const processo = await prisma.processo.findUnique({
                    where: { id: andamento.processoId }
                });
    
                if (!processo) {
                    return res.status(404).json({ message: "Processo não encontrado." });
                }
          
                // Atualizar o nome da fase no processo (é isso que você deseja fazer)
                const processoAtualizado = await prisma.processo.update({
                    where: { id: processo.id },
                    data: { faseNome: faseProcesso.nome }  // Atualiza o nome da fase
                });
    
                res.json({ andamento, processoAtualizado });  // Retorna o andamento e o processo atualizado
            } catch (error) {
                console.error(error);
                res.status(500).send("Erro ao atualizar andamento");
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
