import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    async updateSinistro(req, res) {
        try {
            const { processoId } = req.params; // ID do processo que será atualizado
            const { numero, dataSinistro, valor, dataAbertura, delegaciaId, tipoDeVeiculoId } = req.body;
            const userId = req.userId;
            
            if (!processoId) {
                return res.status(400).json({ message: "Processo é obrigatório." });
            }

            // Verifica se o processo existe
            const processoExistente = await prisma.processo.findUnique({
                where: { id: processoId }
            });

            if (!processoExistente) {
                return res.status(404).json({ message: "Processo não encontrado." });
            }

            // Criar objeto de atualização dinâmico
            let dataToUpdate = {};

            // Se algum dado do sinistro foi enviado, adiciona ao objeto de atualização
            if (numero !== undefined) dataToUpdate.numero = numero;
            if (dataSinistro !== undefined) dataToUpdate.dataSinistro = new Date(dataSinistro);
            if (valor !== undefined) dataToUpdate.valor = valor;
            if (dataAbertura !== undefined) dataToUpdate.dataAbertura = new Date(dataAbertura);

            // Se delegaciaId for enviado, atualiza a relação; se não, mantém a existente
            if (delegaciaId !== undefined) {
                if (delegaciaId === null) {
                    // Caso delegaciaId seja null, desvincula a delegacia
                    dataToUpdate.delegacia = { disconnect: true };
                } else {
                    dataToUpdate.delegacia = { connect: { id: delegaciaId } };
                }
            }

            // Se tipoDeVeiculoId for enviado, atualiza a relação; se não, mantém a existente
            if (tipoDeVeiculoId !== undefined) {
                if (tipoDeVeiculoId === null) {
                    // Caso tipoDeVeiculoId seja null, desvincula o tipo de veículo
                    dataToUpdate.tipoDeVeiculo = { disconnect: true };
                } else {
                    dataToUpdate.tipoDeVeiculo = { connect: { id: tipoDeVeiculoId } };
                }
            }

            // Se nenhum dado foi enviado, retorna erro
            if (Object.keys(dataToUpdate).length === 0) {
                return res.status(400).json({ message: "Nenhuma informação para atualizar." });
            }

            // Atualiza o processo (sinistro associado ao processo)
            const processoAtualizado = await prisma.processo.update({
                where: { id: processoId },
                data: dataToUpdate,
            });

            return res.status(200).json({
                error: false,
                message: "Processo (sinistro) atualizado com sucesso!",
                processo: processoAtualizado
            });

        } catch (error) {
            console.error("Erro ao atualizar processo (sinistro):", error);
            return res.status(500).json({ error: true, message: "Erro interno do servidor." });
        }
    }
};
