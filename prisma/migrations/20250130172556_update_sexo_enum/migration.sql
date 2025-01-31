/*
  Warnings:

  - You are about to alter the column `sexo` on the `vitima` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cliente` DROP FOREIGN KEY `Cliente_userId_fkey`;

-- DropForeignKey
ALTER TABLE `documento` DROP FOREIGN KEY `Documento_clienteId_fkey`;

-- AlterTable
ALTER TABLE `vitima` MODIFY `rg` VARCHAR(191) NULL,
    MODIFY `data_nascimento` DATETIME(3) NULL,
    MODIFY `data_emissao` DATETIME(3) NULL,
    MODIFY `orgao_expedidor` VARCHAR(191) NULL,
    MODIFY `profissao` VARCHAR(191) NULL,
    MODIFY `renda_mensal` INTEGER NULL,
    MODIFY `cep` INTEGER NULL,
    MODIFY `uf` VARCHAR(191) NULL,
    MODIFY `endereco` VARCHAR(191) NULL,
    MODIFY `numero` INTEGER NULL,
    MODIFY `sexo` ENUM('MASCULINO', 'FEMININO') NULL,
    MODIFY `bairro` VARCHAR(191) NULL,
    MODIFY `cidade` VARCHAR(191) NULL,
    MODIFY `telefone01` INTEGER NULL;

-- DropTable
DROP TABLE `cliente`;
