import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/products.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from 'src/coupons/coupons.service';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly couponServices: CouponsService,
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {

    // Transaction ORM
    await this.productRepository.manager.transaction(async (transactionEntityManager) => {

      const transaction = new Transaction()
      const total = createTransactionDto.contents.reduce((total, item) => total + (item.price * item.quantity), 0)
      transaction.total = total
      
      // discount coupon
      if (createTransactionDto.coupon){
        const coupon = await this.couponServices.applyCoupons(createTransactionDto.coupon)

        const discount = (coupon.discount / 100) * total
        transaction.coupon = coupon.code
        transaction.discount = discount
        transaction.total -= discount
      }

      await transactionEntityManager.save(Transaction, transaction) //Save total + discount

      for (const contents of createTransactionDto.contents) {

        // Find exist Product
        const product = await transactionEntityManager.findOneBy(Product, { id: contents.productId })

        const errors: string[] = []

        if (!product) {
          errors.push(`Product with id ${contents.productId} not found`)
          throw new NotFoundException(errors)
        }

        if (product.stock < contents.quantity) {
          errors.push(`Product with id ${contents.productId} has not enough stock`)
          throw new BadRequestException(errors)
        }

        // Update Stock
        product.stock -= contents.quantity
        await transactionEntityManager.save(Product, product)

        // Create TransactionContents instance
        const transactionContent = new TransactionContents()
        transactionContent.quantity = contents.quantity
        transactionContent.price = contents.price
        transactionContent.transaction = transaction
        transactionContent.product = product



        await transactionEntityManager.save(TransactionContents, transactionContent)
      }

    })

    return { message: `Transaction, created successfully` }
  }

  async findAll(transactionDate?: string) {

    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: {
          product: true
        }
      }
    }

    if (transactionDate) {
      const date = parseISO(transactionDate)

      if (!isValid(date)) {
        throw new BadRequestException(['Date is not valid'])
      }
      const start = startOfDay(date)
      const end = endOfDay(date)

      options.where = {
        transaction_date: Between(start, end)
      }
    }

    const [transactions, total] = await this.transactionRepository.findAndCount(options)

    return { transactions, total }
  }

  async findOne(id: string) {

    const transaction = await this.transactionRepository.findOne({
      where: { id: id },
      relations: {
        contents: {
          product: true
        },
      }
    })

    if (!transaction) {
      throw new NotFoundException(['Transaction not found'])
    }

    return transaction
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    //! NOT USE THIS METHOD
    return `This action updates a #${id} transaction`;
  }

  async remove(id: string) {

    const transaction = await this.findOne(id)

    for (const content of transaction.contents) {

      const product = await this.productRepository.findOneBy({id: content.product.id})
      if (!product) {
        throw new NotFoundException([`Product with id ${content.product.id} not found`])
      }
      product.stock += content.quantity
      await this.productRepository.save(product)

      const transactionContents = await this.transactionContentRepository.findOneBy({ id: content.id })
      await this.transactionContentRepository.remove(transactionContents!)
    }

    await this.transactionRepository.remove(transaction)

    return {message: `Transaction, deleted successfully`}
  }
}
