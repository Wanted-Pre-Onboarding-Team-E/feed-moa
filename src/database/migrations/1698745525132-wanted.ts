import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wanted1698745525132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`users\`
                             (
                                 \`id\`         bigint       NOT NULL AUTO_INCREMENT,
                                 \`username\`   varchar(100) NOT NULL,
                                 \`email\`      varchar(100) NOT NULL,
                                 \`password\`   varchar(200) NOT NULL,
                                 \`is_active\`  tinyint(1)   NOT NULL DEFAULT '0',
                                 \`created_at\` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 \`updated_at\` timestamp    NULL     DEFAULT NULL,
                                 PRIMARY KEY (\`id\`),
                                 UNIQUE KEY \`username\` (\`username\`)
                             ) ENGINE = InnoDB
                               DEFAULT CHARSET = utf8mb4
                               COLLATE = utf8mb4_0900_ai_ci;`);
    await queryRunner.query(`CREATE TABLE \`auth_codes\`
                             (
                                 \`id\`         bigint       NOT NULL AUTO_INCREMENT,
                                 \`username\`   varchar(100) NOT NULL,
                                 \`code\`       varchar(6)   NOT NULL,
                                 \`created_at\` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 PRIMARY KEY (\`id\`),
                                 UNIQUE KEY \`username\` (\`username\`)
                             ) ENGINE = InnoDB
                               DEFAULT CHARSET = utf8mb4
                               COLLATE = utf8mb4_0900_ai_ci;`);
    await queryRunner.query(`CREATE TABLE \`posts\`
                             (
                                 \`id\`          bigint       NOT NULL AUTO_INCREMENT,
                                 \`type\`        varchar(100) NOT NULL,
                                 \`title\`       varchar(200) NOT NULL,
                                 \`content\`     varchar(500) NOT NULL,
                                 \`view_count\`  bigint       NOT NULL DEFAULT '0',
                                 \`like_count\`  bigint       NOT NULL DEFAULT '0',
                                 \`share_count\` bigint       NOT NULL DEFAULT '0',
                                 \`created_at\`  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 \`updated_at\`  timestamp    NULL     DEFAULT NULL,
                                 PRIMARY KEY (\`id\`)
                             ) ENGINE = InnoDB
                               DEFAULT CHARSET = utf8mb4
                               COLLATE = utf8mb4_0900_ai_ci;`);
    await queryRunner.query(`CREATE TABLE \`hashtags\`
                             (
                                 \`id\`         bigint       NOT NULL AUTO_INCREMENT,
                                 \`post_id\`    bigint       NOT NULL,
                                 \`hashtag\`    varchar(100) NOT NULL,
                                 \`created_at\` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 PRIMARY KEY (\`id\`),
                                 KEY \`hashtags_FK\` (\`post_id\`),
                                 CONSTRAINT \`hashtags_FK\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\` (\`id\`) ON DELETE CASCADE
                             ) ENGINE = InnoDB
                               DEFAULT CHARSET = utf8mb4
                               COLLATE = utf8mb4_0900_ai_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`hashtags\`
          DROP FOREIGN KEY \`hashtags_FK\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`auth_codes\``);
    await queryRunner.query(`DROP TABLE \`posts\``);
    await queryRunner.query(`DROP TABLE \`hashtags\``);
  }
}
