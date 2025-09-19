import { Product } from "../../products/entities/products.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'transactions' })
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total: number

    @Column({type: "varchar", length: 50, nullable: true})
    coupon: string

    @Column({type: "decimal", nullable: true})
    discount: number

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    transaction_date: Date

    @OneToMany(() => TransactionContents, (transaction) => transaction.transaction, { cascade: true, eager: true })
    contents: TransactionContents[]
}


@Entity({ name: 'transactions_contents' })
export class TransactionContents {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'int' })
    quantity: number

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number

    @ManyToOne(() => Product, (product) => product.id, { eager: true })
    product: Product

    @ManyToOne(() => Transaction, (transaction) => transaction.contents)
    transaction: Transaction
}
