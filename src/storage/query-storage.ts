/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

interface IQueryStore {
  queries: string[];
}

/**
 * @description Stores query history
 * @export
 * @class QueryStorageService
 */
export class QueryStorageService {
  private static instance: QueryStorageService;
  private readonly store: IQueryStore;

  private constructor () {
    const settingsJson = localStorage.getItem('queryStorage');
    this.store = settingsJson ? JSON.parse(settingsJson) : { queries: [] };
  }

  private saveQueries () {
    localStorage.setItem('queryStorage', JSON.stringify(this.store));
  }

  static get Instance (): QueryStorageService {
    if (QueryStorageService.instance === undefined) {
      QueryStorageService.instance = new QueryStorageService();
    }
    return QueryStorageService.instance;
  }

  /**
   * @description Returns all saved queries
   * @returns {string[]}
   * @memberof QueryStorageService
   */
  public getQueries (): string[] {
    return this.store.queries;
  }

  /**
   * @description Add a query to the history
   * @param {string} query
   * @memberof QueryStorageService
   */
  public add (query: string) {
    const queries = this.store.queries;
    query = query.trim();
    const index = queries.indexOf(query);
    if (index >= 0) {
      queries.splice(index, 1);
    }
    queries.push(query);
    this.saveQueries();
  }

  /**
   * @description Removes the given query from the history
   * @param {string} query
   * @memberof QueryStorageService
   */
  public remove (query: string) {
    const queries = this.store.queries;
    const index = queries.indexOf(query);
    if (index !== undefined) {
      queries.splice(index, 1);
      this.saveQueries();
    }
  }

  public removeQueryByIndex (index: number): void {
    const queries = this.store.queries;
    if (isNaN(index) || index < 0 || index > queries.length - 1) {
      return;
    }
    queries.splice(index, 1);
    this.saveQueries();
  }
}
