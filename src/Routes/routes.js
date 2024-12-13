import {Router } from 'express'
import UserController from '../Controllers/UserController.js'
import ProcessoController from '../Controllers/ProcessoController.js'
import { authenticate } from './../middlewares/auth.js';
import TiposDeProcesso from '../Controllers/TiposDeProcesso.js';
import PrioridadesController from '../Controllers/PrioridadesController.js';
import ClienteController from '../Controllers/ClienteController.js';
import BancoController from '../Controllers/BancoController.js';
const router = Router()

router.post('/createUser',UserController.createUser)
router.post('/login', UserController.loginUser)

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
router.delete('/delete/:id', authenticate,ClienteController.deleteCliente)

//Banco
router.post('/createCliente', authenticate,BancoController.createBanco)
router.get('/clientes', authenticate,BancoController.findAllBancos)
router.get('/cliente/:id', authenticate,BancoController.findBancoById)
router.put('/updateCliente/:id', authenticate,BancoController.updateBanco)
router.delete('/delete/:id', authenticate,BancoController.deleteBanco)

export { router}