import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {

    // Função para upload de documento
 async createChecklist (req, res) {
    try {
        const { descricao, obrigatorio, entregue, processoId } = req.body;
        const userId = req.userId;

       if(!descricao || typeof obrigatorio !== "boolean" || typeof entregue !== 'boolean' || !processoId ){
        res.status(400).json({message:'Preencha todos os campos obrigatórios corretamente.'})
       }
        
        // Verificar se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const arquivoUrl = `/uploads/${req.file.filename}`;

        const processo = await prisma.processo.findUnique({ where: { id: processoId } });
        if (!processo) {
            return res.status(404).json({ message: "Id do processo não encontrada." });
        }
        // Salvar no banco com clienteId
        const checklist = await prisma.checklist.create({
            data: { 
                descricao, 
                obrigatorio,
                entregue,
                processoId, 
                arquivoUrl, 
                userId: userId, 
            },
        });

        res.status(201).json({ message: 'Chekclist enviado com sucesso.', checklist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar documento.', detalhes: error.message });
    }
}

}

