// src/entities/usuario.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Cuenta } from './cuenta.entity';
import { Gasto } from './gasto.entity';
import { Ingreso } from './ingreso.entity';
import { Inversion } from './inversion.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Column({ length: 150, unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ length: 50, default: 'usuario' })
  rol: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relaciones
  @OneToMany(() => Cuenta, cuenta => cuenta.usuario)
  cuentas: Cuenta[];

  @OneToMany(() => Gasto, gasto => gasto.usuario)
  gastos: Gasto[];

  @OneToMany(() => Ingreso, ingreso => ingreso.usuario)
  ingresos: Ingreso[];

  @OneToMany(() => Inversion, inversion => inversion.usuario)
  inversiones: Inversion[];
}

// src/entities/categoria.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Gasto } from './gasto.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  @IsBoolean()
  activo: boolean;

  // Relaciones
  @OneToMany(() => Gasto, gasto => gasto.categoria)
  gastos: Gasto[];
}

// src/entities/forma-pago.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Gasto } from './gasto.entity';

@Entity('formas_pago')
export class FormaPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Column({ length: 50, nullable: true })
  tipo: string; // efectivo, tarjeta_credito, tarjeta_debito, transferencia

  @Column({ default: true })
  @IsBoolean()
  activo: boolean;

  // Relaciones
  @OneToMany(() => Gasto, gasto => gasto.formaPago)
  gastos: Gasto[];
}

// src/entities/cuenta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsDecimal, IsBoolean } from 'class-validator';
import { Usuario } from './usuario.entity';
import { Gasto } from './gasto.entity';
import { Ingreso } from './ingreso.entity';
import { Inversion } from './inversion.entity';

@Entity('cuentas')
export class Cuenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Column({ length: 50 })
  @IsNotEmpty()
  tipo: string; // corriente, ahorro, inversion, efectivo

  @Column({ length: 10, default: 'ARS' })
  moneda: string;

  @Column({ name: 'saldo_inicial', type: 'decimal', precision: 14, scale: 2, default: 0 })
  @IsDecimal()
  saldoInicial: number;

  @Column({ name: 'saldo_actual', type: 'decimal', precision: 14, scale: 2, default: 0 })
  @IsDecimal()
  saldoActual: number;

  @Column({ default: true })
  @IsBoolean()
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relaciones
  @ManyToOne(() => Usuario, usuario => usuario.cuentas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Gasto, gasto => gasto.cuenta)
  gastos: Gasto[];

  @OneToMany(() => Ingreso, ingreso => ingreso.cuenta)
  ingresos: Ingreso[];

  @OneToMany(() => Inversion, inversion => inversion.cuenta)
  inversiones: Inversion[];
}

// src/entities/activo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Unique } from 'typeorm';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { PrecioHistorico } from './precio-historico.entity';
import { Inversion } from './inversion.entity';

@Entity('activos')
@Unique(['simbolo', 'fuente'])
export class Activo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @IsNotEmpty()
  @IsString()
  simbolo: string;

  @Column({ length: 255, nullable: true })
  nombre: string;

  @Column({ length: 50 })
  @IsNotEmpty()
  tipo: string; // accion, bono, etf, cripto, moneda, cedear

  @Column({ length: 100, nullable: true })
  mercado: string;

  @Column({ name: 'moneda_base', length: 10 })
  @IsNotEmpty()
  monedaBase: string;

  @Column({ length: 50, default: 'yahoo' })
  fuente: string;

  @Column({ default: true })
  @IsBoolean()
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relaciones
  @OneToMany(() => PrecioHistorico, precio => precio.activo)
  preciosHistoricos: PrecioHistorico[];

  @OneToMany(() => Inversion, inversion => inversion.activo)
  inversiones: Inversion[];
}

// src/entities/precio-historico.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, JoinColumn, Unique, Index } from 'typeorm';
import { IsNotEmpty, IsDecimal, IsDateString } from 'class-validator';
import { Activo } from './activo.entity';

@Entity('precios_historicos')
@Unique(['activoId', 'fecha', 'fuente'])
@Index(['fecha'])
@Index(['activoId', 'fecha'])
export class PrecioHistorico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'activo_id' })
  activoId: number;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @Column({ name: 'precio_cierre', type: 'decimal', precision: 14, scale: 4 })
  @IsNotEmpty()
  @IsDecimal()
  precioCierre: number;

  @Column({ name: 'precio_apertura', type: 'decimal', precision: 14, scale: 4, nullable: true })
  @IsDecimal()
  precioApertura: number;

  @Column({ type: 'decimal', precision: 14, scale: 4, nullable: true })
  @IsDecimal()
  maximo: number;

  @Column({ type: 'decimal', precision: 14, scale: 4, nullable: true })
  @IsDecimal()
  minimo: number;

  @Column({ type: 'bigint', nullable: true })
  volumen: number;

  @Column({ length: 50, default: 'yahoo' })
  fuente: string;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  // Relaciones
  @ManyToOne(() => Activo, activo => activo.preciosHistoricos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activo_id' })
  activo: Activo;
}

