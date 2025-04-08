-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `resetPasswordToken` VARCHAR(255) NULL,
    `resetPasswordExpires` DATETIME(3) NULL,
    `profileImage` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TiposDeProcesso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `arquivoUrl` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FaseProcesso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cor_fundo` VARCHAR(191) NULL,
    `cor_fonte` VARCHAR(191) NULL,
    `pendencia` BOOLEAN NOT NULL,
    `muda_fase` BOOLEAN NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `FaseProcesso_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prioridades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cor_fundo` VARCHAR(191) NOT NULL,
    `cor_fonte` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NULL,
    `agencia` VARCHAR(191) NULL,
    `conta` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Banco_conta_key`(`conta`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seguradora` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Checklist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,
    `arquivoUrl` VARCHAR(191) NOT NULL,
    `obrigatorio` BOOLEAN NOT NULL,
    `entregue` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `processoId` INTEGER NOT NULL,

    UNIQUE INDEX `Checklist_processoId_key`(`processoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Andamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacoes` VARCHAR(191) NULL,
    `faseProcessoId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `processoId` INTEGER NOT NULL,

    UNIQUE INDEX `Andamento_processoId_key`(`processoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoDeVeiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `placa` VARCHAR(191) NULL,
    `marca` VARCHAR(191) NULL,
    `modelo` VARCHAR(191) NULL,
    `ano` INTEGER NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TipoDeVeiculo_placa_key`(`placa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sinistro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NULL,
    `dataSinistro` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataAbertura` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `processoId` INTEGER NOT NULL,
    `tipoDeVeiculoId` INTEGER NULL,
    `delegaciaId` INTEGER NULL,

    UNIQUE INDEX `Sinistro_numero_key`(`numero`),
    UNIQUE INDEX `Sinistro_processoId_key`(`processoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delegacia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `delegacia` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `dataBo` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `numeroBo` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vitima` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NULL,
    `data_nascimento` DATETIME(3) NULL,
    `data_emissao` DATETIME(3) NULL,
    `orgao_expedidor` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL,
    `profissao` VARCHAR(191) NULL,
    `renda_mensal` INTEGER NULL,
    `cep` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `numero` VARCHAR(191) NULL,
    `sexo` ENUM('MASCULINO', 'FEMININO') NULL,
    `complemento` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `telefone01` VARCHAR(191) NULL,
    `telefone02` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Vitima_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Processo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoProcessoId` INTEGER NOT NULL,
    `faseProcessoId` INTEGER NOT NULL,
    `vitimaId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `prioridadeId` INTEGER NOT NULL,
    `seguradoraId` INTEGER NULL,
    `bancoId` INTEGER NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,

    INDEX `Processo_faseProcessoId_idx`(`faseProcessoId`),
    INDEX `Processo_tipoProcessoId_idx`(`tipoProcessoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TiposDeProcesso` ADD CONSTRAINT `TiposDeProcesso_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FaseProcesso` ADD CONSTRAINT `FaseProcesso_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prioridades` ADD CONSTRAINT `Prioridades_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Banco` ADD CONSTRAINT `Banco_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seguradora` ADD CONSTRAINT `Seguradora_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Checklist` ADD CONSTRAINT `Checklist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Checklist` ADD CONSTRAINT `Checklist_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Andamento` ADD CONSTRAINT `Andamento_faseProcessoId_fkey` FOREIGN KEY (`faseProcessoId`) REFERENCES `FaseProcesso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Andamento` ADD CONSTRAINT `Andamento_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Andamento` ADD CONSTRAINT `Andamento_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoDeVeiculo` ADD CONSTRAINT `TipoDeVeiculo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `Processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_tipoDeVeiculoId_fkey` FOREIGN KEY (`tipoDeVeiculoId`) REFERENCES `TipoDeVeiculo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistro` ADD CONSTRAINT `Sinistro_delegaciaId_fkey` FOREIGN KEY (`delegaciaId`) REFERENCES `Delegacia`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delegacia` ADD CONSTRAINT `Delegacia_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vitima` ADD CONSTRAINT `Vitima_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_tipoProcessoId_fkey` FOREIGN KEY (`tipoProcessoId`) REFERENCES `TiposDeProcesso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_faseProcessoId_fkey` FOREIGN KEY (`faseProcessoId`) REFERENCES `FaseProcesso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_vitimaId_fkey` FOREIGN KEY (`vitimaId`) REFERENCES `Vitima`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_prioridadeId_fkey` FOREIGN KEY (`prioridadeId`) REFERENCES `Prioridades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_seguradoraId_fkey` FOREIGN KEY (`seguradoraId`) REFERENCES `Seguradora`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Processo` ADD CONSTRAINT `Processo_bancoId_fkey` FOREIGN KEY (`bancoId`) REFERENCES `Banco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
