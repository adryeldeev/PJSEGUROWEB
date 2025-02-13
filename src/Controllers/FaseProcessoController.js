import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    async createProcesso(req, res) {
        const { nome, cor_fundo, cor_fonte, pendencia, muda_fase, activo } = req.body;  // Incluindo o status
        const userId = req.userId;
    
        if (!nome || !cor_fundo || !cor_fonte || typeof pendencia !== "boolean" || typeof muda_fase !== "boolean" || typeof activo !== "boolean" ) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios corretamente." });
        }
    
        try {
            const processoExisting = await prisma.faseProcesso.findFirst({
                where: { nome, userId }
            });
    
            if (processoExisting) {
                return res.status(400).json({ message: "Processo com este nome já existe para este usuário." });
            }
    
            const processo = await prisma.faseProcesso.create({
                data: {
                    nome,
                    cor_fundo,
                    cor_fonte,
                    pendencia,
                    muda_fase,
                    activo,
                    userId
                }
            });
    
            return res.status(201).json({
                error: false,
                message: "Processo criado com sucesso!",
                processo
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    },

    async findAll(req, res) {
        const userId = req.userId;

        try {
            const processos = await prisma.faseProcesso.findMany({
                where: { userId }
            });

            return res.status(200).json(
                {
                    error: false,
                    message: 'Processos encontrados com sucesso!',
                    processos
                });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    },
    async findProcessoById(req,res){
        const { id } = req.params;
        const userId = req.userId;
        try {
            const processo = await prisma.faseProcesso.findFirst({
                where: { id: Number(id), userId }
            });
            if (!processo) {
                return res.status(404).json({ message: "Processo não encontrado." });
            }
            return res.json({
                error: false,
                message: "Processo encontrado com sucesso",
                processo
            });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
            
        }
    },

    async updateProcesso(req, res) {
        const { id } = req.params;
        const { nome, cor_fundo, cor_fonte, pendencia, muda_fase, activo } = req.body;
        const userId = req.userId;

        if (!nome || pendencia === undefined || muda_fase === undefined || activo === undefined) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios corretamente." });
        }
        try {
            const processoExisting = await prisma.faseProcesso.findUnique({
                where: { id: Number(id) }
            });

            if (!processoExisting || processoExisting.userId !== userId) {
                return res.status(404).json({ message: "Processo não encontrado ou você não tem permissão." });
            }

            const processo = await prisma.faseProcesso.update({
                where: { id: Number(id) },
                data: {
                    nome,
                    cor_fundo,
                    cor_fonte,
                    pendencia,
                    muda_fase,
                    activo
                }
            });

            return res.status(200).json({
                error: false,
                message: "Sucesso: Processo atualizado com sucesso!",
                processo
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    },

    async deleteProcesso(req, res) {
        const { id } = req.params;
        const userId = req.userId;

        try {
            const processoExisting = await prisma.faseProcesso.findUnique({
                where: { id: Number(id) }
            });

            if (!processoExisting || processoExisting.userId !== userId) {
                return res.status(404).json({ message: "Processo não encontrado ou você não tem permissão." });
            }

            await prisma.faseProcesso.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({
                error: false,
                message: "Sucesso: Processo deletado com sucesso!"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }
};
