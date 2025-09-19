import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'coupons'})
export class Coupon {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'varchar', unique: true, length: 30})
    code: string

    @Column({type: 'int'})
    discount: number

    @Column({type: 'date'})
    expirationDate: Date

    @Column({default: true})
    isActive: boolean
}
