import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para upload de documento
export const uploadDocumento = async (req, res) => {
    try {
        const { tipo, descricao } = req.body;
        const userId = req.userId;

       

        // Verificar se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const arquivoUrl = `/uploads/documentos/${req.file.filename}`;

        // Salvar no banco com clienteId
        const documento = await prisma.documento.create({
            data: { 
                tipo, 
                descricao, 
                arquivoUrl, 
                userId: userId, 
                 
            },
        });

        res.status(201).json({ message: 'Documento enviado com sucesso.', documento });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar documento.', detalhes: error.message });
    }
};


// Função para buscar todos os documentos
export const getDocumentos = async (req, res) => {
    try {
        const documentos = await prisma.documento.findMany();
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar documentos.' });
    }
};

// Função para buscar documento por ID
export const getDocumentoById = async (req, res) => {
    try {
        const { id } = req.params;

        const documento = await prisma.documento.findUnique({
            where: { id: parseInt(id) },
        });

        if (!documento) {
            return res.status(404).json({ error: 'Documento não encontrado.' });
        }

        res.status(200).json(documento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar documento.' });
    }
};

// Função para deletar documento
export const deleteDocumento = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar documento no banco
        const documento = await prisma.documento.findUnique({
            where: { id: parseInt(id) },
        });

        if (!documento) {
            return res.status(404).json({ error: 'Documento não encontrado.' });
        }

        // Apagar o arquivo físico
        const filePath = path.join(__dirname, `../../${documento.arquivoUrl}`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remover do banco de dados
        await prisma.documento.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Documento deletado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar documento.' });
    }
};

// Função para editar (atualizar) um documento
export const updateDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, descricao } = req.body;
        const userId = req.userId;

        // Buscar documento existente
        const documentoExistente = await prisma.documento.findUnique({
            where: { id: parseInt(id) },
        });

        if (!documentoExistente) {
            return res.status(404).json({ error: 'Documento não encontrado.' });
        }

        let arquivoUrl = documentoExistente.arquivoUrl;

        // Verificar se há um novo arquivo para upload
        if (req.file) {
            // Apagar o arquivo antigo
            const oldFilePath = path.join(__dirname, `../../${documentoExistente.arquivoUrl}`);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            // Adicionar o novo arquivo
            arquivoUrl = `/uploads/${req.file.filename}`;
        }

        // Atualizar no banco de dados com clienteId
        const documentoAtualizado = await prisma.documento.update({
            where: { id: parseInt(id) },
            data: {
                tipo,
                descricao,
                arquivoUrl,
                userId: userId ? parseInt(userId) : documentoExistente.userId
                
            },
        });

        res.status(200).json({ message: 'Documento atualizado com sucesso.', documento: documentoAtualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar documento.', detalhes: error.message });
    }
};
