import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    async updateOrCreateSinistro(req, res) {
        try {
            const { processoId } = req.params;
            const { numero, dataSinistro, valor, dataAbertura, delegaciaId, tipoDeVeiculoId } = req.body;
            const userId = req.userId;

            // Verifica se o processoId foi fornecido
            if (!processoId) {
                return res.status(400).json({ message: "Processo é obrigatório." });
            }

            // Verifica se o processo existe
            const processoExistente = await prisma.processo.findUnique({
                where: { id: parseInt(processoId) },
                include: { sinistro: true } // Pega também o sinistro associado
            });

            if (!processoExistente) {
                return res.status(404).json({ message: "Processo não encontrado." });
            }

            // Verifica se já existe um sinistro associado ao processo
            let sinistroExistente = await prisma.sinistro.findFirst({
                where: {
                    processoId: parseInt(processoId) // Verifica se já existe um sinistro associado ao processo
                }
            });

            let sinistro;

            if (sinistroExistente) {
                // Atualiza o sinistro se já existir
                sinistro = await prisma.sinistro.update({
                    where: { id: sinistroExistente.id }, // Usa o ID do sinistro
                    data: {
                        numero,
                        dataSinistro: dataSinistro ? new Date(dataSinistro) : undefined,
                        dataAbertura: dataAbertura ? new Date(dataAbertura) : undefined,
                        valor,
                        tipoDeVeiculoId: tipoDeVeiculoId || null, // Permitir que seja nulo
                        delegaciaId: delegaciaId || null, // Permitir que seja nulo
                    },
                });
            } else {
                // Caso o sinistro não exista, cria um novo sinistro
                sinistro = await prisma.sinistro.create({
                    data: {
                        numero,
                        dataSinistro: dataSinistro ? new Date(dataSinistro) : null,
                        dataAbertura: dataAbertura ? new Date(dataAbertura) : null,
                        valor,
                        userId,
                        processoId: parseInt(processoId),
                        tipoDeVeiculoId: tipoDeVeiculoId || null,
                        delegaciaId: delegaciaId || null,
                    },
                });
            }

            // Retorna a resposta de sucesso
            return res.status(200).json({
                error: false,
                message: sinistro ? "Sinistro atualizado com sucesso!" : "Sinistro criado com sucesso!",
                sinistro,
            });

        } catch (error) {
            console.error("Erro ao criar/atualizar sinistro:", error);
            return res.status(500).json({ error: true, message: "Erro interno do servidor." });
        }
    }
};
