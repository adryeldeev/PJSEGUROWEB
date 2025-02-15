/*
  Warnings:

  - You are about to drop the column `faseId` on the `andamento` table. All the data in the column will be lost.
  - Added the required column `faseProcessoId` to the `Andamento` table without a default value. This is not possible if the table is not empty.

*/
-- Remover a chave estrangeira antiga
ALTER TABLE `andamento` DROP FOREIGN KEY `Andamento_faseId_fkey`;

-- Adicionar a nova coluna como opcional inicialmente
ALTER TABLE `andamento` ADD COLUMN `faseProcessoId` INTEGER NULL;

-- Copiar os valores existentes de faseId para faseProcessoId
UPDATE `andamento` SET `faseProcessoId` = `faseId`;

-- Agora torna a nova coluna obrigatória
ALTER TABLE `andamento` MODIFY COLUMN `faseProcessoId` INTEGER NOT NULL;

-- Remover a coluna antiga
ALTER TABLE `andamento` DROP COLUMN `faseId`;

-- Adicionar a nova chave estrangeira
ALTER TABLE `Andamento` ADD CONSTRAINT `Andamento_faseProcessoId_fkey` FOREIGN KEY (`faseProcessoId`) REFERENCES `FaseProcesso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Renomear índices na tabela Processo (opcional, se necessário)
ALTER TABLE `processo` RENAME INDEX `Processo_faseProcessoId_fkey` TO `Processo_faseProcessoId_idx`;
ALTER TABLE `processo` RENAME INDEX `Processo_tipoProcessoId_fkey` TO `Processo_tipoProcessoId_idx`;
