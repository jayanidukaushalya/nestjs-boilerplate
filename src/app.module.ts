import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { BrandController } from './brand/brand.controller';
import { CategoryController } from './category/category.controller';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { appConfigSchema } from './config/config.schema';
import { dbConfig } from './config/db.config';
import { ProductController } from './product/product.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, authConfig],
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  controllers: [
    AppController,
    CategoryController,
    BrandController,
    ProductController,
    UserController,
    AuthController,
  ],
  providers: [AppService],
})
export class AppModule {}
