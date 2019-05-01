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
  Query,
  Put,
  HttpException,
  UsePipes,
} from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { Response } from 'express';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  // @UsePipes(new ValidationPipe())
  async createProduct(
    @Res() res: Response,
    @Body() productDto: Partial<CreateProductDto>,
  ) {
    const product = await this.productService.createProduct(productDto);
    return res.status(HttpStatus.OK).json(product);
  }

  @Get()
  async getProducts(@Res() res: Response) {
    const products = await this.productService.getProducts();
    return res.status(HttpStatus.OK).json(products);
  }

  @Get(':id')
  async getProduct(@Res() res: Response, @Param('id') id: string) {
    const product = await this.productService.getProduct(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return res.status(HttpStatus.OK).json(product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productService.deleteProduct(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return res.status(HttpStatus.OK).json(product);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() productDto: Partial<CreateProductDto>,
  ) {
    const product = await this.productService.updateProduct(id, productDto);

    if (!product) {
      throw new NotFoundException('Product no found');
    }

    return res.status(HttpStatus.OK).json(product);
  }
}
