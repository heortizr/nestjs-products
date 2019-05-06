import { Resolver, Query, ResolveProperty, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { ProductService } from 'src/product/product.service';
import { Logger } from '@nestjs/common';

@Resolver('User')
export class UserResolver {

  constructor(
    private userService: UserService,
    private productService: ProductService,
  ) {}

  // We can use a parameter if the query name is not match
  // with the method name
  // @Query('users')
  @Query()
  users() {
    return this.userService.getUsers();
  }

  @ResolveProperty()
  async products(@Parent() user) {
    const { id } = user;
    return await this.productService.getProductByUser(id);
  }
}
