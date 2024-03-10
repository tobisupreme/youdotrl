import { CrudMapType } from '@@/common/database/interfaces';
import { Prisma } from '@prisma/client';

export class UrlMapType implements CrudMapType {
  aggregate: Prisma.UrlAggregateArgs;
  count: Prisma.UrlCountArgs;
  create: Prisma.UrlCreateArgs;
  createMany?: Prisma.UrlCreateManyArgs;
  delete: Prisma.UrlDeleteArgs;
  deleteMany: Prisma.UrlDeleteManyArgs;
  findFirst: Prisma.UrlFindFirstArgs;
  findMany: Prisma.UrlFindManyArgs;
  findUnique: Prisma.UrlFindUniqueArgs;
  update: Prisma.UrlUpdateArgs;
  updateMany: Prisma.UrlUpdateManyArgs;
  upsert: Prisma.UrlUpsertArgs;
}
