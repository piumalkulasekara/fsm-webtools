'use client';

import { useState } from 'react';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DropdownExample() {
  const [customerId, setCustomerId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [locationId, setLocationId] = useState<string>('');

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Data Selection</CardTitle>
        <CardDescription>
          Select values from OData-backed dropdown lists
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="customer-select" className="text-sm font-medium">
            Customer
          </label>
          <DropdownSelect
            type="customers"
            value={customerId}
            onChange={setCustomerId}
            placeholder="Select a customer"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="product-select" className="text-sm font-medium">
            Product
          </label>
          <DropdownSelect
            type="products"
            value={productId}
            onChange={setProductId}
            placeholder="Select a product"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location-select" className="text-sm font-medium">
            Location
          </label>
          <DropdownSelect
            type="locations"
            value={locationId}
            onChange={setLocationId}
            placeholder="Select a location"
          />
        </div>

        <div className="pt-4 text-sm">
          <p><strong>Selected Values:</strong></p>
          <p>Customer ID: {customerId || 'None'}</p>
          <p>Product ID: {productId || 'None'}</p>
          <p>Location ID: {locationId || 'None'}</p>
        </div>
      </CardContent>
    </Card>
  );
} 