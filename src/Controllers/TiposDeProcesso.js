import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    async createTiposProcesso(req, res) {
        const { nome, activo } = req.body;
        const userId = req.userId;

        if (!nome || typeof activo !== "boolean") {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        try {
            const tipoProcessoExisting = await prisma.tiposDeProcesso.findFirst({
                where: { nome, userId }
            });
            if (tipoProcessoExisting) {
                return res.status(400).json({ message: "Tipo de processo com este nome já existe para este usuário." });
            }

            const tipoProcesso = await prisma.tiposDeProcesso.create({
                data: { nome, activo, userId }
            });
            return res.status(201).json(tipoProcesso);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro ao tentar gravar o tipo de processo." });
        }
    },

    async findAllTiposProcesso(req, res) {
        const userId = req.userId;

        try {
            const tiposProcesso = await prisma.tiposDeProcesso.findMany({
                where: { userId }
            });
            return res.json(tiposProcesso);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ocorreu um erro ao tentar buscar os tipos de processo." });
        }
    },

    async updateTiposProcesso(req, res) {
        const { id } = req.params;
        const { nome, activo } = req.body;
        const userId = req.userId;
      
        // Converte o `id` para inteiro
        const intId = parseInt(id, 10);  // ou Number(id)
      
        if (!nome || typeof activo !== "boolean") {
          return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }
      
        try {
          const tipoProcessoExisting = await prisma.tiposDeProcesso.findUnique({
            where: { id: intId },  // Usando `intId` aqui
          });
      
          if (!tipoProcessoExisting || tipoProcessoExisting.userId !== userId) {
            return res.status(404).json({ message: "Tipo de processo não encontrado." });
          }
      
          const tipoProcesso = await prisma.tiposDeProcesso.update({
            where: { id: intId },  // Usando `intId` aqui também
            data: { nome, activo },
          });
      
          return res.json(tipoProcesso);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Ocorreu um erro ao tentar atualizar o tipo de processo." });
        }
      },

    async deleteTiposProcesso(req, res) {
        const { id } = req.params; // Pega o id da URL
        const userId = req.userId; // Pega o userId do usuário autenticado
      
        try {
          const parsedId = parseInt(id, 10); // Converte o id da URL para inteiro
          if (isNaN(parsedId)) {
            return res.status(400).json({ error: "ID inválido" }); // Verifica se o id é um número válido
          }
      
          // Deleta o tipo de processo no banco de dados com base no id e no userId
          const deletedTipoDeProcesso = await prisma.tiposDeProcesso.delete({
            where: { id: parsedId, userId }, // Garante que o id e o userId correspondam
          });
      
          return res.status(200).json(deletedTipoDeProcesso); // Retorna a resposta com os dados deletados
        } catch (error) {
          console.error(error); // Exibe o erro no console
          return res.status(500).json({ error: "Erro ao excluir tipo de processo." }); // Retorna erro genérico
        }
      }
};
