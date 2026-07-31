import { useEffect, useState } from 'react';
import { supabase } from '@/api/client';

/**
 * Tracks the current Supabase session and keeps it live — signing in or out in
 * another tab updates every page immediately, with no refresh.
 *
 *   const { isAdmin, checking, email } = useSession();
 *
 * `checking` is true only for the first moment while the stored session is
 * read. Wait for it before fetching, or you'll fetch as a stranger and then
 * have to fetch again as yourself.
 */
export default function useSession() {
  // undefined = haven't looked yet, null = definitely signed out
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) setSession(data?.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return {
    session: session ?? null,
    checking: session === undefined,
    isAdmin: Boolean(session),
    email: session?.user?.email ?? null,
  };
}