// src/entities/tipo-cambio.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, Unique, Index } from 'typeorm';
import { IsNotEmpty, IsDecimal, IsDateString, Length } from 'class-validator';

@Entity('tipos_cambio')
@Unique(['fecha', 'monedaOrigen', 'monedaDestino', 'fuente'])
@Index(['fecha'])
@Index(['monedaOrigen', 'monedaDestino'])
export class TipoCambio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @Column({ name: 'moneda_origen', length: 10 })
  @IsNotEmpty()
  @Length(3, 10)
  monedaOrigen: string;

  @Column({ name: 'moneda_destino', length: 10 })
  @IsNotEmpty()
  @Length(3, 10)
  monedaDestino: string;

  @Column({ type: 'decimal', precision: 14, scale: 6 })
  @IsNotEmpty()
  @IsDecimal()
  tasa: number;

  @Column({ length: 50, default: 'yahoo' })
  fuente: string;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}

// src/entities/gasto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Check } from 'typeorm';
import { IsNotEmpty, IsString, IsDecimal, IsDateString, IsBoolean } from 'class-validator';
import { Usuario } from './usuario.entity';
import { Categoria } from './categoria.entity';
import { FormaPago } from './forma-pago.entity';
import { Cuenta } from './cuenta.entity';

@Entity('gastos')
@Check('importe > 0')
export class Gasto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @Column({ name: 'categoria_id' })
  categoriaId: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  concepto: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  @IsNotEmpty()
  @IsDecimal()
  importe: number;

  @Column({ name: 'forma_pago_id' })
  formaPagoId: number;

  @Column({ name: 'cuenta_id' })
  cuentaId: number;

  @Column({ type: 'text', nullable: true })
  nota: string;

  @Column({ type: 'smallint', generated: 'ALWAYS AS (EXTRACT(MONTH FROM fecha)) STORED' })
  mes: number;

  @Column({ type: 'smallint', generated: 'ALWAYS AS (EXTRACT(YEAR FROM fecha)) STORED' })
  anio: number;

  @Column({ name: 'es_fijo', default: false })
  @IsBoolean()
  esFijo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relaciones
  @ManyToOne(() => Usuario, usuario => usuario.gastos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Categoria, categoria => categoria.gastos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @ManyToOne(() => FormaPago, formaPago => formaPago.gastos)
  @JoinColumn({ name: 'forma_pago_id' })
  formaPago: FormaPago;

  @ManyToOne(() => Cuenta, cuenta => cuenta.gastos)
  @JoinColumn({ name: 'cuenta_id' })
  cuenta: Cuenta;
}

// src/entities/ingreso.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Check } from 'typeorm';
import { IsNotEmpty, IsString, IsDecimal, IsDateString } from 'class-validator';
import { Usuario } from './usuario.entity';
import { Cuenta } from './cuenta.entity';

@Entity('ingresos')
@Check('importe > 0')
export class Ingreso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @Column({ length: 255, nullable: true })
  pagador: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  concepto: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  @IsNotEmpty()
  @IsDecimal()
  importe: number;

  @Column({ name: 'cuenta_id' })
  cuentaId: number;

  @Column({ type: 'text', nullable: true })
  nota: string;

  @Column({ type: 'smallint', generated: 'ALWAYS AS (EXTRACT(MONTH FROM fecha)) STORED' })
  mes: number;

  @Column({ type: 'smallint', generated: 'ALWAYS AS (EXTRACT(YEAR FROM fecha)) STORED' })
  anio: number;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relaciones
  @ManyToOne(() => Usuario, usuario => usuario.ingresos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Cuenta, cuenta => cuenta.ingresos)
  @JoinColumn({ name: 'cuenta_id' })
  cuenta: Cuenta;
}

// src/entities/inversion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsDecimal, IsDateString } from 'class-validator';
import { Usuario } from './usuario.entity';
import { Activo } from './activo.entity';
import { Cuenta } from './cuenta.entity';
import { ValuacionInversion } from './valuacion-inversion.entity';

