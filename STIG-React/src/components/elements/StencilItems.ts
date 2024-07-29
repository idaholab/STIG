export type StencilItem = {
    id: string;
    imageUrl: string;
    alt: string;
    type: string;
};

export const stencilItems: StencilItem[] = [
    { id: 'attackPattern', imageUrl: '/stig-react/stencils/sdo/attack-pattern-square-flat-300-dpi.png', alt: 'Attack Pattern', type: 'sdo' },
    { id: 'campaign', imageUrl: '/stig-react/stencils/sdo/campaign-square-flat-300-dpi.png', alt: 'Campaign', type: 'sdo' },
    { id: 'courseOfAction', imageUrl: '/stig-react/stencils/sdo/coa-square-flat-300-dpi.png', alt: 'Course Of Action', type: 'sdo' },
    { id: 'extensionDefinition', imageUrl: '/stig-react/stencils/sdo/20-50360_r3_ExtensionDefinitions-Square.png', alt: 'Extension Definition', type: 'sdo' },
    { id: 'grouping', imageUrl: '/stig-react/stencils/sdo/grouping-square-flat-300-dpi.png', alt: 'Grouping', type: 'sdo' },
    { id: 'identity', imageUrl: '/stig-react/stencils/sdo/identity-square-flat-300-dpi.png', alt: 'Identity', type: 'sdo' },
    { id: 'indicator', imageUrl: '/stig-react/stencils/sdo/indicator-square-flat-300-dpi.png', alt: 'Indicator', type: 'sdo' },
    { id: 'infrastructure', imageUrl: '/stig-react/stencils/sdo/infrastructure-square-flat-300-dpi.png', alt: 'Infrastructure', type: 'sdo' },
    { id: 'intrusionSet', imageUrl: '/stig-react/stencils/sdo/intrusion-set-square-flat-300-dpi.png', alt: 'Intrusion Set', type: 'sdo' },
    { id: 'languageContent', imageUrl: '/stig-react/stencils/sdo/language-square-flat-300-dpi.png', alt: 'Language Content', type: 'sdo' },
    { id: 'location', imageUrl: '/stig-react/stencils/sdo/location-square-flat-300-dpi.png', alt: 'Location', type: 'sdo' },
    { id: 'malware', imageUrl: '/stig-react/stencils/sdo/malware-square-flat-300-dpi.png', alt: 'Malware', type: 'sdo' },
    { id: 'malwareAnalysis', imageUrl: '/stig-react/stencils/sdo/malware-analysis-square-flat-300-dpi.png', alt: 'Malware Analysis', type: 'sdo' },
    { id: 'marketingDefinition', imageUrl: '/stig-react/stencils/sdo/20-50360_r1_MarkingDefinition-Square.png', alt: 'Marketing Definition', type: 'sdo' },
    { id: 'note', imageUrl: '/stig-react/stencils/sdo/note-square-flat-300-dpi.png', alt: 'Note', type: 'sdo' },
    { id: 'observedData', imageUrl: '/stig-react/stencils/sdo/observed-data-square-flat-300-dpi.png', alt: 'Observed Data', type: 'sdo' },
    { id: 'opinion', imageUrl: '/stig-react/stencils/sdo/opinion-square-flat-300-dpi.png', alt: 'Opinion', type: 'sdo' },
    { id: 'report', imageUrl: '/stig-react/stencils/sdo/report-square-flat-300-dpi.png', alt: 'Report', type: 'sdo' },
    { id: 'threatActor', imageUrl: '/stig-react/stencils/sdo/threat-actor-square-flat-300-dpi.png', alt: 'Threat Actor', type: 'sdo' },
    { id: 'tool', imageUrl: '/stig-react/stencils/sdo/tool-square-flat-300-dpi.png', alt: 'Tool', type: 'sdo' },
    { id: 'vulnerability', imageUrl: '/stig-react/stencils/sdo/vulnerability-square-flat-300-dpi.png', alt: 'Vulnerability', type: 'sdo' },

    { id: 'artifact', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-Artifact-Square.png', alt: 'Artifact', type: 'sco' },
    { id: 'autonomousSystem', imageUrl: '/stig-react/stencils/sco/autonomous-system-square-flat-300-dpi.png', alt: 'Autonomous System', type: 'sco' },
    { id: 'directory', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-Directory-Square.png', alt: 'Directory', type: 'sco' },
    { id: 'domainName', imageUrl: '/stig-react/stencils/sco/domain-name-square-flat-300-dpi.png', alt: 'Domain Name', type: 'sco' },
    { id: 'emailAddress', imageUrl: '/stig-react/stencils/sco/email-addr-square-flat-300-dpi.png', alt: 'Email Address', type: 'sco' },
    { id: 'emailMessage', imageUrl: '/stig-react/stencils/sco/email-msg-square-flat-300-dpi.png', alt: 'Email Message', type: 'sco' },
    { id: 'file', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-File-Square.png', alt: 'File', type: 'sco' },
    { id: 'ipv4Address', imageUrl: '/stig-react/stencils/sco/ipv4-addr-square-flat-300-dpi.png', alt: 'IPv4 Address', type: 'sco' },
    { id: 'ipv6Address', imageUrl: '/stig-react/stencils/sco/ipv6-addr-square-flat-300-dpi.png', alt: 'IPv6 Address', type: 'sco' },
    { id: 'macAddress', imageUrl: '/stig-react/stencils/sco/mac-addr-square-flat-300-dpi.png', alt: 'Mac Address', type: 'sco' },
    { id: 'mutex', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-Mutex-Square.png', alt: 'Mutex', type: 'sco' },
    { id: 'networkTraffic', imageUrl: '/stig-react/stencils/sco/network-traffic-square-flat-300-dpi.png', alt: 'Network Traffic', type: 'sco' },
    { id: 'process', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-Process-Square.png', alt: 'Process', type: 'sco' },
    { id: 'software', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-Software-Square.png', alt: 'Software', type: 'sco' },
    { id: 'url', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-URL-Square.png', alt: 'URL', type: 'sco' },
    { id: 'userAccount', imageUrl: '/stig-react/stencils/sco/user-account-square-flat-300-dpi.png', alt: 'User Account', type: 'sco' },
    { id: 'windowsRegistryKey', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-WindowsRegistryKey-Square.png', alt: 'Windows Registry Key', type: 'sco' },
    { id: 'x509Certificate', imageUrl: '/stig-react/stencils/sco/20-50360_r1_Object-X509Certificate-Square.png', alt: 'X509 Certificate', type: 'sco' },
];
