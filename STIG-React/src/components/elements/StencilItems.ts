export type StencilItem = {
    id: string;
    imageUrl: string;
    alt: string;
    type: string;
};

export const stencilItems: StencilItem[] = [
    { id: 'attack-pattern', imageUrl: '/stig/stencils/sdo/attack-pattern-square-flat-300-dpi.png', alt: 'Attack Pattern', type: 'sdo' },
    { id: 'campaign', imageUrl: '/stig/stencils/sdo/campaign-square-flat-300-dpi.png', alt: 'Campaign', type: 'sdo' },
    { id: 'course-of-action', imageUrl: '/stig/stencils/sdo/coa-square-flat-300-dpi.png', alt: 'Course of Action', type: 'sdo' },
    { id: 'extension-definition', imageUrl: '/stig/stencils/sdo/20-50360_r3_ExtensionDefinitions-Square.png', alt: 'Extension Definition', type: 'sdo' },
    { id: 'grouping', imageUrl: '/stig/stencils/sdo/grouping-square-flat-300-dpi.png', alt: 'Grouping', type: 'sdo' },
    { id: 'identity', imageUrl: '/stig/stencils/sdo/identity-square-flat-300-dpi.png', alt: 'Identity', type: 'sdo' },
    { id: 'indicator', imageUrl: '/stig/stencils/sdo/indicator-square-flat-300-dpi.png', alt: 'Indicator', type: 'sdo' },
    { id: 'infrastructure', imageUrl: '/stig/stencils/sdo/infrastructure-square-flat-300-dpi.png', alt: 'Infrastructure', type: 'sdo' },
    { id: 'intrusion-set', imageUrl: '/stig/stencils/sdo/intrusion-set-square-flat-300-dpi.png', alt: 'Intrusion Set', type: 'sdo' },
    { id: 'language-content', imageUrl: '/stig/stencils/sdo/language-square-flat-300-dpi.png', alt: 'Language Content', type: 'sdo' },
    { id: 'location', imageUrl: '/stig/stencils/sdo/location-square-flat-300-dpi.png', alt: 'Location', type: 'sdo' },
    { id: 'malware', imageUrl: '/stig/stencils/sdo/malware-square-flat-300-dpi.png', alt: 'Malware', type: 'sdo' },
    { id: 'malware-analysis', imageUrl: '/stig/stencils/sdo/malware-analysis-square-flat-300-dpi.png', alt: 'Malware Analysis', type: 'sdo' },
    { id: 'marking-definition', imageUrl: '/stig/stencils/sdo/20-50360_r1_MarkingDefinition-Square.png', alt: 'Marking Definition', type: 'sdo' },
    { id: 'note', imageUrl: '/stig/stencils/sdo/note-square-flat-300-dpi.png', alt: 'Note', type: 'sdo' },
    { id: 'observed-data', imageUrl: '/stig/stencils/sdo/observed-data-square-flat-300-dpi.png', alt: 'Observed Data', type: 'sdo' },
    { id: 'opinion', imageUrl: '/stig/stencils/sdo/opinion-square-flat-300-dpi.png', alt: 'Opinion', type: 'sdo' },
    { id: 'report', imageUrl: '/stig/stencils/sdo/report-square-flat-300-dpi.png', alt: 'Report', type: 'sdo' },
    { id: 'threat-actor', imageUrl: '/stig/stencils/sdo/threat-actor-square-flat-300-dpi.png', alt: 'Threat Actor', type: 'sdo' },
    { id: 'tool', imageUrl: '/stig/stencils/sdo/tool-square-flat-300-dpi.png', alt: 'Tool', type: 'sdo' },
    { id: 'vulnerability', imageUrl: '/stig/stencils/sdo/vulnerability-square-flat-300-dpi.png', alt: 'Vulnerability', type: 'sdo' },

    { id: 'artifact', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-Artifact-Square.png', alt: 'Artifact', type: 'sco' },
    { id: 'autonomous-system', imageUrl: '/stig/stencils/sco/autonomous-system-square-flat-300-dpi.png', alt: 'Autonomous System', type: 'sco' },
    { id: 'directory', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-Directory-Square.png', alt: 'Directory', type: 'sco' },
    { id: 'domain-name', imageUrl: '/stig/stencils/sco/domain-name-square-flat-300-dpi.png', alt: 'Domain Name', type: 'sco' },
    { id: 'email-addr', imageUrl: '/stig/stencils/sco/email-addr-square-flat-300-dpi.png', alt: 'Email Address', type: 'sco' },
    { id: 'email-message', imageUrl: '/stig/stencils/sco/email-msg-square-flat-300-dpi.png', alt: 'Email Message', type: 'sco' },
    { id: 'file', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-File-Square.png', alt: 'File', type: 'sco' },
    { id: 'ipv4-addr', imageUrl: '/stig/stencils/sco/ipv4-addr-square-flat-300-dpi.png', alt: 'IPv4 Address', type: 'sco' },
    { id: 'ipv6-addr', imageUrl: '/stig/stencils/sco/ipv6-addr-square-flat-300-dpi.png', alt: 'IPv6 Address', type: 'sco' },
    { id: 'mac-addr', imageUrl: '/stig/stencils/sco/mac-addr-square-flat-300-dpi.png', alt: 'Mac Address', type: 'sco' },
    { id: 'mutex', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-Mutex-Square.png', alt: 'Mutex', type: 'sco' },
    { id: 'network-traffic', imageUrl: '/stig/stencils/sco/network-traffic-square-flat-300-dpi.png', alt: 'Network Traffic', type: 'sco' },
    { id: 'process', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-Process-Square.png', alt: 'Process', type: 'sco' },
    { id: 'software', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-Software-Square.png', alt: 'Software', type: 'sco' },
    { id: 'url', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-URL-Square.png', alt: 'URL', type: 'sco' },
    { id: 'user-account', imageUrl: '/stig/stencils/sco/user-account-square-flat-300-dpi.png', alt: 'User Account', type: 'sco' },
    { id: 'windows-registry-key', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-WindowsRegistryKey-Square.png', alt: 'Windows Registry Key', type: 'sco' },
    { id: 'x509-certificate', imageUrl: '/stig/stencils/sco/20-50360_r1_Object-X509Certificate-Square.png', alt: 'X509 Certificate', type: 'sco' },
];
