import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    async createSinistro(req,res){
        const { } = req.body;
        const userId = req.userId;
        
        if (!veiculoId ||!tipoDeSinistroId ||!causaId ||!valor ||!data) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        const sinistro = await prisma.sinistro.create({
            data: {
                veiculoId,
                tipoDeSinistroId,
                causaId,
                valor,
                data,
                user: { connect: { id: userId } }
            }
        });
        
        return res.status(201).json({
            error: false,
            message: "Sinistro criado com sucesso!",
            sinistro
        });

    }

}