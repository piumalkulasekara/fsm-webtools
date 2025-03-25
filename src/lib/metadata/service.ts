import { apiClient } from '../api/client';
import type { Metadata, MetadataVersionInfo, MetrixCodeTableRecord, MetrixCodeTableResponse, GlobalCodeTableRecord, GlobalCodeTableResponse, DropdownOption, MetadataState, CurrencyRecord, CurrencyResponse, LocationRecord, LocationResponse } from './types';

interface ODataResponse<T> {
  '@odata.context'?: string;
  value: T[];
}

interface LanguageRecord {
  code: string;
  name: string;
  isDefault: boolean;
}

interface TeamRecord {
  id: string;
  name: string;
  type: string;
}

interface OldLocationRecord {
  id: string;
  name: string;
  type: string;
}

/**
 * Service for managing application metadata
 */
export class MetadataService {
  private static instance: MetadataService;
  private versionKey = 'metadata_version';
  private metadataKey = 'metadata_cache';

  private constructor() {}

  public static getInstance(): MetadataService {
    if (!MetadataService.instance) {
      MetadataService.instance = new MetadataService();
    }
    return MetadataService.instance;
  }

  public async fetchAllMetadata(): Promise<Metadata> {
    return {
      lastUpdated: new Date().toISOString(),
      version: "1.0",
      categories: {
        personStatus: [], // Now handled by fetchMetadata
        languages: [], // Will be implemented when the API is ready
        currencies: [], // Now handled by fetchCurrencyData
        teams: [], // Will be implemented when the API is ready
        locations: [], // Will be implemented when the API is ready
      }
    };
  }

  /**
   * Fetch person status metadata
   */
  private async fetchPersonStatus() {
    const response = await apiClient.get<ODataResponse<MetrixCodeTableRecord>>('METRIX_CODE_TABLE', {
      $select: 'code_value,message_id,active',
      $filter: "code_name eq 'PERSON_STATUS' and active eq 'Y'"
    });
    
    return response.value.map(item => ({
      id: item.code_value,
      name: item.message_id,
      code_value: item.code_value,
      message_id: item.message_id,
      active: item.active
    }));
  }

  /**
   * Fetch language metadata
   */
  private async fetchLanguages() {
    const response = await apiClient.get<ODataResponse<LanguageRecord>>('LANGUAGES', {
      $select: 'code,name,isDefault'
    });
    
    return response.value.map(item => ({
      id: item.code,
      name: item.name,
      code: item.code,
      isDefault: item.isDefault
    }));
  }

