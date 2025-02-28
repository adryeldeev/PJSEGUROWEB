import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    // Criar ou atualizar sinistro associado ao processo
    async updateOrCreateSinistro(req, res) {
        const { processoId } = req.params;
        const { 
            numero, 
            dataSinistro, 
            dataAbertura, 
            delegaciaId, 
            delegacia, 
            uf,
            cidade,
            dataBo,
            numeroBo,
            tipoDeVeiculoId, 
            nome,
            marca, 
            modelo, 
            placa, 
            ano 
        } = req.body;
        const userId = req.userId;

        // Verifica se o processoId foi passado
        if (!processoId) {
            return res.status(400).json({ message: "Processo é obrigatório." });
        }

        // Verifica se os dados obrigatórios de sinistro foram passados
        if (!numero || !dataSinistro || !dataAbertura) {
            return res.status(400).json({ message: "Número, Data do Sinistro e Data de Abertura são obrigatórios." });
        }

        // Verifica se o processo existe
        const processoExistente = await prisma.processo.findUnique({
            where: { id: parseInt(processoId) },
            include: { sinistro: true }
        });

        // Caso o processo não exista, retorna erro
        if (!processoExistente) {
            return res.status(404).json({ message: "Processo não encontrado." });
        }

        // Inicia uma transação para garantir a consistência dos dados
        const transaction = await prisma.$transaction(async (prisma) => {
            let tipoDeVeiculoIdFinal = tipoDeVeiculoId;
            let delegaciaIdFinal = delegaciaId;

            // Criação ou atualização do Tipo de Veículo, caso o tipoDeVeiculoId não seja passado
            if (tipoDeVeiculoId && !tipoDeVeiculoIdFinal) {
                const novoVeiculo = await prisma.tipoDeVeiculo.create({
                    data: { 
                        nome,
                        marca,
                        modelo,
                        placa,
                        ano,
                        ...(userId && { userId }) // Adiciona userId apenas se existir
                    },
                });
                tipoDeVeiculoIdFinal = novoVeiculo.id;
            } else if (tipoDeVeiculoId) {
                // Atualiza o Tipo de Veículo se o ID for passado
                await prisma.tipoDeVeiculo.update({
                    where: { id: tipoDeVeiculoId },
                    data: { marca, modelo, placa, ano },
                });
            }

            // Criação ou atualização da Delegacia, caso o delegaciaId não seja passado
            if (delegaciaId && !delegaciaIdFinal) {
                const delegaciaValida = (typeof delegacia === 'string' && delegacia.trim() !== '') ? delegacia : null;

                const novaDelegacia = await prisma.delegacia.create({
                    data: { 
                        delegacia: delegaciaValida,
                        uf: uf || null, 
                        cidade: cidade || null, 
                        numeroBo: numeroBo || null, 
                        dataBo: dataBo ? new Date(dataBo) : null,
                        userId 
                    },
                });
                delegaciaIdFinal = novaDelegacia.id;
            } else if (delegaciaId) {
                await prisma.delegacia.update({
                    where: { id: delegaciaId },
                    data: {  
                        delegacia,
                        uf: uf || null, 
                        cidade: cidade || null, 
                        numeroBo: numeroBo || null, 
                        dataBo: dataBo ? new Date(dataBo) : null 
                    },
                });
            }

            // Se o sinistro já existe, pega o id dele para realizar a atualização
            const sinistroExistente = await prisma.sinistro.findUnique({
                where: { processoId: parseInt(processoId) },
            });

            // Se o sinistro não existe, cria um novo
            let sinistro;
            if (sinistroExistente) {
                sinistro = await prisma.sinistro.update({
                    where: { id: sinistroExistente.id },
                    data: {
                        numero,
                        dataSinistro: dataSinistro ? new Date(dataSinistro) : undefined,
                        dataAbertura: dataAbertura ? new Date(dataAbertura) : undefined,
                        tipoDeVeiculoId: tipoDeVeiculoIdFinal,
                        delegaciaId: delegaciaIdFinal,
                    },
                });
            } else {
                sinistro = await prisma.sinistro.create({
                    data: {
                        numero,
                        dataSinistro: dataSinistro ? new Date(dataSinistro) : null,
                        dataAbertura: dataAbertura ? new Date(dataAbertura) : null,
                        userId,
                        processoId: parseInt(processoId),
                        tipoDeVeiculoId: tipoDeVeiculoIdFinal,
                        delegaciaId: delegaciaIdFinal,
                    },
                });
            }

            return sinistro;
        });

        return res.status(200).json({
            error: false,
            message: transaction ? "Sinistro atualizado com sucesso!" : "Sinistro criado com sucesso!",
            sinistro: transaction,
        });
    },

    // Buscar sinistro associado ao processo
    async getSinistroByProcessoId(req, res) {
        try {
            const { processoId } = req.params;

            if (!processoId) {
                return res.status(400).json({ message: "Processo ID é obrigatório." });
            }

            // Busca o sinistro e os dados relacionados
            const sinistro = await prisma.sinistro.findFirst({
                where: { processoId: parseInt(processoId) },
                include: {
                    tipoDeVeiculo: true, // Inclui os dados do tipo de veículo relacionado ao sinistro
                    delegacia: true, // Inclui os dados da delegacia relacionada ao sinistro
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
