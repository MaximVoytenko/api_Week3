/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Objectives {
  createdAt: Generated<Timestamp | null>;
  creatorId: string | null;
  description: string | null;
  id: Generated<string>;
  isCompleted: boolean | null;
  notifyAt: Timestamp | null;
  title: string;
  updatedAt: Timestamp | null;
}

export interface UserObjectiveShares {
  id: Generated<string>;
  ObjectivesId: string | null;
  userId: string | null;
}

export interface Users {
  email: string;
  id: Generated<string>;
  name: string | null;
  password: string | null;
}

export interface DB {
  objectives: Objectives;
  "user-objective-shares": UserObjectiveShares;
  users: Users;
}
