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
  async create(
    @Res() res: Response,
    @User('id') userId: string,
    @Body() productDto: Partial<ProductDto>,
  ) {
    productDto.userId = userId;
    const product = await this.productService.createProduct(productDto);

    return res
      .status(HttpStatus.OK)
      .json(product);
  }

  @Get()
  async getAll(
    @Res() res: Response,
  ) {
    const products = await this.productService.getProducts();

    return res
      .status(HttpStatus.OK)
      .json(products);
  }

  @Get(':id')
  async getOne(
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const product = await this.productService.getProduct(id);

    return res
      .status(HttpStatus.OK)
      .json(product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Res() res: Response,
    @User('id') userId: string,
    @Param('id') productId: string,
  ) {
    const product = await this.productService.deleteProduct(
      userId,
      productId,
    );

    return res
      .status(HttpStatus.OK)
      .json(product);
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
    const product = await this.productService.updateProduct(
      userId,
      productId,
      productDto,
    );

    return res
      .status(HttpStatus.OK)
      .json(product);
  }
}
