import {
  Controller,
  Post,
  Res,
  HttpStatus,
  Body,
  Get,
  Param,
  NotFoundException,
  Delete,
  Put,
  UsePipes,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { Response } from 'express';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async createProduct(
    @Res() res: Response,
    @User('id') userId: string,
    @Body() productDto: Partial<ProductDto>,
  ) {
    productDto.userId = userId;
    const product = await this.productService.createProduct(productDto);
    return res.status(HttpStatus.OK).json(product);
  }

  @Get()
  async getProducts(
    @Res() res: Response
  ) {
    const products = await this.productService.getProducts();
    return res.status(HttpStatus.OK).json(products);
  }

  @Get(':id')
  async getProduct(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const product = await this.productService.getProduct(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return res.status(HttpStatus.OK).json(product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Res() res: Response,
    @User('id') userId: string,
    @Param('id') productId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.productService.deleteProduct(userId, productId));
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Res() res: Response,
    @User('id') userId: string,
    @Param('id') productId: string,
    @Body() productDto: Partial<ProductDto>,
  ) {
    productDto.userId = userId;
    const product = await this.productService.updateProduct(productId, productDto);

    if (!product) {
      throw new NotFoundException('Product no found');
    }

    return res.status(HttpStatus.OK).json(product);
  }
}
