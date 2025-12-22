"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchLostItems, fetchPosts, getUserCredits, getUserSettings } from "../lib/api";
import { getOrCreateUser } from "../lib/user";

const AppDataContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [credits, setCredits] = useState(0);
  const [settings, setSettings] = useState({ username: "", theme: "dark" });
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const u = getOrCreateUser();
    setUser(u);
    return u;
  }, []);

  const loadData = useCallback(async (u) => {
    const [postsRes, lostRes, creditsRes, settingsRes] = await Promise.all([
      fetchPosts(),
      fetchLostItems(),
      u ? getUserCredits(u.uid) : Promise.resolve({ credits: 0 }),
      u ? getUserSettings(u.uid) : Promise.resolve({ username: "", theme: "dark" }),
    ]);
    setPosts(postsRes.items || []);
    setLostItems(lostRes.items || []);
    setCredits(creditsRes.credits || 0);
    setSettings(settingsRes || { username: "", theme: "dark" });
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const u = await loadUser();
        if (!active) return;
        if (u) {
          await loadData(u);
        }
      } catch (err) {
        console.error("Init error", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadData, loadUser]);

  const refreshData = useCallback(async () => {
    const u = await loadUser();
    await loadData(u);
  }, [loadUser, loadData]);

  return (
    <AppDataContext.Provider
      value={{
        user,
        posts,
        lostItems,
        credits,
        settings,
        loading,
        refreshData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return ctx;
};
