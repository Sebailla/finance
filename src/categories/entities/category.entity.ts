
import { Product } from 'src/products/entities/products.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string;  // UUID generado automáticamente

    @Column({ type: 'varchar', length: 60, unique: true })
    cat_name: string;  // Nombre de la categoría, único

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;  // Fecha de creación automática

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;  // Fecha de actualización automática

    /* Relaciones */

    @OneToMany(()=> Product, (product) => product.category, { cascade: true })
    products: Product[];
}

