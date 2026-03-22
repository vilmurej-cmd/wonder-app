import { useState } from 'react';

export function useSubscription(entitlementId: string = 'family') {
  return { isSubscribed: true, loading: false };
}
