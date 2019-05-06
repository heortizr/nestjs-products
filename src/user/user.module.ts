import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.schema';
import { UserResolver } from './user.resolver';
import { ProductService } from '../product/product.service';
import { productSchema } from 'src/product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'user', schema: userSchema},
      {name: 'product', schema: productSchema}
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserResolver,
    ProductService,
  ],
})
export class UserModule {}
