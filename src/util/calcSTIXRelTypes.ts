import { isRelationship } from "@/db/neo4j/isRelationship";
import { StixObject } from "@/types/stixTypes/StixObject";

const relTypes: [string, [string, string][]][] = [
    ["related-to", [["",""]]],
    ["derived-from", [["",""]]],
    ["duplicate-of", [["",""]]],
    ["analysis-of", [
      ["malware-analysis","malware"]]],
    ["attributed-to",[
      ["campaign","intrusion-set"],
      ["campaign","threat-actor"],
      ["intrusion-set","threat-actor"],
      ["threat-actor","identity"]]],
    ["authored-by",[
      ["malware","intrusion-set"],
      ["malware","threat-actor"]]],
    ["av-analysis-of",[
      ["malware-analysis","malware"]]],
    ["based-on",[
      ["indicator","observed-data"]]],
    ["beacons-to",[
      ["malware","infrastructure"]]],
    ["characterizes",[
      ["malware-analysis","malware"]]],
    ["communicates-with",[
      ["infrastructure","domain-name"],
      ["infrastructure","infrastructure"],
      ["infrastructure","ipv4-addr"],
      ["infrastructure","ipv6-addr"],
      ["infrastructure","url"],
      ["malware","domain-name"],
      ["malware","ipv4-addr"],
      ["malware","ipv6-addr"],
      ["malware","url"]]],
    ["compromises",[
      ["campaign","infrastructure"],
      ["intrusion-set","infrastructure"],
      ["threat-actor","infrastructure"]]],
    ["consists-of",[
      ["infrastructure",""]]],
    ["controls",[
      ["infrastructure","infrastructure"],
      ["infrastructure","malware"],
      ["malware","malware"],
      ["attack-pattern","malware"],
      ["infrastructure","malware"],
      ["tool","malware"]]],
    ["downloads",[
      ["malware","file"],
      ["malware","malware"],
      ["malware","tool"]]],
    ["drops",[
      ["malware"," tool"],
      ["malware","file"],
      ["malware","malware"],
      ["malware","tool"],
      ["tool","malware"]]],
    ["dynamic-analysis-of",[
      ["malware-analysis","malware"]]],
    ["exfiltrates-to",[
      ["malware","infrastructure"]]],
    ["exploits",[
      ["malware","vulnerability"]]],
    ["has",[
      ["infrastructure","vulnerability"],
      ["tool","vulnerability"]]],
    ["hosts",[
      ["infrastructure","malware"],
      ["infrastructure","tool"],
      ["intrusion-set","infrastructure"],
      ["threat-actor","infrastructure"]]],
    ["impersonates",[
      ["threat-actor","identity"]]],
    ["indicates",[
      ["indicator","intrusion-set"],
      ["indicator","attack-pattern"],
      ["indicator","campaign"],
      ["indicator","infrastructure"],
      ["indicator","malware"],
      ["indicator","threat-actor"],
      ["indicator","tool"]]],
    ["investigates",[
      ["course-of-action","indicator"]]],
    ["located-at",[
      ["identity","location"],
      ["infrastructure","location"],
      ["threat-actor","location"]]],
    ["mitigates",[
      ["course-of-action","attack-pattern"],
      ["course-of-action","indicator"],
      ["course-of-action","malware"],
      ["course-of-action","tool"],
      ["course-of-action","vulnerability"]]],
    ["originates-from",[
      ["campaign","location"],
      ["intrusion-set","location"],
      ["malware","location"]]],
    ["owns",[
      ["intrusion-set","infrastructure"],
      ["threat-actor","infrastructure"]]],
    ["remediates",[
      ["course-of-action","malware"],
      ["course-of-action","vulnerability"]]],
    ["static-analysis-of",[
      ["malware-analysis","malware"]]],
    ["targets",[
      ["attack-pattern","identity"],
      ["attack-pattern","location"],
      ["attack-pattern","vulnerability"],
      ["campaign","identity"],
      ["campaign","location"],
      ["campaign","vulnerability"],
      ["intrusion-set","identity"],
      ["intrusion-set","location"],
      ["intrusion-set","vulnerability"],
      ["malware","identity"],
      ["malware","infrastructure"],
      ["malware","location"],
      ["malware","vulnerability"],
      ["threat-actor"," location"],
      ["threat-actor","identity"],
      ["threat-actor","vulnerability"],
      ["tool"," vulnerability"],
      ["tool","identity"],
      ["tool","infrastructure"],
      ["tool","location"],
      ["tool","vulnerability"]]],
    ["uses",[
      ["tool","malware"],
      ["tool","infrastructure"],
      ["attack-pattern","malware"],
      ["attack-pattern","tool"],
      ["campaign","attack-pattern"],
      ["campaign","infrastructure"],
      ["campaign","malware"],
      ["campaign","tool"],
      ["infrastructure","infrastructure"],
      ["intrusion-set","attack-pattern"],
      ["intrusion-set","infrastructure"],
      ["intrusion-set","malware"],
      ["intrusion-set","tool"],
      ["malware","attack-pattern"],
      ["malware","infrastructure"],
      ["malware","malware"],
      ["malware","tool"],
      ["threat-actor","attack-pattern"],
      ["threat-actor","infrastructure"],
      ["threat-actor","malware"],
      ["threat-actor","tool"],
      ["tool","infrastructure"]]],
    ["variant-of",[
      ["malware","malware"]]],
  ];
  
  export function calcRelTypes(stix?: StixObject) {
    if (!stix || !isRelationship(stix)) return [];
    const { source_ref, target_ref } = stix;
    return relTypes.flatMap(
      ([rel, pairs]) => pairs.some(
        ([src,trg]) => source_ref.startsWith(src) && target_ref.startsWith(trg)
      ) ? [rel] : []
    );
  } 