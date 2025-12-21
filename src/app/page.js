"use client";

import Hero from "../components/Hero";
import Feed from "../components/Feed";
import LostFoundFeed from "../components/LostFoundFeed";
import { useAppData } from "../components/AppProvider";
import Link from "next/link";

export default function HomePage() {
  const { posts, lostItems, loading, user } = useAppData();

  if (loading || !user) {
    return (
      <div className="loading">
        <p>{loading ? "Loading EcoSync..." : "Please log in to continue."}</p>
        {!loading && (
          <Link href="/login" className="btn primary" style={{ marginTop: 12 }}>
            Go to login
          </Link>
        )}
      </div>
    );
  }

  const recentPosts = (posts || []).slice(0, 3);
  const recentLost = (lostItems || []).slice(0, 3);

  return (
    <>
      <Hero />
      <section className="section">
        <div className="section__header">
          <h2>Recent cleanups</h2>
          <Link href="/uploads" className="btn ghost">
            See all uploads
          </Link>
        </div>
        <Feed posts={recentPosts} />
      </section>

      <section className="section">
        <div className="section__header">
          <h2>Lost &amp; Found</h2>
          <Link href="/lost-found" className="btn ghost">
            Report / view items
          </Link>
        </div>
        <LostFoundFeed items={recentLost} />
      </section>
    </>
  );
}
