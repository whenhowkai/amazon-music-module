const AMAZON_MUSIC = {
    id: "amazon-music",
    name: "Amazon Music",
    version: "1.0.0",

    searchTracks: async (query, limit = 25) => {
        const res = await fetch("https://amz.squid.wtf/api/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query,
                country: "US",
                content_type: "TRACK",
                limit
            })
        });

        const data = await res.json();

        const tracks = (data.trackList || []).map(item => ({
            id: item.asin,
            title: item.title,
            artist: item.primaryArtistName || item.artistName,
            album: item.album?.title || "",
            albumCover: item.album?.image || ""
        }));

        return {
            tracks,
            total: tracks.length
        };
    },

    getTrackStreamUrl: async (trackId, quality) => {
        const res = await fetch("https://amz.squid.wtf/api/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                asin: trackId,
                country: "US",
                tier: "best"
            })
        });

        const data = await res.json();

        const streamUrl = data.stream.url.startsWith("http")
            ? data.stream.url
            : "https://amz.squid.wtf" + data.stream.url;

        return {
            streamUrl,
            track: {
                id: data.metadata.asin,
                title: data.metadata.title,
                artist: data.metadata.artist,
                album: data.metadata.album,
                albumCover: data.metadata.cover
            }
        };
    }
};

return AMAZON_MUSIC;