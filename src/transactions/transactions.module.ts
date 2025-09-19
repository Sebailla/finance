import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Product } from 'src/products/entities/products.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { CouponsModule } from 'src/coupons/coupons.module';


@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Transaction,
        TransactionContents,
        Product,
      ]
    ), CouponsModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule { }
