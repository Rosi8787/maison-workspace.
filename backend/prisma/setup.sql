-- ============================================================
-- UKK Coworking Space Database Setup
-- Jalankan script ini di phpMyAdmin atau mysql CLI:
--   mysql -u root -p < setup.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS `ukk_coworking`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `ukk_coworking`;

-- Setelah menjalankan script ini, lanjutkan dengan:
--   cd backend
--   npx prisma migrate dev --name init
--   npx ts-node prisma/seed.ts
