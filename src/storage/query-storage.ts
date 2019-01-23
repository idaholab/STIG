/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import ElectronStore = require("electron-store");

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
    private store: ElectronStore<IQueryStore>;

    private constructor() {
        this.store = new ElectronStore<IQueryStore>({ name: "db_queries" });
        if (!this.store.has("queries")) {
            this.store.set("queries", []);
        }
    }

    static get Instance(): QueryStorageService {
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
    public getQueries(): string[] {
        return this.store.get('queries');
    }

    /**
     * @description Add a query to the history
     * @param {string} query
     * @memberof QueryStorageService
     */
    public add(query: string) {
        // this.store.delete(query);
        const queries = this.store.get('queries', []);
        query = query.trim();
        const index = queries.indexOf(query);
        if ( index >= 0 ) {
            queries.splice(index, 1);
        }
        queries.unshift(query);
        this.store.set("queries", queries);
    }

    /**
     * @description Removes the given query from the history
     * @param {string} query
     * @memberof QueryStorageService
     */
    public remove(query: string) {
        const queries = this.store.get('queries', []);
        const index = queries.indexOf(query);
        if (index !== undefined) {
            queries.splice(index, 1);
            this.store.set("queries", queries);
        }
    }

    public removeQueryByIndex(index: number): void {
        const queries = this.store.get('queries', []);
        if ( isNaN(index) || index < 0 || index > queries.length - 1) {
            return;
        }
        queries.splice(index, 1);
        this.store.set("queries", queries);
    }
}
