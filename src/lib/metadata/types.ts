/**
 * Base metadata item interface
 */
export interface MetadataItem {
  id: string;
  name: string;
}

/**
 * Person status metadata
 */
export interface PersonStatus extends MetadataItem {
  code_value: string;
  message_id: string;
  active: string;
}

/**
 * Language metadata
 */
export interface Language extends MetadataItem {
  code: string;
  name: string;
  isDefault?: boolean;
}

/**
 * Currency metadata
 */
export interface Currency extends MetadataItem {
  code: string;
  name: string;
  symbol: string;
}

/**
 * Team metadata
 */
export interface Team extends MetadataItem {
  id: string;
  name: string;
  type: string;
}

/**
 * Location metadata
 */
export interface Location extends MetadataItem {
  id: string;
  name: string;
  type: string;
}

/**
 * Complete metadata structure
 */
export interface Metadata {
  version: string;
  lastUpdated: string;
  categories: {
    personStatus: PersonStatus[];
    languages: Language[];
    currencies: Currency[];
    teams: Team[];
    locations: Location[];
  };
}

/**
 * Metadata category keys
 */
export type MetadataCategory = keyof Metadata['categories'];

/**
 * Version information for metadata categories
 */
export interface MetadataVersionInfo {
  version: string;
  lastUpdated: string;
  category: MetadataCategory;
}

export interface MetrixCodeTableRecord {
  code_name: 'METRIX_USER_TYPE' | 'PERSON_STATUS';
  code_value: string;
  message_id: string;
  active: string;
}

export interface MetrixCodeTableResponse {
  '@odata.context': string;
  value: MetrixCodeTableRecord[];
}

export interface GlobalCodeTableRecord {
  code_name: 'LOCALE_CODE' | 'POSTING_GROUP' | 'ACCESS_GROUP' | 'PERSON_GROUP' | 'ADDRESS_TYPE';
  code_value: string;
  description: string;
}

export interface GlobalCodeTableResponse {
  '@odata.context': string;
  value: GlobalCodeTableRecord[];
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface CurrencyRecord {
  currency: string;
  description: string;
}

export interface CurrencyResponse {
  '@odata.context': string;
  value: CurrencyRecord[];
}

export interface LocationRecord {
  description: string;
  location: string;
  place_id: string;
  usable: string;
}

export interface LocationResponse {
  '@odata.context': string;
  value: LocationRecord[];
}

export interface MetadataState {
  fsmLicenses: DropdownOption[];
  personStatuses: DropdownOption[];
  languages: DropdownOption[];
  requestPostGroups: DropdownOption[];
  contractPostGroups: DropdownOption[];
  accessGroups: DropdownOption[];
  personGroups: DropdownOption[];
  locations: LocationRecord[];
  addressTypes: DropdownOption[];
  currencies: DropdownOption[];
} 