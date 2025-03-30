import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('swift_codes')
export class SwiftCode {
  @PrimaryColumn()
  swiftCode: string;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: string) => value.toUpperCase(),
      from: (value: string) => value,
    },
  })
  countryISO2: string;

  @Column()
  bankName: string;

  @Column()
  address: string;

  @Column({ type: 'varchar', nullable: true })
  townName: string;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: string) => value.toUpperCase(),
      from: (value: string) => value,
    },
  })
  countryName: string;

  @Column({ type: 'varchar', nullable: true })
  timeZone: string;

  @Column({ default: false })
  isHeadquarter: boolean;

  @Column({ name: 'headquarterSwiftCode', type: 'varchar', nullable: true })
  headquarterSwiftCode: string | null;

  @ManyToOne(() => SwiftCode, (hq) => hq.branches, { nullable: true })
  @JoinColumn({ name: 'headquarterSwiftCode' })
  headquarter: SwiftCode;

  @OneToMany(() => SwiftCode, (branch) => branch.headquarter)
  branches: SwiftCode[];
}
