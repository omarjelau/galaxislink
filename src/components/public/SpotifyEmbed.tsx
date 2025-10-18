'use client';

import React from 'react';

interface SpotifyEmbedProps {
    url: string;
}

export function SpotifyEmbed({ url }: SpotifyEmbedProps) {
    // Transform Spotify URL to embeddable format
    const embedUrl = url.replace("open.spotify.com/", "open.spotify.com/embed/");

    return (
        <div className="w-full rounded-xl overflow-hidden shadow-lg border border-border/50">
            <iframe
                src={embedUrl}
                width="100%"
                height="152"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="border-0"
            ></iframe>
        </div>
    );
}
