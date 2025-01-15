import {Router } from 'express'
import path from 'path';
import multer from 'multer'
import { fileURLToPath } from 'url';
import { authenticate } from './../middlewares/auth.js';
import UserController from '../Controllers/UserController.js'
import ProcessoController from '../Controllers/ProcessoController.js'
import TiposDeProcesso from '../Controllers/TiposDeProcesso.js';
import PrioridadesController from '../Controllers/PrioridadesController.js';
import ClienteController from '../Controllers/ClienteController.js';
import BancoController from '../Controllers/BancoController.js';
import TipoDeVeiculoController from '../Controllers/TipoDeVeiculoController.js'
import SeguradoraController from '../Controllers/SeguradoraController.js'
import { deleteDocumento, getDocumentoById, getDocumentos, updateDocumento, uploadDocumento } from '../Controllers/uploadDocumento.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, "../../uploads/");
        cb(null, uploadsDir); // Diretório para salvar as imagens
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Nome único para o arquivo
    },
});

// Definindo o multer com configurações de arquivo aceito
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo não suportado. Apenas JPEG, PNG, JPG e PDF são permitidos."), false);
        }
    },
});

const router = Router()


router.post('/uploadDocumento',authenticate, upload.single('file'), uploadDocumento); // Upload
router.get('/documentos', authenticate, getDocumentos); 
router.get('/documento/:id', authenticate, getDocumentoById); 
router.put('/updateDocumento/:id', authenticate, updateDocumento); 
router.delete('/deleteDocumento/:id', authenticate, deleteDocumento); 


router.post('/createUser',UserController.createUser)
router.post('/login', UserController.loginUser)
router.get('/user/:id',authenticate, UserController.getUserById)

//Processo
router.post('/createProcesso',authenticate,ProcessoController.createProcesso)
router.get('/processos',authenticate,ProcessoController.findAll)
router.put('/updateProcesso/:id',authenticate,ProcessoController.updateProcesso)
router.delete('/deleteProcesso/:id',authenticate,ProcessoController.deleteProcesso)

//TipoDeProcesso
router.post('/createTipoProcesso',authenticate,TiposDeProcesso.createTiposProcesso)
router.get('/tiposProcesso',authenticate,TiposDeProcesso.findAllTiposProcesso)
router.put('/updateTipoProcesso/:id',authenticate,TiposDeProcesso.updateTiposProcesso)
router.delete('/deleteTipoProcesso/:id',authenticate,TiposDeProcesso.deleteTiposProcesso)


//Prioridade
router.post('/createPrioridade',authenticate,PrioridadesController.createPrioridade)
router.get('/prioridades',authenticate,PrioridadesController.findAllPrioridades)
router.get('/prioridade/:id',authenticate,PrioridadesController.findPrioridadeById)
router.put('/updatePrioridade/:id',authenticate,PrioridadesController.updatePrioridade)
router.delete('/deletePrioridade/:id',authenticate,PrioridadesController.deletePrioridade)

//cliente
router.post('/createCliente', authenticate,ClienteController.createCliente)
router.get('/clientes', authenticate,ClienteController.findAllClientes)
router.get('/cliente/:id', authenticate,ClienteController.findClienteById)
router.put('/updateCliente/:id', authenticate,ClienteController.updateCliente)
router.delete('/deleteCliente/:id', authenticate,ClienteController.deleteCliente)

//Banco
router.post('/createBanco', authenticate,BancoController.createBanco)
router.get('/bancos', authenticate,BancoController.findAllBancos)
router.get('/banco/:id', authenticate,BancoController.findBancoById)
router.put('/updateBanco/:id', authenticate,BancoController.updateBanco)
router.delete('/deleteBanco/:id', authenticate,BancoController.deleteBanco)


//Seguradora
 router.post('/createSeguradora', authenticate,SeguradoraController.createSeguradora)
 router.get('/seguradoras', authenticate,SeguradoraController.findAllSeguradoras)
 router.get('/segurado/:id', authenticate,SeguradoraController.findSeguradoraById)
 router.put('/updateSeguradora/:id', authenticate,SeguradoraController.updateSeguradora)
 router.delete('/deleteSeguradora/:id', authenticate,SeguradoraController.deleteSeguradora)


//TiposDeVeiculo
router.post('/createTiposDeVeiculo', authenticate,TipoDeVeiculoController.createTipoDeVeiculo)
router.get('/tiposDeVeiculos', authenticate,TipoDeVeiculoController.findAllTipoVeiculos)
router.get('/tiposDeVeiculo/:id', authenticate,TipoDeVeiculoController.findTipoDeVeiculoById)
router.put('/updateTiposDeVeiculo/:id', authenticate,TipoDeVeiculoController.updateTipoDeVeiculo)
router.delete('/deleteTiposDeVeiculo/:id', authenticate,TipoDeVeiculoController.deleteTipoDeVeiculo)


export { router}