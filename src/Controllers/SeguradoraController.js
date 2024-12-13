import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
  async createSeguradora(req, res) {
    const { nome } = req.body;
    const userId = req.userId;

    if (!nome) {
      return res.status(400).json({ message: 'Preencha todos os campos!' });
    }

    try {
      const seguradoraExisting = await prisma.seguradora.findFirst({
        where: { nome, userId },
      });

      if (seguradoraExisting) {
        return res.status(400).json({ message: 'Seguradora já cadastrada!' });
      }

      const seguradora = await prisma.seguradora.create({
        data: { nome, userId },
      });

      return res.status(201).json({
        error: false,
        message: 'Seguradora cadastrada com sucesso!',
        seguradora,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Falha ao cadastrar a seguradora' });
    }
  },

  async getSeguradoras(req, res) {
    const userId = req.userId;

    try {
      const seguradoras = await prisma.seguradora.findMany({
        where: { userId },
      });

      return res.status(200).json({
        error: false,
        message: 'Seguradoras encontradas!',
        seguradoras,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Falha ao buscar as seguradoras' });
    }
  },

  async getSeguradorasById(req, res) {
    const { id } = req.params;

    try {
      const seguradoraExisting = await prisma.seguradora.findFirst({
        where: { id: Number(id), userId: req.userId },
      });

      if (!seguradoraExisting) {
        return res.status(404).json({ message: 'Seguradora não encontrada!' });
      }

      return res.status(200).json({
        error: false,
        message: 'Seguradora encontrada!',
        seguradora: seguradoraExisting,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Ocorreu um erro ao tentar buscar a seguradora',
      });
    }
  },

  async updateSeguradora(req, res) {
    const { id } = req.params;
    const { nome } = req.body;
    const userId = req.userId;

    if (!nome) {
      return res.status(400).json({ message: 'Preencha todos os campos!' });
    }

    try {
      const seguradora = await prisma.seguradora.findFirst({
        where: { id: Number(id), userId },
      });

      if (!seguradora) {
        return res.status(404).json({ message: 'Seguradora não encontrada!' });
      }

      const updatedSeguradora = await prisma.seguradora.update({
        where: { id: Number(id) },
        data: { nome },
      });

      return res.status(200).json({
        error: false,
        message: 'Seguradora atualizada com sucesso!',
        seguradora: updatedSeguradora,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Falha ao atualizar a seguradora',
      });
    }
  },
  async deleteSeguradora(req, res) {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const seguradora = await prisma.seguradora.findFirst({
          where: { id: Number(id), userId },
        });
        if (!seguradora) {
          return res.status(404).json({ message: 'Seguradora não encontrada!' });
        }
        await prisma.seguradora.delete({
          where: { id: Number(id) },
        });
        return res.status(200).json({
          error: false,
          message: 'Seguradora deletada com sucesso!',
          seguradora:seguradora  
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Falha ao deletar a seguradora' });
        
    }
}
};
