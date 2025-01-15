import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


export default {
    async createPrioridade(req,res){
        const { nome, cor_fundo, cor_fonte, activo } = req.body;
        const userId = req.userId; // O userId vem do middleware de autenticação

        if (!nome ||!cor_fundo ||!cor_fonte || activo === undefined) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        try {

            // Verifica se a prioridade já existe para o mesmo usuário
            const prioridadeExisting = await prisma.prioridades.findFirst({
                where: { nome: nome, userId: userId }
            });
            
            if (prioridadeExisting) {
                return res.status(400).json({ message: "Prioridade com este nome já existe para este usuário." });
            }

            const prioridade = await prisma.prioridades.create({
                data: {
                    nome,
                    cor_fundo,
                    cor_fonte,
                    activo,
                    user: { connect: { id: userId } }
                }
            });
            return res.status(201).json({
                error: false,
                message: 'Prioridade criada com sucesso!',
                prioridade
            });
            
        } catch (error) {
            return res.status(500).json({ message: error.message });
    
    }
},
async findAllPrioridades(req,res){
    const userId = req.userId; // O userId vem do middleware de autenticação

    try {
        const prioridades = await prisma.prioridades.findMany({
            where: { userId: userId }
        });
        return res.status(200).json({
            error: false,
            message: 'Prioridades encontradas com sucesso!',
            prioridades
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
},

async findPrioridadeById(req,res){
    const { id } = req.params;
    const userId = req.userId; // O userId vem do middleware de autenticação

    try {
        const prioridadeExisting = await prisma.prioridades.findFirst({
            where: { id: Number(id), userId: userId }
        });

        if(!prioridadeExisting){
            return res.status(404).json({messag:'Prioridad não existe'})
        }
        
        return res.status(200).json({
            error: false,
            message: 'Prioridade encontrada com sucesso!',
            prioridade:prioridadeExisting
        })

        
    } catch (error) {
        return res.status(500).json({ message: error.message });
        
    }

},

async updatePrioridade(req,res){
    const { id } = req.params;
    const { nome, cor_fundo, cor_fonte, activo } = req.body;
    const userId = req.userId; // O userId vem do middleware de autenticação
    
    if (!nome || activo === undefined) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    try {
        // Verifica se a prioridade existe e pertence ao usuário
        const prioridadeExisting = await prisma.prioridades.findUnique({
            where: { id: Number(id) },
            include: { user: true }
        });
        
        if (!prioridadeExisting) {
            return res.status(404).json({ message: "Prioridade não encontrada." });
        }
        
        if (prioridadeExisting.userId!== userId) {
            return res.status(403).json({ message: "Você não tem permissão para editar esta prioridade." });
        }
        
        const prioridade = await prisma.prioridades.update({
            where: { id: Number(id) },
            data: {
                nome,
                cor_fundo,
                cor_fonte,
                activo
            }
        });
        
        return res.status(200).json({
            error: false,
            message: 'Prioridade atualizada com sucesso!',
            prioridade
        });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    
}
},
async deletePrioridade(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        // Verificar se a prioridade existe para o usuário
        const prioridadeExisting = await prisma.prioridades.findFirst({
            where: {
                id: Number(id),
                userId: userId,
            },
        });

        if (!prioridadeExisting) {
            return res.status(404).json({ message: "Prioridade não encontrada." });
        }

        // Excluir a prioridade
        const deletedPrioridades = await prisma.prioridades.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            message: "Prioridade excluída com sucesso.",
            prioridade: deletedPrioridades,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Ocorreu um erro ao tentar excluir a prioridade.",
        });
    }
}


    
}