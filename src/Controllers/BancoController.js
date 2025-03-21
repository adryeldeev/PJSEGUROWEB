import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


export default {
    async createBanco(req,res){
        const {nome, agencia, conta}= req.body;
        const userId = req.userId;
        
        if (!nome || !agencia ||!conta) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }
        try {
            const bancoExisting = await prisma.banco.findFirst({
                where: { nome, userId }
            });
            if (bancoExisting) {
                return res.status(400).json({ message: "Banco com este nome já existe para este usuário." });
            }
            
            const banco = await prisma.banco.create({
                data: { nome, agencia, conta, userId }
            });
            return res.status(201).json({
                error: false,
                message: "Banco cadastrado com sucesso",
                banco
            });

            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ocorreu um erro ao tentar gravar o banco." });
        }
    },
    async findAllBancos(req, res){
        const userId = req.userId;
        try {
            const bancos = await prisma.banco.findMany({
                where: { userId }
            });
            return res.json({
                error: false,
                message: "Bancos encontrados com sucesso",
                bancos
            });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro ao tentar buscar os bancos." });
            
        }
},
    async findBancoById(req, res){
        const { id } = req.params;
        const userId = req.userId;

        try {
            const banco = await prisma.banco.findFirst({
                where: { id: Number(id), userId }
            });
            if (!banco) {
                return res.status(404).json({ message: "Banco não encontrado." });
            }
            return res.json({
                error: false,
                message: "Banco encontrado com sucesso",
                banco
            });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro ao tentar buscar o banco." });
            
        }
    },
    async updateBanco(req, res){
        const { id } = req.params;
        const { nome, agencia, conta } = req.body;
        const userId = req.userId;
        
        if (!nome ||!agencia ||!conta) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }
        try {
            const bancoExisting = await prisma.banco.findFirst({
                where: { id: Number(id), userId }
            });
            if (!bancoExisting) {
                return res.status(404).json({ message: "Banco não encontrado." });
            }
            
            const banco = await prisma.banco.update({
                where: { id: Number(id) },
                data: { nome, agencia, conta }
            });
            return res.status(200).json({
                error: false,
                message: "Banco atualizado com sucesso",
                banco
            });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro ao tentar atualizar o banco." });
            
        }

},
    async deleteBanco(req, res){
        const { id } = req.params;
        const userId = req.userId;
        
        try {
            const bancoExisting = await prisma.banco.findFirst({
                where:{id:Number(id), userId}
            })
            if(!bancoExisting){
                return res.status(404).json({message:"Banco não encontrado"})
            }
            const banco = await prisma.banco.delete({
                where:{id:Number(id)}
            })
            return res.status(200).json({
                error:false,
                message:'Banco excluido com sucesso!',
                banco

            })

            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro ao tentar excluir o banco." });
            
        }
    }
}