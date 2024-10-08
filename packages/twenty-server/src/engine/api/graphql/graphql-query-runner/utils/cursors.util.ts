import {
  Record as IRecord,
  RecordOrderBy,
} from 'src/engine/api/graphql/workspace-query-builder/interfaces/record.interface';

import {
  GraphqlQueryRunnerException,
  GraphqlQueryRunnerExceptionCode,
} from 'src/engine/api/graphql/graphql-query-runner/errors/graphql-query-runner.exception';

export interface CursorData {
  [key: string]: any;
}

export const decodeCursor = (cursor: string): CursorData => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString());
  } catch (err) {
    throw new GraphqlQueryRunnerException(
      `Invalid cursor: ${cursor}`,
      GraphqlQueryRunnerExceptionCode.INVALID_CURSOR,
    );
  }
};

export const encodeCursor = <ObjectRecord extends IRecord = IRecord>(
  objectRecord: ObjectRecord,
  order: RecordOrderBy | undefined,
): string => {
  const orderByValues: Record<string, any> = {};

  const orderBy = order?.reduce((acc, orderBy) => ({ ...acc, ...orderBy }), {});

  const orderByKeys = Object.keys(orderBy ?? {});

  orderByKeys?.forEach((key) => {
    orderByValues[key] = objectRecord[key];
  });

  const cursorData: CursorData = {
    ...orderByValues,
    id: objectRecord.id,
  };

  return Buffer.from(JSON.stringify(cursorData)).toString('base64');
};
