import React, { useContext } from 'react';
import ConnectedDBContext, { ConnectedDBContextType } from '../contexts/ConnectedDBContext';
import ExampleQueryCard from '@/components/elements/ExampleQueryCard';
import { queryToGraph } from '@/util/GraphUtils';
import { addDBQuery } from '@/data/db-query-storage';
import { useStigContext } from '@/contexts/StigContext';
import { useNotificationContext } from '@/contexts/NotificationContext';

type ExampleQuery = {
    title: string;
    description: string;
    query: string;
}

const ExampleQueryListContainer: React.FC = () => {
    const { connectedDBProfile } = useContext(ConnectedDBContext) as ConnectedDBContextType;
    const { cyInstance } = useStigContext();
    const { addNotification } = useNotificationContext();

    const exampleQueryList: Array<ExampleQuery> = [{
        title: 'Find Attack Pattern/Tool/Malware Paths',
        description: 'Returns paths between attack-pattern, tool, and malware nodes. The query is looking for any connections between attack-pattern, tool, and malware nodes that are within two relationships of one another. This could be used, for example, in a cybersecurity context to find potential links between different attack patterns, the tools used in those patterns, and the malware associated with those tools, which could help in understanding complex cyber threat scenarios.',
        query: 'match p=(a:`attack-pattern`)-[*..2]-(t:tool)-[*..2]-(m:malware) return p'
    },
    {
        title: 'Malware Tool AttackPattern Correlation',
        description: 'This query identifies and returns the paths that correlate malware with tools and attack patterns within a range of up to two relationships. It is designed to explore the potential connections and interactions between different   malware, tool, and attack-pattern nodes, which can provide insights into the methods and sequences of cyber threats.',
        query: 'MATCH p=(m:`malware`)-[*..2]-(t:`tool`)-[*..2]-(a:`attack-pattern`) RETURN p'
    },
    {
        title: 'Vulnerability KEV Connections',
        description: 'This query returns paths that link vulnerability nodes with Known Exploited Vulnerabilities (KEV) nodes within a maximum distance of two hops. The purpose of this query is to identify potential direct or indirect associations between recorded vulnerabilities and their exploitation status, aiding in prioritizing responses and understanding the exploitation landscape.',
        query: 'MATCH p=(m:`vulnerability`)-[*..2]-(t:`kev`) RETURN p'
    }];

    const runQuery = async (query: string) => {
        console.log('Running query:', query);
        const [numVerticiesAdded, numEdgesAdded] = await queryToGraph(query, cyInstance);
        if (numVerticiesAdded < 0 && numEdgesAdded < 0) {
            addNotification("Query failed", "error");
        } else if (numVerticiesAdded === 0 && numEdgesAdded === 0) {
            addNotification("Returned " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "warning");
        } else {
            addNotification("Returned " + numVerticiesAdded + " node(s) and " + numEdgesAdded + " edge(s)", "success");
        }
        // Add the query to the query history
        addDBQuery(query);
        // Close the dialog
        // const dialogElement = document.getElementById("DBQueryModal") as HTMLDialogElement;
        // dialogElement.close();
    };

    return (
        <div className='exampleQueryListContainer flex flex-col h-full w-full'>
            <span className='flex items-center w-full h-fit mb-1'>Examples</span>
            {exampleQueryList.map((item, index) => (
                <div key={index} className={`${index === exampleQueryList.length - 1 ? 'mb-0' : 'mb-1'}`}>
                    <ExampleQueryCard
                        key={index}
                        title={item.title}
                        description={item.description}
                        query={item.query}
                        onRunQuery={runQuery}
                    />
                </div>
            ))}
        </div>
    );
};

export default ExampleQueryListContainer;
