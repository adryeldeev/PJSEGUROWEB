-- Passo 1: Remover a chave estrangeira de `vitimaId` na tabela `delegacia`
ALTER TABLE `delegacia` DROP FOREIGN KEY `Delegacia_vitimaId_fkey`;

-- Passo 2: Remover a coluna `vitimaId` de `delegacia`
ALTER TABLE `delegacia` DROP COLUMN `vitimaId`;

-- Passo 3: Alterar a tabela `delegacia` para adicionar a coluna `processoId` (necessária)
ALTER TABLE `delegacia`
    ADD COLUMN `processoId` INTEGER NOT NULL;

-- Passo 4: Alterar a tabela `tipodeveiculo` para adicionar a coluna `processoId` e `sinistroId`
ALTER TABLE `tipodeveiculo`
    ADD COLUMN `processoId` INTEGER NOT NULL,
    ADD COLUMN `sinistroId` INTEGER NULL;

-- Passo 5: Criar as chaves estrangeiras para `TipoDeVeiculo`
ALTER TABLE `tipodeveiculo`
    ADD CONSTRAINT `TipoDeVeiculo_sinistroId_fkey`
    FOREIGN KEY (`sinistroId`) REFERENCES `sinistro`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tipodeveiculo`
    ADD CONSTRAINT `TipoDeVeiculo_processoId_fkey`
    FOREIGN KEY (`processoId`) REFERENCES `processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Passo 6: Criar a chave estrangeira para `Delegacia`
ALTER TABLE `delegacia`
    ADD CONSTRAINT `Delegacia_processoId_fkey`
    FOREIGN KEY (`processoId`) REFERENCES `processo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
