import pkg from '@prisma/client';
import moment from 'moment-timezone';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    // Criar vítima
    async createVitima(req, res) {
        const { 
            nome, cpf, rg, data_nascimento, data_emissao, orgao_expedidor, 
            profissao, renda_mensal, cep, uf, endereco, numero, sexo, bairro, complemento, 
            cidade, email, telefone01, telefone02, activo = false
        } = req.body;
    
        const userId = req.userId;
    
        // Validar campos obrigatórios
        if (!nome || !cpf || activo === undefined || activo === null) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }
        
        if (!cpf || typeof cpf !== "string") {
            return res.status(400).json({ message: "CPF é obrigatório e deve ser uma string válida." });
        }
        
        // Normalizar CPF (remover caracteres não numéricos)
        const cpfNormalized = cpf.replace(/\D/g, ''); 
    
        // Validar CPF após normalização
        if (cpfNormalized.length !== 11) {
            return res.status(400).json({ message: "CPF inválido. Deve conter 11 dígitos numéricos." });
        }
        const nomeNomarlized = nome? nome.toLowerCase() : null;
        // Normalizar CEP (remover caracteres não numéricos ou converter para número se necessário)
        const cepNormalized = cep ? cep.replace(/\D/g, '') : null;
      
        try {
            // Verificar se a vítima já existe
            const vitimaExisting = await prisma.vitima.findUnique({
                where: { cpf: cpfNormalized }
            });
    
            if (vitimaExisting) {
                return res.status(400).json({ message: "Vítima com este CPF já existe." });
            }
    
            // Converter datas corretamente
            const dataNascimentoAjusted = data_nascimento 
                ? moment.tz(data_nascimento, "America/Sao_Paulo").toDate() 
                : null;
            const dataEmissaoAjusted = data_emissao 
                ? moment.tz(data_emissao, "America/Sao_Paulo").toDate() 
                : null;
                const rendaMensalNumerica = parseInt(renda_mensal, 10); 
            // Criar vítima
            const vitima = await prisma.vitima.create({
                data: {
                    nome:nomeNomarlized,
                    cpf: cpfNormalized,
                    rg: rg || "",
                    data_nascimento: dataNascimentoAjusted,
                    data_emissao: dataEmissaoAjusted,
                    orgao_expedidor: orgao_expedidor || "",
                    profissao: profissao ?? null,
                    renda_mensal: !isNaN(rendaMensalNumerica) ? rendaMensalNumerica : null,
                    cep: cepNormalized,
                    uf: uf ?? null,
                    endereco: endereco || "",
                    numero: numero || null,
                    sexo: sexo || null,
                    bairro: bairro || "",
                    cidade: cidade || "",
                    complemento: complemento|| "",
                    email: email || "",
                    telefone01: telefone01 ?? null,
                    telefone02: telefone02 ?? null,
                    activo,
                    userId
                }
            });
            
    
            return res.status(201).json({
                error: false,
                message: "Vítima criada com sucesso.",
                vitima
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao criar a vítima." });
        }
    },
    
    // Buscar todas as vítimas
    async findAll(req, res) {
        try {
            const vitimas = await prisma.vitima.findMany();
            return res.status(200).json(vitimas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar vítimas." });
        }
    },
    
    // Buscar vítima por ID
    async findById(req, res) {
        const { id } = req.params;
        try {
            const vitima = await prisma.vitima.findUnique({
                where: { id: Number(id) }
            });

            if (!vitima) {
                return res.status(404).json({ message: "Vítima não encontrada." });
            }

            return res.status(200).json(vitima);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar a vítima." });
        }
    },
    
    // Atualizar vítima
    async updateVitima(req, res) {
        const { id } = req.params;
        const {
            nome, cpf, rg, data_nascimento, data_emissao, orgao_expedidor,
            profissao, renda_mensal, cep, uf, endereco, numero, sexo, 
            bairro, cidade,complemento, email, telefone01, telefone02, activo 
        } = req.body;
    
        try {
            const vitimaExists = await prisma.vitima.findUnique({
                where: { id: Number(id) }
            });
    
            if (!vitimaExists) {
                return res.status(404).json({ message: "Vítima não encontrada." });
            }
            
            let cpfNormalized = vitimaExists.cpf;
            if (cpf) {
                cpfNormalized = cpf.replace(/\D/g, '');
                if (cpfNormalized.length !== 11) {
                    return res.status(400).json({ message: "CPF inválido. Deve conter 11 dígitos numéricos." });
                }
            }
            const rendaMensalNumerica = parseInt(renda_mensal, 10); // Converte para número inteiro

            const dadosAtualizados = {
                nome,
                cpf: cpfNormalized,
                rg,
                data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
                data_emissao: data_emissao ? new Date(data_emissao) : null,
                orgao_expedidor,
                profissao,
                renda_mensal: !isNaN(rendaMensalNumerica) ? rendaMensalNumerica : null, // Garantindo que seja número
                cep,
                uf,
                endereco,
                numero,
                sexo,
                bairro,
                cidade,
                complemento,
                email,
                telefone01,
                telefone02,
                activo
            };
    
            const vitimaAtualizada = await prisma.vitima.update({
                where: { id: Number(id) },
                data: dadosAtualizados
            });
    
            return res.status(200).json({
                message: "Vítima atualizada com sucesso!",
                vitima: vitimaAtualizada
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao atualizar a vítima." });
        }
    },
    
    // Deletar vítima
    async deleteVitima(req, res) {
        const id = Number(req.params.id);
    
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido." });
        }
    
        try {
            // Verificar se a vítima existe e se está vinculada a algum processo
            const vitimaExistente = await prisma.vitima.findUnique({
                where: { id },
                include: { processos: true } // Verifica se há processos vinculados
            });
    
            if (!vitimaExistente) {
                return res.status(404).json({ message: "Vítima não encontrada." });
            }
    
            // Se a vítima estiver vinculada a processos, exibe a mensagem
            if (vitimaExistente.processos.length > 0) {
                return res.status(400).json({
                    message: "Vítima está vinculada a processos. Remova os processos antes de excluir a vítima."
                });

            
            }
    
            //  exclui a vítima não vinculada.
            await prisma.vitima.delete({
                where: { id }
            });
    
            return res.status(200).json({ message: "Vítima e processos excluídos com sucesso!" });
    
        } catch (error) {
            console.error("Erro ao deletar vítima e processos:", error);
            return res.status(500).json({ message: "Erro ao excluir vítima e processos." });
        }
    },    

    async findVitimaByCpf(req, res) {
        const { cpf } = req.params;
        const cpfNormalized = cpf.replace(/\D/g, ''); // Normalizar CPF

        try {
            const vitima = await prisma.vitima.findUnique({
                where: { cpf: cpfNormalized }
            });

            if (!vitima) {
                return res.status(404).json({ message: "Vítima não encontrada." });
            }

            return res.status(200).json(vitima);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao buscar a vítima." });
        }
    }
};
