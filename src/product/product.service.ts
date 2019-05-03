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
    return await this.productModel.findById(id);
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

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(
    id: string,
    product: Partial<ProductDto>,
  ): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
  }
}
