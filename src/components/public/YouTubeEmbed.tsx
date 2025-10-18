'use client';

import React from 'react';

interface YouTubeEmbedProps {
    url: string;
}

export function YouTubeEmbed({ url }: YouTubeEmbedProps) {
    // Extract video ID from URL
    const getYouTubeId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(url);

    if (!videoId) {
        return <p className="text-red-500">Invalid YouTube URL</p>;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-border/50">
            <iframe
                src={embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
            ></iframe>
        </div>
    );
}
