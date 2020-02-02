export type Act<T extends string, U = {}> = { type: T; userId: string } & U
