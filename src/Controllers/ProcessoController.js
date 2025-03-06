import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
    // Criar um novo processo
    async createProcesso(req, res) {
        try {
           
    
            const { nome, cpf, rg, data_nascimento, data_emissao, orgao_expedidor, 
                    profissao, renda_mensal, cep, uf, endereco, numero, sexo, bairro, 
                    cidade, email, telefone01, telefone02, activo = false, 
                    tipoProcessoId, faseProcessoId, prioridadeId } = req.body;
    
            const userId = req.userId;
           

            if (!cpf || typeof cpf !== 'string') {
                return res.status(400).json({ message: "CPF é obrigatório e deve ser uma string válida." });
            }
            // 🔹 Normalizar CPF (remover caracteres não numéricos)
            const cpfNormalized = cpf.replace(/\D/g, ''); 
            
            if (!nome || !cpfNormalized || !tipoProcessoId || !faseProcessoId || !prioridadeId) {
                return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
            }
    
            // 🔹 Verifica se a vítima já existe pelo CPF
            let vitima = await prisma.vitima.findUnique({
                where: { cpf: cpfNormalized }
            });
            const tipoProcesso = await prisma.tiposDeProcesso.findUnique({
                where: { id: tipoProcessoId },  // Verifique se o tipo de processo com id 1 existe
              });

              const faseProcesso = await prisma.faseProcesso.findUnique({
                where:{id:faseProcessoId}
              })
              const prioridade = await prisma.prioridades.findUnique({
                where: {id:prioridadeId}
              })

            // 🔹 Se a vítima não existir, criamos uma nova
            if (!vitima) {
                vitima = await prisma.vitima.create({
                    data: {
                        nome: nome.toLowerCase(),
                        cpf: cpfNormalized,
                        rg: rg || "",
                        data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
                        data_emissao: data_emissao ? new Date(data_emissao) : null,
                        orgao_expedidor: orgao_expedidor || "",
                        profissao: profissao ?? null,
                        renda_mensal: renda_mensal || null,
                        cep: cep ? cep.toString() : null,
                        uf: uf ?? null,
                        endereco: endereco || "",
                        numero: numero || null,
                        sexo: sexo || null,
                        bairro: bairro || "",
                        cidade: cidade || "",
                        email: email || "",
                        telefone01: telefone01 ?? null,
                        telefone02: telefone02 ?? null,
                        activo,
                        userId
                    }
                });
    
                console.log("Nova vítima criada:", vitima);
            } else {
                console.log("Vítima já existente:", vitima);
            }
    
            // 🔹 Criar o processo com o ID da vítima encontrada/criada
            const novoProcesso = await prisma.processo.create({
                data: {
                    tipoProcesso: { connect: { id: parseInt(tipoProcessoId, 10) } },  // Usando connect para associar o tipo de processo
                    faseProcesso: { connect: { id: parseInt(faseProcessoId, 10) } },  // Usando connect para associar a fase de processo
                    vitima: { connect: { id: vitima.id } },  // Conectando a vítima à criação do processo
                    prioridade: { connect: { id: parseInt(prioridadeId, 10) } },  // Usando connect para associar a prioridade
                    user: { connect: { id: userId } },  // Conectando o usuário com o ID fornecido
                },
            });
        
    
            return res.status(201).json({
                message: "Processo criado com sucesso.",
                processo: novoProcesso,
            });

    
        } catch (error) {
            console.error("Erro detalhado:", error); // Log do erro para diagnóstico
    return res.status(500).json({ message: "Erro ao criar o processo.", error })
        }
    },

    // Buscar todos os processos
    async findAll(req, res) {
        try {
            const processos = await prisma.processo.findMany({
                include: {
                    sinistro: {
                        select: {
                            numero: true // 🔹 Apenas o número do sinistro
                        }
                    },
                    vitima: true,
                    tipoProcesso: true,
                    faseProcesso: true,
                    prioridade: true,
                    user: true,
                },
            });
        console.log(processos)
         
            
    
            return res.status(200).json(processos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar os processos.", error });
        }
    },
    
    // Buscar um processo pelo ID
    async findById(req, res) {
        try {
            const { id: processoId } = req.params;
            
    
            const processo = await prisma.processo.findUnique({
                where: { id: parseInt(processoId) },
                include: {
                    sinistro: {
                        select: {
                            numero: true // 🔹 Apenas o número do sinistro
                        }
                    },
                    vitima: true,
                    tipoProcesso: true,
                    faseProcesso: true,
                    prioridade: true,
                    user: true,
                },
            });
            
    
            if (!processo) {
                return res.status(404).json({ message: "Processo não encontrado." });
            }
    
            return res.status(200).json(processo);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar o processo.", error });
        }
    },

    // Atualizar um processo
    async updateProcesso(req, res) {
        try {
            const { id } = req.params;
            const { tipoProcessoId, faseProcessoId, prioridadeId } = req.body;

            const processoAtualizado = await prisma.processo.update({
                where: { id: parseInt(id) },
                data: {
                    tipoProcessoId: tipoProcessoId ? parseInt(tipoProcessoId) : undefined,
                    faseProcessoId: faseProcessoId ? parseInt(faseProcessoId) : undefined,
                    prioridadeId: prioridadeId ? parseInt(prioridadeId) : undefined,
                },
            });

            return res.status(200).json({
                message: "Processo atualizado com sucesso.",
                processo: processoAtualizado,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao atualizar o processo.", error });
        }
    },

    // Excluir um processo
    async deleteProcesso(req, res) {
        try {
            const { id } = req.params;

            await prisma.processo.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json({ message: "Processo excluído com sucesso." });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao excluir o processo.", error });
        }
    },
};

