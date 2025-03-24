import { apiClient } from '../api/client';
import type { Metadata, MetadataVersionInfo, MetrixCodeTableRecord, MetrixCodeTableResponse, DropdownOption, MetadataState } from './types';

interface ODataResponse<T> {
  '@odata.context'?: string;
  value: T[];
}

interface LanguageRecord {
  code: string;
  name: string;
  isDefault: boolean;
}

interface CurrencyRecord {
  code: string;
  name: string;
  symbol: string;
}

interface TeamRecord {
  id: string;
  name: string;
  type: string;
}

interface LocationRecord {
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
  private baseUrl: string;

  private constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_ODATA_API_URL;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_ODATA_API_URL environment variable is not defined');
    }
    this.baseUrl = baseUrl;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): MetadataService {
    if (!MetadataService.instance) {
      MetadataService.instance = new MetadataService();
    }
    return MetadataService.instance;
  }

  /**
   * Fetch all metadata from the server
   */
  public async fetchAllMetadata(): Promise<Metadata> {
    const [personStatus, languages, currencies, teams, locations] = await Promise.all([
      this.fetchPersonStatus(),
      this.fetchLanguages(),
      this.fetchCurrencies(),
      this.fetchTeams(),
      this.fetchLocations()
    ]);

    const metadata: Metadata = {
      version: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      categories: {
        personStatus,
        languages,
        currencies,
        teams,
        locations
      }
    };

    return metadata;
  }

  /**
   * Fetch person status metadata
   */
  private async fetchPersonStatus() {
    const response = await apiClient.get<ODataResponse<MetrixCodeTableRecord>>('METRIX_CODE_TABLE', {
      $select: 'code_value,message_id,active',
      $filter: "code_name eq 'PERSON_STATUS'"
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
   * Fetch currency metadata
   */
  private async fetchCurrencies() {
    const response = await apiClient.get<ODataResponse<CurrencyRecord>>('CURRENCIES', {
      $select: 'code,name,symbol'
    });
    
    return response.value.map(item => ({
      id: item.code,
      name: item.name,
      code: item.code,
      symbol: item.symbol
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
    const response = await apiClient.get<ODataResponse<LocationRecord>>('LOCATIONS', {
      $select: 'id,name,type'
    });
    
    return response.value.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type
    }));
  }

  /**
   * Check if metadata needs updating
   */
  public async checkMetadataVersion(): Promise<boolean> {
    try {
      const storedVersion = localStorage.getItem(this.versionKey);
      if (!storedVersion) return true;

      const currentVersion: MetadataVersionInfo = JSON.parse(storedVersion);
      const hoursSinceUpdate = this.getHoursSinceUpdate(currentVersion.lastUpdated);
      
      // Update if more than 24 hours old
      return hoursSinceUpdate >= 24;
    } catch (error) {
      console.error('Error checking metadata version:', error);
      return true;
    }
  }

  /**
   * Save metadata to local storage
   */
  public async saveMetadata(metadata: Metadata): Promise<void> {
    try {
      localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
      localStorage.setItem(this.versionKey, JSON.stringify({
        version: metadata.version,
        lastUpdated: metadata.lastUpdated
      }));
    } catch (error) {
      console.error('Error saving metadata:', error);
      throw error;
    }
  }

  /**
   * Get metadata from local storage
   */
  public getStoredMetadata(): Metadata | null {
    try {
      const stored = localStorage.getItem(this.metadataKey);
      return stored ? JSON.parse(stored) : null;
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

  private mapToDropdownOptions(records: MetrixCodeTableRecord[], isPersonStatus: boolean): DropdownOption[] {
    return records
      .map(record => ({
        value: record.code_value,
        label: isPersonStatus ? record.message_id : record.code_value
      }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }

  public async fetchMetadata(): Promise<MetadataState> {
    const records = await this.fetchMetrixCodeTable();
    
    const fsmLicenses = this.mapToDropdownOptions(
      records.filter(record => record.code_name === 'METRIX_USER_TYPE'),
      false
    );

    const personStatuses = this.mapToDropdownOptions(
      records.filter(record => record.code_name === 'PERSON_STATUS'),
      true
    );

    return {
      fsmLicenses,
      personStatuses
    };
  }
}

export const metadataService = MetadataService.getInstance(); 