import pkg from '@prisma/client';
import moment from 'moment-timezone';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
    // Criar vítima
    async createVitima(req, res) {
        const { 
            nome, cpf, rg, data_nascimento, data_emissao, orgao_expedidor, 
            profissao, renda_mensal, cep, uf, endereco, numero, sexo, bairro, 
            cidade, email, telefone01, telefone02, activo 
        } = req.body;
    
        const userId = req.userId;
    
        // Validar campos obrigatórios
        if (!nome || !cpf || activo === undefined) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }
    
        // Validar formato do CPF
        const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        const isValid = regex.test(cpf);
        if (!isValid) {
            return res.status(400).json({ message: "CPF inválido. Formato correto: 999.999.999-99." });
        }
    
        // Normalizar CPF (remover caracteres não numéricos)
        const cpfNormalized = cpf.replace(/[^\d]+/g, ''); 
    
        try {
            // Verificar se a vítima já existe
            const vitimaExisting = await prisma.vitima.findUnique({
                where: { cpf: cpfNormalized }
            });
    
            if (vitimaExisting) {
                return res.status(400).json({ message: "Vítima com este CPF já existe." });
            }
    
            // Converter datas corretamente (opcionalmente usando moment-timezone)
            const dataNascimentoAjusted = data_nascimento ? new Date(data_nascimento) : null;
            const dataEmissaoAjusted = data_emissao ? new Date(data_emissao) : null;
    
            // Criar vítima
            const vitima = await prisma.vitima.create({
                data: {
                    nome, cpf: cpfNormalized, rg, data_nascimento: dataNascimentoAjusted, 
                    data_emissao: dataEmissaoAjusted, orgao_expedidor, 
                    profissao, renda_mensal, cep, uf, endereco, numero, 
                    sexo, bairro, cidade, email, telefone01, telefone02, 
                    activo, userId
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
            bairro, cidade, email, telefone01, telefone02, activo
        } = req.body;
    
        try {
            // Verificar se a vítima existe
            const vitimaExists = await prisma.vitima.findUnique({
                where: { id: Number(id) }
            });
    
            if (!vitimaExists) {
                return res.status(404).json({ message: "Vítima não encontrada." });
            }
    
            // Validar e normalizar CPF
            if (cpf) {
                const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                const isValid = regex.test(cpf);
    
                if (!isValid) {
                    return res.status(400).json({ message: "CPF inválido. Formato correto: 999.999.999-99." });
                }
    
                // Normalizar CPF (remover caracteres não numéricos)
                const cpfNormalized = cpf.replace(/[^\d]+/g, '');
            }
    
            // Montar objeto de atualização sem valores undefined
            const dadosAtualizados = {};
            if (nome) dadosAtualizados.nome = nome;
            if (cpf) dadosAtualizados.cpf = cpfNormalized || cpf; // Usar o CPF normalizado, caso tenha sido enviado
            if (rg) dadosAtualizados.rg = rg;
            if (data_nascimento) dadosAtualizados.data_nascimento = new Date(data_nascimento);
            if (data_emissao) dadosAtualizados.data_emissao = new Date(data_emissao);
            if (orgao_expedidor) dadosAtualizados.orgao_expedidor = orgao_expedidor;
            if (profissao) dadosAtualizados.profissao = profissao;
            if (renda_mensal) dadosAtualizados.renda_mensal = renda_mensal;
            if (cep) dadosAtualizados.cep = cep;
            if (uf) dadosAtualizados.uf = uf;
            if (endereco) dadosAtualizados.endereco = endereco;
            if (numero) dadosAtualizados.numero = numero;
            if (sexo) dadosAtualizados.sexo = sexo;
            if (bairro) dadosAtualizados.bairro = bairro;
            if (cidade) dadosAtualizados.cidade = cidade;
            if (email) dadosAtualizados.email = email;
            if (telefone01) dadosAtualizados.telefone01 = telefone01;
            if (telefone02) dadosAtualizados.telefone02 = telefone02;
            if (activo !== undefined) dadosAtualizados.activo = activo;
    
            // Atualizar a vítima com os dados fornecidos
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
        const { id } = req.params;

        try {
            const vitimaExists = await prisma.vitima.findUnique({
                where: { id: Number(id) }
            });

            if (!vitimaExists) {
                return res.status(404).json({ message: "Vítima não encontrada." });
            }

            await prisma.vitima.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({ message: "Vítima deletada com sucesso!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao deletar a vítima." });
        }
    }
};
