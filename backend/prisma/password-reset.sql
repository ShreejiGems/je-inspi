-- Additive schema update for existing JE-Inspi databases. Back up before applying.
-- This project predates Prisma migration history. Do not run migrate deploy without baselining.
CREATE TABLE IF NOT EXISTS `PasswordResetToken` (
  `userId` VARCHAR(191) NOT NULL,
  `tokenHash` CHAR(64) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE INDEX `PasswordResetToken_tokenHash_key` (`tokenHash`),
  INDEX `PasswordResetToken_expiresAt_idx` (`expiresAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PasswordResetRateLimit` (
  `id` CHAR(64) NOT NULL,
  `count` INTEGER NOT NULL DEFAULT 1,
  `expiresAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `PasswordResetRateLimit_expiresAt_idx` (`expiresAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