  /**
   * Fetch team metadata
   */
  private async fetchTeams() {
    const response = await apiClient.get<ODataResponse<TeamRecord>>('TEAMS', {
      $select: 'id,name,type'
    });
    
    return response.value.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type
    }));
  }

  /**
   * Fetch location metadata
   */
  private async fetchLocations() {
    const response = await apiClient.get<ODataResponse<OldLocationRecord>>('LOCATIONS', {
      $select: 'id,name,type'
    });
    
    return response.value.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type
    }));
  }

  /**
   * Check if there's a newer version of metadata available
   */
  public async checkMetadataVersion(): Promise<boolean> {
    try {
      const response = await apiClient.get<MetadataVersionInfo>('metadata/version');
      const currentVersion = localStorage.getItem(this.versionKey);
      
      if (!currentVersion || currentVersion !== response.version) {
        localStorage.setItem(this.versionKey, response.version);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking metadata version:', error);
      return false;
    }
  }

  /**
   * Save metadata to local storage
   */
  public async saveMetadata(metadata: Metadata): Promise<void> {
    try {
      localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
      localStorage.setItem(this.versionKey, metadata.version);
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  }

  /**
   * Get metadata from local storage
   */
  public getStoredMetadata(): Metadata | null {
    try {
      const data = localStorage.getItem(this.metadataKey);
      if (data) {
        return JSON.parse(data) as Metadata;
      }
      return null;
    } catch (error) {
      console.error('Error getting stored metadata:', error);
      return null;
    }
  }

  /**
   * Calculate hours since last update
   */
  private getHoursSinceUpdate(lastUpdated: string): number {
    const lastUpdate = new Date(lastUpdated).getTime();
    const now = new Date().getTime();
    return (now - lastUpdate) / (1000 * 60 * 60);
  }

  private async fetchMetrixCodeTable(): Promise<MetrixCodeTableRecord[]> {
    const response = await fetch('/api/metadata');
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    const data: MetrixCodeTableResponse = await response.json();
    return data.value;
  }

  private async fetchGlobalCodeTable(): Promise<GlobalCodeTableRecord[]> {
    const response = await fetch('/api/metadata/global');
    if (!response.ok) {
      throw new Error('Failed to fetch global metadata');
    }
    const data: GlobalCodeTableResponse = await response.json();
    return data.value;
  }

  private async fetchCurrencyData(): Promise<CurrencyRecord[]> {
    const response = await fetch('/api/metadata/currency');
    if (!response.ok) {
      throw new Error('Failed to fetch currency data');
    }
    const data: CurrencyResponse = await response.json();
    return data.value;
  }

  private async fetchLocationData(): Promise<LocationRecord[]> {
    const response = await fetch('/api/metadata/location');
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data: LocationResponse = await response.json();
    return data.value;
  }

  private mapToDropdownOptions(records: MetrixCodeTableRecord[], isPersonStatus: boolean): DropdownOption[] {
    return records
      .map(record => ({
        value: record.code_value,
        label: isPersonStatus ? record.message_id : record.code_value
      }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }

  private mapGlobalCodeToDropdownOptions(records: GlobalCodeTableRecord[], codeName: GlobalCodeTableRecord['code_name']): DropdownOption[] {
    return records
      .filter(record => record.code_name === codeName)
      .map(record => ({
        value: record.code_value,
        label: record.description
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private mapCurrencyToDropdownOptions(records: CurrencyRecord[]): DropdownOption[] {
    return records
      .map(record => ({
        value: record.currency,
        label: `${record.currency} - ${record.description}`
      }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }

  public async fetchMetadata(): Promise<MetadataState> {
    const [metrixRecords, globalRecords, currencyRecords, locationRecords] = await Promise.all([
      this.fetchMetrixCodeTable(),
      this.fetchGlobalCodeTable(),
      this.fetchCurrencyData(),
      this.fetchLocationData()
    ]);
    
    // Map Metrix Code Table records
    const fsmLicenses = this.mapToDropdownOptions(
      metrixRecords.filter(record => record.code_name === 'METRIX_USER_TYPE'),
      false
    );

    const personStatuses = this.mapToDropdownOptions(
      metrixRecords.filter(record => record.code_name === 'PERSON_STATUS'),
      true
    );

    // Map Global Code Table records
    const languages = this.mapGlobalCodeToDropdownOptions(globalRecords, 'LOCALE_CODE');
    const requestPostGroups = this.mapGlobalCodeToDropdownOptions(globalRecords, 'POSTING_GROUP');
    const contractPostGroups = this.mapGlobalCodeToDropdownOptions(globalRecords, 'POSTING_GROUP');
    const accessGroups = this.mapGlobalCodeToDropdownOptions(globalRecords, 'ACCESS_GROUP');
    const personGroups = this.mapGlobalCodeToDropdownOptions(globalRecords, 'PERSON_GROUP');
    const addressTypes = this.mapGlobalCodeToDropdownOptions(globalRecords, 'ADDRESS_TYPE');

    // Map Currency records
    const currencies = this.mapCurrencyToDropdownOptions(currencyRecords);

    return {
      fsmLicenses,
      personStatuses,
      languages,
      requestPostGroups,
      contractPostGroups,
      accessGroups,
      personGroups,
      locations: locationRecords,  // Return the raw location records
      addressTypes,
      currencies
    };
  }
}

export const metadataService = MetadataService.getInstance(); 