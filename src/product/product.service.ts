import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interfaces/product.interface';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel('product')
    private readonly productModel: Model<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return await this.productModel.find();
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(
    createProductDto: Partial<ProductDto>,
  ): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }

  async deleteProduct(userId: string, productoId: string): Promise<Product> {
    const product = await this.productModel.findOneAndDelete({
      id: productoId,
      userId,
    });

    // I could be more specific with the error, I mean really do not exists
    // or it is a forbidden resource for autenticated user
    // whatever it is just a simple example
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(
    userId: string,
    productId: string,
    productDto: Partial<ProductDto>,
  ): Promise<Product> {
    const product = await this.productModel.findOneAndUpdate(
      {
        id: productId,
        userId,
      },
      productDto,
      { new: true }
    );

    // I could be more specific with the error, I mean really do not exists
    // or it is a forbidden resource for autenticated user
    // whatever it is just a simple example
    if (!product) throw new NotFoundException('Product no found');
    return product;
  }
}
