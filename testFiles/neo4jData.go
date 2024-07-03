package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
)

// parsing JSON data
type ThreatActor struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Aliases     []string `json:"aliases"`
	Targets     []string `json:"targets"`
	Country     string   `json:"country"`
}

type Relationship struct {
	SourceRef        string `json:"source_ref"`
	TargetRef        string `json:"target_ref"`
	RelationshipType string `json:"relationship_type"`
}

func main() {
	// Prompt user for number of nodes
	var numNodes int
	fmt.Print("Enter the number of nodes (Threat Actors) to create: ")
	_, err := fmt.Scanln(&numNodes)
	if err != nil {
		log.Fatalf("Error reading number of nodes: %v", err)
	}

	// Generate STIX data with specified number of nodes
	stixData := generateSTIXData(numNodes)

	// Unpack JSON data
	var data map[string][]map[string]interface{}
	if err := json.Unmarshal([]byte(stixData), &data); err != nil {
		log.Fatalf("Error decoding STIX data: %v", err)
	}

	// Neo4j connection
	uri := "neo4j://localhost:7687"
	username := "neo4j"
	password := "toor"

	// Create Neo4j driver
	driver, err := neo4j.NewDriver(uri, neo4j.BasicAuth(username, password, ""))
	if err != nil {
		log.Fatalf("Failed to create Neo4j driver: %v", err)
	}
	defer driver.Close()

	// Create Neo4j session
	session := driver.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer session.Close()

	// Begin transaction
	tx, err := session.BeginTransaction()
	if err != nil {
		log.Fatalf("Failed to begin transaction: %v", err)
	}
	defer func() {
		if err := tx.Rollback(); err != nil {
			log.Println("Failed to rollback transaction: ", err)
		}
	}()

	// Process Threat Actors
	threatActors := data["threat_actors"]
	for _, actorData := range threatActors {
		actor := actorData

		//nodes for Threat Actors
		cypherQuery := `
			MERGE (a:ThreatActor {id: $id})
			SET a.name = $name,
				a.description = $description,
				a.aliases = $aliases,
				a.targets = $targets,
				a.country = $country
		`

		// Execute Cypher query for nodes
		_, err := tx.Run(cypherQuery, map[string]interface{}{
			"id":          actor["id"].(string),
			"name":        actor["name"].(string),
			"description": actor["description"].(string),
			"aliases":     actor["aliases"].([]interface{}),
			"targets":     actor["targets"].([]interface{}),
			"country":     actor["country"].(string),
		})
		if err != nil {
			log.Fatalf("Error running Cypher query for Threat Actor: %v", err)
		}
	}

	// Process Relationships
	relationships := data["relationships"]
	for _, relData := range relationships {
		rel := relData

		// query to create relationships using relationship_type
		cypherQuery := `
			MATCH (source:ThreatActor {id: $sourceRef})
			MATCH (target:ThreatActor {id: $targetRef})
			MERGE (source)-[:RELATIONSHIP {type: $relationshipType}]->(target)
		`

		// Execute query for each Relationship
		_, err := tx.Run(cypherQuery, map[string]interface{}{
			"sourceRef":        rel["source_ref"].(string),
			"targetRef":        rel["target_ref"].(string),
			"relationshipType": rel["relationship_type"].(string), // Use relationship_type from STIX data
		})
		if err != nil {
			log.Fatalf("Error running Cypher query for Relationship: %v", err)
		}
	}

	// Commit transaction
	err = tx.Commit()
	if err != nil {
		log.Fatalf("Error committing transaction: %v", err)
	}

	fmt.Println("STIX data uploaded successfully to Neo4j!")
}

// generate sample STIX data
func generateSTIXData(numNodes int) string {
	rand.Seed(time.Now().UnixNano())

	var threatActors []map[string]interface{}
	var relationships []map[string]interface{}

	// Use user input to generate specified number of Threat Actors
	for i := 1; i <= numNodes; i++ {
		threatActor := map[string]interface{}{
			"id":          fmt.Sprintf("threat-actor-%d", i),
			"name":        fmt.Sprintf("APT%d", i),
			"description": fmt.Sprintf("Description of APT%d", i),
			"aliases":     []string{fmt.Sprintf("Alias%d-1", i), fmt.Sprintf("Alias%d-2", i)},
			"targets":     []string{"Technology companies", "Government agencies"},
			"country":     randomCountry(),
		}
		threatActors = append(threatActors, threatActor)
	}

	// Generate random relationships between Threat Actors
	for i := 0; i < len(threatActors)-1; i++ {
		// Select relationship type
		relationshipTypes := []string{"relates-to", "connected-to", "linked-with"}
		relationshipType := relationshipTypes[rand.Intn(len(relationshipTypes))]

		relationship := map[string]interface{}{
			"source_ref":         threatActors[i]["id"].(string),
			"target_ref":         threatActors[i+1]["id"].(string),
			"relationship_type":  relationshipType,
			"relationship_label": fmt.Sprintf("%s-%s", threatActors[i]["id"].(string), threatActors[i+1]["id"].(string)), // Unique label for each relationship
		}
		relationships = append(relationships, relationship)
	}

	// Construct STIX
	stixData := map[string]interface{}{
		"threat_actors": threatActors,
		"relationships": relationships,
	}

	// Convert to JSON
	stixJSON, err := json.MarshalIndent(stixData, "", "  ")
	if err != nil {
		log.Fatalf("Error marshalling STIX data: %v", err)
	}

	return string(stixJSON)
}

// Function to generate a random country for nodes
func randomCountry() string {
	countries := []string{"China", "Russia", "USA", "Iran", "North Korea", "UK", "Germany", "France", "Israel"}
	return countries[rand.Intn(len(countries))]
}
