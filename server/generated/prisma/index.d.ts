
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model Child
 * 
 */
export type Child = $Result.DefaultSelection<Prisma.$ChildPayload>
/**
 * Model Mother
 * 
 */
export type Mother = $Result.DefaultSelection<Prisma.$MotherPayload>
/**
 * Model TDDose
 * 
 */
export type TDDose = $Result.DefaultSelection<Prisma.$TDDosePayload>
/**
 * Model VaccinationRecord
 * 
 */
export type VaccinationRecord = $Result.DefaultSelection<Prisma.$VaccinationRecordPayload>
/**
 * Model NotificationLog
 * 
 */
export type NotificationLog = $Result.DefaultSelection<Prisma.$NotificationLogPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model CorrectionRequest
 * 
 */
export type CorrectionRequest = $Result.DefaultSelection<Prisma.$CorrectionRequestPayload>
/**
 * Model Certificate
 * 
 */
export type Certificate = $Result.DefaultSelection<Prisma.$CertificatePayload>
/**
 * Model WeightRecord
 * 
 */
export type WeightRecord = $Result.DefaultSelection<Prisma.$WeightRecordPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  WARD_OFFICER: 'WARD_OFFICER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const UserStatus: {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const VaccineType: {
  BCG: 'BCG',
  DPT_HEPB_HIB: 'DPT_HEPB_HIB',
  ROTA: 'ROTA',
  OPV: 'OPV',
  FIPV: 'FIPV',
  PCV: 'PCV',
  MR: 'MR',
  JE: 'JE',
  TCV: 'TCV',
  HPV: 'HPV',
  OTHERS: 'OTHERS'
};

export type VaccineType = (typeof VaccineType)[keyof typeof VaccineType]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

export type VaccineType = $Enums.VaccineType

export const VaccineType: typeof $Enums.VaccineType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshToken.findMany()
    * ```
    */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.child`: Exposes CRUD operations for the **Child** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Children
    * const children = await prisma.child.findMany()
    * ```
    */
  get child(): Prisma.ChildDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mother`: Exposes CRUD operations for the **Mother** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Mothers
    * const mothers = await prisma.mother.findMany()
    * ```
    */
  get mother(): Prisma.MotherDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tDDose`: Exposes CRUD operations for the **TDDose** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TDDoses
    * const tDDoses = await prisma.tDDose.findMany()
    * ```
    */
  get tDDose(): Prisma.TDDoseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vaccinationRecord`: Exposes CRUD operations for the **VaccinationRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VaccinationRecords
    * const vaccinationRecords = await prisma.vaccinationRecord.findMany()
    * ```
    */
  get vaccinationRecord(): Prisma.VaccinationRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notificationLog`: Exposes CRUD operations for the **NotificationLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationLogs
    * const notificationLogs = await prisma.notificationLog.findMany()
    * ```
    */
  get notificationLog(): Prisma.NotificationLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.correctionRequest`: Exposes CRUD operations for the **CorrectionRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CorrectionRequests
    * const correctionRequests = await prisma.correctionRequest.findMany()
    * ```
    */
  get correctionRequest(): Prisma.CorrectionRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.certificate`: Exposes CRUD operations for the **Certificate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Certificates
    * const certificates = await prisma.certificate.findMany()
    * ```
    */
  get certificate(): Prisma.CertificateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.weightRecord`: Exposes CRUD operations for the **WeightRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeightRecords
    * const weightRecords = await prisma.weightRecord.findMany()
    * ```
    */
  get weightRecord(): Prisma.WeightRecordDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    RefreshToken: 'RefreshToken',
    Child: 'Child',
    Mother: 'Mother',
    TDDose: 'TDDose',
    VaccinationRecord: 'VaccinationRecord',
    NotificationLog: 'NotificationLog',
    AuditLog: 'AuditLog',
    CorrectionRequest: 'CorrectionRequest',
    Certificate: 'Certificate',
    WeightRecord: 'WeightRecord'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "refreshToken" | "child" | "mother" | "tDDose" | "vaccinationRecord" | "notificationLog" | "auditLog" | "correctionRequest" | "certificate" | "weightRecord"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      Child: {
        payload: Prisma.$ChildPayload<ExtArgs>
        fields: Prisma.ChildFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChildFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChildFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          findFirst: {
            args: Prisma.ChildFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChildFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          findMany: {
            args: Prisma.ChildFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>[]
          }
          create: {
            args: Prisma.ChildCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          createMany: {
            args: Prisma.ChildCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChildCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>[]
          }
          delete: {
            args: Prisma.ChildDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          update: {
            args: Prisma.ChildUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          deleteMany: {
            args: Prisma.ChildDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChildUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChildUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>[]
          }
          upsert: {
            args: Prisma.ChildUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChildPayload>
          }
          aggregate: {
            args: Prisma.ChildAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChild>
          }
          groupBy: {
            args: Prisma.ChildGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChildGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChildCountArgs<ExtArgs>
            result: $Utils.Optional<ChildCountAggregateOutputType> | number
          }
        }
      }
      Mother: {
        payload: Prisma.$MotherPayload<ExtArgs>
        fields: Prisma.MotherFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MotherFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MotherFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          findFirst: {
            args: Prisma.MotherFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MotherFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          findMany: {
            args: Prisma.MotherFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>[]
          }
          create: {
            args: Prisma.MotherCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          createMany: {
            args: Prisma.MotherCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MotherCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>[]
          }
          delete: {
            args: Prisma.MotherDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          update: {
            args: Prisma.MotherUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          deleteMany: {
            args: Prisma.MotherDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MotherUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MotherUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>[]
          }
          upsert: {
            args: Prisma.MotherUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          aggregate: {
            args: Prisma.MotherAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMother>
          }
          groupBy: {
            args: Prisma.MotherGroupByArgs<ExtArgs>
            result: $Utils.Optional<MotherGroupByOutputType>[]
          }
          count: {
            args: Prisma.MotherCountArgs<ExtArgs>
            result: $Utils.Optional<MotherCountAggregateOutputType> | number
          }
        }
      }
      TDDose: {
        payload: Prisma.$TDDosePayload<ExtArgs>
        fields: Prisma.TDDoseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TDDoseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TDDoseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>
          }
          findFirst: {
            args: Prisma.TDDoseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TDDoseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>
          }
          findMany: {
            args: Prisma.TDDoseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>[]
          }
          create: {
            args: Prisma.TDDoseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>
          }
          createMany: {
            args: Prisma.TDDoseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TDDoseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>[]
          }
          delete: {
            args: Prisma.TDDoseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>
          }
          update: {
            args: Prisma.TDDoseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>
          }
          deleteMany: {
            args: Prisma.TDDoseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TDDoseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TDDoseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>[]
          }
          upsert: {
            args: Prisma.TDDoseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TDDosePayload>
          }
          aggregate: {
            args: Prisma.TDDoseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTDDose>
          }
          groupBy: {
            args: Prisma.TDDoseGroupByArgs<ExtArgs>
            result: $Utils.Optional<TDDoseGroupByOutputType>[]
          }
          count: {
            args: Prisma.TDDoseCountArgs<ExtArgs>
            result: $Utils.Optional<TDDoseCountAggregateOutputType> | number
          }
        }
      }
      VaccinationRecord: {
        payload: Prisma.$VaccinationRecordPayload<ExtArgs>
        fields: Prisma.VaccinationRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VaccinationRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VaccinationRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>
          }
          findFirst: {
            args: Prisma.VaccinationRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VaccinationRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>
          }
          findMany: {
            args: Prisma.VaccinationRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>[]
          }
          create: {
            args: Prisma.VaccinationRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>
          }
          createMany: {
            args: Prisma.VaccinationRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VaccinationRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>[]
          }
          delete: {
            args: Prisma.VaccinationRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>
          }
          update: {
            args: Prisma.VaccinationRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>
          }
          deleteMany: {
            args: Prisma.VaccinationRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VaccinationRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VaccinationRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>[]
          }
          upsert: {
            args: Prisma.VaccinationRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaccinationRecordPayload>
          }
          aggregate: {
            args: Prisma.VaccinationRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVaccinationRecord>
          }
          groupBy: {
            args: Prisma.VaccinationRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<VaccinationRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.VaccinationRecordCountArgs<ExtArgs>
            result: $Utils.Optional<VaccinationRecordCountAggregateOutputType> | number
          }
        }
      }
      NotificationLog: {
        payload: Prisma.$NotificationLogPayload<ExtArgs>
        fields: Prisma.NotificationLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          findFirst: {
            args: Prisma.NotificationLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          findMany: {
            args: Prisma.NotificationLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>[]
          }
          create: {
            args: Prisma.NotificationLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          createMany: {
            args: Prisma.NotificationLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>[]
          }
          delete: {
            args: Prisma.NotificationLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          update: {
            args: Prisma.NotificationLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          deleteMany: {
            args: Prisma.NotificationLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>[]
          }
          upsert: {
            args: Prisma.NotificationLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          aggregate: {
            args: Prisma.NotificationLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationLog>
          }
          groupBy: {
            args: Prisma.NotificationLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationLogCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationLogCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      CorrectionRequest: {
        payload: Prisma.$CorrectionRequestPayload<ExtArgs>
        fields: Prisma.CorrectionRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CorrectionRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CorrectionRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>
          }
          findFirst: {
            args: Prisma.CorrectionRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CorrectionRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>
          }
          findMany: {
            args: Prisma.CorrectionRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>[]
          }
          create: {
            args: Prisma.CorrectionRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>
          }
          createMany: {
            args: Prisma.CorrectionRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CorrectionRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>[]
          }
          delete: {
            args: Prisma.CorrectionRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>
          }
          update: {
            args: Prisma.CorrectionRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>
          }
          deleteMany: {
            args: Prisma.CorrectionRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CorrectionRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CorrectionRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>[]
          }
          upsert: {
            args: Prisma.CorrectionRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CorrectionRequestPayload>
          }
          aggregate: {
            args: Prisma.CorrectionRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCorrectionRequest>
          }
          groupBy: {
            args: Prisma.CorrectionRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<CorrectionRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.CorrectionRequestCountArgs<ExtArgs>
            result: $Utils.Optional<CorrectionRequestCountAggregateOutputType> | number
          }
        }
      }
      Certificate: {
        payload: Prisma.$CertificatePayload<ExtArgs>
        fields: Prisma.CertificateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CertificateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CertificateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          findFirst: {
            args: Prisma.CertificateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CertificateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          findMany: {
            args: Prisma.CertificateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>[]
          }
          create: {
            args: Prisma.CertificateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          createMany: {
            args: Prisma.CertificateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CertificateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>[]
          }
          delete: {
            args: Prisma.CertificateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          update: {
            args: Prisma.CertificateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          deleteMany: {
            args: Prisma.CertificateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CertificateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CertificateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>[]
          }
          upsert: {
            args: Prisma.CertificateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificatePayload>
          }
          aggregate: {
            args: Prisma.CertificateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCertificate>
          }
          groupBy: {
            args: Prisma.CertificateGroupByArgs<ExtArgs>
            result: $Utils.Optional<CertificateGroupByOutputType>[]
          }
          count: {
            args: Prisma.CertificateCountArgs<ExtArgs>
            result: $Utils.Optional<CertificateCountAggregateOutputType> | number
          }
        }
      }
      WeightRecord: {
        payload: Prisma.$WeightRecordPayload<ExtArgs>
        fields: Prisma.WeightRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeightRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeightRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>
          }
          findFirst: {
            args: Prisma.WeightRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeightRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>
          }
          findMany: {
            args: Prisma.WeightRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>[]
          }
          create: {
            args: Prisma.WeightRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>
          }
          createMany: {
            args: Prisma.WeightRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeightRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>[]
          }
          delete: {
            args: Prisma.WeightRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>
          }
          update: {
            args: Prisma.WeightRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>
          }
          deleteMany: {
            args: Prisma.WeightRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeightRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WeightRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>[]
          }
          upsert: {
            args: Prisma.WeightRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeightRecordPayload>
          }
          aggregate: {
            args: Prisma.WeightRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeightRecord>
          }
          groupBy: {
            args: Prisma.WeightRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeightRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeightRecordCountArgs<ExtArgs>
            result: $Utils.Optional<WeightRecordCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    refreshToken?: RefreshTokenOmit
    child?: ChildOmit
    mother?: MotherOmit
    tDDose?: TDDoseOmit
    vaccinationRecord?: VaccinationRecordOmit
    notificationLog?: NotificationLogOmit
    auditLog?: AuditLogOmit
    correctionRequest?: CorrectionRequestOmit
    certificate?: CertificateOmit
    weightRecord?: WeightRecordOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    Child: number
    Mother: number
    createdVaccinationRecords: number
    administeredVaccinations: number
    AuditLogs: number
    createdWeightRecords: number
    administeredWeightRecords: number
    verifiedChildren: number
    createdTDDoses: number
    administeredTDDoses: number
    RefreshTokens: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Child?: boolean | UserCountOutputTypeCountChildArgs
    Mother?: boolean | UserCountOutputTypeCountMotherArgs
    createdVaccinationRecords?: boolean | UserCountOutputTypeCountCreatedVaccinationRecordsArgs
    administeredVaccinations?: boolean | UserCountOutputTypeCountAdministeredVaccinationsArgs
    AuditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
    createdWeightRecords?: boolean | UserCountOutputTypeCountCreatedWeightRecordsArgs
    administeredWeightRecords?: boolean | UserCountOutputTypeCountAdministeredWeightRecordsArgs
    verifiedChildren?: boolean | UserCountOutputTypeCountVerifiedChildrenArgs
    createdTDDoses?: boolean | UserCountOutputTypeCountCreatedTDDosesArgs
    administeredTDDoses?: boolean | UserCountOutputTypeCountAdministeredTDDosesArgs
    RefreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChildArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChildWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMotherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MotherWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedVaccinationRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VaccinationRecordWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAdministeredVaccinationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VaccinationRecordWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedWeightRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeightRecordWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAdministeredWeightRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeightRecordWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVerifiedChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChildWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedTDDosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TDDoseWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAdministeredTDDosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TDDoseWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }


  /**
   * Count Type ChildCountOutputType
   */

  export type ChildCountOutputType = {
    vaccinations: number
    NotificationLog: number
    weightRecords: number
  }

  export type ChildCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vaccinations?: boolean | ChildCountOutputTypeCountVaccinationsArgs
    NotificationLog?: boolean | ChildCountOutputTypeCountNotificationLogArgs
    weightRecords?: boolean | ChildCountOutputTypeCountWeightRecordsArgs
  }

  // Custom InputTypes
  /**
   * ChildCountOutputType without action
   */
  export type ChildCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChildCountOutputType
     */
    select?: ChildCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChildCountOutputType without action
   */
  export type ChildCountOutputTypeCountVaccinationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VaccinationRecordWhereInput
  }

  /**
   * ChildCountOutputType without action
   */
  export type ChildCountOutputTypeCountNotificationLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationLogWhereInput
  }

  /**
   * ChildCountOutputType without action
   */
  export type ChildCountOutputTypeCountWeightRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeightRecordWhereInput
  }


  /**
   * Count Type MotherCountOutputType
   */

  export type MotherCountOutputType = {
    tdDoses: number
  }

  export type MotherCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tdDoses?: boolean | MotherCountOutputTypeCountTdDosesArgs
  }

  // Custom InputTypes
  /**
   * MotherCountOutputType without action
   */
  export type MotherCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherCountOutputType
     */
    select?: MotherCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MotherCountOutputType without action
   */
  export type MotherCountOutputTypeCountTdDosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TDDoseWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    wardId: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    wardId: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    wardId: number | null
    status: $Enums.UserStatus | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    wardId: number | null
    status: $Enums.UserStatus | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    role: number
    wardId: number
    status: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    wardId?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    wardId?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    wardId?: true
    status?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    wardId?: true
    status?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    wardId?: true
    status?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId: number | null
    status: $Enums.UserStatus
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    wardId?: boolean
    status?: boolean
    Child?: boolean | User$ChildArgs<ExtArgs>
    Mother?: boolean | User$MotherArgs<ExtArgs>
    createdVaccinationRecords?: boolean | User$createdVaccinationRecordsArgs<ExtArgs>
    administeredVaccinations?: boolean | User$administeredVaccinationsArgs<ExtArgs>
    AuditLogs?: boolean | User$AuditLogsArgs<ExtArgs>
    createdWeightRecords?: boolean | User$createdWeightRecordsArgs<ExtArgs>
    administeredWeightRecords?: boolean | User$administeredWeightRecordsArgs<ExtArgs>
    verifiedChildren?: boolean | User$verifiedChildrenArgs<ExtArgs>
    createdTDDoses?: boolean | User$createdTDDosesArgs<ExtArgs>
    administeredTDDoses?: boolean | User$administeredTDDosesArgs<ExtArgs>
    RefreshTokens?: boolean | User$RefreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    wardId?: boolean
    status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    wardId?: boolean
    status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    wardId?: boolean
    status?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "role" | "wardId" | "status", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Child?: boolean | User$ChildArgs<ExtArgs>
    Mother?: boolean | User$MotherArgs<ExtArgs>
    createdVaccinationRecords?: boolean | User$createdVaccinationRecordsArgs<ExtArgs>
    administeredVaccinations?: boolean | User$administeredVaccinationsArgs<ExtArgs>
    AuditLogs?: boolean | User$AuditLogsArgs<ExtArgs>
    createdWeightRecords?: boolean | User$createdWeightRecordsArgs<ExtArgs>
    administeredWeightRecords?: boolean | User$administeredWeightRecordsArgs<ExtArgs>
    verifiedChildren?: boolean | User$verifiedChildrenArgs<ExtArgs>
    createdTDDoses?: boolean | User$createdTDDosesArgs<ExtArgs>
    administeredTDDoses?: boolean | User$administeredTDDosesArgs<ExtArgs>
    RefreshTokens?: boolean | User$RefreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      Child: Prisma.$ChildPayload<ExtArgs>[]
      Mother: Prisma.$MotherPayload<ExtArgs>[]
      createdVaccinationRecords: Prisma.$VaccinationRecordPayload<ExtArgs>[]
      administeredVaccinations: Prisma.$VaccinationRecordPayload<ExtArgs>[]
      AuditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
      createdWeightRecords: Prisma.$WeightRecordPayload<ExtArgs>[]
      administeredWeightRecords: Prisma.$WeightRecordPayload<ExtArgs>[]
      verifiedChildren: Prisma.$ChildPayload<ExtArgs>[]
      createdTDDoses: Prisma.$TDDosePayload<ExtArgs>[]
      administeredTDDoses: Prisma.$TDDosePayload<ExtArgs>[]
      RefreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      passwordHash: string
      role: $Enums.UserRole
      wardId: number | null
      status: $Enums.UserStatus
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Child<T extends User$ChildArgs<ExtArgs> = {}>(args?: Subset<T, User$ChildArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Mother<T extends User$MotherArgs<ExtArgs> = {}>(args?: Subset<T, User$MotherArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdVaccinationRecords<T extends User$createdVaccinationRecordsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdVaccinationRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    administeredVaccinations<T extends User$administeredVaccinationsArgs<ExtArgs> = {}>(args?: Subset<T, User$administeredVaccinationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    AuditLogs<T extends User$AuditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$AuditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdWeightRecords<T extends User$createdWeightRecordsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdWeightRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    administeredWeightRecords<T extends User$administeredWeightRecordsArgs<ExtArgs> = {}>(args?: Subset<T, User$administeredWeightRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    verifiedChildren<T extends User$verifiedChildrenArgs<ExtArgs> = {}>(args?: Subset<T, User$verifiedChildrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdTDDoses<T extends User$createdTDDosesArgs<ExtArgs> = {}>(args?: Subset<T, User$createdTDDosesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    administeredTDDoses<T extends User$administeredTDDosesArgs<ExtArgs> = {}>(args?: Subset<T, User$administeredTDDosesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    RefreshTokens<T extends User$RefreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$RefreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly wardId: FieldRef<"User", 'Int'>
    readonly status: FieldRef<"User", 'UserStatus'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.Child
   */
  export type User$ChildArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    where?: ChildWhereInput
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    cursor?: ChildWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * User.Mother
   */
  export type User$MotherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    where?: MotherWhereInput
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    cursor?: MotherWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MotherScalarFieldEnum | MotherScalarFieldEnum[]
  }

  /**
   * User.createdVaccinationRecords
   */
  export type User$createdVaccinationRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    where?: VaccinationRecordWhereInput
    orderBy?: VaccinationRecordOrderByWithRelationInput | VaccinationRecordOrderByWithRelationInput[]
    cursor?: VaccinationRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VaccinationRecordScalarFieldEnum | VaccinationRecordScalarFieldEnum[]
  }

  /**
   * User.administeredVaccinations
   */
  export type User$administeredVaccinationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    where?: VaccinationRecordWhereInput
    orderBy?: VaccinationRecordOrderByWithRelationInput | VaccinationRecordOrderByWithRelationInput[]
    cursor?: VaccinationRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VaccinationRecordScalarFieldEnum | VaccinationRecordScalarFieldEnum[]
  }

  /**
   * User.AuditLogs
   */
  export type User$AuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User.createdWeightRecords
   */
  export type User$createdWeightRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    where?: WeightRecordWhereInput
    orderBy?: WeightRecordOrderByWithRelationInput | WeightRecordOrderByWithRelationInput[]
    cursor?: WeightRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeightRecordScalarFieldEnum | WeightRecordScalarFieldEnum[]
  }

  /**
   * User.administeredWeightRecords
   */
  export type User$administeredWeightRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    where?: WeightRecordWhereInput
    orderBy?: WeightRecordOrderByWithRelationInput | WeightRecordOrderByWithRelationInput[]
    cursor?: WeightRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeightRecordScalarFieldEnum | WeightRecordScalarFieldEnum[]
  }

  /**
   * User.verifiedChildren
   */
  export type User$verifiedChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    where?: ChildWhereInput
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    cursor?: ChildWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * User.createdTDDoses
   */
  export type User$createdTDDosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    where?: TDDoseWhereInput
    orderBy?: TDDoseOrderByWithRelationInput | TDDoseOrderByWithRelationInput[]
    cursor?: TDDoseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TDDoseScalarFieldEnum | TDDoseScalarFieldEnum[]
  }

  /**
   * User.administeredTDDoses
   */
  export type User$administeredTDDosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    where?: TDDoseWhereInput
    orderBy?: TDDoseOrderByWithRelationInput | TDDoseOrderByWithRelationInput[]
    cursor?: TDDoseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TDDoseScalarFieldEnum | TDDoseScalarFieldEnum[]
  }

  /**
   * User.RefreshTokens
   */
  export type User$RefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    cursor?: RefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _avg: RefreshTokenAvgAggregateOutputType | null
    _sum: RefreshTokenSumAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenAvgAggregateOutputType = {
    userId: number | null
  }

  export type RefreshTokenSumAggregateOutputType = {
    userId: number | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: string | null
    token: string | null
    userId: number | null
    device: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    token: string | null
    userId: number | null
    device: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    token: number
    userId: number
    device: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type RefreshTokenAvgAggregateInputType = {
    userId?: true
  }

  export type RefreshTokenSumAggregateInputType = {
    userId?: true
  }

  export type RefreshTokenMinAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    device?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    device?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    device?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RefreshTokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RefreshTokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }




  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _avg?: RefreshTokenAvgAggregateInputType
    _sum?: RefreshTokenSumAggregateInputType
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: string
    token: string
    userId: number
    device: string | null
    expiresAt: Date
    createdAt: Date
    _count: RefreshTokenCountAggregateOutputType | null
    _avg: RefreshTokenAvgAggregateOutputType | null
    _sum: RefreshTokenSumAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    device?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    device?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    device?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    token?: boolean
    userId?: boolean
    device?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "userId" | "device" | "expiresAt" | "createdAt", ExtArgs["result"]["refreshToken"]>
  export type RefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      userId: number
      device: string | null
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["refreshToken"]>
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokenPayload, S>

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshTokenCountAggregateInputType | true
    }

  export interface RefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken'], meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokenFindManyArgs>(args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     * 
     */
    create<T extends RefreshTokenCreateArgs>(args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokenCreateManyArgs>(args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokenDeleteArgs>(args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokenUpdateArgs>(args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens and returns the data updated in the database.
     * @param {RefreshTokenUpdateManyAndReturnArgs} args - Arguments to update many RefreshTokens.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RefreshTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, RefreshTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RefreshTokenAggregateArgs>(args: Subset<T, RefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshToken model
   */
  readonly fields: RefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RefreshToken model
   */
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<"RefreshToken", 'String'>
    readonly token: FieldRef<"RefreshToken", 'String'>
    readonly userId: FieldRef<"RefreshToken", 'Int'>
    readonly device: FieldRef<"RefreshToken", 'String'>
    readonly expiresAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly createdAt: FieldRef<"RefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshToken updateManyAndReturn
   */
  export type RefreshTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model Child
   */

  export type AggregateChild = {
    _count: ChildCountAggregateOutputType | null
    _avg: ChildAvgAggregateOutputType | null
    _sum: ChildSumAggregateOutputType | null
    _min: ChildMinAggregateOutputType | null
    _max: ChildMaxAggregateOutputType | null
  }

  export type ChildAvgAggregateOutputType = {
    sewaDartaNumber: number | null
    wardNumber: number | null
    casteCode: number | null
    createdById: number | null
    verifiedById: number | null
  }

  export type ChildSumAggregateOutputType = {
    sewaDartaNumber: number | null
    wardNumber: number | null
    casteCode: number | null
    createdById: number | null
    verifiedById: number | null
  }

  export type ChildMinAggregateOutputType = {
    id: string | null
    sewaDartaNumber: number | null
    fullName: string | null
    wardNumber: number | null
    casteCode: number | null
    gender: string | null
    parentName: string | null
    tole: string | null
    phoneNumber: string | null
    birthDate: Date | null
    purnaKhop: boolean | null
    remarks: string | null
    createdById: number | null
    verifiedById: number | null
    createdAt: Date | null
    isFromOtherMunicipality: boolean | null
  }

  export type ChildMaxAggregateOutputType = {
    id: string | null
    sewaDartaNumber: number | null
    fullName: string | null
    wardNumber: number | null
    casteCode: number | null
    gender: string | null
    parentName: string | null
    tole: string | null
    phoneNumber: string | null
    birthDate: Date | null
    purnaKhop: boolean | null
    remarks: string | null
    createdById: number | null
    verifiedById: number | null
    createdAt: Date | null
    isFromOtherMunicipality: boolean | null
  }

  export type ChildCountAggregateOutputType = {
    id: number
    sewaDartaNumber: number
    fullName: number
    wardNumber: number
    casteCode: number
    gender: number
    parentName: number
    tole: number
    phoneNumber: number
    birthDate: number
    purnaKhop: number
    remarks: number
    createdById: number
    verifiedById: number
    createdAt: number
    isFromOtherMunicipality: number
    _all: number
  }


  export type ChildAvgAggregateInputType = {
    sewaDartaNumber?: true
    wardNumber?: true
    casteCode?: true
    createdById?: true
    verifiedById?: true
  }

  export type ChildSumAggregateInputType = {
    sewaDartaNumber?: true
    wardNumber?: true
    casteCode?: true
    createdById?: true
    verifiedById?: true
  }

  export type ChildMinAggregateInputType = {
    id?: true
    sewaDartaNumber?: true
    fullName?: true
    wardNumber?: true
    casteCode?: true
    gender?: true
    parentName?: true
    tole?: true
    phoneNumber?: true
    birthDate?: true
    purnaKhop?: true
    remarks?: true
    createdById?: true
    verifiedById?: true
    createdAt?: true
    isFromOtherMunicipality?: true
  }

  export type ChildMaxAggregateInputType = {
    id?: true
    sewaDartaNumber?: true
    fullName?: true
    wardNumber?: true
    casteCode?: true
    gender?: true
    parentName?: true
    tole?: true
    phoneNumber?: true
    birthDate?: true
    purnaKhop?: true
    remarks?: true
    createdById?: true
    verifiedById?: true
    createdAt?: true
    isFromOtherMunicipality?: true
  }

  export type ChildCountAggregateInputType = {
    id?: true
    sewaDartaNumber?: true
    fullName?: true
    wardNumber?: true
    casteCode?: true
    gender?: true
    parentName?: true
    tole?: true
    phoneNumber?: true
    birthDate?: true
    purnaKhop?: true
    remarks?: true
    createdById?: true
    verifiedById?: true
    createdAt?: true
    isFromOtherMunicipality?: true
    _all?: true
  }

  export type ChildAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Child to aggregate.
     */
    where?: ChildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Children to fetch.
     */
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Children from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Children.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Children
    **/
    _count?: true | ChildCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChildAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChildSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChildMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChildMaxAggregateInputType
  }

  export type GetChildAggregateType<T extends ChildAggregateArgs> = {
        [P in keyof T & keyof AggregateChild]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChild[P]>
      : GetScalarType<T[P], AggregateChild[P]>
  }




  export type ChildGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChildWhereInput
    orderBy?: ChildOrderByWithAggregationInput | ChildOrderByWithAggregationInput[]
    by: ChildScalarFieldEnum[] | ChildScalarFieldEnum
    having?: ChildScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChildCountAggregateInputType | true
    _avg?: ChildAvgAggregateInputType
    _sum?: ChildSumAggregateInputType
    _min?: ChildMinAggregateInputType
    _max?: ChildMaxAggregateInputType
  }

  export type ChildGroupByOutputType = {
    id: string
    sewaDartaNumber: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date
    purnaKhop: boolean
    remarks: string | null
    createdById: number
    verifiedById: number | null
    createdAt: Date
    isFromOtherMunicipality: boolean
    _count: ChildCountAggregateOutputType | null
    _avg: ChildAvgAggregateOutputType | null
    _sum: ChildSumAggregateOutputType | null
    _min: ChildMinAggregateOutputType | null
    _max: ChildMaxAggregateOutputType | null
  }

  type GetChildGroupByPayload<T extends ChildGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChildGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChildGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChildGroupByOutputType[P]>
            : GetScalarType<T[P], ChildGroupByOutputType[P]>
        }
      >
    >


  export type ChildSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sewaDartaNumber?: boolean
    fullName?: boolean
    wardNumber?: boolean
    casteCode?: boolean
    gender?: boolean
    parentName?: boolean
    tole?: boolean
    phoneNumber?: boolean
    birthDate?: boolean
    purnaKhop?: boolean
    remarks?: boolean
    createdById?: boolean
    verifiedById?: boolean
    createdAt?: boolean
    isFromOtherMunicipality?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    verifiedBy?: boolean | Child$verifiedByArgs<ExtArgs>
    vaccinations?: boolean | Child$vaccinationsArgs<ExtArgs>
    NotificationLog?: boolean | Child$NotificationLogArgs<ExtArgs>
    weightRecords?: boolean | Child$weightRecordsArgs<ExtArgs>
    _count?: boolean | ChildCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["child"]>

  export type ChildSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sewaDartaNumber?: boolean
    fullName?: boolean
    wardNumber?: boolean
    casteCode?: boolean
    gender?: boolean
    parentName?: boolean
    tole?: boolean
    phoneNumber?: boolean
    birthDate?: boolean
    purnaKhop?: boolean
    remarks?: boolean
    createdById?: boolean
    verifiedById?: boolean
    createdAt?: boolean
    isFromOtherMunicipality?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    verifiedBy?: boolean | Child$verifiedByArgs<ExtArgs>
  }, ExtArgs["result"]["child"]>

  export type ChildSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sewaDartaNumber?: boolean
    fullName?: boolean
    wardNumber?: boolean
    casteCode?: boolean
    gender?: boolean
    parentName?: boolean
    tole?: boolean
    phoneNumber?: boolean
    birthDate?: boolean
    purnaKhop?: boolean
    remarks?: boolean
    createdById?: boolean
    verifiedById?: boolean
    createdAt?: boolean
    isFromOtherMunicipality?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    verifiedBy?: boolean | Child$verifiedByArgs<ExtArgs>
  }, ExtArgs["result"]["child"]>

  export type ChildSelectScalar = {
    id?: boolean
    sewaDartaNumber?: boolean
    fullName?: boolean
    wardNumber?: boolean
    casteCode?: boolean
    gender?: boolean
    parentName?: boolean
    tole?: boolean
    phoneNumber?: boolean
    birthDate?: boolean
    purnaKhop?: boolean
    remarks?: boolean
    createdById?: boolean
    verifiedById?: boolean
    createdAt?: boolean
    isFromOtherMunicipality?: boolean
  }

  export type ChildOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sewaDartaNumber" | "fullName" | "wardNumber" | "casteCode" | "gender" | "parentName" | "tole" | "phoneNumber" | "birthDate" | "purnaKhop" | "remarks" | "createdById" | "verifiedById" | "createdAt" | "isFromOtherMunicipality", ExtArgs["result"]["child"]>
  export type ChildInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    verifiedBy?: boolean | Child$verifiedByArgs<ExtArgs>
    vaccinations?: boolean | Child$vaccinationsArgs<ExtArgs>
    NotificationLog?: boolean | Child$NotificationLogArgs<ExtArgs>
    weightRecords?: boolean | Child$weightRecordsArgs<ExtArgs>
    _count?: boolean | ChildCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChildIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    verifiedBy?: boolean | Child$verifiedByArgs<ExtArgs>
  }
  export type ChildIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    verifiedBy?: boolean | Child$verifiedByArgs<ExtArgs>
  }

  export type $ChildPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Child"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
      verifiedBy: Prisma.$UserPayload<ExtArgs> | null
      vaccinations: Prisma.$VaccinationRecordPayload<ExtArgs>[]
      NotificationLog: Prisma.$NotificationLogPayload<ExtArgs>[]
      weightRecords: Prisma.$WeightRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sewaDartaNumber: number
      fullName: string
      wardNumber: number
      casteCode: number
      gender: string
      parentName: string
      tole: string
      phoneNumber: string
      birthDate: Date
      purnaKhop: boolean
      remarks: string | null
      createdById: number
      verifiedById: number | null
      createdAt: Date
      isFromOtherMunicipality: boolean
    }, ExtArgs["result"]["child"]>
    composites: {}
  }

  type ChildGetPayload<S extends boolean | null | undefined | ChildDefaultArgs> = $Result.GetResult<Prisma.$ChildPayload, S>

  type ChildCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChildFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChildCountAggregateInputType | true
    }

  export interface ChildDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Child'], meta: { name: 'Child' } }
    /**
     * Find zero or one Child that matches the filter.
     * @param {ChildFindUniqueArgs} args - Arguments to find a Child
     * @example
     * // Get one Child
     * const child = await prisma.child.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChildFindUniqueArgs>(args: SelectSubset<T, ChildFindUniqueArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Child that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChildFindUniqueOrThrowArgs} args - Arguments to find a Child
     * @example
     * // Get one Child
     * const child = await prisma.child.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChildFindUniqueOrThrowArgs>(args: SelectSubset<T, ChildFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Child that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildFindFirstArgs} args - Arguments to find a Child
     * @example
     * // Get one Child
     * const child = await prisma.child.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChildFindFirstArgs>(args?: SelectSubset<T, ChildFindFirstArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Child that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildFindFirstOrThrowArgs} args - Arguments to find a Child
     * @example
     * // Get one Child
     * const child = await prisma.child.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChildFindFirstOrThrowArgs>(args?: SelectSubset<T, ChildFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Children that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Children
     * const children = await prisma.child.findMany()
     * 
     * // Get first 10 Children
     * const children = await prisma.child.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const childWithIdOnly = await prisma.child.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChildFindManyArgs>(args?: SelectSubset<T, ChildFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Child.
     * @param {ChildCreateArgs} args - Arguments to create a Child.
     * @example
     * // Create one Child
     * const Child = await prisma.child.create({
     *   data: {
     *     // ... data to create a Child
     *   }
     * })
     * 
     */
    create<T extends ChildCreateArgs>(args: SelectSubset<T, ChildCreateArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Children.
     * @param {ChildCreateManyArgs} args - Arguments to create many Children.
     * @example
     * // Create many Children
     * const child = await prisma.child.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChildCreateManyArgs>(args?: SelectSubset<T, ChildCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Children and returns the data saved in the database.
     * @param {ChildCreateManyAndReturnArgs} args - Arguments to create many Children.
     * @example
     * // Create many Children
     * const child = await prisma.child.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Children and only return the `id`
     * const childWithIdOnly = await prisma.child.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChildCreateManyAndReturnArgs>(args?: SelectSubset<T, ChildCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Child.
     * @param {ChildDeleteArgs} args - Arguments to delete one Child.
     * @example
     * // Delete one Child
     * const Child = await prisma.child.delete({
     *   where: {
     *     // ... filter to delete one Child
     *   }
     * })
     * 
     */
    delete<T extends ChildDeleteArgs>(args: SelectSubset<T, ChildDeleteArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Child.
     * @param {ChildUpdateArgs} args - Arguments to update one Child.
     * @example
     * // Update one Child
     * const child = await prisma.child.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChildUpdateArgs>(args: SelectSubset<T, ChildUpdateArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Children.
     * @param {ChildDeleteManyArgs} args - Arguments to filter Children to delete.
     * @example
     * // Delete a few Children
     * const { count } = await prisma.child.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChildDeleteManyArgs>(args?: SelectSubset<T, ChildDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Children.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Children
     * const child = await prisma.child.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChildUpdateManyArgs>(args: SelectSubset<T, ChildUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Children and returns the data updated in the database.
     * @param {ChildUpdateManyAndReturnArgs} args - Arguments to update many Children.
     * @example
     * // Update many Children
     * const child = await prisma.child.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Children and only return the `id`
     * const childWithIdOnly = await prisma.child.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChildUpdateManyAndReturnArgs>(args: SelectSubset<T, ChildUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Child.
     * @param {ChildUpsertArgs} args - Arguments to update or create a Child.
     * @example
     * // Update or create a Child
     * const child = await prisma.child.upsert({
     *   create: {
     *     // ... data to create a Child
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Child we want to update
     *   }
     * })
     */
    upsert<T extends ChildUpsertArgs>(args: SelectSubset<T, ChildUpsertArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Children.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildCountArgs} args - Arguments to filter Children to count.
     * @example
     * // Count the number of Children
     * const count = await prisma.child.count({
     *   where: {
     *     // ... the filter for the Children we want to count
     *   }
     * })
    **/
    count<T extends ChildCountArgs>(
      args?: Subset<T, ChildCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChildCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Child.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChildAggregateArgs>(args: Subset<T, ChildAggregateArgs>): Prisma.PrismaPromise<GetChildAggregateType<T>>

    /**
     * Group by Child.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChildGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChildGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChildGroupByArgs['orderBy'] }
        : { orderBy?: ChildGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChildGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChildGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Child model
   */
  readonly fields: ChildFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Child.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChildClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    verifiedBy<T extends Child$verifiedByArgs<ExtArgs> = {}>(args?: Subset<T, Child$verifiedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    vaccinations<T extends Child$vaccinationsArgs<ExtArgs> = {}>(args?: Subset<T, Child$vaccinationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    NotificationLog<T extends Child$NotificationLogArgs<ExtArgs> = {}>(args?: Subset<T, Child$NotificationLogArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    weightRecords<T extends Child$weightRecordsArgs<ExtArgs> = {}>(args?: Subset<T, Child$weightRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Child model
   */
  interface ChildFieldRefs {
    readonly id: FieldRef<"Child", 'String'>
    readonly sewaDartaNumber: FieldRef<"Child", 'Int'>
    readonly fullName: FieldRef<"Child", 'String'>
    readonly wardNumber: FieldRef<"Child", 'Int'>
    readonly casteCode: FieldRef<"Child", 'Int'>
    readonly gender: FieldRef<"Child", 'String'>
    readonly parentName: FieldRef<"Child", 'String'>
    readonly tole: FieldRef<"Child", 'String'>
    readonly phoneNumber: FieldRef<"Child", 'String'>
    readonly birthDate: FieldRef<"Child", 'DateTime'>
    readonly purnaKhop: FieldRef<"Child", 'Boolean'>
    readonly remarks: FieldRef<"Child", 'String'>
    readonly createdById: FieldRef<"Child", 'Int'>
    readonly verifiedById: FieldRef<"Child", 'Int'>
    readonly createdAt: FieldRef<"Child", 'DateTime'>
    readonly isFromOtherMunicipality: FieldRef<"Child", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Child findUnique
   */
  export type ChildFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Child to fetch.
     */
    where: ChildWhereUniqueInput
  }

  /**
   * Child findUniqueOrThrow
   */
  export type ChildFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Child to fetch.
     */
    where: ChildWhereUniqueInput
  }

  /**
   * Child findFirst
   */
  export type ChildFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Child to fetch.
     */
    where?: ChildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Children to fetch.
     */
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Children.
     */
    cursor?: ChildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Children from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Children.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Children.
     */
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * Child findFirstOrThrow
   */
  export type ChildFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Child to fetch.
     */
    where?: ChildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Children to fetch.
     */
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Children.
     */
    cursor?: ChildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Children from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Children.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Children.
     */
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * Child findMany
   */
  export type ChildFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter, which Children to fetch.
     */
    where?: ChildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Children to fetch.
     */
    orderBy?: ChildOrderByWithRelationInput | ChildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Children.
     */
    cursor?: ChildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Children from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Children.
     */
    skip?: number
    distinct?: ChildScalarFieldEnum | ChildScalarFieldEnum[]
  }

  /**
   * Child create
   */
  export type ChildCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * The data needed to create a Child.
     */
    data: XOR<ChildCreateInput, ChildUncheckedCreateInput>
  }

  /**
   * Child createMany
   */
  export type ChildCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Children.
     */
    data: ChildCreateManyInput | ChildCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Child createManyAndReturn
   */
  export type ChildCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * The data used to create many Children.
     */
    data: ChildCreateManyInput | ChildCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Child update
   */
  export type ChildUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * The data needed to update a Child.
     */
    data: XOR<ChildUpdateInput, ChildUncheckedUpdateInput>
    /**
     * Choose, which Child to update.
     */
    where: ChildWhereUniqueInput
  }

  /**
   * Child updateMany
   */
  export type ChildUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Children.
     */
    data: XOR<ChildUpdateManyMutationInput, ChildUncheckedUpdateManyInput>
    /**
     * Filter which Children to update
     */
    where?: ChildWhereInput
    /**
     * Limit how many Children to update.
     */
    limit?: number
  }

  /**
   * Child updateManyAndReturn
   */
  export type ChildUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * The data used to update Children.
     */
    data: XOR<ChildUpdateManyMutationInput, ChildUncheckedUpdateManyInput>
    /**
     * Filter which Children to update
     */
    where?: ChildWhereInput
    /**
     * Limit how many Children to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Child upsert
   */
  export type ChildUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * The filter to search for the Child to update in case it exists.
     */
    where: ChildWhereUniqueInput
    /**
     * In case the Child found by the `where` argument doesn't exist, create a new Child with this data.
     */
    create: XOR<ChildCreateInput, ChildUncheckedCreateInput>
    /**
     * In case the Child was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChildUpdateInput, ChildUncheckedUpdateInput>
  }

  /**
   * Child delete
   */
  export type ChildDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
    /**
     * Filter which Child to delete.
     */
    where: ChildWhereUniqueInput
  }

  /**
   * Child deleteMany
   */
  export type ChildDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Children to delete
     */
    where?: ChildWhereInput
    /**
     * Limit how many Children to delete.
     */
    limit?: number
  }

  /**
   * Child.verifiedBy
   */
  export type Child$verifiedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Child.vaccinations
   */
  export type Child$vaccinationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    where?: VaccinationRecordWhereInput
    orderBy?: VaccinationRecordOrderByWithRelationInput | VaccinationRecordOrderByWithRelationInput[]
    cursor?: VaccinationRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VaccinationRecordScalarFieldEnum | VaccinationRecordScalarFieldEnum[]
  }

  /**
   * Child.NotificationLog
   */
  export type Child$NotificationLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    where?: NotificationLogWhereInput
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    cursor?: NotificationLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationLogScalarFieldEnum | NotificationLogScalarFieldEnum[]
  }

  /**
   * Child.weightRecords
   */
  export type Child$weightRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    where?: WeightRecordWhereInput
    orderBy?: WeightRecordOrderByWithRelationInput | WeightRecordOrderByWithRelationInput[]
    cursor?: WeightRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WeightRecordScalarFieldEnum | WeightRecordScalarFieldEnum[]
  }

  /**
   * Child without action
   */
  export type ChildDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Child
     */
    select?: ChildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Child
     */
    omit?: ChildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChildInclude<ExtArgs> | null
  }


  /**
   * Model Mother
   */

  export type AggregateMother = {
    _count: MotherCountAggregateOutputType | null
    _avg: MotherAvgAggregateOutputType | null
    _sum: MotherSumAggregateOutputType | null
    _min: MotherMinAggregateOutputType | null
    _max: MotherMaxAggregateOutputType | null
  }

  export type MotherAvgAggregateOutputType = {
    sewaDartaNumber: number | null
    casteCode: number | null
    age: number | null
    wardNumber: number | null
    pregnancyCount: number | null
    previousTDTakenCount: number | null
    createdById: number | null
  }

  export type MotherSumAggregateOutputType = {
    sewaDartaNumber: number | null
    casteCode: number | null
    age: number | null
    wardNumber: number | null
    pregnancyCount: number | null
    previousTDTakenCount: number | null
    createdById: number | null
  }

  export type MotherMinAggregateOutputType = {
    id: string | null
    sewaDartaNumber: number | null
    name: string | null
    casteCode: number | null
    age: number | null
    phoneNumber: string | null
    tole: string | null
    wardNumber: number | null
    pregnancyCount: number | null
    previousTDTakenCount: number | null
    remarks: string | null
    createdAt: Date | null
    createdById: number | null
    isFromOtherMunicipality: boolean | null
  }

  export type MotherMaxAggregateOutputType = {
    id: string | null
    sewaDartaNumber: number | null
    name: string | null
    casteCode: number | null
    age: number | null
    phoneNumber: string | null
    tole: string | null
    wardNumber: number | null
    pregnancyCount: number | null
    previousTDTakenCount: number | null
    remarks: string | null
    createdAt: Date | null
    createdById: number | null
    isFromOtherMunicipality: boolean | null
  }

  export type MotherCountAggregateOutputType = {
    id: number
    sewaDartaNumber: number
    name: number
    casteCode: number
    age: number
    phoneNumber: number
    tole: number
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks: number
    createdAt: number
    createdById: number
    isFromOtherMunicipality: number
    _all: number
  }


  export type MotherAvgAggregateInputType = {
    sewaDartaNumber?: true
    casteCode?: true
    age?: true
    wardNumber?: true
    pregnancyCount?: true
    previousTDTakenCount?: true
    createdById?: true
  }

  export type MotherSumAggregateInputType = {
    sewaDartaNumber?: true
    casteCode?: true
    age?: true
    wardNumber?: true
    pregnancyCount?: true
    previousTDTakenCount?: true
    createdById?: true
  }

  export type MotherMinAggregateInputType = {
    id?: true
    sewaDartaNumber?: true
    name?: true
    casteCode?: true
    age?: true
    phoneNumber?: true
    tole?: true
    wardNumber?: true
    pregnancyCount?: true
    previousTDTakenCount?: true
    remarks?: true
    createdAt?: true
    createdById?: true
    isFromOtherMunicipality?: true
  }

  export type MotherMaxAggregateInputType = {
    id?: true
    sewaDartaNumber?: true
    name?: true
    casteCode?: true
    age?: true
    phoneNumber?: true
    tole?: true
    wardNumber?: true
    pregnancyCount?: true
    previousTDTakenCount?: true
    remarks?: true
    createdAt?: true
    createdById?: true
    isFromOtherMunicipality?: true
  }

  export type MotherCountAggregateInputType = {
    id?: true
    sewaDartaNumber?: true
    name?: true
    casteCode?: true
    age?: true
    phoneNumber?: true
    tole?: true
    wardNumber?: true
    pregnancyCount?: true
    previousTDTakenCount?: true
    remarks?: true
    createdAt?: true
    createdById?: true
    isFromOtherMunicipality?: true
    _all?: true
  }

  export type MotherAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mother to aggregate.
     */
    where?: MotherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mothers to fetch.
     */
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MotherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mothers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mothers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Mothers
    **/
    _count?: true | MotherCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MotherAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MotherSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MotherMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MotherMaxAggregateInputType
  }

  export type GetMotherAggregateType<T extends MotherAggregateArgs> = {
        [P in keyof T & keyof AggregateMother]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMother[P]>
      : GetScalarType<T[P], AggregateMother[P]>
  }




  export type MotherGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MotherWhereInput
    orderBy?: MotherOrderByWithAggregationInput | MotherOrderByWithAggregationInput[]
    by: MotherScalarFieldEnum[] | MotherScalarFieldEnum
    having?: MotherScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MotherCountAggregateInputType | true
    _avg?: MotherAvgAggregateInputType
    _sum?: MotherSumAggregateInputType
    _min?: MotherMinAggregateInputType
    _max?: MotherMaxAggregateInputType
  }

  export type MotherGroupByOutputType = {
    id: string
    sewaDartaNumber: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks: string | null
    createdAt: Date
    createdById: number
    isFromOtherMunicipality: boolean
    _count: MotherCountAggregateOutputType | null
    _avg: MotherAvgAggregateOutputType | null
    _sum: MotherSumAggregateOutputType | null
    _min: MotherMinAggregateOutputType | null
    _max: MotherMaxAggregateOutputType | null
  }

  type GetMotherGroupByPayload<T extends MotherGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MotherGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MotherGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MotherGroupByOutputType[P]>
            : GetScalarType<T[P], MotherGroupByOutputType[P]>
        }
      >
    >


  export type MotherSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sewaDartaNumber?: boolean
    name?: boolean
    casteCode?: boolean
    age?: boolean
    phoneNumber?: boolean
    tole?: boolean
    wardNumber?: boolean
    pregnancyCount?: boolean
    previousTDTakenCount?: boolean
    remarks?: boolean
    createdAt?: boolean
    createdById?: boolean
    isFromOtherMunicipality?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    tdDoses?: boolean | Mother$tdDosesArgs<ExtArgs>
    _count?: boolean | MotherCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mother"]>

  export type MotherSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sewaDartaNumber?: boolean
    name?: boolean
    casteCode?: boolean
    age?: boolean
    phoneNumber?: boolean
    tole?: boolean
    wardNumber?: boolean
    pregnancyCount?: boolean
    previousTDTakenCount?: boolean
    remarks?: boolean
    createdAt?: boolean
    createdById?: boolean
    isFromOtherMunicipality?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mother"]>

  export type MotherSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sewaDartaNumber?: boolean
    name?: boolean
    casteCode?: boolean
    age?: boolean
    phoneNumber?: boolean
    tole?: boolean
    wardNumber?: boolean
    pregnancyCount?: boolean
    previousTDTakenCount?: boolean
    remarks?: boolean
    createdAt?: boolean
    createdById?: boolean
    isFromOtherMunicipality?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mother"]>

  export type MotherSelectScalar = {
    id?: boolean
    sewaDartaNumber?: boolean
    name?: boolean
    casteCode?: boolean
    age?: boolean
    phoneNumber?: boolean
    tole?: boolean
    wardNumber?: boolean
    pregnancyCount?: boolean
    previousTDTakenCount?: boolean
    remarks?: boolean
    createdAt?: boolean
    createdById?: boolean
    isFromOtherMunicipality?: boolean
  }

  export type MotherOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sewaDartaNumber" | "name" | "casteCode" | "age" | "phoneNumber" | "tole" | "wardNumber" | "pregnancyCount" | "previousTDTakenCount" | "remarks" | "createdAt" | "createdById" | "isFromOtherMunicipality", ExtArgs["result"]["mother"]>
  export type MotherInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    tdDoses?: boolean | Mother$tdDosesArgs<ExtArgs>
    _count?: boolean | MotherCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MotherIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MotherIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MotherPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Mother"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
      tdDoses: Prisma.$TDDosePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sewaDartaNumber: number
      name: string
      casteCode: number
      age: number
      phoneNumber: string
      tole: string
      wardNumber: number
      pregnancyCount: number
      previousTDTakenCount: number
      remarks: string | null
      createdAt: Date
      createdById: number
      isFromOtherMunicipality: boolean
    }, ExtArgs["result"]["mother"]>
    composites: {}
  }

  type MotherGetPayload<S extends boolean | null | undefined | MotherDefaultArgs> = $Result.GetResult<Prisma.$MotherPayload, S>

  type MotherCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MotherFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MotherCountAggregateInputType | true
    }

  export interface MotherDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Mother'], meta: { name: 'Mother' } }
    /**
     * Find zero or one Mother that matches the filter.
     * @param {MotherFindUniqueArgs} args - Arguments to find a Mother
     * @example
     * // Get one Mother
     * const mother = await prisma.mother.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MotherFindUniqueArgs>(args: SelectSubset<T, MotherFindUniqueArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mother that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MotherFindUniqueOrThrowArgs} args - Arguments to find a Mother
     * @example
     * // Get one Mother
     * const mother = await prisma.mother.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MotherFindUniqueOrThrowArgs>(args: SelectSubset<T, MotherFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mother that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherFindFirstArgs} args - Arguments to find a Mother
     * @example
     * // Get one Mother
     * const mother = await prisma.mother.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MotherFindFirstArgs>(args?: SelectSubset<T, MotherFindFirstArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mother that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherFindFirstOrThrowArgs} args - Arguments to find a Mother
     * @example
     * // Get one Mother
     * const mother = await prisma.mother.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MotherFindFirstOrThrowArgs>(args?: SelectSubset<T, MotherFindFirstOrThrowArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Mothers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Mothers
     * const mothers = await prisma.mother.findMany()
     * 
     * // Get first 10 Mothers
     * const mothers = await prisma.mother.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const motherWithIdOnly = await prisma.mother.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MotherFindManyArgs>(args?: SelectSubset<T, MotherFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mother.
     * @param {MotherCreateArgs} args - Arguments to create a Mother.
     * @example
     * // Create one Mother
     * const Mother = await prisma.mother.create({
     *   data: {
     *     // ... data to create a Mother
     *   }
     * })
     * 
     */
    create<T extends MotherCreateArgs>(args: SelectSubset<T, MotherCreateArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Mothers.
     * @param {MotherCreateManyArgs} args - Arguments to create many Mothers.
     * @example
     * // Create many Mothers
     * const mother = await prisma.mother.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MotherCreateManyArgs>(args?: SelectSubset<T, MotherCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Mothers and returns the data saved in the database.
     * @param {MotherCreateManyAndReturnArgs} args - Arguments to create many Mothers.
     * @example
     * // Create many Mothers
     * const mother = await prisma.mother.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Mothers and only return the `id`
     * const motherWithIdOnly = await prisma.mother.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MotherCreateManyAndReturnArgs>(args?: SelectSubset<T, MotherCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Mother.
     * @param {MotherDeleteArgs} args - Arguments to delete one Mother.
     * @example
     * // Delete one Mother
     * const Mother = await prisma.mother.delete({
     *   where: {
     *     // ... filter to delete one Mother
     *   }
     * })
     * 
     */
    delete<T extends MotherDeleteArgs>(args: SelectSubset<T, MotherDeleteArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mother.
     * @param {MotherUpdateArgs} args - Arguments to update one Mother.
     * @example
     * // Update one Mother
     * const mother = await prisma.mother.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MotherUpdateArgs>(args: SelectSubset<T, MotherUpdateArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Mothers.
     * @param {MotherDeleteManyArgs} args - Arguments to filter Mothers to delete.
     * @example
     * // Delete a few Mothers
     * const { count } = await prisma.mother.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MotherDeleteManyArgs>(args?: SelectSubset<T, MotherDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mothers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Mothers
     * const mother = await prisma.mother.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MotherUpdateManyArgs>(args: SelectSubset<T, MotherUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mothers and returns the data updated in the database.
     * @param {MotherUpdateManyAndReturnArgs} args - Arguments to update many Mothers.
     * @example
     * // Update many Mothers
     * const mother = await prisma.mother.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Mothers and only return the `id`
     * const motherWithIdOnly = await prisma.mother.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MotherUpdateManyAndReturnArgs>(args: SelectSubset<T, MotherUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Mother.
     * @param {MotherUpsertArgs} args - Arguments to update or create a Mother.
     * @example
     * // Update or create a Mother
     * const mother = await prisma.mother.upsert({
     *   create: {
     *     // ... data to create a Mother
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mother we want to update
     *   }
     * })
     */
    upsert<T extends MotherUpsertArgs>(args: SelectSubset<T, MotherUpsertArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Mothers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherCountArgs} args - Arguments to filter Mothers to count.
     * @example
     * // Count the number of Mothers
     * const count = await prisma.mother.count({
     *   where: {
     *     // ... the filter for the Mothers we want to count
     *   }
     * })
    **/
    count<T extends MotherCountArgs>(
      args?: Subset<T, MotherCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MotherCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mother.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MotherAggregateArgs>(args: Subset<T, MotherAggregateArgs>): Prisma.PrismaPromise<GetMotherAggregateType<T>>

    /**
     * Group by Mother.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MotherGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MotherGroupByArgs['orderBy'] }
        : { orderBy?: MotherGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MotherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMotherGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Mother model
   */
  readonly fields: MotherFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Mother.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MotherClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tdDoses<T extends Mother$tdDosesArgs<ExtArgs> = {}>(args?: Subset<T, Mother$tdDosesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Mother model
   */
  interface MotherFieldRefs {
    readonly id: FieldRef<"Mother", 'String'>
    readonly sewaDartaNumber: FieldRef<"Mother", 'Int'>
    readonly name: FieldRef<"Mother", 'String'>
    readonly casteCode: FieldRef<"Mother", 'Int'>
    readonly age: FieldRef<"Mother", 'Int'>
    readonly phoneNumber: FieldRef<"Mother", 'String'>
    readonly tole: FieldRef<"Mother", 'String'>
    readonly wardNumber: FieldRef<"Mother", 'Int'>
    readonly pregnancyCount: FieldRef<"Mother", 'Int'>
    readonly previousTDTakenCount: FieldRef<"Mother", 'Int'>
    readonly remarks: FieldRef<"Mother", 'String'>
    readonly createdAt: FieldRef<"Mother", 'DateTime'>
    readonly createdById: FieldRef<"Mother", 'Int'>
    readonly isFromOtherMunicipality: FieldRef<"Mother", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Mother findUnique
   */
  export type MotherFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mother to fetch.
     */
    where: MotherWhereUniqueInput
  }

  /**
   * Mother findUniqueOrThrow
   */
  export type MotherFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mother to fetch.
     */
    where: MotherWhereUniqueInput
  }

  /**
   * Mother findFirst
   */
  export type MotherFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mother to fetch.
     */
    where?: MotherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mothers to fetch.
     */
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Mothers.
     */
    cursor?: MotherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mothers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mothers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Mothers.
     */
    distinct?: MotherScalarFieldEnum | MotherScalarFieldEnum[]
  }

  /**
   * Mother findFirstOrThrow
   */
  export type MotherFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mother to fetch.
     */
    where?: MotherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mothers to fetch.
     */
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Mothers.
     */
    cursor?: MotherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mothers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mothers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Mothers.
     */
    distinct?: MotherScalarFieldEnum | MotherScalarFieldEnum[]
  }

  /**
   * Mother findMany
   */
  export type MotherFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mothers to fetch.
     */
    where?: MotherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mothers to fetch.
     */
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Mothers.
     */
    cursor?: MotherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mothers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mothers.
     */
    skip?: number
    distinct?: MotherScalarFieldEnum | MotherScalarFieldEnum[]
  }

  /**
   * Mother create
   */
  export type MotherCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * The data needed to create a Mother.
     */
    data: XOR<MotherCreateInput, MotherUncheckedCreateInput>
  }

  /**
   * Mother createMany
   */
  export type MotherCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Mothers.
     */
    data: MotherCreateManyInput | MotherCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Mother createManyAndReturn
   */
  export type MotherCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * The data used to create many Mothers.
     */
    data: MotherCreateManyInput | MotherCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Mother update
   */
  export type MotherUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * The data needed to update a Mother.
     */
    data: XOR<MotherUpdateInput, MotherUncheckedUpdateInput>
    /**
     * Choose, which Mother to update.
     */
    where: MotherWhereUniqueInput
  }

  /**
   * Mother updateMany
   */
  export type MotherUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Mothers.
     */
    data: XOR<MotherUpdateManyMutationInput, MotherUncheckedUpdateManyInput>
    /**
     * Filter which Mothers to update
     */
    where?: MotherWhereInput
    /**
     * Limit how many Mothers to update.
     */
    limit?: number
  }

  /**
   * Mother updateManyAndReturn
   */
  export type MotherUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * The data used to update Mothers.
     */
    data: XOR<MotherUpdateManyMutationInput, MotherUncheckedUpdateManyInput>
    /**
     * Filter which Mothers to update
     */
    where?: MotherWhereInput
    /**
     * Limit how many Mothers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Mother upsert
   */
  export type MotherUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * The filter to search for the Mother to update in case it exists.
     */
    where: MotherWhereUniqueInput
    /**
     * In case the Mother found by the `where` argument doesn't exist, create a new Mother with this data.
     */
    create: XOR<MotherCreateInput, MotherUncheckedCreateInput>
    /**
     * In case the Mother was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MotherUpdateInput, MotherUncheckedUpdateInput>
  }

  /**
   * Mother delete
   */
  export type MotherDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter which Mother to delete.
     */
    where: MotherWhereUniqueInput
  }

  /**
   * Mother deleteMany
   */
  export type MotherDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mothers to delete
     */
    where?: MotherWhereInput
    /**
     * Limit how many Mothers to delete.
     */
    limit?: number
  }

  /**
   * Mother.tdDoses
   */
  export type Mother$tdDosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    where?: TDDoseWhereInput
    orderBy?: TDDoseOrderByWithRelationInput | TDDoseOrderByWithRelationInput[]
    cursor?: TDDoseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TDDoseScalarFieldEnum | TDDoseScalarFieldEnum[]
  }

  /**
   * Mother without action
   */
  export type MotherDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
  }


  /**
   * Model TDDose
   */

  export type AggregateTDDose = {
    _count: TDDoseCountAggregateOutputType | null
    _avg: TDDoseAvgAggregateOutputType | null
    _sum: TDDoseSumAggregateOutputType | null
    _min: TDDoseMinAggregateOutputType | null
    _max: TDDoseMaxAggregateOutputType | null
  }

  export type TDDoseAvgAggregateOutputType = {
    doseNumber: number | null
    createdById: number | null
    administeredById: number | null
  }

  export type TDDoseSumAggregateOutputType = {
    doseNumber: number | null
    createdById: number | null
    administeredById: number | null
  }

  export type TDDoseMinAggregateOutputType = {
    id: string | null
    doseNumber: number | null
    dateGiven: Date | null
    remarks: string | null
    motherId: string | null
    createdAt: Date | null
    createdById: number | null
    administeredById: number | null
  }

  export type TDDoseMaxAggregateOutputType = {
    id: string | null
    doseNumber: number | null
    dateGiven: Date | null
    remarks: string | null
    motherId: string | null
    createdAt: Date | null
    createdById: number | null
    administeredById: number | null
  }

  export type TDDoseCountAggregateOutputType = {
    id: number
    doseNumber: number
    dateGiven: number
    remarks: number
    motherId: number
    createdAt: number
    createdById: number
    administeredById: number
    _all: number
  }


  export type TDDoseAvgAggregateInputType = {
    doseNumber?: true
    createdById?: true
    administeredById?: true
  }

  export type TDDoseSumAggregateInputType = {
    doseNumber?: true
    createdById?: true
    administeredById?: true
  }

  export type TDDoseMinAggregateInputType = {
    id?: true
    doseNumber?: true
    dateGiven?: true
    remarks?: true
    motherId?: true
    createdAt?: true
    createdById?: true
    administeredById?: true
  }

  export type TDDoseMaxAggregateInputType = {
    id?: true
    doseNumber?: true
    dateGiven?: true
    remarks?: true
    motherId?: true
    createdAt?: true
    createdById?: true
    administeredById?: true
  }

  export type TDDoseCountAggregateInputType = {
    id?: true
    doseNumber?: true
    dateGiven?: true
    remarks?: true
    motherId?: true
    createdAt?: true
    createdById?: true
    administeredById?: true
    _all?: true
  }

  export type TDDoseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TDDose to aggregate.
     */
    where?: TDDoseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TDDoses to fetch.
     */
    orderBy?: TDDoseOrderByWithRelationInput | TDDoseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TDDoseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TDDoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TDDoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TDDoses
    **/
    _count?: true | TDDoseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TDDoseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TDDoseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TDDoseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TDDoseMaxAggregateInputType
  }

  export type GetTDDoseAggregateType<T extends TDDoseAggregateArgs> = {
        [P in keyof T & keyof AggregateTDDose]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTDDose[P]>
      : GetScalarType<T[P], AggregateTDDose[P]>
  }




  export type TDDoseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TDDoseWhereInput
    orderBy?: TDDoseOrderByWithAggregationInput | TDDoseOrderByWithAggregationInput[]
    by: TDDoseScalarFieldEnum[] | TDDoseScalarFieldEnum
    having?: TDDoseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TDDoseCountAggregateInputType | true
    _avg?: TDDoseAvgAggregateInputType
    _sum?: TDDoseSumAggregateInputType
    _min?: TDDoseMinAggregateInputType
    _max?: TDDoseMaxAggregateInputType
  }

  export type TDDoseGroupByOutputType = {
    id: string
    doseNumber: number
    dateGiven: Date
    remarks: string | null
    motherId: string
    createdAt: Date
    createdById: number
    administeredById: number
    _count: TDDoseCountAggregateOutputType | null
    _avg: TDDoseAvgAggregateOutputType | null
    _sum: TDDoseSumAggregateOutputType | null
    _min: TDDoseMinAggregateOutputType | null
    _max: TDDoseMaxAggregateOutputType | null
  }

  type GetTDDoseGroupByPayload<T extends TDDoseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TDDoseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TDDoseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TDDoseGroupByOutputType[P]>
            : GetScalarType<T[P], TDDoseGroupByOutputType[P]>
        }
      >
    >


  export type TDDoseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    doseNumber?: boolean
    dateGiven?: boolean
    remarks?: boolean
    motherId?: boolean
    createdAt?: boolean
    createdById?: boolean
    administeredById?: boolean
    mother?: boolean | MotherDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tDDose"]>

  export type TDDoseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    doseNumber?: boolean
    dateGiven?: boolean
    remarks?: boolean
    motherId?: boolean
    createdAt?: boolean
    createdById?: boolean
    administeredById?: boolean
    mother?: boolean | MotherDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tDDose"]>

  export type TDDoseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    doseNumber?: boolean
    dateGiven?: boolean
    remarks?: boolean
    motherId?: boolean
    createdAt?: boolean
    createdById?: boolean
    administeredById?: boolean
    mother?: boolean | MotherDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tDDose"]>

  export type TDDoseSelectScalar = {
    id?: boolean
    doseNumber?: boolean
    dateGiven?: boolean
    remarks?: boolean
    motherId?: boolean
    createdAt?: boolean
    createdById?: boolean
    administeredById?: boolean
  }

  export type TDDoseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "doseNumber" | "dateGiven" | "remarks" | "motherId" | "createdAt" | "createdById" | "administeredById", ExtArgs["result"]["tDDose"]>
  export type TDDoseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mother?: boolean | MotherDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TDDoseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mother?: boolean | MotherDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TDDoseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mother?: boolean | MotherDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TDDosePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TDDose"
    objects: {
      mother: Prisma.$MotherPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs>
      administeredBy: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      doseNumber: number
      dateGiven: Date
      remarks: string | null
      motherId: string
      createdAt: Date
      createdById: number
      administeredById: number
    }, ExtArgs["result"]["tDDose"]>
    composites: {}
  }

  type TDDoseGetPayload<S extends boolean | null | undefined | TDDoseDefaultArgs> = $Result.GetResult<Prisma.$TDDosePayload, S>

  type TDDoseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TDDoseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TDDoseCountAggregateInputType | true
    }

  export interface TDDoseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TDDose'], meta: { name: 'TDDose' } }
    /**
     * Find zero or one TDDose that matches the filter.
     * @param {TDDoseFindUniqueArgs} args - Arguments to find a TDDose
     * @example
     * // Get one TDDose
     * const tDDose = await prisma.tDDose.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TDDoseFindUniqueArgs>(args: SelectSubset<T, TDDoseFindUniqueArgs<ExtArgs>>): Prisma__TDDoseClient<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TDDose that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TDDoseFindUniqueOrThrowArgs} args - Arguments to find a TDDose
     * @example
     * // Get one TDDose
     * const tDDose = await prisma.tDDose.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TDDoseFindUniqueOrThrowArgs>(args: SelectSubset<T, TDDoseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TDDoseClient<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TDDose that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TDDoseFindFirstArgs} args - Arguments to find a TDDose
     * @example
     * // Get one TDDose
     * const tDDose = await prisma.tDDose.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TDDoseFindFirstArgs>(args?: SelectSubset<T, TDDoseFindFirstArgs<ExtArgs>>): Prisma__TDDoseClient<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TDDose that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TDDoseFindFirstOrThrowArgs} args - Arguments to find a TDDose
     * @example
     * // Get one TDDose
     * const tDDose = await prisma.tDDose.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TDDoseFindFirstOrThrowArgs>(args?: SelectSubset<T, TDDoseFindFirstOrThrowArgs<ExtArgs>>): Prisma__TDDoseClient<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TDDoses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TDDoseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TDDoses
     * const tDDoses = await prisma.tDDose.findMany()
     * 
     * // Get first 10 TDDoses
     * const tDDoses = await prisma.tDDose.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tDDoseWithIdOnly = await prisma.tDDose.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TDDoseFindManyArgs>(args?: SelectSubset<T, TDDoseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TDDose.
     * @param {TDDoseCreateArgs} args - Arguments to create a TDDose.
     * @example
     * // Create one TDDose
     * const TDDose = await prisma.tDDose.create({
     *   data: {
     *     // ... data to create a TDDose
     *   }
     * })
     * 
     */
    create<T extends TDDoseCreateArgs>(args: SelectSubset<T, TDDoseCreateArgs<ExtArgs>>): Prisma__TDDoseClient<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TDDoses.
     * @param {TDDoseCreateManyArgs} args - Arguments to create many TDDoses.
     * @example
     * // Create many TDDoses
     * const tDDose = await prisma.tDDose.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TDDoseCreateManyArgs>(args?: SelectSubset<T, TDDoseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TDDoses and returns the data saved in the database.
     * @param {TDDoseCreateManyAndReturnArgs} args - Arguments to create many TDDoses.
     * @example
     * // Create many TDDoses
     * const tDDose = await prisma.tDDose.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TDDoses and only return the `id`
     * const tDDoseWithIdOnly = await prisma.tDDose.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TDDoseCreateManyAndReturnArgs>(args?: SelectSubset<T, TDDoseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TDDose.
     * @param {TDDoseDeleteArgs} args - Arguments to delete one TDDose.
     * @example
     * // Delete one TDDose
     * const TDDose = await prisma.tDDose.delete({
     *   where: {
     *     // ... filter to delete one TDDose
     *   }
     * })
     * 
     */
    delete<T extends TDDoseDeleteArgs>(args: SelectSubset<T, TDDoseDeleteArgs<ExtArgs>>): Prisma__TDDoseClient<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TDDose.
     * @param {TDDoseUpdateArgs} args - Arguments to update one TDDose.
     * @example
     * // Update one TDDose
     * const tDDose = await prisma.tDDose.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TDDoseUpdateArgs>(args: SelectSubset<T, TDDoseUpdateArgs<ExtArgs>>): Prisma__TDDoseClient<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TDDoses.
     * @param {TDDoseDeleteManyArgs} args - Arguments to filter TDDoses to delete.
     * @example
     * // Delete a few TDDoses
     * const { count } = await prisma.tDDose.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TDDoseDeleteManyArgs>(args?: SelectSubset<T, TDDoseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TDDoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TDDoseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TDDoses
     * const tDDose = await prisma.tDDose.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TDDoseUpdateManyArgs>(args: SelectSubset<T, TDDoseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TDDoses and returns the data updated in the database.
     * @param {TDDoseUpdateManyAndReturnArgs} args - Arguments to update many TDDoses.
     * @example
     * // Update many TDDoses
     * const tDDose = await prisma.tDDose.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TDDoses and only return the `id`
     * const tDDoseWithIdOnly = await prisma.tDDose.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TDDoseUpdateManyAndReturnArgs>(args: SelectSubset<T, TDDoseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TDDose.
     * @param {TDDoseUpsertArgs} args - Arguments to update or create a TDDose.
     * @example
     * // Update or create a TDDose
     * const tDDose = await prisma.tDDose.upsert({
     *   create: {
     *     // ... data to create a TDDose
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TDDose we want to update
     *   }
     * })
     */
    upsert<T extends TDDoseUpsertArgs>(args: SelectSubset<T, TDDoseUpsertArgs<ExtArgs>>): Prisma__TDDoseClient<$Result.GetResult<Prisma.$TDDosePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TDDoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TDDoseCountArgs} args - Arguments to filter TDDoses to count.
     * @example
     * // Count the number of TDDoses
     * const count = await prisma.tDDose.count({
     *   where: {
     *     // ... the filter for the TDDoses we want to count
     *   }
     * })
    **/
    count<T extends TDDoseCountArgs>(
      args?: Subset<T, TDDoseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TDDoseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TDDose.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TDDoseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TDDoseAggregateArgs>(args: Subset<T, TDDoseAggregateArgs>): Prisma.PrismaPromise<GetTDDoseAggregateType<T>>

    /**
     * Group by TDDose.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TDDoseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TDDoseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TDDoseGroupByArgs['orderBy'] }
        : { orderBy?: TDDoseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TDDoseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTDDoseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TDDose model
   */
  readonly fields: TDDoseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TDDose.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TDDoseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mother<T extends MotherDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MotherDefaultArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    administeredBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TDDose model
   */
  interface TDDoseFieldRefs {
    readonly id: FieldRef<"TDDose", 'String'>
    readonly doseNumber: FieldRef<"TDDose", 'Int'>
    readonly dateGiven: FieldRef<"TDDose", 'DateTime'>
    readonly remarks: FieldRef<"TDDose", 'String'>
    readonly motherId: FieldRef<"TDDose", 'String'>
    readonly createdAt: FieldRef<"TDDose", 'DateTime'>
    readonly createdById: FieldRef<"TDDose", 'Int'>
    readonly administeredById: FieldRef<"TDDose", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * TDDose findUnique
   */
  export type TDDoseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * Filter, which TDDose to fetch.
     */
    where: TDDoseWhereUniqueInput
  }

  /**
   * TDDose findUniqueOrThrow
   */
  export type TDDoseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * Filter, which TDDose to fetch.
     */
    where: TDDoseWhereUniqueInput
  }

  /**
   * TDDose findFirst
   */
  export type TDDoseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * Filter, which TDDose to fetch.
     */
    where?: TDDoseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TDDoses to fetch.
     */
    orderBy?: TDDoseOrderByWithRelationInput | TDDoseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TDDoses.
     */
    cursor?: TDDoseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TDDoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TDDoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TDDoses.
     */
    distinct?: TDDoseScalarFieldEnum | TDDoseScalarFieldEnum[]
  }

  /**
   * TDDose findFirstOrThrow
   */
  export type TDDoseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * Filter, which TDDose to fetch.
     */
    where?: TDDoseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TDDoses to fetch.
     */
    orderBy?: TDDoseOrderByWithRelationInput | TDDoseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TDDoses.
     */
    cursor?: TDDoseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TDDoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TDDoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TDDoses.
     */
    distinct?: TDDoseScalarFieldEnum | TDDoseScalarFieldEnum[]
  }

  /**
   * TDDose findMany
   */
  export type TDDoseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * Filter, which TDDoses to fetch.
     */
    where?: TDDoseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TDDoses to fetch.
     */
    orderBy?: TDDoseOrderByWithRelationInput | TDDoseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TDDoses.
     */
    cursor?: TDDoseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TDDoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TDDoses.
     */
    skip?: number
    distinct?: TDDoseScalarFieldEnum | TDDoseScalarFieldEnum[]
  }

  /**
   * TDDose create
   */
  export type TDDoseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * The data needed to create a TDDose.
     */
    data: XOR<TDDoseCreateInput, TDDoseUncheckedCreateInput>
  }

  /**
   * TDDose createMany
   */
  export type TDDoseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TDDoses.
     */
    data: TDDoseCreateManyInput | TDDoseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TDDose createManyAndReturn
   */
  export type TDDoseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * The data used to create many TDDoses.
     */
    data: TDDoseCreateManyInput | TDDoseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TDDose update
   */
  export type TDDoseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * The data needed to update a TDDose.
     */
    data: XOR<TDDoseUpdateInput, TDDoseUncheckedUpdateInput>
    /**
     * Choose, which TDDose to update.
     */
    where: TDDoseWhereUniqueInput
  }

  /**
   * TDDose updateMany
   */
  export type TDDoseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TDDoses.
     */
    data: XOR<TDDoseUpdateManyMutationInput, TDDoseUncheckedUpdateManyInput>
    /**
     * Filter which TDDoses to update
     */
    where?: TDDoseWhereInput
    /**
     * Limit how many TDDoses to update.
     */
    limit?: number
  }

  /**
   * TDDose updateManyAndReturn
   */
  export type TDDoseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * The data used to update TDDoses.
     */
    data: XOR<TDDoseUpdateManyMutationInput, TDDoseUncheckedUpdateManyInput>
    /**
     * Filter which TDDoses to update
     */
    where?: TDDoseWhereInput
    /**
     * Limit how many TDDoses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TDDose upsert
   */
  export type TDDoseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * The filter to search for the TDDose to update in case it exists.
     */
    where: TDDoseWhereUniqueInput
    /**
     * In case the TDDose found by the `where` argument doesn't exist, create a new TDDose with this data.
     */
    create: XOR<TDDoseCreateInput, TDDoseUncheckedCreateInput>
    /**
     * In case the TDDose was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TDDoseUpdateInput, TDDoseUncheckedUpdateInput>
  }

  /**
   * TDDose delete
   */
  export type TDDoseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
    /**
     * Filter which TDDose to delete.
     */
    where: TDDoseWhereUniqueInput
  }

  /**
   * TDDose deleteMany
   */
  export type TDDoseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TDDoses to delete
     */
    where?: TDDoseWhereInput
    /**
     * Limit how many TDDoses to delete.
     */
    limit?: number
  }

  /**
   * TDDose without action
   */
  export type TDDoseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TDDose
     */
    select?: TDDoseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TDDose
     */
    omit?: TDDoseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TDDoseInclude<ExtArgs> | null
  }


  /**
   * Model VaccinationRecord
   */

  export type AggregateVaccinationRecord = {
    _count: VaccinationRecordCountAggregateOutputType | null
    _avg: VaccinationRecordAvgAggregateOutputType | null
    _sum: VaccinationRecordSumAggregateOutputType | null
    _min: VaccinationRecordMinAggregateOutputType | null
    _max: VaccinationRecordMaxAggregateOutputType | null
  }

  export type VaccinationRecordAvgAggregateOutputType = {
    doseNumber: number | null
    recommendedAtMonths: number | null
    createdById: number | null
    administeredById: number | null
    wardOfVaccination: number | null
  }

  export type VaccinationRecordSumAggregateOutputType = {
    doseNumber: number | null
    recommendedAtMonths: number | null
    createdById: number | null
    administeredById: number | null
    wardOfVaccination: number | null
  }

  export type VaccinationRecordMinAggregateOutputType = {
    id: string | null
    citizenId: string | null
    vaccineType: $Enums.VaccineType | null
    doseNumber: number | null
    dateGiven: Date | null
    isComplete: boolean | null
    remarks: string | null
    recommendedAtMonths: number | null
    customVaccineName: string | null
    type: string | null
    createdById: number | null
    administeredById: number | null
    createdAt: Date | null
    wardOfVaccination: number | null
  }

  export type VaccinationRecordMaxAggregateOutputType = {
    id: string | null
    citizenId: string | null
    vaccineType: $Enums.VaccineType | null
    doseNumber: number | null
    dateGiven: Date | null
    isComplete: boolean | null
    remarks: string | null
    recommendedAtMonths: number | null
    customVaccineName: string | null
    type: string | null
    createdById: number | null
    administeredById: number | null
    createdAt: Date | null
    wardOfVaccination: number | null
  }

  export type VaccinationRecordCountAggregateOutputType = {
    id: number
    citizenId: number
    vaccineType: number
    doseNumber: number
    dateGiven: number
    isComplete: number
    remarks: number
    recommendedAtMonths: number
    customVaccineName: number
    type: number
    createdById: number
    administeredById: number
    createdAt: number
    wardOfVaccination: number
    _all: number
  }


  export type VaccinationRecordAvgAggregateInputType = {
    doseNumber?: true
    recommendedAtMonths?: true
    createdById?: true
    administeredById?: true
    wardOfVaccination?: true
  }

  export type VaccinationRecordSumAggregateInputType = {
    doseNumber?: true
    recommendedAtMonths?: true
    createdById?: true
    administeredById?: true
    wardOfVaccination?: true
  }

  export type VaccinationRecordMinAggregateInputType = {
    id?: true
    citizenId?: true
    vaccineType?: true
    doseNumber?: true
    dateGiven?: true
    isComplete?: true
    remarks?: true
    recommendedAtMonths?: true
    customVaccineName?: true
    type?: true
    createdById?: true
    administeredById?: true
    createdAt?: true
    wardOfVaccination?: true
  }

  export type VaccinationRecordMaxAggregateInputType = {
    id?: true
    citizenId?: true
    vaccineType?: true
    doseNumber?: true
    dateGiven?: true
    isComplete?: true
    remarks?: true
    recommendedAtMonths?: true
    customVaccineName?: true
    type?: true
    createdById?: true
    administeredById?: true
    createdAt?: true
    wardOfVaccination?: true
  }

  export type VaccinationRecordCountAggregateInputType = {
    id?: true
    citizenId?: true
    vaccineType?: true
    doseNumber?: true
    dateGiven?: true
    isComplete?: true
    remarks?: true
    recommendedAtMonths?: true
    customVaccineName?: true
    type?: true
    createdById?: true
    administeredById?: true
    createdAt?: true
    wardOfVaccination?: true
    _all?: true
  }

  export type VaccinationRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VaccinationRecord to aggregate.
     */
    where?: VaccinationRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaccinationRecords to fetch.
     */
    orderBy?: VaccinationRecordOrderByWithRelationInput | VaccinationRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VaccinationRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaccinationRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaccinationRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VaccinationRecords
    **/
    _count?: true | VaccinationRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VaccinationRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VaccinationRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VaccinationRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VaccinationRecordMaxAggregateInputType
  }

  export type GetVaccinationRecordAggregateType<T extends VaccinationRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateVaccinationRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVaccinationRecord[P]>
      : GetScalarType<T[P], AggregateVaccinationRecord[P]>
  }




  export type VaccinationRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VaccinationRecordWhereInput
    orderBy?: VaccinationRecordOrderByWithAggregationInput | VaccinationRecordOrderByWithAggregationInput[]
    by: VaccinationRecordScalarFieldEnum[] | VaccinationRecordScalarFieldEnum
    having?: VaccinationRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VaccinationRecordCountAggregateInputType | true
    _avg?: VaccinationRecordAvgAggregateInputType
    _sum?: VaccinationRecordSumAggregateInputType
    _min?: VaccinationRecordMinAggregateInputType
    _max?: VaccinationRecordMaxAggregateInputType
  }

  export type VaccinationRecordGroupByOutputType = {
    id: string
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date
    isComplete: boolean
    remarks: string | null
    recommendedAtMonths: number
    customVaccineName: string | null
    type: string
    createdById: number
    administeredById: number | null
    createdAt: Date
    wardOfVaccination: number
    _count: VaccinationRecordCountAggregateOutputType | null
    _avg: VaccinationRecordAvgAggregateOutputType | null
    _sum: VaccinationRecordSumAggregateOutputType | null
    _min: VaccinationRecordMinAggregateOutputType | null
    _max: VaccinationRecordMaxAggregateOutputType | null
  }

  type GetVaccinationRecordGroupByPayload<T extends VaccinationRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VaccinationRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VaccinationRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VaccinationRecordGroupByOutputType[P]>
            : GetScalarType<T[P], VaccinationRecordGroupByOutputType[P]>
        }
      >
    >


  export type VaccinationRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    citizenId?: boolean
    vaccineType?: boolean
    doseNumber?: boolean
    dateGiven?: boolean
    isComplete?: boolean
    remarks?: boolean
    recommendedAtMonths?: boolean
    customVaccineName?: boolean
    type?: boolean
    createdById?: boolean
    administeredById?: boolean
    createdAt?: boolean
    wardOfVaccination?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | VaccinationRecord$administeredByArgs<ExtArgs>
  }, ExtArgs["result"]["vaccinationRecord"]>

  export type VaccinationRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    citizenId?: boolean
    vaccineType?: boolean
    doseNumber?: boolean
    dateGiven?: boolean
    isComplete?: boolean
    remarks?: boolean
    recommendedAtMonths?: boolean
    customVaccineName?: boolean
    type?: boolean
    createdById?: boolean
    administeredById?: boolean
    createdAt?: boolean
    wardOfVaccination?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | VaccinationRecord$administeredByArgs<ExtArgs>
  }, ExtArgs["result"]["vaccinationRecord"]>

  export type VaccinationRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    citizenId?: boolean
    vaccineType?: boolean
    doseNumber?: boolean
    dateGiven?: boolean
    isComplete?: boolean
    remarks?: boolean
    recommendedAtMonths?: boolean
    customVaccineName?: boolean
    type?: boolean
    createdById?: boolean
    administeredById?: boolean
    createdAt?: boolean
    wardOfVaccination?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | VaccinationRecord$administeredByArgs<ExtArgs>
  }, ExtArgs["result"]["vaccinationRecord"]>

  export type VaccinationRecordSelectScalar = {
    id?: boolean
    citizenId?: boolean
    vaccineType?: boolean
    doseNumber?: boolean
    dateGiven?: boolean
    isComplete?: boolean
    remarks?: boolean
    recommendedAtMonths?: boolean
    customVaccineName?: boolean
    type?: boolean
    createdById?: boolean
    administeredById?: boolean
    createdAt?: boolean
    wardOfVaccination?: boolean
  }

  export type VaccinationRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "citizenId" | "vaccineType" | "doseNumber" | "dateGiven" | "isComplete" | "remarks" | "recommendedAtMonths" | "customVaccineName" | "type" | "createdById" | "administeredById" | "createdAt" | "wardOfVaccination", ExtArgs["result"]["vaccinationRecord"]>
  export type VaccinationRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | VaccinationRecord$administeredByArgs<ExtArgs>
  }
  export type VaccinationRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | VaccinationRecord$administeredByArgs<ExtArgs>
  }
  export type VaccinationRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | VaccinationRecord$administeredByArgs<ExtArgs>
  }

  export type $VaccinationRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VaccinationRecord"
    objects: {
      child: Prisma.$ChildPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs>
      administeredBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      citizenId: string
      vaccineType: $Enums.VaccineType
      doseNumber: number
      dateGiven: Date
      isComplete: boolean
      remarks: string | null
      recommendedAtMonths: number
      customVaccineName: string | null
      type: string
      createdById: number
      administeredById: number | null
      createdAt: Date
      wardOfVaccination: number
    }, ExtArgs["result"]["vaccinationRecord"]>
    composites: {}
  }

  type VaccinationRecordGetPayload<S extends boolean | null | undefined | VaccinationRecordDefaultArgs> = $Result.GetResult<Prisma.$VaccinationRecordPayload, S>

  type VaccinationRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VaccinationRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VaccinationRecordCountAggregateInputType | true
    }

  export interface VaccinationRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VaccinationRecord'], meta: { name: 'VaccinationRecord' } }
    /**
     * Find zero or one VaccinationRecord that matches the filter.
     * @param {VaccinationRecordFindUniqueArgs} args - Arguments to find a VaccinationRecord
     * @example
     * // Get one VaccinationRecord
     * const vaccinationRecord = await prisma.vaccinationRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VaccinationRecordFindUniqueArgs>(args: SelectSubset<T, VaccinationRecordFindUniqueArgs<ExtArgs>>): Prisma__VaccinationRecordClient<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VaccinationRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VaccinationRecordFindUniqueOrThrowArgs} args - Arguments to find a VaccinationRecord
     * @example
     * // Get one VaccinationRecord
     * const vaccinationRecord = await prisma.vaccinationRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VaccinationRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, VaccinationRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VaccinationRecordClient<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VaccinationRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaccinationRecordFindFirstArgs} args - Arguments to find a VaccinationRecord
     * @example
     * // Get one VaccinationRecord
     * const vaccinationRecord = await prisma.vaccinationRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VaccinationRecordFindFirstArgs>(args?: SelectSubset<T, VaccinationRecordFindFirstArgs<ExtArgs>>): Prisma__VaccinationRecordClient<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VaccinationRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaccinationRecordFindFirstOrThrowArgs} args - Arguments to find a VaccinationRecord
     * @example
     * // Get one VaccinationRecord
     * const vaccinationRecord = await prisma.vaccinationRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VaccinationRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, VaccinationRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__VaccinationRecordClient<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VaccinationRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaccinationRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VaccinationRecords
     * const vaccinationRecords = await prisma.vaccinationRecord.findMany()
     * 
     * // Get first 10 VaccinationRecords
     * const vaccinationRecords = await prisma.vaccinationRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vaccinationRecordWithIdOnly = await prisma.vaccinationRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VaccinationRecordFindManyArgs>(args?: SelectSubset<T, VaccinationRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VaccinationRecord.
     * @param {VaccinationRecordCreateArgs} args - Arguments to create a VaccinationRecord.
     * @example
     * // Create one VaccinationRecord
     * const VaccinationRecord = await prisma.vaccinationRecord.create({
     *   data: {
     *     // ... data to create a VaccinationRecord
     *   }
     * })
     * 
     */
    create<T extends VaccinationRecordCreateArgs>(args: SelectSubset<T, VaccinationRecordCreateArgs<ExtArgs>>): Prisma__VaccinationRecordClient<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VaccinationRecords.
     * @param {VaccinationRecordCreateManyArgs} args - Arguments to create many VaccinationRecords.
     * @example
     * // Create many VaccinationRecords
     * const vaccinationRecord = await prisma.vaccinationRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VaccinationRecordCreateManyArgs>(args?: SelectSubset<T, VaccinationRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VaccinationRecords and returns the data saved in the database.
     * @param {VaccinationRecordCreateManyAndReturnArgs} args - Arguments to create many VaccinationRecords.
     * @example
     * // Create many VaccinationRecords
     * const vaccinationRecord = await prisma.vaccinationRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VaccinationRecords and only return the `id`
     * const vaccinationRecordWithIdOnly = await prisma.vaccinationRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VaccinationRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, VaccinationRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VaccinationRecord.
     * @param {VaccinationRecordDeleteArgs} args - Arguments to delete one VaccinationRecord.
     * @example
     * // Delete one VaccinationRecord
     * const VaccinationRecord = await prisma.vaccinationRecord.delete({
     *   where: {
     *     // ... filter to delete one VaccinationRecord
     *   }
     * })
     * 
     */
    delete<T extends VaccinationRecordDeleteArgs>(args: SelectSubset<T, VaccinationRecordDeleteArgs<ExtArgs>>): Prisma__VaccinationRecordClient<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VaccinationRecord.
     * @param {VaccinationRecordUpdateArgs} args - Arguments to update one VaccinationRecord.
     * @example
     * // Update one VaccinationRecord
     * const vaccinationRecord = await prisma.vaccinationRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VaccinationRecordUpdateArgs>(args: SelectSubset<T, VaccinationRecordUpdateArgs<ExtArgs>>): Prisma__VaccinationRecordClient<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VaccinationRecords.
     * @param {VaccinationRecordDeleteManyArgs} args - Arguments to filter VaccinationRecords to delete.
     * @example
     * // Delete a few VaccinationRecords
     * const { count } = await prisma.vaccinationRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VaccinationRecordDeleteManyArgs>(args?: SelectSubset<T, VaccinationRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VaccinationRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaccinationRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VaccinationRecords
     * const vaccinationRecord = await prisma.vaccinationRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VaccinationRecordUpdateManyArgs>(args: SelectSubset<T, VaccinationRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VaccinationRecords and returns the data updated in the database.
     * @param {VaccinationRecordUpdateManyAndReturnArgs} args - Arguments to update many VaccinationRecords.
     * @example
     * // Update many VaccinationRecords
     * const vaccinationRecord = await prisma.vaccinationRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VaccinationRecords and only return the `id`
     * const vaccinationRecordWithIdOnly = await prisma.vaccinationRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VaccinationRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, VaccinationRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VaccinationRecord.
     * @param {VaccinationRecordUpsertArgs} args - Arguments to update or create a VaccinationRecord.
     * @example
     * // Update or create a VaccinationRecord
     * const vaccinationRecord = await prisma.vaccinationRecord.upsert({
     *   create: {
     *     // ... data to create a VaccinationRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VaccinationRecord we want to update
     *   }
     * })
     */
    upsert<T extends VaccinationRecordUpsertArgs>(args: SelectSubset<T, VaccinationRecordUpsertArgs<ExtArgs>>): Prisma__VaccinationRecordClient<$Result.GetResult<Prisma.$VaccinationRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VaccinationRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaccinationRecordCountArgs} args - Arguments to filter VaccinationRecords to count.
     * @example
     * // Count the number of VaccinationRecords
     * const count = await prisma.vaccinationRecord.count({
     *   where: {
     *     // ... the filter for the VaccinationRecords we want to count
     *   }
     * })
    **/
    count<T extends VaccinationRecordCountArgs>(
      args?: Subset<T, VaccinationRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VaccinationRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VaccinationRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaccinationRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VaccinationRecordAggregateArgs>(args: Subset<T, VaccinationRecordAggregateArgs>): Prisma.PrismaPromise<GetVaccinationRecordAggregateType<T>>

    /**
     * Group by VaccinationRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaccinationRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VaccinationRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VaccinationRecordGroupByArgs['orderBy'] }
        : { orderBy?: VaccinationRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VaccinationRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVaccinationRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VaccinationRecord model
   */
  readonly fields: VaccinationRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VaccinationRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VaccinationRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    child<T extends ChildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChildDefaultArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    administeredBy<T extends VaccinationRecord$administeredByArgs<ExtArgs> = {}>(args?: Subset<T, VaccinationRecord$administeredByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VaccinationRecord model
   */
  interface VaccinationRecordFieldRefs {
    readonly id: FieldRef<"VaccinationRecord", 'String'>
    readonly citizenId: FieldRef<"VaccinationRecord", 'String'>
    readonly vaccineType: FieldRef<"VaccinationRecord", 'VaccineType'>
    readonly doseNumber: FieldRef<"VaccinationRecord", 'Int'>
    readonly dateGiven: FieldRef<"VaccinationRecord", 'DateTime'>
    readonly isComplete: FieldRef<"VaccinationRecord", 'Boolean'>
    readonly remarks: FieldRef<"VaccinationRecord", 'String'>
    readonly recommendedAtMonths: FieldRef<"VaccinationRecord", 'Int'>
    readonly customVaccineName: FieldRef<"VaccinationRecord", 'String'>
    readonly type: FieldRef<"VaccinationRecord", 'String'>
    readonly createdById: FieldRef<"VaccinationRecord", 'Int'>
    readonly administeredById: FieldRef<"VaccinationRecord", 'Int'>
    readonly createdAt: FieldRef<"VaccinationRecord", 'DateTime'>
    readonly wardOfVaccination: FieldRef<"VaccinationRecord", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * VaccinationRecord findUnique
   */
  export type VaccinationRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * Filter, which VaccinationRecord to fetch.
     */
    where: VaccinationRecordWhereUniqueInput
  }

  /**
   * VaccinationRecord findUniqueOrThrow
   */
  export type VaccinationRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * Filter, which VaccinationRecord to fetch.
     */
    where: VaccinationRecordWhereUniqueInput
  }

  /**
   * VaccinationRecord findFirst
   */
  export type VaccinationRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * Filter, which VaccinationRecord to fetch.
     */
    where?: VaccinationRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaccinationRecords to fetch.
     */
    orderBy?: VaccinationRecordOrderByWithRelationInput | VaccinationRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VaccinationRecords.
     */
    cursor?: VaccinationRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaccinationRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaccinationRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VaccinationRecords.
     */
    distinct?: VaccinationRecordScalarFieldEnum | VaccinationRecordScalarFieldEnum[]
  }

  /**
   * VaccinationRecord findFirstOrThrow
   */
  export type VaccinationRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * Filter, which VaccinationRecord to fetch.
     */
    where?: VaccinationRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaccinationRecords to fetch.
     */
    orderBy?: VaccinationRecordOrderByWithRelationInput | VaccinationRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VaccinationRecords.
     */
    cursor?: VaccinationRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaccinationRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaccinationRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VaccinationRecords.
     */
    distinct?: VaccinationRecordScalarFieldEnum | VaccinationRecordScalarFieldEnum[]
  }

  /**
   * VaccinationRecord findMany
   */
  export type VaccinationRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * Filter, which VaccinationRecords to fetch.
     */
    where?: VaccinationRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaccinationRecords to fetch.
     */
    orderBy?: VaccinationRecordOrderByWithRelationInput | VaccinationRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VaccinationRecords.
     */
    cursor?: VaccinationRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaccinationRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaccinationRecords.
     */
    skip?: number
    distinct?: VaccinationRecordScalarFieldEnum | VaccinationRecordScalarFieldEnum[]
  }

  /**
   * VaccinationRecord create
   */
  export type VaccinationRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a VaccinationRecord.
     */
    data: XOR<VaccinationRecordCreateInput, VaccinationRecordUncheckedCreateInput>
  }

  /**
   * VaccinationRecord createMany
   */
  export type VaccinationRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VaccinationRecords.
     */
    data: VaccinationRecordCreateManyInput | VaccinationRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VaccinationRecord createManyAndReturn
   */
  export type VaccinationRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * The data used to create many VaccinationRecords.
     */
    data: VaccinationRecordCreateManyInput | VaccinationRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VaccinationRecord update
   */
  export type VaccinationRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a VaccinationRecord.
     */
    data: XOR<VaccinationRecordUpdateInput, VaccinationRecordUncheckedUpdateInput>
    /**
     * Choose, which VaccinationRecord to update.
     */
    where: VaccinationRecordWhereUniqueInput
  }

  /**
   * VaccinationRecord updateMany
   */
  export type VaccinationRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VaccinationRecords.
     */
    data: XOR<VaccinationRecordUpdateManyMutationInput, VaccinationRecordUncheckedUpdateManyInput>
    /**
     * Filter which VaccinationRecords to update
     */
    where?: VaccinationRecordWhereInput
    /**
     * Limit how many VaccinationRecords to update.
     */
    limit?: number
  }

  /**
   * VaccinationRecord updateManyAndReturn
   */
  export type VaccinationRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * The data used to update VaccinationRecords.
     */
    data: XOR<VaccinationRecordUpdateManyMutationInput, VaccinationRecordUncheckedUpdateManyInput>
    /**
     * Filter which VaccinationRecords to update
     */
    where?: VaccinationRecordWhereInput
    /**
     * Limit how many VaccinationRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VaccinationRecord upsert
   */
  export type VaccinationRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the VaccinationRecord to update in case it exists.
     */
    where: VaccinationRecordWhereUniqueInput
    /**
     * In case the VaccinationRecord found by the `where` argument doesn't exist, create a new VaccinationRecord with this data.
     */
    create: XOR<VaccinationRecordCreateInput, VaccinationRecordUncheckedCreateInput>
    /**
     * In case the VaccinationRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VaccinationRecordUpdateInput, VaccinationRecordUncheckedUpdateInput>
  }

  /**
   * VaccinationRecord delete
   */
  export type VaccinationRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
    /**
     * Filter which VaccinationRecord to delete.
     */
    where: VaccinationRecordWhereUniqueInput
  }

  /**
   * VaccinationRecord deleteMany
   */
  export type VaccinationRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VaccinationRecords to delete
     */
    where?: VaccinationRecordWhereInput
    /**
     * Limit how many VaccinationRecords to delete.
     */
    limit?: number
  }

  /**
   * VaccinationRecord.administeredBy
   */
  export type VaccinationRecord$administeredByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * VaccinationRecord without action
   */
  export type VaccinationRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaccinationRecord
     */
    select?: VaccinationRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VaccinationRecord
     */
    omit?: VaccinationRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VaccinationRecordInclude<ExtArgs> | null
  }


  /**
   * Model NotificationLog
   */

  export type AggregateNotificationLog = {
    _count: NotificationLogCountAggregateOutputType | null
    _avg: NotificationLogAvgAggregateOutputType | null
    _sum: NotificationLogSumAggregateOutputType | null
    _min: NotificationLogMinAggregateOutputType | null
    _max: NotificationLogMaxAggregateOutputType | null
  }

  export type NotificationLogAvgAggregateOutputType = {
    id: number | null
    doseNumber: number | null
  }

  export type NotificationLogSumAggregateOutputType = {
    id: number | null
    doseNumber: number | null
  }

  export type NotificationLogMinAggregateOutputType = {
    id: number | null
    citizenId: string | null
    vaccineType: $Enums.VaccineType | null
    doseNumber: number | null
    sentAt: Date | null
    type: string | null
  }

  export type NotificationLogMaxAggregateOutputType = {
    id: number | null
    citizenId: string | null
    vaccineType: $Enums.VaccineType | null
    doseNumber: number | null
    sentAt: Date | null
    type: string | null
  }

  export type NotificationLogCountAggregateOutputType = {
    id: number
    citizenId: number
    vaccineType: number
    doseNumber: number
    sentAt: number
    type: number
    _all: number
  }


  export type NotificationLogAvgAggregateInputType = {
    id?: true
    doseNumber?: true
  }

  export type NotificationLogSumAggregateInputType = {
    id?: true
    doseNumber?: true
  }

  export type NotificationLogMinAggregateInputType = {
    id?: true
    citizenId?: true
    vaccineType?: true
    doseNumber?: true
    sentAt?: true
    type?: true
  }

  export type NotificationLogMaxAggregateInputType = {
    id?: true
    citizenId?: true
    vaccineType?: true
    doseNumber?: true
    sentAt?: true
    type?: true
  }

  export type NotificationLogCountAggregateInputType = {
    id?: true
    citizenId?: true
    vaccineType?: true
    doseNumber?: true
    sentAt?: true
    type?: true
    _all?: true
  }

  export type NotificationLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationLog to aggregate.
     */
    where?: NotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationLogs to fetch.
     */
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationLogs
    **/
    _count?: true | NotificationLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationLogMaxAggregateInputType
  }

  export type GetNotificationLogAggregateType<T extends NotificationLogAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationLog[P]>
      : GetScalarType<T[P], AggregateNotificationLog[P]>
  }




  export type NotificationLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationLogWhereInput
    orderBy?: NotificationLogOrderByWithAggregationInput | NotificationLogOrderByWithAggregationInput[]
    by: NotificationLogScalarFieldEnum[] | NotificationLogScalarFieldEnum
    having?: NotificationLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationLogCountAggregateInputType | true
    _avg?: NotificationLogAvgAggregateInputType
    _sum?: NotificationLogSumAggregateInputType
    _min?: NotificationLogMinAggregateInputType
    _max?: NotificationLogMaxAggregateInputType
  }

  export type NotificationLogGroupByOutputType = {
    id: number
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    sentAt: Date
    type: string
    _count: NotificationLogCountAggregateOutputType | null
    _avg: NotificationLogAvgAggregateOutputType | null
    _sum: NotificationLogSumAggregateOutputType | null
    _min: NotificationLogMinAggregateOutputType | null
    _max: NotificationLogMaxAggregateOutputType | null
  }

  type GetNotificationLogGroupByPayload<T extends NotificationLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationLogGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationLogGroupByOutputType[P]>
        }
      >
    >


  export type NotificationLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    citizenId?: boolean
    vaccineType?: boolean
    doseNumber?: boolean
    sentAt?: boolean
    type?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationLog"]>

  export type NotificationLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    citizenId?: boolean
    vaccineType?: boolean
    doseNumber?: boolean
    sentAt?: boolean
    type?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationLog"]>

  export type NotificationLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    citizenId?: boolean
    vaccineType?: boolean
    doseNumber?: boolean
    sentAt?: boolean
    type?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationLog"]>

  export type NotificationLogSelectScalar = {
    id?: boolean
    citizenId?: boolean
    vaccineType?: boolean
    doseNumber?: boolean
    sentAt?: boolean
    type?: boolean
  }

  export type NotificationLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "citizenId" | "vaccineType" | "doseNumber" | "sentAt" | "type", ExtArgs["result"]["notificationLog"]>
  export type NotificationLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }
  export type NotificationLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }
  export type NotificationLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
  }

  export type $NotificationLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationLog"
    objects: {
      child: Prisma.$ChildPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      citizenId: string
      vaccineType: $Enums.VaccineType
      doseNumber: number
      sentAt: Date
      type: string
    }, ExtArgs["result"]["notificationLog"]>
    composites: {}
  }

  type NotificationLogGetPayload<S extends boolean | null | undefined | NotificationLogDefaultArgs> = $Result.GetResult<Prisma.$NotificationLogPayload, S>

  type NotificationLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationLogCountAggregateInputType | true
    }

  export interface NotificationLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationLog'], meta: { name: 'NotificationLog' } }
    /**
     * Find zero or one NotificationLog that matches the filter.
     * @param {NotificationLogFindUniqueArgs} args - Arguments to find a NotificationLog
     * @example
     * // Get one NotificationLog
     * const notificationLog = await prisma.notificationLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationLogFindUniqueArgs>(args: SelectSubset<T, NotificationLogFindUniqueArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NotificationLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationLogFindUniqueOrThrowArgs} args - Arguments to find a NotificationLog
     * @example
     * // Get one NotificationLog
     * const notificationLog = await prisma.notificationLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationLogFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogFindFirstArgs} args - Arguments to find a NotificationLog
     * @example
     * // Get one NotificationLog
     * const notificationLog = await prisma.notificationLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationLogFindFirstArgs>(args?: SelectSubset<T, NotificationLogFindFirstArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogFindFirstOrThrowArgs} args - Arguments to find a NotificationLog
     * @example
     * // Get one NotificationLog
     * const notificationLog = await prisma.notificationLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationLogFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NotificationLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationLogs
     * const notificationLogs = await prisma.notificationLog.findMany()
     * 
     * // Get first 10 NotificationLogs
     * const notificationLogs = await prisma.notificationLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationLogWithIdOnly = await prisma.notificationLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationLogFindManyArgs>(args?: SelectSubset<T, NotificationLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NotificationLog.
     * @param {NotificationLogCreateArgs} args - Arguments to create a NotificationLog.
     * @example
     * // Create one NotificationLog
     * const NotificationLog = await prisma.notificationLog.create({
     *   data: {
     *     // ... data to create a NotificationLog
     *   }
     * })
     * 
     */
    create<T extends NotificationLogCreateArgs>(args: SelectSubset<T, NotificationLogCreateArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NotificationLogs.
     * @param {NotificationLogCreateManyArgs} args - Arguments to create many NotificationLogs.
     * @example
     * // Create many NotificationLogs
     * const notificationLog = await prisma.notificationLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationLogCreateManyArgs>(args?: SelectSubset<T, NotificationLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationLogs and returns the data saved in the database.
     * @param {NotificationLogCreateManyAndReturnArgs} args - Arguments to create many NotificationLogs.
     * @example
     * // Create many NotificationLogs
     * const notificationLog = await prisma.notificationLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationLogs and only return the `id`
     * const notificationLogWithIdOnly = await prisma.notificationLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationLogCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NotificationLog.
     * @param {NotificationLogDeleteArgs} args - Arguments to delete one NotificationLog.
     * @example
     * // Delete one NotificationLog
     * const NotificationLog = await prisma.notificationLog.delete({
     *   where: {
     *     // ... filter to delete one NotificationLog
     *   }
     * })
     * 
     */
    delete<T extends NotificationLogDeleteArgs>(args: SelectSubset<T, NotificationLogDeleteArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NotificationLog.
     * @param {NotificationLogUpdateArgs} args - Arguments to update one NotificationLog.
     * @example
     * // Update one NotificationLog
     * const notificationLog = await prisma.notificationLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationLogUpdateArgs>(args: SelectSubset<T, NotificationLogUpdateArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NotificationLogs.
     * @param {NotificationLogDeleteManyArgs} args - Arguments to filter NotificationLogs to delete.
     * @example
     * // Delete a few NotificationLogs
     * const { count } = await prisma.notificationLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationLogDeleteManyArgs>(args?: SelectSubset<T, NotificationLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationLogs
     * const notificationLog = await prisma.notificationLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationLogUpdateManyArgs>(args: SelectSubset<T, NotificationLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationLogs and returns the data updated in the database.
     * @param {NotificationLogUpdateManyAndReturnArgs} args - Arguments to update many NotificationLogs.
     * @example
     * // Update many NotificationLogs
     * const notificationLog = await prisma.notificationLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NotificationLogs and only return the `id`
     * const notificationLogWithIdOnly = await prisma.notificationLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationLogUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NotificationLog.
     * @param {NotificationLogUpsertArgs} args - Arguments to update or create a NotificationLog.
     * @example
     * // Update or create a NotificationLog
     * const notificationLog = await prisma.notificationLog.upsert({
     *   create: {
     *     // ... data to create a NotificationLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationLog we want to update
     *   }
     * })
     */
    upsert<T extends NotificationLogUpsertArgs>(args: SelectSubset<T, NotificationLogUpsertArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NotificationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogCountArgs} args - Arguments to filter NotificationLogs to count.
     * @example
     * // Count the number of NotificationLogs
     * const count = await prisma.notificationLog.count({
     *   where: {
     *     // ... the filter for the NotificationLogs we want to count
     *   }
     * })
    **/
    count<T extends NotificationLogCountArgs>(
      args?: Subset<T, NotificationLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationLogAggregateArgs>(args: Subset<T, NotificationLogAggregateArgs>): Prisma.PrismaPromise<GetNotificationLogAggregateType<T>>

    /**
     * Group by NotificationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationLogGroupByArgs['orderBy'] }
        : { orderBy?: NotificationLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationLog model
   */
  readonly fields: NotificationLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    child<T extends ChildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChildDefaultArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NotificationLog model
   */
  interface NotificationLogFieldRefs {
    readonly id: FieldRef<"NotificationLog", 'Int'>
    readonly citizenId: FieldRef<"NotificationLog", 'String'>
    readonly vaccineType: FieldRef<"NotificationLog", 'VaccineType'>
    readonly doseNumber: FieldRef<"NotificationLog", 'Int'>
    readonly sentAt: FieldRef<"NotificationLog", 'DateTime'>
    readonly type: FieldRef<"NotificationLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * NotificationLog findUnique
   */
  export type NotificationLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLog to fetch.
     */
    where: NotificationLogWhereUniqueInput
  }

  /**
   * NotificationLog findUniqueOrThrow
   */
  export type NotificationLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLog to fetch.
     */
    where: NotificationLogWhereUniqueInput
  }

  /**
   * NotificationLog findFirst
   */
  export type NotificationLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLog to fetch.
     */
    where?: NotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationLogs to fetch.
     */
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationLogs.
     */
    cursor?: NotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationLogs.
     */
    distinct?: NotificationLogScalarFieldEnum | NotificationLogScalarFieldEnum[]
  }

  /**
   * NotificationLog findFirstOrThrow
   */
  export type NotificationLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLog to fetch.
     */
    where?: NotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationLogs to fetch.
     */
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationLogs.
     */
    cursor?: NotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationLogs.
     */
    distinct?: NotificationLogScalarFieldEnum | NotificationLogScalarFieldEnum[]
  }

  /**
   * NotificationLog findMany
   */
  export type NotificationLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLogs to fetch.
     */
    where?: NotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationLogs to fetch.
     */
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationLogs.
     */
    cursor?: NotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationLogs.
     */
    skip?: number
    distinct?: NotificationLogScalarFieldEnum | NotificationLogScalarFieldEnum[]
  }

  /**
   * NotificationLog create
   */
  export type NotificationLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * The data needed to create a NotificationLog.
     */
    data: XOR<NotificationLogCreateInput, NotificationLogUncheckedCreateInput>
  }

  /**
   * NotificationLog createMany
   */
  export type NotificationLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationLogs.
     */
    data: NotificationLogCreateManyInput | NotificationLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationLog createManyAndReturn
   */
  export type NotificationLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * The data used to create many NotificationLogs.
     */
    data: NotificationLogCreateManyInput | NotificationLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NotificationLog update
   */
  export type NotificationLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * The data needed to update a NotificationLog.
     */
    data: XOR<NotificationLogUpdateInput, NotificationLogUncheckedUpdateInput>
    /**
     * Choose, which NotificationLog to update.
     */
    where: NotificationLogWhereUniqueInput
  }

  /**
   * NotificationLog updateMany
   */
  export type NotificationLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationLogs.
     */
    data: XOR<NotificationLogUpdateManyMutationInput, NotificationLogUncheckedUpdateManyInput>
    /**
     * Filter which NotificationLogs to update
     */
    where?: NotificationLogWhereInput
    /**
     * Limit how many NotificationLogs to update.
     */
    limit?: number
  }

  /**
   * NotificationLog updateManyAndReturn
   */
  export type NotificationLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * The data used to update NotificationLogs.
     */
    data: XOR<NotificationLogUpdateManyMutationInput, NotificationLogUncheckedUpdateManyInput>
    /**
     * Filter which NotificationLogs to update
     */
    where?: NotificationLogWhereInput
    /**
     * Limit how many NotificationLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NotificationLog upsert
   */
  export type NotificationLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * The filter to search for the NotificationLog to update in case it exists.
     */
    where: NotificationLogWhereUniqueInput
    /**
     * In case the NotificationLog found by the `where` argument doesn't exist, create a new NotificationLog with this data.
     */
    create: XOR<NotificationLogCreateInput, NotificationLogUncheckedCreateInput>
    /**
     * In case the NotificationLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationLogUpdateInput, NotificationLogUncheckedUpdateInput>
  }

  /**
   * NotificationLog delete
   */
  export type NotificationLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter which NotificationLog to delete.
     */
    where: NotificationLogWhereUniqueInput
  }

  /**
   * NotificationLog deleteMany
   */
  export type NotificationLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationLogs to delete
     */
    where?: NotificationLogWhereInput
    /**
     * Limit how many NotificationLogs to delete.
     */
    limit?: number
  }

  /**
   * NotificationLog without action
   */
  export type NotificationLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationLog
     */
    omit?: NotificationLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type AuditLogSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: number | null
    userId: number | null
    action: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    action: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    meta: number
    createdAt: number
    _all: number
  }


  export type AuditLogAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AuditLogSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    meta?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _avg?: AuditLogAvgAggregateInputType
    _sum?: AuditLogSumAggregateInputType
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: number
    userId: number
    action: string
    meta: JsonValue | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    meta?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    meta?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    meta?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    meta?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "meta" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      action: string
      meta: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'Int'>
    readonly userId: FieldRef<"AuditLog", 'Int'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly meta: FieldRef<"AuditLog", 'Json'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model CorrectionRequest
   */

  export type AggregateCorrectionRequest = {
    _count: CorrectionRequestCountAggregateOutputType | null
    _avg: CorrectionRequestAvgAggregateOutputType | null
    _sum: CorrectionRequestSumAggregateOutputType | null
    _min: CorrectionRequestMinAggregateOutputType | null
    _max: CorrectionRequestMaxAggregateOutputType | null
  }

  export type CorrectionRequestAvgAggregateOutputType = {
    id: number | null
    requestedById: number | null
    processedById: number | null
  }

  export type CorrectionRequestSumAggregateOutputType = {
    id: number | null
    requestedById: number | null
    processedById: number | null
  }

  export type CorrectionRequestMinAggregateOutputType = {
    id: number | null
    vaccinationId: string | null
    requestedById: number | null
    reason: string | null
    status: string | null
    createdAt: Date | null
    processedById: number | null
    processedAt: Date | null
  }

  export type CorrectionRequestMaxAggregateOutputType = {
    id: number | null
    vaccinationId: string | null
    requestedById: number | null
    reason: string | null
    status: string | null
    createdAt: Date | null
    processedById: number | null
    processedAt: Date | null
  }

  export type CorrectionRequestCountAggregateOutputType = {
    id: number
    vaccinationId: number
    requestedById: number
    reason: number
    status: number
    createdAt: number
    processedById: number
    processedAt: number
    _all: number
  }


  export type CorrectionRequestAvgAggregateInputType = {
    id?: true
    requestedById?: true
    processedById?: true
  }

  export type CorrectionRequestSumAggregateInputType = {
    id?: true
    requestedById?: true
    processedById?: true
  }

  export type CorrectionRequestMinAggregateInputType = {
    id?: true
    vaccinationId?: true
    requestedById?: true
    reason?: true
    status?: true
    createdAt?: true
    processedById?: true
    processedAt?: true
  }

  export type CorrectionRequestMaxAggregateInputType = {
    id?: true
    vaccinationId?: true
    requestedById?: true
    reason?: true
    status?: true
    createdAt?: true
    processedById?: true
    processedAt?: true
  }

  export type CorrectionRequestCountAggregateInputType = {
    id?: true
    vaccinationId?: true
    requestedById?: true
    reason?: true
    status?: true
    createdAt?: true
    processedById?: true
    processedAt?: true
    _all?: true
  }

  export type CorrectionRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorrectionRequest to aggregate.
     */
    where?: CorrectionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorrectionRequests to fetch.
     */
    orderBy?: CorrectionRequestOrderByWithRelationInput | CorrectionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CorrectionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorrectionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorrectionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CorrectionRequests
    **/
    _count?: true | CorrectionRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CorrectionRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CorrectionRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CorrectionRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CorrectionRequestMaxAggregateInputType
  }

  export type GetCorrectionRequestAggregateType<T extends CorrectionRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateCorrectionRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCorrectionRequest[P]>
      : GetScalarType<T[P], AggregateCorrectionRequest[P]>
  }




  export type CorrectionRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CorrectionRequestWhereInput
    orderBy?: CorrectionRequestOrderByWithAggregationInput | CorrectionRequestOrderByWithAggregationInput[]
    by: CorrectionRequestScalarFieldEnum[] | CorrectionRequestScalarFieldEnum
    having?: CorrectionRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CorrectionRequestCountAggregateInputType | true
    _avg?: CorrectionRequestAvgAggregateInputType
    _sum?: CorrectionRequestSumAggregateInputType
    _min?: CorrectionRequestMinAggregateInputType
    _max?: CorrectionRequestMaxAggregateInputType
  }

  export type CorrectionRequestGroupByOutputType = {
    id: number
    vaccinationId: string
    requestedById: number
    reason: string
    status: string
    createdAt: Date
    processedById: number | null
    processedAt: Date | null
    _count: CorrectionRequestCountAggregateOutputType | null
    _avg: CorrectionRequestAvgAggregateOutputType | null
    _sum: CorrectionRequestSumAggregateOutputType | null
    _min: CorrectionRequestMinAggregateOutputType | null
    _max: CorrectionRequestMaxAggregateOutputType | null
  }

  type GetCorrectionRequestGroupByPayload<T extends CorrectionRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CorrectionRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CorrectionRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CorrectionRequestGroupByOutputType[P]>
            : GetScalarType<T[P], CorrectionRequestGroupByOutputType[P]>
        }
      >
    >


  export type CorrectionRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vaccinationId?: boolean
    requestedById?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    processedById?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["correctionRequest"]>

  export type CorrectionRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vaccinationId?: boolean
    requestedById?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    processedById?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["correctionRequest"]>

  export type CorrectionRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vaccinationId?: boolean
    requestedById?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    processedById?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["correctionRequest"]>

  export type CorrectionRequestSelectScalar = {
    id?: boolean
    vaccinationId?: boolean
    requestedById?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    processedById?: boolean
    processedAt?: boolean
  }

  export type CorrectionRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vaccinationId" | "requestedById" | "reason" | "status" | "createdAt" | "processedById" | "processedAt", ExtArgs["result"]["correctionRequest"]>

  export type $CorrectionRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CorrectionRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      vaccinationId: string
      requestedById: number
      reason: string
      status: string
      createdAt: Date
      processedById: number | null
      processedAt: Date | null
    }, ExtArgs["result"]["correctionRequest"]>
    composites: {}
  }

  type CorrectionRequestGetPayload<S extends boolean | null | undefined | CorrectionRequestDefaultArgs> = $Result.GetResult<Prisma.$CorrectionRequestPayload, S>

  type CorrectionRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CorrectionRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CorrectionRequestCountAggregateInputType | true
    }

  export interface CorrectionRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CorrectionRequest'], meta: { name: 'CorrectionRequest' } }
    /**
     * Find zero or one CorrectionRequest that matches the filter.
     * @param {CorrectionRequestFindUniqueArgs} args - Arguments to find a CorrectionRequest
     * @example
     * // Get one CorrectionRequest
     * const correctionRequest = await prisma.correctionRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CorrectionRequestFindUniqueArgs>(args: SelectSubset<T, CorrectionRequestFindUniqueArgs<ExtArgs>>): Prisma__CorrectionRequestClient<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CorrectionRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CorrectionRequestFindUniqueOrThrowArgs} args - Arguments to find a CorrectionRequest
     * @example
     * // Get one CorrectionRequest
     * const correctionRequest = await prisma.correctionRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CorrectionRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, CorrectionRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CorrectionRequestClient<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorrectionRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectionRequestFindFirstArgs} args - Arguments to find a CorrectionRequest
     * @example
     * // Get one CorrectionRequest
     * const correctionRequest = await prisma.correctionRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CorrectionRequestFindFirstArgs>(args?: SelectSubset<T, CorrectionRequestFindFirstArgs<ExtArgs>>): Prisma__CorrectionRequestClient<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CorrectionRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectionRequestFindFirstOrThrowArgs} args - Arguments to find a CorrectionRequest
     * @example
     * // Get one CorrectionRequest
     * const correctionRequest = await prisma.correctionRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CorrectionRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, CorrectionRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__CorrectionRequestClient<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CorrectionRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectionRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CorrectionRequests
     * const correctionRequests = await prisma.correctionRequest.findMany()
     * 
     * // Get first 10 CorrectionRequests
     * const correctionRequests = await prisma.correctionRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const correctionRequestWithIdOnly = await prisma.correctionRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CorrectionRequestFindManyArgs>(args?: SelectSubset<T, CorrectionRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CorrectionRequest.
     * @param {CorrectionRequestCreateArgs} args - Arguments to create a CorrectionRequest.
     * @example
     * // Create one CorrectionRequest
     * const CorrectionRequest = await prisma.correctionRequest.create({
     *   data: {
     *     // ... data to create a CorrectionRequest
     *   }
     * })
     * 
     */
    create<T extends CorrectionRequestCreateArgs>(args: SelectSubset<T, CorrectionRequestCreateArgs<ExtArgs>>): Prisma__CorrectionRequestClient<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CorrectionRequests.
     * @param {CorrectionRequestCreateManyArgs} args - Arguments to create many CorrectionRequests.
     * @example
     * // Create many CorrectionRequests
     * const correctionRequest = await prisma.correctionRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CorrectionRequestCreateManyArgs>(args?: SelectSubset<T, CorrectionRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CorrectionRequests and returns the data saved in the database.
     * @param {CorrectionRequestCreateManyAndReturnArgs} args - Arguments to create many CorrectionRequests.
     * @example
     * // Create many CorrectionRequests
     * const correctionRequest = await prisma.correctionRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CorrectionRequests and only return the `id`
     * const correctionRequestWithIdOnly = await prisma.correctionRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CorrectionRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, CorrectionRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CorrectionRequest.
     * @param {CorrectionRequestDeleteArgs} args - Arguments to delete one CorrectionRequest.
     * @example
     * // Delete one CorrectionRequest
     * const CorrectionRequest = await prisma.correctionRequest.delete({
     *   where: {
     *     // ... filter to delete one CorrectionRequest
     *   }
     * })
     * 
     */
    delete<T extends CorrectionRequestDeleteArgs>(args: SelectSubset<T, CorrectionRequestDeleteArgs<ExtArgs>>): Prisma__CorrectionRequestClient<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CorrectionRequest.
     * @param {CorrectionRequestUpdateArgs} args - Arguments to update one CorrectionRequest.
     * @example
     * // Update one CorrectionRequest
     * const correctionRequest = await prisma.correctionRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CorrectionRequestUpdateArgs>(args: SelectSubset<T, CorrectionRequestUpdateArgs<ExtArgs>>): Prisma__CorrectionRequestClient<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CorrectionRequests.
     * @param {CorrectionRequestDeleteManyArgs} args - Arguments to filter CorrectionRequests to delete.
     * @example
     * // Delete a few CorrectionRequests
     * const { count } = await prisma.correctionRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CorrectionRequestDeleteManyArgs>(args?: SelectSubset<T, CorrectionRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorrectionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectionRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CorrectionRequests
     * const correctionRequest = await prisma.correctionRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CorrectionRequestUpdateManyArgs>(args: SelectSubset<T, CorrectionRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CorrectionRequests and returns the data updated in the database.
     * @param {CorrectionRequestUpdateManyAndReturnArgs} args - Arguments to update many CorrectionRequests.
     * @example
     * // Update many CorrectionRequests
     * const correctionRequest = await prisma.correctionRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CorrectionRequests and only return the `id`
     * const correctionRequestWithIdOnly = await prisma.correctionRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CorrectionRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, CorrectionRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CorrectionRequest.
     * @param {CorrectionRequestUpsertArgs} args - Arguments to update or create a CorrectionRequest.
     * @example
     * // Update or create a CorrectionRequest
     * const correctionRequest = await prisma.correctionRequest.upsert({
     *   create: {
     *     // ... data to create a CorrectionRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CorrectionRequest we want to update
     *   }
     * })
     */
    upsert<T extends CorrectionRequestUpsertArgs>(args: SelectSubset<T, CorrectionRequestUpsertArgs<ExtArgs>>): Prisma__CorrectionRequestClient<$Result.GetResult<Prisma.$CorrectionRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CorrectionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectionRequestCountArgs} args - Arguments to filter CorrectionRequests to count.
     * @example
     * // Count the number of CorrectionRequests
     * const count = await prisma.correctionRequest.count({
     *   where: {
     *     // ... the filter for the CorrectionRequests we want to count
     *   }
     * })
    **/
    count<T extends CorrectionRequestCountArgs>(
      args?: Subset<T, CorrectionRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CorrectionRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CorrectionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectionRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CorrectionRequestAggregateArgs>(args: Subset<T, CorrectionRequestAggregateArgs>): Prisma.PrismaPromise<GetCorrectionRequestAggregateType<T>>

    /**
     * Group by CorrectionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CorrectionRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CorrectionRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CorrectionRequestGroupByArgs['orderBy'] }
        : { orderBy?: CorrectionRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CorrectionRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCorrectionRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CorrectionRequest model
   */
  readonly fields: CorrectionRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CorrectionRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CorrectionRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CorrectionRequest model
   */
  interface CorrectionRequestFieldRefs {
    readonly id: FieldRef<"CorrectionRequest", 'Int'>
    readonly vaccinationId: FieldRef<"CorrectionRequest", 'String'>
    readonly requestedById: FieldRef<"CorrectionRequest", 'Int'>
    readonly reason: FieldRef<"CorrectionRequest", 'String'>
    readonly status: FieldRef<"CorrectionRequest", 'String'>
    readonly createdAt: FieldRef<"CorrectionRequest", 'DateTime'>
    readonly processedById: FieldRef<"CorrectionRequest", 'Int'>
    readonly processedAt: FieldRef<"CorrectionRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CorrectionRequest findUnique
   */
  export type CorrectionRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * Filter, which CorrectionRequest to fetch.
     */
    where: CorrectionRequestWhereUniqueInput
  }

  /**
   * CorrectionRequest findUniqueOrThrow
   */
  export type CorrectionRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * Filter, which CorrectionRequest to fetch.
     */
    where: CorrectionRequestWhereUniqueInput
  }

  /**
   * CorrectionRequest findFirst
   */
  export type CorrectionRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * Filter, which CorrectionRequest to fetch.
     */
    where?: CorrectionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorrectionRequests to fetch.
     */
    orderBy?: CorrectionRequestOrderByWithRelationInput | CorrectionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorrectionRequests.
     */
    cursor?: CorrectionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorrectionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorrectionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorrectionRequests.
     */
    distinct?: CorrectionRequestScalarFieldEnum | CorrectionRequestScalarFieldEnum[]
  }

  /**
   * CorrectionRequest findFirstOrThrow
   */
  export type CorrectionRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * Filter, which CorrectionRequest to fetch.
     */
    where?: CorrectionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorrectionRequests to fetch.
     */
    orderBy?: CorrectionRequestOrderByWithRelationInput | CorrectionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CorrectionRequests.
     */
    cursor?: CorrectionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorrectionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorrectionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CorrectionRequests.
     */
    distinct?: CorrectionRequestScalarFieldEnum | CorrectionRequestScalarFieldEnum[]
  }

  /**
   * CorrectionRequest findMany
   */
  export type CorrectionRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * Filter, which CorrectionRequests to fetch.
     */
    where?: CorrectionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CorrectionRequests to fetch.
     */
    orderBy?: CorrectionRequestOrderByWithRelationInput | CorrectionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CorrectionRequests.
     */
    cursor?: CorrectionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CorrectionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CorrectionRequests.
     */
    skip?: number
    distinct?: CorrectionRequestScalarFieldEnum | CorrectionRequestScalarFieldEnum[]
  }

  /**
   * CorrectionRequest create
   */
  export type CorrectionRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * The data needed to create a CorrectionRequest.
     */
    data: XOR<CorrectionRequestCreateInput, CorrectionRequestUncheckedCreateInput>
  }

  /**
   * CorrectionRequest createMany
   */
  export type CorrectionRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CorrectionRequests.
     */
    data: CorrectionRequestCreateManyInput | CorrectionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CorrectionRequest createManyAndReturn
   */
  export type CorrectionRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * The data used to create many CorrectionRequests.
     */
    data: CorrectionRequestCreateManyInput | CorrectionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CorrectionRequest update
   */
  export type CorrectionRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * The data needed to update a CorrectionRequest.
     */
    data: XOR<CorrectionRequestUpdateInput, CorrectionRequestUncheckedUpdateInput>
    /**
     * Choose, which CorrectionRequest to update.
     */
    where: CorrectionRequestWhereUniqueInput
  }

  /**
   * CorrectionRequest updateMany
   */
  export type CorrectionRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CorrectionRequests.
     */
    data: XOR<CorrectionRequestUpdateManyMutationInput, CorrectionRequestUncheckedUpdateManyInput>
    /**
     * Filter which CorrectionRequests to update
     */
    where?: CorrectionRequestWhereInput
    /**
     * Limit how many CorrectionRequests to update.
     */
    limit?: number
  }

  /**
   * CorrectionRequest updateManyAndReturn
   */
  export type CorrectionRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * The data used to update CorrectionRequests.
     */
    data: XOR<CorrectionRequestUpdateManyMutationInput, CorrectionRequestUncheckedUpdateManyInput>
    /**
     * Filter which CorrectionRequests to update
     */
    where?: CorrectionRequestWhereInput
    /**
     * Limit how many CorrectionRequests to update.
     */
    limit?: number
  }

  /**
   * CorrectionRequest upsert
   */
  export type CorrectionRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * The filter to search for the CorrectionRequest to update in case it exists.
     */
    where: CorrectionRequestWhereUniqueInput
    /**
     * In case the CorrectionRequest found by the `where` argument doesn't exist, create a new CorrectionRequest with this data.
     */
    create: XOR<CorrectionRequestCreateInput, CorrectionRequestUncheckedCreateInput>
    /**
     * In case the CorrectionRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CorrectionRequestUpdateInput, CorrectionRequestUncheckedUpdateInput>
  }

  /**
   * CorrectionRequest delete
   */
  export type CorrectionRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
    /**
     * Filter which CorrectionRequest to delete.
     */
    where: CorrectionRequestWhereUniqueInput
  }

  /**
   * CorrectionRequest deleteMany
   */
  export type CorrectionRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CorrectionRequests to delete
     */
    where?: CorrectionRequestWhereInput
    /**
     * Limit how many CorrectionRequests to delete.
     */
    limit?: number
  }

  /**
   * CorrectionRequest without action
   */
  export type CorrectionRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CorrectionRequest
     */
    select?: CorrectionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CorrectionRequest
     */
    omit?: CorrectionRequestOmit<ExtArgs> | null
  }


  /**
   * Model Certificate
   */

  export type AggregateCertificate = {
    _count: CertificateCountAggregateOutputType | null
    _avg: CertificateAvgAggregateOutputType | null
    _sum: CertificateSumAggregateOutputType | null
    _min: CertificateMinAggregateOutputType | null
    _max: CertificateMaxAggregateOutputType | null
  }

  export type CertificateAvgAggregateOutputType = {
    id: number | null
    issuedById: number | null
  }

  export type CertificateSumAggregateOutputType = {
    id: number | null
    issuedById: number | null
  }

  export type CertificateMinAggregateOutputType = {
    id: number | null
    childId: string | null
    issuedById: number | null
    issuedAt: Date | null
    token: string | null
    pdfPath: string | null
  }

  export type CertificateMaxAggregateOutputType = {
    id: number | null
    childId: string | null
    issuedById: number | null
    issuedAt: Date | null
    token: string | null
    pdfPath: string | null
  }

  export type CertificateCountAggregateOutputType = {
    id: number
    childId: number
    issuedById: number
    issuedAt: number
    token: number
    pdfPath: number
    _all: number
  }


  export type CertificateAvgAggregateInputType = {
    id?: true
    issuedById?: true
  }

  export type CertificateSumAggregateInputType = {
    id?: true
    issuedById?: true
  }

  export type CertificateMinAggregateInputType = {
    id?: true
    childId?: true
    issuedById?: true
    issuedAt?: true
    token?: true
    pdfPath?: true
  }

  export type CertificateMaxAggregateInputType = {
    id?: true
    childId?: true
    issuedById?: true
    issuedAt?: true
    token?: true
    pdfPath?: true
  }

  export type CertificateCountAggregateInputType = {
    id?: true
    childId?: true
    issuedById?: true
    issuedAt?: true
    token?: true
    pdfPath?: true
    _all?: true
  }

  export type CertificateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Certificate to aggregate.
     */
    where?: CertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certificates to fetch.
     */
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Certificates
    **/
    _count?: true | CertificateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CertificateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CertificateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CertificateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CertificateMaxAggregateInputType
  }

  export type GetCertificateAggregateType<T extends CertificateAggregateArgs> = {
        [P in keyof T & keyof AggregateCertificate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCertificate[P]>
      : GetScalarType<T[P], AggregateCertificate[P]>
  }




  export type CertificateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CertificateWhereInput
    orderBy?: CertificateOrderByWithAggregationInput | CertificateOrderByWithAggregationInput[]
    by: CertificateScalarFieldEnum[] | CertificateScalarFieldEnum
    having?: CertificateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CertificateCountAggregateInputType | true
    _avg?: CertificateAvgAggregateInputType
    _sum?: CertificateSumAggregateInputType
    _min?: CertificateMinAggregateInputType
    _max?: CertificateMaxAggregateInputType
  }

  export type CertificateGroupByOutputType = {
    id: number
    childId: string
    issuedById: number
    issuedAt: Date
    token: string
    pdfPath: string | null
    _count: CertificateCountAggregateOutputType | null
    _avg: CertificateAvgAggregateOutputType | null
    _sum: CertificateSumAggregateOutputType | null
    _min: CertificateMinAggregateOutputType | null
    _max: CertificateMaxAggregateOutputType | null
  }

  type GetCertificateGroupByPayload<T extends CertificateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CertificateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CertificateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CertificateGroupByOutputType[P]>
            : GetScalarType<T[P], CertificateGroupByOutputType[P]>
        }
      >
    >


  export type CertificateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    childId?: boolean
    issuedById?: boolean
    issuedAt?: boolean
    token?: boolean
    pdfPath?: boolean
  }, ExtArgs["result"]["certificate"]>

  export type CertificateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    childId?: boolean
    issuedById?: boolean
    issuedAt?: boolean
    token?: boolean
    pdfPath?: boolean
  }, ExtArgs["result"]["certificate"]>

  export type CertificateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    childId?: boolean
    issuedById?: boolean
    issuedAt?: boolean
    token?: boolean
    pdfPath?: boolean
  }, ExtArgs["result"]["certificate"]>

  export type CertificateSelectScalar = {
    id?: boolean
    childId?: boolean
    issuedById?: boolean
    issuedAt?: boolean
    token?: boolean
    pdfPath?: boolean
  }

  export type CertificateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "childId" | "issuedById" | "issuedAt" | "token" | "pdfPath", ExtArgs["result"]["certificate"]>

  export type $CertificatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Certificate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      childId: string
      issuedById: number
      issuedAt: Date
      token: string
      pdfPath: string | null
    }, ExtArgs["result"]["certificate"]>
    composites: {}
  }

  type CertificateGetPayload<S extends boolean | null | undefined | CertificateDefaultArgs> = $Result.GetResult<Prisma.$CertificatePayload, S>

  type CertificateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CertificateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CertificateCountAggregateInputType | true
    }

  export interface CertificateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Certificate'], meta: { name: 'Certificate' } }
    /**
     * Find zero or one Certificate that matches the filter.
     * @param {CertificateFindUniqueArgs} args - Arguments to find a Certificate
     * @example
     * // Get one Certificate
     * const certificate = await prisma.certificate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CertificateFindUniqueArgs>(args: SelectSubset<T, CertificateFindUniqueArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Certificate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CertificateFindUniqueOrThrowArgs} args - Arguments to find a Certificate
     * @example
     * // Get one Certificate
     * const certificate = await prisma.certificate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CertificateFindUniqueOrThrowArgs>(args: SelectSubset<T, CertificateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Certificate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateFindFirstArgs} args - Arguments to find a Certificate
     * @example
     * // Get one Certificate
     * const certificate = await prisma.certificate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CertificateFindFirstArgs>(args?: SelectSubset<T, CertificateFindFirstArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Certificate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateFindFirstOrThrowArgs} args - Arguments to find a Certificate
     * @example
     * // Get one Certificate
     * const certificate = await prisma.certificate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CertificateFindFirstOrThrowArgs>(args?: SelectSubset<T, CertificateFindFirstOrThrowArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Certificates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Certificates
     * const certificates = await prisma.certificate.findMany()
     * 
     * // Get first 10 Certificates
     * const certificates = await prisma.certificate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const certificateWithIdOnly = await prisma.certificate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CertificateFindManyArgs>(args?: SelectSubset<T, CertificateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Certificate.
     * @param {CertificateCreateArgs} args - Arguments to create a Certificate.
     * @example
     * // Create one Certificate
     * const Certificate = await prisma.certificate.create({
     *   data: {
     *     // ... data to create a Certificate
     *   }
     * })
     * 
     */
    create<T extends CertificateCreateArgs>(args: SelectSubset<T, CertificateCreateArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Certificates.
     * @param {CertificateCreateManyArgs} args - Arguments to create many Certificates.
     * @example
     * // Create many Certificates
     * const certificate = await prisma.certificate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CertificateCreateManyArgs>(args?: SelectSubset<T, CertificateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Certificates and returns the data saved in the database.
     * @param {CertificateCreateManyAndReturnArgs} args - Arguments to create many Certificates.
     * @example
     * // Create many Certificates
     * const certificate = await prisma.certificate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Certificates and only return the `id`
     * const certificateWithIdOnly = await prisma.certificate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CertificateCreateManyAndReturnArgs>(args?: SelectSubset<T, CertificateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Certificate.
     * @param {CertificateDeleteArgs} args - Arguments to delete one Certificate.
     * @example
     * // Delete one Certificate
     * const Certificate = await prisma.certificate.delete({
     *   where: {
     *     // ... filter to delete one Certificate
     *   }
     * })
     * 
     */
    delete<T extends CertificateDeleteArgs>(args: SelectSubset<T, CertificateDeleteArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Certificate.
     * @param {CertificateUpdateArgs} args - Arguments to update one Certificate.
     * @example
     * // Update one Certificate
     * const certificate = await prisma.certificate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CertificateUpdateArgs>(args: SelectSubset<T, CertificateUpdateArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Certificates.
     * @param {CertificateDeleteManyArgs} args - Arguments to filter Certificates to delete.
     * @example
     * // Delete a few Certificates
     * const { count } = await prisma.certificate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CertificateDeleteManyArgs>(args?: SelectSubset<T, CertificateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Certificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Certificates
     * const certificate = await prisma.certificate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CertificateUpdateManyArgs>(args: SelectSubset<T, CertificateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Certificates and returns the data updated in the database.
     * @param {CertificateUpdateManyAndReturnArgs} args - Arguments to update many Certificates.
     * @example
     * // Update many Certificates
     * const certificate = await prisma.certificate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Certificates and only return the `id`
     * const certificateWithIdOnly = await prisma.certificate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CertificateUpdateManyAndReturnArgs>(args: SelectSubset<T, CertificateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Certificate.
     * @param {CertificateUpsertArgs} args - Arguments to update or create a Certificate.
     * @example
     * // Update or create a Certificate
     * const certificate = await prisma.certificate.upsert({
     *   create: {
     *     // ... data to create a Certificate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Certificate we want to update
     *   }
     * })
     */
    upsert<T extends CertificateUpsertArgs>(args: SelectSubset<T, CertificateUpsertArgs<ExtArgs>>): Prisma__CertificateClient<$Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Certificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateCountArgs} args - Arguments to filter Certificates to count.
     * @example
     * // Count the number of Certificates
     * const count = await prisma.certificate.count({
     *   where: {
     *     // ... the filter for the Certificates we want to count
     *   }
     * })
    **/
    count<T extends CertificateCountArgs>(
      args?: Subset<T, CertificateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CertificateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Certificate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CertificateAggregateArgs>(args: Subset<T, CertificateAggregateArgs>): Prisma.PrismaPromise<GetCertificateAggregateType<T>>

    /**
     * Group by Certificate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CertificateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CertificateGroupByArgs['orderBy'] }
        : { orderBy?: CertificateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CertificateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCertificateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Certificate model
   */
  readonly fields: CertificateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Certificate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CertificateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Certificate model
   */
  interface CertificateFieldRefs {
    readonly id: FieldRef<"Certificate", 'Int'>
    readonly childId: FieldRef<"Certificate", 'String'>
    readonly issuedById: FieldRef<"Certificate", 'Int'>
    readonly issuedAt: FieldRef<"Certificate", 'DateTime'>
    readonly token: FieldRef<"Certificate", 'String'>
    readonly pdfPath: FieldRef<"Certificate", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Certificate findUnique
   */
  export type CertificateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Filter, which Certificate to fetch.
     */
    where: CertificateWhereUniqueInput
  }

  /**
   * Certificate findUniqueOrThrow
   */
  export type CertificateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Filter, which Certificate to fetch.
     */
    where: CertificateWhereUniqueInput
  }

  /**
   * Certificate findFirst
   */
  export type CertificateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Filter, which Certificate to fetch.
     */
    where?: CertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certificates to fetch.
     */
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Certificates.
     */
    cursor?: CertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Certificates.
     */
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * Certificate findFirstOrThrow
   */
  export type CertificateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Filter, which Certificate to fetch.
     */
    where?: CertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certificates to fetch.
     */
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Certificates.
     */
    cursor?: CertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Certificates.
     */
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * Certificate findMany
   */
  export type CertificateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Filter, which Certificates to fetch.
     */
    where?: CertificateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certificates to fetch.
     */
    orderBy?: CertificateOrderByWithRelationInput | CertificateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Certificates.
     */
    cursor?: CertificateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certificates.
     */
    skip?: number
    distinct?: CertificateScalarFieldEnum | CertificateScalarFieldEnum[]
  }

  /**
   * Certificate create
   */
  export type CertificateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * The data needed to create a Certificate.
     */
    data: XOR<CertificateCreateInput, CertificateUncheckedCreateInput>
  }

  /**
   * Certificate createMany
   */
  export type CertificateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Certificates.
     */
    data: CertificateCreateManyInput | CertificateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Certificate createManyAndReturn
   */
  export type CertificateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * The data used to create many Certificates.
     */
    data: CertificateCreateManyInput | CertificateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Certificate update
   */
  export type CertificateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * The data needed to update a Certificate.
     */
    data: XOR<CertificateUpdateInput, CertificateUncheckedUpdateInput>
    /**
     * Choose, which Certificate to update.
     */
    where: CertificateWhereUniqueInput
  }

  /**
   * Certificate updateMany
   */
  export type CertificateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Certificates.
     */
    data: XOR<CertificateUpdateManyMutationInput, CertificateUncheckedUpdateManyInput>
    /**
     * Filter which Certificates to update
     */
    where?: CertificateWhereInput
    /**
     * Limit how many Certificates to update.
     */
    limit?: number
  }

  /**
   * Certificate updateManyAndReturn
   */
  export type CertificateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * The data used to update Certificates.
     */
    data: XOR<CertificateUpdateManyMutationInput, CertificateUncheckedUpdateManyInput>
    /**
     * Filter which Certificates to update
     */
    where?: CertificateWhereInput
    /**
     * Limit how many Certificates to update.
     */
    limit?: number
  }

  /**
   * Certificate upsert
   */
  export type CertificateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * The filter to search for the Certificate to update in case it exists.
     */
    where: CertificateWhereUniqueInput
    /**
     * In case the Certificate found by the `where` argument doesn't exist, create a new Certificate with this data.
     */
    create: XOR<CertificateCreateInput, CertificateUncheckedCreateInput>
    /**
     * In case the Certificate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CertificateUpdateInput, CertificateUncheckedUpdateInput>
  }

  /**
   * Certificate delete
   */
  export type CertificateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
    /**
     * Filter which Certificate to delete.
     */
    where: CertificateWhereUniqueInput
  }

  /**
   * Certificate deleteMany
   */
  export type CertificateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Certificates to delete
     */
    where?: CertificateWhereInput
    /**
     * Limit how many Certificates to delete.
     */
    limit?: number
  }

  /**
   * Certificate without action
   */
  export type CertificateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certificate
     */
    select?: CertificateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certificate
     */
    omit?: CertificateOmit<ExtArgs> | null
  }


  /**
   * Model WeightRecord
   */

  export type AggregateWeightRecord = {
    _count: WeightRecordCountAggregateOutputType | null
    _avg: WeightRecordAvgAggregateOutputType | null
    _sum: WeightRecordSumAggregateOutputType | null
    _min: WeightRecordMinAggregateOutputType | null
    _max: WeightRecordMaxAggregateOutputType | null
  }

  export type WeightRecordAvgAggregateOutputType = {
    weight: number | null
    createdById: number | null
    administeredById: number | null
    wardOfVaccination: number | null
  }

  export type WeightRecordSumAggregateOutputType = {
    weight: number | null
    createdById: number | null
    administeredById: number | null
    wardOfVaccination: number | null
  }

  export type WeightRecordMinAggregateOutputType = {
    id: string | null
    date: Date | null
    weight: number | null
    childId: string | null
    createdById: number | null
    administeredById: number | null
    createdAt: Date | null
    updatedAt: Date | null
    wardOfVaccination: number | null
  }

  export type WeightRecordMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    weight: number | null
    childId: string | null
    createdById: number | null
    administeredById: number | null
    createdAt: Date | null
    updatedAt: Date | null
    wardOfVaccination: number | null
  }

  export type WeightRecordCountAggregateOutputType = {
    id: number
    date: number
    weight: number
    childId: number
    createdById: number
    administeredById: number
    createdAt: number
    updatedAt: number
    wardOfVaccination: number
    _all: number
  }


  export type WeightRecordAvgAggregateInputType = {
    weight?: true
    createdById?: true
    administeredById?: true
    wardOfVaccination?: true
  }

  export type WeightRecordSumAggregateInputType = {
    weight?: true
    createdById?: true
    administeredById?: true
    wardOfVaccination?: true
  }

  export type WeightRecordMinAggregateInputType = {
    id?: true
    date?: true
    weight?: true
    childId?: true
    createdById?: true
    administeredById?: true
    createdAt?: true
    updatedAt?: true
    wardOfVaccination?: true
  }

  export type WeightRecordMaxAggregateInputType = {
    id?: true
    date?: true
    weight?: true
    childId?: true
    createdById?: true
    administeredById?: true
    createdAt?: true
    updatedAt?: true
    wardOfVaccination?: true
  }

  export type WeightRecordCountAggregateInputType = {
    id?: true
    date?: true
    weight?: true
    childId?: true
    createdById?: true
    administeredById?: true
    createdAt?: true
    updatedAt?: true
    wardOfVaccination?: true
    _all?: true
  }

  export type WeightRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeightRecord to aggregate.
     */
    where?: WeightRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeightRecords to fetch.
     */
    orderBy?: WeightRecordOrderByWithRelationInput | WeightRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeightRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeightRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeightRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WeightRecords
    **/
    _count?: true | WeightRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WeightRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WeightRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeightRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeightRecordMaxAggregateInputType
  }

  export type GetWeightRecordAggregateType<T extends WeightRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateWeightRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeightRecord[P]>
      : GetScalarType<T[P], AggregateWeightRecord[P]>
  }




  export type WeightRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeightRecordWhereInput
    orderBy?: WeightRecordOrderByWithAggregationInput | WeightRecordOrderByWithAggregationInput[]
    by: WeightRecordScalarFieldEnum[] | WeightRecordScalarFieldEnum
    having?: WeightRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeightRecordCountAggregateInputType | true
    _avg?: WeightRecordAvgAggregateInputType
    _sum?: WeightRecordSumAggregateInputType
    _min?: WeightRecordMinAggregateInputType
    _max?: WeightRecordMaxAggregateInputType
  }

  export type WeightRecordGroupByOutputType = {
    id: string
    date: Date
    weight: number
    childId: string
    createdById: number
    administeredById: number | null
    createdAt: Date
    updatedAt: Date
    wardOfVaccination: number
    _count: WeightRecordCountAggregateOutputType | null
    _avg: WeightRecordAvgAggregateOutputType | null
    _sum: WeightRecordSumAggregateOutputType | null
    _min: WeightRecordMinAggregateOutputType | null
    _max: WeightRecordMaxAggregateOutputType | null
  }

  type GetWeightRecordGroupByPayload<T extends WeightRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeightRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeightRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeightRecordGroupByOutputType[P]>
            : GetScalarType<T[P], WeightRecordGroupByOutputType[P]>
        }
      >
    >


  export type WeightRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    weight?: boolean
    childId?: boolean
    createdById?: boolean
    administeredById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wardOfVaccination?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | WeightRecord$administeredByArgs<ExtArgs>
  }, ExtArgs["result"]["weightRecord"]>

  export type WeightRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    weight?: boolean
    childId?: boolean
    createdById?: boolean
    administeredById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wardOfVaccination?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | WeightRecord$administeredByArgs<ExtArgs>
  }, ExtArgs["result"]["weightRecord"]>

  export type WeightRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    weight?: boolean
    childId?: boolean
    createdById?: boolean
    administeredById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wardOfVaccination?: boolean
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | WeightRecord$administeredByArgs<ExtArgs>
  }, ExtArgs["result"]["weightRecord"]>

  export type WeightRecordSelectScalar = {
    id?: boolean
    date?: boolean
    weight?: boolean
    childId?: boolean
    createdById?: boolean
    administeredById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    wardOfVaccination?: boolean
  }

  export type WeightRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "weight" | "childId" | "createdById" | "administeredById" | "createdAt" | "updatedAt" | "wardOfVaccination", ExtArgs["result"]["weightRecord"]>
  export type WeightRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | WeightRecord$administeredByArgs<ExtArgs>
  }
  export type WeightRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | WeightRecord$administeredByArgs<ExtArgs>
  }
  export type WeightRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    child?: boolean | ChildDefaultArgs<ExtArgs>
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    administeredBy?: boolean | WeightRecord$administeredByArgs<ExtArgs>
  }

  export type $WeightRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WeightRecord"
    objects: {
      child: Prisma.$ChildPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs>
      administeredBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      weight: number
      childId: string
      createdById: number
      administeredById: number | null
      createdAt: Date
      updatedAt: Date
      wardOfVaccination: number
    }, ExtArgs["result"]["weightRecord"]>
    composites: {}
  }

  type WeightRecordGetPayload<S extends boolean | null | undefined | WeightRecordDefaultArgs> = $Result.GetResult<Prisma.$WeightRecordPayload, S>

  type WeightRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WeightRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WeightRecordCountAggregateInputType | true
    }

  export interface WeightRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WeightRecord'], meta: { name: 'WeightRecord' } }
    /**
     * Find zero or one WeightRecord that matches the filter.
     * @param {WeightRecordFindUniqueArgs} args - Arguments to find a WeightRecord
     * @example
     * // Get one WeightRecord
     * const weightRecord = await prisma.weightRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeightRecordFindUniqueArgs>(args: SelectSubset<T, WeightRecordFindUniqueArgs<ExtArgs>>): Prisma__WeightRecordClient<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WeightRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WeightRecordFindUniqueOrThrowArgs} args - Arguments to find a WeightRecord
     * @example
     * // Get one WeightRecord
     * const weightRecord = await prisma.weightRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeightRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, WeightRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeightRecordClient<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeightRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeightRecordFindFirstArgs} args - Arguments to find a WeightRecord
     * @example
     * // Get one WeightRecord
     * const weightRecord = await prisma.weightRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeightRecordFindFirstArgs>(args?: SelectSubset<T, WeightRecordFindFirstArgs<ExtArgs>>): Prisma__WeightRecordClient<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WeightRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeightRecordFindFirstOrThrowArgs} args - Arguments to find a WeightRecord
     * @example
     * // Get one WeightRecord
     * const weightRecord = await prisma.weightRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeightRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, WeightRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeightRecordClient<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WeightRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeightRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WeightRecords
     * const weightRecords = await prisma.weightRecord.findMany()
     * 
     * // Get first 10 WeightRecords
     * const weightRecords = await prisma.weightRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weightRecordWithIdOnly = await prisma.weightRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeightRecordFindManyArgs>(args?: SelectSubset<T, WeightRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WeightRecord.
     * @param {WeightRecordCreateArgs} args - Arguments to create a WeightRecord.
     * @example
     * // Create one WeightRecord
     * const WeightRecord = await prisma.weightRecord.create({
     *   data: {
     *     // ... data to create a WeightRecord
     *   }
     * })
     * 
     */
    create<T extends WeightRecordCreateArgs>(args: SelectSubset<T, WeightRecordCreateArgs<ExtArgs>>): Prisma__WeightRecordClient<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WeightRecords.
     * @param {WeightRecordCreateManyArgs} args - Arguments to create many WeightRecords.
     * @example
     * // Create many WeightRecords
     * const weightRecord = await prisma.weightRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeightRecordCreateManyArgs>(args?: SelectSubset<T, WeightRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WeightRecords and returns the data saved in the database.
     * @param {WeightRecordCreateManyAndReturnArgs} args - Arguments to create many WeightRecords.
     * @example
     * // Create many WeightRecords
     * const weightRecord = await prisma.weightRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WeightRecords and only return the `id`
     * const weightRecordWithIdOnly = await prisma.weightRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeightRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, WeightRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WeightRecord.
     * @param {WeightRecordDeleteArgs} args - Arguments to delete one WeightRecord.
     * @example
     * // Delete one WeightRecord
     * const WeightRecord = await prisma.weightRecord.delete({
     *   where: {
     *     // ... filter to delete one WeightRecord
     *   }
     * })
     * 
     */
    delete<T extends WeightRecordDeleteArgs>(args: SelectSubset<T, WeightRecordDeleteArgs<ExtArgs>>): Prisma__WeightRecordClient<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WeightRecord.
     * @param {WeightRecordUpdateArgs} args - Arguments to update one WeightRecord.
     * @example
     * // Update one WeightRecord
     * const weightRecord = await prisma.weightRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeightRecordUpdateArgs>(args: SelectSubset<T, WeightRecordUpdateArgs<ExtArgs>>): Prisma__WeightRecordClient<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WeightRecords.
     * @param {WeightRecordDeleteManyArgs} args - Arguments to filter WeightRecords to delete.
     * @example
     * // Delete a few WeightRecords
     * const { count } = await prisma.weightRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeightRecordDeleteManyArgs>(args?: SelectSubset<T, WeightRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeightRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeightRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WeightRecords
     * const weightRecord = await prisma.weightRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeightRecordUpdateManyArgs>(args: SelectSubset<T, WeightRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeightRecords and returns the data updated in the database.
     * @param {WeightRecordUpdateManyAndReturnArgs} args - Arguments to update many WeightRecords.
     * @example
     * // Update many WeightRecords
     * const weightRecord = await prisma.weightRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WeightRecords and only return the `id`
     * const weightRecordWithIdOnly = await prisma.weightRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WeightRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, WeightRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WeightRecord.
     * @param {WeightRecordUpsertArgs} args - Arguments to update or create a WeightRecord.
     * @example
     * // Update or create a WeightRecord
     * const weightRecord = await prisma.weightRecord.upsert({
     *   create: {
     *     // ... data to create a WeightRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WeightRecord we want to update
     *   }
     * })
     */
    upsert<T extends WeightRecordUpsertArgs>(args: SelectSubset<T, WeightRecordUpsertArgs<ExtArgs>>): Prisma__WeightRecordClient<$Result.GetResult<Prisma.$WeightRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WeightRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeightRecordCountArgs} args - Arguments to filter WeightRecords to count.
     * @example
     * // Count the number of WeightRecords
     * const count = await prisma.weightRecord.count({
     *   where: {
     *     // ... the filter for the WeightRecords we want to count
     *   }
     * })
    **/
    count<T extends WeightRecordCountArgs>(
      args?: Subset<T, WeightRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeightRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WeightRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeightRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WeightRecordAggregateArgs>(args: Subset<T, WeightRecordAggregateArgs>): Prisma.PrismaPromise<GetWeightRecordAggregateType<T>>

    /**
     * Group by WeightRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeightRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WeightRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeightRecordGroupByArgs['orderBy'] }
        : { orderBy?: WeightRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WeightRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeightRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WeightRecord model
   */
  readonly fields: WeightRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WeightRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeightRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    child<T extends ChildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChildDefaultArgs<ExtArgs>>): Prisma__ChildClient<$Result.GetResult<Prisma.$ChildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    administeredBy<T extends WeightRecord$administeredByArgs<ExtArgs> = {}>(args?: Subset<T, WeightRecord$administeredByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WeightRecord model
   */
  interface WeightRecordFieldRefs {
    readonly id: FieldRef<"WeightRecord", 'String'>
    readonly date: FieldRef<"WeightRecord", 'DateTime'>
    readonly weight: FieldRef<"WeightRecord", 'Float'>
    readonly childId: FieldRef<"WeightRecord", 'String'>
    readonly createdById: FieldRef<"WeightRecord", 'Int'>
    readonly administeredById: FieldRef<"WeightRecord", 'Int'>
    readonly createdAt: FieldRef<"WeightRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"WeightRecord", 'DateTime'>
    readonly wardOfVaccination: FieldRef<"WeightRecord", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * WeightRecord findUnique
   */
  export type WeightRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * Filter, which WeightRecord to fetch.
     */
    where: WeightRecordWhereUniqueInput
  }

  /**
   * WeightRecord findUniqueOrThrow
   */
  export type WeightRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * Filter, which WeightRecord to fetch.
     */
    where: WeightRecordWhereUniqueInput
  }

  /**
   * WeightRecord findFirst
   */
  export type WeightRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * Filter, which WeightRecord to fetch.
     */
    where?: WeightRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeightRecords to fetch.
     */
    orderBy?: WeightRecordOrderByWithRelationInput | WeightRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeightRecords.
     */
    cursor?: WeightRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeightRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeightRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeightRecords.
     */
    distinct?: WeightRecordScalarFieldEnum | WeightRecordScalarFieldEnum[]
  }

  /**
   * WeightRecord findFirstOrThrow
   */
  export type WeightRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * Filter, which WeightRecord to fetch.
     */
    where?: WeightRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeightRecords to fetch.
     */
    orderBy?: WeightRecordOrderByWithRelationInput | WeightRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeightRecords.
     */
    cursor?: WeightRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeightRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeightRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeightRecords.
     */
    distinct?: WeightRecordScalarFieldEnum | WeightRecordScalarFieldEnum[]
  }

  /**
   * WeightRecord findMany
   */
  export type WeightRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * Filter, which WeightRecords to fetch.
     */
    where?: WeightRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeightRecords to fetch.
     */
    orderBy?: WeightRecordOrderByWithRelationInput | WeightRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WeightRecords.
     */
    cursor?: WeightRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeightRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeightRecords.
     */
    skip?: number
    distinct?: WeightRecordScalarFieldEnum | WeightRecordScalarFieldEnum[]
  }

  /**
   * WeightRecord create
   */
  export type WeightRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a WeightRecord.
     */
    data: XOR<WeightRecordCreateInput, WeightRecordUncheckedCreateInput>
  }

  /**
   * WeightRecord createMany
   */
  export type WeightRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WeightRecords.
     */
    data: WeightRecordCreateManyInput | WeightRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeightRecord createManyAndReturn
   */
  export type WeightRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * The data used to create many WeightRecords.
     */
    data: WeightRecordCreateManyInput | WeightRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeightRecord update
   */
  export type WeightRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a WeightRecord.
     */
    data: XOR<WeightRecordUpdateInput, WeightRecordUncheckedUpdateInput>
    /**
     * Choose, which WeightRecord to update.
     */
    where: WeightRecordWhereUniqueInput
  }

  /**
   * WeightRecord updateMany
   */
  export type WeightRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WeightRecords.
     */
    data: XOR<WeightRecordUpdateManyMutationInput, WeightRecordUncheckedUpdateManyInput>
    /**
     * Filter which WeightRecords to update
     */
    where?: WeightRecordWhereInput
    /**
     * Limit how many WeightRecords to update.
     */
    limit?: number
  }

  /**
   * WeightRecord updateManyAndReturn
   */
  export type WeightRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * The data used to update WeightRecords.
     */
    data: XOR<WeightRecordUpdateManyMutationInput, WeightRecordUncheckedUpdateManyInput>
    /**
     * Filter which WeightRecords to update
     */
    where?: WeightRecordWhereInput
    /**
     * Limit how many WeightRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WeightRecord upsert
   */
  export type WeightRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the WeightRecord to update in case it exists.
     */
    where: WeightRecordWhereUniqueInput
    /**
     * In case the WeightRecord found by the `where` argument doesn't exist, create a new WeightRecord with this data.
     */
    create: XOR<WeightRecordCreateInput, WeightRecordUncheckedCreateInput>
    /**
     * In case the WeightRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeightRecordUpdateInput, WeightRecordUncheckedUpdateInput>
  }

  /**
   * WeightRecord delete
   */
  export type WeightRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
    /**
     * Filter which WeightRecord to delete.
     */
    where: WeightRecordWhereUniqueInput
  }

  /**
   * WeightRecord deleteMany
   */
  export type WeightRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeightRecords to delete
     */
    where?: WeightRecordWhereInput
    /**
     * Limit how many WeightRecords to delete.
     */
    limit?: number
  }

  /**
   * WeightRecord.administeredBy
   */
  export type WeightRecord$administeredByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * WeightRecord without action
   */
  export type WeightRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeightRecord
     */
    select?: WeightRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WeightRecord
     */
    omit?: WeightRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WeightRecordInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    wardId: 'wardId',
    status: 'status'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    token: 'token',
    userId: 'userId',
    device: 'device',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const ChildScalarFieldEnum: {
    id: 'id',
    sewaDartaNumber: 'sewaDartaNumber',
    fullName: 'fullName',
    wardNumber: 'wardNumber',
    casteCode: 'casteCode',
    gender: 'gender',
    parentName: 'parentName',
    tole: 'tole',
    phoneNumber: 'phoneNumber',
    birthDate: 'birthDate',
    purnaKhop: 'purnaKhop',
    remarks: 'remarks',
    createdById: 'createdById',
    verifiedById: 'verifiedById',
    createdAt: 'createdAt',
    isFromOtherMunicipality: 'isFromOtherMunicipality'
  };

  export type ChildScalarFieldEnum = (typeof ChildScalarFieldEnum)[keyof typeof ChildScalarFieldEnum]


  export const MotherScalarFieldEnum: {
    id: 'id',
    sewaDartaNumber: 'sewaDartaNumber',
    name: 'name',
    casteCode: 'casteCode',
    age: 'age',
    phoneNumber: 'phoneNumber',
    tole: 'tole',
    wardNumber: 'wardNumber',
    pregnancyCount: 'pregnancyCount',
    previousTDTakenCount: 'previousTDTakenCount',
    remarks: 'remarks',
    createdAt: 'createdAt',
    createdById: 'createdById',
    isFromOtherMunicipality: 'isFromOtherMunicipality'
  };

  export type MotherScalarFieldEnum = (typeof MotherScalarFieldEnum)[keyof typeof MotherScalarFieldEnum]


  export const TDDoseScalarFieldEnum: {
    id: 'id',
    doseNumber: 'doseNumber',
    dateGiven: 'dateGiven',
    remarks: 'remarks',
    motherId: 'motherId',
    createdAt: 'createdAt',
    createdById: 'createdById',
    administeredById: 'administeredById'
  };

  export type TDDoseScalarFieldEnum = (typeof TDDoseScalarFieldEnum)[keyof typeof TDDoseScalarFieldEnum]


  export const VaccinationRecordScalarFieldEnum: {
    id: 'id',
    citizenId: 'citizenId',
    vaccineType: 'vaccineType',
    doseNumber: 'doseNumber',
    dateGiven: 'dateGiven',
    isComplete: 'isComplete',
    remarks: 'remarks',
    recommendedAtMonths: 'recommendedAtMonths',
    customVaccineName: 'customVaccineName',
    type: 'type',
    createdById: 'createdById',
    administeredById: 'administeredById',
    createdAt: 'createdAt',
    wardOfVaccination: 'wardOfVaccination'
  };

  export type VaccinationRecordScalarFieldEnum = (typeof VaccinationRecordScalarFieldEnum)[keyof typeof VaccinationRecordScalarFieldEnum]


  export const NotificationLogScalarFieldEnum: {
    id: 'id',
    citizenId: 'citizenId',
    vaccineType: 'vaccineType',
    doseNumber: 'doseNumber',
    sentAt: 'sentAt',
    type: 'type'
  };

  export type NotificationLogScalarFieldEnum = (typeof NotificationLogScalarFieldEnum)[keyof typeof NotificationLogScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    meta: 'meta',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const CorrectionRequestScalarFieldEnum: {
    id: 'id',
    vaccinationId: 'vaccinationId',
    requestedById: 'requestedById',
    reason: 'reason',
    status: 'status',
    createdAt: 'createdAt',
    processedById: 'processedById',
    processedAt: 'processedAt'
  };

  export type CorrectionRequestScalarFieldEnum = (typeof CorrectionRequestScalarFieldEnum)[keyof typeof CorrectionRequestScalarFieldEnum]


  export const CertificateScalarFieldEnum: {
    id: 'id',
    childId: 'childId',
    issuedById: 'issuedById',
    issuedAt: 'issuedAt',
    token: 'token',
    pdfPath: 'pdfPath'
  };

  export type CertificateScalarFieldEnum = (typeof CertificateScalarFieldEnum)[keyof typeof CertificateScalarFieldEnum]


  export const WeightRecordScalarFieldEnum: {
    id: 'id',
    date: 'date',
    weight: 'weight',
    childId: 'childId',
    createdById: 'createdById',
    administeredById: 'administeredById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    wardOfVaccination: 'wardOfVaccination'
  };

  export type WeightRecordScalarFieldEnum = (typeof WeightRecordScalarFieldEnum)[keyof typeof WeightRecordScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'VaccineType'
   */
  export type EnumVaccineTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VaccineType'>
    


  /**
   * Reference to a field of type 'VaccineType[]'
   */
  export type ListEnumVaccineTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VaccineType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    wardId?: IntNullableFilter<"User"> | number | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    Child?: ChildListRelationFilter
    Mother?: MotherListRelationFilter
    createdVaccinationRecords?: VaccinationRecordListRelationFilter
    administeredVaccinations?: VaccinationRecordListRelationFilter
    AuditLogs?: AuditLogListRelationFilter
    createdWeightRecords?: WeightRecordListRelationFilter
    administeredWeightRecords?: WeightRecordListRelationFilter
    verifiedChildren?: ChildListRelationFilter
    createdTDDoses?: TDDoseListRelationFilter
    administeredTDDoses?: TDDoseListRelationFilter
    RefreshTokens?: RefreshTokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    wardId?: SortOrderInput | SortOrder
    status?: SortOrder
    Child?: ChildOrderByRelationAggregateInput
    Mother?: MotherOrderByRelationAggregateInput
    createdVaccinationRecords?: VaccinationRecordOrderByRelationAggregateInput
    administeredVaccinations?: VaccinationRecordOrderByRelationAggregateInput
    AuditLogs?: AuditLogOrderByRelationAggregateInput
    createdWeightRecords?: WeightRecordOrderByRelationAggregateInput
    administeredWeightRecords?: WeightRecordOrderByRelationAggregateInput
    verifiedChildren?: ChildOrderByRelationAggregateInput
    createdTDDoses?: TDDoseOrderByRelationAggregateInput
    administeredTDDoses?: TDDoseOrderByRelationAggregateInput
    RefreshTokens?: RefreshTokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    wardId?: IntNullableFilter<"User"> | number | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    Child?: ChildListRelationFilter
    Mother?: MotherListRelationFilter
    createdVaccinationRecords?: VaccinationRecordListRelationFilter
    administeredVaccinations?: VaccinationRecordListRelationFilter
    AuditLogs?: AuditLogListRelationFilter
    createdWeightRecords?: WeightRecordListRelationFilter
    administeredWeightRecords?: WeightRecordListRelationFilter
    verifiedChildren?: ChildListRelationFilter
    createdTDDoses?: TDDoseListRelationFilter
    administeredTDDoses?: TDDoseListRelationFilter
    RefreshTokens?: RefreshTokenListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    wardId?: SortOrderInput | SortOrder
    status?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    wardId?: IntNullableWithAggregatesFilter<"User"> | number | null
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    token?: StringFilter<"RefreshToken"> | string
    userId?: IntFilter<"RefreshToken"> | number
    device?: StringNullableFilter<"RefreshToken"> | string | null
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    device?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    userId?: IntFilter<"RefreshToken"> | number
    device?: StringNullableFilter<"RefreshToken"> | string | null
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    device?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _avg?: RefreshTokenAvgOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
    _sum?: RefreshTokenSumOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RefreshToken"> | string
    token?: StringWithAggregatesFilter<"RefreshToken"> | string
    userId?: IntWithAggregatesFilter<"RefreshToken"> | number
    device?: StringNullableWithAggregatesFilter<"RefreshToken"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
  }

  export type ChildWhereInput = {
    AND?: ChildWhereInput | ChildWhereInput[]
    OR?: ChildWhereInput[]
    NOT?: ChildWhereInput | ChildWhereInput[]
    id?: StringFilter<"Child"> | string
    sewaDartaNumber?: IntFilter<"Child"> | number
    fullName?: StringFilter<"Child"> | string
    wardNumber?: IntFilter<"Child"> | number
    casteCode?: IntFilter<"Child"> | number
    gender?: StringFilter<"Child"> | string
    parentName?: StringFilter<"Child"> | string
    tole?: StringFilter<"Child"> | string
    phoneNumber?: StringFilter<"Child"> | string
    birthDate?: DateTimeFilter<"Child"> | Date | string
    purnaKhop?: BoolFilter<"Child"> | boolean
    remarks?: StringNullableFilter<"Child"> | string | null
    createdById?: IntFilter<"Child"> | number
    verifiedById?: IntNullableFilter<"Child"> | number | null
    createdAt?: DateTimeFilter<"Child"> | Date | string
    isFromOtherMunicipality?: BoolFilter<"Child"> | boolean
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    verifiedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    vaccinations?: VaccinationRecordListRelationFilter
    NotificationLog?: NotificationLogListRelationFilter
    weightRecords?: WeightRecordListRelationFilter
  }

  export type ChildOrderByWithRelationInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    fullName?: SortOrder
    wardNumber?: SortOrder
    casteCode?: SortOrder
    gender?: SortOrder
    parentName?: SortOrder
    tole?: SortOrder
    phoneNumber?: SortOrder
    birthDate?: SortOrder
    purnaKhop?: SortOrder
    remarks?: SortOrderInput | SortOrder
    createdById?: SortOrder
    verifiedById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    isFromOtherMunicipality?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    verifiedBy?: UserOrderByWithRelationInput
    vaccinations?: VaccinationRecordOrderByRelationAggregateInput
    NotificationLog?: NotificationLogOrderByRelationAggregateInput
    weightRecords?: WeightRecordOrderByRelationAggregateInput
  }

  export type ChildWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sewaDartaNumber?: number
    AND?: ChildWhereInput | ChildWhereInput[]
    OR?: ChildWhereInput[]
    NOT?: ChildWhereInput | ChildWhereInput[]
    fullName?: StringFilter<"Child"> | string
    wardNumber?: IntFilter<"Child"> | number
    casteCode?: IntFilter<"Child"> | number
    gender?: StringFilter<"Child"> | string
    parentName?: StringFilter<"Child"> | string
    tole?: StringFilter<"Child"> | string
    phoneNumber?: StringFilter<"Child"> | string
    birthDate?: DateTimeFilter<"Child"> | Date | string
    purnaKhop?: BoolFilter<"Child"> | boolean
    remarks?: StringNullableFilter<"Child"> | string | null
    createdById?: IntFilter<"Child"> | number
    verifiedById?: IntNullableFilter<"Child"> | number | null
    createdAt?: DateTimeFilter<"Child"> | Date | string
    isFromOtherMunicipality?: BoolFilter<"Child"> | boolean
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    verifiedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    vaccinations?: VaccinationRecordListRelationFilter
    NotificationLog?: NotificationLogListRelationFilter
    weightRecords?: WeightRecordListRelationFilter
  }, "id" | "sewaDartaNumber">

  export type ChildOrderByWithAggregationInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    fullName?: SortOrder
    wardNumber?: SortOrder
    casteCode?: SortOrder
    gender?: SortOrder
    parentName?: SortOrder
    tole?: SortOrder
    phoneNumber?: SortOrder
    birthDate?: SortOrder
    purnaKhop?: SortOrder
    remarks?: SortOrderInput | SortOrder
    createdById?: SortOrder
    verifiedById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    isFromOtherMunicipality?: SortOrder
    _count?: ChildCountOrderByAggregateInput
    _avg?: ChildAvgOrderByAggregateInput
    _max?: ChildMaxOrderByAggregateInput
    _min?: ChildMinOrderByAggregateInput
    _sum?: ChildSumOrderByAggregateInput
  }

  export type ChildScalarWhereWithAggregatesInput = {
    AND?: ChildScalarWhereWithAggregatesInput | ChildScalarWhereWithAggregatesInput[]
    OR?: ChildScalarWhereWithAggregatesInput[]
    NOT?: ChildScalarWhereWithAggregatesInput | ChildScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Child"> | string
    sewaDartaNumber?: IntWithAggregatesFilter<"Child"> | number
    fullName?: StringWithAggregatesFilter<"Child"> | string
    wardNumber?: IntWithAggregatesFilter<"Child"> | number
    casteCode?: IntWithAggregatesFilter<"Child"> | number
    gender?: StringWithAggregatesFilter<"Child"> | string
    parentName?: StringWithAggregatesFilter<"Child"> | string
    tole?: StringWithAggregatesFilter<"Child"> | string
    phoneNumber?: StringWithAggregatesFilter<"Child"> | string
    birthDate?: DateTimeWithAggregatesFilter<"Child"> | Date | string
    purnaKhop?: BoolWithAggregatesFilter<"Child"> | boolean
    remarks?: StringNullableWithAggregatesFilter<"Child"> | string | null
    createdById?: IntWithAggregatesFilter<"Child"> | number
    verifiedById?: IntNullableWithAggregatesFilter<"Child"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Child"> | Date | string
    isFromOtherMunicipality?: BoolWithAggregatesFilter<"Child"> | boolean
  }

  export type MotherWhereInput = {
    AND?: MotherWhereInput | MotherWhereInput[]
    OR?: MotherWhereInput[]
    NOT?: MotherWhereInput | MotherWhereInput[]
    id?: StringFilter<"Mother"> | string
    sewaDartaNumber?: IntFilter<"Mother"> | number
    name?: StringFilter<"Mother"> | string
    casteCode?: IntFilter<"Mother"> | number
    age?: IntFilter<"Mother"> | number
    phoneNumber?: StringFilter<"Mother"> | string
    tole?: StringFilter<"Mother"> | string
    wardNumber?: IntFilter<"Mother"> | number
    pregnancyCount?: IntFilter<"Mother"> | number
    previousTDTakenCount?: IntFilter<"Mother"> | number
    remarks?: StringNullableFilter<"Mother"> | string | null
    createdAt?: DateTimeFilter<"Mother"> | Date | string
    createdById?: IntFilter<"Mother"> | number
    isFromOtherMunicipality?: BoolFilter<"Mother"> | boolean
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    tdDoses?: TDDoseListRelationFilter
  }

  export type MotherOrderByWithRelationInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    name?: SortOrder
    casteCode?: SortOrder
    age?: SortOrder
    phoneNumber?: SortOrder
    tole?: SortOrder
    wardNumber?: SortOrder
    pregnancyCount?: SortOrder
    previousTDTakenCount?: SortOrder
    remarks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    isFromOtherMunicipality?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    tdDoses?: TDDoseOrderByRelationAggregateInput
  }

  export type MotherWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sewaDartaNumber?: number
    AND?: MotherWhereInput | MotherWhereInput[]
    OR?: MotherWhereInput[]
    NOT?: MotherWhereInput | MotherWhereInput[]
    name?: StringFilter<"Mother"> | string
    casteCode?: IntFilter<"Mother"> | number
    age?: IntFilter<"Mother"> | number
    phoneNumber?: StringFilter<"Mother"> | string
    tole?: StringFilter<"Mother"> | string
    wardNumber?: IntFilter<"Mother"> | number
    pregnancyCount?: IntFilter<"Mother"> | number
    previousTDTakenCount?: IntFilter<"Mother"> | number
    remarks?: StringNullableFilter<"Mother"> | string | null
    createdAt?: DateTimeFilter<"Mother"> | Date | string
    createdById?: IntFilter<"Mother"> | number
    isFromOtherMunicipality?: BoolFilter<"Mother"> | boolean
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    tdDoses?: TDDoseListRelationFilter
  }, "id" | "sewaDartaNumber">

  export type MotherOrderByWithAggregationInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    name?: SortOrder
    casteCode?: SortOrder
    age?: SortOrder
    phoneNumber?: SortOrder
    tole?: SortOrder
    wardNumber?: SortOrder
    pregnancyCount?: SortOrder
    previousTDTakenCount?: SortOrder
    remarks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    isFromOtherMunicipality?: SortOrder
    _count?: MotherCountOrderByAggregateInput
    _avg?: MotherAvgOrderByAggregateInput
    _max?: MotherMaxOrderByAggregateInput
    _min?: MotherMinOrderByAggregateInput
    _sum?: MotherSumOrderByAggregateInput
  }

  export type MotherScalarWhereWithAggregatesInput = {
    AND?: MotherScalarWhereWithAggregatesInput | MotherScalarWhereWithAggregatesInput[]
    OR?: MotherScalarWhereWithAggregatesInput[]
    NOT?: MotherScalarWhereWithAggregatesInput | MotherScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Mother"> | string
    sewaDartaNumber?: IntWithAggregatesFilter<"Mother"> | number
    name?: StringWithAggregatesFilter<"Mother"> | string
    casteCode?: IntWithAggregatesFilter<"Mother"> | number
    age?: IntWithAggregatesFilter<"Mother"> | number
    phoneNumber?: StringWithAggregatesFilter<"Mother"> | string
    tole?: StringWithAggregatesFilter<"Mother"> | string
    wardNumber?: IntWithAggregatesFilter<"Mother"> | number
    pregnancyCount?: IntWithAggregatesFilter<"Mother"> | number
    previousTDTakenCount?: IntWithAggregatesFilter<"Mother"> | number
    remarks?: StringNullableWithAggregatesFilter<"Mother"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Mother"> | Date | string
    createdById?: IntWithAggregatesFilter<"Mother"> | number
    isFromOtherMunicipality?: BoolWithAggregatesFilter<"Mother"> | boolean
  }

  export type TDDoseWhereInput = {
    AND?: TDDoseWhereInput | TDDoseWhereInput[]
    OR?: TDDoseWhereInput[]
    NOT?: TDDoseWhereInput | TDDoseWhereInput[]
    id?: StringFilter<"TDDose"> | string
    doseNumber?: IntFilter<"TDDose"> | number
    dateGiven?: DateTimeFilter<"TDDose"> | Date | string
    remarks?: StringNullableFilter<"TDDose"> | string | null
    motherId?: StringFilter<"TDDose"> | string
    createdAt?: DateTimeFilter<"TDDose"> | Date | string
    createdById?: IntFilter<"TDDose"> | number
    administeredById?: IntFilter<"TDDose"> | number
    mother?: XOR<MotherScalarRelationFilter, MotherWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    administeredBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TDDoseOrderByWithRelationInput = {
    id?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    remarks?: SortOrderInput | SortOrder
    motherId?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    mother?: MotherOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
    administeredBy?: UserOrderByWithRelationInput
  }

  export type TDDoseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TDDoseWhereInput | TDDoseWhereInput[]
    OR?: TDDoseWhereInput[]
    NOT?: TDDoseWhereInput | TDDoseWhereInput[]
    doseNumber?: IntFilter<"TDDose"> | number
    dateGiven?: DateTimeFilter<"TDDose"> | Date | string
    remarks?: StringNullableFilter<"TDDose"> | string | null
    motherId?: StringFilter<"TDDose"> | string
    createdAt?: DateTimeFilter<"TDDose"> | Date | string
    createdById?: IntFilter<"TDDose"> | number
    administeredById?: IntFilter<"TDDose"> | number
    mother?: XOR<MotherScalarRelationFilter, MotherWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    administeredBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type TDDoseOrderByWithAggregationInput = {
    id?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    remarks?: SortOrderInput | SortOrder
    motherId?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    _count?: TDDoseCountOrderByAggregateInput
    _avg?: TDDoseAvgOrderByAggregateInput
    _max?: TDDoseMaxOrderByAggregateInput
    _min?: TDDoseMinOrderByAggregateInput
    _sum?: TDDoseSumOrderByAggregateInput
  }

  export type TDDoseScalarWhereWithAggregatesInput = {
    AND?: TDDoseScalarWhereWithAggregatesInput | TDDoseScalarWhereWithAggregatesInput[]
    OR?: TDDoseScalarWhereWithAggregatesInput[]
    NOT?: TDDoseScalarWhereWithAggregatesInput | TDDoseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TDDose"> | string
    doseNumber?: IntWithAggregatesFilter<"TDDose"> | number
    dateGiven?: DateTimeWithAggregatesFilter<"TDDose"> | Date | string
    remarks?: StringNullableWithAggregatesFilter<"TDDose"> | string | null
    motherId?: StringWithAggregatesFilter<"TDDose"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TDDose"> | Date | string
    createdById?: IntWithAggregatesFilter<"TDDose"> | number
    administeredById?: IntWithAggregatesFilter<"TDDose"> | number
  }

  export type VaccinationRecordWhereInput = {
    AND?: VaccinationRecordWhereInput | VaccinationRecordWhereInput[]
    OR?: VaccinationRecordWhereInput[]
    NOT?: VaccinationRecordWhereInput | VaccinationRecordWhereInput[]
    id?: StringFilter<"VaccinationRecord"> | string
    citizenId?: StringFilter<"VaccinationRecord"> | string
    vaccineType?: EnumVaccineTypeFilter<"VaccinationRecord"> | $Enums.VaccineType
    doseNumber?: IntFilter<"VaccinationRecord"> | number
    dateGiven?: DateTimeFilter<"VaccinationRecord"> | Date | string
    isComplete?: BoolFilter<"VaccinationRecord"> | boolean
    remarks?: StringNullableFilter<"VaccinationRecord"> | string | null
    recommendedAtMonths?: IntFilter<"VaccinationRecord"> | number
    customVaccineName?: StringNullableFilter<"VaccinationRecord"> | string | null
    type?: StringFilter<"VaccinationRecord"> | string
    createdById?: IntFilter<"VaccinationRecord"> | number
    administeredById?: IntNullableFilter<"VaccinationRecord"> | number | null
    createdAt?: DateTimeFilter<"VaccinationRecord"> | Date | string
    wardOfVaccination?: IntFilter<"VaccinationRecord"> | number
    child?: XOR<ChildScalarRelationFilter, ChildWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    administeredBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type VaccinationRecordOrderByWithRelationInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    isComplete?: SortOrder
    remarks?: SortOrderInput | SortOrder
    recommendedAtMonths?: SortOrder
    customVaccineName?: SortOrderInput | SortOrder
    type?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    wardOfVaccination?: SortOrder
    child?: ChildOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
    administeredBy?: UserOrderByWithRelationInput
  }

  export type VaccinationRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VaccinationRecordWhereInput | VaccinationRecordWhereInput[]
    OR?: VaccinationRecordWhereInput[]
    NOT?: VaccinationRecordWhereInput | VaccinationRecordWhereInput[]
    citizenId?: StringFilter<"VaccinationRecord"> | string
    vaccineType?: EnumVaccineTypeFilter<"VaccinationRecord"> | $Enums.VaccineType
    doseNumber?: IntFilter<"VaccinationRecord"> | number
    dateGiven?: DateTimeFilter<"VaccinationRecord"> | Date | string
    isComplete?: BoolFilter<"VaccinationRecord"> | boolean
    remarks?: StringNullableFilter<"VaccinationRecord"> | string | null
    recommendedAtMonths?: IntFilter<"VaccinationRecord"> | number
    customVaccineName?: StringNullableFilter<"VaccinationRecord"> | string | null
    type?: StringFilter<"VaccinationRecord"> | string
    createdById?: IntFilter<"VaccinationRecord"> | number
    administeredById?: IntNullableFilter<"VaccinationRecord"> | number | null
    createdAt?: DateTimeFilter<"VaccinationRecord"> | Date | string
    wardOfVaccination?: IntFilter<"VaccinationRecord"> | number
    child?: XOR<ChildScalarRelationFilter, ChildWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    administeredBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type VaccinationRecordOrderByWithAggregationInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    isComplete?: SortOrder
    remarks?: SortOrderInput | SortOrder
    recommendedAtMonths?: SortOrder
    customVaccineName?: SortOrderInput | SortOrder
    type?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    wardOfVaccination?: SortOrder
    _count?: VaccinationRecordCountOrderByAggregateInput
    _avg?: VaccinationRecordAvgOrderByAggregateInput
    _max?: VaccinationRecordMaxOrderByAggregateInput
    _min?: VaccinationRecordMinOrderByAggregateInput
    _sum?: VaccinationRecordSumOrderByAggregateInput
  }

  export type VaccinationRecordScalarWhereWithAggregatesInput = {
    AND?: VaccinationRecordScalarWhereWithAggregatesInput | VaccinationRecordScalarWhereWithAggregatesInput[]
    OR?: VaccinationRecordScalarWhereWithAggregatesInput[]
    NOT?: VaccinationRecordScalarWhereWithAggregatesInput | VaccinationRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VaccinationRecord"> | string
    citizenId?: StringWithAggregatesFilter<"VaccinationRecord"> | string
    vaccineType?: EnumVaccineTypeWithAggregatesFilter<"VaccinationRecord"> | $Enums.VaccineType
    doseNumber?: IntWithAggregatesFilter<"VaccinationRecord"> | number
    dateGiven?: DateTimeWithAggregatesFilter<"VaccinationRecord"> | Date | string
    isComplete?: BoolWithAggregatesFilter<"VaccinationRecord"> | boolean
    remarks?: StringNullableWithAggregatesFilter<"VaccinationRecord"> | string | null
    recommendedAtMonths?: IntWithAggregatesFilter<"VaccinationRecord"> | number
    customVaccineName?: StringNullableWithAggregatesFilter<"VaccinationRecord"> | string | null
    type?: StringWithAggregatesFilter<"VaccinationRecord"> | string
    createdById?: IntWithAggregatesFilter<"VaccinationRecord"> | number
    administeredById?: IntNullableWithAggregatesFilter<"VaccinationRecord"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"VaccinationRecord"> | Date | string
    wardOfVaccination?: IntWithAggregatesFilter<"VaccinationRecord"> | number
  }

  export type NotificationLogWhereInput = {
    AND?: NotificationLogWhereInput | NotificationLogWhereInput[]
    OR?: NotificationLogWhereInput[]
    NOT?: NotificationLogWhereInput | NotificationLogWhereInput[]
    id?: IntFilter<"NotificationLog"> | number
    citizenId?: StringFilter<"NotificationLog"> | string
    vaccineType?: EnumVaccineTypeFilter<"NotificationLog"> | $Enums.VaccineType
    doseNumber?: IntFilter<"NotificationLog"> | number
    sentAt?: DateTimeFilter<"NotificationLog"> | Date | string
    type?: StringFilter<"NotificationLog"> | string
    child?: XOR<ChildScalarRelationFilter, ChildWhereInput>
  }

  export type NotificationLogOrderByWithRelationInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    sentAt?: SortOrder
    type?: SortOrder
    child?: ChildOrderByWithRelationInput
  }

  export type NotificationLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NotificationLogWhereInput | NotificationLogWhereInput[]
    OR?: NotificationLogWhereInput[]
    NOT?: NotificationLogWhereInput | NotificationLogWhereInput[]
    citizenId?: StringFilter<"NotificationLog"> | string
    vaccineType?: EnumVaccineTypeFilter<"NotificationLog"> | $Enums.VaccineType
    doseNumber?: IntFilter<"NotificationLog"> | number
    sentAt?: DateTimeFilter<"NotificationLog"> | Date | string
    type?: StringFilter<"NotificationLog"> | string
    child?: XOR<ChildScalarRelationFilter, ChildWhereInput>
  }, "id">

  export type NotificationLogOrderByWithAggregationInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    sentAt?: SortOrder
    type?: SortOrder
    _count?: NotificationLogCountOrderByAggregateInput
    _avg?: NotificationLogAvgOrderByAggregateInput
    _max?: NotificationLogMaxOrderByAggregateInput
    _min?: NotificationLogMinOrderByAggregateInput
    _sum?: NotificationLogSumOrderByAggregateInput
  }

  export type NotificationLogScalarWhereWithAggregatesInput = {
    AND?: NotificationLogScalarWhereWithAggregatesInput | NotificationLogScalarWhereWithAggregatesInput[]
    OR?: NotificationLogScalarWhereWithAggregatesInput[]
    NOT?: NotificationLogScalarWhereWithAggregatesInput | NotificationLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"NotificationLog"> | number
    citizenId?: StringWithAggregatesFilter<"NotificationLog"> | string
    vaccineType?: EnumVaccineTypeWithAggregatesFilter<"NotificationLog"> | $Enums.VaccineType
    doseNumber?: IntWithAggregatesFilter<"NotificationLog"> | number
    sentAt?: DateTimeWithAggregatesFilter<"NotificationLog"> | Date | string
    type?: StringWithAggregatesFilter<"NotificationLog"> | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: IntFilter<"AuditLog"> | number
    userId?: IntFilter<"AuditLog"> | number
    action?: StringFilter<"AuditLog"> | string
    meta?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    meta?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: IntFilter<"AuditLog"> | number
    action?: StringFilter<"AuditLog"> | string
    meta?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    meta?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _avg?: AuditLogAvgOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
    _sum?: AuditLogSumOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AuditLog"> | number
    userId?: IntWithAggregatesFilter<"AuditLog"> | number
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    meta?: JsonNullableWithAggregatesFilter<"AuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type CorrectionRequestWhereInput = {
    AND?: CorrectionRequestWhereInput | CorrectionRequestWhereInput[]
    OR?: CorrectionRequestWhereInput[]
    NOT?: CorrectionRequestWhereInput | CorrectionRequestWhereInput[]
    id?: IntFilter<"CorrectionRequest"> | number
    vaccinationId?: StringFilter<"CorrectionRequest"> | string
    requestedById?: IntFilter<"CorrectionRequest"> | number
    reason?: StringFilter<"CorrectionRequest"> | string
    status?: StringFilter<"CorrectionRequest"> | string
    createdAt?: DateTimeFilter<"CorrectionRequest"> | Date | string
    processedById?: IntNullableFilter<"CorrectionRequest"> | number | null
    processedAt?: DateTimeNullableFilter<"CorrectionRequest"> | Date | string | null
  }

  export type CorrectionRequestOrderByWithRelationInput = {
    id?: SortOrder
    vaccinationId?: SortOrder
    requestedById?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    processedById?: SortOrderInput | SortOrder
    processedAt?: SortOrderInput | SortOrder
  }

  export type CorrectionRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CorrectionRequestWhereInput | CorrectionRequestWhereInput[]
    OR?: CorrectionRequestWhereInput[]
    NOT?: CorrectionRequestWhereInput | CorrectionRequestWhereInput[]
    vaccinationId?: StringFilter<"CorrectionRequest"> | string
    requestedById?: IntFilter<"CorrectionRequest"> | number
    reason?: StringFilter<"CorrectionRequest"> | string
    status?: StringFilter<"CorrectionRequest"> | string
    createdAt?: DateTimeFilter<"CorrectionRequest"> | Date | string
    processedById?: IntNullableFilter<"CorrectionRequest"> | number | null
    processedAt?: DateTimeNullableFilter<"CorrectionRequest"> | Date | string | null
  }, "id">

  export type CorrectionRequestOrderByWithAggregationInput = {
    id?: SortOrder
    vaccinationId?: SortOrder
    requestedById?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    processedById?: SortOrderInput | SortOrder
    processedAt?: SortOrderInput | SortOrder
    _count?: CorrectionRequestCountOrderByAggregateInput
    _avg?: CorrectionRequestAvgOrderByAggregateInput
    _max?: CorrectionRequestMaxOrderByAggregateInput
    _min?: CorrectionRequestMinOrderByAggregateInput
    _sum?: CorrectionRequestSumOrderByAggregateInput
  }

  export type CorrectionRequestScalarWhereWithAggregatesInput = {
    AND?: CorrectionRequestScalarWhereWithAggregatesInput | CorrectionRequestScalarWhereWithAggregatesInput[]
    OR?: CorrectionRequestScalarWhereWithAggregatesInput[]
    NOT?: CorrectionRequestScalarWhereWithAggregatesInput | CorrectionRequestScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CorrectionRequest"> | number
    vaccinationId?: StringWithAggregatesFilter<"CorrectionRequest"> | string
    requestedById?: IntWithAggregatesFilter<"CorrectionRequest"> | number
    reason?: StringWithAggregatesFilter<"CorrectionRequest"> | string
    status?: StringWithAggregatesFilter<"CorrectionRequest"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CorrectionRequest"> | Date | string
    processedById?: IntNullableWithAggregatesFilter<"CorrectionRequest"> | number | null
    processedAt?: DateTimeNullableWithAggregatesFilter<"CorrectionRequest"> | Date | string | null
  }

  export type CertificateWhereInput = {
    AND?: CertificateWhereInput | CertificateWhereInput[]
    OR?: CertificateWhereInput[]
    NOT?: CertificateWhereInput | CertificateWhereInput[]
    id?: IntFilter<"Certificate"> | number
    childId?: StringFilter<"Certificate"> | string
    issuedById?: IntFilter<"Certificate"> | number
    issuedAt?: DateTimeFilter<"Certificate"> | Date | string
    token?: StringFilter<"Certificate"> | string
    pdfPath?: StringNullableFilter<"Certificate"> | string | null
  }

  export type CertificateOrderByWithRelationInput = {
    id?: SortOrder
    childId?: SortOrder
    issuedById?: SortOrder
    issuedAt?: SortOrder
    token?: SortOrder
    pdfPath?: SortOrderInput | SortOrder
  }

  export type CertificateWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    token?: string
    AND?: CertificateWhereInput | CertificateWhereInput[]
    OR?: CertificateWhereInput[]
    NOT?: CertificateWhereInput | CertificateWhereInput[]
    childId?: StringFilter<"Certificate"> | string
    issuedById?: IntFilter<"Certificate"> | number
    issuedAt?: DateTimeFilter<"Certificate"> | Date | string
    pdfPath?: StringNullableFilter<"Certificate"> | string | null
  }, "id" | "token">

  export type CertificateOrderByWithAggregationInput = {
    id?: SortOrder
    childId?: SortOrder
    issuedById?: SortOrder
    issuedAt?: SortOrder
    token?: SortOrder
    pdfPath?: SortOrderInput | SortOrder
    _count?: CertificateCountOrderByAggregateInput
    _avg?: CertificateAvgOrderByAggregateInput
    _max?: CertificateMaxOrderByAggregateInput
    _min?: CertificateMinOrderByAggregateInput
    _sum?: CertificateSumOrderByAggregateInput
  }

  export type CertificateScalarWhereWithAggregatesInput = {
    AND?: CertificateScalarWhereWithAggregatesInput | CertificateScalarWhereWithAggregatesInput[]
    OR?: CertificateScalarWhereWithAggregatesInput[]
    NOT?: CertificateScalarWhereWithAggregatesInput | CertificateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Certificate"> | number
    childId?: StringWithAggregatesFilter<"Certificate"> | string
    issuedById?: IntWithAggregatesFilter<"Certificate"> | number
    issuedAt?: DateTimeWithAggregatesFilter<"Certificate"> | Date | string
    token?: StringWithAggregatesFilter<"Certificate"> | string
    pdfPath?: StringNullableWithAggregatesFilter<"Certificate"> | string | null
  }

  export type WeightRecordWhereInput = {
    AND?: WeightRecordWhereInput | WeightRecordWhereInput[]
    OR?: WeightRecordWhereInput[]
    NOT?: WeightRecordWhereInput | WeightRecordWhereInput[]
    id?: StringFilter<"WeightRecord"> | string
    date?: DateTimeFilter<"WeightRecord"> | Date | string
    weight?: FloatFilter<"WeightRecord"> | number
    childId?: StringFilter<"WeightRecord"> | string
    createdById?: IntFilter<"WeightRecord"> | number
    administeredById?: IntNullableFilter<"WeightRecord"> | number | null
    createdAt?: DateTimeFilter<"WeightRecord"> | Date | string
    updatedAt?: DateTimeFilter<"WeightRecord"> | Date | string
    wardOfVaccination?: IntFilter<"WeightRecord"> | number
    child?: XOR<ChildScalarRelationFilter, ChildWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    administeredBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type WeightRecordOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    weight?: SortOrder
    childId?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wardOfVaccination?: SortOrder
    child?: ChildOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
    administeredBy?: UserOrderByWithRelationInput
  }

  export type WeightRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WeightRecordWhereInput | WeightRecordWhereInput[]
    OR?: WeightRecordWhereInput[]
    NOT?: WeightRecordWhereInput | WeightRecordWhereInput[]
    date?: DateTimeFilter<"WeightRecord"> | Date | string
    weight?: FloatFilter<"WeightRecord"> | number
    childId?: StringFilter<"WeightRecord"> | string
    createdById?: IntFilter<"WeightRecord"> | number
    administeredById?: IntNullableFilter<"WeightRecord"> | number | null
    createdAt?: DateTimeFilter<"WeightRecord"> | Date | string
    updatedAt?: DateTimeFilter<"WeightRecord"> | Date | string
    wardOfVaccination?: IntFilter<"WeightRecord"> | number
    child?: XOR<ChildScalarRelationFilter, ChildWhereInput>
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    administeredBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type WeightRecordOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    weight?: SortOrder
    childId?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wardOfVaccination?: SortOrder
    _count?: WeightRecordCountOrderByAggregateInput
    _avg?: WeightRecordAvgOrderByAggregateInput
    _max?: WeightRecordMaxOrderByAggregateInput
    _min?: WeightRecordMinOrderByAggregateInput
    _sum?: WeightRecordSumOrderByAggregateInput
  }

  export type WeightRecordScalarWhereWithAggregatesInput = {
    AND?: WeightRecordScalarWhereWithAggregatesInput | WeightRecordScalarWhereWithAggregatesInput[]
    OR?: WeightRecordScalarWhereWithAggregatesInput[]
    NOT?: WeightRecordScalarWhereWithAggregatesInput | WeightRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WeightRecord"> | string
    date?: DateTimeWithAggregatesFilter<"WeightRecord"> | Date | string
    weight?: FloatWithAggregatesFilter<"WeightRecord"> | number
    childId?: StringWithAggregatesFilter<"WeightRecord"> | string
    createdById?: IntWithAggregatesFilter<"WeightRecord"> | number
    administeredById?: IntNullableWithAggregatesFilter<"WeightRecord"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"WeightRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WeightRecord"> | Date | string
    wardOfVaccination?: IntWithAggregatesFilter<"WeightRecord"> | number
  }

  export type UserCreateInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
  }

  export type UserUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
  }

  export type RefreshTokenCreateInput = {
    id?: string
    token: string
    device?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRefreshTokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    token: string
    userId: number
    device?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    device?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    device?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    token: string
    userId: number
    device?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    device?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    device?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChildCreateInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    createdBy: UserCreateNestedOneWithoutChildInput
    verifiedBy?: UserCreateNestedOneWithoutVerifiedChildrenInput
    vaccinations?: VaccinationRecordCreateNestedManyWithoutChildInput
    NotificationLog?: NotificationLogCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdById: number
    verifiedById?: number | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    vaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutChildInput
    NotificationLog?: NotificationLogUncheckedCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: UserUpdateOneRequiredWithoutChildNestedInput
    verifiedBy?: UserUpdateOneWithoutVerifiedChildrenNestedInput
    vaccinations?: VaccinationRecordUpdateManyWithoutChildNestedInput
    NotificationLog?: NotificationLogUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: IntFieldUpdateOperationsInput | number
    verifiedById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    vaccinations?: VaccinationRecordUncheckedUpdateManyWithoutChildNestedInput
    NotificationLog?: NotificationLogUncheckedUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUncheckedUpdateManyWithoutChildNestedInput
  }

  export type ChildCreateManyInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdById: number
    verifiedById?: number | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
  }

  export type ChildUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ChildUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: IntFieldUpdateOperationsInput | number
    verifiedById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MotherCreateInput = {
    id?: string
    sewaDartaNumber?: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    createdBy: UserCreateNestedOneWithoutMotherInput
    tdDoses?: TDDoseCreateNestedManyWithoutMotherInput
  }

  export type MotherUncheckedCreateInput = {
    id?: string
    sewaDartaNumber?: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks?: string | null
    createdAt?: Date | string
    createdById: number
    isFromOtherMunicipality?: boolean
    tdDoses?: TDDoseUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MotherUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: UserUpdateOneRequiredWithoutMotherNestedInput
    tdDoses?: TDDoseUpdateManyWithoutMotherNestedInput
  }

  export type MotherUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    tdDoses?: TDDoseUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MotherCreateManyInput = {
    id?: string
    sewaDartaNumber?: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks?: string | null
    createdAt?: Date | string
    createdById: number
    isFromOtherMunicipality?: boolean
  }

  export type MotherUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MotherUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TDDoseCreateInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    createdAt?: Date | string
    mother: MotherCreateNestedOneWithoutTdDosesInput
    createdBy: UserCreateNestedOneWithoutCreatedTDDosesInput
    administeredBy: UserCreateNestedOneWithoutAdministeredTDDosesInput
  }

  export type TDDoseUncheckedCreateInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    motherId: string
    createdAt?: Date | string
    createdById: number
    administeredById: number
  }

  export type TDDoseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mother?: MotherUpdateOneRequiredWithoutTdDosesNestedInput
    createdBy?: UserUpdateOneRequiredWithoutCreatedTDDosesNestedInput
    administeredBy?: UserUpdateOneRequiredWithoutAdministeredTDDosesNestedInput
  }

  export type TDDoseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    motherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: IntFieldUpdateOperationsInput | number
  }

  export type TDDoseCreateManyInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    motherId: string
    createdAt?: Date | string
    createdById: number
    administeredById: number
  }

  export type TDDoseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TDDoseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    motherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: IntFieldUpdateOperationsInput | number
  }

  export type VaccinationRecordCreateInput = {
    id?: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdAt?: Date | string
    wardOfVaccination: number
    child: ChildCreateNestedOneWithoutVaccinationsInput
    createdBy: UserCreateNestedOneWithoutCreatedVaccinationRecordsInput
    administeredBy?: UserCreateNestedOneWithoutAdministeredVaccinationsInput
  }

  export type VaccinationRecordUncheckedCreateInput = {
    id?: string
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdById: number
    administeredById?: number | null
    createdAt?: Date | string
    wardOfVaccination: number
  }

  export type VaccinationRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
    child?: ChildUpdateOneRequiredWithoutVaccinationsNestedInput
    createdBy?: UserUpdateOneRequiredWithoutCreatedVaccinationRecordsNestedInput
    administeredBy?: UserUpdateOneWithoutAdministeredVaccinationsNestedInput
  }

  export type VaccinationRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type VaccinationRecordCreateManyInput = {
    id?: string
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdById: number
    administeredById?: number | null
    createdAt?: Date | string
    wardOfVaccination: number
  }

  export type VaccinationRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type VaccinationRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type NotificationLogCreateInput = {
    vaccineType: $Enums.VaccineType
    doseNumber: number
    sentAt?: Date | string
    type: string
    child: ChildCreateNestedOneWithoutNotificationLogInput
  }

  export type NotificationLogUncheckedCreateInput = {
    id?: number
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    sentAt?: Date | string
    type: string
  }

  export type NotificationLogUpdateInput = {
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    child?: ChildUpdateOneRequiredWithoutNotificationLogNestedInput
  }

  export type NotificationLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    citizenId?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationLogCreateManyInput = {
    id?: number
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    sentAt?: Date | string
    type: string
  }

  export type NotificationLogUpdateManyMutationInput = {
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    citizenId?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type AuditLogCreateInput = {
    action: string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: number
    userId: number
    action: string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    action?: StringFieldUpdateOperationsInput | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: number
    userId: number
    action: string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    action?: StringFieldUpdateOperationsInput | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CorrectionRequestCreateInput = {
    vaccinationId: string
    requestedById: number
    reason: string
    status?: string
    createdAt?: Date | string
    processedById?: number | null
    processedAt?: Date | string | null
  }

  export type CorrectionRequestUncheckedCreateInput = {
    id?: number
    vaccinationId: string
    requestedById: number
    reason: string
    status?: string
    createdAt?: Date | string
    processedById?: number | null
    processedAt?: Date | string | null
  }

  export type CorrectionRequestUpdateInput = {
    vaccinationId?: StringFieldUpdateOperationsInput | string
    requestedById?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedById?: NullableIntFieldUpdateOperationsInput | number | null
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CorrectionRequestUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    vaccinationId?: StringFieldUpdateOperationsInput | string
    requestedById?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedById?: NullableIntFieldUpdateOperationsInput | number | null
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CorrectionRequestCreateManyInput = {
    id?: number
    vaccinationId: string
    requestedById: number
    reason: string
    status?: string
    createdAt?: Date | string
    processedById?: number | null
    processedAt?: Date | string | null
  }

  export type CorrectionRequestUpdateManyMutationInput = {
    vaccinationId?: StringFieldUpdateOperationsInput | string
    requestedById?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedById?: NullableIntFieldUpdateOperationsInput | number | null
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CorrectionRequestUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    vaccinationId?: StringFieldUpdateOperationsInput | string
    requestedById?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedById?: NullableIntFieldUpdateOperationsInput | number | null
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CertificateCreateInput = {
    childId: string
    issuedById: number
    issuedAt?: Date | string
    token: string
    pdfPath?: string | null
  }

  export type CertificateUncheckedCreateInput = {
    id?: number
    childId: string
    issuedById: number
    issuedAt?: Date | string
    token: string
    pdfPath?: string | null
  }

  export type CertificateUpdateInput = {
    childId?: StringFieldUpdateOperationsInput | string
    issuedById?: IntFieldUpdateOperationsInput | number
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    pdfPath?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CertificateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    childId?: StringFieldUpdateOperationsInput | string
    issuedById?: IntFieldUpdateOperationsInput | number
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    pdfPath?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CertificateCreateManyInput = {
    id?: number
    childId: string
    issuedById: number
    issuedAt?: Date | string
    token: string
    pdfPath?: string | null
  }

  export type CertificateUpdateManyMutationInput = {
    childId?: StringFieldUpdateOperationsInput | string
    issuedById?: IntFieldUpdateOperationsInput | number
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    pdfPath?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CertificateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    childId?: StringFieldUpdateOperationsInput | string
    issuedById?: IntFieldUpdateOperationsInput | number
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    pdfPath?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WeightRecordCreateInput = {
    id?: string
    date: Date | string
    weight: number
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
    child: ChildCreateNestedOneWithoutWeightRecordsInput
    createdBy: UserCreateNestedOneWithoutCreatedWeightRecordsInput
    administeredBy?: UserCreateNestedOneWithoutAdministeredWeightRecordsInput
  }

  export type WeightRecordUncheckedCreateInput = {
    id?: string
    date: Date | string
    weight: number
    childId: string
    createdById: number
    administeredById?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
  }

  export type WeightRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
    child?: ChildUpdateOneRequiredWithoutWeightRecordsNestedInput
    createdBy?: UserUpdateOneRequiredWithoutCreatedWeightRecordsNestedInput
    administeredBy?: UserUpdateOneWithoutAdministeredWeightRecordsNestedInput
  }

  export type WeightRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    childId?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type WeightRecordCreateManyInput = {
    id?: string
    date: Date | string
    weight: number
    childId: string
    createdById: number
    administeredById?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
  }

  export type WeightRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type WeightRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    childId?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type ChildListRelationFilter = {
    every?: ChildWhereInput
    some?: ChildWhereInput
    none?: ChildWhereInput
  }

  export type MotherListRelationFilter = {
    every?: MotherWhereInput
    some?: MotherWhereInput
    none?: MotherWhereInput
  }

  export type VaccinationRecordListRelationFilter = {
    every?: VaccinationRecordWhereInput
    some?: VaccinationRecordWhereInput
    none?: VaccinationRecordWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type WeightRecordListRelationFilter = {
    every?: WeightRecordWhereInput
    some?: WeightRecordWhereInput
    none?: WeightRecordWhereInput
  }

  export type TDDoseListRelationFilter = {
    every?: TDDoseWhereInput
    some?: TDDoseWhereInput
    none?: TDDoseWhereInput
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ChildOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MotherOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VaccinationRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WeightRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TDDoseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    wardId?: SortOrder
    status?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    wardId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    wardId?: SortOrder
    status?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    wardId?: SortOrder
    status?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    wardId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    device?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    device?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    device?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type NotificationLogListRelationFilter = {
    every?: NotificationLogWhereInput
    some?: NotificationLogWhereInput
    none?: NotificationLogWhereInput
  }

  export type NotificationLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChildCountOrderByAggregateInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    fullName?: SortOrder
    wardNumber?: SortOrder
    casteCode?: SortOrder
    gender?: SortOrder
    parentName?: SortOrder
    tole?: SortOrder
    phoneNumber?: SortOrder
    birthDate?: SortOrder
    purnaKhop?: SortOrder
    remarks?: SortOrder
    createdById?: SortOrder
    verifiedById?: SortOrder
    createdAt?: SortOrder
    isFromOtherMunicipality?: SortOrder
  }

  export type ChildAvgOrderByAggregateInput = {
    sewaDartaNumber?: SortOrder
    wardNumber?: SortOrder
    casteCode?: SortOrder
    createdById?: SortOrder
    verifiedById?: SortOrder
  }

  export type ChildMaxOrderByAggregateInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    fullName?: SortOrder
    wardNumber?: SortOrder
    casteCode?: SortOrder
    gender?: SortOrder
    parentName?: SortOrder
    tole?: SortOrder
    phoneNumber?: SortOrder
    birthDate?: SortOrder
    purnaKhop?: SortOrder
    remarks?: SortOrder
    createdById?: SortOrder
    verifiedById?: SortOrder
    createdAt?: SortOrder
    isFromOtherMunicipality?: SortOrder
  }

  export type ChildMinOrderByAggregateInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    fullName?: SortOrder
    wardNumber?: SortOrder
    casteCode?: SortOrder
    gender?: SortOrder
    parentName?: SortOrder
    tole?: SortOrder
    phoneNumber?: SortOrder
    birthDate?: SortOrder
    purnaKhop?: SortOrder
    remarks?: SortOrder
    createdById?: SortOrder
    verifiedById?: SortOrder
    createdAt?: SortOrder
    isFromOtherMunicipality?: SortOrder
  }

  export type ChildSumOrderByAggregateInput = {
    sewaDartaNumber?: SortOrder
    wardNumber?: SortOrder
    casteCode?: SortOrder
    createdById?: SortOrder
    verifiedById?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type MotherCountOrderByAggregateInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    name?: SortOrder
    casteCode?: SortOrder
    age?: SortOrder
    phoneNumber?: SortOrder
    tole?: SortOrder
    wardNumber?: SortOrder
    pregnancyCount?: SortOrder
    previousTDTakenCount?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    isFromOtherMunicipality?: SortOrder
  }

  export type MotherAvgOrderByAggregateInput = {
    sewaDartaNumber?: SortOrder
    casteCode?: SortOrder
    age?: SortOrder
    wardNumber?: SortOrder
    pregnancyCount?: SortOrder
    previousTDTakenCount?: SortOrder
    createdById?: SortOrder
  }

  export type MotherMaxOrderByAggregateInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    name?: SortOrder
    casteCode?: SortOrder
    age?: SortOrder
    phoneNumber?: SortOrder
    tole?: SortOrder
    wardNumber?: SortOrder
    pregnancyCount?: SortOrder
    previousTDTakenCount?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    isFromOtherMunicipality?: SortOrder
  }

  export type MotherMinOrderByAggregateInput = {
    id?: SortOrder
    sewaDartaNumber?: SortOrder
    name?: SortOrder
    casteCode?: SortOrder
    age?: SortOrder
    phoneNumber?: SortOrder
    tole?: SortOrder
    wardNumber?: SortOrder
    pregnancyCount?: SortOrder
    previousTDTakenCount?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    isFromOtherMunicipality?: SortOrder
  }

  export type MotherSumOrderByAggregateInput = {
    sewaDartaNumber?: SortOrder
    casteCode?: SortOrder
    age?: SortOrder
    wardNumber?: SortOrder
    pregnancyCount?: SortOrder
    previousTDTakenCount?: SortOrder
    createdById?: SortOrder
  }

  export type MotherScalarRelationFilter = {
    is?: MotherWhereInput
    isNot?: MotherWhereInput
  }

  export type TDDoseCountOrderByAggregateInput = {
    id?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    remarks?: SortOrder
    motherId?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
  }

  export type TDDoseAvgOrderByAggregateInput = {
    doseNumber?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
  }

  export type TDDoseMaxOrderByAggregateInput = {
    id?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    remarks?: SortOrder
    motherId?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
  }

  export type TDDoseMinOrderByAggregateInput = {
    id?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    remarks?: SortOrder
    motherId?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
  }

  export type TDDoseSumOrderByAggregateInput = {
    doseNumber?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
  }

  export type EnumVaccineTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.VaccineType | EnumVaccineTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VaccineType[] | ListEnumVaccineTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VaccineType[] | ListEnumVaccineTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVaccineTypeFilter<$PrismaModel> | $Enums.VaccineType
  }

  export type ChildScalarRelationFilter = {
    is?: ChildWhereInput
    isNot?: ChildWhereInput
  }

  export type VaccinationRecordCountOrderByAggregateInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    isComplete?: SortOrder
    remarks?: SortOrder
    recommendedAtMonths?: SortOrder
    customVaccineName?: SortOrder
    type?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    createdAt?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type VaccinationRecordAvgOrderByAggregateInput = {
    doseNumber?: SortOrder
    recommendedAtMonths?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type VaccinationRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    isComplete?: SortOrder
    remarks?: SortOrder
    recommendedAtMonths?: SortOrder
    customVaccineName?: SortOrder
    type?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    createdAt?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type VaccinationRecordMinOrderByAggregateInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    dateGiven?: SortOrder
    isComplete?: SortOrder
    remarks?: SortOrder
    recommendedAtMonths?: SortOrder
    customVaccineName?: SortOrder
    type?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    createdAt?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type VaccinationRecordSumOrderByAggregateInput = {
    doseNumber?: SortOrder
    recommendedAtMonths?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type EnumVaccineTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VaccineType | EnumVaccineTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VaccineType[] | ListEnumVaccineTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VaccineType[] | ListEnumVaccineTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVaccineTypeWithAggregatesFilter<$PrismaModel> | $Enums.VaccineType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVaccineTypeFilter<$PrismaModel>
    _max?: NestedEnumVaccineTypeFilter<$PrismaModel>
  }

  export type NotificationLogCountOrderByAggregateInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    sentAt?: SortOrder
    type?: SortOrder
  }

  export type NotificationLogAvgOrderByAggregateInput = {
    id?: SortOrder
    doseNumber?: SortOrder
  }

  export type NotificationLogMaxOrderByAggregateInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    sentAt?: SortOrder
    type?: SortOrder
  }

  export type NotificationLogMinOrderByAggregateInput = {
    id?: SortOrder
    citizenId?: SortOrder
    vaccineType?: SortOrder
    doseNumber?: SortOrder
    sentAt?: SortOrder
    type?: SortOrder
  }

  export type NotificationLogSumOrderByAggregateInput = {
    id?: SortOrder
    doseNumber?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type CorrectionRequestCountOrderByAggregateInput = {
    id?: SortOrder
    vaccinationId?: SortOrder
    requestedById?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    processedById?: SortOrder
    processedAt?: SortOrder
  }

  export type CorrectionRequestAvgOrderByAggregateInput = {
    id?: SortOrder
    requestedById?: SortOrder
    processedById?: SortOrder
  }

  export type CorrectionRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    vaccinationId?: SortOrder
    requestedById?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    processedById?: SortOrder
    processedAt?: SortOrder
  }

  export type CorrectionRequestMinOrderByAggregateInput = {
    id?: SortOrder
    vaccinationId?: SortOrder
    requestedById?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    processedById?: SortOrder
    processedAt?: SortOrder
  }

  export type CorrectionRequestSumOrderByAggregateInput = {
    id?: SortOrder
    requestedById?: SortOrder
    processedById?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type CertificateCountOrderByAggregateInput = {
    id?: SortOrder
    childId?: SortOrder
    issuedById?: SortOrder
    issuedAt?: SortOrder
    token?: SortOrder
    pdfPath?: SortOrder
  }

  export type CertificateAvgOrderByAggregateInput = {
    id?: SortOrder
    issuedById?: SortOrder
  }

  export type CertificateMaxOrderByAggregateInput = {
    id?: SortOrder
    childId?: SortOrder
    issuedById?: SortOrder
    issuedAt?: SortOrder
    token?: SortOrder
    pdfPath?: SortOrder
  }

  export type CertificateMinOrderByAggregateInput = {
    id?: SortOrder
    childId?: SortOrder
    issuedById?: SortOrder
    issuedAt?: SortOrder
    token?: SortOrder
    pdfPath?: SortOrder
  }

  export type CertificateSumOrderByAggregateInput = {
    id?: SortOrder
    issuedById?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type WeightRecordCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    weight?: SortOrder
    childId?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type WeightRecordAvgOrderByAggregateInput = {
    weight?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type WeightRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    weight?: SortOrder
    childId?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type WeightRecordMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    weight?: SortOrder
    childId?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type WeightRecordSumOrderByAggregateInput = {
    weight?: SortOrder
    createdById?: SortOrder
    administeredById?: SortOrder
    wardOfVaccination?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ChildCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ChildCreateWithoutCreatedByInput, ChildUncheckedCreateWithoutCreatedByInput> | ChildCreateWithoutCreatedByInput[] | ChildUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutCreatedByInput | ChildCreateOrConnectWithoutCreatedByInput[]
    createMany?: ChildCreateManyCreatedByInputEnvelope
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
  }

  export type MotherCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<MotherCreateWithoutCreatedByInput, MotherUncheckedCreateWithoutCreatedByInput> | MotherCreateWithoutCreatedByInput[] | MotherUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: MotherCreateOrConnectWithoutCreatedByInput | MotherCreateOrConnectWithoutCreatedByInput[]
    createMany?: MotherCreateManyCreatedByInputEnvelope
    connect?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
  }

  export type VaccinationRecordCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<VaccinationRecordCreateWithoutCreatedByInput, VaccinationRecordUncheckedCreateWithoutCreatedByInput> | VaccinationRecordCreateWithoutCreatedByInput[] | VaccinationRecordUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutCreatedByInput | VaccinationRecordCreateOrConnectWithoutCreatedByInput[]
    createMany?: VaccinationRecordCreateManyCreatedByInputEnvelope
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
  }

  export type VaccinationRecordCreateNestedManyWithoutAdministeredByInput = {
    create?: XOR<VaccinationRecordCreateWithoutAdministeredByInput, VaccinationRecordUncheckedCreateWithoutAdministeredByInput> | VaccinationRecordCreateWithoutAdministeredByInput[] | VaccinationRecordUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutAdministeredByInput | VaccinationRecordCreateOrConnectWithoutAdministeredByInput[]
    createMany?: VaccinationRecordCreateManyAdministeredByInputEnvelope
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type WeightRecordCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<WeightRecordCreateWithoutCreatedByInput, WeightRecordUncheckedCreateWithoutCreatedByInput> | WeightRecordCreateWithoutCreatedByInput[] | WeightRecordUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutCreatedByInput | WeightRecordCreateOrConnectWithoutCreatedByInput[]
    createMany?: WeightRecordCreateManyCreatedByInputEnvelope
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
  }

  export type WeightRecordCreateNestedManyWithoutAdministeredByInput = {
    create?: XOR<WeightRecordCreateWithoutAdministeredByInput, WeightRecordUncheckedCreateWithoutAdministeredByInput> | WeightRecordCreateWithoutAdministeredByInput[] | WeightRecordUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutAdministeredByInput | WeightRecordCreateOrConnectWithoutAdministeredByInput[]
    createMany?: WeightRecordCreateManyAdministeredByInputEnvelope
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
  }

  export type ChildCreateNestedManyWithoutVerifiedByInput = {
    create?: XOR<ChildCreateWithoutVerifiedByInput, ChildUncheckedCreateWithoutVerifiedByInput> | ChildCreateWithoutVerifiedByInput[] | ChildUncheckedCreateWithoutVerifiedByInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutVerifiedByInput | ChildCreateOrConnectWithoutVerifiedByInput[]
    createMany?: ChildCreateManyVerifiedByInputEnvelope
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
  }

  export type TDDoseCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<TDDoseCreateWithoutCreatedByInput, TDDoseUncheckedCreateWithoutCreatedByInput> | TDDoseCreateWithoutCreatedByInput[] | TDDoseUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutCreatedByInput | TDDoseCreateOrConnectWithoutCreatedByInput[]
    createMany?: TDDoseCreateManyCreatedByInputEnvelope
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
  }

  export type TDDoseCreateNestedManyWithoutAdministeredByInput = {
    create?: XOR<TDDoseCreateWithoutAdministeredByInput, TDDoseUncheckedCreateWithoutAdministeredByInput> | TDDoseCreateWithoutAdministeredByInput[] | TDDoseUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutAdministeredByInput | TDDoseCreateOrConnectWithoutAdministeredByInput[]
    createMany?: TDDoseCreateManyAdministeredByInputEnvelope
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type ChildUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ChildCreateWithoutCreatedByInput, ChildUncheckedCreateWithoutCreatedByInput> | ChildCreateWithoutCreatedByInput[] | ChildUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutCreatedByInput | ChildCreateOrConnectWithoutCreatedByInput[]
    createMany?: ChildCreateManyCreatedByInputEnvelope
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
  }

  export type MotherUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<MotherCreateWithoutCreatedByInput, MotherUncheckedCreateWithoutCreatedByInput> | MotherCreateWithoutCreatedByInput[] | MotherUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: MotherCreateOrConnectWithoutCreatedByInput | MotherCreateOrConnectWithoutCreatedByInput[]
    createMany?: MotherCreateManyCreatedByInputEnvelope
    connect?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
  }

  export type VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<VaccinationRecordCreateWithoutCreatedByInput, VaccinationRecordUncheckedCreateWithoutCreatedByInput> | VaccinationRecordCreateWithoutCreatedByInput[] | VaccinationRecordUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutCreatedByInput | VaccinationRecordCreateOrConnectWithoutCreatedByInput[]
    createMany?: VaccinationRecordCreateManyCreatedByInputEnvelope
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
  }

  export type VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput = {
    create?: XOR<VaccinationRecordCreateWithoutAdministeredByInput, VaccinationRecordUncheckedCreateWithoutAdministeredByInput> | VaccinationRecordCreateWithoutAdministeredByInput[] | VaccinationRecordUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutAdministeredByInput | VaccinationRecordCreateOrConnectWithoutAdministeredByInput[]
    createMany?: VaccinationRecordCreateManyAdministeredByInputEnvelope
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<WeightRecordCreateWithoutCreatedByInput, WeightRecordUncheckedCreateWithoutCreatedByInput> | WeightRecordCreateWithoutCreatedByInput[] | WeightRecordUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutCreatedByInput | WeightRecordCreateOrConnectWithoutCreatedByInput[]
    createMany?: WeightRecordCreateManyCreatedByInputEnvelope
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
  }

  export type WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput = {
    create?: XOR<WeightRecordCreateWithoutAdministeredByInput, WeightRecordUncheckedCreateWithoutAdministeredByInput> | WeightRecordCreateWithoutAdministeredByInput[] | WeightRecordUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutAdministeredByInput | WeightRecordCreateOrConnectWithoutAdministeredByInput[]
    createMany?: WeightRecordCreateManyAdministeredByInputEnvelope
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
  }

  export type ChildUncheckedCreateNestedManyWithoutVerifiedByInput = {
    create?: XOR<ChildCreateWithoutVerifiedByInput, ChildUncheckedCreateWithoutVerifiedByInput> | ChildCreateWithoutVerifiedByInput[] | ChildUncheckedCreateWithoutVerifiedByInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutVerifiedByInput | ChildCreateOrConnectWithoutVerifiedByInput[]
    createMany?: ChildCreateManyVerifiedByInputEnvelope
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
  }

  export type TDDoseUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<TDDoseCreateWithoutCreatedByInput, TDDoseUncheckedCreateWithoutCreatedByInput> | TDDoseCreateWithoutCreatedByInput[] | TDDoseUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutCreatedByInput | TDDoseCreateOrConnectWithoutCreatedByInput[]
    createMany?: TDDoseCreateManyCreatedByInputEnvelope
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
  }

  export type TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput = {
    create?: XOR<TDDoseCreateWithoutAdministeredByInput, TDDoseUncheckedCreateWithoutAdministeredByInput> | TDDoseCreateWithoutAdministeredByInput[] | TDDoseUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutAdministeredByInput | TDDoseCreateOrConnectWithoutAdministeredByInput[]
    createMany?: TDDoseCreateManyAdministeredByInputEnvelope
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type ChildUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ChildCreateWithoutCreatedByInput, ChildUncheckedCreateWithoutCreatedByInput> | ChildCreateWithoutCreatedByInput[] | ChildUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutCreatedByInput | ChildCreateOrConnectWithoutCreatedByInput[]
    upsert?: ChildUpsertWithWhereUniqueWithoutCreatedByInput | ChildUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ChildCreateManyCreatedByInputEnvelope
    set?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    disconnect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    delete?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    update?: ChildUpdateWithWhereUniqueWithoutCreatedByInput | ChildUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ChildUpdateManyWithWhereWithoutCreatedByInput | ChildUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ChildScalarWhereInput | ChildScalarWhereInput[]
  }

  export type MotherUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<MotherCreateWithoutCreatedByInput, MotherUncheckedCreateWithoutCreatedByInput> | MotherCreateWithoutCreatedByInput[] | MotherUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: MotherCreateOrConnectWithoutCreatedByInput | MotherCreateOrConnectWithoutCreatedByInput[]
    upsert?: MotherUpsertWithWhereUniqueWithoutCreatedByInput | MotherUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: MotherCreateManyCreatedByInputEnvelope
    set?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
    disconnect?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
    delete?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
    connect?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
    update?: MotherUpdateWithWhereUniqueWithoutCreatedByInput | MotherUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: MotherUpdateManyWithWhereWithoutCreatedByInput | MotherUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: MotherScalarWhereInput | MotherScalarWhereInput[]
  }

  export type VaccinationRecordUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<VaccinationRecordCreateWithoutCreatedByInput, VaccinationRecordUncheckedCreateWithoutCreatedByInput> | VaccinationRecordCreateWithoutCreatedByInput[] | VaccinationRecordUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutCreatedByInput | VaccinationRecordCreateOrConnectWithoutCreatedByInput[]
    upsert?: VaccinationRecordUpsertWithWhereUniqueWithoutCreatedByInput | VaccinationRecordUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: VaccinationRecordCreateManyCreatedByInputEnvelope
    set?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    disconnect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    delete?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    update?: VaccinationRecordUpdateWithWhereUniqueWithoutCreatedByInput | VaccinationRecordUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: VaccinationRecordUpdateManyWithWhereWithoutCreatedByInput | VaccinationRecordUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: VaccinationRecordScalarWhereInput | VaccinationRecordScalarWhereInput[]
  }

  export type VaccinationRecordUpdateManyWithoutAdministeredByNestedInput = {
    create?: XOR<VaccinationRecordCreateWithoutAdministeredByInput, VaccinationRecordUncheckedCreateWithoutAdministeredByInput> | VaccinationRecordCreateWithoutAdministeredByInput[] | VaccinationRecordUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutAdministeredByInput | VaccinationRecordCreateOrConnectWithoutAdministeredByInput[]
    upsert?: VaccinationRecordUpsertWithWhereUniqueWithoutAdministeredByInput | VaccinationRecordUpsertWithWhereUniqueWithoutAdministeredByInput[]
    createMany?: VaccinationRecordCreateManyAdministeredByInputEnvelope
    set?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    disconnect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    delete?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    update?: VaccinationRecordUpdateWithWhereUniqueWithoutAdministeredByInput | VaccinationRecordUpdateWithWhereUniqueWithoutAdministeredByInput[]
    updateMany?: VaccinationRecordUpdateManyWithWhereWithoutAdministeredByInput | VaccinationRecordUpdateManyWithWhereWithoutAdministeredByInput[]
    deleteMany?: VaccinationRecordScalarWhereInput | VaccinationRecordScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type WeightRecordUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<WeightRecordCreateWithoutCreatedByInput, WeightRecordUncheckedCreateWithoutCreatedByInput> | WeightRecordCreateWithoutCreatedByInput[] | WeightRecordUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutCreatedByInput | WeightRecordCreateOrConnectWithoutCreatedByInput[]
    upsert?: WeightRecordUpsertWithWhereUniqueWithoutCreatedByInput | WeightRecordUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: WeightRecordCreateManyCreatedByInputEnvelope
    set?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    disconnect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    delete?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    update?: WeightRecordUpdateWithWhereUniqueWithoutCreatedByInput | WeightRecordUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: WeightRecordUpdateManyWithWhereWithoutCreatedByInput | WeightRecordUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: WeightRecordScalarWhereInput | WeightRecordScalarWhereInput[]
  }

  export type WeightRecordUpdateManyWithoutAdministeredByNestedInput = {
    create?: XOR<WeightRecordCreateWithoutAdministeredByInput, WeightRecordUncheckedCreateWithoutAdministeredByInput> | WeightRecordCreateWithoutAdministeredByInput[] | WeightRecordUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutAdministeredByInput | WeightRecordCreateOrConnectWithoutAdministeredByInput[]
    upsert?: WeightRecordUpsertWithWhereUniqueWithoutAdministeredByInput | WeightRecordUpsertWithWhereUniqueWithoutAdministeredByInput[]
    createMany?: WeightRecordCreateManyAdministeredByInputEnvelope
    set?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    disconnect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    delete?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    update?: WeightRecordUpdateWithWhereUniqueWithoutAdministeredByInput | WeightRecordUpdateWithWhereUniqueWithoutAdministeredByInput[]
    updateMany?: WeightRecordUpdateManyWithWhereWithoutAdministeredByInput | WeightRecordUpdateManyWithWhereWithoutAdministeredByInput[]
    deleteMany?: WeightRecordScalarWhereInput | WeightRecordScalarWhereInput[]
  }

  export type ChildUpdateManyWithoutVerifiedByNestedInput = {
    create?: XOR<ChildCreateWithoutVerifiedByInput, ChildUncheckedCreateWithoutVerifiedByInput> | ChildCreateWithoutVerifiedByInput[] | ChildUncheckedCreateWithoutVerifiedByInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutVerifiedByInput | ChildCreateOrConnectWithoutVerifiedByInput[]
    upsert?: ChildUpsertWithWhereUniqueWithoutVerifiedByInput | ChildUpsertWithWhereUniqueWithoutVerifiedByInput[]
    createMany?: ChildCreateManyVerifiedByInputEnvelope
    set?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    disconnect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    delete?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    update?: ChildUpdateWithWhereUniqueWithoutVerifiedByInput | ChildUpdateWithWhereUniqueWithoutVerifiedByInput[]
    updateMany?: ChildUpdateManyWithWhereWithoutVerifiedByInput | ChildUpdateManyWithWhereWithoutVerifiedByInput[]
    deleteMany?: ChildScalarWhereInput | ChildScalarWhereInput[]
  }

  export type TDDoseUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<TDDoseCreateWithoutCreatedByInput, TDDoseUncheckedCreateWithoutCreatedByInput> | TDDoseCreateWithoutCreatedByInput[] | TDDoseUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutCreatedByInput | TDDoseCreateOrConnectWithoutCreatedByInput[]
    upsert?: TDDoseUpsertWithWhereUniqueWithoutCreatedByInput | TDDoseUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: TDDoseCreateManyCreatedByInputEnvelope
    set?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    disconnect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    delete?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    update?: TDDoseUpdateWithWhereUniqueWithoutCreatedByInput | TDDoseUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: TDDoseUpdateManyWithWhereWithoutCreatedByInput | TDDoseUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: TDDoseScalarWhereInput | TDDoseScalarWhereInput[]
  }

  export type TDDoseUpdateManyWithoutAdministeredByNestedInput = {
    create?: XOR<TDDoseCreateWithoutAdministeredByInput, TDDoseUncheckedCreateWithoutAdministeredByInput> | TDDoseCreateWithoutAdministeredByInput[] | TDDoseUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutAdministeredByInput | TDDoseCreateOrConnectWithoutAdministeredByInput[]
    upsert?: TDDoseUpsertWithWhereUniqueWithoutAdministeredByInput | TDDoseUpsertWithWhereUniqueWithoutAdministeredByInput[]
    createMany?: TDDoseCreateManyAdministeredByInputEnvelope
    set?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    disconnect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    delete?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    update?: TDDoseUpdateWithWhereUniqueWithoutAdministeredByInput | TDDoseUpdateWithWhereUniqueWithoutAdministeredByInput[]
    updateMany?: TDDoseUpdateManyWithWhereWithoutAdministeredByInput | TDDoseUpdateManyWithWhereWithoutAdministeredByInput[]
    deleteMany?: TDDoseScalarWhereInput | TDDoseScalarWhereInput[]
  }

  export type RefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ChildUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ChildCreateWithoutCreatedByInput, ChildUncheckedCreateWithoutCreatedByInput> | ChildCreateWithoutCreatedByInput[] | ChildUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutCreatedByInput | ChildCreateOrConnectWithoutCreatedByInput[]
    upsert?: ChildUpsertWithWhereUniqueWithoutCreatedByInput | ChildUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ChildCreateManyCreatedByInputEnvelope
    set?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    disconnect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    delete?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    update?: ChildUpdateWithWhereUniqueWithoutCreatedByInput | ChildUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ChildUpdateManyWithWhereWithoutCreatedByInput | ChildUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ChildScalarWhereInput | ChildScalarWhereInput[]
  }

  export type MotherUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<MotherCreateWithoutCreatedByInput, MotherUncheckedCreateWithoutCreatedByInput> | MotherCreateWithoutCreatedByInput[] | MotherUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: MotherCreateOrConnectWithoutCreatedByInput | MotherCreateOrConnectWithoutCreatedByInput[]
    upsert?: MotherUpsertWithWhereUniqueWithoutCreatedByInput | MotherUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: MotherCreateManyCreatedByInputEnvelope
    set?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
    disconnect?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
    delete?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
    connect?: MotherWhereUniqueInput | MotherWhereUniqueInput[]
    update?: MotherUpdateWithWhereUniqueWithoutCreatedByInput | MotherUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: MotherUpdateManyWithWhereWithoutCreatedByInput | MotherUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: MotherScalarWhereInput | MotherScalarWhereInput[]
  }

  export type VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<VaccinationRecordCreateWithoutCreatedByInput, VaccinationRecordUncheckedCreateWithoutCreatedByInput> | VaccinationRecordCreateWithoutCreatedByInput[] | VaccinationRecordUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutCreatedByInput | VaccinationRecordCreateOrConnectWithoutCreatedByInput[]
    upsert?: VaccinationRecordUpsertWithWhereUniqueWithoutCreatedByInput | VaccinationRecordUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: VaccinationRecordCreateManyCreatedByInputEnvelope
    set?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    disconnect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    delete?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    update?: VaccinationRecordUpdateWithWhereUniqueWithoutCreatedByInput | VaccinationRecordUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: VaccinationRecordUpdateManyWithWhereWithoutCreatedByInput | VaccinationRecordUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: VaccinationRecordScalarWhereInput | VaccinationRecordScalarWhereInput[]
  }

  export type VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput = {
    create?: XOR<VaccinationRecordCreateWithoutAdministeredByInput, VaccinationRecordUncheckedCreateWithoutAdministeredByInput> | VaccinationRecordCreateWithoutAdministeredByInput[] | VaccinationRecordUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutAdministeredByInput | VaccinationRecordCreateOrConnectWithoutAdministeredByInput[]
    upsert?: VaccinationRecordUpsertWithWhereUniqueWithoutAdministeredByInput | VaccinationRecordUpsertWithWhereUniqueWithoutAdministeredByInput[]
    createMany?: VaccinationRecordCreateManyAdministeredByInputEnvelope
    set?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    disconnect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    delete?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    update?: VaccinationRecordUpdateWithWhereUniqueWithoutAdministeredByInput | VaccinationRecordUpdateWithWhereUniqueWithoutAdministeredByInput[]
    updateMany?: VaccinationRecordUpdateManyWithWhereWithoutAdministeredByInput | VaccinationRecordUpdateManyWithWhereWithoutAdministeredByInput[]
    deleteMany?: VaccinationRecordScalarWhereInput | VaccinationRecordScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<WeightRecordCreateWithoutCreatedByInput, WeightRecordUncheckedCreateWithoutCreatedByInput> | WeightRecordCreateWithoutCreatedByInput[] | WeightRecordUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutCreatedByInput | WeightRecordCreateOrConnectWithoutCreatedByInput[]
    upsert?: WeightRecordUpsertWithWhereUniqueWithoutCreatedByInput | WeightRecordUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: WeightRecordCreateManyCreatedByInputEnvelope
    set?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    disconnect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    delete?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    update?: WeightRecordUpdateWithWhereUniqueWithoutCreatedByInput | WeightRecordUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: WeightRecordUpdateManyWithWhereWithoutCreatedByInput | WeightRecordUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: WeightRecordScalarWhereInput | WeightRecordScalarWhereInput[]
  }

  export type WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput = {
    create?: XOR<WeightRecordCreateWithoutAdministeredByInput, WeightRecordUncheckedCreateWithoutAdministeredByInput> | WeightRecordCreateWithoutAdministeredByInput[] | WeightRecordUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutAdministeredByInput | WeightRecordCreateOrConnectWithoutAdministeredByInput[]
    upsert?: WeightRecordUpsertWithWhereUniqueWithoutAdministeredByInput | WeightRecordUpsertWithWhereUniqueWithoutAdministeredByInput[]
    createMany?: WeightRecordCreateManyAdministeredByInputEnvelope
    set?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    disconnect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    delete?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    update?: WeightRecordUpdateWithWhereUniqueWithoutAdministeredByInput | WeightRecordUpdateWithWhereUniqueWithoutAdministeredByInput[]
    updateMany?: WeightRecordUpdateManyWithWhereWithoutAdministeredByInput | WeightRecordUpdateManyWithWhereWithoutAdministeredByInput[]
    deleteMany?: WeightRecordScalarWhereInput | WeightRecordScalarWhereInput[]
  }

  export type ChildUncheckedUpdateManyWithoutVerifiedByNestedInput = {
    create?: XOR<ChildCreateWithoutVerifiedByInput, ChildUncheckedCreateWithoutVerifiedByInput> | ChildCreateWithoutVerifiedByInput[] | ChildUncheckedCreateWithoutVerifiedByInput[]
    connectOrCreate?: ChildCreateOrConnectWithoutVerifiedByInput | ChildCreateOrConnectWithoutVerifiedByInput[]
    upsert?: ChildUpsertWithWhereUniqueWithoutVerifiedByInput | ChildUpsertWithWhereUniqueWithoutVerifiedByInput[]
    createMany?: ChildCreateManyVerifiedByInputEnvelope
    set?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    disconnect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    delete?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    connect?: ChildWhereUniqueInput | ChildWhereUniqueInput[]
    update?: ChildUpdateWithWhereUniqueWithoutVerifiedByInput | ChildUpdateWithWhereUniqueWithoutVerifiedByInput[]
    updateMany?: ChildUpdateManyWithWhereWithoutVerifiedByInput | ChildUpdateManyWithWhereWithoutVerifiedByInput[]
    deleteMany?: ChildScalarWhereInput | ChildScalarWhereInput[]
  }

  export type TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<TDDoseCreateWithoutCreatedByInput, TDDoseUncheckedCreateWithoutCreatedByInput> | TDDoseCreateWithoutCreatedByInput[] | TDDoseUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutCreatedByInput | TDDoseCreateOrConnectWithoutCreatedByInput[]
    upsert?: TDDoseUpsertWithWhereUniqueWithoutCreatedByInput | TDDoseUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: TDDoseCreateManyCreatedByInputEnvelope
    set?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    disconnect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    delete?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    update?: TDDoseUpdateWithWhereUniqueWithoutCreatedByInput | TDDoseUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: TDDoseUpdateManyWithWhereWithoutCreatedByInput | TDDoseUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: TDDoseScalarWhereInput | TDDoseScalarWhereInput[]
  }

  export type TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput = {
    create?: XOR<TDDoseCreateWithoutAdministeredByInput, TDDoseUncheckedCreateWithoutAdministeredByInput> | TDDoseCreateWithoutAdministeredByInput[] | TDDoseUncheckedCreateWithoutAdministeredByInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutAdministeredByInput | TDDoseCreateOrConnectWithoutAdministeredByInput[]
    upsert?: TDDoseUpsertWithWhereUniqueWithoutAdministeredByInput | TDDoseUpsertWithWhereUniqueWithoutAdministeredByInput[]
    createMany?: TDDoseCreateManyAdministeredByInputEnvelope
    set?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    disconnect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    delete?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    update?: TDDoseUpdateWithWhereUniqueWithoutAdministeredByInput | TDDoseUpdateWithWhereUniqueWithoutAdministeredByInput[]
    updateMany?: TDDoseUpdateManyWithWhereWithoutAdministeredByInput | TDDoseUpdateManyWithWhereWithoutAdministeredByInput[]
    deleteMany?: TDDoseScalarWhereInput | TDDoseScalarWhereInput[]
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    upsert?: UserUpsertWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshTokensInput, UserUpdateWithoutRefreshTokensInput>, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserCreateNestedOneWithoutChildInput = {
    create?: XOR<UserCreateWithoutChildInput, UserUncheckedCreateWithoutChildInput>
    connectOrCreate?: UserCreateOrConnectWithoutChildInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutVerifiedChildrenInput = {
    create?: XOR<UserCreateWithoutVerifiedChildrenInput, UserUncheckedCreateWithoutVerifiedChildrenInput>
    connectOrCreate?: UserCreateOrConnectWithoutVerifiedChildrenInput
    connect?: UserWhereUniqueInput
  }

  export type VaccinationRecordCreateNestedManyWithoutChildInput = {
    create?: XOR<VaccinationRecordCreateWithoutChildInput, VaccinationRecordUncheckedCreateWithoutChildInput> | VaccinationRecordCreateWithoutChildInput[] | VaccinationRecordUncheckedCreateWithoutChildInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutChildInput | VaccinationRecordCreateOrConnectWithoutChildInput[]
    createMany?: VaccinationRecordCreateManyChildInputEnvelope
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
  }

  export type NotificationLogCreateNestedManyWithoutChildInput = {
    create?: XOR<NotificationLogCreateWithoutChildInput, NotificationLogUncheckedCreateWithoutChildInput> | NotificationLogCreateWithoutChildInput[] | NotificationLogUncheckedCreateWithoutChildInput[]
    connectOrCreate?: NotificationLogCreateOrConnectWithoutChildInput | NotificationLogCreateOrConnectWithoutChildInput[]
    createMany?: NotificationLogCreateManyChildInputEnvelope
    connect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
  }

  export type WeightRecordCreateNestedManyWithoutChildInput = {
    create?: XOR<WeightRecordCreateWithoutChildInput, WeightRecordUncheckedCreateWithoutChildInput> | WeightRecordCreateWithoutChildInput[] | WeightRecordUncheckedCreateWithoutChildInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutChildInput | WeightRecordCreateOrConnectWithoutChildInput[]
    createMany?: WeightRecordCreateManyChildInputEnvelope
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
  }

  export type VaccinationRecordUncheckedCreateNestedManyWithoutChildInput = {
    create?: XOR<VaccinationRecordCreateWithoutChildInput, VaccinationRecordUncheckedCreateWithoutChildInput> | VaccinationRecordCreateWithoutChildInput[] | VaccinationRecordUncheckedCreateWithoutChildInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutChildInput | VaccinationRecordCreateOrConnectWithoutChildInput[]
    createMany?: VaccinationRecordCreateManyChildInputEnvelope
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
  }

  export type NotificationLogUncheckedCreateNestedManyWithoutChildInput = {
    create?: XOR<NotificationLogCreateWithoutChildInput, NotificationLogUncheckedCreateWithoutChildInput> | NotificationLogCreateWithoutChildInput[] | NotificationLogUncheckedCreateWithoutChildInput[]
    connectOrCreate?: NotificationLogCreateOrConnectWithoutChildInput | NotificationLogCreateOrConnectWithoutChildInput[]
    createMany?: NotificationLogCreateManyChildInputEnvelope
    connect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
  }

  export type WeightRecordUncheckedCreateNestedManyWithoutChildInput = {
    create?: XOR<WeightRecordCreateWithoutChildInput, WeightRecordUncheckedCreateWithoutChildInput> | WeightRecordCreateWithoutChildInput[] | WeightRecordUncheckedCreateWithoutChildInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutChildInput | WeightRecordCreateOrConnectWithoutChildInput[]
    createMany?: WeightRecordCreateManyChildInputEnvelope
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutChildNestedInput = {
    create?: XOR<UserCreateWithoutChildInput, UserUncheckedCreateWithoutChildInput>
    connectOrCreate?: UserCreateOrConnectWithoutChildInput
    upsert?: UserUpsertWithoutChildInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChildInput, UserUpdateWithoutChildInput>, UserUncheckedUpdateWithoutChildInput>
  }

  export type UserUpdateOneWithoutVerifiedChildrenNestedInput = {
    create?: XOR<UserCreateWithoutVerifiedChildrenInput, UserUncheckedCreateWithoutVerifiedChildrenInput>
    connectOrCreate?: UserCreateOrConnectWithoutVerifiedChildrenInput
    upsert?: UserUpsertWithoutVerifiedChildrenInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVerifiedChildrenInput, UserUpdateWithoutVerifiedChildrenInput>, UserUncheckedUpdateWithoutVerifiedChildrenInput>
  }

  export type VaccinationRecordUpdateManyWithoutChildNestedInput = {
    create?: XOR<VaccinationRecordCreateWithoutChildInput, VaccinationRecordUncheckedCreateWithoutChildInput> | VaccinationRecordCreateWithoutChildInput[] | VaccinationRecordUncheckedCreateWithoutChildInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutChildInput | VaccinationRecordCreateOrConnectWithoutChildInput[]
    upsert?: VaccinationRecordUpsertWithWhereUniqueWithoutChildInput | VaccinationRecordUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: VaccinationRecordCreateManyChildInputEnvelope
    set?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    disconnect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    delete?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    update?: VaccinationRecordUpdateWithWhereUniqueWithoutChildInput | VaccinationRecordUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: VaccinationRecordUpdateManyWithWhereWithoutChildInput | VaccinationRecordUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: VaccinationRecordScalarWhereInput | VaccinationRecordScalarWhereInput[]
  }

  export type NotificationLogUpdateManyWithoutChildNestedInput = {
    create?: XOR<NotificationLogCreateWithoutChildInput, NotificationLogUncheckedCreateWithoutChildInput> | NotificationLogCreateWithoutChildInput[] | NotificationLogUncheckedCreateWithoutChildInput[]
    connectOrCreate?: NotificationLogCreateOrConnectWithoutChildInput | NotificationLogCreateOrConnectWithoutChildInput[]
    upsert?: NotificationLogUpsertWithWhereUniqueWithoutChildInput | NotificationLogUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: NotificationLogCreateManyChildInputEnvelope
    set?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    disconnect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    delete?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    connect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    update?: NotificationLogUpdateWithWhereUniqueWithoutChildInput | NotificationLogUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: NotificationLogUpdateManyWithWhereWithoutChildInput | NotificationLogUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: NotificationLogScalarWhereInput | NotificationLogScalarWhereInput[]
  }

  export type WeightRecordUpdateManyWithoutChildNestedInput = {
    create?: XOR<WeightRecordCreateWithoutChildInput, WeightRecordUncheckedCreateWithoutChildInput> | WeightRecordCreateWithoutChildInput[] | WeightRecordUncheckedCreateWithoutChildInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutChildInput | WeightRecordCreateOrConnectWithoutChildInput[]
    upsert?: WeightRecordUpsertWithWhereUniqueWithoutChildInput | WeightRecordUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: WeightRecordCreateManyChildInputEnvelope
    set?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    disconnect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    delete?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    update?: WeightRecordUpdateWithWhereUniqueWithoutChildInput | WeightRecordUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: WeightRecordUpdateManyWithWhereWithoutChildInput | WeightRecordUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: WeightRecordScalarWhereInput | WeightRecordScalarWhereInput[]
  }

  export type VaccinationRecordUncheckedUpdateManyWithoutChildNestedInput = {
    create?: XOR<VaccinationRecordCreateWithoutChildInput, VaccinationRecordUncheckedCreateWithoutChildInput> | VaccinationRecordCreateWithoutChildInput[] | VaccinationRecordUncheckedCreateWithoutChildInput[]
    connectOrCreate?: VaccinationRecordCreateOrConnectWithoutChildInput | VaccinationRecordCreateOrConnectWithoutChildInput[]
    upsert?: VaccinationRecordUpsertWithWhereUniqueWithoutChildInput | VaccinationRecordUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: VaccinationRecordCreateManyChildInputEnvelope
    set?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    disconnect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    delete?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    connect?: VaccinationRecordWhereUniqueInput | VaccinationRecordWhereUniqueInput[]
    update?: VaccinationRecordUpdateWithWhereUniqueWithoutChildInput | VaccinationRecordUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: VaccinationRecordUpdateManyWithWhereWithoutChildInput | VaccinationRecordUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: VaccinationRecordScalarWhereInput | VaccinationRecordScalarWhereInput[]
  }

  export type NotificationLogUncheckedUpdateManyWithoutChildNestedInput = {
    create?: XOR<NotificationLogCreateWithoutChildInput, NotificationLogUncheckedCreateWithoutChildInput> | NotificationLogCreateWithoutChildInput[] | NotificationLogUncheckedCreateWithoutChildInput[]
    connectOrCreate?: NotificationLogCreateOrConnectWithoutChildInput | NotificationLogCreateOrConnectWithoutChildInput[]
    upsert?: NotificationLogUpsertWithWhereUniqueWithoutChildInput | NotificationLogUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: NotificationLogCreateManyChildInputEnvelope
    set?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    disconnect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    delete?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    connect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    update?: NotificationLogUpdateWithWhereUniqueWithoutChildInput | NotificationLogUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: NotificationLogUpdateManyWithWhereWithoutChildInput | NotificationLogUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: NotificationLogScalarWhereInput | NotificationLogScalarWhereInput[]
  }

  export type WeightRecordUncheckedUpdateManyWithoutChildNestedInput = {
    create?: XOR<WeightRecordCreateWithoutChildInput, WeightRecordUncheckedCreateWithoutChildInput> | WeightRecordCreateWithoutChildInput[] | WeightRecordUncheckedCreateWithoutChildInput[]
    connectOrCreate?: WeightRecordCreateOrConnectWithoutChildInput | WeightRecordCreateOrConnectWithoutChildInput[]
    upsert?: WeightRecordUpsertWithWhereUniqueWithoutChildInput | WeightRecordUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: WeightRecordCreateManyChildInputEnvelope
    set?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    disconnect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    delete?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    connect?: WeightRecordWhereUniqueInput | WeightRecordWhereUniqueInput[]
    update?: WeightRecordUpdateWithWhereUniqueWithoutChildInput | WeightRecordUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: WeightRecordUpdateManyWithWhereWithoutChildInput | WeightRecordUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: WeightRecordScalarWhereInput | WeightRecordScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMotherInput = {
    create?: XOR<UserCreateWithoutMotherInput, UserUncheckedCreateWithoutMotherInput>
    connectOrCreate?: UserCreateOrConnectWithoutMotherInput
    connect?: UserWhereUniqueInput
  }

  export type TDDoseCreateNestedManyWithoutMotherInput = {
    create?: XOR<TDDoseCreateWithoutMotherInput, TDDoseUncheckedCreateWithoutMotherInput> | TDDoseCreateWithoutMotherInput[] | TDDoseUncheckedCreateWithoutMotherInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutMotherInput | TDDoseCreateOrConnectWithoutMotherInput[]
    createMany?: TDDoseCreateManyMotherInputEnvelope
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
  }

  export type TDDoseUncheckedCreateNestedManyWithoutMotherInput = {
    create?: XOR<TDDoseCreateWithoutMotherInput, TDDoseUncheckedCreateWithoutMotherInput> | TDDoseCreateWithoutMotherInput[] | TDDoseUncheckedCreateWithoutMotherInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutMotherInput | TDDoseCreateOrConnectWithoutMotherInput[]
    createMany?: TDDoseCreateManyMotherInputEnvelope
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutMotherNestedInput = {
    create?: XOR<UserCreateWithoutMotherInput, UserUncheckedCreateWithoutMotherInput>
    connectOrCreate?: UserCreateOrConnectWithoutMotherInput
    upsert?: UserUpsertWithoutMotherInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMotherInput, UserUpdateWithoutMotherInput>, UserUncheckedUpdateWithoutMotherInput>
  }

  export type TDDoseUpdateManyWithoutMotherNestedInput = {
    create?: XOR<TDDoseCreateWithoutMotherInput, TDDoseUncheckedCreateWithoutMotherInput> | TDDoseCreateWithoutMotherInput[] | TDDoseUncheckedCreateWithoutMotherInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutMotherInput | TDDoseCreateOrConnectWithoutMotherInput[]
    upsert?: TDDoseUpsertWithWhereUniqueWithoutMotherInput | TDDoseUpsertWithWhereUniqueWithoutMotherInput[]
    createMany?: TDDoseCreateManyMotherInputEnvelope
    set?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    disconnect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    delete?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    update?: TDDoseUpdateWithWhereUniqueWithoutMotherInput | TDDoseUpdateWithWhereUniqueWithoutMotherInput[]
    updateMany?: TDDoseUpdateManyWithWhereWithoutMotherInput | TDDoseUpdateManyWithWhereWithoutMotherInput[]
    deleteMany?: TDDoseScalarWhereInput | TDDoseScalarWhereInput[]
  }

  export type TDDoseUncheckedUpdateManyWithoutMotherNestedInput = {
    create?: XOR<TDDoseCreateWithoutMotherInput, TDDoseUncheckedCreateWithoutMotherInput> | TDDoseCreateWithoutMotherInput[] | TDDoseUncheckedCreateWithoutMotherInput[]
    connectOrCreate?: TDDoseCreateOrConnectWithoutMotherInput | TDDoseCreateOrConnectWithoutMotherInput[]
    upsert?: TDDoseUpsertWithWhereUniqueWithoutMotherInput | TDDoseUpsertWithWhereUniqueWithoutMotherInput[]
    createMany?: TDDoseCreateManyMotherInputEnvelope
    set?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    disconnect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    delete?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    connect?: TDDoseWhereUniqueInput | TDDoseWhereUniqueInput[]
    update?: TDDoseUpdateWithWhereUniqueWithoutMotherInput | TDDoseUpdateWithWhereUniqueWithoutMotherInput[]
    updateMany?: TDDoseUpdateManyWithWhereWithoutMotherInput | TDDoseUpdateManyWithWhereWithoutMotherInput[]
    deleteMany?: TDDoseScalarWhereInput | TDDoseScalarWhereInput[]
  }

  export type MotherCreateNestedOneWithoutTdDosesInput = {
    create?: XOR<MotherCreateWithoutTdDosesInput, MotherUncheckedCreateWithoutTdDosesInput>
    connectOrCreate?: MotherCreateOrConnectWithoutTdDosesInput
    connect?: MotherWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCreatedTDDosesInput = {
    create?: XOR<UserCreateWithoutCreatedTDDosesInput, UserUncheckedCreateWithoutCreatedTDDosesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedTDDosesInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAdministeredTDDosesInput = {
    create?: XOR<UserCreateWithoutAdministeredTDDosesInput, UserUncheckedCreateWithoutAdministeredTDDosesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdministeredTDDosesInput
    connect?: UserWhereUniqueInput
  }

  export type MotherUpdateOneRequiredWithoutTdDosesNestedInput = {
    create?: XOR<MotherCreateWithoutTdDosesInput, MotherUncheckedCreateWithoutTdDosesInput>
    connectOrCreate?: MotherCreateOrConnectWithoutTdDosesInput
    upsert?: MotherUpsertWithoutTdDosesInput
    connect?: MotherWhereUniqueInput
    update?: XOR<XOR<MotherUpdateToOneWithWhereWithoutTdDosesInput, MotherUpdateWithoutTdDosesInput>, MotherUncheckedUpdateWithoutTdDosesInput>
  }

  export type UserUpdateOneRequiredWithoutCreatedTDDosesNestedInput = {
    create?: XOR<UserCreateWithoutCreatedTDDosesInput, UserUncheckedCreateWithoutCreatedTDDosesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedTDDosesInput
    upsert?: UserUpsertWithoutCreatedTDDosesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedTDDosesInput, UserUpdateWithoutCreatedTDDosesInput>, UserUncheckedUpdateWithoutCreatedTDDosesInput>
  }

  export type UserUpdateOneRequiredWithoutAdministeredTDDosesNestedInput = {
    create?: XOR<UserCreateWithoutAdministeredTDDosesInput, UserUncheckedCreateWithoutAdministeredTDDosesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdministeredTDDosesInput
    upsert?: UserUpsertWithoutAdministeredTDDosesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAdministeredTDDosesInput, UserUpdateWithoutAdministeredTDDosesInput>, UserUncheckedUpdateWithoutAdministeredTDDosesInput>
  }

  export type ChildCreateNestedOneWithoutVaccinationsInput = {
    create?: XOR<ChildCreateWithoutVaccinationsInput, ChildUncheckedCreateWithoutVaccinationsInput>
    connectOrCreate?: ChildCreateOrConnectWithoutVaccinationsInput
    connect?: ChildWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCreatedVaccinationRecordsInput = {
    create?: XOR<UserCreateWithoutCreatedVaccinationRecordsInput, UserUncheckedCreateWithoutCreatedVaccinationRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedVaccinationRecordsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAdministeredVaccinationsInput = {
    create?: XOR<UserCreateWithoutAdministeredVaccinationsInput, UserUncheckedCreateWithoutAdministeredVaccinationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdministeredVaccinationsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumVaccineTypeFieldUpdateOperationsInput = {
    set?: $Enums.VaccineType
  }

  export type ChildUpdateOneRequiredWithoutVaccinationsNestedInput = {
    create?: XOR<ChildCreateWithoutVaccinationsInput, ChildUncheckedCreateWithoutVaccinationsInput>
    connectOrCreate?: ChildCreateOrConnectWithoutVaccinationsInput
    upsert?: ChildUpsertWithoutVaccinationsInput
    connect?: ChildWhereUniqueInput
    update?: XOR<XOR<ChildUpdateToOneWithWhereWithoutVaccinationsInput, ChildUpdateWithoutVaccinationsInput>, ChildUncheckedUpdateWithoutVaccinationsInput>
  }

  export type UserUpdateOneRequiredWithoutCreatedVaccinationRecordsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedVaccinationRecordsInput, UserUncheckedCreateWithoutCreatedVaccinationRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedVaccinationRecordsInput
    upsert?: UserUpsertWithoutCreatedVaccinationRecordsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedVaccinationRecordsInput, UserUpdateWithoutCreatedVaccinationRecordsInput>, UserUncheckedUpdateWithoutCreatedVaccinationRecordsInput>
  }

  export type UserUpdateOneWithoutAdministeredVaccinationsNestedInput = {
    create?: XOR<UserCreateWithoutAdministeredVaccinationsInput, UserUncheckedCreateWithoutAdministeredVaccinationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdministeredVaccinationsInput
    upsert?: UserUpsertWithoutAdministeredVaccinationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAdministeredVaccinationsInput, UserUpdateWithoutAdministeredVaccinationsInput>, UserUncheckedUpdateWithoutAdministeredVaccinationsInput>
  }

  export type ChildCreateNestedOneWithoutNotificationLogInput = {
    create?: XOR<ChildCreateWithoutNotificationLogInput, ChildUncheckedCreateWithoutNotificationLogInput>
    connectOrCreate?: ChildCreateOrConnectWithoutNotificationLogInput
    connect?: ChildWhereUniqueInput
  }

  export type ChildUpdateOneRequiredWithoutNotificationLogNestedInput = {
    create?: XOR<ChildCreateWithoutNotificationLogInput, ChildUncheckedCreateWithoutNotificationLogInput>
    connectOrCreate?: ChildCreateOrConnectWithoutNotificationLogInput
    upsert?: ChildUpsertWithoutNotificationLogInput
    connect?: ChildWhereUniqueInput
    update?: XOR<XOR<ChildUpdateToOneWithWhereWithoutNotificationLogInput, ChildUpdateWithoutNotificationLogInput>, ChildUncheckedUpdateWithoutNotificationLogInput>
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ChildCreateNestedOneWithoutWeightRecordsInput = {
    create?: XOR<ChildCreateWithoutWeightRecordsInput, ChildUncheckedCreateWithoutWeightRecordsInput>
    connectOrCreate?: ChildCreateOrConnectWithoutWeightRecordsInput
    connect?: ChildWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCreatedWeightRecordsInput = {
    create?: XOR<UserCreateWithoutCreatedWeightRecordsInput, UserUncheckedCreateWithoutCreatedWeightRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedWeightRecordsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAdministeredWeightRecordsInput = {
    create?: XOR<UserCreateWithoutAdministeredWeightRecordsInput, UserUncheckedCreateWithoutAdministeredWeightRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdministeredWeightRecordsInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ChildUpdateOneRequiredWithoutWeightRecordsNestedInput = {
    create?: XOR<ChildCreateWithoutWeightRecordsInput, ChildUncheckedCreateWithoutWeightRecordsInput>
    connectOrCreate?: ChildCreateOrConnectWithoutWeightRecordsInput
    upsert?: ChildUpsertWithoutWeightRecordsInput
    connect?: ChildWhereUniqueInput
    update?: XOR<XOR<ChildUpdateToOneWithWhereWithoutWeightRecordsInput, ChildUpdateWithoutWeightRecordsInput>, ChildUncheckedUpdateWithoutWeightRecordsInput>
  }

  export type UserUpdateOneRequiredWithoutCreatedWeightRecordsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedWeightRecordsInput, UserUncheckedCreateWithoutCreatedWeightRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedWeightRecordsInput
    upsert?: UserUpsertWithoutCreatedWeightRecordsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedWeightRecordsInput, UserUpdateWithoutCreatedWeightRecordsInput>, UserUncheckedUpdateWithoutCreatedWeightRecordsInput>
  }

  export type UserUpdateOneWithoutAdministeredWeightRecordsNestedInput = {
    create?: XOR<UserCreateWithoutAdministeredWeightRecordsInput, UserUncheckedCreateWithoutAdministeredWeightRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdministeredWeightRecordsInput
    upsert?: UserUpsertWithoutAdministeredWeightRecordsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAdministeredWeightRecordsInput, UserUpdateWithoutAdministeredWeightRecordsInput>, UserUncheckedUpdateWithoutAdministeredWeightRecordsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumVaccineTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.VaccineType | EnumVaccineTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VaccineType[] | ListEnumVaccineTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VaccineType[] | ListEnumVaccineTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVaccineTypeFilter<$PrismaModel> | $Enums.VaccineType
  }

  export type NestedEnumVaccineTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VaccineType | EnumVaccineTypeFieldRefInput<$PrismaModel>
    in?: $Enums.VaccineType[] | ListEnumVaccineTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VaccineType[] | ListEnumVaccineTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumVaccineTypeWithAggregatesFilter<$PrismaModel> | $Enums.VaccineType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVaccineTypeFilter<$PrismaModel>
    _max?: NestedEnumVaccineTypeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ChildCreateWithoutCreatedByInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    verifiedBy?: UserCreateNestedOneWithoutVerifiedChildrenInput
    vaccinations?: VaccinationRecordCreateNestedManyWithoutChildInput
    NotificationLog?: NotificationLogCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateWithoutCreatedByInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    verifiedById?: number | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    vaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutChildInput
    NotificationLog?: NotificationLogUncheckedCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildCreateOrConnectWithoutCreatedByInput = {
    where: ChildWhereUniqueInput
    create: XOR<ChildCreateWithoutCreatedByInput, ChildUncheckedCreateWithoutCreatedByInput>
  }

  export type ChildCreateManyCreatedByInputEnvelope = {
    data: ChildCreateManyCreatedByInput | ChildCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type MotherCreateWithoutCreatedByInput = {
    id?: string
    sewaDartaNumber?: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    tdDoses?: TDDoseCreateNestedManyWithoutMotherInput
  }

  export type MotherUncheckedCreateWithoutCreatedByInput = {
    id?: string
    sewaDartaNumber?: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    tdDoses?: TDDoseUncheckedCreateNestedManyWithoutMotherInput
  }

  export type MotherCreateOrConnectWithoutCreatedByInput = {
    where: MotherWhereUniqueInput
    create: XOR<MotherCreateWithoutCreatedByInput, MotherUncheckedCreateWithoutCreatedByInput>
  }

  export type MotherCreateManyCreatedByInputEnvelope = {
    data: MotherCreateManyCreatedByInput | MotherCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type VaccinationRecordCreateWithoutCreatedByInput = {
    id?: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdAt?: Date | string
    wardOfVaccination: number
    child: ChildCreateNestedOneWithoutVaccinationsInput
    administeredBy?: UserCreateNestedOneWithoutAdministeredVaccinationsInput
  }

  export type VaccinationRecordUncheckedCreateWithoutCreatedByInput = {
    id?: string
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    administeredById?: number | null
    createdAt?: Date | string
    wardOfVaccination: number
  }

  export type VaccinationRecordCreateOrConnectWithoutCreatedByInput = {
    where: VaccinationRecordWhereUniqueInput
    create: XOR<VaccinationRecordCreateWithoutCreatedByInput, VaccinationRecordUncheckedCreateWithoutCreatedByInput>
  }

  export type VaccinationRecordCreateManyCreatedByInputEnvelope = {
    data: VaccinationRecordCreateManyCreatedByInput | VaccinationRecordCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type VaccinationRecordCreateWithoutAdministeredByInput = {
    id?: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdAt?: Date | string
    wardOfVaccination: number
    child: ChildCreateNestedOneWithoutVaccinationsInput
    createdBy: UserCreateNestedOneWithoutCreatedVaccinationRecordsInput
  }

  export type VaccinationRecordUncheckedCreateWithoutAdministeredByInput = {
    id?: string
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdById: number
    createdAt?: Date | string
    wardOfVaccination: number
  }

  export type VaccinationRecordCreateOrConnectWithoutAdministeredByInput = {
    where: VaccinationRecordWhereUniqueInput
    create: XOR<VaccinationRecordCreateWithoutAdministeredByInput, VaccinationRecordUncheckedCreateWithoutAdministeredByInput>
  }

  export type VaccinationRecordCreateManyAdministeredByInputEnvelope = {
    data: VaccinationRecordCreateManyAdministeredByInput | VaccinationRecordCreateManyAdministeredByInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutUserInput = {
    action: string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: number
    action: string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WeightRecordCreateWithoutCreatedByInput = {
    id?: string
    date: Date | string
    weight: number
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
    child: ChildCreateNestedOneWithoutWeightRecordsInput
    administeredBy?: UserCreateNestedOneWithoutAdministeredWeightRecordsInput
  }

  export type WeightRecordUncheckedCreateWithoutCreatedByInput = {
    id?: string
    date: Date | string
    weight: number
    childId: string
    administeredById?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
  }

  export type WeightRecordCreateOrConnectWithoutCreatedByInput = {
    where: WeightRecordWhereUniqueInput
    create: XOR<WeightRecordCreateWithoutCreatedByInput, WeightRecordUncheckedCreateWithoutCreatedByInput>
  }

  export type WeightRecordCreateManyCreatedByInputEnvelope = {
    data: WeightRecordCreateManyCreatedByInput | WeightRecordCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type WeightRecordCreateWithoutAdministeredByInput = {
    id?: string
    date: Date | string
    weight: number
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
    child: ChildCreateNestedOneWithoutWeightRecordsInput
    createdBy: UserCreateNestedOneWithoutCreatedWeightRecordsInput
  }

  export type WeightRecordUncheckedCreateWithoutAdministeredByInput = {
    id?: string
    date: Date | string
    weight: number
    childId: string
    createdById: number
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
  }

  export type WeightRecordCreateOrConnectWithoutAdministeredByInput = {
    where: WeightRecordWhereUniqueInput
    create: XOR<WeightRecordCreateWithoutAdministeredByInput, WeightRecordUncheckedCreateWithoutAdministeredByInput>
  }

  export type WeightRecordCreateManyAdministeredByInputEnvelope = {
    data: WeightRecordCreateManyAdministeredByInput | WeightRecordCreateManyAdministeredByInput[]
    skipDuplicates?: boolean
  }

  export type ChildCreateWithoutVerifiedByInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    createdBy: UserCreateNestedOneWithoutChildInput
    vaccinations?: VaccinationRecordCreateNestedManyWithoutChildInput
    NotificationLog?: NotificationLogCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateWithoutVerifiedByInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdById: number
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    vaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutChildInput
    NotificationLog?: NotificationLogUncheckedCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildCreateOrConnectWithoutVerifiedByInput = {
    where: ChildWhereUniqueInput
    create: XOR<ChildCreateWithoutVerifiedByInput, ChildUncheckedCreateWithoutVerifiedByInput>
  }

  export type ChildCreateManyVerifiedByInputEnvelope = {
    data: ChildCreateManyVerifiedByInput | ChildCreateManyVerifiedByInput[]
    skipDuplicates?: boolean
  }

  export type TDDoseCreateWithoutCreatedByInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    createdAt?: Date | string
    mother: MotherCreateNestedOneWithoutTdDosesInput
    administeredBy: UserCreateNestedOneWithoutAdministeredTDDosesInput
  }

  export type TDDoseUncheckedCreateWithoutCreatedByInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    motherId: string
    createdAt?: Date | string
    administeredById: number
  }

  export type TDDoseCreateOrConnectWithoutCreatedByInput = {
    where: TDDoseWhereUniqueInput
    create: XOR<TDDoseCreateWithoutCreatedByInput, TDDoseUncheckedCreateWithoutCreatedByInput>
  }

  export type TDDoseCreateManyCreatedByInputEnvelope = {
    data: TDDoseCreateManyCreatedByInput | TDDoseCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type TDDoseCreateWithoutAdministeredByInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    createdAt?: Date | string
    mother: MotherCreateNestedOneWithoutTdDosesInput
    createdBy: UserCreateNestedOneWithoutCreatedTDDosesInput
  }

  export type TDDoseUncheckedCreateWithoutAdministeredByInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    motherId: string
    createdAt?: Date | string
    createdById: number
  }

  export type TDDoseCreateOrConnectWithoutAdministeredByInput = {
    where: TDDoseWhereUniqueInput
    create: XOR<TDDoseCreateWithoutAdministeredByInput, TDDoseUncheckedCreateWithoutAdministeredByInput>
  }

  export type TDDoseCreateManyAdministeredByInputEnvelope = {
    data: TDDoseCreateManyAdministeredByInput | TDDoseCreateManyAdministeredByInput[]
    skipDuplicates?: boolean
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    token: string
    device?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    device?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChildUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ChildWhereUniqueInput
    update: XOR<ChildUpdateWithoutCreatedByInput, ChildUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ChildCreateWithoutCreatedByInput, ChildUncheckedCreateWithoutCreatedByInput>
  }

  export type ChildUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ChildWhereUniqueInput
    data: XOR<ChildUpdateWithoutCreatedByInput, ChildUncheckedUpdateWithoutCreatedByInput>
  }

  export type ChildUpdateManyWithWhereWithoutCreatedByInput = {
    where: ChildScalarWhereInput
    data: XOR<ChildUpdateManyMutationInput, ChildUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ChildScalarWhereInput = {
    AND?: ChildScalarWhereInput | ChildScalarWhereInput[]
    OR?: ChildScalarWhereInput[]
    NOT?: ChildScalarWhereInput | ChildScalarWhereInput[]
    id?: StringFilter<"Child"> | string
    sewaDartaNumber?: IntFilter<"Child"> | number
    fullName?: StringFilter<"Child"> | string
    wardNumber?: IntFilter<"Child"> | number
    casteCode?: IntFilter<"Child"> | number
    gender?: StringFilter<"Child"> | string
    parentName?: StringFilter<"Child"> | string
    tole?: StringFilter<"Child"> | string
    phoneNumber?: StringFilter<"Child"> | string
    birthDate?: DateTimeFilter<"Child"> | Date | string
    purnaKhop?: BoolFilter<"Child"> | boolean
    remarks?: StringNullableFilter<"Child"> | string | null
    createdById?: IntFilter<"Child"> | number
    verifiedById?: IntNullableFilter<"Child"> | number | null
    createdAt?: DateTimeFilter<"Child"> | Date | string
    isFromOtherMunicipality?: BoolFilter<"Child"> | boolean
  }

  export type MotherUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: MotherWhereUniqueInput
    update: XOR<MotherUpdateWithoutCreatedByInput, MotherUncheckedUpdateWithoutCreatedByInput>
    create: XOR<MotherCreateWithoutCreatedByInput, MotherUncheckedCreateWithoutCreatedByInput>
  }

  export type MotherUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: MotherWhereUniqueInput
    data: XOR<MotherUpdateWithoutCreatedByInput, MotherUncheckedUpdateWithoutCreatedByInput>
  }

  export type MotherUpdateManyWithWhereWithoutCreatedByInput = {
    where: MotherScalarWhereInput
    data: XOR<MotherUpdateManyMutationInput, MotherUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type MotherScalarWhereInput = {
    AND?: MotherScalarWhereInput | MotherScalarWhereInput[]
    OR?: MotherScalarWhereInput[]
    NOT?: MotherScalarWhereInput | MotherScalarWhereInput[]
    id?: StringFilter<"Mother"> | string
    sewaDartaNumber?: IntFilter<"Mother"> | number
    name?: StringFilter<"Mother"> | string
    casteCode?: IntFilter<"Mother"> | number
    age?: IntFilter<"Mother"> | number
    phoneNumber?: StringFilter<"Mother"> | string
    tole?: StringFilter<"Mother"> | string
    wardNumber?: IntFilter<"Mother"> | number
    pregnancyCount?: IntFilter<"Mother"> | number
    previousTDTakenCount?: IntFilter<"Mother"> | number
    remarks?: StringNullableFilter<"Mother"> | string | null
    createdAt?: DateTimeFilter<"Mother"> | Date | string
    createdById?: IntFilter<"Mother"> | number
    isFromOtherMunicipality?: BoolFilter<"Mother"> | boolean
  }

  export type VaccinationRecordUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: VaccinationRecordWhereUniqueInput
    update: XOR<VaccinationRecordUpdateWithoutCreatedByInput, VaccinationRecordUncheckedUpdateWithoutCreatedByInput>
    create: XOR<VaccinationRecordCreateWithoutCreatedByInput, VaccinationRecordUncheckedCreateWithoutCreatedByInput>
  }

  export type VaccinationRecordUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: VaccinationRecordWhereUniqueInput
    data: XOR<VaccinationRecordUpdateWithoutCreatedByInput, VaccinationRecordUncheckedUpdateWithoutCreatedByInput>
  }

  export type VaccinationRecordUpdateManyWithWhereWithoutCreatedByInput = {
    where: VaccinationRecordScalarWhereInput
    data: XOR<VaccinationRecordUpdateManyMutationInput, VaccinationRecordUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type VaccinationRecordScalarWhereInput = {
    AND?: VaccinationRecordScalarWhereInput | VaccinationRecordScalarWhereInput[]
    OR?: VaccinationRecordScalarWhereInput[]
    NOT?: VaccinationRecordScalarWhereInput | VaccinationRecordScalarWhereInput[]
    id?: StringFilter<"VaccinationRecord"> | string
    citizenId?: StringFilter<"VaccinationRecord"> | string
    vaccineType?: EnumVaccineTypeFilter<"VaccinationRecord"> | $Enums.VaccineType
    doseNumber?: IntFilter<"VaccinationRecord"> | number
    dateGiven?: DateTimeFilter<"VaccinationRecord"> | Date | string
    isComplete?: BoolFilter<"VaccinationRecord"> | boolean
    remarks?: StringNullableFilter<"VaccinationRecord"> | string | null
    recommendedAtMonths?: IntFilter<"VaccinationRecord"> | number
    customVaccineName?: StringNullableFilter<"VaccinationRecord"> | string | null
    type?: StringFilter<"VaccinationRecord"> | string
    createdById?: IntFilter<"VaccinationRecord"> | number
    administeredById?: IntNullableFilter<"VaccinationRecord"> | number | null
    createdAt?: DateTimeFilter<"VaccinationRecord"> | Date | string
    wardOfVaccination?: IntFilter<"VaccinationRecord"> | number
  }

  export type VaccinationRecordUpsertWithWhereUniqueWithoutAdministeredByInput = {
    where: VaccinationRecordWhereUniqueInput
    update: XOR<VaccinationRecordUpdateWithoutAdministeredByInput, VaccinationRecordUncheckedUpdateWithoutAdministeredByInput>
    create: XOR<VaccinationRecordCreateWithoutAdministeredByInput, VaccinationRecordUncheckedCreateWithoutAdministeredByInput>
  }

  export type VaccinationRecordUpdateWithWhereUniqueWithoutAdministeredByInput = {
    where: VaccinationRecordWhereUniqueInput
    data: XOR<VaccinationRecordUpdateWithoutAdministeredByInput, VaccinationRecordUncheckedUpdateWithoutAdministeredByInput>
  }

  export type VaccinationRecordUpdateManyWithWhereWithoutAdministeredByInput = {
    where: VaccinationRecordScalarWhereInput
    data: XOR<VaccinationRecordUpdateManyMutationInput, VaccinationRecordUncheckedUpdateManyWithoutAdministeredByInput>
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: IntFilter<"AuditLog"> | number
    userId?: IntFilter<"AuditLog"> | number
    action?: StringFilter<"AuditLog"> | string
    meta?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type WeightRecordUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: WeightRecordWhereUniqueInput
    update: XOR<WeightRecordUpdateWithoutCreatedByInput, WeightRecordUncheckedUpdateWithoutCreatedByInput>
    create: XOR<WeightRecordCreateWithoutCreatedByInput, WeightRecordUncheckedCreateWithoutCreatedByInput>
  }

  export type WeightRecordUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: WeightRecordWhereUniqueInput
    data: XOR<WeightRecordUpdateWithoutCreatedByInput, WeightRecordUncheckedUpdateWithoutCreatedByInput>
  }

  export type WeightRecordUpdateManyWithWhereWithoutCreatedByInput = {
    where: WeightRecordScalarWhereInput
    data: XOR<WeightRecordUpdateManyMutationInput, WeightRecordUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type WeightRecordScalarWhereInput = {
    AND?: WeightRecordScalarWhereInput | WeightRecordScalarWhereInput[]
    OR?: WeightRecordScalarWhereInput[]
    NOT?: WeightRecordScalarWhereInput | WeightRecordScalarWhereInput[]
    id?: StringFilter<"WeightRecord"> | string
    date?: DateTimeFilter<"WeightRecord"> | Date | string
    weight?: FloatFilter<"WeightRecord"> | number
    childId?: StringFilter<"WeightRecord"> | string
    createdById?: IntFilter<"WeightRecord"> | number
    administeredById?: IntNullableFilter<"WeightRecord"> | number | null
    createdAt?: DateTimeFilter<"WeightRecord"> | Date | string
    updatedAt?: DateTimeFilter<"WeightRecord"> | Date | string
    wardOfVaccination?: IntFilter<"WeightRecord"> | number
  }

  export type WeightRecordUpsertWithWhereUniqueWithoutAdministeredByInput = {
    where: WeightRecordWhereUniqueInput
    update: XOR<WeightRecordUpdateWithoutAdministeredByInput, WeightRecordUncheckedUpdateWithoutAdministeredByInput>
    create: XOR<WeightRecordCreateWithoutAdministeredByInput, WeightRecordUncheckedCreateWithoutAdministeredByInput>
  }

  export type WeightRecordUpdateWithWhereUniqueWithoutAdministeredByInput = {
    where: WeightRecordWhereUniqueInput
    data: XOR<WeightRecordUpdateWithoutAdministeredByInput, WeightRecordUncheckedUpdateWithoutAdministeredByInput>
  }

  export type WeightRecordUpdateManyWithWhereWithoutAdministeredByInput = {
    where: WeightRecordScalarWhereInput
    data: XOR<WeightRecordUpdateManyMutationInput, WeightRecordUncheckedUpdateManyWithoutAdministeredByInput>
  }

  export type ChildUpsertWithWhereUniqueWithoutVerifiedByInput = {
    where: ChildWhereUniqueInput
    update: XOR<ChildUpdateWithoutVerifiedByInput, ChildUncheckedUpdateWithoutVerifiedByInput>
    create: XOR<ChildCreateWithoutVerifiedByInput, ChildUncheckedCreateWithoutVerifiedByInput>
  }

  export type ChildUpdateWithWhereUniqueWithoutVerifiedByInput = {
    where: ChildWhereUniqueInput
    data: XOR<ChildUpdateWithoutVerifiedByInput, ChildUncheckedUpdateWithoutVerifiedByInput>
  }

  export type ChildUpdateManyWithWhereWithoutVerifiedByInput = {
    where: ChildScalarWhereInput
    data: XOR<ChildUpdateManyMutationInput, ChildUncheckedUpdateManyWithoutVerifiedByInput>
  }

  export type TDDoseUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: TDDoseWhereUniqueInput
    update: XOR<TDDoseUpdateWithoutCreatedByInput, TDDoseUncheckedUpdateWithoutCreatedByInput>
    create: XOR<TDDoseCreateWithoutCreatedByInput, TDDoseUncheckedCreateWithoutCreatedByInput>
  }

  export type TDDoseUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: TDDoseWhereUniqueInput
    data: XOR<TDDoseUpdateWithoutCreatedByInput, TDDoseUncheckedUpdateWithoutCreatedByInput>
  }

  export type TDDoseUpdateManyWithWhereWithoutCreatedByInput = {
    where: TDDoseScalarWhereInput
    data: XOR<TDDoseUpdateManyMutationInput, TDDoseUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type TDDoseScalarWhereInput = {
    AND?: TDDoseScalarWhereInput | TDDoseScalarWhereInput[]
    OR?: TDDoseScalarWhereInput[]
    NOT?: TDDoseScalarWhereInput | TDDoseScalarWhereInput[]
    id?: StringFilter<"TDDose"> | string
    doseNumber?: IntFilter<"TDDose"> | number
    dateGiven?: DateTimeFilter<"TDDose"> | Date | string
    remarks?: StringNullableFilter<"TDDose"> | string | null
    motherId?: StringFilter<"TDDose"> | string
    createdAt?: DateTimeFilter<"TDDose"> | Date | string
    createdById?: IntFilter<"TDDose"> | number
    administeredById?: IntFilter<"TDDose"> | number
  }

  export type TDDoseUpsertWithWhereUniqueWithoutAdministeredByInput = {
    where: TDDoseWhereUniqueInput
    update: XOR<TDDoseUpdateWithoutAdministeredByInput, TDDoseUncheckedUpdateWithoutAdministeredByInput>
    create: XOR<TDDoseCreateWithoutAdministeredByInput, TDDoseUncheckedCreateWithoutAdministeredByInput>
  }

  export type TDDoseUpdateWithWhereUniqueWithoutAdministeredByInput = {
    where: TDDoseWhereUniqueInput
    data: XOR<TDDoseUpdateWithoutAdministeredByInput, TDDoseUncheckedUpdateWithoutAdministeredByInput>
  }

  export type TDDoseUpdateManyWithWhereWithoutAdministeredByInput = {
    where: TDDoseScalarWhereInput
    data: XOR<TDDoseUpdateManyMutationInput, TDDoseUncheckedUpdateManyWithoutAdministeredByInput>
  }

  export type RefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    update: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    data: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RefreshTokenScalarWhereInput
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshTokenScalarWhereInput = {
    AND?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    OR?: RefreshTokenScalarWhereInput[]
    NOT?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    token?: StringFilter<"RefreshToken"> | string
    userId?: IntFilter<"RefreshToken"> | number
    device?: StringNullableFilter<"RefreshToken"> | string | null
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
  }

  export type UserCreateWithoutRefreshTokensInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
  }

  export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
  }

  export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type UserUpsertWithoutRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserUpdateWithoutRefreshTokensInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
  }

  export type UserCreateWithoutChildInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChildInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChildInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChildInput, UserUncheckedCreateWithoutChildInput>
  }

  export type UserCreateWithoutVerifiedChildrenInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVerifiedChildrenInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVerifiedChildrenInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVerifiedChildrenInput, UserUncheckedCreateWithoutVerifiedChildrenInput>
  }

  export type VaccinationRecordCreateWithoutChildInput = {
    id?: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdAt?: Date | string
    wardOfVaccination: number
    createdBy: UserCreateNestedOneWithoutCreatedVaccinationRecordsInput
    administeredBy?: UserCreateNestedOneWithoutAdministeredVaccinationsInput
  }

  export type VaccinationRecordUncheckedCreateWithoutChildInput = {
    id?: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdById: number
    administeredById?: number | null
    createdAt?: Date | string
    wardOfVaccination: number
  }

  export type VaccinationRecordCreateOrConnectWithoutChildInput = {
    where: VaccinationRecordWhereUniqueInput
    create: XOR<VaccinationRecordCreateWithoutChildInput, VaccinationRecordUncheckedCreateWithoutChildInput>
  }

  export type VaccinationRecordCreateManyChildInputEnvelope = {
    data: VaccinationRecordCreateManyChildInput | VaccinationRecordCreateManyChildInput[]
    skipDuplicates?: boolean
  }

  export type NotificationLogCreateWithoutChildInput = {
    vaccineType: $Enums.VaccineType
    doseNumber: number
    sentAt?: Date | string
    type: string
  }

  export type NotificationLogUncheckedCreateWithoutChildInput = {
    id?: number
    vaccineType: $Enums.VaccineType
    doseNumber: number
    sentAt?: Date | string
    type: string
  }

  export type NotificationLogCreateOrConnectWithoutChildInput = {
    where: NotificationLogWhereUniqueInput
    create: XOR<NotificationLogCreateWithoutChildInput, NotificationLogUncheckedCreateWithoutChildInput>
  }

  export type NotificationLogCreateManyChildInputEnvelope = {
    data: NotificationLogCreateManyChildInput | NotificationLogCreateManyChildInput[]
    skipDuplicates?: boolean
  }

  export type WeightRecordCreateWithoutChildInput = {
    id?: string
    date: Date | string
    weight: number
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
    createdBy: UserCreateNestedOneWithoutCreatedWeightRecordsInput
    administeredBy?: UserCreateNestedOneWithoutAdministeredWeightRecordsInput
  }

  export type WeightRecordUncheckedCreateWithoutChildInput = {
    id?: string
    date: Date | string
    weight: number
    createdById: number
    administeredById?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
  }

  export type WeightRecordCreateOrConnectWithoutChildInput = {
    where: WeightRecordWhereUniqueInput
    create: XOR<WeightRecordCreateWithoutChildInput, WeightRecordUncheckedCreateWithoutChildInput>
  }

  export type WeightRecordCreateManyChildInputEnvelope = {
    data: WeightRecordCreateManyChildInput | WeightRecordCreateManyChildInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutChildInput = {
    update: XOR<UserUpdateWithoutChildInput, UserUncheckedUpdateWithoutChildInput>
    create: XOR<UserCreateWithoutChildInput, UserUncheckedCreateWithoutChildInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChildInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChildInput, UserUncheckedUpdateWithoutChildInput>
  }

  export type UserUpdateWithoutChildInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChildInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutVerifiedChildrenInput = {
    update: XOR<UserUpdateWithoutVerifiedChildrenInput, UserUncheckedUpdateWithoutVerifiedChildrenInput>
    create: XOR<UserCreateWithoutVerifiedChildrenInput, UserUncheckedCreateWithoutVerifiedChildrenInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVerifiedChildrenInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVerifiedChildrenInput, UserUncheckedUpdateWithoutVerifiedChildrenInput>
  }

  export type UserUpdateWithoutVerifiedChildrenInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVerifiedChildrenInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type VaccinationRecordUpsertWithWhereUniqueWithoutChildInput = {
    where: VaccinationRecordWhereUniqueInput
    update: XOR<VaccinationRecordUpdateWithoutChildInput, VaccinationRecordUncheckedUpdateWithoutChildInput>
    create: XOR<VaccinationRecordCreateWithoutChildInput, VaccinationRecordUncheckedCreateWithoutChildInput>
  }

  export type VaccinationRecordUpdateWithWhereUniqueWithoutChildInput = {
    where: VaccinationRecordWhereUniqueInput
    data: XOR<VaccinationRecordUpdateWithoutChildInput, VaccinationRecordUncheckedUpdateWithoutChildInput>
  }

  export type VaccinationRecordUpdateManyWithWhereWithoutChildInput = {
    where: VaccinationRecordScalarWhereInput
    data: XOR<VaccinationRecordUpdateManyMutationInput, VaccinationRecordUncheckedUpdateManyWithoutChildInput>
  }

  export type NotificationLogUpsertWithWhereUniqueWithoutChildInput = {
    where: NotificationLogWhereUniqueInput
    update: XOR<NotificationLogUpdateWithoutChildInput, NotificationLogUncheckedUpdateWithoutChildInput>
    create: XOR<NotificationLogCreateWithoutChildInput, NotificationLogUncheckedCreateWithoutChildInput>
  }

  export type NotificationLogUpdateWithWhereUniqueWithoutChildInput = {
    where: NotificationLogWhereUniqueInput
    data: XOR<NotificationLogUpdateWithoutChildInput, NotificationLogUncheckedUpdateWithoutChildInput>
  }

  export type NotificationLogUpdateManyWithWhereWithoutChildInput = {
    where: NotificationLogScalarWhereInput
    data: XOR<NotificationLogUpdateManyMutationInput, NotificationLogUncheckedUpdateManyWithoutChildInput>
  }

  export type NotificationLogScalarWhereInput = {
    AND?: NotificationLogScalarWhereInput | NotificationLogScalarWhereInput[]
    OR?: NotificationLogScalarWhereInput[]
    NOT?: NotificationLogScalarWhereInput | NotificationLogScalarWhereInput[]
    id?: IntFilter<"NotificationLog"> | number
    citizenId?: StringFilter<"NotificationLog"> | string
    vaccineType?: EnumVaccineTypeFilter<"NotificationLog"> | $Enums.VaccineType
    doseNumber?: IntFilter<"NotificationLog"> | number
    sentAt?: DateTimeFilter<"NotificationLog"> | Date | string
    type?: StringFilter<"NotificationLog"> | string
  }

  export type WeightRecordUpsertWithWhereUniqueWithoutChildInput = {
    where: WeightRecordWhereUniqueInput
    update: XOR<WeightRecordUpdateWithoutChildInput, WeightRecordUncheckedUpdateWithoutChildInput>
    create: XOR<WeightRecordCreateWithoutChildInput, WeightRecordUncheckedCreateWithoutChildInput>
  }

  export type WeightRecordUpdateWithWhereUniqueWithoutChildInput = {
    where: WeightRecordWhereUniqueInput
    data: XOR<WeightRecordUpdateWithoutChildInput, WeightRecordUncheckedUpdateWithoutChildInput>
  }

  export type WeightRecordUpdateManyWithWhereWithoutChildInput = {
    where: WeightRecordScalarWhereInput
    data: XOR<WeightRecordUpdateManyMutationInput, WeightRecordUncheckedUpdateManyWithoutChildInput>
  }

  export type UserCreateWithoutMotherInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMotherInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMotherInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMotherInput, UserUncheckedCreateWithoutMotherInput>
  }

  export type TDDoseCreateWithoutMotherInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    createdAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedTDDosesInput
    administeredBy: UserCreateNestedOneWithoutAdministeredTDDosesInput
  }

  export type TDDoseUncheckedCreateWithoutMotherInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    createdAt?: Date | string
    createdById: number
    administeredById: number
  }

  export type TDDoseCreateOrConnectWithoutMotherInput = {
    where: TDDoseWhereUniqueInput
    create: XOR<TDDoseCreateWithoutMotherInput, TDDoseUncheckedCreateWithoutMotherInput>
  }

  export type TDDoseCreateManyMotherInputEnvelope = {
    data: TDDoseCreateManyMotherInput | TDDoseCreateManyMotherInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutMotherInput = {
    update: XOR<UserUpdateWithoutMotherInput, UserUncheckedUpdateWithoutMotherInput>
    create: XOR<UserCreateWithoutMotherInput, UserUncheckedCreateWithoutMotherInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMotherInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMotherInput, UserUncheckedUpdateWithoutMotherInput>
  }

  export type UserUpdateWithoutMotherInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMotherInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TDDoseUpsertWithWhereUniqueWithoutMotherInput = {
    where: TDDoseWhereUniqueInput
    update: XOR<TDDoseUpdateWithoutMotherInput, TDDoseUncheckedUpdateWithoutMotherInput>
    create: XOR<TDDoseCreateWithoutMotherInput, TDDoseUncheckedCreateWithoutMotherInput>
  }

  export type TDDoseUpdateWithWhereUniqueWithoutMotherInput = {
    where: TDDoseWhereUniqueInput
    data: XOR<TDDoseUpdateWithoutMotherInput, TDDoseUncheckedUpdateWithoutMotherInput>
  }

  export type TDDoseUpdateManyWithWhereWithoutMotherInput = {
    where: TDDoseScalarWhereInput
    data: XOR<TDDoseUpdateManyMutationInput, TDDoseUncheckedUpdateManyWithoutMotherInput>
  }

  export type MotherCreateWithoutTdDosesInput = {
    id?: string
    sewaDartaNumber?: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    createdBy: UserCreateNestedOneWithoutMotherInput
  }

  export type MotherUncheckedCreateWithoutTdDosesInput = {
    id?: string
    sewaDartaNumber?: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks?: string | null
    createdAt?: Date | string
    createdById: number
    isFromOtherMunicipality?: boolean
  }

  export type MotherCreateOrConnectWithoutTdDosesInput = {
    where: MotherWhereUniqueInput
    create: XOR<MotherCreateWithoutTdDosesInput, MotherUncheckedCreateWithoutTdDosesInput>
  }

  export type UserCreateWithoutCreatedTDDosesInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedTDDosesInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedTDDosesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedTDDosesInput, UserUncheckedCreateWithoutCreatedTDDosesInput>
  }

  export type UserCreateWithoutAdministeredTDDosesInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAdministeredTDDosesInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAdministeredTDDosesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAdministeredTDDosesInput, UserUncheckedCreateWithoutAdministeredTDDosesInput>
  }

  export type MotherUpsertWithoutTdDosesInput = {
    update: XOR<MotherUpdateWithoutTdDosesInput, MotherUncheckedUpdateWithoutTdDosesInput>
    create: XOR<MotherCreateWithoutTdDosesInput, MotherUncheckedCreateWithoutTdDosesInput>
    where?: MotherWhereInput
  }

  export type MotherUpdateToOneWithWhereWithoutTdDosesInput = {
    where?: MotherWhereInput
    data: XOR<MotherUpdateWithoutTdDosesInput, MotherUncheckedUpdateWithoutTdDosesInput>
  }

  export type MotherUpdateWithoutTdDosesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: UserUpdateOneRequiredWithoutMotherNestedInput
  }

  export type MotherUncheckedUpdateWithoutTdDosesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUpsertWithoutCreatedTDDosesInput = {
    update: XOR<UserUpdateWithoutCreatedTDDosesInput, UserUncheckedUpdateWithoutCreatedTDDosesInput>
    create: XOR<UserCreateWithoutCreatedTDDosesInput, UserUncheckedCreateWithoutCreatedTDDosesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedTDDosesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedTDDosesInput, UserUncheckedUpdateWithoutCreatedTDDosesInput>
  }

  export type UserUpdateWithoutCreatedTDDosesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedTDDosesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutAdministeredTDDosesInput = {
    update: XOR<UserUpdateWithoutAdministeredTDDosesInput, UserUncheckedUpdateWithoutAdministeredTDDosesInput>
    create: XOR<UserCreateWithoutAdministeredTDDosesInput, UserUncheckedCreateWithoutAdministeredTDDosesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAdministeredTDDosesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAdministeredTDDosesInput, UserUncheckedUpdateWithoutAdministeredTDDosesInput>
  }

  export type UserUpdateWithoutAdministeredTDDosesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAdministeredTDDosesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChildCreateWithoutVaccinationsInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    createdBy: UserCreateNestedOneWithoutChildInput
    verifiedBy?: UserCreateNestedOneWithoutVerifiedChildrenInput
    NotificationLog?: NotificationLogCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateWithoutVaccinationsInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdById: number
    verifiedById?: number | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    NotificationLog?: NotificationLogUncheckedCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildCreateOrConnectWithoutVaccinationsInput = {
    where: ChildWhereUniqueInput
    create: XOR<ChildCreateWithoutVaccinationsInput, ChildUncheckedCreateWithoutVaccinationsInput>
  }

  export type UserCreateWithoutCreatedVaccinationRecordsInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedVaccinationRecordsInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedVaccinationRecordsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedVaccinationRecordsInput, UserUncheckedCreateWithoutCreatedVaccinationRecordsInput>
  }

  export type UserCreateWithoutAdministeredVaccinationsInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAdministeredVaccinationsInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAdministeredVaccinationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAdministeredVaccinationsInput, UserUncheckedCreateWithoutAdministeredVaccinationsInput>
  }

  export type ChildUpsertWithoutVaccinationsInput = {
    update: XOR<ChildUpdateWithoutVaccinationsInput, ChildUncheckedUpdateWithoutVaccinationsInput>
    create: XOR<ChildCreateWithoutVaccinationsInput, ChildUncheckedCreateWithoutVaccinationsInput>
    where?: ChildWhereInput
  }

  export type ChildUpdateToOneWithWhereWithoutVaccinationsInput = {
    where?: ChildWhereInput
    data: XOR<ChildUpdateWithoutVaccinationsInput, ChildUncheckedUpdateWithoutVaccinationsInput>
  }

  export type ChildUpdateWithoutVaccinationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: UserUpdateOneRequiredWithoutChildNestedInput
    verifiedBy?: UserUpdateOneWithoutVerifiedChildrenNestedInput
    NotificationLog?: NotificationLogUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateWithoutVaccinationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: IntFieldUpdateOperationsInput | number
    verifiedById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    NotificationLog?: NotificationLogUncheckedUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUncheckedUpdateManyWithoutChildNestedInput
  }

  export type UserUpsertWithoutCreatedVaccinationRecordsInput = {
    update: XOR<UserUpdateWithoutCreatedVaccinationRecordsInput, UserUncheckedUpdateWithoutCreatedVaccinationRecordsInput>
    create: XOR<UserCreateWithoutCreatedVaccinationRecordsInput, UserUncheckedCreateWithoutCreatedVaccinationRecordsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedVaccinationRecordsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedVaccinationRecordsInput, UserUncheckedUpdateWithoutCreatedVaccinationRecordsInput>
  }

  export type UserUpdateWithoutCreatedVaccinationRecordsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedVaccinationRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutAdministeredVaccinationsInput = {
    update: XOR<UserUpdateWithoutAdministeredVaccinationsInput, UserUncheckedUpdateWithoutAdministeredVaccinationsInput>
    create: XOR<UserCreateWithoutAdministeredVaccinationsInput, UserUncheckedCreateWithoutAdministeredVaccinationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAdministeredVaccinationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAdministeredVaccinationsInput, UserUncheckedUpdateWithoutAdministeredVaccinationsInput>
  }

  export type UserUpdateWithoutAdministeredVaccinationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAdministeredVaccinationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChildCreateWithoutNotificationLogInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    createdBy: UserCreateNestedOneWithoutChildInput
    verifiedBy?: UserCreateNestedOneWithoutVerifiedChildrenInput
    vaccinations?: VaccinationRecordCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateWithoutNotificationLogInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdById: number
    verifiedById?: number | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    vaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutChildInput
    weightRecords?: WeightRecordUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildCreateOrConnectWithoutNotificationLogInput = {
    where: ChildWhereUniqueInput
    create: XOR<ChildCreateWithoutNotificationLogInput, ChildUncheckedCreateWithoutNotificationLogInput>
  }

  export type ChildUpsertWithoutNotificationLogInput = {
    update: XOR<ChildUpdateWithoutNotificationLogInput, ChildUncheckedUpdateWithoutNotificationLogInput>
    create: XOR<ChildCreateWithoutNotificationLogInput, ChildUncheckedCreateWithoutNotificationLogInput>
    where?: ChildWhereInput
  }

  export type ChildUpdateToOneWithWhereWithoutNotificationLogInput = {
    where?: ChildWhereInput
    data: XOR<ChildUpdateWithoutNotificationLogInput, ChildUncheckedUpdateWithoutNotificationLogInput>
  }

  export type ChildUpdateWithoutNotificationLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: UserUpdateOneRequiredWithoutChildNestedInput
    verifiedBy?: UserUpdateOneWithoutVerifiedChildrenNestedInput
    vaccinations?: VaccinationRecordUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateWithoutNotificationLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: IntFieldUpdateOperationsInput | number
    verifiedById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    vaccinations?: VaccinationRecordUncheckedUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUncheckedUpdateManyWithoutChildNestedInput
  }

  export type UserCreateWithoutAuditLogsInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChildCreateWithoutWeightRecordsInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    createdBy: UserCreateNestedOneWithoutChildInput
    verifiedBy?: UserCreateNestedOneWithoutVerifiedChildrenInput
    vaccinations?: VaccinationRecordCreateNestedManyWithoutChildInput
    NotificationLog?: NotificationLogCreateNestedManyWithoutChildInput
  }

  export type ChildUncheckedCreateWithoutWeightRecordsInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdById: number
    verifiedById?: number | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
    vaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutChildInput
    NotificationLog?: NotificationLogUncheckedCreateNestedManyWithoutChildInput
  }

  export type ChildCreateOrConnectWithoutWeightRecordsInput = {
    where: ChildWhereUniqueInput
    create: XOR<ChildCreateWithoutWeightRecordsInput, ChildUncheckedCreateWithoutWeightRecordsInput>
  }

  export type UserCreateWithoutCreatedWeightRecordsInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    administeredWeightRecords?: WeightRecordCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedWeightRecordsInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    administeredWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedWeightRecordsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedWeightRecordsInput, UserUncheckedCreateWithoutCreatedWeightRecordsInput>
  }

  export type UserCreateWithoutAdministeredWeightRecordsInput = {
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildCreateNestedManyWithoutCreatedByInput
    Mother?: MotherCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordCreateNestedManyWithoutCreatedByInput
    verifiedChildren?: ChildCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAdministeredWeightRecordsInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    wardId?: number | null
    status?: $Enums.UserStatus
    Child?: ChildUncheckedCreateNestedManyWithoutCreatedByInput
    Mother?: MotherUncheckedCreateNestedManyWithoutCreatedByInput
    createdVaccinationRecords?: VaccinationRecordUncheckedCreateNestedManyWithoutCreatedByInput
    administeredVaccinations?: VaccinationRecordUncheckedCreateNestedManyWithoutAdministeredByInput
    AuditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    createdWeightRecords?: WeightRecordUncheckedCreateNestedManyWithoutCreatedByInput
    verifiedChildren?: ChildUncheckedCreateNestedManyWithoutVerifiedByInput
    createdTDDoses?: TDDoseUncheckedCreateNestedManyWithoutCreatedByInput
    administeredTDDoses?: TDDoseUncheckedCreateNestedManyWithoutAdministeredByInput
    RefreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAdministeredWeightRecordsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAdministeredWeightRecordsInput, UserUncheckedCreateWithoutAdministeredWeightRecordsInput>
  }

  export type ChildUpsertWithoutWeightRecordsInput = {
    update: XOR<ChildUpdateWithoutWeightRecordsInput, ChildUncheckedUpdateWithoutWeightRecordsInput>
    create: XOR<ChildCreateWithoutWeightRecordsInput, ChildUncheckedCreateWithoutWeightRecordsInput>
    where?: ChildWhereInput
  }

  export type ChildUpdateToOneWithWhereWithoutWeightRecordsInput = {
    where?: ChildWhereInput
    data: XOR<ChildUpdateWithoutWeightRecordsInput, ChildUncheckedUpdateWithoutWeightRecordsInput>
  }

  export type ChildUpdateWithoutWeightRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: UserUpdateOneRequiredWithoutChildNestedInput
    verifiedBy?: UserUpdateOneWithoutVerifiedChildrenNestedInput
    vaccinations?: VaccinationRecordUpdateManyWithoutChildNestedInput
    NotificationLog?: NotificationLogUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateWithoutWeightRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: IntFieldUpdateOperationsInput | number
    verifiedById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    vaccinations?: VaccinationRecordUncheckedUpdateManyWithoutChildNestedInput
    NotificationLog?: NotificationLogUncheckedUpdateManyWithoutChildNestedInput
  }

  export type UserUpsertWithoutCreatedWeightRecordsInput = {
    update: XOR<UserUpdateWithoutCreatedWeightRecordsInput, UserUncheckedUpdateWithoutCreatedWeightRecordsInput>
    create: XOR<UserCreateWithoutCreatedWeightRecordsInput, UserUncheckedCreateWithoutCreatedWeightRecordsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedWeightRecordsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedWeightRecordsInput, UserUncheckedUpdateWithoutCreatedWeightRecordsInput>
  }

  export type UserUpdateWithoutCreatedWeightRecordsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    administeredWeightRecords?: WeightRecordUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedWeightRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    administeredWeightRecords?: WeightRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutAdministeredWeightRecordsInput = {
    update: XOR<UserUpdateWithoutAdministeredWeightRecordsInput, UserUncheckedUpdateWithoutAdministeredWeightRecordsInput>
    create: XOR<UserCreateWithoutAdministeredWeightRecordsInput, UserUncheckedCreateWithoutAdministeredWeightRecordsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAdministeredWeightRecordsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAdministeredWeightRecordsInput, UserUncheckedUpdateWithoutAdministeredWeightRecordsInput>
  }

  export type UserUpdateWithoutAdministeredWeightRecordsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUpdateManyWithoutCreatedByNestedInput
    verifiedChildren?: ChildUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAdministeredWeightRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    wardId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    Child?: ChildUncheckedUpdateManyWithoutCreatedByNestedInput
    Mother?: MotherUncheckedUpdateManyWithoutCreatedByNestedInput
    createdVaccinationRecords?: VaccinationRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredVaccinations?: VaccinationRecordUncheckedUpdateManyWithoutAdministeredByNestedInput
    AuditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    createdWeightRecords?: WeightRecordUncheckedUpdateManyWithoutCreatedByNestedInput
    verifiedChildren?: ChildUncheckedUpdateManyWithoutVerifiedByNestedInput
    createdTDDoses?: TDDoseUncheckedUpdateManyWithoutCreatedByNestedInput
    administeredTDDoses?: TDDoseUncheckedUpdateManyWithoutAdministeredByNestedInput
    RefreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChildCreateManyCreatedByInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    verifiedById?: number | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
  }

  export type MotherCreateManyCreatedByInput = {
    id?: string
    sewaDartaNumber?: number
    name: string
    casteCode: number
    age: number
    phoneNumber: string
    tole: string
    wardNumber: number
    pregnancyCount: number
    previousTDTakenCount: number
    remarks?: string | null
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
  }

  export type VaccinationRecordCreateManyCreatedByInput = {
    id?: string
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    administeredById?: number | null
    createdAt?: Date | string
    wardOfVaccination: number
  }

  export type VaccinationRecordCreateManyAdministeredByInput = {
    id?: string
    citizenId: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdById: number
    createdAt?: Date | string
    wardOfVaccination: number
  }

  export type AuditLogCreateManyUserInput = {
    id?: number
    action: string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type WeightRecordCreateManyCreatedByInput = {
    id?: string
    date: Date | string
    weight: number
    childId: string
    administeredById?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
  }

  export type WeightRecordCreateManyAdministeredByInput = {
    id?: string
    date: Date | string
    weight: number
    childId: string
    createdById: number
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
  }

  export type ChildCreateManyVerifiedByInput = {
    id?: string
    sewaDartaNumber?: number
    fullName: string
    wardNumber: number
    casteCode: number
    gender: string
    parentName: string
    tole: string
    phoneNumber: string
    birthDate: Date | string
    purnaKhop?: boolean
    remarks?: string | null
    createdById: number
    createdAt?: Date | string
    isFromOtherMunicipality?: boolean
  }

  export type TDDoseCreateManyCreatedByInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    motherId: string
    createdAt?: Date | string
    administeredById: number
  }

  export type TDDoseCreateManyAdministeredByInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    motherId: string
    createdAt?: Date | string
    createdById: number
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    token: string
    device?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type ChildUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    verifiedBy?: UserUpdateOneWithoutVerifiedChildrenNestedInput
    vaccinations?: VaccinationRecordUpdateManyWithoutChildNestedInput
    NotificationLog?: NotificationLogUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    vaccinations?: VaccinationRecordUncheckedUpdateManyWithoutChildNestedInput
    NotificationLog?: NotificationLogUncheckedUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUncheckedUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MotherUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    tdDoses?: TDDoseUpdateManyWithoutMotherNestedInput
  }

  export type MotherUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    tdDoses?: TDDoseUncheckedUpdateManyWithoutMotherNestedInput
  }

  export type MotherUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    casteCode?: IntFieldUpdateOperationsInput | number
    age?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    pregnancyCount?: IntFieldUpdateOperationsInput | number
    previousTDTakenCount?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VaccinationRecordUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
    child?: ChildUpdateOneRequiredWithoutVaccinationsNestedInput
    administeredBy?: UserUpdateOneWithoutAdministeredVaccinationsNestedInput
  }

  export type VaccinationRecordUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type VaccinationRecordUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type VaccinationRecordUpdateWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
    child?: ChildUpdateOneRequiredWithoutVaccinationsNestedInput
    createdBy?: UserUpdateOneRequiredWithoutCreatedVaccinationRecordsNestedInput
  }

  export type VaccinationRecordUncheckedUpdateWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type VaccinationRecordUncheckedUpdateManyWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type AuditLogUpdateWithoutUserInput = {
    action?: StringFieldUpdateOperationsInput | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeightRecordUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
    child?: ChildUpdateOneRequiredWithoutWeightRecordsNestedInput
    administeredBy?: UserUpdateOneWithoutAdministeredWeightRecordsNestedInput
  }

  export type WeightRecordUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    childId?: StringFieldUpdateOperationsInput | string
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type WeightRecordUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    childId?: StringFieldUpdateOperationsInput | string
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type WeightRecordUpdateWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
    child?: ChildUpdateOneRequiredWithoutWeightRecordsNestedInput
    createdBy?: UserUpdateOneRequiredWithoutCreatedWeightRecordsNestedInput
  }

  export type WeightRecordUncheckedUpdateWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    childId?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type WeightRecordUncheckedUpdateManyWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    childId?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type ChildUpdateWithoutVerifiedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: UserUpdateOneRequiredWithoutChildNestedInput
    vaccinations?: VaccinationRecordUpdateManyWithoutChildNestedInput
    NotificationLog?: NotificationLogUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateWithoutVerifiedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
    vaccinations?: VaccinationRecordUncheckedUpdateManyWithoutChildNestedInput
    NotificationLog?: NotificationLogUncheckedUpdateManyWithoutChildNestedInput
    weightRecords?: WeightRecordUncheckedUpdateManyWithoutChildNestedInput
  }

  export type ChildUncheckedUpdateManyWithoutVerifiedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    sewaDartaNumber?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    wardNumber?: IntFieldUpdateOperationsInput | number
    casteCode?: IntFieldUpdateOperationsInput | number
    gender?: StringFieldUpdateOperationsInput | string
    parentName?: StringFieldUpdateOperationsInput | string
    tole?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    birthDate?: DateTimeFieldUpdateOperationsInput | Date | string
    purnaKhop?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isFromOtherMunicipality?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TDDoseUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mother?: MotherUpdateOneRequiredWithoutTdDosesNestedInput
    administeredBy?: UserUpdateOneRequiredWithoutAdministeredTDDosesNestedInput
  }

  export type TDDoseUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    motherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredById?: IntFieldUpdateOperationsInput | number
  }

  export type TDDoseUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    motherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredById?: IntFieldUpdateOperationsInput | number
  }

  export type TDDoseUpdateWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mother?: MotherUpdateOneRequiredWithoutTdDosesNestedInput
    createdBy?: UserUpdateOneRequiredWithoutCreatedTDDosesNestedInput
  }

  export type TDDoseUncheckedUpdateWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    motherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
  }

  export type TDDoseUncheckedUpdateManyWithoutAdministeredByInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    motherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    device?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    device?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    device?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaccinationRecordCreateManyChildInput = {
    id?: string
    vaccineType: $Enums.VaccineType
    doseNumber: number
    dateGiven: Date | string
    isComplete: boolean
    remarks?: string | null
    recommendedAtMonths: number
    customVaccineName?: string | null
    type?: string
    createdById: number
    administeredById?: number | null
    createdAt?: Date | string
    wardOfVaccination: number
  }

  export type NotificationLogCreateManyChildInput = {
    id?: number
    vaccineType: $Enums.VaccineType
    doseNumber: number
    sentAt?: Date | string
    type: string
  }

  export type WeightRecordCreateManyChildInput = {
    id?: string
    date: Date | string
    weight: number
    createdById: number
    administeredById?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wardOfVaccination: number
  }

  export type VaccinationRecordUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
    createdBy?: UserUpdateOneRequiredWithoutCreatedVaccinationRecordsNestedInput
    administeredBy?: UserUpdateOneWithoutAdministeredVaccinationsNestedInput
  }

  export type VaccinationRecordUncheckedUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type VaccinationRecordUncheckedUpdateManyWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    isComplete?: BoolFieldUpdateOperationsInput | boolean
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedAtMonths?: IntFieldUpdateOperationsInput | number
    customVaccineName?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type NotificationLogUpdateWithoutChildInput = {
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationLogUncheckedUpdateWithoutChildInput = {
    id?: IntFieldUpdateOperationsInput | number
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationLogUncheckedUpdateManyWithoutChildInput = {
    id?: IntFieldUpdateOperationsInput | number
    vaccineType?: EnumVaccineTypeFieldUpdateOperationsInput | $Enums.VaccineType
    doseNumber?: IntFieldUpdateOperationsInput | number
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type WeightRecordUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
    createdBy?: UserUpdateOneRequiredWithoutCreatedWeightRecordsNestedInput
    administeredBy?: UserUpdateOneWithoutAdministeredWeightRecordsNestedInput
  }

  export type WeightRecordUncheckedUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type WeightRecordUncheckedUpdateManyWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    weight?: FloatFieldUpdateOperationsInput | number
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wardOfVaccination?: IntFieldUpdateOperationsInput | number
  }

  export type TDDoseCreateManyMotherInput = {
    id?: string
    doseNumber: number
    dateGiven: Date | string
    remarks?: string | null
    createdAt?: Date | string
    createdById: number
    administeredById: number
  }

  export type TDDoseUpdateWithoutMotherInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedTDDosesNestedInput
    administeredBy?: UserUpdateOneRequiredWithoutAdministeredTDDosesNestedInput
  }

  export type TDDoseUncheckedUpdateWithoutMotherInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: IntFieldUpdateOperationsInput | number
  }

  export type TDDoseUncheckedUpdateManyWithoutMotherInput = {
    id?: StringFieldUpdateOperationsInput | string
    doseNumber?: IntFieldUpdateOperationsInput | number
    dateGiven?: DateTimeFieldUpdateOperationsInput | Date | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: IntFieldUpdateOperationsInput | number
    administeredById?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}