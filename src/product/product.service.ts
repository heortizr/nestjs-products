import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dto/product.dto';

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
    createProductDto: Partial<CreateProductDto>,
  ): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }

  async deleteProduct(id: string): Promise<Product> {
    return await this.productModel.findByIdAndDelete(id);
  }

  async updateProduct(
    id: string,
    product: Partial<CreateProductDto>,
  ): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
  }
}
