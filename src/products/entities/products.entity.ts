import { Category } from 'src/categories/entities/category.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, type: 'varchar', length: 80, nullable: false })
    name: string; // Nombre único del producto

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        default: 'default.svd',
    })
    image: string; // Imagen del producto

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string; // Descripción opcional

    @Column({ type: 'int', default: 0 })
    stock: number; // Cantidad en stock

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number; // Precio con 2 decimales

    @Column({ type: 'boolean', default: true })
    status: boolean; // Estado del producto

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date; // Fecha de creación automática

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date; // Fecha de actualización automática

    /* Relaciones */
    @ManyToOne(() => Category, (category) => category.products) //eager se trae la info de las relaciones
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;
}
