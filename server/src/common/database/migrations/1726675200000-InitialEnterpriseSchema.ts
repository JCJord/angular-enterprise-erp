import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialEnterpriseSchema1726675200000 implements MigrationInterface {
  name = 'InitialEnterpriseSchema1726675200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "jewelry_category_enum" AS ENUM ('RING', 'NECKLACE', 'BRACELET', 'EARRING', 'WEDDING_RING');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "metal_type_enum" AS ENUM ('GOLD_18K_YELLOW', 'GOLD_18K_WHITE', 'SILVER_925', 'PLATINUM');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "order_status_enum" AS ENUM ('DRAFT', 'CASTING', 'BENCH', 'SETTING', 'POLISHING', 'READY');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "full_name" varchar(255) NOT NULL,
        "role" varchar(50) NOT NULL DEFAULT 'INSPECTOR',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "customers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "document" varchar(20) NOT NULL UNIQUE,
        "phone" varchar(30),
        "email" varchar(255),
        "credit_limit" numeric(12,2) NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'jewelry_items' AND column_name = 'id' AND data_type = 'integer'
        ) THEN
          DROP TABLE IF EXISTS "production_orders" CASCADE;
          DROP TABLE IF EXISTS "jewelry_items" CASCADE;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "jewelry_items" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "sku" varchar(50) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "category" "jewelry_category_enum" NOT NULL,
        "metal_type" "metal_type_enum" NOT NULL DEFAULT 'GOLD_18K_YELLOW',
        "weight_grams" numeric(10,3) NOT NULL,
        "stock_quantity" int NOT NULL DEFAULT 0,
        "min_stock_alert" int NOT NULL DEFAULT 2,
        "gold_quotation_ref" numeric(10,2) NOT NULL,
        "base_price" numeric(12,2) NOT NULL,
        "photo_url" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'jewelry_items' AND column_name = 'metal_type'
        ) THEN
          ALTER TABLE "jewelry_items" ADD COLUMN "metal_type" "metal_type_enum" NOT NULL DEFAULT 'GOLD_18K_YELLOW';
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "jewelry_orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "order_number" varchar(50) NOT NULL UNIQUE,
        "customer_id" uuid REFERENCES "customers"("id") ON DELETE SET NULL,
        "jewelry_item_id" uuid REFERENCES "jewelry_items"("id") ON DELETE SET NULL,
        "metal_type" "metal_type_enum" NOT NULL,
        "weight_grams" numeric(10,3) NOT NULL,
        "daily_metal_quotation" numeric(10,2) NOT NULL,
        "stones_count" int NOT NULL DEFAULT 0,
        "stone_unit_price" numeric(10,2) NOT NULL DEFAULT 0,
        "artisan_labor_fee" numeric(10,2) NOT NULL,
        "finishing_fee" numeric(10,2) NOT NULL DEFAULT 0,
        "total_price" numeric(12,2) NOT NULL,
        "status" "order_status_enum" NOT NULL DEFAULT 'DRAFT',
        "deadline" date,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "warehouse_positions" (
        "id" SERIAL PRIMARY KEY,
        "armazem" varchar(50) NOT NULL DEFAULT 'ALRA',
        "linha" varchar(10) NOT NULL,
        "box" varchar(10) NOT NULL,
        "nivel" varchar(10) NOT NULL,
        "situacao" varchar(50) NOT NULL DEFAULT 'Livre',
        "quantidade_caixas" int NOT NULL DEFAULT 0,
        "tipo_embalagem" varchar(50) NOT NULL DEFAULT 'Palletizado',
        "sequencia" varchar(50) NOT NULL DEFAULT '1',
        "quebrado" boolean NOT NULL DEFAULT false,
        "peso_maximo_kg" numeric(10,2) NOT NULL DEFAULT 850.00,
        "peso_atual_kg" numeric(10,2) NOT NULL DEFAULT 0.00,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_warehouse_pos_unique" 
      ON "warehouse_positions" ("armazem", "linha", "box", "nivel");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cargo_preparations" (
        "id" SERIAL PRIMARY KEY,
        "codigo_carga" varchar(50) NOT NULL UNIQUE,
        "cliente_fornecedor" varchar(255) NOT NULL,
        "codigo_sap" varchar(50) NOT NULL,
        "pagamento_antecipado" boolean NOT NULL DEFAULT false,
        "numero_volumes" int NOT NULL DEFAULT 0,
        "numero_suportes" int NOT NULL DEFAULT 0,
        "peso_comercial" numeric(12,2) NOT NULL DEFAULT 0.00,
        "peso_bruto" numeric(12,2) NOT NULL DEFAULT 0.00,
        "peso_liquido" numeric(12,2) NOT NULL DEFAULT 0.00,
        "observacao" text,
        "status" varchar(50) NOT NULL DEFAULT 'EM_PREPARACAO',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cargo_materials" (
        "id" SERIAL PRIMARY KEY,
        "cargo_id" int NOT NULL REFERENCES "cargo_preparations"("id") ON DELETE CASCADE,
        "material" varchar(100) NOT NULL,
        "qualidade_qi" varchar(20) NOT NULL DEFAULT 'Q2',
        "solicitado_kg" numeric(12,2) NOT NULL DEFAULT 0.00,
        "comercial_kg" numeric(12,2) NOT NULL DEFAULT 0.00,
        "liquido_kg" numeric(12,2) NOT NULL DEFAULT 0.00,
        "bruto_kg" numeric(12,2) NOT NULL DEFAULT 0.00,
        "volumes" int NOT NULL DEFAULT 0,
        "suportes" int NOT NULL DEFAULT 0,
        "observacao" text
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cargo_pallets" (
        "id" SERIAL PRIMARY KEY,
        "cargo_id" int NOT NULL REFERENCES "cargo_preparations"("id") ON DELETE CASCADE,
        "palete" varchar(50) NOT NULL,
        "armazem_local" varchar(100) NOT NULL,
        "comercial_kg" numeric(10,2) NOT NULL DEFAULT 0.00,
        "liquido_kg" numeric(10,2) NOT NULL DEFAULT 0.00,
        "bruto_kg" numeric(10,2) NOT NULL DEFAULT 0.00,
        "volumes" int NOT NULL DEFAULT 1,
        "suportes" int NOT NULL DEFAULT 1
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cargo_boxes" (
        "id" SERIAL PRIMARY KEY,
        "cargo_id" int NOT NULL REFERENCES "cargo_preparations"("id") ON DELETE CASCADE,
        "caixa" varchar(50) NOT NULL,
        "suportes" int NOT NULL DEFAULT 1,
        "comercial_kg" numeric(10,2) NOT NULL DEFAULT 0.00,
        "liquido_kg" numeric(10,2) NOT NULL DEFAULT 0.00,
        "bruto_kg" numeric(10,2) NOT NULL DEFAULT 0.00
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "cargo_boxes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cargo_pallets";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cargo_materials";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cargo_preparations";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "warehouse_positions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "jewelry_orders";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "jewelry_items";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "customers";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "order_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "metal_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "jewelry_category_enum";`);
  }
}
