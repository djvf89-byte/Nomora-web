const PLAYLIST_ID = "3s1BGzgZ91G8Tyupi5TzIo"

export function MusicPlayer() {
  return (
    <div className="overflow-hidden rounded-xl shadow-lg">
      <iframe
        title="NOMORA — playlist de la marca en Spotify"
        src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator`}
        width="100%"
        height="152"
        style={{ border: 0 }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  )
}
