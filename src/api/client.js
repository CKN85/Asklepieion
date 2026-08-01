// ---------------------------------------------------------------------------
// The Asklepieion client.
//
// This exposes the same shape your pages already call —
//   client.entities.Tablet.list('-updated_date', 200)
//   client.entities.Hall.get(id)
//   client.auth.loginViaEmailPassword(email, password)
// — but talks to Supabase instead of a hosted app platform.
//
// To migrate a page, change only its import line:
//   -  import { base44 } from '@/api/base44Client';
//   +  import { client as base44 } from '@/api/client';
// ...and everything below it keeps working. (Aliasing it to `base44` means you
// don't have to touch the call sites at all. Rename later at your leisure.)
// ---------------------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Wraps one database table in the entity interface the pages expect.
 */
function entity(table) {
  return {
    /**
     * list('-updated_date', 200) → newest first, capped at 200.
     * A leading "-" means descending, matching the old client's convention.
     */
    async list(order = null, limit = null) {
      let q = supabase.from(table).select("*");
      if (order) {
        const descending = order.startsWith("-");
        q = q.order(descending ? order.slice(1) : order, {
          ascending: !descending,
        });
      }
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },

    async get(id) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },

    /** filter({ status: 'published' }) → every row matching all those columns. */
    async filter(match = {}, order = null, limit = null) {
      let q = supabase.from(table).select("*").match(match);
      if (order) {
        const descending = order.startsWith("-");
        q = q.order(descending ? order.slice(1) : order, {
          ascending: !descending,
        });
      }
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },

    async create(payload) {
      const { data, error } = await supabase
        .from(table)
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async bulkCreate(rows) {
      const { data, error } = await supabase.from(table).insert(rows).select();
      if (error) throw error;
      return data ?? [];
    },

    async update(id, payload) {
      const { data, error } = await supabase
        .from(table)
        .update({ ...payload, updated_date: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      return true;
    },
  };
}

export const client = {
  entities: {
    Hall: entity("halls"),
    Chapter: entity("chapters"),
    Tablet: entity("tablets"),
  },

  auth: {
    /** True if someone is signed in. Used by AdminRoute to gate /admin. */
    async isAuthenticated() {
      const { data } = await supabase.auth.getSession();
      return Boolean(data?.session);
    },

    async currentUser() {
      const { data } = await supabase.auth.getUser();
      return data?.user ?? null;
    },

    /** Throws on bad credentials — your login page already catches that. */
    async loginViaEmailPassword(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },

    async logout(redirectTo = "/") {
      await supabase.auth.signOut();
      // HashRouter-friendly: send them to the site root, not a server path.
      window.location.href = redirectTo === "/" ? "#/" : redirectTo;
    },
  },
};

// Convenience alias so existing imports can be switched with one word.
export const base44 = client;
export default client;
