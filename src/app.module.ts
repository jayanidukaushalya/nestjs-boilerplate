import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Brand } from './brand/brand.entity';
import { BrandModule } from './brand/brand.module';
import { Category } from './category/category.entity';
import { CategoryModule } from './category/category.module';
import { authConfig } from './config/auth.config';
import { appConfig } from './config/base.config';
import { appConfigSchema } from './config/config.schema';
import { IAppConfig } from './config/config.types';
import { dbConfig } from './config/db.config';
import { Product } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { Stock } from './stock/stock.entity';
import { StockModule } from './stock/stock.module';
import { UOM } from './uom/uom.entity';
import { UomModule } from './uom/uom.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, authConfig],
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IAppConfig>) => ({
        ...configService.get<TypeOrmModuleOptions>('db'),
        entities: [User, Category, Brand, UOM, Product, Stock],
      }),
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    UomModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
