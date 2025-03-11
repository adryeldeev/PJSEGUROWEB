import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
  async updateOrCreateSinistro(req, res) {
    try {
      const { processoId } = req.params;
      const { 
        numero, 
        dataSinistro, 
        dataAbertura, 
        tipoDeVeiculoId, 
        delegaciaId, 
        uf, 
        cidade, 
        dataBo, 
        numeroBo, 
        delegacia,
        marca,
        modelo,
        placa,
        ano
      } = req.body;
      const userId = req.userId;

      if (!processoId) {
        return res.status(400).json({ message: "Processo é obrigatório." });
      }

      if (!numero || !dataSinistro || !dataAbertura) {
        return res.status(400).json({ message: "Número, Data do Sinistro e Data de Abertura são obrigatórios." });
      }

      const processoExistente = await prisma.processo.findUnique({
        where: { id: parseInt(processoId) },
        include: { sinistro: true }
      });

      if (!processoExistente) {
        return res.status(404).json({ message: "Processo não encontrado." });
      }

      // Verifica e converte valores numéricos corretamente
      const anoFormatado = !isNaN(ano) && ano !== "" ? parseInt(ano) : null;
      let delegaciaIdFinal = delegaciaId ? parseInt(delegaciaId) : null;
      let tipoDeVeiculoIdFinal = tipoDeVeiculoId ? parseInt(tipoDeVeiculoId) : null;

      // Criar ou atualizar Delegacia se os dados forem fornecidos
      if (!delegaciaId && (delegacia || uf || cidade || dataBo || numeroBo)) {
        const novaDelegacia = await prisma.delegacia.create({
          data: { delegacia, uf, cidade, dataBo: dataBo ? new Date(dataBo) : null, numeroBo, userId },
        });
      
        delegaciaIdFinal = novaDelegacia.id;
      }

      // Criar ou atualizar Tipo de Veículo se necessário
      if (!tipoDeVeiculoId && (marca || modelo || placa || anoFormatado !== null)) {
        const novoVeiculo = await prisma.tipoDeVeiculo.create({
          data: { marca, modelo, placa, ano: anoFormatado, userId },
        });
        console.log('Dados tipo de veiculo:' , novoVeiculo);
        tipoDeVeiculoIdFinal = novoVeiculo.id;
      }

      // Verifica se já existe um sinistro para o processo
      let sinistro;
      const sinistroExistente = await prisma.sinistro.findUnique({
        where: { processoId: parseInt(processoId) },
      });

      if (sinistroExistente) {
        // Atualiza o sinistro existente
        sinistro = await prisma.sinistro.update({
          where: { id: sinistroExistente.id },
          data: {
            numero,
            dataSinistro: new Date(dataSinistro),
            dataAbertura: new Date(dataAbertura),
            tipoDeVeiculoId: tipoDeVeiculoIdFinal || sinistroExistente.tipoDeVeiculoId,
            delegaciaId: delegaciaIdFinal || sinistroExistente.delegaciaId
          },
        });
      } else {
        // Cria um novo sinistro
        sinistro = await prisma.sinistro.create({
          data: {
            numero,
            dataSinistro: new Date(dataSinistro),
            dataAbertura: new Date(dataAbertura),
            tipoDeVeiculoId: tipoDeVeiculoIdFinal || null,
            delegaciaId: delegaciaIdFinal || null,
            processoId: parseInt(processoId),
            userId
          },
        });
      }

      return res.status(200).json({
        error: false,
        message: sinistroExistente ? "Sinistro atualizado com sucesso!" : "Sinistro criado com sucesso!",
        sinistro,
      });
    } catch (error) {
      console.error("Erro ao criar/atualizar sinistro:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async getSinistroByProcessoId(req, res) {
    try {
      const { processoId } = req.params;

      if (!processoId) {
        return res.status(400).json({ message: "Processo ID é obrigatório." });
      }

      const sinistro = await prisma.sinistro.findFirst({
        where: { processoId: parseInt(processoId) },
        include: {
          tipoDeVeiculo: true,
          delegacia: true
        }
      });

      if (!sinistro) {
        return res.status(404).json({ message: "Sinistro não encontrado para este processo." });
      }

      return res.status(200).json(sinistro);
    } catch (error) {
      console.error("Erro ao buscar sinistro:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
};
