import React from 'react';
import ExampleQueryCard from '@/components/elements/ExampleQueryCard';
import { queryToGraph } from '@/util/GraphUtils';
import { addDBQuery } from '@/data/db-query-storage';
import { useStigContext } from '@/contexts/StigContext';
import { useNotificationContext } from '@/contexts/NotificationContext';

type ExampleQuery = {
  title: string;
  description: string;
  query: string;
};

const ExampleQueryListContainer: React.FC = () => {
  const { cyInstance } = useStigContext();
  const { addNotification } = useNotificationContext();

  const exampleQueryList: Array<ExampleQuery> = [
    {
      title: 'Basic Object Match',
      description:
        'This query matches up to 50 objects of any type and returns them. Note that Neo4j keywords are not case-sensitive. However, capitalizing them can make queries clearer.',
      query: 'MATCH (x) RETURN x LIMIT 50',
    },
    {
      title: 'Match Object with Nested Dictionary',
      description: `STIG augments STIX 2.1 objects with nested dictionaries before storing it in Neo4j to make accessing those fields possible. The following query follows the pattern necessary to access a nested field. 
            This queries for an object matching the PDF File Extension Example from the STIX 2.1 Schema. See it here: 
            https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_q5ytzmajn6re:~:text=the%20PDF%20file.-,Examples,-Basic%20PDF%20file`,
      query: 'MATCH (f:file) WHERE f.`extensions.pdf-ext.document_info_dict.Title`="Sample document" RETURN f',
    },
    {
      title: 'Malware/Tool/Attack-Pattern Correlation',
      description: `This query identifies and returns the paths that correlate malware with tools and attack patterns within a range of up to two relationships. 
            It is designed to explore the potential connections and interactions between different malware, tool, and attack-pattern nodes, which can provide insights into the methods and sequences of cyber threats.`,
      query: 'MATCH p=(m:`malware`)-[*..2]-(t:`tool`)-[*..2]-(a:`attack-pattern`) RETURN p',
    },
  ];

  const runQuery = async (query: string) => {
    console.log('Running query:', query);
    const [numVerticiesAdded, numEdgesAdded] = await queryToGraph(query, cyInstance);
    if (numVerticiesAdded < 0 && numEdgesAdded < 0) {
      addNotification('Query failed', 'error');
    } else if (numVerticiesAdded === 0 && numEdgesAdded === 0) {
      addNotification('Returned ' + numVerticiesAdded + ' node(s) and ' + numEdgesAdded + ' edge(s)', 'warning');
    } else {
      addNotification('Returned ' + numVerticiesAdded + ' node(s) and ' + numEdgesAdded + ' edge(s)', 'success');
    }
    // Add the query to the query history
    addDBQuery(query);
  };

  return (
    <div className="exampleQueryListContainer flex flex-col h-full w-full">
      <span className="flex items-center w-full h-fit mb-1">Examples</span>
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
