import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
  async createProcesso(req, res) {
    const { 
      tipoProcessoId, // ID do tipo de processo
      faseProcessoId, // ID da fase inicial do processo
      vitimaId, // ID da vítima associada
      status, // Status inicial do processo
    } = req.body;
   const userId= userId // ID do usuário que está criando o processo

    try {
      // Validação: verificar se a vítima, o tipo de processo e a fase existem
      const vitimaExiste = await prisma.vitima.findUnique({ where: { id: vitimaId } });
      if (!vitimaExiste) {
        return res.status(404).json({ message: "Vítima não encontrada." });
      }

      const tipoProcessoExiste = await prisma.tiposDeProcesso.findUnique({ where: { id: tipoProcessoId } });
      if (!tipoProcessoExiste) {
        return res.status(404).json({ message: "Tipo de processo não encontrado." });
      }

      const faseProcessoExiste = await prisma.faseProcesso.findUnique({ where: { id: faseProcessoId } });
      if (!faseProcessoExiste) {
        return res.status(404).json({ message: "Fase de processo não encontrada." });
      }

      // Criar o processo
      const novoProcesso = await prisma.processo.create({
        data: {
          numero,
          tipoProcessoId,
          faseProcessoId,
          vitimaId,
          status,
          userId, // Associar o usuário que criou o processo
        },
      });

      // Retornar o processo criado para redirecionar no frontend
      res.status(201).json({
        message: "Processo criado com sucesso!",
        processo: novoProcesso,
      });
    } catch (error) {
      console.error("Erro ao criar processo:", error);
      res.status(500).json({ message: "Erro ao criar processo.", error });
    }
  },
};