@Entity('inversiones')
export class Inversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @Column({ name: 'activo_id', nullable: true })
  activoId: number;

  @Column({ length: 100, nullable: true })
  categoria: string;

  @Column({ length: 100, nullable: true })
  producto: string;

  @Column({ length: 100, nullable: true })
  comitente: string;

  @Column({ length: 50 })
  @IsNotEmpty()
  @IsString()
  operacion: string; // compra, venta, dividendo, split

  @Column({ type: 'decimal', precision: 14, scale: 6, nullable: true })
  @IsDecimal()
  cantidad: number;

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 14, scale: 4, nullable: true })
  @IsDecimal()
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  @IsNotEmpty()
  @IsDecimal()
  importe: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  @IsDecimal()
  comisiones: number;

  @Column({ name: 'cuenta_id' })
  cuentaId: number;

  @Column({ type: 'text', nullable: true })
  nota: string;

  @Column({ type: 'smallint', generated: 'ALWAYS AS (EXTRACT(MONTH FROM fecha)) STORED' })
  mes: number;

  @Column({ type: 'smallint', generated: 'ALWAYS AS (EXTRACT(YEAR FROM fecha)) STORED' })
  anio: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  total: number;

  @Column({ length: 20, default: 'ejecutada' })
  estado: string; // ejecutada, pendiente, cancelada

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relaciones
  @ManyToOne(() => Usuario, usuario => usuario.inversiones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Activo, activo => activo.inversiones)
  @JoinColumn({ name: 'activo_id' })
  activo: Activo;

  @ManyToOne(() => Cuenta, cuenta => cuenta.inversiones)
  @JoinColumn({ name: 'cuenta_id' })
  cuenta: Cuenta;

  @OneToMany(() => ValuacionInversion, valuacion => valuacion.inversion)
  valuaciones: ValuacionInversion[];
}

// src/entities/valuacion-inversion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Unique } from 'typeorm';
import { IsNotEmpty, IsDecimal, IsDateString } from 'class-validator';
import { Inversion } from './inversion.entity';

@Entity('valuaciones_inversiones')
@Unique(['inversionId', 'fecha'])
export class ValuacionInversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'inversion_id' })
  inversionId: number;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @Column({ name: 'cantidad_actual', type: 'decimal', precision: 14, scale: 6, nullable: true })
  @IsDecimal()
  cantidadActual: number;

  @Column({ name: 'precio_mercado', type: 'decimal', precision: 14, scale: 4, nullable: true })
  @IsDecimal()
  precioMercado: number;

  @Column({ name: 'valor_mercado', type: 'decimal', precision: 14, scale: 2, nullable: true })
  @IsDecimal()
  valorMercado: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  @IsNotEmpty()
  @IsDecimal()
  valor: number;

  @Column({ name: 'ganancia_perdida', type: 'decimal', precision: 14, scale: 2, nullable: true })
  @IsDecimal()
  gananciaPerdida: number;

  @Column({ name: 'porcentaje_rendimiento', type: 'decimal', precision: 8, scale: 4, nullable: true })
  @IsDecimal()
  porcentajeRendimiento: number;

  @Column({ name: 'fuente_precio', length: 50, nullable: true })
  fuentePrecio: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  // Relaciones
  @ManyToOne(() => Inversion, inversion => inversion.valuaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inversion_id' })
  inversion: Inversion;
}

// src/entities/log-actualizacion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsString, IsNumber } from 'class-validator';

@Entity('logs_actualizacion')
export class LogActualizacion {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_proceso' })
  fechaProceso: Date;

  @Column({ length: 50, nullable: true })
  @IsString()
  tipo: string; // precios, tipos_cambio, activos

  @Column({ length: 50, nullable: true })
  @IsString()
  fuente: string;

  @Column({ name: 'registros_procesados', nullable: true })
  @IsNumber()
  registrosProcesados: number;

  @Column({ name: 'registros_exitosos', nullable: true })
  @IsNumber()
  registrosExitosos: number;

  @Column({ name: 'registros_error', nullable: true })
  @IsNumber()
  registrosError: number;

  @Column({ name: 'mensaje_error', type: 'text', nullable: true })
  mensajeError: string;

  @Column({ name: 'duracion_ms', nullable: true })
  @IsNumber()
  duracionMs: number;
}

// src/entities/configuracion-mercado.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';
import { IsString } from 'class-validator';

@Entity('configuracion_mercado')
export class ConfiguracionMercado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  @IsString()
  clave: string;

  @Column({ type: 'text', nullable: true })
  valor: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}