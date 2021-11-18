/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

// import ElectronStore = require("electron-store");

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
    private store: IQueryStore;

    // private constructor() {
        
    //     fetch('/data', {
    //         method: 'GET'
    //     }).then(response => response.json())
    //     .then(data => {
    //         if (data) {
    //             this.store = data
    //         } else {
    //             this.store = {queries: []}
    //         }
    //     })
    // }

    public async getQueryHistory() {
        if (!this.store) {
            let queries = await fetch('/data?name=queryStorage', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            if (!queries.queries) {
                this.store = {queries: []}
            } else {
                this.store = queries
            }
            
        }

        console.log("<database> store: ", JSON.stringify(this.store))

        return this.store
    }
    
    private saveQueries() {
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: 'queryStorage', data: this.store})
        })
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
        return this.store.queries;
    }

    /**
     * @description Add a query to the history
     * @param {string} query
     * @memberof QueryStorageService
     */
    public add(query: string) {
        // this.store.delete(query);
        const queries = this.store.queries;
        query = query.trim();
        const index = queries.indexOf(query);
        if ( index >= 0 ) {
            queries.splice(index, 1);
        }
        queries.unshift(query);
        this.store.queries = queries;
        this.saveQueries()
    }

    /**
     * @description Removes the given query from the history
     * @param {string} query
     * @memberof QueryStorageService
     */
    public remove(query: string) {
        const queries = this.store.queries;
        const index = queries.indexOf(query);
        if (index !== undefined) {
            queries.splice(index, 1);
            this.store.queries = queries;
            this.saveQueries()
        }
    }

    public removeQueryByIndex(index: number): void {
        const queries = this.store.queries;
        if ( isNaN(index) || index < 0 || index > queries.length - 1) {
            return;
        }
        queries.splice(index, 1);
        this.store.queries = queries;
        this.saveQueries();
    }
}
