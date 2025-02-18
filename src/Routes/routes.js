import {Router } from 'express'
import path from 'path';
import multer from 'multer'
import { fileURLToPath } from 'url';
import { authenticate } from './../middlewares/auth.js';
import UserController from '../Controllers/UserController.js'
import FaseProcessoController from '../Controllers/FaseProcessoController.js'
import TiposDeProcesso from '../Controllers/TiposDeProcesso.js';
import PrioridadesController from '../Controllers/PrioridadesController.js';
import BancoController from '../Controllers/BancoController.js';
import TipoDeVeiculoController from '../Controllers/TipoDeVeiculoController.js'
import SeguradoraController from '../Controllers/SeguradoraController.js'
import { deleteDocumento, getDocumentoById, getDocumentos, updateDocumento, uploadDocumento } from '../Controllers/uploadDocumento.js';
import VitimaController from '../Controllers/VitimaController.js';
import ProcessoController from '../Controllers/ProcessoController.js';
import AndamentoController from '../Controllers/AndamentoController.js';
import ChecklistController from '../Controllers/ChecklistController.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "uploads/";

        if (req.originalUrl.includes("createChecklist")) {
            folder += "checklist/";
        } else if (req.originalUrl.includes("uploadDocumento")) {
            folder += "documentos/";
        } else if (req.originalUrl.includes("updateChecklist")) {
            folder += "checklist/"; // Adicione esta condição para a atualização
        }

        cb(null, path.join(__dirname, "../../", folder));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg", "image/png", "image/jpg", // Imagens
            "application/pdf", // PDFs
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo não suportado. Apenas JPEG, PNG, JPG, PDF, DOC e DOCX são permitidos."), false);
        }
    },
});
const router = Router()


router.post('/uploadDocumento',authenticate, upload.single('file'), uploadDocumento); // Upload
router.get('/documentos', authenticate, getDocumentos); 
router.get('/documento/:id', authenticate, getDocumentoById); 
router.put('/updateDocumento/:id', authenticate, updateDocumento); 
router.delete('/deleteDocumento/:id', authenticate, deleteDocumento); 

// checklist
router.post('/createChecklist', authenticate, upload.single('file'), ChecklistController.createChecklist); 
router.get('/checklist', authenticate, ChecklistController.findAll); 
router.get('/checklist/:id', authenticate, ChecklistController.findByID); 
router.put('/updateChecklist/:id', authenticate,upload.single('file'), ChecklistController.updateChecklist); 
router.delete('/deleteChecklist/:id', authenticate, ChecklistController.deleteChecklist); 

//User
router.post('/createUser',UserController.createUser)
router.post('/login', UserController.loginUser)
router.get('/user/:id',authenticate, UserController.getUserById)

//Processo
router.post('/createProcesso',authenticate,FaseProcessoController.createProcesso)
router.get('/processos',authenticate,FaseProcessoController.findAll)
router.put('/updateProcesso/:id',authenticate,FaseProcessoController.updateProcesso)
router.delete('/deleteProcesso/:id',authenticate,FaseProcessoController.deleteProcesso)

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


//Vitimas
router.post('/createVitima', authenticate,VitimaController.createVitima)
router.get('/vitimas', authenticate,VitimaController.findAll)
router.get('/vitima/:id', authenticate,VitimaController.findById)
router.put('/updateVitima/:id', authenticate,VitimaController.updateVitima)
router.delete('/deleteVitima/:id', authenticate,VitimaController.deleteVitima)
router.get('/findVitimaByCpf/:cpf', authenticate, VitimaController.findVitimaByCpf);

//Processo
router.post('/createProcessoV', authenticate, ProcessoController.createProcesso)
router.get('/processos', authenticate,ProcessoController.findAll);
router.get('/processos/:id',authenticate,  ProcessoController.findById);
router.put('/processos/:id',authenticate,  ProcessoController.updateProcesso);
router.delete('/processos/:id', authenticate, ProcessoController.deleteProcesso);



router.post('/createAndamento', authenticate, AndamentoController.createAndamento)
router.get('/andamentos', authenticate,AndamentoController.findAll);
router.get('/andamento/:id',authenticate,  AndamentoController.findByProcessoId);
router.put('/updateAndamento/:id',authenticate,  AndamentoController.updateAndamento);
router.delete('/deleteAndamento/:id', authenticate, AndamentoController.deleteAndamento);



export { router}