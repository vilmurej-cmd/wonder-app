import { useState, useEffect } from 'react';
import Purchases from 'react-native-purchases';

export function useSubscription(entitlementId: string = 'family') {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const info = await Purchases.getCustomerInfo();
        setIsSubscribed(info.entitlements.active[entitlementId] !== undefined);
      } catch (e) { console.log('RevenueCat error:', e); }
      setLoading(false);
    }
    check();
  }, []);

  return { isSubscribed, loading };
}
