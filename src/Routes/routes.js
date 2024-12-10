import {Router } from 'express'
import UserController from '../Controllers/UserController.js'
import ProcessoController from '../Controllers/ProcessoController.js'
import { authenticate } from './../middlewares/auth.js';
import TiposDeProcesso from '../Controllers/TiposDeProcesso.js';
const router = Router()

router.post('/createUser',UserController.createUser)
router.post('/login', UserController.loginUser)

router.post('/createProcesso',authenticate,ProcessoController.createProcesso)
router.get('/processos',authenticate,ProcessoController.findAll)
router.put('/updateProcesso/:id',authenticate,ProcessoController.updateProcesso)
router.delete('/deleteProcesso/:id',authenticate,ProcessoController.deleteProcesso)


router.post('/createTipoProcesso',authenticate,TiposDeProcesso.createTiposProcesso)
router.get('/tiposProcesso',authenticate,TiposDeProcesso.findAllTiposProcesso)
router.put('/updateTipoProcesso/:id',authenticate,TiposDeProcesso.updateTiposProcesso)
router.delete('/deleteTipoProcesso/:id',authenticate,TiposDeProcesso.deleteTiposProcesso)


export { router}