export class IPaginatedResponseDTO<T, U = IBasePaginationExtras> {
  results: T[];
  extras: U;
}

export interface IBasePaginationExtras {
  total: number;
  limit?: number;
  skip?: number;
}
