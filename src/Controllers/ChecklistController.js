import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para converter string 'true'/'false' para booleano
const stringToBoolean = (value) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false; // Se não for 'true' nem 'false', retorna false por padrão
};

export default {
    // Criar Checklist
    async createChecklist(req, res) {
        try {
            const { descricao, obrigatorio, entregue, processoId } = req.body;
            const userId = req.userId; // Identificação do usuário logado

            // Validação
            if (!descricao || !processoId) {
                return res.status(400).json({ message: "Descrição e processoId são obrigatórios." });
            }

            const obrigatorioBoolean = stringToBoolean(obrigatorio);
            const entregueBoolean = stringToBoolean(entregue);

            // Verificando se os campos obrigatorio e entregue foram passados corretamente
            if (typeof obrigatorioBoolean !== 'boolean' || typeof entregueBoolean !== 'boolean') {
                return res.status(400).json({ message: "Os campos obrigatorio e entregue devem ser booleanos." });
            }

           

            let arquivoUrl = null;
            if (req.file) {
                // URL do arquivo
                arquivoUrl = `/uploads/checklist/${req.file.filename}`;
            }
            // Verificar se o processo existe
            const processo = await prisma.processo.findUnique({ where: { id: parseInt(processoId, 10) } });
            if (!processo) {
                return res.status(404).json({ message: "ID do processo não encontrado." });
            }

            // Criar o checklist no banco de dados
            const checklist = await prisma.checklist.create({
                data: {
                  descricao: descricao,
                  obrigatorio: obrigatorioBoolean,
                  entregue: entregueBoolean,
                  processoId: Number(processoId),
                  arquivoUrl: arquivoUrl || null,
                  userId: userId, // Certifique-se de que o userId está sendo passado corretamente
                  user: {
                    connect: { id: userId }, // Conecte o checklist ao usuário existente
                  },
                },
              });

            res.status(201).json(checklist); // Retornar apenas o checklist
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao enviar checklist.", detalhes: error.message });
        }
    },

    // Buscar todos os checklists
    async findAll(req, res) {
        try {
            const userId = req.userId
            const checklists = await prisma.checklist.findMany({
                where:{
                    userId:userId
                }
            });
            res.status(200).json(checklists); // Retornar diretamente os checklists
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar checklists.", detalhes: error.message });
        }
    },

    // Buscar checklist por ID
    async findByID(req, res) {
        try {
            const { id: processoId } = req.params // Captura o ID do processo da URL
            
            // Verifica se processoId foi passado
            if (!processoId) {
                return res.status(400).json({ error: "O ID do processo é obrigatório." });
            }
    
            const processoIdNumber = parseInt(processoId, 10);
    
            // Verifica se o processoId é um número válido
            if (isNaN(processoIdNumber)) {
                return res.status(400).json({ error: "O ID do processo deve ser um número válido." });
            }
    
            // Busca os checklists associados ao processo
            const checklists = await prisma.checklist.findMany({
                where: { processoId: processoIdNumber }
            });
    
            res.status(200).json(checklists);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar checklists do processo.", detalhes: error.message });
        }
    },

    // Atualizar checklist
    async updateChecklist(req, res) {
        try {
            const { id } = req.params;
            const { descricao, obrigatorio, entregue } = req.body;
    
            // Buscar o checklist para verificar se ele existe
            const checklistExistente = await prisma.checklist.findUnique({
                where: { id: parseInt(id, 10) },
            });
    
            if (!checklistExistente) {
                return res.status(404).json({ message: "Checklist não encontrado." });
            }
    
            const obrigatorioBoolean = stringToBoolean(obrigatorio);
            const entregueBoolean = stringToBoolean(entregue);
    
            let arquivoUrl = checklistExistente.arquivoUrl; // Manter o arquivo existente
    
            // Se um novo arquivo for enviado, atualize o arquivoUrl
            if (req.file) {
                arquivoUrl = `/uploads/checklist/${req.file.filename}`;
            }
    
            const updatedChecklist = await prisma.checklist.update({
                where: { id: parseInt(id, 10) },
                data: {
                    descricao,
                    obrigatorio: obrigatorioBoolean,
                    entregue: entregueBoolean,
                    arquivoUrl,
                },
            });
    
            res.status(200).json(updatedChecklist);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar checklist.", detalhes: error.message });
        }
    },

    // Deletar checklist
    async deleteChecklist(req, res) {
        try {
            const { id } = req.params;
    
            // Buscar o checklist antes de deletar
            const checklist = await prisma.checklist.findUnique({ where: { id: parseInt(id, 10) } });
    
            if (!checklist) {
                return res.status(404).json({ message: "Checklist não encontrado." });
            }
    
            // Remover o arquivo do sistema de arquivos se existir
            if (checklist.arquivoUrl) {
                const filePath = path.join(__dirname, "../../", checklist.arquivoUrl);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Erro ao excluir arquivo:", err);
                    }
                });
            }
    
            // Deletar o checklist do banco de dados
            await prisma.checklist.delete({ where: { id: parseInt(id, 10) } });
    
            res.status(200).json({ message: "Checklist excluído com sucesso." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao excluir checklist.", detalhes: error.message });
        }
    }
};